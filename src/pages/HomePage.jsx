import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Search, Star, Flame, ChevronRight, User, 
  Scissors, Zap, Sparkles, Palette, Smile, Loader2 
} from 'lucide-react';
// API Imports
import { getCategories, getServices, getEmployees, getUserProfile } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  
  // States for Real Data
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch All Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel for speed
        const [catsData, servicesData, employeesData, userData] = await Promise.all([
          getCategories(),
          getServices(),
          getEmployees(),
          getUserProfile().catch(() => null) // Ignore error if user is not logged in (Guest)
        ]);

        setCategories(catsData);
        setServices(servicesData); // We will show first 4 as "Trending"
        setStylists(employeesData);
        setUser(userData);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🛠 Helper: Map Category Name to Icon
  const getCategoryIcon = (catName) => {
    const name = catName.toLowerCase();
    if (name.includes('hair') || name.includes('cut')) return <Scissors size={24} />;
    if (name.includes('beard') || name.includes('shave')) return <User size={24} />;
    if (name.includes('color') || name.includes('dye')) return <Palette size={24} />;
    if (name.includes('spa') || name.includes('facial')) return <Sparkles size={24} />;
    if (name.includes('massage')) return <Smile size={24} />;
    return <Zap size={24} />; // Default Icon
  };

  // 🔗 Handle Booking Navigation
  const handleBookService = (service) => {
    navigate('/book', { state: { selectedService: service } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-crimson" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-24">
      
      {/* Navbar (Assuming it's global, but included here for layout spacing) */}
      {/* <Navbar /> */} 

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-24 md:pt-32 animate-fade-in">

        {/* --- SECTION 1: HEADER & SEARCH --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-6">
          
          {/* Greeting */}
          <div className="w-full md:w-auto">
            <p className="text-[var(--text-secondary)] text-sm md:text-base font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)]">
              {user?.username || "Guest"}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Find your style..." 
              className="w-full pl-12 pr-4 py-3.5 bg-[var(--card-bg)] border border-[var(--border-color)] focus:border-crimson/50 rounded-2xl shadow-sm outline-none transition text-[var(--text-primary)]"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          {/* Desktop Profile Icon */}
          <Link to={user ? "/profile" : "/login"} className="hidden md:block p-1 rounded-full border-2 border-crimson hover:scale-105 transition">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
               {user?.profile_picture ? (
                 <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="text-gray-500" size={24} />
               )}
            </div>
          </Link>
        </div>


        {/* --- SECTION 2: HERO BANNER (Desktop Only) --- */}
        <div className="hidden md:flex relative w-full h-[400px] bg-black rounded-3xl overflow-hidden mb-12 items-center">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1200" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 p-12 max-w-2xl">
            <span className="bg-crimson text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
              New Arrival
            </span>
            <h2 className="text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Unlock Your <br/> <span className="text-crimson">Perfect Look.</span>
            </h2>
            <Link to="/services" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 inline-block">
              Book Appointment
            </Link>
          </div>
        </div>


        {/* --- SECTION 3: CATEGORIES (Real Data) --- */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-[var(--text-primary)]">Categories</h3>
            <Link to="/services" className="text-crimson text-sm font-medium cursor-pointer hover:underline">View All</Link>
          </div>
          
          <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0">
            {categories.length > 0 ? categories.map((cat) => (
              <div key={cat.id} className="group flex flex-col items-center gap-3 min-w-[80px] cursor-pointer">
                <div className="w-20 h-20 bg-[var(--card-bg)] rounded-2xl flex items-center justify-center text-crimson shadow-sm border border-[var(--border-color)] group-hover:bg-crimson group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
                  {getCategoryIcon(cat.name)}
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-crimson transition truncate w-full text-center">
                  {cat.name}
                </span>
              </div>
            )) : (
               <p className="text-xs text-[var(--text-secondary)]">No categories loaded.</p>
            )}
          </div>
        </div>


        {/* --- SECTION 4: TRENDING STYLES (Real Services) --- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-crimson fill-crimson" size={24} />
            <h3 className="font-bold text-xl text-[var(--text-primary)]">Trending Services</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Taking first 4 services as "Trending" */}
            {services.slice(0, 4).map((style) => (
              <div key={style.id} onClick={() => handleBookService(style)} className="bg-[var(--card-bg)] p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-[var(--border-color)]">
                <div className="h-40 md:h-56 rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src={style.image || "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=300"} 
                    alt={style.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-black shadow-md">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-[var(--text-primary)] mb-1 truncate">{style.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-crimson font-bold">₹{style.price}</span>
                  <div className="w-8 h-8 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-primary)] group-hover:bg-crimson group-hover:text-white transition">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        {/* --- SECTION 5: TOP STYLISTS (Real Employees) --- */}
        <div className="mb-8">
          <h3 className="font-bold text-xl text-[var(--text-primary)] mb-6">Top Experts</h3>
          
          <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto no-scrollbar pb-4">
            {stylists.slice(0, 4).map((stylist) => (
              <div key={stylist.id} className="min-w-[160px] md:w-full bg-[var(--card-bg)] p-5 rounded-3xl shadow-sm hover:shadow-lg transition border border-[var(--border-color)] text-center group cursor-pointer">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img 
                    src={stylist.user_details?.profile_picture || `https://ui-avatars.com/api/?name=${stylist.user_details?.username || 'S'}&background=random`} 
                    alt={stylist.user_details?.username} 
                    className="w-full h-full rounded-full object-cover border-2 border-transparent group-hover:border-crimson transition" 
                  />
                  {stylist.is_available && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-[var(--card-bg)] rounded-full"></div>
                  )}
                </div>
                <h4 className="font-bold text-[var(--text-primary)] truncate">{stylist.user_details?.username || "Stylist"}</h4>
                <p className="text-xs text-crimson font-medium mb-3 uppercase tracking-wider">{stylist.job_title || "Barber"}</p>
                
                {/* Book Specific Stylist - Redirects to Booking Page */}
                <button 
                    onClick={() => navigate('/book')} 
                    className="w-full py-2 bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm font-bold rounded-xl group-hover:bg-crimson group-hover:text-white transition"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;