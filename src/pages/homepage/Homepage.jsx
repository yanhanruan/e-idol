import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Menu, Heart, Sparkles, MessageCircle, Bell, Filter, Play, Pause } from 'lucide-react';
// import Logo from './Logo';
// import TestPage from './pages/TestPage';
// import { Switch, Route } from 'wouter';
import UserCard from "./components/UserCard";

const USERS_DATA = [
  {
    name: 'メロン',
    avatar: '👾',
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
    avatar: '💠',
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
    avatar: '🤖',
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
    avatar: '🎮',
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
    avatar: '🕹️',
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
  { name: 'モンハンワイルズ', image: '🕹️', color: 'from-slate-600 to-slate-700' },
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
    image: '👩‍🚀',
    bgColor: 'from-pink-900/90 via-purple-900/10 to-blue-900/90',
    online: true
  },
  {
    name: 'とある',
    username: '@toaru',
    rating: 5.0,
    reviews: 121,
    price: 400,
    duration: 30,
    image: '💠',
    bgColor: 'from-purple-900/90 via-orange-900/10 to-blue-900/90',
    online: true
  },
  {
    name: 'おと☄',
    username: '@oto',
    rating: 5.0,
    reviews: 869,
    price: 425,
    duration: 30,
    image: '☄',
    bgColor: 'from-blue-900/90 via-green-900/10 to-purple-900/90',
    online: false
  },
  {
    name: 'れに',
    username: '@reni',
    rating: 5.0,
    reviews: 6328,
    price: 900,
    duration: 30,
    image: '🪐',
    bgColor: 'from-pink-900/90 via-purple-900/10 to-indigo-900/90',
    online: true
  }
];

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

const GamersSection = ({ users, t, playingAudio, toggleAudio }) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex justify-center w-7 h-7 text-gray-500 animate-pulse" style={{
            filter: 'drop-shadow(0 0 5px #fff)'
          }} >
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl md:text-3xl font-black text-slate-100">{t.selectGamer}</h3>
      </div>
      <button className="text-sm text-slate-300 bg-blue-1000 border-2 border-indigo-500/70 px-2 py-2.5 rounded-full transition font-bold shadow-md hover:shadow-lg hover:scale-105">
        {t.seeMore}
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
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex justify-center w-7 h-7 text-gray-500 animate-pulse" style={{
            filter: 'drop-shadow(0 0 5px #fff)'
          }} >
            🕹️
          </div>
        </div>
      <h3 className="text-xl md:text-3xl font-black text-slate-300">{t.gameList}</h3>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {games.map((game, idx) => (
        <div key={idx} className="flex flex-col items-center cursor-pointer group">
          <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:scale-110 group-hover:shadow-2xl transition border-2 border-white shadow-lg`}>
            {game.image}
          </div>
          <span className="text-xs text-slate-400 text-center truncate w-full font-bold">{game.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const FeaturedUserCard = ({ user, t }) => (
  <div className="rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3 group" style={{
    background: 'linear-gradient(135deg, rgba(10, 20, 40, 0.6), rgba(20, 10, 40, 0.6))',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 255, 255, 0.2) inset',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(0, 255, 255, 0.2)'
  }}>
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
    <div className="p-5 bg-gradient-to-b ">
      <h4 className="font-bold text-xl mb-1" style={{
          fontFamily: "'Orbitron', sans-serif",
          background: 'linear-gradient(135deg, #00ffff, #0099ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))'
        }}>{user.name}</h4>
      <p className="text-xs text-slate-500 mb-3 font-medium">{user.username}</p>
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        <span className="text-sm text-slate-600 ml-2 font-bold">{user.rating}</span>
        <span className="text-xs text-slate-400">({user.reviews})</span>
      </div>
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50/10 to-purple-50/10 p-3 rounded-xl ">
        <div>
          <span className="text-green-400/100 font-black text-2xl">{user.price}</span>
          <span className="text-sm text-slate-500 ml-1 font-bold">{t.coins}</span>
        </div>
        <MessageCircle className="w-6 h-6 text-indigo-500" />
      </div>
    </div>
  </div>
);


const FeaturedUsersSection = ({ featuredUsers, sortBy, setSortBy, t }) => (
  <div>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <Star className="w-7 h-7 text-white animate-pulse" style={{
            filter: 'drop-shadow(0 0 5px #fff)'
          }} />
        </div>
        <h3 className="text-xl md:text-4xl font-black" style={{
          fontFamily: "'Orbitron', sans-serif",
          background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 30px rgba(255, 0, 255, 0.4))'
        }}>{t.featuredUsers}</h3>
      </div>
      
      <div className="flex items-center space-x-3 px-4 py-2 rounded-xl" style={{
        background: 'rgba(10, 20, 40, 0.4)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <Filter className="w-5 h-5" style={{ 
          color: '#00ffff',
          filter: 'drop-shadow(0 0 5px #00ffff)'
        }} />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none cursor-pointer transition-all" style={{
            fontFamily: "'Roboto Mono', monospace",
            color: '#00ffff',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            border: 'none'
          }}
        >
          <option value="weeklyPopular" style={{ background: '#0a0d1e', color: '#00ffff' }}>{t.weeklyPopular}</option>
          <option value="newRecommend" style={{ background: '#0a0d1e', color: '#00ffff' }}>{t.newRecommend}</option>
          <option value="mostOrders" style={{ background: '#0a0d1e', color: '#00ffff' }}>{t.mostOrders}</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-10 lg:grid-cols-4 gap-6 px-5 sm:px-0">
      {featuredUsers.map((user, idx) => (
        <FeaturedUserCard key={idx} user={user} t={t} />
      ))}
    </div>
  </div>
);


const HomePage = () => {
   
  const [sortBy, setSortBy] = useState('weeklyPopular');
  const { playingAudio, toggleAudio } = useAudioPlayer();
  const [lang, setLang] = useState('ja');
  const t = TRANSLATIONS[lang];
  const [currentSlide, setCurrentSlide] = useState(0);

    return(
        <>
        <HeroCarousel currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} t={t} />
        
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
        </>
    );
};

export default HomePage