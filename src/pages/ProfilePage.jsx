import React, { useState } from 'react';
// import Navbar from '../components/Navbar';  <-- ❌ ഇത് വേണ്ട
import { User, Phone, Mail, Calendar, Clock, LogOut, Scissors, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); 

  // Mock User Data
  const user = {
    name: 'Salman Faris',
    phone: '+91 98765 43210',
    email: 'salman@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    points: 120
  };

  // Mock Live Status
  const liveStatus = {
    stylistName: 'Alex',
    stylistStatus: 'Busy', 
    currentTask: 'Fade Cut',
    estimatedFinishTime: '15 mins', 
    queuePosition: 2 
  };

  // Mock Bookings
  const bookings = [
    {
      id: '#TOKEN-7782',
      service: 'Fade Cut & Beard',
      date: 'Today, 12 Oct',
      time: '04:00 PM',
      stylist: 'Alex',
      status: 'upcoming',
      step: 2, 
      price: '₹400'
    },
    {
      id: '#TOKEN-6654',
      service: 'Hair Spa',
      date: '25 Sep',
      time: '10:00 AM',
      stylist: 'Sam',
      status: 'completed',
      step: 4,
      price: '₹500'
    }
  ];

  // Tracking Bar Component
  const TrackingBar = ({ currentStep }) => (
    <div className="mt-4 mb-2">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
        <span className={currentStep >= 1 ? 'text-crimson' : ''}>Booked</span>
        <span className={currentStep >= 2 ? 'text-crimson' : ''}>Confirmed</span>
        <span className={currentStep >= 3 ? 'text-green-600' : ''}>Done</span>
      </div>
      <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden flex">
        <div className={`h-full ${currentStep >= 1 ? 'bg-crimson' : 'bg-transparent'} w-1/3 transition-all duration-500`}></div>
        <div className={`h-full ${currentStep >= 2 ? 'bg-crimson' : 'bg-transparent'} w-1/3 transition-all duration-500 border-l border-white/20`}></div>
        <div className={`h-full ${currentStep >= 3 ? 'bg-green-500' : 'bg-transparent'} w-1/3 transition-all duration-500 border-l border-white/20`}></div>
      </div>
    </div>
  );

  const filteredBookings = bookings.filter(b => 
    activeTab === 'upcoming' ? b.status === 'upcoming' : b.status === 'completed'
  );

  return (
    // ✅ Navbar removed from here. 
    // Padding kept to prevent overlap with fixed App Navbar
    <div className="min-h-[100dvh] bg-[var(--bg-primary)] transition-colors duration-300 pt-24 pb-32 px-4 md:px-8 overflow-x-hidden">
      
      {/* <Navbar />  <-- ❌ REMOVED */}

      <div className="max-w-4xl mx-auto animate-fade-in">
        
        {/* 1. PROFILE HEADER */}
        <div className="bg-white dark:bg-[#1a0507] border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-lg mb-6 relative overflow-hidden">
           <div className="flex items-center gap-4">
             {/* Avatar */}
             <div className="relative shrink-0">
               <img src={user.avatar} alt="Profile" className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-100 dark:border-white/5 object-cover" />
               <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-black"></div>
             </div>
             
             {/* Info */}
             <div className="flex-1 min-w-0">
               <h1 className="text-lg md:text-xl font-serif font-bold text-[var(--text-primary)] truncate">{user.name}</h1>
               <p className="text-gray-500 text-xs truncate mb-2">{user.email}</p>
               <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-[10px] font-bold text-yellow-700 dark:text-yellow-500">
                  <span>⭐ {user.points} Points</span>
               </div>
             </div>

             {/* Logout */}
             <button className="p-2 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-crimson transition">
                <LogOut size={18} />
             </button>
           </div>
        </div>

        {/* 2. LIVE TRACKING CARD */}
        {activeTab === 'upcoming' && filteredBookings.length > 0 && (
          <div className="mb-6 bg-gradient-to-br from-gray-900 to-black text-white p-5 rounded-3xl shadow-xl relative overflow-hidden border border-gray-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-crimson"></span>
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-crimson">Live Queue</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-[10px] uppercase mb-1">Status</p>
                <p className="text-sm font-bold text-white truncate">
                  {liveStatus.stylistName} is <span className="text-crimson">{liveStatus.stylistStatus}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px] uppercase mb-1">Est. Wait</p>
                <p className="text-lg font-bold text-white leading-none">{liveStatus.estimatedFinishTime}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
               <div className="text-xs text-gray-400">
                 Current: <span className="text-white font-medium">{liveStatus.currentTask}</span>
               </div>
               <div className="bg-crimson px-2 py-0.5 rounded text-[10px] font-bold">
                 #{liveStatus.queuePosition} in line
               </div>
            </div>
          </div>
        )}

        {/* 3. TABS */}
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-6">
          {['upcoming', 'history'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 text-xs font-bold rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-[#1a0507] text-crimson shadow-sm' : 'text-gray-400'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* 4. BOOKINGS LIST */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-[var(--card-bg)] border border-gray-100 dark:border-white/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 shrink-0 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center text-[var(--text-primary)]">
                      <Scissors size={18} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[var(--text-primary)] text-sm truncate">{booking.service}</h3>
                      <p className="text-[10px] text-gray-400 font-medium tracking-wide truncate">{booking.id}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-crimson shrink-0">{booking.price}</span>
                </div>

                {booking.status === 'upcoming' && <TrackingBar currentStep={booking.step} />}

                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><Calendar size={14} className="text-crimson"/> {booking.date}</div>
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-crimson"/> {booking.time}</div>
                </div>

                {booking.status === 'upcoming' ? (
                   <Link to="/success" state={{ bookingDetails: booking }} className="mt-4 w-full py-2.5 bg-crimson text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition">
                      View Token <ArrowRight size={14} />
                   </Link>
                ) : (
                  <button className="mt-4 w-full py-2.5 border border-gray-200 dark:border-white/10 text-[var(--text-primary)] text-xs font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition">
                    Book Again
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 bg-[var(--card-bg)] rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-sm">No bookings found</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;