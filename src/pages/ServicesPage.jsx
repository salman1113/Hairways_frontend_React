import React, { useState, useEffect, useMemo } from 'react';
import { getServices, getCategories } from '../services/api';
import { Loader2, Search } from 'lucide-react';

// Components
import ServiceCard from '../components/services/ServiceCard';
import CategoryFilter from '../components/services/CategoryFilter';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [srvData, catData] = await Promise.all([getServices(), getCategories()]);
        setServices(srvData);
        setCategories(catData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter Logic
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory = activeCategory ? service.category === activeCategory : true;
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#D72638]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Hero Section */}
      <div className="bg-[#3F0D12] text-white pt-32 pb-16 px-6 text-center rounded-b-[3rem] shadow-xl mb-8 relative overflow-hidden">
        {/* Background Pattern (Optional) */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-fade-in-up">Our Premium Menu</h1>
          <p className="text-gray-300 mb-8 animate-fade-in-up delay-100">
            Discover the perfect treatment for your style. From classic cuts to rejuvenating facials.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto animate-fade-in-up delay-200">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for 'Haircut', 'Facial'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white/95 backdrop-blur shadow-lg focus:outline-none focus:ring-4 focus:ring-[#D72638]/30 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#3F0D12] font-serif">
            {activeCategory ? categories.find(c => c.id === activeCategory)?.name : 'All Services'}
          </h2>
          <span className="text-gray-500 text-sm font-medium">{filteredServices.length} results</span>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No services found matching your criteria.</p>
            <button onClick={() => { setActiveCategory(null); setSearchQuery(''); }} className="mt-4 text-[#D72638] font-bold hover:underline">
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ServicesPage;