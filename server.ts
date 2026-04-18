import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import * as cheerio from 'cheerio';
import path from 'path';
import Stripe from 'stripe';
import admin from 'firebase-admin';

// Lazy initialization for Stripe
let stripeInstance: Stripe | null = null;
function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is missing');
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

// Lazy initialization for Firebase Admin
let adminDb: admin.firestore.Firestore | null = null;
function getAdminDb() {
  if (!adminDb) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
      }
      adminDb = admin.firestore();
    } else {
      throw new Error('Firebase Admin credentials missing');
    }
  }
  return adminDb;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  
  // Middleware to handle raw body for Stripe webhooks and JSON for others
  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Stripe Checkout Session
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { plan, userId, userEmail } = req.body;
      
      // Check if Stripe is configured
      const secretKey = process.env.STRIPE_SECRET_KEY;
      
      if (!secretKey || secretKey === 'MY_STRIPE_SECRET_KEY') {
        console.log("Stripe not configured. Using simulation mode.");
        // Simulate a success URL that will trigger a mock fulfillment (or just redirect back)
        // In a real app, you'd want the user to go through Stripe, but for this environment's preview,
        // we can provide a simulation link if they haven't set up secrets yet.
        return res.json({ 
          url: `${process.env.APP_URL || 'http://localhost:3000'}/?success=true&simualted_plan=${plan}`,
          simulated: true 
        });
      }

      const stripe = getStripe();
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${plan.toUpperCase()} Plan - ChatFlow AI`,
                description: `Complete your upgrade to the ${plan} tier.`,
              },
              unit_amount: plan === 'pro' ? 2900 : 14900,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?success=true&plan=${plan}`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/?cancelled=true`,
        customer_email: userEmail,
        metadata: {
          userId,
          plan
        }
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe Session Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook handler
  app.post('/api/webhook', async (req: any, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      return res.status(400).send('Webhook Secret missing');
    }

    let event;

    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook construction failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const { userId, plan } = session.metadata;

      try {
        const db = getAdminDb();
        const botsRef = db.collection('bots');
        const q = await botsRef.where('userId', '==', userId).limit(1).get();
        
        if (!q.empty) {
          await q.docs[0].ref.update({
            plan,
            updatedAt: Date.now()
          });
        }
      } catch (error) {
        console.error("Webhook Firestore Update Error:", error);
      }
    }

    res.json({ received: true });
  });

  // Mock fulfillment for Demo Mode (Self-correction for missing keys)
  app.post('/api/simulate-fulfillment', async (req, res) => {
     const { userId, plan } = req.body;
     try {
       // Since we don't have Admin keys configured by default in many dev runs,
       // we'll advise the user to set them up, but we can't do much on server-side 
       // without the keys. The client will handle UI-side "pretend" success if simulated.
       res.json({ status: 'simulation_logged' });
     } catch (e) {
       res.status(500).send('Fulfillment failed');
     }
  });

  // API 1: Scrape URL for Training Data
  app.post('/api/scrape', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: 'URL is required' });

      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      $('script, style, nav, footer, header, noscript, svg, img').remove();
      const text = $('body').text().replace(/\s+/g, ' ').trim();
      
      res.json({ text: text.substring(0, 50000) });
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: 'Failed to scrape URL' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
