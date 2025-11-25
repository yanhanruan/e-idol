import React from 'react';

/**
 * 赛博朋克风格流光按钮
 * @param {string} text - 按钮显示的文字 (也可以使用 children)
 * @param {function} onClick - 点击事件
 * @param {string} className - 允许外部微调位置或大小
 */
const CyberButton = ({ text, children, onClick, className = "" }) => {
  // 优先使用 text 属性，如果没有则使用 children
  const content = text || children;

  return (
    <div className={`relative group ${className}`}>
      {/* 外部流光光晕 */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full opacity-70 blur-[2px] group-hover:opacity-100 group-hover:blur-[4px] transition duration-300"></div>
      
      {/* 按钮主体 */}
      <button 
        onClick={onClick}
        className="relative px-5 py-1 bg-[#050510] rounded-full flex items-center justify-center border border-white/10 hover:bg-[#0a0a20] transition-colors duration-300 overflow-hidden w-full h-full"
      >
        {/* 文字渐变 */}
        <span className="text-sm md:text-xs font-semibold bg-gradient-to-r from-cyan-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
          {content}
        </span>
        
        {/* 内部扫光动画 */}
        <div className="absolute top-0 -left-10 w-10 h-full bg-white/10 -skew-x-12 group-hover:translate-x-40 transition-transform duration-700 ease-in-out"></div>
      </button>
    </div>
  );
};

export default CyberButton;