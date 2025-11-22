import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Globe, User, Plus } from "lucide-react"; 
import { useTranslations } from '../../contexts/LanguageContext';

// --- Sub-component: LanguageSelector ---
const LanguageSelector = ({ lang, setLang }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        setLang(value);
        setIsOpen(false);
    };

    const selectedLanguage = languages.find(l => l.value === lang);

    // 恢复原版视觉：深色玻璃 + 边框 + 阴影 + Cyan文字悬停
    const sharedClasses = "font-sans font-bold bg-[#050510]/80 border border-white/10 text-slate-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md group-hover:text-cyan-50 transition-all duration-300";

    return (
        <div className="flex items-center" ref={dropdownRef}>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        relative flex items-center justify-center
                        focus:outline-none cursor-pointer 
                        group hover:bg-[#0a0a20] hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]
                        ${sharedClasses}
                        
                        /* --- 响应式布局核心 --- */
                        /* 手机端：圆形，纯图标，w-9 h-9 (36px) */
                        w-9 h-9 rounded-full 
                        
                        /* 电脑端：胶囊形，文字+图标，宽度适中 */
                        md:w-36 md:h-auto md:py-1.5 md:px-4 md:justify-between
                    `}
                >
                    {/* 手机端显示的图标 (Globe) */}
                    <span className="md:hidden flex items-center justify-center">
                         <Globe className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                    </span>

                    {/* 电脑端显示的内容 (文字 + Chevron) */}
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

                {/* 下拉菜单 (保持原版样式) */}
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
                                        w-full text-left px-4 py-3 text-sm 
                                        transition-all duration-200
                                        font-sans font-bold tracking-wide
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

    // 恢复原版内联样式逻辑，但应用到更紧凑的尺寸上
    // 保留了 gradient 背景和 box-shadow 光晕
    const leftButtonBaseClass = "w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group border border-white/5 relative";

    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-[#03030a] font-sans font-bold">
            {/* --- Background Effects (恢复原版背景特效) --- */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a1a] to-[#020205] z-0 pointer-events-none opacity-95"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-16 bg-blue-900/10 blur-3xl z-0 pointer-events-none"></div>

            <div className="relative z-10 max-w-[1920px] h-full mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-full">

                    {/* --- LEFT SECTION: User/Action Icons --- */}
                    {/* 恢复了原本的三色区分逻辑，但使用了 lucid-react 图标，并稍微缩小尺寸适应 h-16 */}
                    <div className="flex items-center space-x-3">
                        {/* User Button: Blue/Cyan Theme */}
                        <button className={leftButtonBaseClass} style={{
                            background: 'linear-gradient(135deg, rgba(0, 100, 150, 0.4), rgba(0, 50, 100, 0.4))',
                            boxShadow: '0 0 15px rgba(0, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <User size={18} className="group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Add Button: Purple/Magenta Theme */}
                        <button className={leftButtonBaseClass} style={{
                            background: 'linear-gradient(135deg, rgba(100, 0, 150, 0.4), rgba(50, 0, 100, 0.4))',
                            boxShadow: '0 0 15px rgba(255, 0, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Plus size={18} className="group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Bell Button: Red/Pink Theme */}
                        <button className={leftButtonBaseClass} style={{
                            background: 'linear-gradient(135deg, rgba(150, 0, 100, 0.4), rgba(100, 0, 50, 0.4))',
                            boxShadow: '0 0 15px rgba(255, 0, 100, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Bell size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold text-white shadow-sm" style={{
                                background: 'linear-gradient(135deg, #ff0055, #ff3388)',
                                boxShadow: '0 0 10px rgba(255, 0, 85, 0.6)'
                            }}>3</span>
                        </button>
                    </div>

                    {/* --- CENTER SECTION: Navigation --- */}
                    {/* 居中 + 恢复原本的底部 Neon Underline 效果 */}
                    <nav className="hidden md:flex items-center space-x-12 absolute left-1/2 -translate-x-1/2 h-full">
                        {['home', 'search', 'message'].map((item) => {
                            const isActive = item === 'search';

                            return (
                                <a
                                    key={item}
                                    href="#"
                                    className="group relative flex flex-col items-center justify-center outline-none h-full px-2"
                                >
                                    <span
                                        className={`text-sm tracking-wider transition-all duration-300 ease-out
                                            ${isActive
                                                ? 'text-cyan-50 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                                                : 'text-slate-400 group-hover:text-slate-200'
                                            }
                                        `}
                                    >
                                        {t[item]}
                                    </span>

                                    {/* Neon Underline (恢复原版，调整位置适应 h-16) */}
                                    <span
                                        className={`absolute bottom-3 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] transition-all duration-300 ease-out
                                            ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}
                                        `}
                                    ></span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* --- RIGHT SECTION: Lang Selector & Register --- */}
                    <div className="flex items-center space-x-4">
                        <LanguageSelector t={t} lang={lang} setLang={setLang} />

                        {/* Register Button - 恢复原版所有的光效和渐变边框 */}
                        <div className="relative group">
                            {/* Gradient Border Container */}
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full opacity-70 blur-[2px] group-hover:opacity-100 group-hover:blur-[4px] transition duration-300"></div>

                            {/* Button Inner - 调整 padding 适应紧凑布局 (原版 py-2 -> py-1.5) */}
                            <button className="relative px-6 py-1.5 bg-[#050510] rounded-full flex items-center justify-center overflow-hidden border border-white/10 hover:bg-[#0a0a20] transition-colors duration-300">
                                {/* Inner Text Glow */}
                                <span className="text-sm bg-gradient-to-r from-cyan-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                                    {t.register}
                                </span>

                                {/* Subtle shine effect on hover (原版保留) */}
                                <div className="absolute top-0 -left-10 w-10 h-full bg-white/10 -skew-x-12 group-hover:translate-x-40 transition-transform duration-700 ease-in-out"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;