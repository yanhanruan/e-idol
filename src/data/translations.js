export const TRANSLATIONS = {
  ja: {
    home: 'ホーム',
    process: 'ご利用の流れ',
    pricing: '料金表',
    castList: 'キャスト一覧',
    recruitment: 'リクルート',
    login: 'ログイン',
    register: '登録',
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
    },
    processFlow: {
      title: "ご利用の流れ",
      subtitle: "HOW IT WORKS",
      steps: [
        {
          id: "01",
          title: "ゲームを選びます",
          desc: "まずはご希望のゲームを選びましょう",
          detail: "人気タイトルからマイナーなゲームまで、幅広いラインナップからお選びいただけます。",
          iconName: "Gamepad2" // 实际项目中可映射到组件或图片路径
        },
        {
          id: "02",
          title: "キャストを選び、時間を予約します",
          desc: "気に入りのキャストのタイムテーブルから、都合のいい日時を予約ましょう",
          detail: "ゲームごとにランク・スキル・プランが表示されます。プロフィール詳細から音声サンプルも確認可能です。",
          iconName: "AlarmClock"
        },
        {
          id: "03",
          title: "予約フォームを送信します",
          desc: "日時が決まったら、予約フォームを送信しましょう",
          detail: "特別なリクエストがある場合は、備考欄にご記入ください。運営が確認いたします。",
          iconName: "FileText"
        },
        {
          id: "04",
          title: "入金します",
          desc: "予約完了のメールが届き、集合場所の案内も届きます。",
          detail: "場所がわからない場合は、当日公式Discordでご確認いただけます。安全な決済システムを採用しています。",
          iconName: "CreditCard"
        },
        {
          id: "05",
          title: "当日を楽しみましょう",
          desc: "当日は、待ち合わせ時間までに集合場所へ行きましょう",
          detail: "キャストと素敵な時間を過ごしましょう♪ トラブルの際は運営がサポートします。",
          iconName: "PartyPopper"
        }
      ],
      areaInfo: {
        title: "キャストの主な派遣地域",
        desc: "関東地方「東京」「神奈川」「千葉」「埼玉」を中心にキャストを派遣しており、オンラインだけでも利用可能です。"
      }
    },
    pricingPage: {
      title: 'コインとメンバーシップ',
      subtitle: 'パワーアップを選択',
      description: 'お得なコインパックと会員プランで、最高のゲーム体験を。',
      mostPopular: '一番人気',
      selectPlan: '選択する',
      secureTitle: '安全な決済',
      secureDesc: 'すべての取引は暗号化され、安全に処理されます。問題が発生した場合は、24時間以内にサポートチームが対応します。',
      plans: {
        starter: {
          name: 'スターター',
          bonus: '+5% ボーナス',
          features: ['基本バッジ', 'マッチング優先度: 通常', 'DM機能']
        },
        popular: {
          name: 'プロゲーマー',
          bonus: '+10% ボーナス',
          features: ['光るプロフィール枠', 'マッチング優先度: 高', '音声自己紹介', '手数料 5% OFF']
        },
        elite: {
          name: 'エリートVIP',
          bonus: '+20% ボーナス',
          features: ['専用クラウンバッジ', 'マッチング優先度: 最高', '24時間優先サポート', '手数料 10% OFF', 'カスタムテーマ色']
        }
      }
    }
  },
  en: {
    home: 'Home',
    process: 'process',
    pricing: 'Pricing',
    castList: 'CastList',
    recruitment: 'Recruitment',
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
    },
    processFlow: {
      title: "How It Works",
      subtitle: "PROCESS FLOW",
      steps: [
        {
          id: "01",
          title: "Choose the game",
          desc: "Let’s start by choosing the game you want to play",
          detail: "Select from a wide range of titles, from popular competitive games to casual co-op.",
          iconName: "Gamepad2"
        },
        {
          id: "02",
          title: "Pick a cast & Reserve",
          desc: "Pick a cast and choose a time that works for you",
          detail: "Check ranks, skills, and plans. You can listen to voice samples on their profile.",
          iconName: "AlarmClock"
        },
        {
          id: "03",
          title: "Submit Request",
          desc: "Submit the reservation form after choosing a time",
          detail: "Include any specific requests or coaching needs in the comments section.",
          iconName: "FileText"
        },
        {
          id: "04",
          title: "Make Payment",
          desc: "Pay the confirmed fee and receive meeting details",
          detail: "You'll get a confirmation email with the location. Support is available via Discord.",
          iconName: "CreditCard"
        },
        {
          id: "05",
          title: "Enjoy the day",
          desc: "Arrive at the meeting spot on time",
          detail: "Have a wonderful time with our cast! Our support team is always on standby.",
          iconName: "PartyPopper"
        }
      ],
      areaInfo: {
        title: "Main Cast Areas",
        desc: "Mainly Tokyo, Kanagawa, Chiba, and Saitama. Online-only sessions are also available."
      }
    },
    pricingPage: {
      title: 'Coins & Membership',
      subtitle: 'Choose Your Power Up',
      description: 'Get the best value with our coin packs and membership tiers.',
      mostPopular: 'MOST POPULAR',
      selectPlan: 'Select Plan',
      secureTitle: 'SECURE PAYMENT',
      secureDesc: 'All transactions are encrypted and secured. Our support team is available 24/7 to assist with any issues.',
      plans: {
        starter: {
          name: 'Starter',
          bonus: '+5% Bonus',
          features: ['Basic Profile Badge', 'Matching Priority: Normal', 'Direct Messages']
        },
        popular: {
          name: 'Pro Gamer',
          bonus: '+10% Bonus',
          features: ['Shiny Profile Frame', 'Matching Priority: High', 'Voice Introduction', 'Fee Discount 5%']
        },
        elite: {
          name: 'Elite VIP',
          bonus: '+20% Bonus',
          features: ['Exclusive Crown Badge', 'Matching Priority: Top', '24/7 Priority Support', 'Fee Discount 10%', 'Custom Theme Color']
        }
      }
    }
  },
  zh: {
    home: '主页',
    process: '使用流程',
    pricing: '价位表',
    castList: '员工列表',
    recruitment: '员工招募',
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
    },
    processFlow: {
      title: "预约流程",
      subtitle: "HOW IT WORKS",
      steps: [
        {
          id: "01",
          title: "选择游戏",
          desc: "先选择你想玩的游戏",
          detail: "从热门大作到经典小游戏，可以在游戏列表中筛选你感兴趣的项目。",
          iconName: "Gamepad2"
        },
        {
          id: "02",
          title: "选择Cast并预约时间",
          desc: "从喜欢的Cast时间表里挑选合适的日期和时间吧",
          detail: "每款游戏下都会显示可选Cast、段位/水平和方案。建议提前查看Cast的语音介绍。",
          iconName: "AlarmClock"
        },
        {
          id: "03",
          title: "提交预约表单",
          desc: "选好时间后，填写预约表单",
          detail: "如果有特殊的游玩需求（如练习特定角色），请在备注中说明。",
          iconName: "FileText"
        },
        {
          id: "04",
          title: "付款",
          desc: "确认费用无误后即可付款，随后收到集合指引。",
          detail: "入金后会收到详细的集合地点邮件。如有不明，可随时咨询官方Discord客服。",
          iconName: "CreditCard"
        },
        {
          id: "05",
          title: "当日享受游戏",
          desc: "当天按时到达集合地点",
          detail: "和Cast一起享受美好游戏时光吧♪ 全程官方保障，安全无忧。",
          iconName: "PartyPopper"
        }
      ],
      areaInfo: {
        title: "Cast主要派遣区域",
        desc: "E-idol主要在关东地区「东京」「神奈川」「千叶」「埼玉」派遣Cast，也可以预约线上陪玩。"
      }
    },
    pricingPage: {
      title: '金币 & 会员资格',
      subtitle: '选择您的套餐',
      description: '选择最适合你的充值方案，解锁更多特权与超值金币。',
      mostPopular: '最受欢迎',
      selectPlan: '立即购买',
      secureTitle: '安全支付',
      secureDesc: '所有交易均经过加密处理，确保安全。如遇任何问题，我们的客服团队将在24小时内为您解决。',
      plans: {
        starter: {
          name: '新手包',
          bonus: '+5% 赠送',
          features: ['基础徽章', '匹配优先级: 普通', '私信功能']
        },
        popular: {
          name: '专业版',
          bonus: '+10% 赠送',
          features: ['动态头像框', '匹配优先级: 高', '语音介绍权限', '手续费 5% OFF']
        },
        elite: {
          name: '至尊版',
          bonus: '+20% 赠送',
          features: ['专属皇冠徽章', '匹配优先级: 极速', '24小时专属客服', '手续费 10% OFF', '自定义主页背景']
        }
      }
    }
  }
};
