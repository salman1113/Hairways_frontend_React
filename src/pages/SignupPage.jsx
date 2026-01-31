import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRegister = (e) => { e.preventDefault(); navigate('/login'); };

  return (
    // Fixed: min-h-[100dvh] for mobile browser bars, overflow-x-hidden for scroll issue
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300 relative overflow-x-hidden pt-24 pb-24 px-4">
      
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-crimson/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />

      <Navbar />

      <div className="w-full max-w-md z-10 animate-fade-in">
        
        {/* Glass Card - Colors Fixed */}
        <div className="backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl border
          bg-white/80 border-white/50 
          dark:bg-black/40 dark:border-white/20">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Join Hair Ways for premium styling.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Reusable Input Style */}
            {[
              { label: 'Full Name', name: 'name', type: 'text', icon: <User size={18}/>, placeholder: 'Salman Faris' },
              { label: 'Email', name: 'email', type: 'email', icon: <Mail size={18}/>, placeholder: 'hello@example.com' },
              { label: 'Phone Number', name: 'phone', type: 'tel', icon: <Phone size={18}/>, placeholder: '+91 98765 43210' }
            ].map((field) => (
              <div key={field.name} className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">{field.label}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {field.icon}
                  </div>
                  <input 
                    type={field.type} 
                    name={field.name}
                    required
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition
                      bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-crimson focus:bg-white
                      dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-black/40"
                  />
                </div>
              </div>
            ))}

            {/* Password Input */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 rounded-xl outline-none transition
                    bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-crimson focus:bg-white
                    dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:bg-black/40"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-crimson">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full mt-2 bg-crimson hover:bg-ruby text-white py-3.5 rounded-xl font-bold shadow-lg shadow-crimson/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
              Register Now <ArrowRight size={20} />
            </button>

          </form>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-crimson font-bold hover:underline">Login Here</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;