import React from 'react';

const PageTitle = ({ subtitle, title, comment, className = "" }) => {
  // 判断 subtitle 是否存在（不为空字符串，也不为 null/undefined）
  const showSubtitle = subtitle && subtitle !== "";

  return (
    <div className={`px-3 py-5 text-center ${className}`}>
      {/* Subtitle 区域 
         关键修改：使用 inline-flex, items-center, gap-2 
         这样传入 "图标+文字" 时会自动横向排列并垂直居中
      */}
      {showSubtitle && (
        <div className="whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 py-0.5 px-3 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-[0.2em] mb-3 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
          {subtitle}
        </div>
      )}

      {/* Title 区域 */}
      <h1 className="text-xl md:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        {title}
      </h1>

      {/* comment 区域 */}
      {comment && (
        <p className="mt-2 text-slate-400 text-xs italic max-w-2xl mx-auto">
          {comment}
        </p>
      )}
    </div>
  );
};

export default PageTitle;