import React, { useState } from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { 
  Star, Crown, TrendingUp, Gamepad2, Clock, 
  MessageSquare, Gift, Play, Filter, Search,
  Calendar, Award, Volume2, Heart, Users
} from 'lucide-react';

// Mock Cast 数据
const MOCK_CASTS = [
  {
    id: 1,
    name: "Sakura",
    avatar: "https://i.pravatar.cc/400?img=5",
    title: "プロゲーマー",
    rating: 4.9,
    totalOrders: 1247,
    price: 3000,
    isOnline: true,
    isFeatured: true,
    bio: "こんにちは！Sakuraです。楽しくゲームしましょう♪ 初心者の方も大歓迎です！",
    voiceUrl: "/audio/sakura_intro.mp3",
    games: [
      { name: "Apex", rank: "マスター", icon: "🎯" },
      { name: "VALORANT", rank: "イモータル", icon: "🔫" }
    ],
    availableSlots: ["10:00-12:00", "14:00-18:00", "20:00-23:00"],
    tags: ["優しい", "上手い", "面白い"],
    reviews: [
      { user: "Player123", comment: "とても楽しかったです！また予約します", rating: 5 },
      { user: "GamerX", comment: "丁寧に教えてくれました", rating: 5 }
    ],
    topSupporters: [
      { name: "User_A", amount: 50000 },
      { name: "User_B", amount: 35000 },
      { name: "User_C", amount: 28000 }
    ]
  },
  {
    id: 2,
    name: "Ryu",
    avatar: "https://i.pravatar.cc/400?img=12",
    title: "ベテランプレイヤー",
    rating: 4.8,
    totalOrders: 892,
    price: 2500,
    isOnline: false,
    isFeatured: false,
    bio: "FPSゲーム専門！一緒にランク上げましょう",
    voiceUrl: "/audio/ryu_intro.mp3",
    games: [
      { name: "Apex", rank: "ダイヤ", icon: "🎯" },
      { name: "LoL", rank: "プラチナ", icon: "⚔️" }
    ],
    availableSlots: ["19:00-22:00", "22:00-24:00"],
    tags: ["戦略的", "冷静", "経験豊富"],
    reviews: [
      { user: "Nova", comment: "戦術を学べました", rating: 5 },
      { user: "Echo", comment: "プロの動きを見れて勉強になった", rating: 4 }
    ],
    topSupporters: [
      { name: "User_D", amount: 42000 },
      { name: "User_E", amount: 31000 },
      { name: "User_F", amount: 19000 }
    ]
  },
  {
    id: 3,
    name: "Miku",
    avatar: "https://i.pravatar.cc/400?img=9",
    title: "アイドルゲーマー",
    rating: 5.0,
    totalOrders: 2156,
    price: 4000,
    isOnline: true,
    isFeatured: true,
    bio: "歌って踊れるゲーマーです！一緒に楽しみましょう🎵",
    voiceUrl: "/audio/miku_intro.mp3",
    games: [
      { name: "スプラ3", rank: "X", icon: "🦑" },
      { name: "モンハン", rank: "HR999", icon: "🐲" }
    ],
    availableSlots: ["12:00-15:00", "18:00-21:00"],
    tags: ["元気", "可愛い", "楽しい"],
    reviews: [
      { user: "StarFan", comment: "最高の時間でした！", rating: 5 },
      { user: "Luna", comment: "癒やされました♪", rating: 5 }
    ],
    topSupporters: [
      { name: "User_G", amount: 120000 },
      { name: "User_H", amount: 95000 },
      { name: "User_I", amount: 67000 }
    ]
  },
  {
    id: 4,
    name: "Ken",
    avatar: "https://i.pravatar.cc/400?img=15",
    title: "コーチング専門",
    rating: 4.7,
    totalOrders: 634,
    price: 2800,
    isOnline: true,
    isFeatured: false,
    bio: "ランクアップをサポートします。分析と指導が得意です",
    voiceUrl: "/audio/ken_intro.mp3",
    games: [
      { name: "VALORANT", rank: "ダイヤ", icon: "🔫" },
      { name: "LoL", rank: "マスター", icon: "⚔️" }
    ],
    availableSlots: ["15:00-18:00", "21:00-24:00"],
    tags: ["論理的", "親切", "指導上手"],
    reviews: [
      { user: "Rookie", comment: "ランクが2つ上がりました", rating: 5 },
      { user: "Silver", comment: "わかりやすい説明でした", rating: 4 }
    ],
    topSupporters: [
      { name: "User_J", amount: 38000 },
      { name: "User_K", amount: 29000 },
      { name: "User_L", amount: 21000 }
    ]
  },
  {
    id: 5,
    name: "Yuki",
    avatar: "https://i.pravatar.cc/400?img=20",
    title: "新人キャスト",
    rating: 4.6,
    totalOrders: 156,
    price: 2000,
    isOnline: false,
    isFeatured: false,
    bio: "初めてですが頑張ります！よろしくお願いします",
    voiceUrl: "/audio/yuki_intro.mp3",
    games: [
      { name: "Apex", rank: "プラチナ", icon: "🎯" },
      { name: "DbD", rank: "レッド", icon: "👻" }
    ],
    availableSlots: ["13:00-17:00"],
    tags: ["新人", "頑張り屋", "初心者歓迎"],
    reviews: [
      { user: "NewGamer", comment: "一生懸命でした", rating: 5 },
      { user: "Casual", comment: "楽しかったです", rating: 4 }
    ],
    topSupporters: [
      { name: "User_M", amount: 15000 },
      { name: "User_N", amount: 12000 },
      { name: "User_O", amount: 8000 }
    ]
  },
  {
    id: 6,
    name: "Hana",
    avatar: "https://i.pravatar.cc/400?img=24",
    title: "チャット専門",
    rating: 4.9,
    totalOrders: 1543,
    price: 1500,
    isOnline: true,
    isFeatured: true,
    bio: "お話し相手が欲しい方へ。リラックスできる時間を提供します",
    voiceUrl: "/audio/hana_intro.mp3",
    games: [
      { name: "マイクラ", rank: "建築家", icon: "🏗️" },
      { name: "あつ森", rank: "5つ星", icon: "🌴" }
    ],
    availableSlots: ["11:00-14:00", "16:00-20:00"],
    tags: ["癒し系", "聞き上手", "優しい"],
    reviews: [
      { user: "Lonely", comment: "心が軽くなりました", rating: 5 },
      { user: "Tired", comment: "癒やされる声です", rating: 5 }
    ],
    topSupporters: [
      { name: "User_P", amount: 88000 },
      { name: "User_Q", amount: 72000 },
      { name: "User_R", amount: 55000 }
    ]
  }
];

