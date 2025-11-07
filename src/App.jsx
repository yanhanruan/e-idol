import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Menu, Heart, Sparkles, MessageCircle, Bell, Filter, Play, Pause } from 'lucide-react';

// ==================== 常量和数据 ====================
const TRANSLATIONS = {
  ja: {
    message: 'メッセージ',
    search: '検索',
    home: 'ホーム',
    login: 'ログイン',
    register: '新規登録',
    safeReview: '安心の相互評価制度',
    reviewDesc1: '募集プレイヤーの評価を可視化',
    reviewDesc2: '各ユーザーにこれまでに評価された3つのプレイヤーを表示',
    reviewDesc3: '一定評価に達したユーザーからのオファーを断る機能',
    announcement: '最新公告',
    announcementDesc1: '新規登録で500コインプレゼント中!',
    announcementDesc2: '本日より週末限定イベント開催',
    announcementDesc3: '人気プレイヤーランキング更新しました',
    reservationGuide: '予約の流れ',
    reservationStep1: 'お好きなプレイヤーを選択',
    reservationStep2: 'メッセージで希望日時を相談',
    reservationStep3: 'コインで決済して予約完了!',
    selectGamer: '今々選べるゲーマー',
    seeMore: 'もっと見る',
    gameList: 'ゲーム一覧',
    featuredUsers: '注目のユーザー',
    coins: 'コイン',
    readMore: 'もっと見る',
    online: 'オンライン',
    sortBy: '並び替え',
    weeklyPopular: '本週人気',
    newRecommend: '新人推薦',
    mostOrders: '接単最多',
    games: {
      apex: 'Apex',
      lol: 'LoL',
      valorant: 'VALORANT',
      splatoon: 'スプラ3',
      monsterhunter: 'モンハン',
      dbd: 'DbD'
    },
    ranks: {
      master: 'マスター',
      diamond: 'ダイヤ',
      platinum: 'プラチナ',
      gold: 'ゴールド'
    },
    serviceContent: {
      gaming: 'ゲーム',
      chatting: 'チャット',
      teaching: '指導'
    },
    serviceMethod: {
      online: 'オンライン',
      offline: 'オフライン'
    }
  },
  en: {
    message: 'Message',
    search: 'Search',
    home: 'Home',
    login: 'Log in',
    register: 'Sign up',
    safeReview: 'Safe Mutual Rating System',
    reviewDesc1: 'Visualize player ratings',
    reviewDesc2: 'Display 3 players who have rated each user',
    reviewDesc3: 'Function to decline offers from users below certain ratings',
    announcement: 'Latest Announcement',
    announcementDesc1: 'Get 500 coins for new registration!',
    announcementDesc2: 'Weekend special event starts today',
    announcementDesc3: 'Popular player rankings updated',
    reservationGuide: 'How to Book',
    reservationStep1: 'Select your favorite player',
    reservationStep2: 'Discuss preferred date via message',
    reservationStep3: 'Pay with coins and complete booking!',
    selectGamer: 'Select Gamers',
    seeMore: 'View More',
    gameList: 'Games',
    featuredUsers: 'Featured Users',
    coins: 'Coins',
    readMore: 'Read More',
    online: 'Online',
    sortBy: 'Sort By',
    weeklyPopular: 'Weekly Popular',
    newRecommend: 'New Players',
    mostOrders: 'Most Orders',
    games: {
      apex: 'Apex',
      lol: 'LoL',
      valorant: 'VALORANT',
      splatoon: 'Splatoon 3',
      monsterhunter: 'Monster Hunter',
      dbd: 'DbD'
    },
    ranks: {
      master: 'Master',
      diamond: 'Diamond',
      platinum: 'Platinum',
      gold: 'Gold'
    },
    serviceContent: {
      gaming: 'Gaming',
      chatting: 'Chatting',
      teaching: 'Teaching'
    },
    serviceMethod: {
      online: 'Online',
      offline: 'Offline'
    }
  },
  zh: {
    message: '消息',
    search: '搜索',
    home: '首页',
    login: '登录',
    register: '注册',
    safeReview: '安心的互相评价制度',
    reviewDesc1: '可视化玩家评价',
    reviewDesc2: '显示评价过该用户的3位玩家',
    reviewDesc3: '拒绝低评分用户邀请的功能',
    announcement: '最新公告',
    announcementDesc1: '新用户注册送500金币!',
    announcementDesc2: '周末限定活动今日开启',
    announcementDesc3: '人气玩家排行榜已更新',
    reservationGuide: '预约流程',
    reservationStep1: '选择喜欢的玩家',
    reservationStep2: '通过消息协商时间',
    reservationStep3: '使用金币支付完成预约!',
    selectGamer: '选择玩家',
    seeMore: '查看更多',
    gameList: '游戏列表',
    featuredUsers: '推荐用户',
    coins: '金币',
    readMore: '了解更多',
    online: '在线',
    sortBy: '排序方式',
    weeklyPopular: '本周人气',
    newRecommend: '新人推荐',
    mostOrders: '接单最多',
    games: {
      apex: 'Apex',
      lol: 'LoL',
      valorant: 'VALORANT',
      splatoon: '喷射战士3',
      monsterhunter: '怪物猎人',
      dbd: '黎明杀机'
    },
    ranks: {
      master: '大师',
      diamond: '钻石',
      platinum: '铂金',
      gold: '黄金'
    },
    serviceContent: {
      gaming: '打游戏',
      chatting: '聊天',
      teaching: '陪练'
    },
    serviceMethod: {
      online: '线上',
      offline: '线下'
    }
  }
};

