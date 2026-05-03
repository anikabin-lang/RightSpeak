import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { rightsDB } from '../data/rightsDB';
import { getUser, logout } from '../services/auth';

export default function Layout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(getUser());
  const dropdownRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <div className="max-w-[1440px] mx-auto flex justify-between items-center px-6 md:px-12 py-4 md:py-8 w-full">
          <div className="flex items-center gap-2 md:gap-12">
            <button 
              className="xl:hidden p-2 text-[#0F172A] dark:text-white flex items-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="material-symbols-outlined text-2xl md:text-3xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
            <Link to="/" className="text-lg md:text-4xl font-serif font-black tracking-tighter text-[#0F172A] dark:text-white uppercase shrink-0 hover:opacity-80 transition-opacity">RightSpeak</Link>
          </div>

          <div className="flex items-center gap-6 md:gap-10">
            <nav className="hidden xl:flex items-center space-x-10">
              <Link className="nav-link-underline text-[#0F172A] dark:text-white font-serif text-lg tracking-tight transition-colors" to="/dashboard">Dashboard</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/consultations">Consultations</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/library">Law Library</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/simplify">Simplify</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/voice">Voice</Link>
              <Link className="nav-link-underline text-slate-400 dark:text-slate-500 font-serif text-lg tracking-tight hover:text-[#0F172A] transition-colors" to="/tracking">Archive</Link>
            </nav>
            
            <div className="flex items-center gap-2 md:gap-8">
              {/* Inquiry Button */}
              <Link to="/app" className="flex items-center gap-2 bg-[#0F172A] text-white px-3 md:px-6 py-2 md:py-2.5 font-serif text-xs md:text-base tracking-tight hover:bg-slate-800 transition-colors shadow-sm shrink-0">
                <span className="material-symbols-outlined text-lg md:text-xl">add</span>
                <span className="hidden xs:inline">New Inquiry</span>
                <span className="xs:hidden">Inquiry</span>
              </Link>

              <div className="flex items-center gap-4 md:gap-6 shrink-0">
                {user ? (
                  <div className="flex items-center gap-2 md:gap-4">
                    <button 
                      onClick={logout}
                      className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-widest text-[#cf6721] hover:text-[#0F172A] transition-colors border-l border-slate-200 pl-4"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 md:gap-8">
                    <Link to="/login" className="text-[#0F172A] dark:text-slate-100 font-serif text-xs md:text-lg tracking-tight hover:opacity-70 transition-opacity">Log In</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:hidden border-t border-slate-100 bg-white/50 backdrop-blur-sm overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-10 px-8 py-4 whitespace-nowrap">
            <NavLink end className={({ isActive }) => `${isActive ? 'text-[#0F172A] font-bold border-b-2 border-[#0F172A]' : 'text-slate-400'} font-serif text-sm tracking-tight pb-1`} to="/dashboard">Dashboard</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? 'text-[#0F172A] font-bold border-b-2 border-[#0F172A]' : 'text-slate-400'} font-serif text-sm tracking-tight pb-1`} to="/consultations">Consultations</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? 'text-[#0F172A] font-bold border-b-2 border-[#0F172A]' : 'text-slate-400'} font-serif text-sm tracking-tight pb-1`} to="/library">Law Library</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? 'text-[#0F172A] font-bold border-b-2 border-[#0F172A]' : 'text-slate-400'} font-serif text-sm tracking-tight pb-1`} to="/simplify">Simplify</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? 'text-[#0F172A] font-bold border-b-2 border-[#0F172A]' : 'text-slate-400'} font-serif text-sm tracking-tight pb-1`} to="/voice">Voice</NavLink>
            <NavLink className={({ isActive }) => `${isActive ? 'text-[#0F172A] font-bold border-b-2 border-[#0F172A]' : 'text-slate-400'} font-serif text-sm tracking-tight pb-1`} to="/tracking">Archive</NavLink>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="xl:hidden fixed inset-0 top-[73px] md:top-[113px] bg-white dark:bg-slate-950 z-50 overflow-y-auto animate-slide-in">
            <nav className="flex flex-col p-8 space-y-6">
              <Link className="text-2xl font-serif text-[#0F172A] dark:text-white" to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link className="text-2xl font-serif text-slate-400" to="/consultations" onClick={() => setIsMenuOpen(false)}>Consultations</Link>
              <Link className="text-2xl font-serif text-slate-400" to="/library" onClick={() => setIsMenuOpen(false)}>Law Library</Link>
              <Link className="text-2xl font-serif text-slate-400" to="/simplify" onClick={() => setIsMenuOpen(false)}>Simplify</Link>
              <Link className="text-2xl font-serif text-slate-400" to="/voice" onClick={() => setIsMenuOpen(false)}>Voice</Link>
              <Link className="text-2xl font-serif text-slate-400" to="/tracking" onClick={() => setIsMenuOpen(false)}>Archive</Link>
              
              <div className="pt-8 border-t border-slate-100">
                <Link 
                  to="/app" 
                  className="w-full flex items-center justify-center gap-3 bg-[#0F172A] text-white py-4 font-serif text-lg tracking-tight shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="material-symbols-outlined">add</span>
                  New Inquiry
                </Link>
              </div>
            </nav>
          </div>
        )}
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
