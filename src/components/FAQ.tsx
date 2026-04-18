import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Do I need coding experience to use ChatFlow?",
    answer: "Not at all. ChatFlow is designed to be plug-and-play. You simply copy and paste a single script tag into your website. Our dashboard lets you customize everything without touching a single line of code."
  },
  {
    question: "How does the AI know about my business?",
    answer: "You can securely train your bot by pasting URL links to your website, uploading PDFs, or linking your help center. The AI ingests the context and uses it to answer questions accurately."
  },
  {
    question: "What languages does ChatFlow support?",
    answer: "Our AI model naturally understands and replies in over 50 languages. It automatically detects the visitor's language and replies back in the same language fluently."
  },
  {
    question: "Can I take over a chat from the AI?",
    answer: "Yes! If the AI encounters a complex issue or a high-value lead, it can seamlessly hand off the conversation to a human agent, notifying your team via email or Slack."
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. All chats are encrypted using AES-256 at rest and TLS in transit. We are GDPR compliant and do not use your proprietary data to train base models."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-[40px] font-extrabold text-slate-900 mb-6 tracking-[-1px]">Frequently asked questions</h2>
          <p className="text-[18px] text-slate-500">
            Everything you need to know about setting up and using ChatFlow.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-[16px] transition-all duration-300 bg-white ${isOpen ? 'border-blue-600 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className={`font-semibold text-[15px] ${isOpen ? 'text-blue-600' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} 
                    size={20} 
                  />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-500 text-[14px] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
