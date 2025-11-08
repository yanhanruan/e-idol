import React from 'react';

/**
 * 具有背景辉光和光扫特效的产品卡片。
 * (已使用您提供的 div 方式重构光扫效果)
 */
const ProductCard = ({
  title = "Cyber-Sneakers",
  description = "Futuristic design and neon sole for conquering the urban jungle.",
  price = "199.99 $",
  imageUrl,
  isFeatured = false
}) => {
  
  return (
    <div
      data-featured={isFeatured}
      
      // LAYER 0: 卡片容器 (Hover 目标)
      // 'group' 是所有 hover 效果的关键
      className={`
        group relative w-80 h-[480px] transition-transform duration-300 ease-out
        
        // 动画: 卡片浮起
        hover:-translate-y-1.5
        data-[featured=true]:animate-autoLift
        data-[featured=true]:hover:animate-none

        // LAYER 1: 背景光 (::before)
        before:content-[''] before:absolute before:inset-0 before:z-10
        before:rounded-xl before:blur-[40px]
        before:bg-gradient-to-l before:from-[#7e0fff] before:to-[#0fffc1]
        before:bg-[200%_200%] before:opacity-0
        before:transition-[opacity,transform] before:duration-400 before:ease-in-out

        // 动画: 背景光
        hover:before:opacity-80 hover:before:scale-115 hover:before:animate-animateGlow
        data-[featured=true]:before:animate-autoGlow
        data-[featured=true]:before:animate-animateGlow
        data-[featured=true]:hover:before:animate-animateGlow
      `}
    >
      {/* LAYER 2: 卡片内容 (可见层) */}
      <div
        className={`
          relative z-20 flex h-full flex-col
          rounded-xl border border-slate-700 bg-slate-800 p-6
          overflow-hidden // 关键: 裁剪内部的光扫 div
        `}
      >
        {/* 卡片内容 (图片, 文字等) */}
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="mb-4 h-48 w-full rounded-lg object-cover" />
        ) : (
          <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-slate-700">
            <span className="text-slate-500">Image</span>
          </div>
        )}

        <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
        <p className="mb-4 flex-grow text-sm text-slate-400">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-semibold text-cyan-400">{price}</span>
          <button className="rounded-lg bg-indigo-600 py-2 px-5 font-medium text-white transition-colors duration-200 hover:bg-indigo-500">
            Buy
          </button>
        </div>

        {/* LAYER 3: 光扫特效 (使用您提供的方法)
          这个 div 位于内容层内部, 响应最外层父级的 group-hover
        */}
        <div
          className={`
            absolute top-0 left-[-150%] w-[60%] h-full
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            skew-x-[-30deg] blur-sm
            transition-transform duration-700
            
            // 注意: 'ease-shine' 是在 tailwind.config.js 中定义的
            // 它对应您写的 'ease-[cubic-bezier(0.23,1,0.32,1)]'
            ease-shine 
            
            // Hover 状态
            group-hover:translate-x-[250%]
            
            // Featured 自动动画
            data-[featured=true]:animate-autoShine
            data-[featured=true]:hover:animate-none
            data-[featured=true]:hover:translate-x-[250%]
          `}
        ></div>
      </div>
    </div>
  );
};

export default ProductCard;