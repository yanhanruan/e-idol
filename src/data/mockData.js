export const USERS_DATA = [
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

export const GAMES_DATA = [
  { name: 'モンハンワイルズ', image: '🕹️', color: 'from-slate-600 to-slate-700' },
  { name: 'Apex', image: '🎯', color: 'from-red-600 to-orange-600' },
  { name: 'LoL', image: '⚔️', color: 'from-blue-600 to-indigo-600' },
  { name: 'VALORANT', image: '🔫', color: 'from-red-700 to-pink-700' },
  { name: 'スプラ3', image: '🦑', color: 'from-orange-500 to-pink-500' },
  { name: 'APEX mobile', image: '📱', color: 'from-red-500 to-orange-500' },
  { name: 'MHR', image: '🐉', color: 'from-green-700 to-emerald-700' },
  { name: 'DbD', image: '👻', color: 'from-slate-800 to-slate-900' }
];

export const FEATURED_USERS_DATA = [
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