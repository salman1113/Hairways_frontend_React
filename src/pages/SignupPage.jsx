import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api'; // Correct API Import
import { Loader2, ArrowRight, User, Mail, Lock, Phone } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  
  // 🔥 Updated State to match Django Model
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    phone_number: '', 
    password: '' 
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Backend expects: { username, email, phone_number, password }
      await registerUser(formData);
      
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      console.error("Signup Error:", err);
      if (err.response && err.response.data) {
          // Extract specific error message from Django response
          const errorMsg = Object.values(err.response.data).flat()[0]; 
          setError(errorMsg || "Registration failed. Try again.");
      } else {
          setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 md:p-0">
      <div className="w-full max-w-5xl bg-[var(--bg-secondary)] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] animate-fade-in">
        
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 relative hidden md:block">
           <img 
             src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=1000" 
             alt="Signup Visual" 
             className="absolute inset-0 w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-12">
              <div className="text-white text-center">
                 <h2 className="text-4xl font-serif font-bold mb-4">Join the Elite</h2>
                 <p className="opacity-90 leading-relaxed text-lg">
                   Create an account to unlock exclusive grooming services, AI style recommendations, and priority booking.
                 </p>
              </div>
           </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
           <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-2">Create Account</h2>
              <p className="text-[var(--text-secondary)] mb-6">Begin your journey with LaraStyles</p>

              {error && (
                <div className="p-3 mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-fade-in">
                    ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                 
                 {/* Full Name (Username) */}
                 <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={20} />
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-crimson)] focus:ring-1 focus:ring-[var(--accent-crimson)] outline-none transition"
                          placeholder="John Doe"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          required
                        />
                    </div>
                 </div>

                 {/* Email */}
                 <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={20} />
                        <input 
                          type="email" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-crimson)] focus:ring-1 focus:ring-[var(--accent-crimson)] outline-none transition"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                    </div>
                 </div>

                 {/* Phone Number (Matches Backend Model) */}
                 <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={20} />
                        <input 
                          type="tel" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-crimson)] focus:ring-1 focus:ring-[var(--accent-crimson)] outline-none transition"
                          placeholder="+91 98765 43210"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                          required
                        />
                    </div>
                 </div>

                 {/* Password */}
                 <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-[var(--text-secondary)]" size={20} />
                        <input 
                          type="password" 
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-crimson)] focus:ring-1 focus:ring-[var(--accent-crimson)] outline-none transition"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full py-4 bg-[var(--text-primary)] text-white font-bold rounded-xl hover:bg-[var(--accent-crimson)] transition-all flex items-center justify-center gap-2 mt-6 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                 >
                   {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                 </button>
              </form>

              <p className="text-center mt-6 text-sm text-[var(--text-secondary)]">
                Already have an account? <Link to="/login" className="text-[var(--accent-crimson)] font-bold hover:underline">Sign In</Link>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;