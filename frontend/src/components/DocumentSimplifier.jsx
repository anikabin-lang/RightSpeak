import React, { useState, useCallback } from 'react';
import api from '../services/api';
import { Upload, FileText, AlertTriangle, CheckCircle, Info, Loader2, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function DocumentSimplifier() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'text'

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setActiveTab('upload');
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (activeTab === 'upload' && file) {
      formData.append('file', file);
    } else if (activeTab === 'text' && text.trim()) {
      formData.append('text', text);
    } else {
      setError('Please provide a document or some text to analyze.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Document Simplifier</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload legal documents or paste text to get a structured, plain-language breakdown of key clauses and risks.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'upload' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload size={18} />
            Upload Document
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'text' ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={18} />
            Paste Text
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'upload' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Upload size={32} />
                </div>
                {file ? (
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <FileText size={20} className="text-blue-600" />
                    {file.name}
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-slate-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-900 font-medium mb-1">Click or drag document here</p>
                    <p className="text-slate-500 text-sm">PDF, DOCX, or TXT (Max 10MB)</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the legal text you want to simplify here..."
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-700 font-sans"
            />
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading || (activeTab === 'upload' && !file) || (activeTab === 'text' && !text.trim())}
              className="px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Document...
                </>
              ) : (
                'Simplify Document'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
          {/* Summary Section */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-serif">What it Means</h2>
            </div>
            <p className="text-slate-700 leading-relaxed text-lg italic">
              "{result.what_it_means}"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Clauses */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Key Clauses</h3>
              </div>
              <ul className="space-y-3">
                {result.key_clauses.map((clause, i) => (
                  <li key={i} className="flex gap-2 text-slate-600">
                    <span className="text-green-500 mt-1">•</span>
                    {clause}
                  </li>
                ))}
                {result.key_clauses.length === 0 && <li className="text-slate-400 italic">No key clauses identified.</li>}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Red Flags</h3>
              </div>
              <ul className="space-y-3">
                {result.red_flags.map((flag, i) => (
                  <li key={i} className="flex gap-2 text-slate-600">
                    <span className="text-red-500 mt-1">!</span>
                    <span className="font-medium text-slate-800">{flag}</span>
                  </li>
                ))}
                {result.red_flags.length === 0 && <li className="text-slate-400 italic">No red flags identified.</li>}
              </ul>
            </div>
          </div>

          {/* Tone Analysis Section */}
          {result.tone_analysis && (
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  result.tone_analysis.tone === 'Aggressive' ? 'bg-red-50 text-red-600' :
                  result.tone_analysis.tone === 'Strict' ? 'bg-yellow-50 text-yellow-600' :
                  result.tone_analysis.tone === 'Biased' ? 'bg-orange-50 text-orange-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-serif">Emotional Tone</h2>
                  <div className={`text-sm font-bold uppercase tracking-wider ${
                    result.tone_analysis.tone === 'Aggressive' ? 'text-red-600' :
                    result.tone_analysis.tone === 'Strict' ? 'text-yellow-600' :
                    result.tone_analysis.tone === 'Biased' ? 'text-orange-600' :
                    'text-slate-500'
                  }`}>
                    {result.tone_analysis.tone}
                  </div>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">
                {result.tone_analysis.explanation}
              </p>
            </div>
          )}

          {/* Suggested Actions */}
          <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-800 text-blue-400 rounded-lg">
                <CheckCircle size={24} />
              </div>
              <h2 className="text-2xl font-bold font-serif">Suggested Actions</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {result.suggested_actions.map((action, i) => (
                <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-slate-300">{action}</p>
                </div>
              ))}
              {result.suggested_actions.length === 0 && <p className="text-slate-400 italic">No specific actions suggested.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
