import { useState } from "react";
import { ChevronLeft,ChevronRight  } from "lucide-react";
const HeroCarousel = ({ currentSlide, setCurrentSlide, t }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slides = [
    {
      title: t.safeReview,
      icon: '🛡️',
      items: [t.reviewDesc1, t.reviewDesc2, t.reviewDesc3]
    },
    {
      title: t.announcement,
      icon: '📢',
      items: [t.announcementDesc1, t.announcementDesc2, t.announcementDesc3]
    },
    {
      title: t.reservationGuide,
      icon: '📅',
      items: [t.reservationStep1, t.reservationStep2, t.reservationStep3]
    }
  ];

  const handleSlideChange = (newSlide) => {
    if (newSlide === currentSlide || isTransitioning) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentSlide(newSlide);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden w-full">
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@300;400;700&display=swap" rel="stylesheet" />
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-100px) scale(0.95);
          }
        }

        /* 优化：修改 scanline 使用 transform (GPU 加速) 而不是 top (CPU 布局) */
        @keyframes scanline {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(200vh);
          }
        }

        /* 删除了性能极差的 @keyframes pulse-glow */

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .carousel-content {
          animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .carousel-content.transitioning {
          animation: slideOut 0.3s ease-out;
        }

        .scanline {
          position: absolute;
          top: 0; /* 优化：从 0 开始 */
          left: 0;
          width: 100%;
          height: 20px;
          background: linear-gradient(transparent, rgba(0, 255, 255, 0.3), transparent);
          animation: scanline 8s linear infinite;
          pointer-events: none;
          will-change: transform; /* 优化：提示浏览器 */
        }

        /* 删除了 .pulse-glow */

        .float-animation {
          animation: float 3s ease-in-out infinite;
          will-change: transform; /* 优化：提示浏览器 */
        }

        .button-hover-effect {
          position: relative;
          overflow: hidden;
        }

        .button-hover-effect::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(0, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .button-hover-effect:hover::before {
          width: 300px;
          height: 300px;
        }

        .item-hover {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .item-hover:hover {
          transform: translateX(10px) scale(1.02);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* 优化：移除了 pulse-glow 动画类，将静态光晕效果直接添加到 style 中 */}
        <div className={`rounded-xl sm:rounded-2xl overflow-hidden relative`} style={{
          background: 'linear-gradient(135deg, rgba(10, 20, 40, 0.8), rgba(20, 10, 40, 0.8))',
          border: '2px solid rgba(0, 255, 255, 0.3)',
          backdropFilter: 'blur(20px)',
          // 优化：添加了静态阴影以替代动画
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.3), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 0 100px rgba(0, 0, 0, 0.5)'
        }}>
          {/* Scanline effect */}
          <div className="scanline"></div>

          {/* Animated background effects */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {/* 优化：移除了 animate-pulse 类 */}
            <div className="absolute top-2 sm:top-5 left-2 sm:left-5 text-3xl sm:text-4xl md:text-6xl float-animation" style={{ color: '#00ffff', textShadow: '0 0 20px #00ffff' }}>⚡</div>
            <div className="absolute top-5 sm:top-10 right-5 sm:right-10 text-3xl sm:text-4xl md:text-6xl float-animation" style={{ color: '#ff00ff', textShadow: '0 0 20px #ff00ff', animationDelay: '0.5s' }}>✨</div>
            <div className="absolute bottom-5 sm:bottom-10 left-1/4 text-3xl sm:text-4xl md:text-6xl float-animation" style={{ color: '#00ffff', textShadow: '0 0 20px #00ffff', animationDelay: '1s' }}>⭐</div>
            <div className="absolute bottom-2 sm:bottom-5 right-1/4 text-3xl sm:text-4xl md:text-6xl float-animation" style={{ color: '#ff00ff', textShadow: '0 0 20px #ff00ff', animationDelay: '1.5s' }}>💫</div>
            <div className="absolute top-1/2 left-5 sm:left-10 text-2xl sm:text-3xl md:text-5xl float-animation" style={{ color: '#00ffff', textShadow: '0 0 20px #00ffff', animationDelay: '0.3s' }}>◆</div>
            <div className="absolute top-1/3 right-10 sm:right-20 text-2xl sm:text-3xl md:text-5xl float-animation" style={{ color: '#ff00ff', textShadow: '0 0 20px #ff00ff', animationDelay: '0.8s' }}>●</div>
          </div>

          {/* Content container */}
          <div className="relative z-10 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16">
            {/* Main content area */}
            <div className="px-3 sm:px-4 md:px-8 lg:px-12 xl:px-16 mb-6 sm:mb-8">
              <div className={`max-w-full md:max-w-2xl lg:max-w-3xl mx-auto rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 carousel-content ${isTransitioning ? 'transitioning' : ''}`} style={{
                background: 'rgba(0, 20, 40, 0.6)',
                border: '2px solid rgba(0, 255, 255, 0.3)',
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(15px)'
              }}>
                {/* Title section */}
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  {/* 优化：为图标也加上 animate-pulse，因为它开销不大且能保持动态感 */}
                  <span className="text-3xl sm:text-4xl md:text-5xl animate-pulse">{slides[currentSlide].icon}</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black" style={{
                    fontFamily: "'Orbitron', sans-serif",
                    background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))'
                  }}>
                    {slides[currentSlide].title}
                  </h2>
                </div>

                {/* Items list with proper alignment */}
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {slides[currentSlide].items.map((item, idx) => (
                    <li key={idx} className="flex items-start p-3 sm:p-4 rounded-xl sm:rounded-2xl item-hover" style={{
                      background: 'rgba(0, 50, 100, 0.4)',
                      border: '1px solid rgba(0, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)'
                    }}>
                      <span className="flex-shrink-0 text-lg sm:text-xl md:text-2xl font-bold w-8 sm:w-10 text-center" style={{
                        fontFamily: "'Roboto Mono', monospace",
                        color: '#ff0096',
                        textShadow: '0 0 10px rgba(255, 0, 150, 0.8)',
                        lineHeight: '1.5'
                      }}>
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl font-medium break-words" style={{
                        fontFamily: "'Roboto Mono', monospace",
                        color: '#00ffff',
                        textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
                        lineHeight: '1.5'
                      }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Read more button */}
                <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold transition-all duration-300 hover:scale-110 button-hover-effect group relative overflow-hidden" style={{
                  fontFamily: "'Roboto Mono', monospace",
                  background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
                  color: '#fff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.3)',
                  textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                }}>
                  <span className="relative z-10 inline-flex items-center">
                    {t.readMore}
                    <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Navigation and indicators in one row */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4">
              {/* Left button */}
              <button
                onClick={() => handleSlideChange(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
                className="p-2 sm:p-2.5 lg:p-3 rounded-xl transition-all duration-300 hover:scale-125 button-hover-effect"
                style={{
                  background: 'rgba(0, 50, 100, 0.3)',
                  border: '1px solid rgba(0, 255, 255, 0.4)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" style={{ 
                  color: '#00ffff',
                  filter: 'drop-shadow(0 0 5px #00ffff)'
                }} />
              </button>

              {/* Slide indicators */}
              <div className="flex justify-center space-x-2 sm:space-x-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSlideChange(idx)}
                    className="h-2 sm:h-3 rounded-full transition-all duration-500 hover:scale-110"
                    style={{
                      width: idx === currentSlide ? '2.5rem' : '0.75rem',
                      background: idx === currentSlide 
                        ? 'linear-gradient(90deg, #00ffff, #ff00ff)' 
                        : 'rgba(0, 255, 255, 0.3)',
                      boxShadow: idx === currentSlide 
                        ? '0 0 15px rgba(0, 255, 255, 0.8)' 
                        : 'none'
                    }}
                  />
                ))}
              </div>

              {/* Right button */}
              <button
                onClick={() => handleSlideChange((currentSlide + 1) % slides.length)}
                className="p-2 sm:p-2.5 lg:p-3 rounded-xl transition-all duration-300 hover:scale-125 button-hover-effect"
                style={{
                  background: 'rgba(0, 50, 100, 0.3)',
                  border: '1px solid rgba(0, 255, 255, 0.4)',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" style={{ 
                  color: '#00ffff',
                  filter: 'drop-shadow(0 0 5px #00ffff)'
                }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;