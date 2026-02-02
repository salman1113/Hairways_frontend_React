import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee, updateEmployee, getEmployeeAttendance } from '../../services/api';
import api from '../../services/api';
import { UserPlus, Search, Trash2, Edit, Eye, X, Clock, CheckCircle, XCircle, Loader2, DollarSign, Star, Briefcase } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Selected Employee Data
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    // Form Data
    const initialForm = {
        username: '', email: '', password: '', phone_number: '',
        job_title: '', commission_rate: '',
        shift_start: '', shift_end: '',
        years_of_experience: '', bio: '',
        rating: '', review_count: '',
        wallet_balance: '', is_available: true
    };
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => { fetchEmployees(); }, []);

    // Filter Search
    useEffect(() => {
        if (!searchQuery) {
            setFilteredEmployees(employees);
        } else {
            const lowerQ = searchQuery.toLowerCase();
            setFilteredEmployees(employees.filter(emp =>
                emp.user_details.username.toLowerCase().includes(lowerQ) ||
                emp.user_details.email.toLowerCase().includes(lowerQ) ||
                emp.job_title.toLowerCase().includes(lowerQ)
            ));
        }
    }, [searchQuery, employees]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const data = await getEmployees();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            toast.error("Failed to load employees");
        }
        finally { setLoading(false); }
    };

    const handleViewDetails = async (emp) => {
        setSelectedEmp(emp);
        setShowDetailModal(true);
        const toastId = toast.loading("Fetching attendance...");
        try {
            const attData = await getEmployeeAttendance(emp.id);
            setAttendanceHistory(attData);
            toast.dismiss(toastId);
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Could not load attendance history.");
        }
    };

    const handleEdit = (emp) => {
        setIsEditing(true);
        setSelectedEmp(emp);
        setFormData({
            username: emp.user_details.username,
            email: emp.user_details.email,
            phone_number: emp.user_details.phone_number,
            job_title: emp.job_title || '',
            commission_rate: emp.commission_rate || '',
            shift_start: emp.shift_start || '',
            shift_end: emp.shift_end || '',
            years_of_experience: emp.years_of_experience || '',
            bio: emp.bio || '',
            rating: emp.rating || '',
            review_count: emp.review_count || '',
            wallet_balance: emp.wallet_balance || '',
            is_available: emp.is_available,
            password: ''
        });
        setShowFormModal(true);
    };

    // ... (Imports same as before) ...

    // 🔥 UPDATED SUBMIT FUNCTION (DEBUG MODE)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...formData };

        // 1. CLEANUP: Remove empty strings for optional fields
        if (!payload.shift_start) payload.shift_start = null;
        if (!payload.shift_end) payload.shift_end = null;

        // 2. PASSWORD: If editing & empty, remove it. If creating, it's required.
        if (isEditing && !payload.password) delete payload.password;

        // 3. CONVERT NUMBERS: Ensure numeric fields are Numbers
        payload.wallet_balance = payload.wallet_balance ? Number(payload.wallet_balance) : 0.00;
        payload.rating = payload.rating ? Number(payload.rating) : 5.0;
        payload.review_count = payload.review_count ? parseInt(payload.review_count) : 0;
        payload.years_of_experience = payload.years_of_experience ? parseInt(payload.years_of_experience) : 0;
        payload.commission_rate = payload.commission_rate ? Number(payload.commission_rate) : 0.00;

        // 4. BOOLEAN
        payload.is_available = Boolean(payload.is_available);

        const toastId = toast.loading(isEditing ? "Updating..." : "Creating...");

        try {
            if (isEditing) {
                await updateEmployee(selectedEmp.id, payload);
                toast.success("Successfully Updated! 🎉", { id: toastId });
            } else {
                await api.post('/accounts/employees/', payload);
                toast.success("Successfully Created! 🚀", { id: toastId });
            }

            setShowFormModal(false);
            fetchEmployees();
            setFormData(initialForm);

        } catch (error) {
            console.error("FULL ERROR DETAILS:", error);

            if (error.response && error.response.data) {
                const errors = error.response.data;

                // 🔥 DEBUG: Show the exact error in an Alert box so you can read it
                // const errorString = JSON.stringify(errors);
                // alert("Backend Error: " + errorString);

                // Show in Toast
                const firstField = Object.keys(errors)[0];
                const errorMessage = errors[firstField];
                const displayMsg = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;

                toast.error(`${firstField.toUpperCase()}: ${displayMsg}`, { id: toastId, duration: 6000 });
            } else {
                toast.error("Network Error or Server Crash (500)", { id: toastId });
            }
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This cannot be undone.")) {
            const toastId = toast.loading("Deleting...");
            try {
                await deleteEmployee(id);
                toast.success("Employee Deleted", { id: toastId });
                fetchEmployees();
            } catch (error) {
                toast.error("Delete failed", { id: toastId });
            }
        }
    };

    return (
        <div className="relative min-h-screen pb-10">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#3F0D12]">Staff Directory</h1>
                    <p className="text-gray-500">Manage profiles & settings</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#3F0D12]"
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <button onClick={() => { setIsEditing(false); setFormData(initialForm); setShowFormModal(true); }}
                        className="bg-[#3F0D12] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#5a1a20] transition">
                        <UserPlus size={18} /> Add
                    </button>
                </div>
            </div>

            {/* List */}
            {loading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#3F0D12]" size={32} /></div> :
                filteredEmployees.length === 0 ? <p className="text-center text-gray-400 py-10">No employees found.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployees.map(emp => (
                            <div key={emp.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col h-full">

                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-[#3F0D12] text-white rounded-full flex items-center justify-center text-xl font-bold uppercase shadow-sm">
                                            {emp.user_details?.username?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[#3F0D12]">{emp.user_details?.username}</h3>
                                            <p className="text-xs text-[#D72638] font-bold uppercase">{emp.job_title || 'No Title'}</p>
                                        </div>
                                    </div>
                                    {emp.is_available ?
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Active</span> :
                                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Off</span>
                                    }
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
                                    <div className="flex items-center gap-1"><Briefcase size={14} /> <b>Exp:</b> {emp.years_of_experience} Yrs</div>
                                    <div className="flex items-center gap-1"><Star size={14} className="text-yellow-500" /> <b>{emp.rating}</b> ({emp.review_count})</div>
                                    <div className="flex items-center gap-1"><DollarSign size={14} /> <b>Comm:</b> {emp.commission_rate}%</div>
                                    <div className="flex items-center gap-1 text-green-700 font-bold"><DollarSign size={14} /> <b>₹{emp.wallet_balance}</b></div>
                                </div>

                                <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                                    <Clock size={12} /> Shift: {emp.shift_start || 'Not Set'} - {emp.shift_end || 'Not Set'}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 mt-auto">
                                    <button onClick={() => handleViewDetails(emp)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-bold flex justify-center items-center gap-1 hover:bg-gray-200 text-gray-700">
                                        <Eye size={16} /> View
                                    </button>
                                    <button onClick={() => handleEdit(emp)} className="p-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(emp.id)} className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            {/* Modal - Add/Edit */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl relative animate-fade-in-up max-h-[90vh] flex flex-col shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
                            <h2 className="text-2xl font-bold text-[#3F0D12]">{isEditing ? 'Edit Profile' : 'New Employee'}</h2>
                            <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-black"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Username *" className="p-3 border rounded-xl" required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                                <input type="text" placeholder="Phone *" className="p-3 border rounded-xl" required value={formData.phone_number} onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
                                <input type="email" placeholder="Email *" className="p-3 border rounded-xl" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                {!isEditing && <input type="password" placeholder="Password *" className="p-3 border rounded-xl" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <input type="text" placeholder="Job Title" className="p-3 border rounded-xl" value={formData.job_title} onChange={e => setFormData({ ...formData, job_title: e.target.value })} />
                                <input type="number" placeholder="Experience" className="p-3 border rounded-xl" value={formData.years_of_experience} onChange={e => setFormData({ ...formData, years_of_experience: e.target.value })} />
                                <input type="number" placeholder="Commission %" className="p-3 border rounded-xl" value={formData.commission_rate} onChange={e => setFormData({ ...formData, commission_rate: e.target.value })} />
                            </div>

                            <textarea placeholder="Bio (Optional)" className="w-full p-3 border rounded-xl" rows="2" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}></textarea>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-500 mb-3 uppercase flex items-center gap-2"><Briefcase size={14} /> Optional Details</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div><label className="text-xs text-gray-500">Wallet</label><input type="number" className="w-full p-2 border rounded-lg" value={formData.wallet_balance} onChange={e => setFormData({ ...formData, wallet_balance: e.target.value })} /></div>
                                    <div><label className="text-xs text-gray-500">Rating</label><input type="number" step="0.1" className="w-full p-2 border rounded-lg" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} /></div>
                                    <div><label className="text-xs text-gray-500">Reviews</label><input type="number" className="w-full p-2 border rounded-lg" value={formData.review_count} onChange={e => setFormData({ ...formData, review_count: e.target.value })} /></div>
                                    <div className="flex items-center gap-2 pt-4">
                                        <input type="checkbox" className="w-5 h-5 accent-[#3F0D12]" checked={formData.is_available} onChange={e => setFormData({ ...formData, is_available: e.target.checked })} />
                                        <label className="text-sm font-bold">Active</label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-xs text-gray-500">Shift Start</label><input type="time" className="w-full p-2 border rounded-lg" value={formData.shift_start} onChange={e => setFormData({ ...formData, shift_start: e.target.value })} /></div>
                                    <div><label className="text-xs text-gray-500">Shift End</label><input type="time" className="w-full p-2 border rounded-lg" value={formData.shift_end} onChange={e => setFormData({ ...formData, shift_end: e.target.value })} /></div>
                                </div>
                            </div>

                            <button type="submit" className="w-full py-4 bg-[#3F0D12] text-white rounded-xl font-bold hover:bg-[#5a1a20] transition shadow-lg">
                                {isEditing ? 'Save Changes' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔥 Detail Modal (Attendance History) */}
            {showDetailModal && selectedEmp && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-3xl w-full max-w-lg relative shadow-2xl animate-fade-in-up">
                        <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24} /></button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-[#3F0D12] text-white rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                                {selectedEmp.user_details.username[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#3F0D12]">{selectedEmp.user_details.username}</h2>
                                <p className="text-gray-500">{selectedEmp.job_title}</p>
                            </div>
                        </div>

                        <h3 className="font-bold text-[#3F0D12] mb-3 flex items-center gap-2 border-b pb-2"><Clock size={18} /> Attendance History</h3>

                        {attendanceHistory.length === 0 ? <p className="text-center py-6 text-gray-400">No records found.</p> : (
                            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {attendanceHistory.map(att => (
                                    <li key={att.id} className="bg-gray-50 p-3 rounded-xl flex justify-between items-center text-sm border border-gray-100">
                                        <span className="font-bold text-gray-700">{att.date}</span>
                                        <div>
                                            <span className="text-green-600 font-bold mr-3">IN: {att.check_in ? att.check_in.slice(0, 5) : '--'}</span>
                                            <span className="text-red-500 font-bold">OUT: {att.check_out ? att.check_out.slice(0, 5) : '--'}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminEmployees;