import { useEffect, useRef, useState } from 'react';
import { Bell, Globe, LogOut, Menu, Plus, User, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { useTranslations } from '../../contexts/LanguageContext';
import { useTransition } from '../../contexts/TransitionContext';
import { useAuth } from '../../contexts/AuthContext';
import type { Locale } from '../../types';
import CyberButton from '../ui/CyberButton';
import CyberSelect from '../ui/CyberSelect';

const glassStyle = 'bg-[#050510]/80 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]';
const transitionStyle = 'transition-all duration-300 ease-in-out';

const navConfig = {
  home: '/',
  process: '/process',
  pricing: '/pricing',
  castList: '/castList',
  recruitment: '/recruitment',
} as const;

type NavKey = keyof typeof navConfig;
const navItems = Object.keys(navConfig) as NavKey[];

const LanguageSelector = () => {
  const { lang, setLang } = useTranslations();
  const { startTransition } = useTransition();
  const languages: { value: Locale; label: string }[] = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
    { value: 'zh', label: '简体中文' },
  ];
  const currentLabel = languages.find((l) => l.value === lang)?.label;

  return (
    <CyberSelect
      value={lang}
      label={currentLabel}
      options={languages}
      onChange={(val) => startTransition(() => setLang(val))}
      icon={<Globe />}
    />
  );
};

const Header = () => {
  const { t } = useTranslations();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { startTransition } = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const leftBtnClass = `w-8 h-8 rounded-lg flex items-center justify-center text-white hover:scale-110 group border border-white/5 relative ${transitionStyle}`;

  const handleNavigation = (path: string) => {
    if (location === path) return;
    setIsMobileMenuOpen(false);
    startTransition(() => {
      setLocation(path);
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full h-14 md:h-12 py-2 md:py-0 bg-[#0a0a1aa4] backdrop-blur-md border-b border-white/5 font-sans">
      <div className="relative z-10 max-w-7xl h-full mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-2">
            <button
              className={leftBtnClass}
              style={{ background: 'linear-gradient(135deg, rgba(0, 100, 150, 0.4), rgba(0, 50, 100, 0.4))', boxShadow: '0 0 15px rgba(0, 255, 255, 0.15)' }}
            >
              <User size={16} />
            </button>
            <button
              className={leftBtnClass}
              style={{ background: 'linear-gradient(135deg, rgba(100, 0, 150, 0.4), rgba(50, 0, 100, 0.4))', boxShadow: '0 0 15px rgba(255, 0, 255, 0.15)' }}
            >
              <Plus size={16} />
            </button>
            <button
              className={leftBtnClass}
              style={{ background: 'linear-gradient(135deg, rgba(150, 0, 100, 0.4), rgba(100, 0, 50, 0.4))', boxShadow: '0 0 15px rgba(255, 0, 100, 0.15)' }}
            >
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-[8px] flex items-center justify-center text-white bg-gradient-to-br from-[#ff0055] to-[#ff3388] shadow-[0_0_10px_rgba(255,0,85,0.6)]">
                3
              </span>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2 h-full">
            {navItems.map((item) => {
              const path = navConfig[item];
              const isActive = location === path;

              return (
                <button key={item} onClick={() => handleNavigation(path)} className="group relative flex flex-col items-center justify-center h-full px-1 outline-none cursor-pointer">
                  <span
                    className={`text-xs font-medium tracking-widest whitespace-nowrap ${transitionStyle} ${
                      isActive ? 'text-cyan-50 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {String(t[item])}
                  </span>
                  <span
                    className={`absolute bottom-2 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] ${transitionStyle} ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  ></span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3">
            <LanguageSelector />

            <button ref={btnRef} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden flex items-center justify-center w-8 h-8 rounded-full text-slate-300 hover:text-cyan-400 ml-1 ${glassStyle} ${transitionStyle}`}>
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* login info */}
            <div className="scale-90 origin-right">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">

                  {/* username */}
                  <span className="hidden md:block text-sm font-medium text-slate-200 tracking-wide">
                    {user.username}
                  </span>

                  {/* logout button */}
                  <button
                    onClick={() => { logout(); handleNavigation('/'); }}
                    // title={String(t.logout)}
                    className="relative group w-8 h-8 bg-[#050510] rounded-lg flex items-center justify-center border border-cyber-border text-slate-400 transition-all duration-300 hover:bg-[#0a0a20] hover:border-cyan-500/30 hover:shadow-neon-cyan overflow-hidden"
                  >
                    <LogOut size={14} className="relative z-10 group-hover:text-cyan-400" />
                  </button>

                </div>
              ) : (
                <CyberButton text={String(t.register)} onClick={() => handleNavigation('/login')} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={menuRef}
        className={`
          md:hidden absolute top-full right-0 w-1/2 min-w-[200px]
          bg-[#0a0a1ad1] backdrop-blur-xl border-b border-l border-white/10 rounded-bl-2xl shadow-[-10px_10px_30px_rgba(0,0,0,0.5)]
          origin-top-right overflow-hidden
          ${transitionStyle}
          ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex flex-col py-4 px-4 space-y-2">
          {navItems.map((item) => {
            const path = navConfig[item];
            const isActive = location === path;

            return (
              <div key={item}>
                <button
                  onClick={() => handleNavigation(path)}
                  className={`
                    relative px-4 py-3 rounded-lg text-sm font-medium tracking-wide flex items-center justify-between cursor-pointer w-full ${transitionStyle}
                    ${isActive ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-cyan-50 hover:bg-white/5 border border-transparent'}
                  `}
                >
                  {String(t[item])}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
