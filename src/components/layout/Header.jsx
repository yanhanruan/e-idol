import { Bell, ChevronDown } from "lucide-react";
import { useTranslations } from '../../contexts/LanguageContext';

import React, { useState, useRef, useEffect } from 'react';

const LanguageSelector = ({ lang, setLang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { value: 'ja', label: '🇯🇵 日本語' },
        { value: 'en', label: '🇬🇧 English' },
        { value: 'zh', label: '🇨🇳 简体中文' }
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

    // 【关键改动 1】
    // handleSelect 现在调用的是从 Context 传来的 setLang
    // 这将触发全局状态更新
    const handleSelect = (value) => {
        setLang(value); //
        setIsOpen(false);
    };

    // selectedLanguage 现在使用来自 Context 的 lang
    const selectedLanguage = languages.find(l => l.value === lang);
    const sharedClasses = "font-mono bg-[rgba(0,50,100,0.3)] border border-[rgba(0,255,255,0.3)] text-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.15),_inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[10px]";

    return (
        <div className="flex items-center space-x-3">
            <div ref={dropdownRef} className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
              text-sm rounded-xl px-3 py-2 focus:outline-none 
              font-medium transition-all cursor-pointer 
              flex items-center space-x-2
              w-35
              sm:w-36
              justify-center
              ${sharedClasses}
            `}
                >
                    {/* 确保 selectedLanguage 不为 undefined，以防万一 */}
                    <span className="text-left truncate">{selectedLanguage?.label}</span>
                    <ChevronDown
                        className={`
                w-4 h-4 transition-transform duration-150 text-[#00ffff]
                ${isOpen ? 'rotate-180' : ''}
              `}
                    />
                </button>
                {isOpen && (
                    <div
                        className={`
                absolute top-full left-0 right-0 mt-1 
                rounded-xl overflow-hidden z-50
                animate-dropdown-fade-in
                ${sharedClasses}
              `}
                    >
                        {languages.map((language, index) => (
                            <React.Fragment key={language.value}>
                                {index > 0 && (
                                    <div className="mx-2 h-[1px] bg-[rgba(0,255,255,0.1)]" />
                                )}
                                <button
                                    onClick={() => handleSelect(language.value)}
                                    className={`
                      w-full text-left px-3 py-2 text-sm font-medium 
                      transition-all duration-90
                      font-mono text-[#00ffff]
                      ${lang === language.value
                                            ? 'bg-[rgba(70,244,255,0.15)]' // 选中状态
                                            : 'bg-transparent hover:bg-[rgba(0,255,255,0.08)] active:bg-[rgba(0,255,255,0.15)]' // 未选中状态
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

const Header = () => {
    const { lang, setLang, t } = useTranslations();
    return (
        <header className="sticky top-0 z-50" style={{
            background: 'rgba(10, 13, 30, 0.75)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 255, 255, 0.1) inset'
        }}>
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@300;400;700&display=swap" rel="stylesheet" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group" style={{
                            background: 'linear-gradient(135deg, rgba(0, 100, 150, 0.4), rgba(0, 50, 100, 0.4))',
                            border: '1px solid rgba(0, 255, 255, 0.4)',
                            boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <span className="group-hover:scale-110 transition-transform">👤</span>
                        </button>
                        <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group" style={{
                            background: 'linear-gradient(135deg, rgba(100, 0, 150, 0.4), rgba(50, 0, 100, 0.4))',
                            border: '1px solid rgba(255, 0, 255, 0.4)',
                            boxShadow: '0 0 20px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <span className="group-hover:scale-110 transition-transform">➕</span>
                        </button>
                        <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 relative group" style={{
                            background: 'linear-gradient(135deg, rgba(150, 0, 100, 0.4), rgba(100, 0, 50, 0.4))',
                            border: '1px solid rgba(255, 0, 100, 0.4)',
                            boxShadow: '0 0 20px rgba(255, 0, 100, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{
                                background: 'linear-gradient(135deg, #ff0055, #ff3388)',
                                boxShadow: '0 0 15px rgba(255, 0, 85, 0.8), 0 0 5px rgba(255, 0, 85, 1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            }}>3</span>
                        </button>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
                        {['home', 'search', 'message'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                // 1. <a> 标签的样式已全部转为 Tailwind 类
                                className="
                                    transition-all font-bold relative group py-1  
                                    font-mono                                  
                                    text-sm                                    
                                    tracking-wider                              
                                    text-[#00ffff]                            
                                    [text-shadow:0_0_10px_rgba(0,255,255,0.8)]   
                                "
                            >
                                {t[item]}
                                <span
                                    className={`
                                        absolute -bottom-1 left-0 h-0.5 
                                        transition-all duration-300 group-hover:w-full     
                                        bg-gradient-to-r from-[#00ffff] to-[#0099ff]      
                                        shadow-[0_0_10px_rgba(0,255,255,0.8)]              
                                        ${item === 'search' ? 'w-full' : 'w-0'}            
                                    `}
                                ></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        <LanguageSelector t={t} lang={lang} setLang={setLang} />

                        <button className=" text-base opacity-90 px-1 py-2 text-white rounded-full transition-all font-bold hover:scale-105" style={{
                            fontFamily: "'Roboto Mono', monospace",
                            background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
                            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                            textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                        }}>
                            {t.register}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;