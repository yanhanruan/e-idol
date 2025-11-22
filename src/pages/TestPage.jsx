import React, { useState } from 'react';

const Header = () => {
  // State to handle active menu item (defaulting to Home as per image)
  const [activeTab, setActiveTab] = useState('ホーム');

  const navItems = [
    { name: 'ホーム', label: 'Home' },     // Home
    { name: 'メッセージ', label: 'Message' }, // Message
    { name: 'イベント', label: 'Event' },   // Event
  ];

  return (
    <div className="w-full h-24 bg-[#03030a] relative overflow-hidden flex items-center justify-center font-sans">
      {/* Background Effects: 
        Deep dark background with subtle radial glow to mimic the reference gradient 
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1a] to-[#020205] z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-blue-900/10 blur-3xl z-0 pointer-events-none"></div>

      {/* Main Container - Preserving layout structure */}
      <div className="relative z-10 w-full max-w-[1920px] px-10 flex items-center justify-end h-full">
        
        {/* Navigation Group */}
        {/* Spacing and position strictly aligned to the center-right area */}
        <nav className="flex items-center gap-12 mr-16 lg:mr-32">
          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className="group relative flex flex-col items-center justify-center outline-none"
              >
                <span
                  className={`text-sm md:text-base tracking-wider transition-all duration-300 ease-out
                    ${isActive 
                      ? 'text-cyan-50 font-medium drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' 
                      : 'text-slate-400 group-hover:text-slate-200'
                    }
                  `}
                >
                  {item.name}
                </span>

                {/* Active Underline Indicator */}
                {/* Matches the glowing cyan line in the reference */}
                <span
                  className={`absolute -bottom-3 h-[3px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] transition-all duration-300 ease-out
                    ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}
                  `}
                ></span>
              </button>
            );
          })}
        </nav>

        {/* Call to Action Button (Login/Register) */}
        {/* Positioned on the far right with gradient border style */}
        <div className="relative group">
          {/* Gradient Border Container */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full opacity-70 blur-[2px] group-hover:opacity-100 group-hover:blur-[4px] transition duration-300"></div>
          
          <button className="relative px-8 py-2 bg-[#050510] rounded-full flex items-center justify-center overflow-hidden border border-white/10 hover:bg-[#0a0a20] transition-colors duration-300">
            {/* Inner Text Glow */}
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              ログイン / 登録
            </span>
            
            {/* Subtle shine effect on hover */}
            <div className="absolute top-0 -left-10 w-10 h-full bg-white/10 -skew-x-12 group-hover:translate-x-40 transition-transform duration-700 ease-in-out"></div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Header;