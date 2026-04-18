import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, Settings as SettingsIcon, BookOpen, LogOut, Menu, X, User as UserIcon, Shield, Tag as TagIcon, Users, Sparkles, Zap, Clock } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import DashboardOverview from './DashboardOverview';
import DashboardConversations from './DashboardConversations';
import DashboardTraining from './DashboardTraining';
import DashboardSettings from './DashboardSettings';
import DashboardOffers from './DashboardOffers';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const profileRef = useRef<HTMLDivElement>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Listen to bot settings for plan changes
    const q = query(collection(db, 'bots'), where('userId', '==', currentUser.uid));
    const unsubscribeBot = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setPlan(data.plan || 'free');
      }
    });

    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribeBot();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'training', label: 'Training Data', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'teams', label: 'Teams', icon: Users, enterpriseOnly: true },
    { id: 'offers', label: 'Special Offers', icon: TagIcon }
  ].filter(item => !item.enterpriseOnly || plan === 'enterprise');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview onNavigate={setActiveTab} plan={plan} />;
      case 'conversations': return <DashboardConversations />;
      case 'training': return <DashboardTraining />;
      case 'settings': return <DashboardSettings plan={plan} />;
      case 'offers': return <DashboardOffers currentPlan={plan} onNavigate={setActiveTab} />;
      case 'teams': return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div>
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 mb-2 tracking-[-0.5px]">Team Management</h2>
            <p className="text-slate-500 text-[15px]">Invite colleagues to manage your Enterprise AI bots.</p>
          </div>
          <div className="bg-white rounded-[24px] border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No active teammates</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">You are the only member of this Enterprise workspace. Start by inviting an admin or moderator.</p>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">Add Team Member</button>
          </div>
        </div>
      );
      default: return <DashboardOverview onNavigate={setActiveTab} plan={plan} />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col md:flex-row relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="w-64 max-w-[80vw] bg-white border-r border-slate-200 flex flex-col relative z-50 h-full animate-in slide-in-from-left duration-300">
             <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
              <span 
                onClick={() => { setIsMobileMenuOpen(false); setActiveTab('overview'); }}
                className="font-extrabold text-[20px] tracking-[-0.5px] text-slate-900 cursor-pointer hover:opacity-80 transition-opacity"
              >
                ChatFlow<span className="text-blue-600">.ai</span>
              </span>
              <button className="text-slate-500" onClick={() => setIsMobileMenuOpen(false)}><X size={20}/></button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-semibold text-[14px] transition-colors">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div 
          onClick={() => setActiveTab('overview')}
          className="h-20 flex items-center px-6 border-b border-slate-100 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="font-extrabold text-[20px] tracking-[-0.5px] text-slate-900">
            ChatFlow<span className="text-blue-600">.ai</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium text-[14px] transition-colors">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-600 p-2 -ml-2">
              <Menu size={24} />
            </button>
            <span 
              onClick={() => setActiveTab('overview')}
              className="font-extrabold text-[20px] tracking-[-0.5px] text-slate-900 md:hidden block pr-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              ChatFlow<span className="text-blue-600">.ai</span>
            </span>
            <h1 className="text-[18px] font-bold text-slate-900 hidden md:block capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4 relative" ref={profileRef}>
            {plan === 'free' ? (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm border border-emerald-200">
                <Clock size={12} /> Trial Active
              </span>
            ) : (
              <span className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm border ${plan === 'pro' ? 'bg-blue-600 text-white border-blue-500' : 'bg-indigo-950 text-indigo-400 border-indigo-800'}`}>
                {plan === 'pro' ? <Zap size={12} fill="currentColor" /> : <Sparkles size={12} fill="currentColor" />}
                {plan} Plan
              </span>
            )}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200/50 hover:opacity-90 transition-opacity focus:outline-none"
            >
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                  <div className="text-[14px] font-bold text-slate-900 truncate">{currentUser?.email}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5 capitalize">{plan} Plan</div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-[13px] font-semibold transition-colors"
                  >
                    <UserIcon size={16} /> Edit Profile
                  </button>
                  <button 
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-[13px] font-semibold transition-colors"
                  >
                    <Shield size={16} /> Security Settings
                  </button>
                  <div className="h-px bg-slate-100 my-2 mx-2"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-[13px] font-bold transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Dynamic View Panel */}
        <div className="p-4 md:p-8 flex-1 overflow-x-hidden w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
