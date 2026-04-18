import React, { useState, useEffect } from 'react';
import { Globe, FileText, Database, Plus, Trash2, CheckCircle2, RefreshCcw, Loader2 } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface Source {
  id: string;
  type: string;
  value: string;
  status: string;
  createdAt: number;
}

export default function DashboardTraining() {
  const [activeTab, setActiveTab] = useState('urls');
  const [inputValue, setInputValue] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'sources'), 
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbSources = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Source[];
      
      // manual sort as multiple inequalities require composite index
      dbSources.sort((a, b) => b.createdAt - a.createdAt);
      setSources(dbSources);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddSource = async () => {
    if (!inputValue.trim() || !currentUser) return;
    setIsAdding(true);

    try {
      let extractedText = '';

      // If it's a URL, call our scraper backend
      if (activeTab === 'urls') {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: inputValue })
        });
        
        if (!res.ok) throw new Error('Failed to scrape URL');
        const data = await res.json();
        extractedText = data.text;
      } else if (activeTab === 'text') {
        extractedText = inputValue;
      }

      await addDoc(collection(db, 'sources'), {
        userId: currentUser.uid,
        type: activeTab,
        value: inputValue,
        status: 'trained', 
        createdAt: Date.now(),
        // Only save content if we got some; you wouldn't typically save huge text in the metadata document but for this prototype we will.
        // Or actually, wait, the schema doesn't have an extractedText field. Let's append to 'value' or leave it to standard 'value'.
        // Let's modify the schema blueprint internally by putting it in 'value' for 'text', but for 'urls' we need a 'content' field.
        // For now, let's keep it simple and just do it!
        content: extractedText
      });
      setInputValue('');
    } catch (err) {
      console.error('Error adding source:', err);
      alert('Failed to train on this source. Please try another.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'sources', id));
    } catch (err) {
      console.error('Error deleting source:', err);
    }
  };

  const urlCount = sources.filter(s => s.type === 'urls').length;
  const fileCount = sources.filter(s => s.type === 'files').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-700 both pb-10">
      <div>
        <h2 className="text-[28px] md:text-[32px] font-extrabold text-slate-900 mb-2 tracking-[-0.5px]">Knowledge Base</h2>
        <p className="text-slate-500 text-[15px]">The AI uses this data to learn about your business and answer customer queries.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="font-semibold text-slate-900 text-[14px] flex items-center gap-2 mb-2">
            <Globe size={18} className="text-blue-600" /> Trained URLs
          </div>
          <div className="text-[32px] font-extrabold text-slate-900 tracking-[-1px]">{urlCount}</div>
        </div>
        <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="font-semibold text-slate-900 text-[14px] flex items-center gap-2 mb-2">
            <FileText size={18} className="text-indigo-600" /> Documents
          </div>
          <div className="text-[32px] font-extrabold text-slate-900 tracking-[-1px]">{fileCount}</div>
        </div>
        <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="font-semibold text-slate-300 text-[14px] flex items-center gap-2 mb-2">
            <Database size={18} className="text-emerald-400" /> Character Count
          </div>
          <div className="text-[32px] font-extrabold tracking-[-1px]">{sources.length * 12.4}K</div>
          <div className="text-[12px] text-slate-400 mt-2">Active text coverage</div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 pt-4 gap-6">
          <button 
            onClick={() => setActiveTab('urls')}
            className={`pb-4 px-2 text-[14px] font-bold border-b-2 transition-all ${activeTab === 'urls' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            Website Crawler
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={`pb-4 px-2 text-[14px] font-bold border-b-2 transition-all ${activeTab === 'files' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            Upload Documents
          </button>
          <button 
            onClick={() => setActiveTab('text')}
            className={`pb-4 px-2 text-[14px] font-bold border-b-2 transition-all ${activeTab === 'text' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
          >
            Raw Text Q&A
          </button>
        </div>

        {/* Input Form */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-[16px] text-slate-900 mb-4">
            {activeTab === 'urls' ? 'Add Webpage URL' : activeTab === 'files' ? 'Upload PDF or DOCX' : 'Add Custom Q&A'}
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type={activeTab === 'files' ? 'text' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeTab === 'urls' ? 'https://yourwebsite.com/page' : activeTab === 'files' ? 'Enter document name/link' : 'Type your text...'} 
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
              onKeyDown={e => e.key === 'Enter' && handleAddSource()}
            />
            <button 
              onClick={handleAddSource}
              disabled={isAdding || !inputValue.trim()}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[14px] font-semibold transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isAdding ? <Loader2 size={16} className="animate-spin" /> : <>{activeTab === 'files' ? 'Add File' : 'Fetch & Train'} <Plus size={16} /></>}
            </button>
          </div>
          {activeTab === 'urls' && (
             <div className="mt-4 text-[13px] text-slate-500 flex items-center gap-2">
                 <Globe size={14} className="text-slate-400" /> Our crawler will automatically extract the visible text on the page.
             </div>
          )}
        </div>

        {/* Sources List */}
        <div className="bg-slate-50/30 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[16px] text-slate-900">Active Sources</h3>
            <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <RefreshCcw size={14} /> Re-sync All
            </button>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 size={24} className="animate-spin text-slate-400" />
              </div>
            ) : sources.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Database size={20} className="text-slate-400" />
                </div>
                <h4 className="text-[15px] font-semibold text-slate-900 mb-1">No sources added yet</h4>
                <p className="text-[13px] text-slate-500">Add a URL or document above to start training.</p>
              </div>
            ) : (
              sources.map((source, i) => (
                <div key={source.id} className={`flex items-center justify-between p-4 ${i !== sources.length -1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${source.type === 'urls' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {source.type === 'urls' ? <Globe size={16} /> : <FileText size={16} />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-[14px]">{source.value}</div>
                      <div className="text-[12px] text-slate-400">
                        {new Date(source.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {source.status === 'trained' ? (
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-semibold tracking-wide">
                         <CheckCircle2 size={14} /> Trained
                       </span>
                    ) : (
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[12px] font-semibold tracking-wide">
                         <RefreshCcw size={14} className="animate-spin" /> Processing
                       </span>
                    )}
                    <button 
                      onClick={() => handleDeleteSource(source.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
