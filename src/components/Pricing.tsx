import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for small websites just getting started with AI automation.',
    features: [
      'Up to 500 conversations/mo',
      'Standard AI Model (GPT-3.5)',
      'Basic Website Training',
      'Email Support',
      'ChatFlow Branding'
    ],
    buttonText: 'Get Started',
    popular: false,
    buttonStyle: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm rounded-lg text-[14px]'
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'Our most popular plan for businesses wanting to scale sales.',
    features: [
      'Up to 5,000 conversations/mo',
      'Advanced AI Model (GPT-4o)',
      'Advanced Document Training',
      'Remove ChatFlow Branding',
      'HubSpot & Salesforce Sync',
      'Priority Support 24/7'
    ],
    buttonText: 'Start 14-Day Free Trial',
    popular: true,
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)] border-none rounded-lg text-[14px]'
  },
  {
    name: 'Business',
    price: '$199',
    period: '/mo',
    description: 'For large volume sites requiring dedicated infrastructure.',
    features: [
      'Unlimited conversations',
      'Custom fine-tuned AI Models',
      'Enterprise API Access',
      'SSO & Advanced Security',
      'Dedicated Account Manager',
      'Custom Deployment'
    ],
    buttonText: 'Contact Sales',
    popular: false,
    buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white border-transparent shadow-sm rounded-lg text-[14px]'
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Pricing</h2>
          <h3 className="text-3xl md:text-[40px] font-extrabold text-slate-900 mb-6 tracking-[-1px]">Simple, transparent pricing.</h3>
          <p className="text-[18px] text-slate-500">
            No hidden fees. No surprise charges. Choose the plan that best fits your traffic and upgrade whenever you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`relative flex flex-col p-8 rounded-[24px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                tier.popular 
                  ? 'bg-white border-2 border-blue-600 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] scale-100 md:scale-105 z-10 hover:md:scale-[1.08]' 
                  : 'bg-white border border-slate-200 hover:border-blue-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-[24px] font-extrabold text-slate-900 mb-2 tracking-[-0.5px]">{tier.name}</h4>
                <p className="text-[13px] text-slate-500 h-10">{tier.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-[48px] font-extrabold tracking-[-1.5px] text-slate-900">{tier.price}</span>
                {tier.period && <span className="text-slate-500 font-medium">{tier.period}</span>}
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[14px] text-slate-700 font-medium">
                    <Check size={18} className="text-blue-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.dispatchEvent(new Event('openSignupModal'))}
                className={`w-full py-3.5 font-semibold transition-all ${tier.buttonStyle}`}>
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
