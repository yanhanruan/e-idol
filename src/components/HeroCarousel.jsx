// HeroCarousel.js
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import "./HeroCarousel.css";

// --- 关键修改：替换为分离后的素材路径 ---
// 1. 舞台背景图片 (建议为 JPG 或 PNG，包含灯光效果，无人物)
const STAGE_BG_URL = "/src/assets/character-illustration/bg-only.png";
// 2. 人物角色图片 (必须为透明背景的 PNG)
const CHARACTER_URL = "/src/assets/character-illustration/character-only.png";


const HeroCarousel = ({ currentSlide, setCurrentSlide, t }) => {
  // ... (中间的状态管理、自动轮播逻辑等代码保持不变，省略以节省篇幅) ...
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    // ... 你的 slides 数据 ...
    {
      title: t.safeReview,
      subtitle: "Secure & Transparent",
      items: [t.reviewDesc1, t.reviewDesc2, t.reviewDesc3],
      color: "from-cyan-500/20 to-blue-600/20"
    },
    {
      title: t.announcement,
      subtitle: "Latest Updates",
      items: [t.announcementDesc1, t.announcementDesc2, t.announcementDesc3],
      color: "from-purple-500/20 to-pink-600/20"
    },
    {
      title: t.reservationGuide,
      subtitle: "Easy Steps",
      items: [t.reservationStep1, t.reservationStep2, t.reservationStep3],
      color: "from-yellow-500/20 to-orange-600/20"
    }
  ];

  const handleSlideChange = (newIndex) => {
    if (newIndex === currentSlide || isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSlide = () => handleSlideChange((currentSlide + 1) % slides.length);
  const prevSlide = () => handleSlideChange((currentSlide - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="w-full stage-container min-h-[640px] flex items-center relative text-white overflow-hidden">
      
      {/* ===================================================================================== */}
      {/* 1. [电脑端重构核心] 全局舞台背景层 (Desktop Global Stage)                               */}
      {/* ===================================================================================== */}
      <div className="hidden md:block absolute inset-0 z-0">
        {STAGE_BG_URL && (
          <>
            {/* A. 舞台原图：铺满全屏，无死角，无留白 */}
            <img 
              src={STAGE_BG_URL} 
              alt="Stage Environment" 
              className="w-full h-full object-cover object-center" 
            />
            
            {/* B. 电影级遮罩：左侧深色(保护文字)，右侧透明(展示舞台) */}
            {/* 这里的 from-[#0f0f1a] 必须和你网页背景色一致，实现无缝融合 */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/90 to-transparent z-10"></div>
            
            {/* C. 额外加一层底部的深色渐变，防止人物脚部切断感 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f1a] to-transparent z-10"></div>
          </>
        )}
      </div>

      {/* ===================================================================================== */}
      {/* 2. [电脑端] 人物层 (独立于 Grid 之外，自由定位)                                          */}
      {/* ===================================================================================== */}
      <div className="hidden md:block absolute bottom-0 right-0 h-full w-[55%] z-10 pointer-events-none">
         {CHARACTER_URL && (
           <div className="w-full h-full flex items-end justify-center pb-8">
             <img 
               src={CHARACTER_URL} 
               alt="Mascot" 
               // 稍微放大并在右侧展示
               className="max-h-[85%] w-auto object-contain transform translate-x-10 floating-character drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
             />
           </div>
         )}
      </div>


      {/* ===================================================================================== */}
      {/* 3. 手机端代码 (完全保留，未触碰)                                                        */}
      {/* ===================================================================================== */}
      <div className="absolute inset-0 md:hidden z-0 overflow-hidden pointer-events-none">
        {STAGE_BG_URL && (
           <img 
             src={STAGE_BG_URL} 
             alt="Stage Mobile" 
             className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[1px]" 
           />
        )}
        {CHARACTER_URL && (
           <img 
             src={CHARACTER_URL} 
             alt="Character Mobile"
             className="absolute -right-12 bottom-0 h-[65%] w-auto object-contain opacity-60 drop-shadow-lg" 
           />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/60 to-transparent"></div>
      </div>


      {/* ===================================================================================== */}
      {/* 4. 内容层 (Content Layer) - 纯文字交互区                                               */}
      {/* ===================================================================================== */}
      {/* z-20 确保文字浮在背景和人物之上 */}
      <div className="max-w-7xl mx-auto w-full px-5 md:px-8 relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full py-10">
        
        {/* 左侧：文字信息 */}
        <div key={currentSlide} className={`flex flex-col space-y-6 ${isAnimating ? 'opacity-50 blur-sm' : 'slide-enter'} transition-all duration-300`}>
          {/* 标题 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] md:text-xs font-bold tracking-widest border border-white/20 text-cyan-300 uppercase shadow-lg backdrop-blur-md">
                {slide.subtitle}
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black neon-title leading-tight mb-2 italic">
              {slide.title}
            </h1>
            
            <div className={`w-20 h-1 mt-4 rounded-full bg-gradient-to-r ${slide.color.replace('/20', '')}`}></div>
          </div>

          {/* 列表 */}
          <div className="space-y-3 md:space-y-4">
            {slide.items.map((item, idx) => (
              <div key={idx} className="glass-item p-4 rounded-xl flex items-center space-x-4">
                <span className="text-xl md:text-2xl text-cyan-400 font-black font-mono italic">
                  0{idx + 1}
                </span>
                <p className="text-gray-100 text-sm md:text-base font-medium">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* 按钮 */}
          <div className="pt-4 flex flex-col md:flex-row gap-4 md:items-center">
            <button className="w-full md:w-auto idol-button px-8 py-3.5 rounded-full font-bold text-white tracking-wide uppercase text-sm shadow-lg flex items-center justify-center gap-2 group transition-all active:scale-95">
              {t.readMore} <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <div className="flex justify-between md:justify-start items-center w-full md:w-auto gap-4 px-2 md:px-0">
               <button onClick={prevSlide} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400 transition-all active:scale-95 backdrop-blur-md">
                 <ChevronLeft className="w-5 h-5 text-cyan-300" />
               </button>
               
               <div className="flex md:hidden space-x-2">
                  {slides.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? "w-6 bg-cyan-400" : "w-1.5 bg-white/30"}`} />
                  ))}
               </div>

               <button onClick={nextSlide} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400 transition-all active:scale-95 backdrop-blur-md">
                 <ChevronRight className="w-5 h-5 text-cyan-300" />
               </button>
            </div>
          </div>
        </div>

        {/* 右侧：这里留空即可，因为人物已经通过 absolute 定位在后面了，这样可以避免 flex 布局导致的裁切问题 */}
        <div className="hidden md:block"></div>
      </div>

      {/* 底部指示点 */}
      <div className="hidden md:flex absolute bottom-6 left-0 w-full justify-center space-x-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleSlideChange(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? "w-8 bg-cyan-400 shadow-[0_0_10px_#00ffff]" : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
export default HeroCarousel;