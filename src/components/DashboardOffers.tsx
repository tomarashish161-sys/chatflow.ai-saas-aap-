import React, { useState } from 'react';
import { Tag, Check, ArrowRight, Zap, Star, Clock, Loader2 } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';

interface DashboardOffersProps {
  currentPlan: 'free' | 'pro' | 'enterprise';
  onNavigate: (tab: string) => void;
}

const DEFAULT_BOT_DATA = {
  name: 'Support Assistant',
  persona: 'You are a friendly, concise, and helpful support agent for a SaaS company. You always try to answer the user\'s question directly using the provided knowledge base.',
  color: '#2563EB',
  position: 'right',
  greeting: 'Hi there! 👋 How can I help you today?',
};

export default function DashboardOffers({ currentPlan, onNavigate }: DashboardOffersProps) {
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpgrade = async (planType: 'pro' | 'enterprise') => {
    if (!auth.currentUser) return;
    setUpgrading(planType);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planType,
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email
        }),
      });

      const session = await response.json();

      if (session.simulated) {
        // Fallback for Demo Mode (if Stripe isn't configured)
        console.log("Simulation Mode: Upgrading locally for demo.");
        const q = query(collection(db, 'bots'), where('userId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          await updateDoc(doc(db, 'bots', snapshot.docs[0].id), {
            plan: planType,
            updatedAt: Date.now()
          });
        }
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onNavigate('overview');
        }, 2000);
      } else if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      console.error("Upgrade error:", err);
      alert('Payment failed to initialize: ' + err.message);
    } finally {
      setUpgrading(null);
    }
  };

  const offers = [
    {
      id: 'pro',
      title: 'Annual Professional',
      discount: '40% OFF',
      price: '$29',
      originalPrice: '$49',
      period: '/mo',
      features: ['Unlimited conversations', 'Priority Gemini Pro access', 'Remove "Powered by" branding', 'Pro Conversion Metrics'],
      badge: 'Best Value',
      color: 'blue'
    },
    {
      id: 'enterprise',
      title: 'Enterprise Growth',
      discount: 'SAVE $500',
      price: '$149',
      originalPrice: '$199',
      period: '/mo',
      features: ['Dedicated infrastructure', 'AI Reasoning Tier Selector', 'Dedicated Support Team', 'Global API Access'],
      badge: 'Scale Up',
      color: 'indigo'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 both pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 mb-2 tracking-[-0.5px]">Exclusive Upgrade Offers</h2>
          <p className="text-slate-500 text-[15px]">
            {currentPlan === 'free' 
              ? <>You have <span className="text-blue-600 font-bold">14 days</span> remaining in your trial. Upgrade now to lock in these special rates.</>
              : `You are currently enjoying the ${currentPlan.toUpperCase()} plan. Upgrade further for even more scale.`}
          </p>
        </div>
        {currentPlan === 'free' && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 shadow-sm animate-pulse">
            <Clock size={16} />
            <span className="text-[13px] font-bold">Limited Time: 48h Left</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {offers.map((offer, idx) => (
          <div key={idx} className={`bg-white rounded-[32px] border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col transition-all duration-500 group ${currentPlan === offer.id ? 'ring-4 ring-blue-600 ring-offset-4' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
            <div className={`p-8 bg-gradient-to-br transition-all duration-500 ${offer.color === 'blue' ? 'from-blue-600 to-blue-700' : 'from-indigo-600 to-indigo-700'} text-white relative`}>
              {showSuccess && upgrading === null && currentPlan === offer.id && (
                <div className="absolute inset-0 bg-emerald-500 flex items-center justify-center z-20 animate-in fade-in duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check size={32} className="text-white" />
                    </div>
                    <div className="font-bold text-[18px]">Upgrade Successful!</div>
                  </div>
                </div>
              )}
              <div className="absolute top-6 right-8 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                {currentPlan === offer.id ? 'Your Plan' : offer.badge}
              </div>
              <h3 className="text-[20px] font-bold mb-1">{offer.title}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[36px] font-extrabold">{offer.price}</span>
                <span className="text-[16px] opacity-70 line-through font-medium">{offer.originalPrice}</span>
                <span className="text-[14px] opacity-80">{offer.period}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl text-[14px] font-bold shadow-lg">
                <Tag size={16} className="text-blue-600" />
                {currentPlan === offer.id ? 'Standard Price' : `${offer.discount} Applied`}
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                {offer.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-[14px] text-slate-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleUpgrade(offer.id as 'pro' | 'enterprise')}
                disabled={currentPlan === offer.id || (currentPlan === 'enterprise' && offer.id === 'pro') || upgrading !== null}
                className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 shadow-xl group-hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:shadow-none ${currentPlan === offer.id ? 'bg-emerald-500 text-white cursor-default' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
              >
                {upgrading === offer.id ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : currentPlan === offer.id ? (
                  <><Check size={18} /> Current Plan</>
                ) : (currentPlan === 'enterprise' && offer.id === 'pro') ? (
                  'Included in Enterprise'
                ) : (
                  <>Claim This Offer <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[28px] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Zap size={200} strokeWidth={1} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-[13px] uppercase tracking-widest mb-4">
            <Star size={16} fill="currentColor" /> Premium Partner
          </div>
          <h3 className="text-[24px] md:text-[32px] font-extrabold mb-4 tracking-[-0.5px]">Need a Custom Solution?</h3>
          <p className="text-slate-400 text-[16px] mb-8 leading-relaxed">
            Our sales team can build a tailored package for high-volume enterprises, including on-premise deployment and dedicated engineering support.
          </p>
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[15px] font-bold transition-all flex items-center gap-2">
            Speak to Sales
          </button>
        </div>
      </div>
    </div>
  );
}
