import React from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, Calendar, Clock, Download, Home, User, Scissors } from 'lucide-react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const BookingSuccessPage = () => {
  const location = useLocation();
  
  // 1. Get Real Data from Navigation State
  const { booking, service } = location.state || {};

  // 2. If no data (Direct Access), Redirect to Home
  if (!booking) {
    return <Navigate to="/" replace />;
  }

  // Helper to format date nicely
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Helper to format time (remove seconds)
  const formatTime = (timeStr) => {
    return timeStr.slice(0, 5); // "10:00:00" -> "10:00"
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-primary)] pt-20 md:pt-24 px-4 pb-6 flex flex-col items-center justify-center overflow-x-hidden transition-colors duration-300">
      
      {/* <Navbar /> (Optional here, can remove if it feels too cluttered) */}

      {/* Content Container */}
      <div className="w-full max-w-sm flex flex-col items-center animate-fade-in">

        {/* Success Icon */}
        <div className="mb-4 animate-bounce">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center border-4 border-green-500 shadow-lg">
            <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-serif font-bold text-[var(--text-primary)] mb-1">Booking Confirmed!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">Your appointment is scheduled successfully.</p>

        {/* TICKET CARD (Real Data Connected) */}
        <div className="w-full bg-white dark:bg-[#1a0507] rounded-3xl shadow-2xl overflow-hidden relative border border-gray-200 dark:border-white/10 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
          
          {/* Top Section (Red) */}
          <div className="bg-crimson p-5 text-white text-center relative">
            {/* Real Token Number */}
            <h2 className="text-3xl md:text-4xl font-black tracking-widest">{booking.token_number}</h2>
            <p className="text-[10px] uppercase opacity-80 mt-1 font-bold tracking-wider">Token Number</p>
            
            {/* Cutout Circles */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[var(--bg-primary)] rounded-full z-10"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[var(--bg-primary)] rounded-full z-10"></div>
          </div>

          {/* Ticket Details */}
          <div className="p-5 space-y-4 border-b border-dashed border-gray-300 dark:border-white/10">
            
            {/* Service Name */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Service</span>
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                 <Scissors size={14} className="text-crimson"/>
                 {/* Check items array or fallback to passed service name */}
                 {booking.items && booking.items.length > 0 ? booking.items[0].service_name : service?.name}
              </div>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Date</span>
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                 <Calendar size={14} className="text-crimson"/> 
                 {formatDate(booking.booking_date)}
              </div>
            </div>

            {/* Time */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Time</span>
              <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                 <Clock size={14} className="text-crimson"/> 
                 {formatTime(booking.booking_time)}
              </div>
            </div>

            {/* Price (Total) */}
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100 dark:border-white/5">
              <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
              <span className="font-bold text-lg text-crimson">₹{booking.total_price}</span>
            </div>
          </div>

          {/* Barcode Footer */}
          <div className="p-3 bg-gray-50 dark:bg-white/5 text-center">
            {/* Fake Barcode Visual using CSS/Image */}
            <div 
                className="h-8 w-3/4 mx-auto opacity-60 dark:invert"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='10' preserveAspectRatio='none'%3E%3Cpath d='M0 0h1v10H0zm2 0h1v10H2zm2 0h2v10H4zm3 0h1v10H7zm2 0h1v10H9zm3 0h2v10h-2zm3 0h1v10h-1zm2 0h3v10h-3zm4 0h1v10h-1zm2 0h1v10h-1zm2 0h2v10h-2zm4 0h1v10h-1zm2 0h1v10h-1zm3 0h2v10h-2zm3 0h1v10h-1zm2 0h1v10h-1z' fill='%23000'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat-x'
                }}
            ></div>
            <p className="text-[9px] text-gray-400 mt-1">Show this ticket at the counter</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <Link to="/" className="flex-1 py-3.5 bg-[var(--card-bg)] border border-gray-200 dark:border-white/10 rounded-xl font-bold text-[var(--text-primary)] text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <Home size={16} /> Home
          </Link>
          
          <button 
            onClick={() => alert("Ticket Saved! (This is a demo)")}
            className="flex-1 py-3.5 bg-crimson text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/30 hover:bg-ruby transition active:scale-95"
          >
             <Download size={16} /> Save
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccessPage;