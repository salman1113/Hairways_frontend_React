import React from 'react';
import { Scissors } from 'lucide-react';

const IntroScreen = ({ onComplete }) => {
  return (
    <div 
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center 
      bg-[var(--color-bordeaux)] text-[var(--color-soft-blush)] 
      transition-transform duration-700 ease-in-out"
    >
      <div className="animate-bounce mb-4">
        <div className="p-6 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
          <Scissors size={64} className="text-[var(--color-soft-blush)]" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-wider animate-pulse">
        Hair Ways
      </h1>
      <p className="mt-4 text-sm uppercase tracking-[0.4em] opacity-80">
        Premium Styling Experience
      </p>
    </div>
  );
};

export default IntroScreen;