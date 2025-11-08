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
    register: '登録',
    safeReview: '安心の相互評価制度',
    reviewDesc1: '募集プレイヤーの評価を可視化',
    reviewDesc2: '各ユーザーにこれまでに評価された3つのプレイヤーを表示',
    reviewDesc3: '一定評価に達したユーザーからのオファーを断る機能',
    announcement: '最新公告',
    announcementDesc1: '登録で500コインプレゼント中!',
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
  <header className="sticky top-0 z-50" style={{
    background: 'rgba(10, 13, 30, 0.75)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 255, 255, 0.1) inset'
  }}>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Roboto+Mono:wght@300;400;700&display=swap" rel="stylesheet" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group" style={{
            background: 'linear-gradient(135deg, rgba(0, 100, 150, 0.4), rgba(0, 50, 100, 0.4))',
            border: '1px solid rgba(0, 255, 255, 0.4)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="group-hover:scale-110 transition-transform">👤</span>
          </button>
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group" style={{
            background: 'linear-gradient(135deg, rgba(100, 0, 150, 0.4), rgba(50, 0, 100, 0.4))',
            border: '1px solid rgba(255, 0, 255, 0.4)',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <span className="group-hover:scale-110 transition-transform">➕</span>
          </button>
          <button className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 relative group" style={{
            background: 'linear-gradient(135deg, rgba(150, 0, 100, 0.4), rgba(100, 0, 50, 0.4))',
            border: '1px solid rgba(255, 0, 100, 0.4)',
            boxShadow: '0 0 20px rgba(255, 0, 100, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{
              background: 'linear-gradient(135deg, #ff0055, #ff3388)',
              boxShadow: '0 0 15px rgba(255, 0, 85, 0.8), 0 0 5px rgba(255, 0, 85, 1)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>3</span>
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {['home', 'search', 'message'].map((item) => (
            <a key={item} href="#" className="transition-all font-bold relative group py-1" style={{
              fontFamily: "'Roboto Mono', monospace",
              color: '#00ffff',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}>
              {t[item]}
              <span className="absolute -bottom-1 left-0 h-0.5 transition-all duration-300 group-hover:w-full" style={{
                width: item === 'search' ? '100%' : '0',
                background: 'linear-gradient(90deg, #00ffff, #0099ff)',
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
              }}></span>
            </a>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-sm rounded-xl px-3 py-2 focus:outline-none font-medium transition-all cursor-pointer" style={{
              fontFamily: "'Roboto Mono', monospace",
              background: 'rgba(0, 50, 100, 0.3)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              color: '#00ffff',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <option value="ja">🇯🇵 日本語</option>
            <option value="en">🇬🇧 English</option>
            <option value="zh">🇨🇳 中文</option>
          </select>

          <button className=" text-base opacity-90 px-1 py-2 text-white rounded-full transition-all font-bold hover:scale-105" style={{
            fontFamily: "'Roboto Mono', monospace",
            background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            textShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
          }}>
            {/* <Sparkles className="w-4 h-4 inline mr-1" /> */}
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
  <footer className="mt-16 py-12 relative overflow-hidden" style={{
    background: 'linear-gradient(180deg, rgba(5, 8, 20, 0) 0%, rgba(10, 13, 30, 0.8) 20%, rgba(10, 13, 30, 0.95) 100%)',
    borderTop: '1px solid rgba(0, 255, 255, 0.2)',
    boxShadow: '0 -10px 50px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)'
  }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div className="mb-4 flex items-center justify-center">
        <Logo />
      </div>
      <p className="text-sm font-medium" style={{
        fontFamily: "'Roboto Mono', monospace",
        color: '#00ffff',
        textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
        opacity: 0.8
      }}>© 2025 e-Idol. All rights reserved. Made with 🌟</p>
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