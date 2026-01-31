import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; // API Call
import { useAuth } from '../context/AuthContext'; // 👈 IMPORT THIS
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 GET LOGIN FUNCTION FROM CONTEXT
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Call API
      const response = await loginUser(credentials.email, credentials.password);
      
      // 2. Update Context & Save Token (This updates Navbar instantly)
      login(response.access, response.refresh);

      // 3. Go to Home
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-primary)] transition-colors duration-300 relative overflow-x-hidden pt-24 pb-10 px-4">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-crimson/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md z-10 animate-fade-in">
        
        {/* Glass Card */}
        <div className="backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border bg-white/80 border-white/50 dark:bg-black/40 dark:border-white/20">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-crimson/10 rounded-full text-crimson mb-4">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                <input type="email" name="email" required placeholder="hello@example.com" onChange={handleChange} className="w-full pl-10 pr-4 py-3 rounded-xl outline-none bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-crimson dark:bg-white/5 dark:border-white/10 dark:text-white" />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" onChange={handleChange} className="w-full pl-10 pr-10 py-3 rounded-xl outline-none bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-crimson dark:bg-white/5 dark:border-white/10 dark:text-white" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-crimson">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-crimson hover:bg-ruby text-white py-3.5 rounded-xl font-bold shadow-lg shadow-crimson/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
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