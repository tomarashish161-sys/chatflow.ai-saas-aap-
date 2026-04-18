import React, { useState } from 'react';
import { Search, User, Clock, Send, MoreVertical, CheckCircle2 } from 'lucide-react';

const MOCK_CHATS = [
  { id: 1, name: 'Anonymous Visitor', location: 'New York, USA', time: 'Just now', message: 'Hi, do you offer enterprise plans?', unread: true, active: true },
  { id: 2, name: 'Sarah Jenkins', location: 'London, UK', time: '12m ago', message: 'Thanks, that solved my issue!', unread: false, active: false },
  { id: 3, name: 'Michael Chen', location: 'Toronto, CA', time: '1h ago', message: 'How do I integrate with Shopify?', unread: false, active: true },
  { id: 4, name: 'Anonymous Visitor', location: 'Berlin, DE', time: '3h ago', message: 'Pricing seems good. Is there a free trial?', unread: false, active: false },
  { id: 5, name: 'David Wilson', location: 'San Francisco, USA', time: '5h ago', message: 'Can I import my existing help docs?', unread: false, active: false },
  { id: 6, name: 'Emma Thompson', location: 'Sydney, AU', time: '8h ago', message: 'The AI is surprisingly good!', unread: false, active: false },
  { id: 7, name: 'Anonymous Visitor', location: 'Paris, FR', time: '1d ago', message: 'Bonjour, available in French?', unread: false, active: false },
  { id: 8, name: 'Robert Blake', location: 'Austin, USA', time: '1d ago', message: 'Issue with my billing cycle.', unread: false, active: false },
  { id: 9, name: 'Jessica Lee', location: 'Seoul, KR', time: '2d ago', message: 'Great product, love the UI!', unread: false, active: false },
  { id: 10, name: 'Anonymous Visitor', location: 'Tokyo, JP', time: '2d ago', message: 'API documentation link please.', unread: false, active: false },
  { id: 11, name: 'Paul Revere', location: 'Boston, USA', time: '3d ago', message: 'The midnight ride was long, need AI.', unread: false, active: false },
  { id: 12, name: 'Linda Carter', location: 'Madrid, ES', time: '4d ago', message: 'Is this GDPR compliant?', unread: false, active: false },
];

export default function DashboardConversations() {
  const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0].id);

  return (
    <div className="h-[calc(100vh-140px)] w-full flex flex-col md:flex-row gap-6 animate-in slide-in-from-bottom-4 duration-700 both">
      {/* Inbox Sidebar */}
      <div className="w-full md:w-80 bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-[16px] font-extrabold text-slate-900 mb-4 tracking-[-0.3px]">Inbox</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto w-full">
          {MOCK_CHATS.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors relative ${selectedChat === chat.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
            >
              {selectedChat === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-[14px]">{chat.name}</span>
                  {chat.unread && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{chat.time}</span>
              </div>
              <div className="text-[12px] text-slate-500 mb-2 truncate pr-4">{chat.message}</div>
              <div className="flex items-center gap-2 text-[11px] font-medium">
                {chat.active ? (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live</span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 size={10} /> Resolved</span>
                )}
                <span className="text-slate-400">{chat.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-[15px]">{MOCK_CHATS.find(c => c.id === selectedChat)?.name}</h3>
              <div className="flex items-center gap-3 text-[12px] text-slate-500">
                <span className="flex items-center gap-1"><Clock size={12} /> Active 3m</span>
                <span>• IP: 192.168.x.x</span>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-2">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F8FAFC]">
          <div className="flex flex-col items-center justify-center py-6">
            <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[11px] font-bold tracking-widest uppercase">Chat Started</span>
          </div>
          
          {/* Mock Thread */}
          <div className="flex items-start gap-3 w-full max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500">
              <User size={14} />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-[14px] text-slate-700">
              Hi, we are a mid-sized agency looking to automate our support. Do you integrate directly with Salesforce?
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pl-11">2 minutes ago</div>

          <div className="flex items-start gap-3 w-full max-w-2xl ml-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-[12px]">
              AI
            </div>
            <div className="bg-blue-600 border border-blue-600 p-3.5 rounded-2xl rounded-tr-sm shadow-sm text-[14px] text-white">
              Hello! Yes, absolutely. ChatFlow offers a native Salesforce integration on our Pro and Business tiers. We can automatically sync leads, chat transcripts, and create tickets directly inside your Salesforce CRM. Would you like me to send you the documentation link?
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pr-11 text-right w-full">1 minute ago</div>

           <div className="flex items-start gap-3 w-full max-w-2xl">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500">
              <User size={14} />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm shadow-sm text-[14px] text-slate-700">
              {MOCK_CHATS.find(c => c.id === selectedChat)?.message}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pl-11">Just now</div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 relative">
            <input 
              type="text" 
              placeholder="Take over as human and reply..." 
              className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.2)]">
              <Send size={16} />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
             <span className="text-[11px] text-slate-400">Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-500">Enter</kbd> to send</span>
             <span className="text-[11px] text-indigo-500 font-medium cursor-pointer hover:underline">Insert Template</span>
          </div>
        </div>
      </div>
    </div>
  );
}
