
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

// Icon Components
const MusicalNoteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6Z"/></svg>
);
const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>
);
const ChampagneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13 1.07V1h-2v.07C7.67 1.56 5 4.73 5 8.5c0 2.53.94 4.79 2.44 6.44L5 23h14l-2.44-8.06C18.06 13.29 19 11.03 19 8.5c0-3.77-2.67-6.94-6-7.43zM7 9h10c-.17 3.03-1.44 5.3-3.05 6.57l-1.95.88-.02.01-1.93-.87C8.42 14.3 7.17 12.03 7 9z" /></svg>
);
const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.16 3l-1.12 1.48L3 10.48l9 10.52l9-10.52l-8.04-6.01zM12 5.48l5.85 4.38L12 18.52L6.15 9.86L12 5.48z" /></svg>
);
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z" /></svg>
);

const particleElements = [
  { type: 'text', content: 'Neon Nights' },
  { type: 'text', content: 'Bohemian Rhapsody' },
  { type: 'text', content: 'Sweet Caroline' },
  { type: 'text', content: 'Mr. Brightside' },
  { type: 'text', content: "Don't Stop Believin'" },
  { type: 'text', content: 'Dancing Queen' },
  { type: 'text', content: 'I Will Survive' },
  { type: 'text', content: 'Wonderwall' },
  { type: 'text', content: 'Shallow' },
  { type: 'icon', content: <MusicalNoteIcon className="w-full h-full" /> },
  { type: 'icon', content: <MicrophoneIcon className="w-full h-full" /> },
  { type: 'icon', content: <ChampagneIcon className="w-full h-full" /> },
  { type: 'icon', content: <DiamondIcon className="w-full h-full" /> },
  { type: 'icon', content: <StarIcon className="w-full h-full" /> },
];

const particles = Array.from({ length: 30 }).map((_, i) => {
    const element = particleElements[Math.floor(Math.random() * particleElements.length)];
    const isText = element.type === 'text';
    const size = isText ? Math.random() * 60 + 20 : Math.random() * 20 + 10;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * -25;
    const drift = (Math.random() - 0.5) * 200;

    return {
        id: i,
        content: element.content,
        isText,
        style: {
            '--drift': `${drift}px`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: isText ? 'auto' : `${size}px`,
            animation: `float-up ${duration}s ${delay}s linear infinite`,
            fontSize: isText ? `${size * 0.4}px` : '0px',
            color: 'rgba(255, 255, 255, 0.6)',
            filter: 'blur(1px)',
        } as React.CSSProperties,
    };
});

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const { heroData } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden">
      <style>{`
        @keyframes fade-in-scale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      
      <div className="absolute inset-0 z-0" style={{ transform: `translateY(${scrollY * 0.5}px) scale(1.1)` }}>
        <img 
          src={heroData.backgroundImageUrl}
          alt="Neon Karaoke Singer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Floating Party Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map(p => (
            <div key={p.id} style={p.style} className="absolute bottom-[-160px] opacity-0 z-0">
            {p.content}
            </div>
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="mb-4 inline-block">
           <span className="py-1 px-4 rounded-full bg-pink-600/80 backdrop-blur-sm border border-pink-400 text-white text-sm font-bold tracking-wider uppercase animate-pulse">
             {heroData.badgeText}
           </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight animate-fade-in-scale text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white">
          {heroData.headingText}
        </h2>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl mx-auto text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {heroData.subText}
        </p>
        <button className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-bold py-3 px-8 rounded-full border-2 border-white transition-transform duration-300 ease-in-out hover:scale-105 animate-fade-in-up shadow-[0_0_20px_rgba(250,204,21,0.4)]" style={{ animationDelay: '0.8s' }}>
          {heroData.buttonText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
