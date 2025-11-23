
import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface HeaderProps {
  onNavigate: (page: 'home' | 'menu' | 'drinks' | 'imageEditor' | 'admin') => void;
}

// Pilot Wings Badge Icon (Stacked Lines - Long to Short)
// Wider version to match the "Book Now" button width
const MenuIcon = () => (
  <svg className="w-24 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" viewBox="0 0 80 24" fill="currentColor">
    {/* Line 1 - Longest */}
    <rect x="0" y="4" width="80" height="3" rx="1.5" />
    {/* Line 2 */}
    <rect x="10" y="9" width="60" height="3" rx="1.5" />
    {/* Line 3 */}
    <rect x="20" y="14" width="40" height="3" rx="1.5" />
    {/* Line 4 - Shortest */}
    <rect x="30" y="19" width="20" height="3" rx="1.5" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-10 h-10 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);


const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { headerData } = useData();

  const handleMobileNav = (page: 'home' | 'menu' | 'drinks' | 'imageEditor') => {
    onNavigate(page);
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md">
      <style>{`
        @keyframes wing-enter-left {
          0% { opacity: 0; transform: translateX(-50px) skewX(-15deg) scale(0.9); }
          100% { opacity: 1; transform: translateX(0) skewX(0) scale(1); }
        }
        @keyframes wing-enter-right {
          0% { opacity: 0; transform: translateX(50px) skewX(15deg) scale(0.9); }
          100% { opacity: 1; transform: translateX(0) skewX(0) scale(1); }
        }
        @keyframes item-slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-wing-left {
          animation: wing-enter-left 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-wing-right {
          animation: wing-enter-right 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-item-stagger-1 {
          animation: item-slide-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-item-stagger-2 {
          animation: item-slide-up 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
      <div className="container mx-auto px-4 py-2 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        
        {/* Left Section */}
        <div className="flex justify-start items-center">
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="md:hidden z-50 p-1 mr-2 focus:outline-none transition-all duration-300 ease-out hover:scale-105"
            >
                <div className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-90 scale-110' : 'rotate-0'}`}>
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </div>
            </button>

            {/* Desktop Left Nav */}
            <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-sm text-gray-300 hover:text-white font-medium tracking-wide">Our Rooms</a>
                <button onClick={() => onNavigate('menu')} className="text-sm text-gray-300 hover:text-white bg-transparent border-none p-0 font-medium tracking-wide">Food Menu</button>
                <button onClick={() => onNavigate('drinks')} className="text-sm text-gray-300 hover:text-white bg-transparent border-none p-0 font-medium tracking-wide">Drinks Menu</button>
            </div>
        </div>

        {/* Center Section - Logo */}
        <div className="flex justify-center items-center">
            <button onClick={() => onNavigate('home')} className="focus:outline-none z-10 transition-transform duration-300 hover:scale-105">
                <div className="w-20 h-20 md:w-24 md:h-24 relative flex items-center justify-center">
                    <img 
                    src={headerData.logoUrl} 
                    alt="London Karaoke Club Logo" 
                    className="w-full h-full object-contain drop-shadow-lg" 
                    />
                </div>
            </button>
        </div>
        
        {/* Right Section */}
        <div className="flex justify-end items-center">
             {/* Desktop Right Nav */}
            <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => onNavigate('imageEditor')} className="text-sm text-gray-300 hover:text-white bg-transparent border-none p-0 font-medium tracking-wide">AI Image Magic</button>
                <button className="glitter-button bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold py-2 px-6 rounded-full border-2 border-white transition-transform duration-300 ease-in-out hover:scale-105 shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                    Book Now
                </button>
            </div>

            {/* Mobile Book Button */}
            <div className="md:hidden">
                <button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
                Book Now
                </button>
            </div>
        </div>
      </div>
      
      {/* Mobile Menu Wings */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-[80px] left-0 w-full h-[calc(100vh-80px)] pointer-events-none overflow-hidden z-40">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setIsMenuOpen(false)}></div>
            
            <div className="relative w-full px-4 pt-8 flex justify-between gap-4 pointer-events-none">
                {/* Left Wing */}
                <div className="w-1/2 bg-gradient-to-br from-zinc-900 to-purple-900 border-2 border-white rounded-tl-2xl rounded-tr-sm rounded-bl-[60px] rounded-br-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-8 animate-wing-left origin-top-right pointer-events-auto">
                    <a href="#" className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-1" onClick={() => setIsMenuOpen(false)}>OUR ROOMS</a>
                    <button onClick={() => handleMobileNav('menu')} className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-2">FOOD MENU</button>
                </div>

                {/* Right Wing */}
                <div className="w-1/2 bg-gradient-to-bl from-zinc-900 to-purple-900 border-2 border-white rounded-tr-2xl rounded-tl-sm rounded-br-[60px] rounded-bl-3xl p-6 shadow-[0_0_30px_rgba(147,51,234,0.6)] flex flex-col items-center gap-8 animate-wing-right origin-top-left pointer-events-auto">
                    <button onClick={() => handleMobileNav('drinks')} className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-1">DRINKS MENU</button>
                    <button onClick={() => handleMobileNav('imageEditor')} className="text-xl font-black tracking-wider text-gray-100 hover:text-pink-400 transition-colors border-b-2 border-transparent hover:border-pink-500 pb-1 animate-item-stagger-2">AI STUDIO</button>
                </div>
            </div>
            
             {/* Central Decorative Tail */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
