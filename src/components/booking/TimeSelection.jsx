import React from 'react';
import { Calendar, Clock, Sun, Moon, Sunset } from 'lucide-react';

const TimeSelection = ({ date, setDate, time, setTime }) => {

    // Generate Time Slots based on time of day
    const morningSlots = ['09:00', '10:00', '11:00'];
    const afternoonSlots = ['12:00', '13:00', '14:00', '15:00', '16:00'];
    const eveningSlots = ['17:00', '18:00', '19:00', '20:00'];

    // Helper to handle time selection (supports single string or array)
    const isSelected = (slot) => {
        const current = Array.isArray(time) ? time[0] : time;
        return current === slot;
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center">
                <h2 className="text-2xl font-serif font-bold text-[#3F0D12]">Date & Time</h2>
                <p className="text-gray-500 text-sm">When should we expect you?</p>
            </div>

            {/* Date Picker (Enhanced) */}
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-[#D72638] shadow-sm"><Calendar size={20} /></div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase">Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="bg-transparent font-bold text-[#3F0D12] outline-none w-full cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-4">
                {/* Morning */}
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Sun size={14} /> Morning</p>
                    <div className="grid grid-cols-3 gap-3">
                        {morningSlots.map(slot => (
                            <button key={slot} onClick={() => setTime(slot)}
                                className={`py-2 rounded-xl text-sm font-bold transition-all
                          ${isSelected(slot) ? 'bg-[#3F0D12] text-white shadow-md' : 'bg-white border border-gray-100 hover:border-gray-300 text-gray-600'}`}>
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Afternoon */}
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Sun size={14} /> Afternoon</p>
                    <div className="grid grid-cols-4 gap-3">
                        {afternoonSlots.map(slot => (
                            <button key={slot} onClick={() => setTime(slot)}
                                className={`py-2 rounded-xl text-sm font-bold transition-all
                          ${isSelected(slot) ? 'bg-[#3F0D12] text-white shadow-md' : 'bg-white border border-gray-100 hover:border-gray-300 text-gray-600'}`}>
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Evening */}
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><Moon size={14} /> Evening</p>
                    <div className="grid grid-cols-4 gap-3">
                        {eveningSlots.map(slot => (
                            <button key={slot} onClick={() => setTime(slot)}
                                className={`py-2 rounded-xl text-sm font-bold transition-all
                          ${isSelected(slot) ? 'bg-[#3F0D12] text-white shadow-md' : 'bg-white border border-gray-100 hover:border-gray-300 text-gray-600'}`}>
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TimeSelection;
