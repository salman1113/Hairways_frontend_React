import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Scissors, Home, Grid, Calendar, User, Info } from 'lucide-react';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation(); 
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* --- DESKTOP VIEW (No Changes) --- */}
      <div className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center px-4">
        <nav className={`w-full max-w-5xl rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-300
          ${isDarkMode ? 'bg-black/60 border-white/10 text-white' : 'bg-white/90 border-gray-200 text-gray-900'}`}>
          <div className="px-6 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-crimson rounded-full text-white shadow-lg group-hover:rotate-12 transition-transform">
                <Scissors size={18} />
              </div>
              <span className="text-xl font-serif font-bold tracking-wide">Hair Ways</span>
            </Link>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${isDarkMode ? 'bg-white/10 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
              {[{name: 'Home', path: '/'}, {name: 'Services', path: '/services'}, {name: 'About', path: '/about'}].map((item) => (
                <Link key={item.name} to={item.path} className={`px-5 py-2 rounded-full text-sm font-medium transition ${isActive(item.path) ? 'bg-crimson text-white shadow-md' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link to="/book" className="hidden lg:flex items-center gap-2 px-5 py-2 bg-crimson text-white text-sm font-bold rounded-full shadow-lg hover:bg-ruby transition hover:scale-105">
                <Calendar size={16} /> Book Now
              </Link>
              <Link to="/profile" className={`px-5 py-2 border text-sm font-bold rounded-full transition flex items-center gap-2 ${isActive('/profile') ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black' : (isDarkMode ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-white border-gray-200 hover:bg-gray-50')}`}>
                <User size={16} /> Profile
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* --- MOBILE VIEW (FIXED & SOLID) --- */}
      {/* 1. Top Header */}
      <div className={`md:hidden fixed top-0 w-full z-40 px-4 py-3 flex justify-between items-center border-b transition-colors duration-300
        ${isDarkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-crimson rounded-lg text-white"><Scissors size={16} /></div>
          <span className="text-lg font-serif font-bold">Hair Ways</span>
        </Link>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* 2. FIXED BOTTOM BAR (SOLID COLOR - NO BLUR) */}
      <div className={`md:hidden fixed bottom-0 w-full z-50 border-t shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe transition-colors duration-300
        ${isDarkMode ? 'bg-[#1a0507] border-white/10' : 'bg-white border-gray-200'}`}>
        
        {/* Grid Container */}
        <div className="grid grid-cols-5 h-[65px] relative items-center">
          
          <Link to="/" className="flex flex-col items-center justify-center gap-1">
            <Home size={22} className={isActive('/') ? 'text-crimson fill-crimson/20' : 'text-gray-400'} />
            <span className={`text-[9px] font-bold ${isActive('/') ? 'text-crimson' : 'text-gray-400'}`}>Home</span>
          </Link>

          <Link to="/services" className="flex flex-col items-center justify-center gap-1">
            <Grid size={22} className={isActive('/services') ? 'text-crimson fill-crimson/20' : 'text-gray-400'} />
            <span className={`text-[9px] font-bold ${isActive('/services') ? 'text-crimson' : 'text-gray-400'}`}>Menu</span>
          </Link>

          {/* CENTER FLOATING BUTTON (The Issue Fix) */}
          <div className="flex justify-center items-center relative h-full">
             <div className="absolute -top-8"> {/* Moved slightly higher to sit better */}
                <Link to="/book">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform active:scale-95 border-[4px]
                    ${isDarkMode 
                      ? 'bg-crimson border-[#1a0507]' // Border matches Dark BG exactly
                      : 'bg-crimson border-white'     // Border matches Light BG exactly
                    }`}>
                    <Calendar size={24} />
                  </div>
                </Link>
             </div>
          </div>

          <Link to="/about" className="flex flex-col items-center justify-center gap-1">
             <Info size={22} className={isActive('/about') ? 'text-crimson fill-crimson/20' : 'text-gray-400'} />
             <span className={`text-[9px] font-bold ${isActive('/about') ? 'text-crimson' : 'text-gray-400'}`}>About</span>
          </Link>
          
          <Link to="/profile" className="flex flex-col items-center justify-center gap-1">
            <User size={22} className={isActive('/profile') ? 'text-crimson fill-crimson/20' : 'text-gray-400'} />
            <span className={`text-[9px] font-bold ${isActive('/profile') ? 'text-crimson' : 'text-gray-400'}`}>Profile</span>
          </Link>

        </div>
      </div>
    </>
  );
};

export default Navbar;