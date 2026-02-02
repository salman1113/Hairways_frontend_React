import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Login & Get User Data
      const userData = await login(formData.email, formData.password);
      
      // 2. 🔥 ROLE BASED REDIRECT LOGIC
      if (userData.role === 'ADMIN' || userData.role === 'MANAGER') {
        navigate('/admin'); // Admin Dashboard
      } else if (userData.role === 'EMPLOYEE') {
        navigate('/employee'); // Employee Dashboard
      } else {
        navigate('/'); // Customer Home
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 md:p-0">
      
      <div className="w-full max-w-5xl bg-[var(--bg-secondary)] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in">
        
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative hidden md:block">
           <img 
             src="https://images.unsplash.com/photo-1621644827845-ea5c7a36f40b?auto=format&fit=crop&q=80&w=1000" 
             alt="Login Visual" 
             className="absolute inset-0 w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-12">
              <div className="text-white text-center">
                 <h2 className="text-4xl font-serif font-bold mb-4">Welcome Back</h2>
                 <p className="opacity-90 leading-relaxed">Login to access your personalized grooming dashboard and smart booking features.</p>
              </div>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
           <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-2">Sign In</h2>
              <p className="text-[var(--text-secondary)] mb-8">Enter your details to continue</p>

              {error && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                 <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-crimson)] focus:ring-1 focus:ring-[var(--accent-crimson)] outline-none transition"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-crimson)] outline-none transition"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full py-4 bg-[var(--text-primary)] text-white font-bold rounded-xl hover:bg-[var(--accent-crimson)] transition-all flex items-center justify-center gap-2"
                 >
                   {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
                 </button>
              </form>

              <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
                Don't have an account? <Link to="/signup" className="text-[var(--accent-crimson)] font-bold hover:underline">Register here</Link>
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;