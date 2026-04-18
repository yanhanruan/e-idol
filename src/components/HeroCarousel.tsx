import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { TranslationMap } from '../types';
import './HeroCarousel.css';
import stageBgImage from '../assets/character-illustration/bg-only-compress.jpg';
import characterImage from '../assets/character-illustration/character-only.webp';

interface HeroCarouselProps {
  currentSlide: number;
  setCurrentSlide: (value: number) => void;
  t: TranslationMap;
}

interface SlideItem {
  title: string;
  subtitle: string;
  items: string[];
  color: string;
}

const STAGE_BG_URL = stageBgImage;
const CHARACTER_URL = characterImage;

const HeroCarousel = ({ currentSlide, setCurrentSlide, t }: HeroCarouselProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const [isStageLoaded, setIsStageLoaded] = useState(false);
  const [isCharLoaded, setIsCharLoaded] = useState(false);

  const slides = useMemo<SlideItem[]>(
    () => [
      {
        title: String(t.safeReview ?? ''),
        subtitle: 'Secure & Transparent',
        items: [String(t.reviewDesc1 ?? ''), String(t.reviewDesc2 ?? ''), String(t.reviewDesc3 ?? '')],
        color: 'from-cyan-500/20 to-blue-600/20',
      },
      {
        title: String(t.announcement ?? ''),
        subtitle: 'Latest Updates',
        items: [String(t.announcementDesc1 ?? ''), String(t.announcementDesc2 ?? ''), String(t.announcementDesc3 ?? '')],
        color: 'from-purple-500/20 to-pink-600/20',
      },
      {
        title: String(t.reservationGuide ?? ''),
        subtitle: 'Easy Steps',
        items: [String(t.reservationStep1 ?? ''), String(t.reservationStep2 ?? ''), String(t.reservationStep3 ?? '')],
        color: 'from-yellow-500/20 to-orange-600/20',
      },
    ],
    [t],
  );

  const handleSlideChange = (newIndex: number) => {
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
  }, [currentSlide, slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="w-full stage-container min-h-[640px] md:min-h-[550px] flex items-center relative text-white overflow-hidden">
      <div className="hidden md:block absolute inset-0 z-0">
        {STAGE_BG_URL && (
          <>
            <img
              src={STAGE_BG_URL}
              alt="Stage Environment"
              className={`w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${isStageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsStageLoaded(true)}
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/90 to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f1a] to-transparent z-10"></div>
          </>
        )}
      </div>

      <div className="hidden md:block absolute bottom-12 right-0 h-full w-[55%] z-10 pointer-events-none">
        {CHARACTER_URL && (
          <div className="w-full h-full flex items-end justify-center pb-8">
            <img
              src={CHARACTER_URL}
              alt="Mascot"
              className={`max-h-[70%] w-auto object-contain transform floating-character drop-shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-1000 ease-out ${isCharLoaded ? 'opacity-100 translate-x-20 translate-y-0' : 'opacity-0 translate-x-20 translate-y-4'}`}              onLoad={() => setIsCharLoaded(true)}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        )}
      </div>

      <div className="absolute inset-0 md:hidden z-0 overflow-hidden pointer-events-none">
        {STAGE_BG_URL && <img src={STAGE_BG_URL} alt="Stage Mobile" className={`absolute inset-0 w-full h-full object-cover blur-[1px] transition-opacity duration-1000 ease-in-out ${isStageLoaded ? 'opacity-30' : 'opacity-0'}`} onLoad={() => setIsStageLoaded(true)} fetchPriority="high" decoding="async" />}
        {CHARACTER_URL && <img src={CHARACTER_URL} alt="Character Mobile" className={`absolute -right-12 top-0 h-[65%] w-auto object-contain drop-shadow-lg transform transition-all duration-1000 ease-out ${isCharLoaded ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'}`} onLoad={() => setIsCharLoaded(true)} fetchPriority="high" decoding="async" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/60 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-5 md:px-6 relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full py-10 md:py-8">
        <div key={currentSlide} className={`flex flex-col space-y-6 md:space-y-5 ${isAnimating ? 'opacity-50 blur-sm' : 'slide-enter'} transition-all duration-300`}>
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] md:text-xs font-bold tracking-widest border border-white/20 text-cyan-300 uppercase shadow-lg backdrop-blur-md">{slide.subtitle}</span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-4xl font-black neon-title leading-tight mb-2 italic">{slide.title}</h1>
            <div className={`w-20 h-1 mt-4 rounded-full bg-gradient-to-r ${slide.color.replace('/20', '')}`}></div>
          </div>

          <div className="space-y-3 md:space-y-3">
            {slide.items.map((item, idx) => (
              <div key={idx} className="glass-item p-4 md:p-3 rounded-xl flex items-center space-x-4">
                <span className="text-xl md:text-xl text-cyan-400 font-black font-mono italic">0{idx + 1}</span>
                <p className="text-gray-100 text-sm md:text-xs font-medium">{item}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-4 md:items-center">
            <button className="w-full md:w-auto idol-button px-8 py-3.5 md:px-6 md:py-2.5 rounded-full font-bold text-white tracking-wide uppercase text-sm shadow-lg flex items-center justify-center gap-2 group transition-all active:scale-95">
              {String(t.readMore ?? '')} <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <div className="flex justify-between md:justify-start items-center w-full md:w-auto gap-4 px-2 md:px-0">
              <button onClick={prevSlide} className="p-3 md:p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400 transition-all active:scale-95 backdrop-blur-md">
                <ChevronLeft className="w-5 h-5 text-cyan-300" />
              </button>

              <div className="flex md:hidden space-x-2">
                {slides.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/30'}`} />
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

      <div className="hidden md:flex absolute bottom-6 left-0 w-full justify-center space-x-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleSlideChange(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-cyan-400 shadow-[0_0_10px_#00ffff]' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
