import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Scissors, Home, Download, User } from 'lucide-react';
import { generateTicketPDF } from '../utils/ticketGenerator';
import confetti from 'canvas-confetti';

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (booking) {
      // Trigger Confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      // Fade in content
      setTimeout(() => setShowContent(true), 500);
    }
  }, [booking]);

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-[#3F0D12] mb-4">No booking data found.</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#D72638] text-white rounded-xl font-bold">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3F0D12] to-[#2a090c] py-10 px-4 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#D72638] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className={`transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} w-full max-w-md`}>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full text-white shadow-2xl mb-4 animate-bounce-short">
            <CheckCircle size={40} strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-300">Get ready to look your best.</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Ticket Notch (Visual) */}
          <div className="absolute top-1/2 left-0 w-6 h-6 bg-[#2a090c] rounded-full -translate-x-3 -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-6 h-6 bg-[#2a090c] rounded-full translate-x-3 -translate-y-1/2"></div>

          <div className="p-8 border-b-2 border-dashed border-gray-100">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Queue Token</p>
              <h2 className="text-6xl font-black text-[#3F0D12]">{booking.token_number}</h2>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 text-[#D72638] rounded-lg"><Calendar size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Date</p>
                  <p className="font-bold text-[#3F0D12] text-lg">{booking.booking_date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 text-[#D72638] rounded-lg"><Clock size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Time</p>
                  <p className="font-bold text-[#3F0D12] text-lg">{booking.booking_time}</p>
                </div>
              </div>
            </div>

            {/* Stylist */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="w-12 h-12 bg-[#3F0D12] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {booking.employee_details?.user_details?.username?.[0] || 'S'}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Stylist</p>
                <p className="font-bold text-[#3F0D12] text-lg">{booking.employee_details?.user_details?.username}</p>
                <p className="text-xs text-gray-500">{booking.employee_details?.job_title}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 flex gap-3">
            <button
              onClick={() => generateTicketPDF(booking)}
              className="flex-1 py-3 bg-white border border-gray-200 text-[#3F0D12] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition shadow-sm"
            >
              <Download size={18} /> Save Ticket
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-[#3F0D12] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#5a1a20] transition shadow-lg"
            >
              <Home size={18} /> Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccessPage;