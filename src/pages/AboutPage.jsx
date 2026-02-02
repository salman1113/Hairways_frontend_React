import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-fade-in">
      <Navbar />
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-serif font-bold text-[var(--text-primary)] mb-6">Our Story</h1>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
          Founded in 2024, LaraStyles began with a simple mission: to blend traditional grooming with modern technology. 
          We believe that style is personal, and your time is precious. That's why we've built a system that respects both.
        </p>
        <img src="https://images.unsplash.com/photo-1521590832896-7b5996a63213?auto=format&fit=crop&q=80&w=1000" className="w-full rounded-3xl shadow-xl mb-12 grayscale hover:grayscale-0 transition duration-700"/>
        
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Precision", desc: "Expert stylists tailored to you." },
                { title: "Luxury", desc: "An ambiance that relaxes the soul." },
                { title: "Technology", desc: "Seamless booking, zero waiting." }
            ].map((item, i) => (
                <div key={i} className="p-6 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)]">
                    <h3 className="font-serif font-bold text-xl text-[var(--text-primary)] mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;