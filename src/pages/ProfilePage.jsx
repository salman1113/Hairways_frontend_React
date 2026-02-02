import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking } from '../services/api';
import { generateTicketPDF } from '../utils/ticketGenerator';
import { Loader2, Calendar, Clock, User, Scissors, LogOut, Ticket, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tabs for organizing cards
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const handleCancel = async (id) => {
      if(!window.confirm("Are you sure you want to cancel this appointment?")) return;
      try { await cancelBooking(id); fetchBookings(); } 
      catch { alert("Cannot cancel now."); }
  };

  const handleDownloadTicket = (booking) => {
      generateTicketPDF(booking);
  };

  // Filter Data
  const upcomingBookings = bookings.filter(b => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status));
  const historyBookings = bookings.filter(b => b.status === 'COMPLETED');
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED');

  const getDisplayData = () => {
      if (activeTab === 'upcoming') return upcomingBookings;
      if (activeTab === 'history') return historyBookings;
      return cancelledBookings;
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-[#D72638]" size={40}/></div>;

  return (
    // 🔥 FIX: Removed 'bg-[#FBE4E3]' so it uses the Global Theme Background
    <div className="min-h-screen pb-24 md:pb-10 pt-24 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-[#EACCCC]">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#3F0D12] text-white rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow-md">
                    {user?.username?.[0] || "U"}
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-2xl font-serif font-bold text-[#3F0D12]">{user?.username}</h1>
                    <p className="text-gray-500">{user?.email}</p>
                    <p className="text-sm text-[#D72638] font-bold mt-1 uppercase bg-red-50 inline-block px-3 py-1 rounded-lg">{user?.role}</p>
                </div>
            </div>
            <button onClick={handleLogout} className="px-6 py-2 border-2 border-[#D72638] text-[#D72638] rounded-xl font-bold hover:bg-[#D72638] hover:text-white transition flex items-center gap-2">
                <LogOut size={18}/> Logout
            </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            {['upcoming', 'history', 'cancelled'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-300
                    ${activeTab === tab ? 'bg-[#3F0D12] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    {tab} ({tab === 'upcoming' ? upcomingBookings.length : tab === 'history' ? historyBookings.length : cancelledBookings.length})
                </button>
            ))}
        </div>

        {/* 🔥 BOOKING CARDS (GRID LAYOUT) */}
        <div>
            {getDisplayData().length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                    <p className="text-gray-400 font-medium">No bookings found in this section.</p>
                    {activeTab === 'upcoming' && (
                        <button onClick={() => navigate('/book')} className="mt-4 text-[#D72638] font-bold hover:underline">Book New Appointment</button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getDisplayData().map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-md border border-[#EACCCC] hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            
                            {/* Status Badge */}
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-xs font-bold text-white uppercase tracking-wider
                                ${booking.status === 'COMPLETED' ? 'bg-green-500' : 
                                  booking.status === 'CANCELLED' ? 'bg-gray-400' : 
                                  booking.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                                {booking.status}
                            </div>

                            {/* Token Section */}
                            <div className="mb-4 pb-4 border-b border-dashed border-gray-200">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Token Number</p>
                                <h3 className="text-3xl font-black text-[#3F0D12] mt-1">{booking.token_number}</h3>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#D72638]"><Calendar size={16}/></div>
                                    <span className="font-semibold">{booking.booking_date}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#D72638]"><Clock size={16}/></div>
                                    <span className="font-semibold">{booking.booking_time}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#D72638]"><User size={16}/></div>
                                    <span>{booking.employee_details?.user_details?.username || "Stylist"}</span>
                                </div>
                            </div>

                            {/* Service List Box */}
                            <div className="bg-gray-50 p-4 rounded-xl mb-5 border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1 uppercase"><Scissors size={12}/> Services</p>
                                <div className="space-y-1">
                                    {booking.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-xs text-gray-800 font-medium">
                                            <span>{item.service_name}</span>
                                            <span>₹{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                                    <span className="text-lg font-black text-[#3F0D12]">₹{booking.total_price}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-auto">
                                {/* PDF Button */}
                                {booking.status !== 'CANCELLED' && (
                                    <button 
                                        onClick={() => handleDownloadTicket(booking)}
                                        className="flex-1 py-3 bg-[#3F0D12] text-white text-sm rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2a090c] transition shadow-md"
                                    >
                                        <Ticket size={16}/> Ticket
                                    </button>
                                )}

                                {/* Cancel Button */}
                                {activeTab === 'upcoming' && booking.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handleCancel(booking.id)}
                                        className="flex-1 py-3 bg-white border-2 border-red-100 text-red-500 text-sm rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition"
                                    >
                                        <XCircle size={16}/> Cancel
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;