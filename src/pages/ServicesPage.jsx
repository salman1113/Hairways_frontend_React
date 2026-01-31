import React, { useState, useEffect } from 'react';
import { getServices, getCategories } from '../services/api'; // 👈 Named Imports
import { Search, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Data from Django
        const [servicesData, categoriesData] = await Promise.all([
          getServices(),
          getCategories()
        ]);

        console.log("Services Fetched:", servicesData); // Debugging

        // 2. Set Services
        setServices(servicesData);

        // 3. Set Categories (Add 'All' manually at the beginning)
        setCategories([{ id: 'All', name: 'All' }, ...categoriesData]);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Could not load services. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const handleBookClick = (service) => {
    navigate('/book', { state: { selectedService: service } });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-28 pt-24 md:pt-32 px-5">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[var(--text-primary)] mb-4">Our Menu</h1>
          <div className="relative">
             <input type="text" placeholder="Search services..." className="w-full pl-12 pr-4 py-3 bg-[var(--card-bg)] rounded-xl border border-gray-100 dark:border-white/5 shadow-sm focus:ring-2 focus:ring-crimson outline-none text-[var(--text-primary)]" />
             <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center h-40 items-center">
            <Loader2 className="animate-spin text-crimson" size={32} />
          </div>
        ) : error ? (
          // Error State
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-red-500 flex items-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        ) : (
          <>
            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)} 
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id 
                    ? 'bg-crimson text-white shadow-md' 
                    : 'bg-[var(--card-bg)] text-[var(--text-primary)] border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {cat.name} {/* Django field is 'name' */}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <div key={service.id} className="bg-[var(--card-bg)] p-4 rounded-2xl flex gap-4 shadow-sm border border-gray-50 dark:border-white/5 hover:shadow-md transition group">
                    
                    {/* Image Handling */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-white/5">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                      )}
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-[var(--text-primary)] line-clamp-1">{service.name}</h3>
                          <span className="text-crimson font-bold">₹{service.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{service.description}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        {/* Django returns 'duration_minutes' */}
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} /> {service.duration_minutes} min
                        </div>
                        
                        <button 
                          onClick={() => handleBookClick(service)}
                          className="px-4 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-bold rounded-lg hover:bg-crimson hover:text-white transition flex items-center gap-1"
                        >
                          Book <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-400">
                  <p>No services found in this category.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;