import React from 'react';
import { Scissors } from 'lucide-react';

const IntroScreen = ({ onComplete }) => {
  return (
    <div 
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#3F0D12] text-[#FBE4E3] transition-transform duration-700 ease-in-out"
    >
      {/* Icon Animation */}
      <div className="animate-bounce mb-6">
        <div className="p-8 bg-white/5 rounded-full backdrop-blur-md border border-white/10 shadow-2xl ring-1 ring-white/20">
          <Scissors size={64} className="text-[#D72638]" /> {/* Crimson Red Scissor */}
        </div>
      </div>
      
      {/* Brand Name */}
      <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-wider animate-pulse text-white drop-shadow-lg">
        Hair Ways
      </h1>
      
      {/* Tagline */}
      <p className="mt-4 text-xs md:text-sm uppercase tracking-[0.4em] text-[#FBE4E3] opacity-80 font-medium">
        Premium Styling Experience
      </p>

      {/* Loading Indicator at Bottom */}
      <div className="absolute bottom-10">
        <div className="w-10 h-10 border-4 border-white/20 border-t-[#D72638] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default IntroScreen;