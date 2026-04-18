import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setStatus('idle');
      setError('');
    };
    window.addEventListener('openSignupModal', handleOpen);
    return () => window.removeEventListener('openSignupModal', handleOpen);
  }, []);

  const syncUserToFirestore = async (user: any) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      // Logic for demo accounts
      let initialPlan: 'free' | 'pro' | 'enterprise' = 'free';
      if (user.email === 'pro@chatflow.ai') initialPlan = 'pro';
      if (user.email === 'enterprise@chatflow.ai') initialPlan = 'enterprise';

      await setDoc(userDocRef, {
        email: user.email,
        createdAt: Date.now(),
        plan: initialPlan
      });

      // Also create a bot for them with the same plan
      const botId = `bot-${user.uid}`;
      await setDoc(doc(db, 'bots', botId), {
        userId: user.uid,
        name: `${initialPlan.charAt(0).toUpperCase() + initialPlan.slice(1)} Assistant`,
        persona: 'You are a professional assistant configured for the ' + initialPlan + ' tier.',
        color: initialPlan === 'enterprise' ? '#4338ca' : '#2563eb',
        position: 'right',
        greeting: 'Welcome! How can I help you today?',
        createdAt: Date.now(),
        plan: initialPlan
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setStatus('loading');
      setError('');
      
      let userCredential;
      if (mode === 'signup') {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      await syncUserToFirestore(userCredential.user);
      
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setStatus('idle');
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('EMAIL LOGIN DISABLED: Please enable "Email/Password" in your Firebase Console under Authentication > Sign-in method.');
      } else {
        setError(`Auth Error: ${err.message || 'Check Firebase Console settings.'}`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setStatus('loading');
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserToFirestore(result.user);
      
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setStatus('idle');
      if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked by browser. Please allow popups for this site.');
      } else {
        setError('An error occurred during sign in. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => { if (status !== 'loading') setIsOpen(false) }}
      ></div>
      
      <div className="relative bg-white rounded-[32px] border border-slate-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] w-full max-w-[440px] p-8 sm:p-10 z-10 animate-in fade-in zoom-in-95 duration-300 overflow-y-auto max-h-[95vh]">
        {status !== 'loading' && (
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-all hover:scale-110"
          >
            <X size={24} />
          </button>
        )}

        {status === 'idle' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-[28px] font-extrabold text-slate-900 mb-2 tracking-[-0.5px]">
              {mode === 'login' ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-[15px] text-slate-500 mb-8 leading-relaxed">
              {mode === 'login' ? 'Sign in to manage your AI chatbots.' : 'Create an account to build your first AI chatbot.'}
            </p>
            
            {error && (
              <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[15px] font-bold transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
            
            <div className="relative flex items-center gap-4 py-4">
               <div className="h-[1px] bg-slate-100 flex-1"></div>
               <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">or continue with</span>
               <div className="h-[1px] bg-slate-100 flex-1"></div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-[14px] font-bold transition-all active:scale-[0.99]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google Account
            </button>

            <p className="text-center text-[14px] text-slate-500 mt-8">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-blue-600 font-bold hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        )}

        {status === 'loading' && (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mx-auto mb-8">
               <div className="absolute inset-0 rounded-full border-4 border-blue-50 animate-pulse"></div>
               <Loader2 size={80} className="animate-spin text-blue-600 relative z-10" />
            </div>
            <h2 className="text-[22px] font-extrabold text-slate-900 mb-2">Authenticating...</h2>
            <p className="text-[15px] text-slate-500">Please wait a moment</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-100/50">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-[28px] font-extrabold text-slate-900 mb-3 tracking-[-0.5px]">Success!</h2>
            <p className="text-[16px] text-slate-500 leading-relaxed">
              {mode === 'login' ? 'Welcome back! Redirecting you now...' : 'Your account is ready. Redirecting now...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