const USERS_DATA = [
  {
    name: 'メロン',
    avatar: '🐈',
    color: 'from-blue-200 to-cyan-200',
    online: true,
    games: [
      { name: 'apex', rank: 'master' },
      { name: 'valorant', rank: 'diamond' }
    ],
    voice: 'mature',
    services: ['gaming', 'chatting'],
    methods: ['online']
  },
  {
    name: '春希',
    avatar: '🌸',
    color: 'from-pink-200 to-purple-200',
    online: true,
    games: [
      { name: 'lol', rank: 'platinum' },
      { name: 'apex', rank: 'gold' }
    ],
    voice: 'girl',
    services: ['gaming', 'teaching'],
    methods: ['online']
  },
  {
    name: 'こあんひ',
    avatar: '😊',
    color: 'from-blue-200 to-indigo-200',
    online: false,
    games: [
      { name: 'valorant', rank: 'diamond' }
    ],
    voice: 'loli',
    services: ['chatting'],
    methods: ['online', 'offline']
  },
  {
    name: 'ななち',
    avatar: '🐶',
    color: 'from-indigo-200 to-purple-200',
    online: true,
    games: [
      { name: 'splatoon', rank: 'master' },
      { name: 'apex', rank: 'platinum' }
    ],
    voice: 'girl',
    services: ['gaming'],
    methods: ['online']
  },
  {
    name: 'ヤッホ',
    avatar: '🎮',
    color: 'from-slate-200 to-blue-200',
    online: false,
    games: [
      { name: 'monsterhunter', rank: 'master' }
    ],
    voice: 'mature',
    services: ['gaming', 'teaching'],
    methods: ['online']
  },
  {
    name: 'uta',
    avatar: '🎵',
    color: 'from-purple-200 to-pink-200',
    online: true,
    games: [
      { name: 'apex', rank: 'diamond' },
      { name: 'lol', rank: 'platinum' }
    ],
    voice: 'loli',
    services: ['gaming', 'chatting'],
    methods: ['online', 'offline']
  }
];

const GAMES_DATA = [
  { name: 'モンハンワイルズ', image: '🎮', color: 'from-slate-600 to-slate-700' },
  { name: 'Apex', image: '🎯', color: 'from-red-600 to-orange-600' },
  { name: 'LoL', image: '⚔️', color: 'from-blue-600 to-indigo-600' },
  { name: 'VALORANT', image: '🔫', color: 'from-red-700 to-pink-700' },
  { name: 'スプラ3', image: '🦑', color: 'from-orange-500 to-pink-500' },
  { name: 'APEX mobile', image: '📱', color: 'from-red-500 to-orange-500' },
  { name: 'MHR', image: '🐉', color: 'from-green-700 to-emerald-700' },
  { name: 'DbD', image: '👻', color: 'from-slate-800 to-slate-900' }
];

