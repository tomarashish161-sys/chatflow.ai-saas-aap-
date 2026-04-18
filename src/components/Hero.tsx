import { ArrowRight, Bot, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Background Gradients (Sleek Blobs) */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full blur-[80px] bg-indigo-500/10 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full blur-[80px] bg-blue-600/5 pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-5xl lg:text-[56px] font-extrabold tracking-[-1.5px] mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 both bg-gradient-to-b from-slate-900 to-slate-700 text-transparent bg-clip-text">
              Turn Visitors Into Customers with AI Chatbots
            </h1>
            
            <p className="text-[18px] text-slate-500 leading-[1.6] mb-8 max-w-[460px] mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 both">
              Engage, qualify, and convert your leads instantly with our intelligent conversational platform designed for modern websites.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 both">
              <button 
                onClick={() => window.dispatchEvent(new Event('openSignupModal'))}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[14px] font-semibold transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex items-center justify-center">
                Start Free Trial
              </button>
              <button 
                onClick={() => window.dispatchEvent(new Event('openLiveDemo'))}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-[14px] font-semibold transition-all flex items-center justify-center">
                View Live Demo
              </button>
            </div>
          </div>

          {/* Right Content UI Mockup */}
          <div className="relative mx-auto w-full max-w-[380px] lg:ml-auto animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 both cursor-default">
            
            {/* Main Chat Interface */}
            <div className="relative bg-white border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] rounded-[24px] flex flex-col h-[480px] p-6 transition-transform hover:-translate-y-2 duration-500">
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-[12px] font-bold text-blue-600">
                  AI
                </div>
                <div>
                  <div className="font-bold text-[14px] text-slate-900">ChatFlow Assistant</div>
                  <div className="text-[11px] text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                    Always online
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-hidden">
                <div className="bg-slate-100 text-slate-900 px-4 py-3 rounded-xl text-[13px] max-w-[80%] self-start origin-top-left animate-in zoom-in duration-300 delay-[800ms] both">
                  Hi! How can I help you grow your business today?
                </div>
                
                <div className="bg-blue-600 text-white px-4 py-3 rounded-xl text-[13px] max-w-[80%] self-end origin-top-right animate-in zoom-in duration-300 delay-[1800ms] both">
                  Can you tell me more about your pricing plans?
                </div>
                
                <div className="bg-slate-100 text-slate-900 px-4 py-3 rounded-xl text-[13px] max-w-[80%] self-start origin-top-left animate-in zoom-in duration-300 delay-[2800ms] both">
                  Of course! We have three simple tiers: Free, Pro, and Business. Would you like a breakdown?
                </div>
              </div>

              {/* Input Area */}
              <div className="mt-auto pt-4">
                <div className="w-full border border-slate-200 rounded-lg px-4 py-3 text-[12px] text-slate-500 bg-slate-50">
                  Type a message...
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
