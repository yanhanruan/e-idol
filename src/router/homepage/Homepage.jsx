import { useState } from "react";

// 首页组件，管理首页特有的状态
const Homepage = ({ t, slides, users, games, featuredUsers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortBy, setSortBy] = useState('weeklyPopular');
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioElements, setAudioElements] = useState({});

  // 音频播放控制
  const toggleAudio = (userId) => {
    if (playingAudio === userId) {
      if (audioElements[userId]) {
        audioElements[userId].pause();
      }
      setPlayingAudio(null);
    } else {
      Object.keys(audioElements).forEach(id => {
        if (audioElements[id]) {
          audioElements[id].pause();
        }
      });

      if (!audioElements[userId]) {
        const audio = new Audio('https://d2zsxcb1sxm997.cloudfront.net/uploads/sale_profile/audio/13264/mp3_%E6%96%B0%E8%A6%8F%E9%8C%B2%E9%9F%B3_27.mp3');
        audio.addEventListener('ended', () => setPlayingAudio(null));
        setAudioElements(prev => ({ ...prev, [userId]: audio }));
        audio.play();
      } else {
        audioElements[userId].play();
      }
      setPlayingAudio(userId);
    }
  };

  return (
    <>
      <HeroCarousel
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        t={t}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Gamers Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">{t.selectGamer}</h3>
            </div>
            <button className="text-sm text-slate-700 hover:text-indigo-600 bg-white border-2 border-indigo-300 px-6 py-2.5 rounded-full transition font-bold shadow-md hover:shadow-lg hover:scale-105">
              {t.seeMore} →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, idx) => (
              <GamerCard
                key={idx}
                user={user}
                idx={idx}
                t={t}
                playingAudio={playingAudio}
                toggleAudio={toggleAudio}
              />
            ))}
          </div>
        </div>

        {/* Games Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
              🎮
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800">{t.gameList}</h3>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {games.map((game, idx) => (
              <GameIcon key={idx} game={game} />
            ))}
          </div>
        </div>

        {/* Featured Users */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">{t.featuredUsers}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-indigo-300 rounded-full px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <option value="weeklyPopular">{t.weeklyPopular}</option>
                <option value="newRecommend">{t.newRecommend}</option>
                <option value="mostOrders">{t.mostOrders}</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredUsers.map((user, idx) => (
              <FeaturedUserCard key={idx} user={user} t={t} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage