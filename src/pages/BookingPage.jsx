import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ChevronLeft, Calendar, Clock, User, Scissors } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get Service from Previous Page (OR null)
  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);

  // States
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);

  // Mock Data for "Direct Selection"
  const availableServices = [
    { id: 1, name: 'Classic Fade', price: 250, duration: '30 min' },
    { id: 2, name: 'Beard Trim', price: 150, duration: '20 min' },
    { id: 3, name: 'Hair Spa', price: 500, duration: '45 min' },
  ];

  // Mock Dates & Times (Same as before)
  const generateDates = () => {
     const d = []; const today = new Date();
     for(let i=0; i<7; i++){
        const date = new Date(today); date.setDate(today.getDate()+i);
        d.push({day: date.toLocaleDateString('en-US',{weekday:'short'}), date: date.getDate(), fullDate: date.toISOString().split('T')[0]});
     } return d;
  };
  const dates = generateDates();
  const times = ['09:00', '10:00', '11:00', '02:00', '03:00', '04:00'];
  const stylists = [
     {id:1, name:'Alex', img:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'},
     {id:2, name:'Sam', img:'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'}
  ];

  // HANDLE CONFIRM (Generate Token)
  const handleConfirm = () => {
    // Navigate to Success Page with Data
    navigate('/success', {
      state: {
        bookingDetails: {
          id: '#T-' + Math.floor(1000 + Math.random() * 9000), // Random Token
          service: selectedService.name,
          date: selectedDate,
          time: selectedTime,
          stylist: stylists.find(s => s.id === selectedStylist)?.name || 'Any Stylist'
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300 pb-32">
      <Navbar />

      <div className="pt-24 md:pt-32 max-w-3xl mx-auto px-5">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 bg-[var(--card-bg)] rounded-full border border-gray-100 dark:border-white/10">
            <ChevronLeft size={24} className="text-[var(--text-primary)]" />
          </button>
          <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Book Appointment</h1>
        </div>

        {/* 1. SERVICE SELECTION (If Direct Access) */}
        {!location.state?.selectedService && (
           <div className="mb-8">
             <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4 flex items-center gap-2">
               <Scissors size={18} className="text-crimson" /> Select Service First
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {availableServices.map((srv) => (
                 <div 
                   key={srv.id} 
                   onClick={() => setSelectedService(srv)}
                   className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center ${
                      selectedService?.id === srv.id 
                      ? 'border-crimson bg-crimson/5 ring-1 ring-crimson' 
                      : 'border-gray-100 dark:border-white/5 bg-[var(--card-bg)]'
                   }`}
                 >
                    <span className="font-bold text-[var(--text-primary)]">{srv.name}</span>
                    <span className="text-crimson font-bold">₹{srv.price}</span>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* If Service Selected (Show Summary) */}
        {selectedService && (
           <div className="bg-gradient-to-r from-crimson to-ruby p-5 rounded-2xl text-white shadow-lg mb-8 flex justify-between items-center">
             <div>
               <p className="text-white/80 text-xs font-bold uppercase">Service</p>
               <h2 className="text-2xl font-bold">{selectedService.name}</h2>
             </div>
             <span className="text-2xl font-bold">₹{selectedService.price}</span>
           </div>
        )}

        {/* 2. DATE & TIME (Simplified for Code Length) */}
        <div className="mb-8">
           <h3 className="font-bold text-lg text-[var(--text-primary)] mb-3">Pick Date</h3>
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
             {dates.map((d,i)=>(
               <button key={i} onClick={()=>setSelectedDate(d.fullDate)} className={`min-w-[70px] p-3 rounded-2xl border ${selectedDate===d.fullDate?'bg-crimson text-white border-crimson':'bg-[var(--card-bg)] border-gray-100 dark:border-white/5 text-[var(--text-primary)]'}`}>
                 <span className="block text-xs opacity-70">{d.day}</span><span className="text-xl font-bold">{d.date}</span>
               </button>
             ))}
           </div>
        </div>
        
        <div className="mb-8">
           <h3 className="font-bold text-lg text-[var(--text-primary)] mb-3">Pick Time</h3>
           <div className="grid grid-cols-4 gap-3">
             {times.map((t)=>(
               <button key={t} onClick={()=>setSelectedTime(t)} className={`py-2 rounded-xl text-sm font-bold border ${selectedTime===t?'bg-crimson text-white border-crimson':'bg-[var(--card-bg)] border-gray-100 dark:border-white/5 text-[var(--text-primary)]'}`}>{t}</button>
             ))}
           </div>
        </div>

        {/* 3. STYLIST */}
        <div className="mb-24">
           <h3 className="font-bold text-lg text-[var(--text-primary)] mb-3">Stylist</h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar">
             {stylists.map((s)=>(
               <div key={s.id} onClick={()=>setSelectedStylist(s.id)} className={`min-w-[100px] p-3 rounded-2xl border text-center cursor-pointer ${selectedStylist===s.id?'border-crimson bg-crimson/5':'border-gray-100 dark:border-white/5 bg-[var(--card-bg)]'}`}>
                 <img src={s.img} className="w-12 h-12 rounded-full mx-auto mb-2"/>
                 <p className="text-sm font-bold text-[var(--text-primary)]">{s.name}</p>
               </div>
             ))}
           </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 w-full bg-white dark:bg-[#1a0507] p-4 border-t border-gray-200 dark:border-white/10 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
           <div><p className="text-xs text-gray-500">Total</p><h2 className="text-2xl font-bold text-crimson">₹{selectedService ? selectedService.price : 0}</h2></div>
           <button 
             onClick={handleConfirm}
             disabled={!selectedDate || !selectedTime || !selectedStylist || !selectedService}
             className="px-8 py-3 bg-crimson text-white rounded-full font-bold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
             Confirm Booking
           </button>
        </div>
      </div>

    </div>
  );
};

export default BookingPage;