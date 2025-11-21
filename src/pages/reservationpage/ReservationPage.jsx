import { useState } from 'react';
import { Calendar, Clock, Mail, Phone, User, MapPin, Gamepad2, Heart, Info } from 'lucide-react';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    game: '',
    cast: '',
    dateFirst: '',
    timeFirst: '',
    dateSecond: '',
    timeSecond: '',
    dateThird: '',
    timeThird: '',
    location: '',
    plan: '',
    photoOption: false,
    agreed: false
  });

  const [showGameDropdown, setShowGameDropdown] = useState(false);
  const [showCastDropdown, setShowCastDropdown] = useState(false);

  const games = [
    'Apex Legends',
    'Valorant',
    'League of Legends',
    'スプラトゥーン3',
    'Dead by Daylight',
    'モンスターハンター',
    'その他'
  ];

  const casts = [
    '山田 花子',
    '佐藤 美咲',
    '田中 あかり',
    '鈴木 さくら',
    '指名なし'
  ];

  const plans = [
    {
      id: 'online',
      name: 'オンライン通話プラン',
      price: '1時間 3,000円〜',
      desc: 'Discord・LINE通話でゲームや雑談'
    },
    {
      id: 'offline',
      name: 'オフライン対面プラン',
      price: '2時間 8,000円〜',
      desc: 'カフェやゲームセンターで実際にお会いします'
    },
    {
      id: 'coaching',
      name: '技術指導プラン',
      price: '1時間 4,500円〜',
      desc: 'ゲームスキル向上のためのコーチング'
    },
    {
      id: 'date',
      name: '恋人気分プラン',
      price: '2時間 12,000円〜',
      desc: 'デート感覚で楽しむ特別なひととき'
    },
    {
      id: 'casual',
      name: '通常エンジョイプラン',
      price: '2時間 6,000円〜',
      desc: '気軽にゲームや会話を楽しむ'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('禁止事項・利用規約をご確認の上、同意してください。');
      return;
    }
    console.log('Form submitted:', formData);
    alert('ご予約を承りました。確認メールをお送りしますので、しばらくお待ちください。');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light text-slate-800 mb-3">ご予約フォーム</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            お客様の大切な時間を安心してお過ごしいただけるよう、<br />
            丁寧にご対応させていただきます。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
          
          {/* 1. お名前 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <User size={16} className="text-slate-400" />
              お名前<span className="text-rose-400 text-xs ml-1">必須</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="ゲームネームでも構いません"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition text-sm"
            />
          </div>

          {/* 2. Mail */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Mail size={16} className="text-slate-400" />
              メールアドレス<span className="text-rose-400 text-xs ml-1">必須</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="example@gmail.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition text-sm"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-slate-700 leading-relaxed">
              <Info size={14} className="inline mr-1 text-blue-500" />
              <span className="font-medium">info@e-idol.net</span> からのご案内メールが届きます。<br />
              受信できるよう、ドメイン指定解除をお願いいたします。
            </div>
          </div>

          {/* 3. 携帯番号 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Phone size={16} className="text-slate-400" />
              携帯電話番号<span className="text-slate-400 text-xs ml-1">任意</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="090-1234-5678"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition text-sm"
            />
            <p className="text-xs text-slate-600 leading-relaxed">
              当日の緊急連絡（遅刻・迷子など）のためのみ使用します。<br />
              <span className="text-amber-600">※ 携帯番号でご登録いただくと、次回使える割引クーポンをプレゼント！</span>
            </p>
          </div>

          {/* 4. 希望ゲーム */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Gamepad2 size={16} className="text-slate-400" />
              希望ゲーム<span className="text-rose-400 text-xs ml-1">必須</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.game}
                onChange={(e) => setFormData({...formData, game: e.target.value})}
                onFocus={() => setShowGameDropdown(true)}
                placeholder="ゲーム名を入力、または選択してください"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition text-sm"
              />
              {showGameDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {games.map((game) => (
                    <button
                      key={game}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, game});
                        setShowGameDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 transition"
                    >
                      {game}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 5. 希望キャスト */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Heart size={16} className="text-slate-400" />
              希望キャスト<span className="text-slate-400 text-xs ml-1">任意</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cast}
                onChange={(e) => setFormData({...formData, cast: e.target.value})}
                onFocus={() => setShowCastDropdown(true)}
                placeholder="キャスト名を入力、または選択してください"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition text-sm"
              />
              {showCastDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {casts.map((cast) => (
                    <button
                      key={cast}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, cast});
                        setShowCastDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-indigo-50 transition"
                    >
                      {cast}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-600">
              フルネームでのご記入を推奨します。複数名の指定も可能です。
            </p>
          </div>

          {/* 6. 待ち合わせ日時 */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Calendar size={16} className="text-slate-400" />
              待ち合わせ希望日時<span className="text-rose-400 text-xs ml-1">必須</span>
            </label>
            
            {/* 第一希望 */}
            <div className="bg-slate-50 rounded-md p-4 space-y-3">
              <p className="text-xs font-medium text-slate-700">第一希望</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">日付</label>
                  <input
                    type="date"
                    required
                    value={formData.dateFirst}
                    onChange={(e) => setFormData({...formData, dateFirst: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">時間</label>
                  <input
                    type="time"
                    required
                    value={formData.timeFirst}
                    onChange={(e) => setFormData({...formData, timeFirst: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 第二希望 */}
            <div className="bg-slate-50 rounded-md p-4 space-y-3">
              <p className="text-xs font-medium text-slate-600">第二希望（任意）</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">日付</label>
                  <input
                    type="date"
                    value={formData.dateSecond}
                    onChange={(e) => setFormData({...formData, dateSecond: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">時間</label>
                  <input
                    type="time"
                    value={formData.timeSecond}
                    onChange={(e) => setFormData({...formData, timeSecond: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 第三希望 */}
            <div className="bg-slate-50 rounded-md p-4 space-y-3">
              <p className="text-xs font-medium text-slate-600">第三希望（任意）</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">日付</label>
                  <input
                    type="date"
                    value={formData.dateThird}
                    onChange={(e) => setFormData({...formData, dateThird: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">時間</label>
                  <input
                    type="time"
                    value={formData.dateThird}
                    onChange={(e) => setFormData({...formData, timeThird: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 7. 待ち合わせ場所 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin size={16} className="text-slate-400" />
              待ち合わせ場所<span className="text-rose-400 text-xs ml-1">必須</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="渋谷駅周辺、新宿エリアなど"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition text-sm"
            />
            <p className="text-xs text-slate-600 leading-relaxed">
              ご都合の良いおおまかな駅名・エリアをご記入ください。<br />
              具体的な住所はキャスト決定後、メールでご案内します。
            </p>
          </div>

          {/* 8. プラン選択 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 block">
              プラン選択<span className="text-rose-400 text-xs ml-1">必須</span>
            </label>
            <div className="space-y-2">
              {plans.map((plan) => (
                <label
                  key={plan.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.plan === plan.id
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={formData.plan === plan.id}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    className="mr-3"
                    required
                  />
                  <span className="font-medium text-slate-800 text-sm">{plan.name}</span>
                  <span className="text-indigo-600 text-xs ml-2">{plan.price}</span>
                  <p className="text-xs text-slate-600 mt-1 ml-6">{plan.desc}</p>
                </label>
              ))}
            </div>

            {/* 写真オプション */}
            <div className="border-t pt-4 mt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.photoOption}
                  onChange={(e) => setFormData({...formData, photoOption: e.target.checked})}
                  className="mt-1"
                />
                <div className="text-sm">
                  <p className="font-medium text-slate-700">合写オプション</p>
                  <p className="text-xs text-slate-600">2枚 3,000円（SNS掲載可）</p>
                </div>
              </label>
            </div>
          </div>

          {/* 9. 禁止事項 */}
          <div className="space-y-3 bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-amber-900">重要事項 ※</h3>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2">
              <p className="font-medium text-red-600">【注意】デート中にお酒/タバコ/不健康・パパ活/店舗ですぐない・などのお誘が出た時点でデートは終了とさせていただきます。サイトに記載される禁止事項・利用規約をよくお読んでおいてください。</p>
              <div className="bg-white rounded p-3 space-y-1 mt-3">
                <p>⚠️ We are very sorry, but our customer support is available only in Japanese language.</p>
                <p>⚠️ 2025.1.1〜事務手数料1件500円（税別）が加算されます。</p>
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                required
                checked={formData.agreed}
                onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                className="mt-1"
              />
              <span className="text-xs text-slate-700">
                禁止事項・利用規約を守ります。<span className="text-rose-500">（利用不可）</span>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-3.5 rounded-lg transition shadow-md hover:shadow-lg"
          >
            予約を送信する
          </button>

          <p className="text-center text-xs text-slate-500 mt-4">
            送信後、確認メールが届きます。<br />
            数日以内にスタッフよりご連絡いたします。
          </p>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;