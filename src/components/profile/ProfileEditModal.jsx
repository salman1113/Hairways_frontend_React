import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileEditModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        phone_number: user.phone_number || '',
        bio: user.bio || '',
        preferences: user.preferences || '',
        face_shape: user.face_shape || '',
        birth_date: user.birth_date || ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Sanitize Payload
        const payload = { ...formData };
        if (!payload.birth_date) payload.birth_date = null;
        if (!payload.phone_number) payload.phone_number = null;
        if (!payload.face_shape) payload.face_shape = "";

        const toastId = toast.loading("Updating Profile...");

        try {
            await onSave(payload);
            toast.success("Profile Updated Successfully! 🎉", { id: toastId });
            onClose();
        } catch (error) {
            console.error(error);
            let errorMsg = "Update failed. Please try again.";

            // Extract Backend Validation Errors
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (typeof data === 'object') {
                    // Format: "field: [error1, error2]"
                    errorMsg = Object.entries(data)
                        .map(([key, val]) => `${key.replace('_', ' ')}: ${Array.isArray(val) ? val.join(', ') : val}`)
                        .join('\n');
                } else {
                    errorMsg = String(data);
                }
            }

            toast.error(errorMsg, { id: toastId, duration: 5000 });
            // Keep modal open so user can fix inputs
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 shadow-2xl">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-[#3F0D12] p-5 flex justify-between items-center">
                    <h2 className="text-white font-serif text-xl font-bold">Edit Profile</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3F0D12]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3F0D12]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Bio / Status</label>
                        <textarea
                            name="bio"
                            rows="2"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us a bit about yourself..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3F0D12]"
                        ></textarea>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Styling Preferences</label>
                        <textarea
                            name="preferences"
                            rows="2"
                            value={formData.preferences}
                            onChange={handleChange}
                            placeholder="e.g. I prefer short sides, natural look..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3F0D12]"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Face Shape</label>
                            <select
                                name="face_shape"
                                value={formData.face_shape}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3F0D12]"
                            >
                                <option value="">Select...</option>
                                <option value="Oval">Oval</option>
                                <option value="Round">Round</option>
                                <option value="Square">Square</option>
                                <option value="Diamond">Diamond</option>
                                <option value="Heart">Heart</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Birth Date</label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#3F0D12]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#D72638] text-white font-bold rounded-xl hover:bg-[#b01e2e] transition shadow-lg flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
