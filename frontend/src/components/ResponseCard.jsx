import React from 'react';

export default function ResponseCard({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-white border-l-4 border-slate-900 shadow-sm p-10 hover-lift transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-slate-50 text-slate-900">
          {icon}
        </div>
        <h2 className="font-headline-md text-headline-md text-[#0F172A] tracking-tight">
          {title}
        </h2>
      </div>
      <div className="font-serif text-lg text-slate-700 leading-relaxed antialiased">
        {children}
      </div>
    </div>
  );
}
