import { Link, Settings, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Connect your data',
    description: 'Simply paste your website URL or upload your help center docs. The AI instantly reads and learns everything about your business in seconds.',
    icon: <Link size={20} className="text-blue-600" />
  },
  {
    id: 2,
    title: 'Customize appearance',
    description: 'Set your brand guidelines, change colors, give the bot a persona, and define strict rules for how it should speak to your customers.',
    icon: <Settings size={20} className="text-blue-600" />
  },
  {
    id: 3,
    title: 'Embed and launch',
    description: 'Copy and paste a single snippet of code into your website builder (Shopify, Webflow, WordPress, etc.) and go live immediately.',
    icon: <Rocket size={20} className="text-blue-600" />
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Setup in minutes</h2>
            <h3 className="text-3xl md:text-[40px] font-extrabold text-slate-900 mb-6 tracking-[-1px]">From zero to live bot in three easy steps.</h3>
            <p className="text-[18px] text-slate-500 mb-12">
              No coding required. We've made the setup process incredibly frictionless so you can start serving your customers today.
            </p>

            <div className="space-y-10">
              {steps.map((step) => (
                <div key={step.id} className="relative flex gap-6">
                  {/* Visual Line for Desktop connecting steps */}
                  {step.id !== steps.length && (
                    <div className="absolute left-[20px] top-[48px] bottom-[-40px] w-[1px] bg-slate-200 z-0 hidden lg:block"></div>
                  )}
                  
                  <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-[10px] bg-indigo-50 text-blue-600 border border-slate-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-[16px] font-bold text-slate-900 mb-2">Step {step.id}: {step.title}</h4>
                    <p className="text-[14px] text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side visual code block / snippet representation */}
          <div className="order-1 lg:order-2 relative lg:ml-8 transform transition hover:scale-[1.02] duration-500">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl blur-2xl opacity-60"></div>
            
            <div className="relative border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] rounded-[24px] overflow-hidden aspect-[4/3] flex flex-col bg-white border-slate-100">
              {/* Window Controls */}
              <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="ml-4 text-[12px] font-mono text-slate-400">index.html &mdash; Your Website</div>
              </div>
              
              {/* Code Panel */}
              <div className="p-6 font-mono text-[13px] leading-relaxed text-slate-600 overflow-hidden flex-1 select-none">
                <div className="line-clamp-12">
                  <span className="text-slate-400">&lt;!DOCTYPE</span> <span className="text-indigo-600">html</span><span className="text-slate-400">&gt;</span><br/>
                  <span className="text-blue-600">&lt;html</span> <span className="text-emerald-600">lang</span><span className="text-slate-400">=</span><span className="text-slate-900">"en"</span><span className="text-blue-600">&gt;</span><br/>
                  <span className="text-blue-600">&lt;head&gt;</span><br/>
                  &nbsp;&nbsp;<span className="text-slate-400">&lt;!-- Your styles &amp; meta --&gt;</span><br/>
                  <span className="text-blue-600">&lt;/head&gt;</span><br/>
                  <span className="text-blue-600">&lt;body&gt;</span><br/>
                  <br/>
                  &nbsp;&nbsp;<span className="text-slate-400">&lt;!-- ChatFlow Widget Snippet --&gt;</span><br/>
                  &nbsp;&nbsp;<span className="text-blue-600">&lt;script</span> <br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-600">src</span><span className="text-slate-400">=</span><span className="text-slate-900">"https://chatflow.ai/widget.js"</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-600">data-token</span><span className="text-slate-400">=</span><span className="text-slate-900">"cf_live_9a8b7c6d5e"</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-600">defer</span><br/>
                  &nbsp;&nbsp;<span className="text-blue-600">&gt;&lt;/script&gt;</span><br/>
                  <br/>
                  <span className="text-blue-600">&lt;/body&gt;</span><br/>
                  <span className="text-blue-600">&lt;/html&gt;</span>
                </div>
              </div>
              
              {/* Toast confirmation floating in mockup */}
              <div className="absolute bottom-6 right-6 bg-white py-3 px-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Bot is live!</div>
                  <div className="text-xs text-gray-500">Connected to ChatFlow servers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
