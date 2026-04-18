import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { db, auth } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [botConfig, setBotConfig] = useState({
    name: 'ChatFlow Demo',
    color: '#2563EB',
    persona: "You are ChatFlow AI, a smart assistant. ChatFlow is a customer service SaaS platform that lets businesses embed custom AI widgets on their site, scrape URLs for knowledge, and manage settings via a clean dashboard.",
    knowledgeBase: "ChatFlow Features: Real-time Firebase sync, Live Website Scraping, Gemini AI integration, Sleek customizable widget, Dashboard Inbox for operators.",
    plan: 'free'
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setMessages([{ role: 'bot', text: `Hi there! I am ${botConfig.name}. Ask me anything about ChatFlow!` }]);
      return;
    }

    // Listen to bot settings for plan changes
    const q = query(collection(db, 'bots'), where('userId', '==', currentUser.uid));
    const unsubscribeBot = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setBotConfig(prev => ({
          ...prev,
          ...data,
          plan: data.plan || 'free'
        }));
        
        if (messages.length === 0) {
          setMessages([{ role: 'bot', text: data.greeting || `Hi there! 👋 How can I help you today?` }]);
        }
      } else {
        setMessages([{ role: 'bot', text: `Hi there! I am ${botConfig.name}. Ask me anything about ChatFlow!` }]);
      }
    });

    const handleToggle = () => setIsOpen(prev => !prev);
    const handleTestBot = (e: any) => {
      const config = e.detail;
      setBotConfig(prev => ({ ...prev, ...config }));
      setIsOpen(true);
      setMessages([{ role: 'bot', text: config.greeting || `Hi there! I am ${config.name}.` }]);
    };

    window.addEventListener('openLiveDemo', handleToggle);
    window.addEventListener('testBotConfig', handleTestBot);
    
    return () => {
      unsubscribeBot();
      window.removeEventListener('openLiveDemo', handleToggle);
      window.removeEventListener('testBotConfig', handleTestBot);
    };
  }, [currentUser]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    const currentMessages = [...messages, { role: 'user' as const, text: userMsg }];
    
    setMessages(currentMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      let fullPersona = botConfig.persona;
      if (botConfig.knowledgeBase) {
        fullPersona += `\n\n--- KNOWLEDGE BASE ---\nUse the following information to answer questions. If the answer is not in the knowledge base, politely inform the user that you don't have that specific information, but try to be as helpful as possible:\n${botConfig.knowledgeBase}`;
      }

      // Format messages for @google/genai
      const contents = currentMessages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      // Use Pro model for paid plans
      const modelName = botConfig.plan === 'free' ? 'gemini-3-flash-preview' : 'gemini-3.1-pro-preview';

      const res = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: fullPersona
        }
      });

      if (!res.text) throw new Error('No response from AI');

      setMessages(prev => [...prev, { role: 'bot', text: res.text || '' }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "I'm sorry, I'm having trouble connecting to my Gemini brain right now. Please try again!" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] border border-slate-100 w-[360px] h-[500px] mb-4 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300 origin-bottom-right">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 text-white"
            style={{ backgroundColor: botConfig.color }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <div className="font-bold text-[14px]">{botConfig.name}</div>
                <div className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
                  Powered by Gemini
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1">
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`px-4 py-2.5 rounded-2xl text-[13px] max-w-[85%] ${
                    msg.role === 'bot' 
                      ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm whitespace-pre-wrap leading-relaxed' 
                      : 'text-white rounded-tr-sm shadow-sm whitespace-pre-wrap leading-relaxed'
                  }`}
                  style={{ 
                    backgroundColor: msg.role === 'user' ? botConfig.color : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="bg-white border border-slate-200 text-slate-500 self-start rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1 text-[13px]">
                <span className="animate-bounce block w-1.5 h-1.5 bg-slate-400 rounded-full delay-75"></span>
                <span className="animate-bounce block w-1.5 h-1.5 bg-slate-400 rounded-full delay-150"></span>
                <span className="animate-bounce block w-1.5 h-1.5 bg-slate-400 rounded-full delay-300"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..." 
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
              />
                <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 p-1.5 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors shadow-sm"
                style={{ backgroundColor: botConfig.color }}
               >
                <Send size={16} />
              </button>
            </form>
            {botConfig.plan === 'free' && (
              <div className="mt-3 text-center">
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Powered by <span className="text-blue-600 font-bold">ChatFlow.ai</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 transition-all duration-300"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
