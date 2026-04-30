import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer({ text }) {
  if (!text) return null;

  return (
    <div className="bg-surface-variant border-l-4 border-outline-variant rounded-r-xl p-6 mt-4">
      <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
        <AlertTriangle size={18} />
        Legal Disclaimer
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed">{text}</p>
    </div>
  );
}
