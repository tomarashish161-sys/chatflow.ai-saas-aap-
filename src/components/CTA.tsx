import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-[24px] p-10 md:p-20 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] relative overflow-hidden">
          
          {/* Background Gradients (Sleek Blobs) */}
          <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full blur-[80px] bg-blue-600/20 pointer-events-none z-0"></div>
          <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full blur-[80px] bg-indigo-500/10 pointer-events-none z-0"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-[40px] font-extrabold text-white mb-6 tracking-[-1px]">
              Ready to automate your website's support & sales?
            </h2>
            <p className="text-slate-400 text-[18px] mb-10 leading-relaxed">
              Join thousands of businesses turning idle visitors into paying customers. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.dispatchEvent(new Event('openSignupModal'))}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[14px] font-semibold transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2">
                Get Started Free <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => window.dispatchEvent(new Event('openSignupModal'))}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-[14px] font-semibold transition-all">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
