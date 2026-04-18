import { Zap, MessageSquare, LineChart, Globe2, ShieldCheck, PaintBucket } from 'lucide-react';

const coreFeatures = [
  {
    title: 'Instant Responses 24/7',
    description: 'Never keep a customer waiting. Our AI responds in milliseconds, answering questions accurately any time of day.',
    icon: <Zap size={24} />,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200'
  },
  {
    title: 'Human-like Conversations',
    description: 'Powered by advanced LLMs, ChatFlow understands context, nuance, and intent just like a real sales agent.',
    icon: <MessageSquare size={24} />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    title: 'Smart Lead Capture',
    description: 'Automatically qualify visitors and collect emails, phone numbers, and requirements before routing to your team.',
    icon: <LineChart size={24} />,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200'
  },
  {
    title: 'Multilingual Support',
    description: 'Sell globally from day one. Automatically detects visitor language and chats effortlessly in 50+ languages.',
    icon: <Globe2 size={24} />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    title: 'Custom Brand Styling',
    description: 'Make the widget truly yours. Adjust colors, logos, chat bubble shapes, and launch icons to match your site.',
    icon: <PaintBucket size={24} />,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200'
  },
  {
    title: 'Enterprise-Grade Security',
    description: 'Your data is encrypted at rest and in transit. Fully GDPR and SOC2 compliant to keep customer data safe.',
    icon: <ShieldCheck size={24} />,
    color: 'text-slate-700',
    bgColor: 'bg-slate-200',
    borderColor: 'border-slate-300'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Capabilities</h2>
          <h3 className="text-3xl md:text-[40px] font-extrabold text-slate-900 mb-6 tracking-[-1px]">Everything you need to automate support.</h3>
          <p className="text-[18px] text-slate-500">
            ChatFlow comes packed with features designed to generate leads, resolve tickets, and boost conversion rates on autopilot.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {coreFeatures.map((feature, idx) => (
            <div 
              key={idx} 
              className="group flex gap-5 p-6 rounded-[24px] transition-all hover:bg-slate-50 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-blue-600 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-md group-hover:bg-blue-600 group-hover:text-white duration-300">
                {feature.icon}
              </div>
              <div className="pt-1">
                <h4 className="text-[17px] font-bold text-slate-900 mb-2 transition-colors group-hover:text-blue-600">{feature.title}</h4>
                <p className="text-[14px] text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
