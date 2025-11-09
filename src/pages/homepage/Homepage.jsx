import { useState } from "react";
import React from "react";
import { Star, ChevronLeft, ChevronRight, Menu, Heart, Sparkles, MessageCircle, Bell, Filter, Play, Pause } from 'lucide-react';
// import Logo from './Logo';
// import TestPage from './pages/TestPage';
// import { Switch, Route } from 'wouter';
import UserCard from "./components/UserCard";
import HeroCarousel from "./components/HeroCarousel";

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