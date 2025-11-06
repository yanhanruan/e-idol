// 轮播图组件
const HeroCarousel = ({ slides, currentSlide, setCurrentSlide, t }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 rounded-3xl shadow-2xl overflow-hidden relative border-4 border-white/50">
          {/* 装饰性背景图案 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-5 text-6xl">🦋</div>
            <div className="absolute top-10 right-10 text-6xl">✨</div>
            <div className="absolute bottom-10 left-1/4 text-6xl">⭐</div>
            <div className="absolute bottom-5 right-1/4 text-6xl">💫</div>
            <div className="absolute top-1/2 left-10 text-5xl">🌸</div>
            <div className="absolute top-1/3 right-20 text-5xl">🎀</div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              className="p-3 hover:bg-white/30 rounded-full transition ml-4 backdrop-blur-sm"
            >
              <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
            </button>

            <div className="flex-1 mx-4 md:mx-12 py-12 md:py-16">
              <div className="max-w-2xl backdrop-blur-sm bg-white/10 p-8 rounded-3xl border-2 border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-5xl">{slides[currentSlide].icon}</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{slides[currentSlide].title}</h2>
                </div>
                <ul className="space-y-4 mb-8">
                  {slides[currentSlide].items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                      <span className="text-yellow-300 mt-1 text-2xl font-bold">{idx + 1}</span>
                      <span className="text-lg md:text-xl text-white font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="px-8 py-3 bg-white hover:bg-white/90 text-indigo-700 rounded-full font-bold shadow-xl hover:scale-105 transition">
                  {t.readMore} →
                </button>
              </div>
            </div>

            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              className="p-3 hover:bg-white/30 rounded-full transition mr-4 backdrop-blur-sm"
            >
              <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
            </button>
          </div>

          <div className="flex justify-center pb-6 space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-3 rounded-full transition shadow-md ${idx === currentSlide ? 'bg-white w-10' : 'bg-white/60 w-3'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;