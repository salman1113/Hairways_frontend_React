import React from 'react';
import { Scissors } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-secondary)]/90 backdrop-blur-lg transition-colors duration-300">
      
      <div className="flex flex-col items-center">
        
        {/* Scissor Circle */}
        <div className="relative p-6 rounded-full border border-[var(--border-color)] shadow-2xl bg-[var(--bg-primary)] ring-1 ring-[var(--border-color)]">
          
          <Scissors 
            size={48} 
            className="animate-snip text-[var(--accent-crimson)] drop-shadow-md" 
          />
        </div>

        {/* Loading Text */}
        <h2 className="mt-8 text-sm font-serif font-bold tracking-[0.3em] text-[var(--text-primary)] animate-pulse">
          LOADING...
        </h2>

        {/* Loading Bar */}
        <div className="w-24 h-1 bg-[var(--border-color)] rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-[var(--accent-crimson)] w-1/2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        </div>

      </div>
    </div>
  );
};

export default Loader;