const FEATURED_USERS_DATA = [
  {
    name: 'ちい💙ぷる',
    username: '@chiipuru',
    rating: 5.0,
    reviews: 6360,
    price: 900,
    duration: 30,
    image: '👧',
    bgColor: 'from-pink-200 via-purple-200 to-blue-200',
    online: true
  },
  {
    name: 'とある',
    username: '@toaru',
    rating: 5.0,
    reviews: 121,
    price: 400,
    duration: 30,
    image: '🌸',
    bgColor: 'from-purple-200 via-pink-200 to-blue-200',
    online: true
  },
  {
    name: 'おと🌻',
    username: '@oto',
    rating: 5.0,
    reviews: 869,
    price: 425,
    duration: 30,
    image: '🌻',
    bgColor: 'from-blue-200 via-cyan-200 to-purple-200',
    online: false
  },
  {
    name: 'れに',
    username: '@reni',
    rating: 5.0,
    reviews: 6328,
    price: 900,
    duration: 30,
    image: '👸',
    bgColor: 'from-pink-300 via-purple-300 to-indigo-300',
    online: true
  }
];

// ==================== 自定义 Hooks ====================
const useAudioPlayer = () => {
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioElements, setAudioElements] = useState({});

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

  return { playingAudio, toggleAudio };
};

// ==================== UI 组件 ====================
const BackgroundDecorations = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -z-10">
    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute top-40 right-20 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
    <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
    <div className="absolute top-10 left-1/4 text-4xl opacity-20 animate-bounce">✨</div>
    <div className="absolute top-32 right-1/4 text-3xl opacity-20 animate-bounce delay-300">🦋</div>
    <div className="absolute bottom-40 left-1/3 text-3xl opacity-20 animate-bounce delay-700">⭐</div>
    <div className="absolute top-1/2 right-20 text-4xl opacity-20 animate-bounce delay-1000">💫</div>
  </div>
);

const Header = ({ lang, setLang, t }) => (
  <header className="bg-white/70 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b-4 border-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <button className="w-11 h-11 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition shadow-lg hover:shadow-xl">
            👤
          </button>
          <button className="w-11 h-11 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition shadow-lg hover:shadow-xl">
            ➕
          </button>
          <button className="w-11 h-11 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition shadow-lg hover:shadow-xl relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-slate-700 hover:text-indigo-600 transition font-bold relative group">
            {t.home}
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all rounded-full"></span>
          </a>
          <a href="#" className="text-slate-700 font-bold relative">
            {t.search}
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
          </a>
          <a href="#" className="text-slate-700 hover:text-indigo-600 transition font-bold relative group">
            {t.message}
            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all rounded-full"></span>
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-sm border-2 border-indigo-300 rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/90 font-medium shadow-md hover:shadow-lg transition"
          >
            <option value="ja">🇯🇵 日本語</option>
            <option value="en">🇬🇧 English</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
          <button className="hidden sm:block px-6 py-2.5 text-slate-700 border-3 border-slate-700 rounded-full hover:bg-slate-100 transition font-bold shadow-md hover:shadow-lg">
            {t.login}
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition font-bold shadow-lg hover:shadow-xl">
            <Sparkles className="w-4 h-4 inline mr-1" />
            {t.register}
          </button>
        </div>
      </div>
    </div>
  </header>
);

