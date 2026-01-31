import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { Search, Clock, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 👈 1. Import This

const ServicesPage = () => {
  const navigate = useNavigate(); // 👈 2. Setup Hook
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, categoriesData] = await Promise.all([
          api.getServices(),
          api.getCategories()
        ]);
        setServices(servicesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  // 👈 3. Booking Function
  const handleBookClick = (service) => {
    // സർവീസ് വിവരങ്ങളുമായി ബുക്കിംഗ് പേജിലേക്ക് പോകുക
    navigate('/book', { state: { selectedService: service } });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-28">
      <Navbar />
      <div className="pt-24 md:pt-32 max-w-5xl mx-auto px-5">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">Our Menu</h1>
          {/* Search Bar Code Same as Before... */}
          <div className="relative">
             <input type="text" placeholder="Search services..." className="w-full pl-12 pr-4 py-3 bg-[var(--card-bg)] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm focus:ring-2 focus:ring-crimson outline-none text-[var(--text-primary)]" />
             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center h-40"><Loader2 className="animate-spin text-crimson" /></div>
        ) : (
          <>
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-crimson text-white' : 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-gray-100 dark:border-white/5'}`}>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-[var(--card-bg)] p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-50 dark:border-white/5 hover:shadow-md transition group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-[var(--text-primary)]">{service.name}</h3>
                        <span className="text-crimson font-bold">₹{service.price}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{service.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-400"><Clock size={12} /> {service.duration}</div>
                      
                      {/* 👈 4. Attach Click Handler Here */}
                      <button 
                        onClick={() => handleBookClick(service)}
                        className="px-4 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-bold rounded-lg hover:bg-crimson hover:text-white transition flex items-center gap-1"
                      >
                        Book <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;