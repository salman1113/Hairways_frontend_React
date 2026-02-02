import React, { useState, useEffect } from 'react';
import { getServices } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getServices().then(setServices).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[var(--accent-crimson)]" size={40} /></div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen animate-fade-in">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--text-primary)] mb-4">Our Services</h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Explore our wide range of premium grooming services designed to make you look and feel your best.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
             <div className="h-64 overflow-hidden">
                <img 
                  src={service.image || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800"} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
             </div>
             <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold font-serif text-[var(--text-primary)]">{service.name}</h3>
                   <span className="text-lg font-bold text-[var(--accent-crimson)]">₹{service.price}</span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mb-6 line-clamp-2">
                   {service.description || "A premium service tailored for your style."}
                </p>
                <button 
                   onClick={() => navigate('/book', { state: { selectedService: service } })}
                   className="w-full py-3 border border-[var(--text-primary)] text-[var(--text-primary)] rounded-xl font-bold hover:bg-[var(--text-primary)] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                   Book Now <ArrowRight size={16} />
                </button>
             </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ServicesPage;