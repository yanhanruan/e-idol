import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Globe, User, Plus, Menu, X } from "lucide-react";
import { useTranslations } from '../../contexts/LanguageContext';
import { useTransition } from '@src/contexts/TransitionContext';

// --- Sub-component: LanguageSelector (保持完全原样) ---
const LanguageSelector = ({ lang, setLang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { startTransition } = useTransition(); 

    const languages = [
        { value: 'ja', label: '日本語' },
        { value: 'en', label: 'English' },
        { value: 'zh', label: '简体中文' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        if (value === lang) {
            setIsOpen(false);
            return;
        }
        setIsOpen(false); 
        startTransition(() => {
            setLang(value);
        });
    };

    const selectedLanguage = languages.find(l => l.value === lang);
    const sharedClasses = "font-sans bg-[#050510]/80 border border-white/10 text-slate-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md group-hover:text-cyan-50 transition-all duration-300";

    return (
        <div className="flex items-center" ref={dropdownRef}>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        relative flex items-center justify-center
                        focus:outline-none font-medium cursor-pointer 
                        group hover:bg-[#0a0a20] hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]
                        ${sharedClasses}
                        w-9 h-9 rounded-full 
                        md:w-36 md:h-auto md:py-1.5 md:px-4 md:justify-between
                    `}
                >
                    <span className="md:hidden flex items-center justify-center">
                         <Globe className="w-4 h-4 group-hover:text-cyan-200/70 transition-colors" />
                    </span>
                    <span className="hidden md:block truncate tracking-wide text-sm">
                        {selectedLanguage?.label}
                    </span>
                    <ChevronDown
                        className={`
                            hidden md:block w-4 h-4 transition-transform duration-300 text-slate-400 group-hover:text-cyan-400
                            ${isOpen ? 'rotate-180' : ''}
                        `}
                    />
                </button>
                {isOpen && (
                    <div
                        className={`
                            absolute top-full right-0 mt-2 
                            w-36 rounded-xl overflow-hidden z-50
                            border border-white/10 bg-[#0a0a1a]
                            shadow-[0_0_30px_rgba(0,0,0,0.8)]
                        `}
                    >
                        {languages.map((language, index) => (
                            <React.Fragment key={language.value}>
                                {index > 0 && (
                                    <div className="mx-2 h-[1px] bg-white/5" />
                                )}
                                <button
                                    onClick={() => handleSelect(language.value)}
                                    className={`
                                        w-full text-left px-4 py-3 text-sm font-medium
                                        transition-all duration-200
                                        font-sans tracking-wide
                                        ${lang === language.value
                                            ? 'text-cyan-400 bg-cyan-900/20'
                                            : 'text-slate-400 hover:text-cyan-50 hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {language.label}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Main Component: Header ---
const Header = () => {
    const { lang, setLang, t } = useTranslations();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 1. 创建 Refs 用于检测点击外部
    const mobileMenuRef = useRef(null);
    const mobileMenuBtnRef = useRef(null);

    const leftButtonBaseClass = "w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group border border-white/5 relative";

    const navItems = ['home', 'process', 'pricing','castList','recruitment'];

    // 2. 添加 useEffect 处理点击外部关闭菜单逻辑
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 如果菜单是打开的，且点击的目标既不在菜单内，也不在触发按钮内
            if (
                isMobileMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                mobileMenuBtnRef.current &&
                !mobileMenuBtnRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    return (
        <header className="sticky top-0 z-50 w-full h-15 py-2 md:py-0 md:h-14 bg-[#172133]/90 backdrop-blur-md border-b border-white/5 font-sans">  

            <div className="relative z-10 max-w-[1920px] h-full mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-full">

                    {/* --- LEFT SECTION --- */}
                    <div className="flex items-center space-x-3">
                        <button className={leftButtonBaseClass} style={{
                            background: 'linear-gradient(135deg, rgba(0, 100, 150, 0.4), rgba(0, 50, 100, 0.4))',
                            boxShadow: '0 0 15px rgba(0, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <User size={18} className="group-hover:scale-110 transition-transform" />
                        </button>

                        <button className={leftButtonBaseClass} style={{
                            background: 'linear-gradient(135deg, rgba(100, 0, 150, 0.4), rgba(50, 0, 100, 0.4))',
                            boxShadow: '0 0 15px rgba(255, 0, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Plus size={18} className="group-hover:scale-110 transition-transform" />
                        </button>

                        <button className={leftButtonBaseClass} style={{
                            background: 'linear-gradient(135deg, rgba(150, 0, 100, 0.4), rgba(100, 0, 50, 0.4))',
                            boxShadow: '0 0 15px rgba(255, 0, 100, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Bell size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center text-white shadow-sm" style={{
                                background: 'linear-gradient(135deg, #ff0055, #ff3388)',
                                boxShadow: '0 0 10px rgba(255, 0, 85, 0.6)'
                            }}>3</span>
                        </button>
                    </div>

                    {/* --- CENTER SECTION: Desktop Navigation --- */}
                    <nav className="hidden md:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2 h-full">
                        {navItems.map((item) => {
                            const isActive = item === 'home';
                            return (
                                <a
                                    key={item}
                                    href="#"
                                    className="group relative flex flex-col items-center justify-center outline-none h-full px-2"
                                >
                                    <span
                                        className={`text-sm tracking-wider transition-all duration-300 ease-out
                                            ${isActive
                                                ? 'text-cyan-50 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                                                : 'text-slate-400 group-hover:text-slate-200'
                                            }
                                        `}
                                    >
                                        {t[item]}
                                    </span>
                                    <span
                                        className={`absolute bottom-3 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] transition-all duration-300 ease-out
                                            ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}
                                        `}
                                    ></span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* --- RIGHT SECTION --- */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <LanguageSelector t={t} lang={lang} setLang={setLang} />

                        {/* Mobile Menu Toggle Button */}
                        <button 
                            ref={mobileMenuBtnRef} // 绑定 Ref
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[#050510]/80 border border-white/10 text-slate-300 hover:text-cyan-400 transition-colors duration-300 focus:outline-none shadow-[0_0_15px_rgba(0,0,0,0.3)] ml-1"
                        >
                            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                        {/* Register Button */}
                        <div className="relative group">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full opacity-70 blur-[2px] group-hover:opacity-100 group-hover:blur-[4px] transition duration-300"></div>
                            <button className="relative px-5 py-1 bg-[#050510] rounded-full flex items-center justify-center overflow-hidden border border-white/10 hover:bg-[#0a0a20] transition-colors duration-300">
                                <span className="text-sm font-semibold bg-gradient-to-r from-cyan-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                                    {t.register}
                                </span>
                                <div className="absolute top-0 -left-10 w-10 h-full bg-white/10 -skew-x-12 group-hover:translate-x-40 transition-transform duration-700 ease-in-out"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 4. Mobile Navigation Menu (下拉面板) --- */}
            <div 
                ref={mobileMenuRef} // 绑定 Ref
                className={`
                    md:hidden absolute top-full 
                    right-0 w-1/2 min-w-[200px]  
                    bg-[#172133]/90 backdrop-blur-xl 
                    border-b border-l border-white/10 
                    rounded-bl-2xl
                    transition-all duration-300 ease-in-out origin-top-right overflow-hidden
                    ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
                `}
            >
                <div className="flex flex-col py-4 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = item === 'home';
                        return (
                            <a
                                key={item}
                                href="#"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                                    relative px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300
                                    ${isActive 
                                        ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                                        : 'text-slate-400 hover:text-cyan-50 hover:bg-white/5 border border-transparent'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    {t[item]}
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>

        </header>
    );
}

export default Header;