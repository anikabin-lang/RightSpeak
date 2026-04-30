import React from 'react';

export default function RightsList({ items }) {
  if (!items || items.length === 0) return null;
  
  return (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-xl mt-0.5" style={{fontVariationSettings: "'FILL' 1"}}>label_important</span>
          <span className="font-body-md text-body-md text-on-surface leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