const HeroCarousel = ({ currentSlide, setCurrentSlide, t }) => {
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

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 rounded-3xl shadow-2xl overflow-hidden relative border-4 border-white/50">
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
                className={`h-3 rounded-full transition shadow-md ${idx === currentSlide ? 'bg-white w-10' : 'bg-white/60 w-3'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioWaveButton = ({ isPlaying, onClick }) => {
  const waveConfig = [
    { duration: '1.2s', delay: '0s' },
    { duration: '1.0s', delay: '0.15s' },
    { duration: '1.3s', delay: '0.3s' },
    { duration: '1.1s', delay: '0.15s' },
    { duration: '1.2s', delay: '0s' },
  ];

  return (
    <button
      onClick={onClick}
      className="flex px-3 py-1.5 md:px-4 md:py-2 items-center justify-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 w-full"
    >
      <div className="relative w-4 h-4 flex-shrink-0">
        <Play className={`w-4 h-4 fill-white transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
        <Pause className={`absolute top-0 left-0 w-4 h-4 fill-white transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div className="flex items-center justify-center space-x-1 h-5 md:h-6">
        {waveConfig.map((bar, i) => (
          <div
            key={i}
            className="w-1 bg-white rounded-full animate-wave"
            style={{
              animationDuration: bar.duration,
              animationDelay: bar.delay,
              animationPlayState: isPlaying ? 'running' : 'paused',
              animationFillMode: 'backwards',
            }}
          ></div>
        ))}
      </div>
    </button>
  );
};

// 你可以把这个组件放在同一个文件，或者单独的 'Tag.jsx'
// 抽象的 <Tag> 组件
const Tag = ({ children, color = "blue", paddingType = "service" }) => {
  // 颜色查找表
  const colors = {
    blue: "from-blue-100/50 to-cyan-100/50 border-blue-200/50",
    purple: "from-purple-100/50 to-pink-100/50 border-purple-200/50",
  };

  // 根据 paddingType 选择不同的 padding 变量
  const paddingClasses = {
    service: "px-[var(--service-tag-px)] py-[var(--service-tag-py)]",
    rank: "px-[var(--rank-tag-px-base)] py-[var(--rank-tag-py)] md:px-[var(--rank-tag-px-md)]",
  };

  return (
    <span
      className={`
        bg-gradient-to-r text-slate-700 rounded-full shadow-sm font-bold border-2
        ${colors[color]}
        ${paddingType === 'rank' ? paddingClasses.rank : paddingClasses.service}
        [font-size:var(--font-tag-base)] md:[font-size:var(--font-tag-md)]
      `}
    >
      {children}
    </span>
  );
};

// 确保 Tag 组件在作用域内 (可以在此文件上方定义，或 import)

const UserCard = ({ user, idx, t, playingAudio, toggleAudio, size = "full" }) => (
  <div className={`
    ${size === 'full' ? 'user-card-full' : 'user-card-small'}
    relative overflow-hidden rounded-[var(--card-radius)] shadow-xl hover:shadow-2xl transition cursor-pointer border-[var(--card-border)] border-white hover:scale-105
  `}>
    <div className={`absolute inset-0 bg-gradient-to-br ${user.color} opacity-60`}></div>
    <div className="absolute inset-0 backdrop-blur-sm"></div>

    <div className={`
      relative z-10 
      p-[var(--card-padding-base)] 
      sm:p-[var(--card-padding-sm)] 
      lg:p-[var(--card-padding-lg)]
    `}>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 items-start">
        
          
          <div className="flex justify-center space-x-3 w-full">
            <p className={`
              font-black text-slate-800 mb-2
              text-[var(--font-name-base)] 
              md:text-[var(--font-name-md)]
            `}>
              {user.name}
            </p>
            <div className="flex flex-col items-center space-y-2">
              <AudioWaveButton 
                isPlaying={playingAudio === idx}
                onClick={() => toggleAudio(idx)}
              />
            </div>
          </div>
        

        <div className="space-y-3 w-full">
          <div className={`
            flex flex-col justify-end bg-cover bg-center bg-no-repeat backdrop-blur-sm shadow-lg
            min-h-[var(--content-min-height)]
            rounded-[var(--content-radius)]
            p-[var(--content-padding-base)] 
            md:p-[var(--content-padding-md)]
          `} style={{ backgroundImage: "url('./filter-dark.png')" }}>
            
            {/* --- Rank Tags (使用你原始的样式，但替换为变量) --- */}
            <div className="flex flex-wrap gap-1 md:gap-2">
              {user.games.map((game, gIdx) => (
                <div key={gIdx} className="flex items-center justify-between gap-1">
                  <span className={`
                    font-bold text-slate-800
                    text-[var(--font-rank-base)]
                    md:text-[var(--font-rank-md)]
                  `}>
                    {t.games[game.name]}
                  </span>
                  <span className={`
                    font-bold text-indigo-600 bg-white/50 rounded-full shadow
                    text-[var(--font-rank-base)] md:text-[var(--font-rank-md)]
                    py-[var(--rank-tag-py)]
                    px-[var(--rank-tag-px-base)]
                    md:px-[var(--rank-tag-px-md)]
                  `}>
                    {t.ranks[game.rank]}
                  </span>
                </div>
              ))}
            </div>

            {/* --- Service/Method Tags (使用新的 <Tag> 组件) --- */}
            <div className="flex flex-wrap gap-2 w-full">
              {user.services.map((service, sIdx) => (
                <Tag key={sIdx} color="blue" paddingType="service">
                  {t.serviceContent[service]}
                </Tag>
              ))}

              {user.methods.map((method, mIdx) => (
                <Tag key={mIdx} color="purple" paddingType="service">
                  {t.serviceMethod[method]}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GamersSection = ({ users, t, playingAudio, toggleAudio }) => (
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

    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {users.map((user, idx) => (
        <UserCard 
          key={idx}
          user={user}
          idx={idx}
          t={t}
          playingAudio={playingAudio}
          toggleAudio={toggleAudio}
          size='small'
        />
      ))}
    </div>
  </div>
);

const GamesSection = ({ games, t }) => (
  <div className="mb-12">
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg">
        🎮
      </div>
      <h3 className="text-2xl md:text-3xl font-black text-slate-800">{t.gameList}</h3>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {games.map((game, idx) => (
        <div key={idx} className="flex flex-col items-center cursor-pointer group">
          <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:scale-110 group-hover:shadow-2xl transition border-2 border-white shadow-lg`}>
            {game.image}
          </div>
          <span className="text-xs text-slate-700 text-center truncate w-full font-bold">{game.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const FeaturedUserCard = ({ user, t }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition cursor-pointer border-4 border-white hover:scale-105 hover:-translate-y-1">
    <div className={`h-48 bg-gradient-to-br ${user.bgColor} flex items-center justify-center text-6xl relative`}>
      {user.image}
      {user.online && (
        <div className="absolute top-3 right-3 bg-green-400 text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1 font-bold border-2 border-white shadow-lg animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full"></span>
          <span>{t.online}</span>
        </div>
      )}
      <div className="absolute top-3 left-3 bg-slate-800/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1 font-bold border-2 border-white shadow-lg">
        <span>⏱️</span>
        <span>{user.duration}分</span>
      </div>
    </div>
    <div className="p-5 bg-gradient-to-b from-white to-blue-50/50">
      <h4 className="font-black text-slate-800 mb-1 text-lg">{user.name}</h4>
      <p className="text-xs text-slate-500 mb-3 font-medium">{user.username}</p>
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        <span className="text-sm text-slate-600 ml-2 font-bold">{user.rating}</span>
        <span className="text-xs text-slate-400">({user.reviews})</span>
      </div>
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-2xl border-2 border-indigo-200">
        <div>
          <span className="text-indigo-600 font-black text-2xl">{user.price}</span>
          <span className="text-sm text-slate-500 ml-1 font-bold">{t.coins}</span>
        </div>
        <MessageCircle className="w-6 h-6 text-indigo-500" />
      </div>
    </div>
  </div>
);

const FeaturedUsersSection = ({ featuredUsers, sortBy, setSortBy, t }) => (
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
);

const Footer = () => (
  <footer className="bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-900 text-white mt-16 py-12 border-t-4 border-indigo-400 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-5 left-10 text-4xl">✨</div>
      <div className="absolute top-10 right-20 text-4xl">🌟</div>
      <div className="absolute bottom-5 left-1/4 text-4xl">💫</div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div className="mb-4 flex items-center justify-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          G
        </div>
        <span className="text-2xl font-black">Game Room</span>
      </div>
      <p className="text-sm text-slate-300 font-medium">© 2024 Game Room. All rights reserved. Made with 💖</p>
    </div>
  </footer>
);

// ==================== 主应用组件 ====================
const GameRoomApp = () => {
  const [lang, setLang] = useState('ja');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sortBy, setSortBy] = useState('weeklyPopular');
  const { playingAudio, toggleAudio } = useAudioPlayer();

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* <BackgroundDecorations />
      <Header lang={lang} setLang={setLang} t={t} />
      <HeroCarousel currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} t={t} /> */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GamersSection 
          users={USERS_DATA} 
          t={t} 
          playingAudio={playingAudio}
          toggleAudio={toggleAudio}
        />
        <GamesSection games={GAMES_DATA} t={t} />
        <FeaturedUsersSection 
          featuredUsers={FEATURED_USERS_DATA}
          sortBy={sortBy}
          setSortBy={setSortBy}
          t={t}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default GameRoomApp