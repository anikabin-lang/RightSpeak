import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DummyPage({ title }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-h1 mb-4">{title}</h1>
      <p className="text-on-surface-variant text-lg mb-8">This page is currently under construction. Check back soon!</p>
      <button onClick={() => navigate('/')} className="bg-primary-container text-on-primary px-6 py-2 rounded shadow hover:bg-opacity-90 transition-all">
        Go Back Home
      </button>
    </div>
  );
}
