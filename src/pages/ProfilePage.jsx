import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getMyBookings, cancelBooking } from '../services/api'; 
import { Calendar, Clock, LogOut, Scissors, Loader2, ArrowRight, Star, XCircle } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null); 

  // Data Fetching Function
  const fetchProfileData = async () => {
      try {
        const [profileData, bookingsData] = await Promise.all([
          getUserProfile(),
          getMyBookings()
        ]);
        setProfile(profileData);
        setBookings(bookingsData);
      } catch (err) {
        console.error("Profile Error:", err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfileData();
  }, []);

  // Handle Cancel Function
  const handleCancel = async (bookingId) => {
    if(!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    try {
        await cancelBooking(bookingId);
        await fetchProfileData(); 
    } catch (error) {
        alert("Failed to cancel booking");
        console.error(error);
    } finally {
        setCancellingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 📅 Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "Date Pending";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ⏰ Time Formatter (FIXED HERE)
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    
    // If it's a full ISO string (like 2024-01-30T10:00:00)
    if (timeStr.includes('T')) {
        return new Date(timeStr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    // If it's just time from Django (e.g., "14:30:00") -> Cut seconds
    return timeStr.slice(0, 5); // Returns "14:30"
  };

  const filteredBookings = bookings.filter(b => 
    activeTab === 'upcoming' 
      ? (b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS') 
      : (b.status === 'COMPLETED' || b.status === 'CANCELLED')
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-crimson" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-primary)] transition-colors duration-300 pt-24 pb-32 px-4 md:px-0">
      
      <div className="max-w-xl mx-auto animate-fade-in space-y-6">
        
        {/* PROFILE CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3F0D12] to-[#98111E] p-6 shadow-xl mx-2">
           <div className="relative z-10 flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-white/20 overflow-hidden">
                  <img src={profile?.profile_picture || `https://ui-avatars.com/api/?name=${profile?.username || 'User'}&background=random&color=fff`} className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">{profile?.username}</h2>
                <p className="text-white/70 text-sm truncate">{profile?.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-white text-xs font-semibold bg-black/20 px-2 py-0.5 rounded-lg">⭐ {profile?.points || 0} pts</span>
                  <span className="text-white/70 text-xs">{bookings.length} bookings</span>
                </div>
              </div>
              <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-md">
                 <LogOut size={18} className="text-white" />
              </button>
            </div>
        </div>

        {/* TABS */}
         <div className="bg-[var(--card-bg)] rounded-2xl p-1.5 border border-[var(--border-color)] shadow-sm mx-2">
          <div className="flex relative">
            {['upcoming', 'history'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-xl text-xs font-bold capitalize transition-all relative z-10 ${activeTab === tab ? 'text-crimson bg-[var(--bg-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="space-y-3 mx-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {activeTab === 'upcoming' ? 'Upcoming' : 'History'}
            </h3>
            <span className="text-xs px-2 py-1 bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg font-medium">
              {filteredBookings.length} Total
            </span>
          </div>

          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="group bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 hover:border-crimson/30 hover:shadow-lg transition-all duration-300">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] flex items-center justify-center">
                        <Scissors size={20} className="text-[var(--text-secondary)]" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full 
                                ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                                'bg-gray-100 text-gray-600'}`}>
                                {booking.status}
                            </span>
                        </div>
                        <h4 className="font-bold text-[var(--text-primary)] text-base line-clamp-1">
                            {booking.items?.[0]?.service_name || "Hair Service"}
                        </h4>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-crimson">₹{booking.total_price}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] p-2 rounded-lg">
                    <Calendar size={14} className="text-crimson" />
                    <span>{formatDate(booking.booking_date || booking.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-primary)] p-2 rounded-lg">
                    <Clock size={14} className="text-crimson" />
                    {/* 👇 Updated Logic Here */}
                    <span>{formatTime(booking.booking_time)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {activeTab === 'upcoming' ? (
                    <div className="flex gap-2">
                        {/* View Ticket (Mapping fixed for Success Page) */}
                        <Link 
                            to="/success" 
                            state={{ 
                                booking: booking, 
                                service: { name: booking.items?.[0]?.service_name } // Fix for Success Page structure
                            }}
                            className="flex-1 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-crimson hover:text-white transition-colors"
                        >
                            View Ticket <ArrowRight size={14} />
                        </Link>
                        
                        {/* Cancel Button */}
                        <button 
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="w-12 flex items-center justify-center border border-red-200 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                            {cancellingId === booking.id ? <Loader2 size={16} className="animate-spin"/> : <XCircle size={18} />}
                        </button>
                    </div>
                ) : (
                    <button className="w-full py-3 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl text-xs font-bold hover:bg-[var(--bg-primary)] cursor-default">
                        {booking.status === 'CANCELLED' ? 'Cancelled' : 'Completed'}
                    </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[var(--card-bg)] rounded-3xl border border-dashed border-[var(--border-color)]">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                <Scissors size={24} className="text-[var(--text-secondary)]" />
              </div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">No {activeTab} bookings</h4>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;