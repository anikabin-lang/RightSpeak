import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { rightsDB } from '../data/rightsDB';
import { getUser, logout } from '../services/auth';

export default function Layout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(getUser());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const lowerQuery = searchTerm.toLowerCase();
      const filtered = rightsDB.filter(
        r => r.title.toLowerCase().includes(lowerQuery) || r.laws.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRight = (right) => {
    setSearchTerm('');
    setShowDropdown(false);
    navigate(`/app?q=${encodeURIComponent(right.title + ' under ' + right.laws)}`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setShowDropdown(false);
      navigate(`/app?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  return (
    <div className="bg-[#FAF9F8] dark:bg-slate-950 text-[#0F172A] dark:text-white min-h-screen flex flex-col antialiased bg-grain">
      <header className="bg-[#FAF9F8]/90 backdrop-blur-md dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-shadow duration-300">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center px-12 py-8 w-full">
          <div className="flex items-center gap-12">
            <Link to="/" className="text-4xl font-serif font-black tracking-tighter text-[#0F172A] dark:text-white uppercase shrink-0 hover:opacity-80 transition-opacity">RightSpeak</Link>
            <nav className="hidden xl:flex items-center space-x-10">
              <Link className="nav-link-underline text-[#0F172A] dark:text-white font-serif text-lg tracking-tight transition-colors" to="/dashboard">Dashboard</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/consultations">Consultations</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/library">Law Library</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/simplify">Simplify</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/voice">Voice</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/tracking">Archive</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-8">
            {/* Refined Search Bar */}
            <div className="relative group hidden lg:block" ref={dropdownRef}>
              <div className="absolute inset-y-0 left-4 flex items-center">
                <span className="material-symbols-outlined text-slate-300 text-xl group-focus-within:text-[#0F172A] transition-colors">search</span>
              </div>
              <input 
                className="pl-12 pr-4 py-3 bg-white border border-slate-200 focus:border-[#0F172A] focus:ring-0 font-serif text-base transition-all w-[320px] shadow-sm focus:shadow-xl" 
                placeholder="Search Archive..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (searchTerm.length >= 3) setShowDropdown(true); }}
                onKeyDown={handleSearchSubmit}
              />
              
              {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full max-h-[400px] overflow-y-auto bg-white border border-slate-200 shadow-2xl z-[100]">
                  <div className="px-5 py-3 bg-slate-50 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                    Jurisdictional Results
                  </div>
                  {results.map((result) => (
                    <button 
                      key={result.id} 
                      onClick={() => handleSelectRight(result)}
                      className="w-full text-left px-8 py-5 hover:bg-slate-50 transition-colors border-b border-slate-100 flex flex-col gap-1"
                    >
                      <span className="font-serif text-lg text-[#0F172A] font-bold leading-tight">{result.title}</span>
                      <span className="text-xs text-slate-400 font-serif italic">{result.laws}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="font-serif text-sm font-bold text-[#0F172A] dark:text-white uppercase tracking-tighter">Account</span>
                    <span className="font-serif text-lg text-slate-400 italic leading-none">{user.name}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-xs font-sans font-bold uppercase tracking-widest text-[#cf6721] hover:text-[#0F172A] transition-colors border-l border-slate-200 pl-4 ml-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-[#0F172A] dark:text-slate-100 font-serif text-lg tracking-tight hover:opacity-70 transition-opacity">Log In</Link>
                  <Link to="/app" className="bg-[#0F172A] text-white px-8 py-3 font-serif text-lg tracking-tight hover:bg-slate-800 transition-colors shadow-lg">Start Inquiry</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col pt-0">
        <Outlet />
      </main>

      <footer className="bg-[#FAF9F8] dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-32">
        <div className="max-w-[1120px] mx-auto flex flex-col items-center py-16 px-8 text-center space-y-8">
          <div className="text-xl font-serif font-bold text-[#0F172A] dark:text-white uppercase">RightSpeak</div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link className="font-serif text-sm leading-relaxed text-slate-500 dark:text-slate-400 hover:underline decoration-1 underline-offset-4 transition-all duration-200" to="/terms">Terms of Service</Link>
            <Link className="font-serif text-sm leading-relaxed text-slate-500 dark:text-slate-400 hover:underline decoration-1 underline-offset-4 transition-all duration-200" to="/privacy">Privacy Policy</Link>
            <Link className="font-serif text-sm leading-relaxed text-slate-500 dark:text-slate-400 hover:underline decoration-1 underline-offset-4 transition-all duration-200" to="/compliance">Editorial Guidelines</Link>
            <Link className="font-serif text-sm leading-relaxed text-slate-500 dark:text-slate-400 hover:underline decoration-1 underline-offset-4 transition-all duration-200" to="/experts">Contact</Link>
          </nav>
          <p className="font-serif text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl">
            © 2026 RightSpeak Journal. Established with intellectual rigor. All rights reserved. Legal Disclaimer: Content provided for informational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
