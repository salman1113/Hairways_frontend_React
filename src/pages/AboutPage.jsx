import React from 'react';
import Navbar from '../components/Navbar';
import { Scissors, Award, Users, Star, Clock, MapPin, Sparkles } from 'lucide-react';

const AboutPage = () => {
  // Mock Data for Team
  const team = [
    { id: 1, name: 'Alex John', role: 'Master Stylist', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Sam Mathew', role: 'Beard Specialist', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Rahul K', role: 'Senior Stylist', img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200' },
  ];

  // Stats Data
  const stats = [
    { id: 1, label: 'Happy Clients', value: '5000+', icon: <Users size={20} /> },
    { id: 2, label: 'Years Experience', value: '5+', icon: <Clock size={20} /> },
    { id: 3, label: 'Awards Won', value: '10', icon: <Award size={20} /> },
    { id: 4, label: 'Rating', value: '4.9', icon: <Star size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-28 overflow-x-hidden">
      <Navbar />

      {/* --- SECTION 1: HERO BANNER --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-befbb7470d03?auto=format&fit=crop&q=80&w=1200" 
            alt="Salon Background" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]"></div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-crimson/10 border border-crimson/20 text-crimson text-sm font-bold mb-4 backdrop-blur-md">
            <Sparkles size={14} /> Since 2020
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[var(--text-primary)] mb-4">
            More Than Just <br/> <span className="text-crimson">A Haircut.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-300 max-w-lg mx-auto text-sm md:text-base">
            We don't just style hair; we craft confidence. Experience premium grooming tailored exclusively for you.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 -mt-20 relative z-20">
        
        {/* --- SECTION 2: OUR STORY (Glass Card) --- */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl mb-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--text-primary)] mb-4">
                Our Story
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 text-sm md:text-base">
                Started in a small garage in Calicut, <strong>Hair Ways</strong> was born out of a passion for perfection. We realized that men's grooming was often overlooked, and we wanted to change that.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                Today, we are more than a salon. We are a community where style meets comfort. Whether it's a classic fade or a modern beard sculpt, our masters are here to make you look your absolute best.
              </p>
            </div>
            {/* Image Grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=300" className="rounded-2xl h-40 w-full object-cover transform translate-y-4" alt="Story 1" />
              <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=300" className="rounded-2xl h-40 w-full object-cover" alt="Story 2" />
            </div>
          </div>
        </div>


        {/* --- SECTION 3: STATS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-[var(--card-bg)] p-6 rounded-2xl border border-gray-100 dark:border-white/5 text-center hover:scale-105 transition duration-300">
              <div className="w-10 h-10 mx-auto bg-crimson/10 rounded-full flex items-center justify-center text-crimson mb-2">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>


        {/* --- SECTION 4: MEET THE TEAM --- */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--text-primary)]">Meet The Masters</h2>
            <p className="text-gray-500 text-sm mt-2">The hands behind the magic.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.id} className="group relative overflow-hidden rounded-2xl">
                <img src={member.img} alt={member.name} className="w-full h-64 object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0 transition duration-300">
                  <h4 className="text-white font-bold text-lg">{member.name}</h4>
                  <p className="text-crimson text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* --- SECTION 5: LOCATION / CTA --- */}
        <div className="bg-gradient-to-r from-crimson to-ruby rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <MapPin size={32} className="mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4">Visit Our Studio</h2>
          <p className="opacity-90 max-w-md mx-auto mb-6 text-sm md:text-base">
            Perambra, Calicut, Kerala.<br/>
            Open Everyday: 9:00 AM - 9:00 PM
          </p>
          <button className="bg-white text-crimson px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
            Get Directions
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;