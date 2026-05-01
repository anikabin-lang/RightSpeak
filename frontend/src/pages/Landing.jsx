import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (query.trim()) {
      navigate(`/app?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/app');
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.05, // Lower threshold for better reliability
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-12 min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="mt-12 md:mt-24 py-16 md:py-32 flex flex-col items-center text-center bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#0F172A]"></div>
        <div className="animate-float px-4">
          <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 block">The Digital Jurisprudence</span>
          <h1 className="font-serif text-4xl md:text-7xl font-black text-[#0F172A] mb-6 md:mb-10 max-w-4xl tracking-tighter">Law, Clarified.</h1>
        </div>
        <p className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100 font-serif text-lg md:text-2xl text-slate-500 max-w-3xl mb-10 md:mb-16 leading-relaxed italic opacity-80 px-6">
          Deconstructing complex legal precedents into crystalline insight. RightSpeak is the editorial bridge between dense legislation and actionable legal strategy.
        </p>
        
        {/* Refined Chatbot Input */}
        <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200 w-full max-w-4xl relative group px-4 md:px-8">
          <div className="flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-xl border border-slate-200 focus-within:ring-4 focus-within:ring-[#0F172A]/5 transition-all duration-500">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-6 flex items-center">
                <span className="material-symbols-outlined text-slate-400">search</span>
              </div>
              <input 
                className="w-full pl-16 pr-8 py-6 md:py-8 bg-white focus:ring-0 border-none font-serif text-lg md:text-xl text-[#0F172A] placeholder-slate-300 transition-all" 
                placeholder="Inquire about jurisdictional nuances..." 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <button 
              onClick={handleAnalyze}
              className="bg-[#0F172A] text-white px-8 md:px-16 py-6 md:py-8 font-serif text-lg md:text-xl font-bold uppercase tracking-widest transition-all hover:bg-slate-800 shrink-0 group-hover:scale-105"
            >
              Inquire
            </button>
          </div>
        </div>
        
        <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 delay-300 mt-10 flex flex-wrap justify-center gap-6">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-slate-300">Trending Research:</span>
          <button onClick={() => {setQuery('Securities Litigation'); navigate('/app?q=Securities%20Litigation')}} className="font-serif text-sm text-[#0F172A] hover:text-[#cf6721] transition-colors hover:underline underline-offset-8 decoration-slate-300">Securities Litigation</button>
          <button onClick={() => {setQuery('IP Rights'); navigate('/app?q=IP%20Rights')}} className="font-serif text-sm text-[#0F172A] hover:text-[#cf6721] transition-colors hover:underline underline-offset-8 decoration-slate-300">IP Rights</button>
          <button onClick={() => {setQuery('Privacy Frameworks'); navigate('/app?q=Privacy%20Frameworks')}} className="font-serif text-sm text-[#0F172A] hover:text-[#cf6721] transition-colors hover:underline underline-offset-8 decoration-slate-300">Privacy Frameworks</button>
        </div>
      </section>

      {/* Asymmetric How It Works */}
      <section className="reveal mt-20 md:mt-40 py-12 md:py-24">
        <div className="grid grid-cols-12 gap-12 md:gap-24">
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center lg:pr-12">
            <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-6">Our Protocol</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 md:mb-10 leading-tight">A Methodology of Precision</h2>
            <p className="font-serif text-lg md:text-xl text-slate-500 leading-relaxed mb-8 md:mb-12 opacity-90">
              We apply a rigorous editorial lens to the noise of the legal world. Our process is not just about aggregation, but about deep, human-vetted distillation.
            </p>
            <div className="border-l-4 border-[#cf6721] pl-6 md:pl-10 py-2 reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100">
              <p className="font-serif text-xl md:text-2xl text-[#0F172A] italic font-medium leading-relaxed">"Intellectual rigor is our only standard."</p>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 space-y-16">
            {[
              { id: '01', title: 'Synthesis', text: 'Our AI-assisted synthesis engine parses thousands of pages of court filings and legislative updates daily, identifying the core narrative threads that matter to your practice.' },
              { id: '02', title: 'Editorial Validation', text: 'Every synthesis is reviewed by veteran legal editors. We ensure that nuance is preserved and that the tone remains objective, authoritative, and strictly professional.' },
              { id: '03', title: 'Actionable Delivery', text: 'Insights are delivered in a clean, distraction-free interface. We strip away the unnecessary, leaving you with the clarity required for decisive action.' }
            ].map((step, idx) => (
              <div key={step.id} className={`reveal opacity-0 translate-y-10 transition-all duration-1000 delay-${(idx + 1) * 100} flex flex-col sm:flex-row gap-6 md:gap-12 group`}>
                <div className="shrink-0 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center border-2 border-[#0F172A] font-serif text-2xl md:text-3xl font-bold text-[#0F172A] group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                  {step.id}
                </div>
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-[#0F172A] group-hover:text-[#cf6721] transition-colors">{step.title}</h3>
                  <p className="font-serif text-base md:text-lg text-slate-500 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Contrast Features */}
      <section className="reveal mt-20 md:mt-40 py-20 md:py-32 bg-[#0F172A] text-white px-6 md:px-12 lg:px-24 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24 reveal opacity-0 translate-y-10 transition-all duration-1000 delay-100">
            <h2 className="font-serif text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">Core Competencies</h2>
            <p className="font-sans text-[10px] md:text-sm font-bold text-slate-400 tracking-[0.4em] uppercase">Built for the Modern Advocate</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-16">
            {[
              { icon: 'balance', title: 'Case Precedent', text: 'Access a curated archive of landmark rulings, summarized with a focus on impact and jurisdictional relevance.' },
              { icon: 'gavel', title: 'Regulatory Tracker', text: 'Stay ahead of shifting legislation with real-time alerts tailored to your specific areas of legal expertise.' },
              { icon: 'draw', title: 'Drafting Insights', text: 'Leverage linguistic analysis to refine your briefs and motions, ensuring maximum clarity and persuasive power.' }
            ].map((feature, idx) => (
              <div key={feature.title} className={`reveal opacity-0 translate-y-10 transition-all duration-1000 delay-${(idx + 1) * 200} hover-lift p-8 md:p-12 border border-white/5 hover:border-white/20 bg-white/5 backdrop-blur-sm rounded-xl group`}>
                <span className="material-symbols-outlined text-4xl md:text-5xl mb-6 md:mb-8 block text-[#cf6721] group-hover:scale-110 transition-transform">{feature.icon}</span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">{feature.title}</h3>
                <p className="font-serif text-lg md:text-xl text-slate-300 opacity-70 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Escalation (Split Layout) */}
      <section className="reveal mt-40 py-32">
        <div className="flex flex-col xl:flex-row items-stretch bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden hover:shadow-[#0F172A]/10 transition-shadow duration-700">
          <div className="w-full xl:w-1/2 relative min-h-[600px] overflow-hidden group">
            <img 
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110" 
              alt="Sophisticated law library"
              src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000" 
            />
            <div className="absolute inset-0 bg-[#0F172A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
          <div className="w-full xl:w-1/2 p-8 md:p-24 lg:p-32 flex flex-col justify-center reveal opacity-0 translate-y-10 transition-all duration-1000 delay-200">
            <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-8">Professional Network</span>
            <h2 className="font-serif text-4xl md:text-6xl font-black mb-6 md:mb-10 leading-tight text-[#0F172A]">When Clarity Requires Counsel</h2>
            <p className="font-serif text-lg md:text-xl text-slate-500 mb-8 md:mb-12 leading-relaxed italic">
              While our platform provides the foundation, complex scenarios often demand human intervention. RightSpeak Pro connects you with specialist legal consultants.
            </p>
            <div className="space-y-6 mb-16">
              {[
                "Direct access to subject matter experts",
                "Confidential brief reviews",
                "Custom research reports"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#cf6721] group-hover:bg-[#0F172A] group-hover:text-white transition-all transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <span className="font-serif text-lg font-bold text-[#0F172A] group-hover:translate-x-2 transition-transform">{item}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/experts')}
              className="bg-[#0F172A] text-white px-8 md:px-16 py-4 md:py-6 font-serif text-lg md:text-xl font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all self-start shadow-xl active:scale-95 hover:-translate-y-1"
            >
              Elevate Your Account
            </button>
          </div>
        </div>
      </section>

      {/* Weekly Brief */}
      <section className="reveal mt-20 md:mt-40 py-16 md:py-32 border-t border-slate-100 text-center bg-white/50 backdrop-blur-sm rounded-3xl px-6">
        <div className="max-w-3xl mx-auto">
          <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-slate-300 mb-8 block">The Editorial Digest</span>
          <h2 className="font-serif text-3xl md:text-5xl font-black mb-6 md:mb-8 text-[#0F172A]">The Weekly Brief</h2>
          <p className="font-serif text-lg md:text-2xl text-slate-500 mb-10 md:mb-16 italic opacity-80 leading-relaxed">A curated digest of the week's most critical legal shifts, delivered with brevity and precision.</p>
          <form className="flex flex-col sm:flex-row gap-0 shadow-2xl rounded-xl overflow-hidden border border-slate-100 group focus-within:ring-4 focus-within:ring-[#0F172A]/5 transition-all duration-500" onSubmit={(e) => {e.preventDefault(); alert('Subscribed!')}}>
            <input className="flex-grow border-none focus:ring-0 font-serif text-lg md:text-xl px-6 md:px-10 py-6 md:py-8 bg-white" placeholder="professional.email@firm.com" type="email" required />
            <button className="bg-[#0F172A] text-white px-8 md:px-16 py-6 md:py-8 font-serif text-lg md:text-xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all hover:md:px-20" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
