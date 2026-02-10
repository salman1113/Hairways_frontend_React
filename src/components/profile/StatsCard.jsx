import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, subtext }) => {
    return (
        <div className={`bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 transition hover:shadow-md`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-[#3F0D12]">{value}</h3>
                {subtext && <p className="text-xs text-gray-500 font-medium">{subtext}</p>}
            </div>
        </div>
    );
};

export default StatsCard;
