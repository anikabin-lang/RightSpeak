import React, { useState, useEffect } from 'react';
import { Book, Scale, Shield, Users, Search, ChevronRight, Info, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function LawLibrary() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lawData, setLawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/library/categories');
      setCategories(res.data);
      if (res.data.length > 0) {
        handleCategoryClick(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleCategoryClick = async (category, path = null) => {
    setSelectedCategory(category);
    
    // If it has sub-laws but no path provided, just expand it
    if (category.sub_laws && !path) {
      return;
    }

    const loadPath = path || category.path;
    setSearchResults(null);
    setSearchTerm('');
    setLoading(true);
    try {
      const res = await api.get(`/library/law?path=${loadPath}`);
      setLawData(res.data);
    } catch (err) {
      console.error("Failed to fetch law data", err);
      setLawData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 2) {
      try {
        const res = await api.get(`/library/search?q=${query}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search failed", err);
      }
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 font-serif mb-4 flex items-center gap-2">
            <Book size={24} className="text-blue-600" />
            Law Library
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search Article or Section..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {categories.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => handleCategoryClick(cat)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory?.id === cat.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {cat.id === 'constitution' && <Shield size={18} />}
                  {cat.id === 'criminal' && <Scale size={18} />}
                  {cat.id === 'labour' && <Users size={18} />}
                  {cat.name}
                </div>
                {cat.sub_laws && (
                  <ChevronRight size={16} className={`transition-transform ${selectedCategory?.id === cat.id ? 'rotate-90' : ''}`} />
                )}
              </button>
              
              {cat.sub_laws && selectedCategory?.id === cat.id && (
                <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  {cat.sub_laws.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleCategoryClick(cat, sub.path)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-12">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : searchResults ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Search Results</h1>
              <p className="text-slate-500">Found {searchResults.length} matches for "{searchTerm}"</p>
            </div>
            <div className="grid gap-6">
              {searchResults.map((item, i) => (
                <DetailCard key={i} item={item} showCategory />
              ))}
            </div>
          </div>
        ) : lawData ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4 font-serif">
                {lawData.name || lawData.law}
              </h1>
            </div>

            {/* Constitution View (Parts -> Articles) */}
            {lawData.parts && (
              <div className="space-y-12">
                {lawData.parts.map((part, i) => (
                  <div key={i} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-400 font-serif uppercase tracking-widest">{part.part}:</h2>
                      <h3 className="text-xl font-bold text-slate-900 font-serif">{part.title}</h3>
                    </div>
                    <div className="grid gap-6">
                      {part.articles?.map((art, j) => (
                        <DetailCard key={j} item={art} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* General Law View (Chapters -> Sections) */}
            {lawData.chapters && (
              <div className="space-y-12">
                {lawData.chapters.map((chap, i) => (
                  <div key={i} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-400 font-serif uppercase tracking-widest">{chap.chapter}:</h2>
                      <h3 className="text-xl font-bold text-slate-900 font-serif">{chap.title}</h3>
                    </div>
                    <div className="grid gap-6">
                      {chap.sections?.map((sec, j) => (
                        <DetailCard key={j} item={sec} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Simple List View (Sections) */}
            {lawData.sections && !lawData.chapters && (
              <div className="grid gap-6">
                {lawData.sections.map((sec, i) => (
                  <DetailCard key={i} item={sec} />
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {!lawData.parts && !lawData.chapters && !lawData.sections && (
              <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <p className="text-slate-400 italic">This law's contents are currently being updated.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Book size={64} className="mb-4 opacity-20" />
            <p className="text-lg">Select a category to browse the Law Library</p>
          </div>
        )}
      </main>
    </div>
  );
}

function DetailCard({ item, showCategory = false }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {item.article || item.section}
              </span>
              {showCategory && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              )}
            </div>
            <h4 className="text-2xl font-bold text-slate-900 font-serif">{item.title}</h4>
          </div>
        </div>
        
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          {item.summary}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Info size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Interpretation</p>
              <p className="text-sm text-slate-700 italic">Simplified for common understanding.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Real-Life Example</p>
              <p className="text-sm text-slate-700">{item.example}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
