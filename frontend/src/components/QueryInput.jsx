import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function QueryInput({ onSubmit, isLoading, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSubmit(query);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm p-6 md:p-10 flex flex-col gap-6 md:gap-8">
      <div className="space-y-2">
        <span className="font-label-sm text-[10px] md:text-sm uppercase tracking-widest text-on-tertiary-container">Jurisdictional Inquiry</span>
        <h2 className="text-2xl md:text-4xl font-serif font-black text-[#0F172A] flex items-center gap-4">
          State your legal query with precision.
        </h2>
      </div>
      
      <div className="relative group">
        <textarea
          className="w-full min-h-[120px] md:min-h-[160px] bg-[#FAF9F8] border border-slate-200 focus:border-[#0F172A] focus:ring-0 font-serif text-lg md:text-xl text-[#0F172A] placeholder-slate-400 p-6 md:p-8 outline-none resize-none transition-all leading-relaxed"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 'A comprehensive analysis of tenant protection clauses...'"
          disabled={isLoading}
        />
        {/* Removed helper text */}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-slate-100 pt-6 md:pt-8 gap-6">
        <p className="font-serif text-xs md:text-sm text-slate-500 italic max-w-md">
          RightSpeak provides a synthetic analysis of law. Final counsel should be verified by a licensed advocate.
        </p>
        <button 
          type="submit" 
          className="w-full md:w-auto bg-[#0F172A] text-white font-serif text-base md:text-lg tracking-tight px-8 md:px-10 py-3 md:py-4 scale-100 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing...
            </>
          ) : (
            'Initiate Inquiry'
          )}
        </button>
      </div>
    </form>
  );
}
