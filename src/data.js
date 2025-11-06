// --- data.js ---
// 存放所有静态数据
// 国际化文本
export const i18n = {
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
      announcementDesc1: '新規登録で500コインプレゼント中！',
      announcementDesc2: '本日より週末限定イベント開催',
      announcementDesc3: '人気プレイヤーランキング更新しました',
      reservationGuide: '予約の流れ',
      reservationStep1: 'お好きなプレイヤーを選択',
      reservationStep2: 'メッセージで希望日時を相談',
      reservationStep3: 'コインで決済して予約完了！',
      selectGamer: '今々選べるゲーマー',
      seeMore: 'もっと見る',
      gameList: 'ゲーム一覧',
      featuredUsers: '注目のユーザー',
      coins: 'コイン',
      readMore: 'もっと見る',
      online: 'オンライン',
      sortBy: '並び替え',
      weeklyPopular: '本週人気',
      newRecommend: '新人推荐',
      mostOrders: '接单最多',
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
      announcementDesc1: '新用户注册送500金币！',
      announcementDesc2: '周末限定活动今日开启',
      announcementDesc3: '人气玩家排行榜已更新',
      reservationGuide: '预约流程',
      reservationStep1: '选择喜欢的玩家',
      reservationStep2: '通过消息协商时间',
      reservationStep3: '使用金币支付完成预约！',
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

// 轮播数据 (函数，依赖 t)
export const getSlides = (t) => [
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

// 用户数据
export const users = [
{
    name: 'メロン',
    avatar: '🍈',
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
    name: 'ごろんひ',
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
    name: 'ヤッチ',
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

// 游戏数据
export const games = [
{ name: 'モンハンワイルズ', image: '🎮', color: 'from-slate-600 to-slate-700' },
{ name: 'Apex', image: '🎯', color: 'from-red-600 to-orange-600' },
{ name: 'LoL', image: '⚔️', color: 'from-blue-600 to-indigo-600' },
{ name: 'VALORANT', image: '🔫', color: 'from-red-700 to-pink-700' },
{ name: 'スプラ3', image: '🦑', color: 'from-orange-500 to-pink-500' },
{ name: 'APEX mobile', image: '📱', color: 'from-red-500 to-orange-500' },
{ name: 'MHR', image: '🐉', color: 'from-green-700 to-emerald-700' },
{ name: 'DbD', image: '👻', color: 'from-slate-800 to-slate-900' }
];

// 特色用户数据
export const featuredUsers = [
{
    name: 'ちい🍒ぷる',
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
