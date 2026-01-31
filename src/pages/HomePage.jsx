import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Search, Star, Flame, ChevronRight, User, 
  Scissors, Zap, Sparkles, Palette, Smile 
} from 'lucide-react';

const HomePage = () => {
  
  // 1. Data with Real Icons (No Emojis)
  const categories = [
    { id: 1, name: 'Haircut', icon: <Scissors size={24} /> },
    { id: 2, name: 'Beard', icon: <User size={24} /> }, // Using User icon for face/beard context as placeholder or import 'User' properly
    { id: 3, name: 'Facial', icon: <Sparkles size={24} /> },
    { id: 4, name: 'Coloring', icon: <Palette size={24} /> },
    { id: 5, name: 'Massage', icon: <Smile size={24} /> },
  ];

  const trendingStyles = [
    { id: 1, name: 'Fade Cut', price: '₹250', rating: '4.8', img: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Beard Shape', price: '₹150', rating: '4.9', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Classic Cut', price: '₹300', rating: '4.7', img: 'https://images.unsplash.com/photo-1593487568720-92097fb460cf?auto=format&fit=crop&q=80&w=300' },
    { id: 4, name: 'Hair Spa', price: '₹500', rating: '4.9', img: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=300' },
  ];

  const stylists = [
    { id: 1, name: 'Alex', level: 'Senior', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Sam', level: 'Expert', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
    { id: 3, name: 'John', level: 'Junior', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100' },
    { id: 4, name: 'Mike', level: 'Senior', img: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&q=80&w=100' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-24">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-24 md:pt-32">

        {/* --- SECTION 1: HEADER & SEARCH --- */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-6">
          
          {/* Greeting */}
          <div className="w-full md:w-auto">
            <p className="text-gray-500 text-sm md:text-base font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--text-primary)]">
              Salman Faris
            </h1>
          </div>

          {/* Search Bar (Full width on Mobile, Fixed width on Desktop) */}
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Find your style..." 
              className="w-full pl-12 pr-4 py-3.5 bg-[var(--card-bg)] border border-transparent focus:border-crimson/30 rounded-2xl shadow-sm outline-none transition text-[var(--text-primary)]"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          {/* Profile Icon (Hidden on Mobile as it's in Greeting, Visible on Desktop) */}
          <Link to="/login" className="hidden md:block p-1 rounded-full border-2 border-crimson hover:scale-105 transition">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
               <User className="text-gray-500" size={24} />
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
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105">
              Book Appointment
            </button>
          </div>
        </div>


        {/* --- SECTION 3: CATEGORIES --- */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-[var(--text-primary)]">Categories</h3>
            <span className="text-crimson text-sm font-medium cursor-pointer hover:underline">View All</span>
          </div>
          
          {/* Mobile: Scroll | Desktop: Grid */}
          <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0">
            {categories.map((cat) => (
              <div key={cat.id} className="group flex flex-col items-center gap-3 min-w-[80px] cursor-pointer">
                <div className="w-20 h-20 bg-[var(--card-bg)] rounded-2xl flex items-center justify-center text-crimson shadow-sm border border-gray-100 dark:border-white/5 group-hover:bg-crimson group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
                  {cat.icon}
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-crimson transition">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>


        {/* --- SECTION 4: TRENDING STYLES --- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-crimson fill-crimson" size={24} />
            <h3 className="font-bold text-xl text-[var(--text-primary)]">Trending Now</h3>
          </div>
          
          {/* Responsive Grid: 2 cols Mobile -> 4 cols Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingStyles.map((style) => (
              <div key={style.id} className="bg-[var(--card-bg)] p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-50 dark:border-white/5">
                <div className="h-40 md:h-56 rounded-2xl overflow-hidden mb-4 relative">
                  <img src={style.img} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-black shadow-md">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> {style.rating}
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-[var(--text-primary)] mb-1">{style.name}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-crimson font-bold">{style.price}</span>
                  <div className="w-8 h-8 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center text-[var(--text-primary)] group-hover:bg-crimson group-hover:text-white transition">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        {/* --- SECTION 5: TOP STYLISTS --- */}
        <div className="mb-8">
          <h3 className="font-bold text-xl text-[var(--text-primary)] mb-6">Top Experts</h3>
          
          {/* Mobile: Scroll | Desktop: Grid */}
          <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto no-scrollbar pb-4">
            {stylists.map((stylist) => (
              <div key={stylist.id} className="min-w-[160px] md:w-full bg-[var(--card-bg)] p-5 rounded-3xl shadow-sm hover:shadow-lg transition border border-gray-50 dark:border-white/5 text-center group cursor-pointer">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img src={stylist.img} alt={stylist.name} className="w-full h-full rounded-full object-cover border-2 border-transparent group-hover:border-crimson transition" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">{stylist.name}</h4>
                <p className="text-xs text-crimson font-medium mb-3 uppercase tracking-wider">{stylist.level}</p>
                <button className="w-full py-2 bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm font-bold rounded-xl group-hover:bg-crimson group-hover:text-white transition">
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