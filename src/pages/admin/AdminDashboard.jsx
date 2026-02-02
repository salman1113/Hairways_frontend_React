import React, { useState, useEffect } from 'react';
import { getAdminStats, getQueue } from '../../services/api';
import { CalendarCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_revenue: 0, active_customers: 0, pending_queue: 0 });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const statsData = await getAdminStats();
        const bookingsData = await getQueue();
        setStats(statsData);
        setBookings(bookingsData);
    } catch (error) { console.error(error); }
  };

  return (
    <div>
        <h1 className="text-3xl font-serif font-bold text-[#3F0D12] mb-8">Dashboard Overview</h1>

        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EACCCC]">
                <h4 className="text-[#785A5D] text-sm font-bold uppercase">Revenue</h4>
                <p className="text-3xl font-bold text-[#3F0D12]">₹{stats.total_revenue || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EACCCC]">
                <h4 className="text-[#785A5D] text-sm font-bold uppercase">Active</h4>
                <p className="text-3xl font-bold text-[#D72638] animate-pulse">{stats.active_customers || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EACCCC]">
                <h4 className="text-[#785A5D] text-sm font-bold uppercase">Waiting</h4>
                <p className="text-3xl font-bold text-[#3F0D12]">{stats.pending_queue || 0}</p>
            </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white p-6 rounded-3xl shadow-sm">
             <h3 className="font-bold text-lg mb-4 text-[#3F0D12] flex items-center gap-2"><CalendarCheck size={20}/> Today's Appointments</h3>
             <div className="space-y-4">
                {bookings.length === 0 ? <p className="text-gray-500">No bookings yet.</p> : 
                 bookings.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50">
                        <div>
                            <h4 className="font-bold text-[#3F0D12]">Token #{b.token_number}</h4>
                            <p className="text-sm text-gray-500">{b.customer_name || b.guest_name} • {b.booking_time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                            ${b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                              b.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {b.status}
                        </span>
                    </div>
                ))}
             </div>
         </div>
    </div>
  );
};
export default AdminDashboard;