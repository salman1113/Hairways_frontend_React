import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelBooking, getUserProfile, updateUserProfile } from '../services/api';
import { generateTicketPDF } from '../utils/ticketGenerator';
import { Loader2, Calendar, Clock, User, Scissors, LogOut, Ticket, XCircle, Edit, Crown, Wallet, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/profile/StatsCard';
import ProfileEditModal from '../components/profile/ProfileEditModal';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, logout, login } = useAuth(); // login needed to update context
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    // Tabs
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileData, bookingsData] = await Promise.all([
                getUserProfile(),
                getMyBookings()
            ]);
            setProfile(profileData);
            setBookings(bookingsData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile data");
        }
        finally { setLoading(false); }
    };

    const handleUpdateProfile = async (updatedData) => {
        // Let the modal handle success/error toasts
        const newProfile = await updateUserProfile(updatedData);
        setProfile(newProfile);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try { await cancelBooking(id); fetchData(); toast.success("Booking Cancelled"); }
        catch { toast.error("Cancellation Failed"); }
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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#D72638]" size={40} /></div>;

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 bg-gray-50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* 1. HERO SECTION */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#EACCCC] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 bg-[#3F0D12] text-white rounded-full flex items-center justify-center text-4xl font-serif font-bold border-4 border-white shadow-lg">
                                {profile?.username?.[0] || "U"}
                            </div>

                            <div className="text-center md:text-left space-y-2">
                                <h1 className="text-3xl font-serif font-bold text-[#3F0D12]">{profile?.username}</h1>
                                <p className="text-gray-500 font-medium">{profile?.email}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    <span className="bg-[#3F0D12] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        {profile?.role}
                                    </span>
                                    {profile?.tier && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                    ${profile.tier === 'Gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                profile.tier === 'Platinum' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {profile.tier} Member
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowEditModal(true)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition flex items-center gap-2">
                                <Edit size={18} /> Edit Profile
                            </button>
                            <button onClick={handleLogout} className="px-5 py-2.5 border-2 border-[#D72638] text-[#D72638] rounded-xl font-bold hover:bg-[#D72638] hover:text-white transition flex items-center gap-2">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* QUICK STATS ROW (Mobile Only or integrated) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                        <div className="text-center md:text-left">
                            <p className="text-xs text-gray-400 uppercase font-bold">Points</p>
                            <p className="text-xl font-black text-[#3F0D12] flex items-center justify-center md:justify-start gap-1"><Star size={16} className="text-yellow-500 fill-current" /> {profile?.points || 0}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs text-gray-400 uppercase font-bold">Face Shape</p>
                            <p className="text-xl font-black text-[#3F0D12]">{profile?.face_shape || 'Not Set'}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs text-gray-400 uppercase font-bold">Bookings</p>
                            <p className="text-xl font-black text-[#3F0D12]">{historyBookings.length}</p>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-xs text-gray-400 uppercase font-bold">Joined</p>
                            <p className="text-xl font-black text-[#3F0D12]">{new Date(profile?.date_joined).getFullYear()}</p>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Stats & Info */}
                    <div className="space-y-6">
                        {/* Loyalty Card */}
                        <div className="bg-gradient-to-br from-[#3F0D12] to-[#5a1a20] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                            <Crown className="absolute -right-4 -bottom-4 text-white/10 w-40 h-40" />
                            <div className="relative z-10">
                                <h3 className="text-lg font-serif font-bold mb-1">Loyalty Status</h3>
                                <p className="text-white/70 text-sm mb-6">Earn points on every haircut!</p>

                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-black">{profile?.points || 0}</span>
                                    <span className="text-sm font-medium opacity-80 mb-1">Points</span>
                                </div>

                                <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                                    {/* Dummy Progress: Max 500 for demo */}
                                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${Math.min((profile?.points || 0) / 5, 100)}%` }}></div>
                                </div>
                                <p className="text-xs text-white/60">{500 - (profile?.points || 0)} points to Platinum</p>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-[#3F0D12] flex items-center gap-2">
                                <User size={20} /> About Me
                            </h3>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Bio</p>
                                <p className="text-sm text-gray-600 mt-1 italic">"{profile?.bio || "No bio added yet."}"</p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Styling Preferences</p>
                                <p className="text-sm text-gray-600 mt-1">{profile?.preferences || "No preferences set."}</p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Birth Date</p>
                                <p className="text-sm text-gray-600 mt-1">{profile?.birth_date || "Not Set"}</p>
                            </div>
                        </div>

                        {/* Face Shape Tip */}
                        {profile?.face_shape && (
                            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                                <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                                    <Sparkles size={18} /> Style Tip
                                </h3>
                                <p className="text-sm text-blue-800">
                                    For a <b>{profile.face_shape}</b> face, consider styles that {
                                        profile.face_shape === 'Oval' ? 'maintain balance, like a pompadour or quiff.' :
                                            profile.face_shape === 'Round' ? 'add height and structre, like a high fade.' :
                                                profile.face_shape === 'Square' ? 'soften the jawline, like a layered cut.' : 'compliment your features.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Bookings */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Tabs */}
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 max-w-md">
                            {['upcoming', 'history', 'cancelled'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300
                            ${activeTab === tab ? 'bg-[#3F0D12] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Booking List */}
                        <div className="space-y-4">
                            {getDisplayData().length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                                    <Calendar className="mx-auto text-gray-200 mb-4" size={48} />
                                    <p className="text-gray-400 font-medium">No bookings in this section.</p>
                                    {activeTab === 'upcoming' && (
                                        <button onClick={() => navigate('/book')} className="mt-4 px-6 py-2 bg-[#D72638] text-white rounded-xl font-bold hover:bg-[#b01e2e] transition">Book Appointment</button>
                                    )}
                                </div>
                            ) : (
                                getDisplayData().map((booking) => (
                                    <div key={booking.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                                            {/* Left: Date & Token */}
                                            <div className="flex items-center gap-5">
                                                <div className="bg-gray-50 px-4 py-3 rounded-2xl text-center border border-gray-100 min-w-[80px]">
                                                    <p className="text-xs text-gray-500 font-bold uppercase">{new Date(booking.booking_date).toLocaleString('default', { month: 'short' })}</p>
                                                    <p className="text-2xl font-black text-[#3F0D12]">{new Date(booking.booking_date).getDate()}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-[#3F0D12] flex items-center gap-2">
                                                        Token #{booking.token_number}
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider
                                                    ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                                booking.status === 'CANCELLED' ? 'bg-gray-100 text-gray-500' :
                                                                    booking.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                                                        <span className="flex items-center gap-1"><Clock size={14} /> {booking.booking_time}</span>
                                                        <span className="flex items-center gap-1"><User size={14} /> {booking.employee_details?.user_details?.username || "Stylist"}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex items-center gap-3">
                                                {booking.status !== 'CANCELLED' && (
                                                    <button onClick={() => handleDownloadTicket(booking)} className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition" title="Download Ticket">
                                                        <Ticket size={20} />
                                                    </button>
                                                )}
                                                {activeTab === 'upcoming' && booking.status === 'PENDING' && (
                                                    <button onClick={() => handleCancel(booking.id)} className="px-4 py-2 border border-red-100 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition flex items-center gap-2">
                                                        <XCircle size={16} /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Services Summary (Collapsible/Small) */}
                                        <div className="mt-4 pt-4 border-t border-dashed border-gray-100 flex flex-wrap gap-2">
                                            {booking.items.map((item, i) => (
                                                <span key={i} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-lg font-medium border border-gray-100">
                                                    {item.service_name}
                                                </span>
                                            ))}
                                            <span className="ml-auto text-sm font-black text-[#3F0D12]">Total: ₹{booking.total_price}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>

            {/* EDIT MODAL */}
            {showEditModal && (
                <ProfileEditModal
                    user={profile}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleUpdateProfile}
                />
            )}

        </div>
    );
};

export default ProfilePage;