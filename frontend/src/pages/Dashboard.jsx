import React, { useEffect, useState } from 'react';
import { getInquiries } from '../services/db';
import { Clock, ChevronRight, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDocs() {
      const docs = await getInquiries();
      setInquiries(docs);
      setLoading(false);
    }
    fetchDocs();
  }, []);

  return (
    <div className="max-w-[1120px] mx-auto py-20 px-8">
      <div className="mb-16 border-b border-slate-200 pb-12 flex justify-between items-end">
        <div>
          <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-[0.2em] block mb-4">Historical Archive</span>
          <h1 className="font-display-lg text-display-lg text-[#0F172A]">Your Research Dossier</h1>
          <p className="font-serif text-lg text-slate-500 mt-4 italic max-w-2xl">A curated history of your jurisdictional inquiries and syntheses.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-serif italic">
          <Archive size={20} />
          <span>{inquiries.length} Syntheses Saved</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="flex items-center gap-3 text-slate-500 font-serif italic text-lg animate-pulse">
             <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
             Consulting Archive...
          </div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-[#FAF9F8] border border-slate-200 p-20 text-center shadow-sm">
          <p className="font-serif text-xl text-slate-500 mb-8 italic">Your dossier is currently empty. No syntheses have been performed.</p>
          <button 
            onClick={() => navigate('/app')} 
            className="bg-[#0F172A] text-white font-serif text-lg tracking-tight px-10 py-4 scale-100 hover:opacity-90 transition-all"
          >
            Initiate First Inquiry
          </button>
        </div>
      ) : (
        <div className="grid gap-8">
          {inquiries.map((doc, i) => (
            <div 
              key={i} 
              className="bg-white border-l-2 border-slate-200 p-10 hover:border-slate-900 hover:bg-[#FAF9F8] transition-all duration-300 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md" 
              onClick={() => navigate(`/app?q=${encodeURIComponent(doc.query)}`)}
            >
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                   <span className="font-label-sm text-[10px] uppercase tracking-widest text-slate-400">Synthesis ID: RS-{(i + 100).toString(16).toUpperCase()}</span>
                   <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                   <div className="flex items-center text-xs font-serif italic text-slate-400 gap-2">
                    <Clock size={12} />
                    <span>{doc.timestamp ? new Date(doc.timestamp).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md text-[#0F172A] group-hover:text-slate-900 transition-colors">
                  "{doc.query}"
                </h3>
              </div>
              <div className="flex items-center gap-4 text-slate-300 group-hover:text-slate-900 transition-all">
                <span className="font-serif italic text-sm hidden md:block">Review Synthesis</span>
                <ChevronRight size={24} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
