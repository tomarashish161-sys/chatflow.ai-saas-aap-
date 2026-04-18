import { MessageSquareHeart, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] pt-24 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity inline-flex"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                <MessageSquareHeart size={18} />
              </div>
              <span className="font-extrabold text-[20px] tracking-[-0.5px] text-slate-900">
                ChatFlow<span className="text-blue-600">.ai</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
              The smartest AI chatbot for modern websites. Automate customer support, capture leads, and close sales while you sleep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-slate-900 transition"><Github size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-blue-800 transition"><Linkedin size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-pink-600 transition"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-[14px] text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Features</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Pricing</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Integrations</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Documentation</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Help Center</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Blog</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">About Us</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Careers</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-[14px] text-slate-500 hover:text-blue-600 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} ChatFlow AI, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <span>Designed with ✨ in SF</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
