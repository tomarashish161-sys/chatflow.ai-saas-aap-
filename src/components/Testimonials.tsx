import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'CMO, TechFlow',
    image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    content: "ChatFlow completely transformed our inbound funnel. We've seen a 35% increase in lead capture simply because the AI bots respond instantly to complex technical questions."
  },
  {
    name: 'Sarah Jenkins',
    role: 'Founder, EcoStay',
    image: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    content: "We used to lose customers who browsed our site late at night. Now, ChatFlow handles nighttime support and books reservations while I sleep. It's like magic."
  },
  {
    name: 'David Chen',
    role: 'VP Sales, Nebula',
    image: 'https://i.pravatar.cc/150?u=a04258114e29026708c',
    content: "The Hubspot integration is flawless. ChatFlow qualifies leads and puts them directly into our CRM with all the context our sales reps need. Highly recommended."
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold text-slate-900 mb-6 tracking-[-1px]">Loved by high-growth teams.</h2>
          <p className="text-[18px] text-slate-500">
            See how forward-thinking companies are automating their sales and support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col">
              <div className="flex gap-1 mb-6 text-yellow-400">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              
              <blockquote className="text-slate-700 text-[14px] leading-relaxed font-medium mb-8 flex-1">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-10 h-10 rounded-full border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-slate-900 text-[14px]">{testimonial.name}</div>
                  <div className="text-slate-500 text-[12px]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
