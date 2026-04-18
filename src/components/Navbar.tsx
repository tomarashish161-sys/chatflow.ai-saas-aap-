import { Menu, X, MessageSquareHeart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border-b border-slate-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center text-white">
              <MessageSquareHeart size={20} />
            </div>
            <span className="font-extrabold text-[24px] tracking-[-0.5px] text-slate-900">
              ChatFlow<span className="text-blue-600">.ai</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
            <div className="flex items-center gap-4 border-l border-slate-100 pl-8">
              <button 
                onClick={() => window.dispatchEvent(new Event('openSignupModal'))}
                className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                Log in
              </button>
              <button 
                onClick={() => window.dispatchEvent(new Event('openSignupModal'))}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)]">
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-500 hover:text-slate-900 focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] absolute top-20 left-0 w-full animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
            <a href="#features" onClick={() => setIsOpen(false)} className="block text-[14px] font-medium text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50">Features</a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="block text-[14px] font-medium text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50">How it Works</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="block text-[14px] font-medium text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50">Pricing</a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="block text-[14px] font-medium text-slate-500 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50">FAQ</a>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('openSignupModal')); }}
                className="w-full py-3 border border-slate-200 text-slate-700 rounded-lg text-[14px] font-bold hover:bg-slate-50">
                Log in
              </button>
              <button 
                onClick={() => { setIsOpen(false); window.dispatchEvent(new Event('openSignupModal')); }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-[14px] font-bold shadow-lg shadow-blue-600/20">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
