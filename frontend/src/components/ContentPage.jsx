import React from 'react';

export default function ContentPage({ title, label, children }) {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-6">
      <div className="mb-8">
        <span className="font-label-caps text-label-caps text-secondary tracking-widest uppercase block mb-2">{label}</span>
        <h1 className="font-h2 text-h2 text-on-surface">{title}</h1>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-8">
        <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
