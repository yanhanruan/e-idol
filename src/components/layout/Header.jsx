// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Globe, User, Plus, Menu, X } from "lucide-react";
import { useLocation } from "wouter"; // [新增]: 引入路由组件
import { useTranslations } from '../../contexts/LanguageContext';
import { useTransition } from '../../contexts/TransitionContext'; // 修正引用路径，根据实际情况调整

import CyberButton from '../ui/CyberButton';
import CyberSelect from '../ui/CyberSelect';

// --- 常量定义 ---
const glassStyle = "bg-[#050510]/80 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]";
const transitionStyle = "transition-all duration-300 ease-in-out";

// [新增]: 定义导航项对应的 URL 路径配置
// 键名对应 translations.js 中的 key，值为路由路径
const navConfig = {
    home: '/',
    process: '/process',
    pricing: '/pricing',
    castList: '/castList',
    recruitment: '/recruitment'
};

const navItems = Object.keys(navConfig); // ['home', 'process'...]

const LanguageSelector = () => {
    const { lang, setLang } = useTranslations();
    const { startTransition } = useTransition();
    const languages = [
        { value: 'ja', label: '日本語' },
        { value: 'en', label: 'English' },
        { value: 'zh', label: '简体中文' }
    ];
    const currentLabel = languages.find(l => l.value === lang)?.label;

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
    const { lang, setLang, t } = useTranslations();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [location, setLocation] = useLocation();
    const { startTransition } = useTransition();

    const menuRef = useRef(null);
    const btnRef = useRef(null);

    // 点击外部关闭手机菜单
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMobileMenuOpen &&
                menuRef.current && !menuRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    const leftBtnClass = `w-8 h-8 rounded-lg flex items-center justify-center text-white hover:scale-110 group border border-white/5 relative ${transitionStyle}`;

    // [新增]: 统一的导航处理函数
    const handleNavigation = (path) => {
        // 如果点击的是当前页，不进行任何操作
        if (location === path) return;

        // 关闭手机菜单（如果打开的话）
        setIsMobileMenuOpen(false);

        // 启动过渡动画，并在回调中切换路由
        startTransition(() => {
            setLocation(path);
        });
    };

    return (
        <header className="sticky top-0 z-50 w-full h-14 md:h-12 py-2 md:py-0 bg-[#0a0a1aa4] backdrop-blur-md border-b border-white/5 font-sans">
            <div className="relative z-10 max-w-7xl h-full mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-full">

                    {/* --- Left Icons --- */}
                    <div className="flex items-center space-x-2">
                        <button className={leftBtnClass} style={{ background: 'linear-gradient(135deg, rgba(0, 100, 150, 0.4), rgba(0, 50, 100, 0.4))', boxShadow: '0 0 15px rgba(0, 255, 255, 0.15)' }}>
                            <User size={16} />
                        </button>
                        <button className={leftBtnClass} style={{ background: 'linear-gradient(135deg, rgba(100, 0, 150, 0.4), rgba(50, 0, 100, 0.4))', boxShadow: '0 0 15px rgba(255, 0, 255, 0.15)' }}>
                            <Plus size={16} />
                        </button>
                        <button className={leftBtnClass} style={{ background: 'linear-gradient(135deg, rgba(150, 0, 100, 0.4), rgba(100, 0, 50, 0.4))', boxShadow: '0 0 15px rgba(255, 0, 100, 0.15)' }}>
                            <Bell size={16} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-[8px] flex items-center justify-center text-white bg-gradient-to-br from-[#ff0055] to-[#ff3388] shadow-[0_0_10px_rgba(255,0,85,0.6)]">3</span>
                        </button>
                    </div>

                    {/* --- Center Section: Desktop Nav --- */}
                    <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2 h-full">
                        {navItems.map((item) => {
                            const path = navConfig[item];
                            const isActive = location === path;

                            return (
                                <button
                                    key={item}
                                    href={path}
                                    onClick={() => handleNavigation(path)}
                                    // [关键修复]: 直接将样式赋给 Link 组件，Link 会渲染为带有这些样式的 <a> 标签
                                    className="group relative flex flex-col items-center justify-center h-full px-1 outline-none cursor-pointer"
                                >
                                    {/* 内部不需要再包一个 <a> 了 */}

                                    {/* 文字部分 */}
                                    <span className={`text-xs font-medium tracking-widest whitespace-nowrap ${transitionStyle} ${isActive ? 'text-cyan-50 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        {t[item]}
                                    </span>

                                    {/* 下划线指示条 */}
                                    {/* 因为 Link 现在拥有 h-full，所以 absolute bottom-2 会正确地定位在 Header 底部 */}
                                    <span className={`absolute bottom-2 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_#22d3ee] ${transitionStyle} ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`}></span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* --- Right Section --- */}
                    <div className="flex items-center space-x-3">
                        <LanguageSelector t={t} lang={lang} setLang={setLang} />

                        {/* Mobile Toggle */}
                        <button
                            ref={btnRef}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`md:hidden flex items-center justify-center w-8 h-8 rounded-full text-slate-300 hover:text-cyan-400 ml-1 ${glassStyle} ${transitionStyle}`}
                        >
                            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>

                        <div className="scale-90 origin-right">
                            <CyberButton
                                text={t.register}
                                onClick={() => console.log('register')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu [核心修改] --- */}
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
                            // 手机端点击后自动关闭菜单
                            <div key={item} href={path}>
                                <a
                                    onClick={() => handleNavigation(path)}
                                    className={`
                                        relative px-4 py-3 rounded-lg text-sm font-medium tracking-wide flex items-center justify-between cursor-pointer ${transitionStyle}
                                        ${isActive ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-cyan-50 hover:bg-white/5 border border-transparent'}
                                    `}
                                >
                                    {t[item]}
                                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>}
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}

export default Header;