const CastListPage = () => {
  const { t } = useTranslations();
  const [selectedCast, setSelectedCast] = useState(null);
  const [filterOnline, setFilterOnline] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // フィルター＆ソート処理
  const filteredCasts = MOCK_CASTS
    .filter(cast => !filterOnline || cast.isOnline)
    .sort((a, b) => {
      if (sortBy === 'featured') return b.isFeatured - a.isFeatured;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white pb-16 relative overflow-hidden">
      
      {/* 背景装飾 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ヘッダー */}
        <div className="py-8 text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wider mb-4">
            CAST LIST
          </span>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] mb-2">
            {t.castList || 'キャスト一覧'}
          </h1>
          <p className="text-slate-400 text-sm">あなたにぴったりのキャストを見つけよう</p>
        </div>

        {/* フィルター＆検索バー */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4">
          
          {/* 検索ボックス */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="キャスト名やゲーム名で検索"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* フィルターとソート */}
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setFilterOnline(!filterOnline)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                filterOnline 
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${filterOnline ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              {t.online || 'オンライン'}
            </button>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="featured">おすすめ順</option>
              <option value="rating">評価順</option>
              <option value="orders">人気順</option>
              <option value="price">料金順</option>
            </select>
          </div>
        </div>

        {/* キャストグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCasts.map(cast => (
            <div 
              key={cast.id}
              onClick={() => setSelectedCast(cast)}
              className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              
              {/* バッジ */}
              {cast.isFeatured && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                  <Crown size={14} />
                  <span>注目</span>
                </div>
              )}

              {cast.isOnline && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-cyan-500/90 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span>ONLINE</span>
                </div>
              )}

              {/* アバター */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10" />
                <img 
                  src={cast.avatar} 
                  alt={cast.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* ボイスプレビューボタン */}
                <button className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-purple-600/90 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg transition-colors group/play">
                  <Volume2 size={20} className="text-white group-hover/play:scale-110 transition-transform" />
                </button>
              </div>

              {/* カード内容 */}
              <div className="p-5">
                
                {/* 名前とタイトル */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                    {cast.name}
                  </h3>
                  <p className="text-xs text-slate-400">{cast.title}</p>
                </div>

                {/* 統計情報 */}
                <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="text-sm font-bold text-white">{cast.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Users size={16} />
                    <span className="text-xs">{cast.totalOrders}件</span>
                  </div>
                  <div className="ml-auto text-cyan-400 font-bold text-lg">
                    ¥{cast.price.toLocaleString()}
                  </div>
                </div>

                {/* ゲーム */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {cast.games.slice(0, 2).map((game, i) => (
                    <div key={i} className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded text-xs">
                      <span>{game.icon}</span>
                      <span className="text-white font-medium">{game.name}</span>
                      <span className="text-slate-400">· {game.rank}</span>
                    </div>
                  ))}
                </div>

                {/* タグ */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {cast.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-900/30 border border-purple-500/30 rounded text-[10px] text-purple-300">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* アクションボタン */}
                <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
                  予約する
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 詳細モーダル */}
        {selectedCast && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCast(null)}
          >
            <div 
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* モーダルヘッダー */}
              <div className="relative h-80">
                <img 
                  src={selectedCast.avatar} 
                  alt={selectedCast.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                
                <button 
                  onClick={() => setSelectedCast(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-slate-800/80 hover:bg-slate-700 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ✕
                </button>

                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-4xl font-black text-white mb-2">{selectedCast.name}</h2>
                  <p className="text-slate-300">{selectedCast.title}</p>
                </div>
              </div>

              {/* モーダルコンテンツ */}
              <div className="p-6 space-y-6">
                
                {/* 自己紹介 */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    <MessageSquare size={20} />
                    自己紹介
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-lg">
                    {selectedCast.bio}
                  </p>
                </div>

                {/* ゲームと段位 */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    <Gamepad2 size={20} />
                    得意ゲーム
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCast.games.map((game, i) => (
                      <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                        <span className="text-3xl">{game.icon}</span>
                        <div>
                          <p className="font-bold text-white">{game.name}</p>
                          <p className="text-sm text-slate-400">段位: {game.rank}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 可接時段 */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    <Clock size={20} />
                    可接時段
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCast.availableSlots.map((slot, i) => (
                      <div key={i} className="px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 客人留言 */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    <Heart size={20} />
                    お客様の声
                  </h3>
                  <div className="space-y-3">
                    {selectedCast.reviews.map((review, i) => (
                      <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{review.user}</span>
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, j) => (
                              <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 打赏排行 */}
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    <Gift size={20} />
                    応援ランキング TOP3
                  </h3>
                  <div className="space-y-2">
                    {selectedCast.topSupporters.map((supporter, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            i === 0 ? 'bg-yellow-500 text-white' :
                            i === 1 ? 'bg-slate-400 text-white' :
                            'bg-orange-600 text-white'
                          }`}>
                            {i + 1}
                          </div>
                          <span className="text-white font-medium">{supporter.name}</span>
                        </div>
                        <span className="text-cyan-400 font-bold">¥{supporter.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 予約ボタン */}
                <button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 text-lg">
                  このキャストを予約する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastListPage;