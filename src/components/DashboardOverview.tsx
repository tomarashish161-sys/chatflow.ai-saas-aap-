import React from 'react';
import { Activity, Users, Zap, BookOpen, ShieldCheck, BarChart3, Globe, Cpu, Sparkles, Terminal, ArrowRight } from 'lucide-react';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  plan: 'free' | 'pro' | 'enterprise';
}

export default function DashboardOverview({ onNavigate, plan }: DashboardOverviewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 both">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 tracking-[-0.5px]">Welcome back!</h2>
            {plan !== 'free' && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${plan === 'pro' ? 'bg-blue-600 text-white' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'}`}>
                {plan === 'pro' ? <Zap size={10} fill="currentColor" /> : <Sparkles size={10} fill="currentColor" />}
                {plan}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-[15px]">
            {plan === 'free' 
              ? "Your 14-day free trial is now active. Let's get your first bot set up." 
              : plan === 'pro' 
                ? "Your Pro dashboard is optimized for conversion. Check your lead quality below."
                : "Enterprise Command Center active. Monitoring global AI infrastructure."}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div 
          className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-xl hover:-translate-y-1 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-emerald-100">
            <Activity size={24} />
          </div>
          <div className="text-[14px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Bot Status</div>
          <div className="text-[26px] font-extrabold text-slate-900 tracking-[-0.5px] flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
            Online
          </div>
        </div>

        <div 
          onClick={() => onNavigate('conversations')}
          className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 group active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:-rotate-3 shadow-sm border border-indigo-100">
            <Users size={24} />
          </div>
          <div className="text-[14px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Total Conversations</div>
          <div className="text-[26px] font-extrabold text-slate-900 tracking-[-0.5px] flex items-baseline gap-2">
            12
            <span className="text-[14px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">2 Live</span>
          </div>
        </div>

        {/* Plan Dependent Card */}
        {plan === 'free' ? (
          <div 
            onClick={() => onNavigate('offers')}
            className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 group active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-sm border border-blue-100">
              <Zap size={24} />
            </div>
            <div className="text-[14px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Trial Days Left</div>
            <div className="text-[26px] font-extrabold text-slate-900 tracking-[-0.5px] capitalize">14</div>
          </div>
        ) : plan === 'pro' ? (
          <div className="bg-white p-6 rounded-[24px] border border-blue-100 shadow-[0_4px_20px_rgba(37,99,235,0.05)] transition-all hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck size={80} />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg shadow-blue-200">
              <BarChart3 size={24} />
            </div>
            <div className="text-[14px] text-blue-600 font-bold mb-1 uppercase tracking-wider">Lead Quality Score</div>
            <div className="text-[26px] font-extrabold text-slate-900 tracking-[-0.5px]">88%</div>
          </div>
        ) : (
          <div className="bg-indigo-950 p-6 rounded-[24px] border border-indigo-900 shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 group relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-white">
              <Globe size={80} />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Terminal size={24} />
            </div>
            <div className="text-[14px] text-indigo-400 font-bold mb-1 uppercase tracking-wider">Global API Health</div>
            <div className="text-[26px] font-extrabold text-white tracking-[-0.5px]">99.9%</div>
          </div>
        )}
      </div>

      {/* Enterprise Only Row */}
      {plan === 'enterprise' && (
        <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center flex-shrink-0">
              <Cpu size={28} />
            </div>
            <div>
              <div className="text-[13px] text-slate-400 font-bold uppercase tracking-widest mb-1">Compute Instance</div>
              <div className="text-[20px] font-extrabold text-slate-900">Dedicated Region: US-EAST</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Globe size={28} />
            </div>
            <div>
              <div className="text-[13px] text-slate-400 font-bold uppercase tracking-widest mb-1">Multi-site Sync</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <div className="text-[20px] font-extrabold text-slate-900">4 Instances Active</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col items-center justify-center text-center p-10 md:p-16 relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform duration-500 text-blue-600">
          <BookOpen size={30} />
        </div>
        <h3 className="text-[24px] font-extrabold text-slate-900 mb-3 tracking-[-0.5px]">Train your AI Assistant</h3>
        <p className="text-slate-500 mb-8 max-w-md text-[15px] leading-relaxed">
          {plan === 'enterprise' 
            ? "Access Enterprise-grade bulk training tools. Upload huge datasets or crawl entire subdomains instantly." 
            : "To make your bot smart, provide it with knowledge about your business. Connect your website to get started."}
        </p>
        <button 
          onClick={() => onNavigate('training')}
          className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[14px] font-bold transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group"
        >
          Manage Knowledge Base
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
