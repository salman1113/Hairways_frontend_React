import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300 relative overflow-x-hidden pt-24 pb-10 px-4">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-crimson/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />

      <Navbar />

      <div className="w-full max-w-md z-10 animate-fade-in">
        
        {/* Glass Card - Colors Fixed */}
        <div className="backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border
          bg-white/80 border-white/50 
          dark:bg-black/40 dark:border-white/20">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-crimson/10 rounded-full text-crimson mb-4">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6">
            
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="hello@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition
                    bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-crimson focus:bg-white
                    dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-black/40"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl outline-none transition
                    bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-crimson focus:bg-white
                    dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-black/40"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-crimson">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="#" className="text-sm text-crimson hover:text-ruby font-medium transition">Forgot Password?</Link>
            </div>

            <button className="w-full bg-crimson hover:bg-ruby text-white py-3.5 rounded-xl font-bold shadow-lg shadow-crimson/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
              Sign In <ArrowRight size={20} />
            </button>

          </form>

          <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <Link to="/signup" className="text-crimson font-bold hover:underline">Create Account</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;