import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Menu, Heart, Sparkles, MessageCircle, Bell, Filter, Play, Pause } from 'lucide-react';
import Logo from './Logo';
import TestPage from './pages/TestPage';
import { Switch, Route } from 'wouter';
import HomePage from './pages/homepage/Homepage';

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





// ==================== UI 组件 ====================
const BackgroundDecorations = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10">
    <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 blur-3xl animate-pulse"></div>
    <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
    <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-blue-500/10 blur-3xl animate-pulse delay-500"></div>
    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 3px)', backgroundSize: '100% 4px' }}></div>
    <div className="absolute top-10 left-1/4 text-2xl opacity-30 text-cyan-400">▲</div>
    <div className="absolute top-32 right-1/4 text-2xl opacity-30 text-pink-400">◆</div>
    <div className="absolute bottom-40 left-1/3 text-2xl opacity-30 text-purple-400">●</div>
    <div className="absolute top-1/2 right-20 text-2xl opacity-30 text-cyan-400">■</div>
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




// 你可以把这个组件放在同一个文件，或者单独的 'Tag.jsx'
// 抽象的 <Tag> 组件


// 确保 Tag 组件在作用域内 (可以在此文件上方定义，或 import)









const Footer = () => (
  <footer className="bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-900 text-white mt-16 py-12 border-t-4 border-indigo-400 relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-5 left-10 text-4xl">✨</div>
      <div className="absolute top-10 right-20 text-4xl">🌟</div>
      <div className="absolute bottom-5 left-1/4 text-4xl">💫</div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div className="mb-4 flex items-center justify-center space-x-2">
        {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          E
        </div>
        <span className="text-2xl font-black">e-Idol</span> */}
        <Logo />
      </div>
      <p className="text-sm text-slate-300 font-medium">© 2025 e-Idol. All rights reserved. Made with 🌟</p>
    </div>
  </footer>
);

// ==================== 主应用组件 ====================

const Devpage = () => {
  const [lang, setLang] = useState('ja');
  const [currentSlide, setCurrentSlide] = useState(0);

  const t = TRANSLATIONS[lang];
  return (
    <>
      <BackgroundDecorations />
      <Header lang={lang} setLang={setLang} t={t} />
      <HomePage />


      <Footer />
    </>
  );
};

const GameRoomApp = () => {


  return (

    <Switch>
      <Route path="/" component={Devpage} />
      <Route path="/test" component={TestPage} />
    </Switch>
  );
};

export default GameRoomApp