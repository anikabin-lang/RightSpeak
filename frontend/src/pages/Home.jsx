import React, { useState, useEffect } from 'react';
import QueryInput from '../components/QueryInput';
import ResponseCard from '../components/ResponseCard';
import RightsList from '../components/RightsList';
import Disclaimer from '../components/Disclaimer';
import { askQuestion } from '../services/api';
import { saveInquiry } from '../services/db';
import { useSearchParams } from 'react-router-dom';
import { FileText, Shield, Scale, ArrowRight } from 'lucide-react';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      handleQuery(q);
    }
  }, [searchParams]);

  const handleQuery = async (query) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const data = await askQuestion(query);
      setResponse(data);
      await saveInquiry(query, data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to process query. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-32 px-12">
      <main>
        <div className="mb-20">
          <QueryInput onSubmit={handleQuery} isLoading={isLoading} initialQuery={searchParams.get('q') || ''} />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-900 p-12 mt-16 font-serif text-xl italic shadow-sm">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-32 flex flex-col gap-20">
            <div className="text-center mb-12 border-b border-slate-200 pb-20">
               <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-[0.4em] block mb-6">Synthesis Analysis</span>
               <h2 className="font-serif text-6xl font-black text-[#0F172A]">The RightSpeak Brief</h2>
            </div>
          
            <div className="grid gap-16">
              <ResponseCard 
                title="Editorial Synthesis" 
                icon={<FileText size={28} />}
              >
                <p className="leading-relaxed opacity-90">{response.plain_explanation}</p>
              </ResponseCard>

              <ResponseCard 
                title="Constitutional Rights" 
                icon={<Shield size={28} />}
              >
                <RightsList items={response.key_rights} />
              </ResponseCard>

              <ResponseCard 
                title="Legislative Framework" 
                icon={<Scale size={28} />}
              >
                <RightsList items={response.relevant_laws} />
              </ResponseCard>

              <ResponseCard 
                title="Strategic Directive" 
                icon={<ArrowRight size={28} />}
              >
                <RightsList items={response.next_steps} />
              </ResponseCard>
            </div>

            <div className="bg-white border border-slate-100 p-16 mt-16 shadow-2xl rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#cf6721]"></div>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-slate-400 block mb-6">Mandatory Disclaimer</span>
              <p className="font-serif text-base text-slate-500 leading-relaxed italic opacity-80">{response.disclaimer}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
