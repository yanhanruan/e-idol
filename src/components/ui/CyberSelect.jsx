import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from "lucide-react";

// 样式常量
const glassStyle = "bg-[#050510]/80 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]";
const transitionStyle = "transition-all duration-300 ease-in-out";

/**
 * 通用赛博风格下拉选择器
 * @param {string} value - 当前选中的值
 * @param {string} label - 当前选中的显示文本 (用于显示在框内)
 * @param {Array} options - 选项数组 [{ value, label }]
 * @param {function} onChange - 选择回调 (value) => void
 * @param {ReactNode} icon - 左侧图标 (可选)
 */
const CyberSelect = ({ value, label, options, onChange, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // 点击外部自动关闭
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        if (val === value) { setIsOpen(false); return; }
        setIsOpen(false);
        onChange(val);
    };

    return (
        <div className="relative z-50" ref={containerRef}>
            {/* 触发器按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    relative flex items-center justify-center font-sans font-medium cursor-pointer group 
                    w-9 h-9 rounded-full md:w-36 md:h-auto md:py-1.5 md:px-4 md:justify-between
                    text-slate-300 hover:bg-[#0a0a20] hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:text-cyan-50
                    ${glassStyle} ${transitionStyle}
                `}
            >
                {/* 移动端只显示图标，桌面端显示图标+文字。这里保留你原本的响应式逻辑 */}
                <span className="md:hidden">
                    {/* 如果没有传 icon，默认显示第一个字母或其他占位 */}
                    {icon ? React.cloneElement(icon, { className: "w-4 h-4 group-hover:text-cyan-200/70" }) : label?.slice(0,2)}
                </span>
                
                <span className="hidden md:block truncate tracking-wide text-sm md:text-xs">{label}</span>
                
                <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 下拉菜单面板 */}
            <div className={`
                absolute top-full right-0 mt-2 w-36 rounded-xl overflow-hidden
                border border-white/10 bg-[#0a0a1ad1] shadow-[0_0_30px_rgba(0,0,0,0.8)] origin-top-right
                ${transitionStyle}
                ${isOpen ? 'max-h-[200px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}
            `}>
                {options.map((opt, i) => (
                    <React.Fragment key={opt.value}>
                        {i > 0 && <div className="mx-2 h-[1px] bg-white/5" />}
                        <button
                            onClick={() => handleSelect(opt.value)}
                            className={`w-full text-left px-4 py-3 text-sm md:text-xs font-medium font-sans tracking-wide transition-colors duration-200 
                                ${value === opt.value ? 'text-cyan-400 bg-cyan-900/20' : 'text-slate-400 hover:text-cyan-50 hover:bg-white/5'}`}
                        >
                            {opt.label}
                        </button>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CyberSelect;