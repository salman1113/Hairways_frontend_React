import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 👈 Import Auth
import { Menu, X, Scissors, User } from 'lucide-react';
import { Moon, Sun } from 'lucide-react'; // Import Icons
import { useTheme } from '../context/ThemeContext'; // Import Hook

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Book Now', path: '/book' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--bg-secondary)]/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[var(--text-primary)] rounded-full flex items-center justify-center text-[var(--bg-primary)] group-hover:bg-[var(--accent-crimson)] transition-colors">
            <Scissors size={20} />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Hair<span className="text-[var(--accent-crimson)]"> Ways</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--accent-crimson)] ${isActive(link.path) ? 'text-[var(--accent-crimson)] font-semibold' : 'text-[var(--text-primary)]'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors mr-2"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] hover:border-[var(--accent-crimson)] transition-all">
              <User size={18} />
              <span className="text-sm font-medium">{user.username}</span>
            </Link>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-[var(--text-primary)] text-white text-sm font-medium rounded-full hover:bg-[var(--accent-crimson)] transition-all shadow-lg hover:shadow-xl">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[var(--text-primary)]">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--bg-secondary)] border-t border-[var(--border-color)] p-6 flex flex-col gap-4 shadow-xl md:hidden animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-serif font-medium text-[var(--text-primary)] hover:text-[var(--accent-crimson)]"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-[var(--border-color)]" />
          {user ? (
            <Link to="/profile" className="text-lg font-medium">My Profile</Link>
          ) : (
            <Link to="/login" className="text-lg font-medium text-[var(--accent-crimson)]">Sign In / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;