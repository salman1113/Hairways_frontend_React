import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Scissors, Home, Download, User } from 'lucide-react';
import { generateTicketPDF } from '../utils/ticketGenerator'; // 🔥 Import New Generator

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const handleDownload = () => {
      if(booking) generateTicketPDF(booking); // 🔥 Call function
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBE4E3] p-4 text-center">
        <h2 className="text-2xl font-bold text-[#3F0D12] mb-4">No booking data found.</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-[#D72638] text-white rounded-xl font-bold">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBE4E3] py-10 px-4 flex flex-col items-center justify-center gap-6">
      
      {/* Visual Ticket (Just for display) */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EACCCC]">
        <div className="bg-[#27ae60] p-6 text-center text-white">
            <CheckCircle className="mx-auto mb-3" size={40} />
            <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
        </div>
        <div className="p-6 space-y-4">
            <div className="text-center border-b pb-4">
                <p className="text-xs text-gray-500 font-bold uppercase">Token Number</p>
                <h2 className="text-4xl font-black text-[#3F0D12]">{booking.token_number}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-[#3F0D12]">
                <div><span className="text-gray-500 text-xs">Date:</span> <br/><b>{booking.booking_date}</b></div>
                <div><span className="text-gray-500 text-xs">Time:</span> <br/><b>{booking.booking_time}</b></div>
                <div><span className="text-gray-500 text-xs">Stylist:</span> <br/><b>{booking.employee_details?.user_details?.username}</b></div>
            </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-md flex gap-3">
            <button 
                onClick={handleDownload} 
                className="flex-1 py-3 border-2 border-[#3F0D12] bg-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
            >
                <Download size={18}/> Download PDF
            </button>
            <button 
                onClick={() => navigate('/')} 
                className="flex-1 py-3 bg-[#3F0D12] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2a090c]"
            >
                <Home size={18}/> Home
            </button>
      </div>
    </div>
  );
};

export default BookingSuccessPage;