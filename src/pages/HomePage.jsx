import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Clock, Sparkles } from 'lucide-react';
import { getCategories, getServices, getEmployees } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, servs, emps] = await Promise.all([
          getCategories(),
          getServices(),
          getEmployees()
        ]);
        setCategories(cats);
        setServices(servs);
        setStylists(emps);
      } catch (error) {
        console.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="animate-fade-in">
      
      {/* 1. HERO SECTION - Big Luxury Image */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           {/* Replace with a high-quality Salon Image */}
           <img 
             src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2070&auto=format&fit=crop" 
             alt="Luxury Salon" 
             className="w-full h-full object-cover filter brightness-[0.6]"
           />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h2 className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 opacity-90">Experience Elegance</h2>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
            Redefine Your <br/> <span className="text-[var(--accent-crimson)]">Signature Style</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/book" className="px-8 py-4 bg-[var(--accent-crimson)] text-white text-lg font-medium rounded-full hover:bg-[#b01e2b] transition-all shadow-2xl hover:scale-105">
              Book Appointment
            </Link>
            <Link to="/services" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg font-medium rounded-full hover:bg-white hover:text-[var(--text-primary)] transition-all">
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES - Minimal Horizontal Scroll */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
           <h3 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Our Specialties</h3>
           <p className="text-[var(--text-secondary)] mt-2">Curated treatments for your every need</p>
        </div>
        
        <div className="flex justify-center flex-wrap gap-6">
          {categories.slice(0, 5).map((cat) => (
            <div key={cat.id} className="group cursor-pointer">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-secondary)] group-hover:border-[var(--accent-crimson)] group-hover:scale-110 transition-all duration-300 shadow-sm">
                <span className="font-serif text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)]">
                    {cat.name.charAt(0)}
                </span>
              </div>
              <p className="text-center mt-4 text-sm font-medium tracking-wide uppercase text-[var(--text-primary)]">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING SERVICES - Grid Layout */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[var(--accent-crimson)] text-sm font-bold uppercase tracking-wider">Trending Now</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mt-2 text-[var(--text-primary)]">Popular Services</h3>
            </div>
            <Link to="/services" className="hidden md:flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--accent-crimson)] transition">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 4).map((srv) => (
              <div key={srv.id} onClick={() => navigate('/book', { state: { selectedService: srv } })} className="group cursor-pointer">
                <div className="relative h-80 overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={srv.image || "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800"} 
                    alt={srv.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    ₹{srv.price}
                  </div>
                </div>
                <h4 className="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-crimson)] transition-colors">
                  {srv.name}
                </h4>
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mt-1">
                  <Clock size={14} /> {srv.duration_minutes || 30} mins
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEET THE EXPERTS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
         <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-[var(--text-primary)]">Meet Our Masters</h3>
            <p className="text-[var(--text-secondary)] mt-3 max-w-2xl mx-auto">
              Our stylists are artists, trained to bring out the best version of you.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {stylists.slice(0, 3).map((stylist) => (
              <div key={stylist.id} className="text-center group">
                 <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[var(--bg-secondary)] shadow-xl mb-6 relative">
                    <img 
                      src={stylist.user_details?.profile_picture || `https://ui-avatars.com/api/?name=${stylist.user_details?.username}&background=random`} 
                      alt={stylist.user_details?.username}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                 </div>
                 <h4 className="text-xl font-bold text-[var(--text-primary)]">{stylist.user_details?.username}</h4>
                 <p className="text-[var(--accent-crimson)] text-sm font-medium uppercase tracking-widest mt-1">
                   {stylist.job_title || "Top Stylist"}
                 </p>
                 <div className="flex justify-center gap-1 mt-3 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
              </div>
            ))}
         </div>
      </section>

    </div>
  );
};

export default HomePage;