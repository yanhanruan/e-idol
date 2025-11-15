import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HeroCarousel.css"; // 导入我们刚刚创建的样式表

const HeroCarousel = ({ currentSlide, setCurrentSlide, t }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'];
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
    <div className="w-full sm:flex sm:justify-center ">
    <div className="relative overflow-hidden w-full sm:w-2/3">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="rounded-xl sm:rounded-2xl overflow-hidden relative cyber-card-container">
          
          {/* Scanline effect */}
          <div className="scanline"></div>

          {/* Animated background effects */}
          {/* 注意: animationDelay 是动态的，所以保留 style prop 是合理的 
          */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-2 sm:top-5 left-2 sm:left-5 text-3xl sm:text-4xl float-animation cyber-float-icon cyan">⚡</div>
            <div className="absolute top-5 sm:top-10 right-5 sm:right-10 text-3xl sm:text-4xl float-animation cyber-float-icon magenta" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute bottom-5 sm:bottom-10 left-1/4 text-3xl sm:text-4xl float-animation cyber-float-icon cyan" style={{ animationDelay: '1s' }}>⭐</div>
            <div className="absolute bottom-2 sm:bottom-5 right-1/4 text-3xl sm:text-4xl float-animation cyber-float-icon magenta" style={{ animationDelay: '1.5s' }}>💫</div>
            <div className="absolute top-1/2 left-5 sm:left-10 text-2xl sm:text-3xl float-animation cyber-float-icon cyan" style={{ animationDelay: '0.3s' }}>◆</div>
            <div className="absolute top-1/3 right-10 sm:right-20 text-2xl sm:text-3xl float-animation cyber-float-icon magenta" style={{ animationDelay: '0.8s' }}>●</div>
          </div>

          {/* Content container */}
          <div className="relative py-6">
            {/* Main content area */}
            <div className="px-3 sm:px-4 mb-6 sm:mb-8">
              <div className={`flex-col flex justify-center max-w-full sm:max-w-lg mx-auto rounded-xl sm:rounded-2xl p-4 sm:px-8 carousel-content cyber-content-box ${isTransitioning ? 'transitioning' : ''}`}>
                
                {/* Title section */}
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl animate-pulse">{slides[currentSlide].icon}</span>
                  <h2 className="font-black cyber-title">
                    {slides[currentSlide].title}
                  </h2>
                </div>

                {/* Items list */}
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {slides[currentSlide].items.map((item, idx) => (
                    <li key={idx} className="flex items-start p-3 rounded-xl sm:rounded-2xl item-hover cyber-list-item">
                      <span className="flex-shrink-0 text-lg sm:text-xl font-bold w-8 sm:w-10 text-center cyber-item-number">
                        {romanNumerals[idx]}
                      </span>
                      <span className="flex-1 text-sm sm:text-base font-medium break-words cyber-item-text">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Read more button */}
                <button className="self-center w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold transition-all duration-300 hover:scale-110 button-hover-effect group relative overflow-hidden cyber-button-primary">
                  <span className="relative z-10 inline-flex items-center">
                    {t.readMore}
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Navigation and indicators */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {/* Left button */}
              <button
                onClick={() => handleSlideChange(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
                className="p-2 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-125 button-hover-effect cyber-button-nav"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 cyber-nav-icon" />
              </button>

              {/* Slide indicators */}
              <div className="flex justify-center space-x-2 sm:space-x-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSlideChange(idx)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-500 hover:scale-110 cyber-indicator-dot ${idx === currentSlide ? 'active' : ''}`}
                  />
                ))}
              </div>

              {/* Right button */}
              <button
                onClick={() => handleSlideChange((currentSlide + 1) % slides.length)}
                className="p-2 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-125 button-hover-effect cyber-button-nav"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 cyber-nav-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HeroCarousel;