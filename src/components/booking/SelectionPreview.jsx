import React from 'react';
import { User, Calendar, Clock, Scissors, X } from 'lucide-react';

const SelectionPreview = ({ services, selectedServices, employees, selectedEmployee, date, time, toggleService }) => {

    const selectedList = services.filter(s => selectedServices.includes(s.id));
    const stylist = employees.find(e => e.id === selectedEmployee);
    const totalPrice = selectedList.reduce((sum, s) => sum + Number(s.price), 0);
    const timeStr = Array.isArray(time) ? time[0] : time;

    if (selectedServices.length === 0 && !selectedEmployee && !date) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center opacity-50">
                <p className="text-gray-400 text-sm">Your selection will appear here...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24 animate-fade-in-up">
            <div className="bg-[#3F0D12] p-4 text-white">
                <h3 className="font-serif font-bold text-lg">Your Booking</h3>
            </div>

            <div className="p-5 space-y-6">

                {/* 1. Services */}
                {selectedList.length > 0 && (
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><Scissors size={12} /> Services</p>
                        <ul className="space-y-3">
                            {selectedList.map(s => (
                                <li key={s.id} className="flex justify-between items-start text-sm group">
                                    <div>
                                        <p className="font-bold text-[#3F0D12]">{s.name}</p>
                                        <p className="text-xs text-gray-500">{s.duration_minutes} mins</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-bold">₹{s.price}</span>
                                        <button onClick={() => toggleService(s.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 2. Stylist */}
                {stylist && (
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><User size={12} /> Stylist</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-[#3F0D12]">
                                {stylist.user_details?.username?.[0]}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-[#3F0D12]">{stylist.user_details?.username}</p>
                                <p className="text-[10px] text-gray-500">{stylist.job_title}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Date & Time */}
                {(date || timeStr) && (
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><Calendar size={12} /> Schedule</p>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-dotted border-gray-300">
                            <div className="text-xs font-bold text-[#3F0D12]">
                                {date || "Date..."}
                            </div>
                            {timeStr && (
                                <div className="flex items-center gap-1 text-[#D72638] font-bold text-sm">
                                    <Clock size={14} /> {timeStr}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Total */}
                <div className="border-t-2 border-gray-100 pt-4 flex justify-between items-center">
                    <span className="font-black text-gray-400 text-xs uppercase">Total Pay</span>
                    <span className="font-black text-xl text-[#D72638]">₹{totalPrice}</span>
                </div>

            </div>
        </div>
    );
};

export default SelectionPreview;
