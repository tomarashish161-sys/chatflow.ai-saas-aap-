import React, { useState, useEffect } from 'react';
import { Bot, Palette, Code, Save, Loader2, Check, Cpu } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const COLORS = [
  '#2563EB', // Blue
  '#7C3AED', // Violet
  '#059669', // Emerald
  '#0F172A', // Slate
  '#DB2777'  // Pink
];

interface DashboardSettingsProps {
  plan?: 'free' | 'pro' | 'enterprise';
}

export default function DashboardSettings({ plan = 'free' }: DashboardSettingsProps) {
  const [botId, setBotId] = useState<string | null>(null);
  const [name, setName] = useState('Support Assistant');
  const [persona, setPersona] = useState('You are a friendly, concise, and helpful support agent for a SaaS company. You always try to answer the user\'s question directly using the provided knowledge base.');
  const [color, setColor] = useState('#2563EB');
  const [position, setPosition] = useState('right');
  const [greeting, setGreeting] = useState('Hi there! 👋 How can I help you today?');
  
  // Tier specific features
  const [removeBranding, setRemoveBranding] = useState(false);
  const [modelTier, setModelTier] = useState('standard'); // standard, high-reasoning, turbo
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const currentUser = auth.currentUser;

  const codeSnippet = `<script src="${window.location.origin}/widget.js"></script>
<script>
  window.ChatFlow.init({
    token: "${currentUser?.uid || 'bot_token_placeholder'}",
    theme: "light",
    branding: ${!removeBranding}
  });
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTestBot = () => {
    // Dispatch event to show FloatingChat with current settings
    window.dispatchEvent(new CustomEvent('testBotConfig', { 
      detail: { name, color, persona, greeting, removeBranding, modelTier } 
    }));
  };

  useEffect(() => {
    async function loadBotSettings() {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'bots'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const botDoc = snapshot.docs[0];
          const data = botDoc.data();
          setBotId(botDoc.id);
          setName(data.name || name);
          setPersona(data.persona || persona);
          setColor(data.color || color);
          setPosition(data.position || position);
          setGreeting(data.greeting || greeting);
          setRemoveBranding(data.removeBranding || false);
          setModelTier(data.modelTier || 'standard');
        }
      } catch (err) {
        console.error("Error loading bot config:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBotSettings();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const data = {
        userId: currentUser.uid,
        name,
        persona,
        color,
        position,
        greeting,
        removeBranding,
        modelTier
      };

      if (botId) {
        // Update existing bot (respects existing plan)
        await updateDoc(doc(db, 'bots', botId), data);
      } else {
        // Create new bot with free plan
        const docRef = await addDoc(collection(db, 'bots'), {
          ...data,
          plan: 'free',
          createdAt: Date.now()
        });
        setBotId(docRef.id);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving bot config:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 both pb-12">
      <div>
        <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 mb-2 tracking-[-0.5px]">Bot Settings</h2>
        <p className="text-slate-500 text-[15px]">Configure your bot's behavior, appearance, and integration settings.</p>
      </div>

      {/* Identity Card */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 md:p-8 flex items-start gap-4 border-b border-slate-100">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">Bot Identity</h3>
            <p className="text-[14px] text-slate-500 leading-relaxed">Give your AI bot a name, avatar, and core system directive (Persona).</p>
          </div>
        </div>
        <div className="p-6 md:p-8 space-y-6 bg-slate-50/50">
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-2">Bot Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full max-w-sm px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-600 shadow-sm" 
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-2">Base Prompt (Persona definition)</label>
            <textarea 
              rows={4}
              value={persona}
              onChange={e => setPersona(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-600 shadow-sm leading-relaxed text-slate-700" 
            />
          </div>
        </div>
      </div>

      {/* Appearance Card */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 md:p-8 flex items-start gap-4 border-b border-slate-100">
          <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Palette size={24} />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">Appearance & Branding</h3>
            <p className="text-[14px] text-slate-500 leading-relaxed">Customize the chat widget colors and white-label settings.</p>
          </div>
        </div>
        <div className="p-6 md:p-8 space-y-8 bg-slate-50/50">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <label className="block text-[13px] font-bold text-slate-700 mb-4">Primary Brand Color</label>
              <div className="flex gap-4 items-center">
                {COLORS.map(c => (
                  <div 
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full shadow-sm border border-black/10 cursor-pointer ${color === c ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[13px] font-bold text-slate-700 mb-3">Widget Position</label>
              <div className="flex gap-3">
                 <button 
                  onClick={() => setPosition('left')}
                  className={`flex-1 py-2.5 border-2 rounded-xl text-[14px] font-semibold transition-colors ${position === 'left' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >Left</button>
                 <button 
                  onClick={() => setPosition('right')}
                  className={`flex-1 py-2.5 border-2 rounded-xl text-[14px] font-semibold transition-colors ${position === 'right' ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                 >Right</button>
              </div>
            </div>
          </div>

          {/* Premium Branding Toggle */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                Remove "Powered by ChatFlow"
                {plan === 'free' && <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Pro Feature</span>}
              </div>
              <p className="text-[12px] text-slate-500">Completely remove our branding from your widget.</p>
            </div>
            <button 
              disabled={plan === 'free'}
              onClick={() => setRemoveBranding(!removeBranding)}
              className={`w-12 h-6 rounded-full transition-all relative ${removeBranding ? 'bg-blue-600' : 'bg-slate-200'} ${plan === 'free' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${removeBranding ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise AI Configuration */}
      {plan === 'enterprise' && (
        <div className="bg-indigo-950 rounded-[24px] border border-indigo-900 shadow-xl overflow-hidden animate-in zoom-in-95 duration-700">
          <div className="p-6 md:p-8 flex items-start gap-4 border-b border-indigo-900/50">
            <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-white mb-1">Advanced Engine Settings</h3>
              <p className="text-[14px] text-indigo-300 leading-relaxed">Exclusive Enterprise control over AI reasoning models and compute frequency.</p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-6 bg-indigo-900/20">
             <div>
                <label className="block text-[13px] font-bold text-indigo-300 mb-3">AI Reasoning Engine</label>
                <div className="grid sm:grid-cols-3 gap-3">
                   {['standard', 'high-reasoning', 'turbo'].map(tier => (
                     <button
                        key={tier}
                        onClick={() => setModelTier(tier)}
                        className={`px-4 py-3 rounded-xl text-[13px] font-bold border transition-all ${modelTier === tier ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg' : 'bg-indigo-900/30 border-indigo-800 text-indigo-400 hover:border-indigo-600'}`}
                     >
                        {tier.replace('-', ' ').toUpperCase()}
                     </button>
                   ))}
                </div>
                <p className="text-[11px] text-indigo-500 mt-3 italic">High-reasoning provides 2x better context extraction but 150ms higher latency.</p>
             </div>
          </div>
        </div>
      )}

      {/* Installation Snippet */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 md:p-8 flex items-start gap-4 border-b border-slate-100">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Code size={24} />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-1">Installation Code</h3>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-slate-50/50">
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Production Snippet</span>
              <button onClick={handleCopy} className="text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10">
                 {isCopied ? 'Copied!' : 'Copy Snippet'}
              </button>
            </div>
            <pre className="text-blue-300 p-6 text-[13px] font-mono leading-relaxed overflow-x-auto">
{codeSnippet}
            </pre>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 pb-12">
        <button onClick={handleSave} disabled={isSaving} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[15px] font-bold transition-all shadow-xl shadow-blue-200 disabled:opacity-70">
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
