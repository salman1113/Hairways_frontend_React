import React from 'react';
import { Scissors } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center 
      bg-white/95 dark:bg-[#2A080C]/95 backdrop-blur-md transition-colors duration-300">
      
      <div className="flex flex-col items-center">
        
        {/* Scissor with Adaptive Colors */}
        <div className="relative p-5 rounded-full border shadow-xl
          bg-white border-crimson/20 
          dark:bg-white/5 dark:border-white/10">
          
          <Scissors 
            size={56} 
            className="animate-snip 
            text-crimson 
            dark:text-[var(--color-soft-blush)]" 
          />
        </div>

        {/* Text changing based on theme */}
        <h2 className="mt-6 text-xl font-serif font-bold tracking-widest
          text-[var(--color-bordeaux)] 
          dark:text-[var(--color-soft-blush)]">
          LOADING...
        </h2>

      </div>
    </div>
  );
};

export default Loader;