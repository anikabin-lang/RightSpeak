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
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm p-10 flex flex-col gap-8">
      <div className="space-y-2">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-tertiary-container">Jurisdictional Inquiry</span>
        <h2 className="font-headline-lg text-headline-lg text-[#0F172A] flex items-center gap-4">
          State your legal query with precision.
        </h2>
      </div>
      
      <div className="relative group">
        <textarea
          className="w-full min-h-[160px] bg-[#FAF9F8] border border-slate-200 focus:border-[#0F172A] focus:ring-0 font-serif text-xl text-[#0F172A] placeholder-slate-400 p-8 outline-none resize-none transition-all leading-relaxed"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., 'A comprehensive analysis of tenant protection clauses under the Model Tenancy Act...'"
          disabled={isLoading}
        />
        {/* Removed helper text */}
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-8">
        <p className="font-serif text-sm text-slate-500 italic max-w-md">
          RightSpeak provides a synthetic analysis of law. Final counsel should be verified by a licensed advocate.
        </p>
        <button 
          type="submit" 
          className="bg-[#0F172A] text-white font-serif text-lg tracking-tight px-10 py-4 scale-100 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing Synthesis...
            </>
          ) : (
            'Initiate Inquiry'
          )}
        </button>
      </div>
    </form>
  );
}
