import React from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, Calendar, Clock, Download, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BookingSuccessPage = () => {
  const location = useLocation();
  const { bookingDetails } = location.state || { 
    bookingDetails: { 
      id: '#TOKEN-0000', 
      service: 'Service', 
      date: 'Date', 
      time: '00:00', 
      stylist: 'Stylist' 
    } 
  };

  return (
    // 1. min-h-[100dvh]: മൊബൈൽ ബ്രൗസർ ബാർ പ്രശ്നം ഒഴിവാക്കാൻ
    // 2. overflow-x-hidden: സൈഡ് സ്ക്രോളിംഗ് ഒഴിവാക്കാൻ
    // 3. Justify-center: എല്ലാം നടുക്ക് കൊണ്ടുവരാൻ
    <div className="min-h-[100dvh] bg-[var(--bg-primary)] pt-20 md:pt-24 px-4 pb-6 flex flex-col items-center justify-center overflow-x-hidden transition-colors duration-300">
      
      <Navbar />

      {/* Content Container - Compact & Centered */}
      <div className="w-full max-w-sm flex flex-col items-center animate-fade-in">

        {/* Success Icon */}
        <div className="mb-4 animate-bounce">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center border-4 border-green-500 shadow-lg">
            <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-serif font-bold text-[var(--text-primary)] mb-1">Booking Confirmed!</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Your appointment is scheduled.</p>

        {/* TICKET CARD (Compact Design) */}
        <div className="w-full bg-white dark:bg-[#1a0507] rounded-3xl shadow-2xl overflow-hidden relative border border-gray-200 dark:border-white/10 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
          
          {/* Top Section (Red) */}
          <div className="bg-crimson p-5 text-white text-center relative">
            <h2 className="text-2xl md:text-3xl font-bold tracking-widest">{bookingDetails.id}</h2>
            <p className="text-[10px] uppercase opacity-80 mt-1 font-bold tracking-wider">Token Number</p>
            
            {/* Cutout Circles */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[var(--bg-primary)] rounded-full z-10"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[var(--bg-primary)] rounded-full z-10"></div>
          </div>

          {/* Ticket Details */}
          <div className="p-5 space-y-3 border-b border-dashed border-gray-300 dark:border-white/10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Service</span>
              <span className="font-bold text-[var(--text-primary)]">{bookingDetails.service}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Date</span>
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                 <Calendar size={14} className="text-crimson"/> {bookingDetails.date}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Time</span>
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                 <Clock size={14} className="text-crimson"/> {bookingDetails.time}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Stylist</span>
              <span className="font-bold text-[var(--text-primary)]">{bookingDetails.stylist}</span>
            </div>
          </div>

          {/* Barcode Footer */}
          <div className="p-3 bg-gray-50 dark:bg-black/20 text-center">
            <div className="h-8 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Code_39_24-240.svg/1200px-Code_39_24-240.svg.png')] bg-contain bg-center bg-no-repeat opacity-50"></div>
            <p className="text-[9px] text-gray-400 mt-1">Show at counter</p>
          </div>
        </div>

        {/* Action Buttons (Side by Side for Space Saving) */}
        <div className="flex gap-3 w-full">
          <Link to="/" className="flex-1 py-3 bg-[var(--card-bg)] border border-gray-200 dark:border-white/10 rounded-xl font-bold text-[var(--text-primary)] text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <Home size={16} /> Home
          </Link>
          
          <button className="flex-1 py-3 bg-crimson text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-ruby transition active:scale-95">
             <Download size={16} /> Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccessPage;