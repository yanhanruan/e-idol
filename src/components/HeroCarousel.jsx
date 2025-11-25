// HeroCarousel.jsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import "./HeroCarousel.css";

// 保持引用不变
import stageBgImage from "../assets/character-illustration/bg-only.png";
import characterImage from "../assets/character-illustration/character-only.png";

const STAGE_BG_URL = stageBgImage;
const CHARACTER_URL = characterImage;

const HeroCarousel = ({ currentSlide, setCurrentSlide, t }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
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
    // [修改]: min-h-[640px] 改为 md:min-h-[550px]，降低高度
    <div className="w-full stage-container min-h-[640px] md:min-h-[550px] flex items-center relative text-white overflow-hidden">
      
      {/* 1. [电脑端] 全局舞台背景层 */}
      <div className="hidden md:block absolute inset-0 z-0">
        {STAGE_BG_URL && (
          <>
            <img src={STAGE_BG_URL} alt="Stage Environment" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/90 to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f1a] to-transparent z-10"></div>
          </>
        )}
      </div>

      {/* 2. [电脑端] 人物层 */}
      <div className="hidden md:block absolute bottom-12 right-0 h-full w-[55%] z-10 pointer-events-none">
         {CHARACTER_URL && (
           <div className="w-full h-full flex items-end justify-center pb-8">
             <img 
               src={CHARACTER_URL} 
               alt="Mascot" 
               // [修改]: max-h-[85%] -> max-h-[70%] (人物变小)
               // [修改]: translate-x-10 -> translate-x-20 (往右挪，给文字腾地方)
               className="max-h-[70%] w-auto object-contain transform translate-x-20 floating-character drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]"
             />
           </div>
         )}
      </div>

      {/* 3. 手机端代码 (完全保持原样，不动) */}
      <div className="absolute inset-0 md:hidden z-0 overflow-hidden pointer-events-none">
        {STAGE_BG_URL && (
           <img src={STAGE_BG_URL} alt="Stage Mobile" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[1px]" />
        )}
        {CHARACTER_URL && (
           <img src={CHARACTER_URL} alt="Character Mobile" className="absolute -right-12 top-0 h-[65%] w-auto object-contain opacity-60 drop-shadow-lg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/60 to-transparent"></div>
      </div>

      {/* 4. 内容层 */}
      {/* [修改]: max-w-7xl -> max-w-5xl (核心！大幅收窄内容宽度) */}
      {/* [修改]: px-5 md:px-8 -> px-5 md:px-6 (减少左右内边距) */}
      {/* [修改]: py-10 -> md:py-8 */}
      <div className="max-w-4xl mx-auto w-full px-5 md:px-6 relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full py-10 md:py-8">
        
        {/* 左侧：文字信息 */}
        <div key={currentSlide} className={`flex flex-col space-y-6 md:space-y-5 ${isAnimating ? 'opacity-50 blur-sm' : 'slide-enter'} transition-all duration-300`}>
          {/* 标题 */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] md:text-xs font-bold tracking-widest border border-white/20 text-cyan-300 uppercase shadow-lg backdrop-blur-md">
                {slide.subtitle}
              </span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
            
            {/* [修改]: md:text-6xl -> md:text-5xl (甚至可以用 4xl，如果还觉得大) */}
            <h1 className="text-4xl md:text-4xl font-black neon-title leading-tight mb-2 italic">
              {slide.title}
            </h1>
            
            <div className={`w-20 h-1 mt-4 rounded-full bg-gradient-to-r ${slide.color.replace('/20', '')}`}></div>
          </div>

          {/* 列表 */}
          {/* [修改]: md:space-y-4 -> md:space-y-3 (让列表紧凑) */}
          <div className="space-y-3 md:space-y-3">
            {slide.items.map((item, idx) => (
              // [修改]: p-4 -> p-3 (卡片变薄)
              <div key={idx} className="glass-item p-4 md:p-3 rounded-xl flex items-center space-x-4">
                {/* [修改]: md:text-2xl -> md:text-xl (序号变小) */}
                <span className="text-xl md:text-xl text-cyan-400 font-black font-mono italic">
                  0{idx + 1}
                </span>
                {/* [修改]: md:text-base -> md:text-sm (文字变小) */}
                <p className="text-gray-100 text-sm md:text-xs font-medium">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* 按钮 */}
          <div className="pt-4 flex flex-col md:flex-row gap-4 md:items-center">
            {/* [修改]: px-8 py-3.5 -> md:px-6 md:py-2.5 (按钮瘦身) */}
            <button className="w-full md:w-auto idol-button px-8 py-3.5 md:px-6 md:py-2.5 rounded-full font-bold text-white tracking-wide uppercase text-sm shadow-lg flex items-center justify-center gap-2 group transition-all active:scale-95">
              {t.readMore} <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <div className="flex justify-between md:justify-start items-center w-full md:w-auto gap-4 px-2 md:px-0">
               {/* 箭头按钮稍微改小一点点 */}
               <button onClick={prevSlide} className="p-3 md:p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400 transition-all active:scale-95 backdrop-blur-md">
                 <ChevronLeft className="w-5 h-5 text-cyan-300" />
               </button>
               
               <div className="flex md:hidden space-x-2">
                  {slides.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? "w-6 bg-cyan-400" : "w-1.5 bg-white/30"}`} />
                  ))}
               </div>

               <button onClick={nextSlide} className="p-3 md:p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400 transition-all active:scale-95 backdrop-blur-md">
                 <ChevronRight className="w-5 h-5 text-cyan-300" />
               </button>
            </div>
          </div>
        </div>

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