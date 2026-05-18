import { useEffect, useMemo, useState } from 'react';
import { Search, Star, Users } from 'lucide-react';
import { useTranslations } from '../contexts/LanguageContext';
import type { TranslationMap } from '../types';
import PageTitle from '@src/components/ui/PageTitle';
import CyberButton from '@src/components/ui/CyberButton';
import CyberInput from '@src/components/ui/CyberInput';
import CyberSelect from '@src/components/ui/CyberSelect';
import CyberTag from '@src/components/ui/CyberTag';
import AudioWaveButton from '@src/components/ui/AudioWaveButton';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CastGame {
  name: string;
  rank: string;
  icon: string;
}

interface CastReview {
  user: string;
  comment: string;
  rating: number;
}

interface CastSupporter {
  name: string;
  amount: number;
}

interface CastProfile {
  id: number;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  totalOrders: number;
  price: number;
  isOnline: boolean;
  isFeatured: boolean;
  bio: string;
  voiceUrl: string;
  games: CastGame[];
  availableSlots: string[];
  tags: string[];
  reviews: CastReview[];
  topSupporters: CastSupporter[];
}

type SortBy = 'featured' | 'rating' | 'orders' | 'price';

// ─── Static data ──────────────────────────────────────────────────────────────

const MOCK_CASTS: CastProfile[] = [
  {
    id: 1,
    name: 'Sakura',
    avatar: 'https://t4.ftcdn.net/jpg/04/42/49/59/240_F_442495911_Cgw0Hi96euYZTYLVcS5DStoiWcI2yVaS.jpg',
    title: 'プロゲーマー',
    rating: 4.9,
    totalOrders: 1247,
    price: 3000,
    isOnline: true,
    isFeatured: true,
    bio: 'こんにちは！Sakuraです。楽しくゲームしましょう♪ 初心者の方も大歓迎です！',
    voiceUrl: '/audio/sakura_intro.mp3',
    games: [
      { name: 'Apex', rank: 'マスター', icon: '🎯' },
      { name: 'VALORANT', rank: 'イモータル', icon: '🔫' },
    ],
    availableSlots: ['10:00-12:00', '14:00-18:00', '20:00-23:00'],
    tags: ['優しい', '上手い', '面白い'],
    reviews: [
      { user: 'Player123', comment: 'とても楽しかったです！また予約します', rating: 5 },
      { user: 'GamerX', comment: '丁寧に教えてくれました', rating: 5 },
    ],
    topSupporters: [
      { name: 'User_A', amount: 50000 },
      { name: 'User_B', amount: 35000 },
      { name: 'User_C', amount: 28000 },
    ],
  },
  {
    id: 2,
    name: 'Ryu',
    avatar: 'https://t4.ftcdn.net/jpg/18/95/16/01/240_F_1895160187_mTM0kdt5q5zKClIJ3FqOs5UNj9hOLiJc.jpg',
    title: 'ベテランプレイヤー',
    rating: 4.8,
    totalOrders: 892,
    price: 2500,
    isOnline: false,
    isFeatured: false,
    bio: 'FPSゲーム専門！一緒にランク上げましょう',
    voiceUrl: '/audio/ryu_intro.mp3',
    games: [
      { name: 'Apex', rank: 'ダイヤ', icon: '🎯' },
      { name: 'LoL', rank: 'プラチナ', icon: '⚔️' },
    ],
    availableSlots: ['19:00-22:00', '22:00-24:00'],
    tags: ['戦略的', '冷静', '経験豊富'],
    reviews: [
      { user: 'Nova', comment: '戦術を学べました', rating: 5 },
      { user: 'Echo', comment: 'プロの動きを見れて勉強になった', rating: 4 },
    ],
    topSupporters: [
      { name: 'User_D', amount: 42000 },
      { name: 'User_E', amount: 31000 },
      { name: 'User_F', amount: 19000 },
    ],
  },
  {
    id: 3,
    name: 'Miku',
    avatar: 'https://t4.ftcdn.net/jpg/10/32/25/13/240_F_1032251378_okkWFLdhJ72BTsd607TUbcFPjPd5QXXE.jpg',
    title: 'アイドルゲーマー',
    rating: 5.0,
    totalOrders: 2156,
    price: 4000,
    isOnline: true,
    isFeatured: true,
    bio: '歌って踊れるゲーマーです！一緒に楽しみましょう🎵',
    voiceUrl: '/audio/miku_intro.mp3',
    games: [
      { name: 'スプラ3', rank: 'X', icon: '🦑' },
      { name: 'モンハン', rank: 'HR999', icon: '🐲' },
    ],
    availableSlots: ['12:00-15:00', '18:00-21:00'],
    tags: ['元気', '可愛い', '楽しい'],
    reviews: [
      { user: 'StarFan', comment: '最高の時間でした！', rating: 5 },
      { user: 'Luna', comment: '癒やされました♪', rating: 5 },
    ],
    topSupporters: [
      { name: 'User_G', amount: 120000 },
      { name: 'User_H', amount: 95000 },
      { name: 'User_I', amount: 67000 },
    ],
  },
  {
    id: 4,
    name: 'Ken',
    avatar: 'https://t4.ftcdn.net/jpg/09/39/91/95/240_F_939919517_RvZaSETts022mye2ijWcZmmlr8TaOmqH.jpg',
    title: 'コーチング専門',
    rating: 4.7,
    totalOrders: 634,
    price: 2800,
    isOnline: true,
    isFeatured: false,
    bio: 'ランクアップをサポートします。分析と指導が得意です',
    voiceUrl: '/audio/ken_intro.mp3',
    games: [
      { name: 'VALORANT', rank: 'ダイヤ', icon: '🔫' },
      { name: 'LoL', rank: 'マスター', icon: '⚔️' },
    ],
    availableSlots: ['15:00-18:00', '21:00-24:00'],
    tags: ['論理的', '親切', '指導上手'],
    reviews: [
      { user: 'Rookie', comment: 'ランクが2つ上がりました', rating: 5 },
      { user: 'Silver', comment: 'わかりやすい説明でした', rating: 4 },
    ],
    topSupporters: [
      { name: 'User_J', amount: 38000 },
      { name: 'User_K', amount: 29000 },
      { name: 'User_L', amount: 21000 },
    ],
  },
  {
    id: 5,
    name: 'Yuki',
    avatar: 'https://t3.ftcdn.net/jpg/17/60/96/24/240_F_1760962410_x13fCh7ubp0sv905CLljtnk3KidYYQbp.jpg',
    title: '新人キャスト',
    rating: 4.6,
    totalOrders: 156,
    price: 2000,
    isOnline: false,
    isFeatured: false,
    bio: '初めてですが頑張ります！よろしくお願いします',
    voiceUrl: '/audio/yuki_intro.mp3',
    games: [
      { name: 'Apex', rank: 'プラチナ', icon: '🎯' },
      { name: 'DbD', rank: 'レッド', icon: '👻' },
    ],
    availableSlots: ['13:00-17:00'],
    tags: ['新人', '頑張り屋', '初心者歓迎'],
    reviews: [
      { user: 'NewGamer', comment: '一生懸命でした', rating: 5 },
      { user: 'Casual', comment: '楽しかったです', rating: 4 },
    ],
    topSupporters: [
      { name: 'User_M', amount: 15000 },
      { name: 'User_N', amount: 12000 },
      { name: 'User_O', amount: 8000 },
    ],
  },
  {
    id: 6,
    name: 'Hana',
    avatar: 'https://t4.ftcdn.net/jpg/13/51/78/85/240_F_1351788581_arGhhm0CRbHKN6npTYc3gbPc8KhKapua.jpg',
    title: 'チャット専門',
    rating: 4.9,
    totalOrders: 1543,
    price: 1500,
    isOnline: true,
    isFeatured: true,
    bio: 'お話し相手が欲しい方へ。リラックスできる時間を提供します',
    voiceUrl: '/audio/hana_intro.mp3',
    games: [
      { name: 'マイクラ', rank: '建築家', icon: '🏗️' },
      { name: 'あつ森', rank: '5つ星', icon: '🌴' },
    ],
    availableSlots: ['11:00-14:00', '16:00-20:00'],
    tags: ['癒し系', '聞き上手', '優しい'],
    reviews: [
      { user: 'Lonely', comment: '心が軽くなりました', rating: 5 },
      { user: 'Tired', comment: '癒やされる声です', rating: 5 },
    ],
    topSupporters: [
      { name: 'User_P', amount: 88000 },
      { name: 'User_Q', amount: 72000 },
      { name: 'User_R', amount: 55000 },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-3">
    <span className="text-xs font-semibold text-content-muted tracking-wider uppercase">{title}</span>
  </div>
);

interface CastCardProps {
  cast: CastProfile;
  isPlaying: boolean;
  onSelect: () => void;
  onToggleAudio: () => void;
  t: TranslationMap;
}

const CastCard = ({ cast, isPlaying, onSelect, onToggleAudio, t }: CastCardProps) => (
  // group/card — named group so CyberButton's internal group-hover is NOT triggered by card hover
  <div className="group/card bg-cyber-surface/40 border border-cyber-border rounded-2xl overflow-hidden hover:border-primary-cyan400/30 transition-all duration-300 hover:shadow-neon-cyan">
    {/* Fixed-height portrait — shorter on mobile for compact 2-col grid */}
    <div className="relative h-36 md:h-44 overflow-hidden">
      <img
        src={cast.avatar}
        alt={cast.name}
        className="w-full h-full object-cover object-top group-hover/card:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-base/80 via-cyber-base/10 to-transparent" />

      {/* Featured badge */}
      {cast.isFeatured && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-cyber-glass backdrop-blur-sm border border-primary-aqua/60 px-2.5 py-1 rounded-full shadow-neon-cyan">
          <span className="w-1 h-1 rounded-full bg-primary-aqua animate-pulse flex-shrink-0" />
          <span className="text-2xs font-bold text-primary-aqua tracking-widest uppercase leading-none">{t.featuredBadge as string}</span>
        </div>
      )}

      {cast.isOnline && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-cyber-base/60 backdrop-blur-sm border border-primary-cyan400/30 px-1.5 py-0.5 rounded-full">
          <div className="w-1.5 h-1.5 bg-primary-cyan400 rounded-full animate-pulse" />
          <span className="text-2xs font-mono text-primary-cyan400">LIVE</span>
        </div>
      )}

      <div
        className="absolute bottom-2 right-2"
        onClick={(e) => { e.stopPropagation(); onToggleAudio(); }}
      >
        <AudioWaveButton isPlaying={isPlaying} onClick={() => {}} />
      </div>
    </div>

    {/* Info */}
    <div className="p-3 flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-content-primary group-hover/card:text-primary-cyan300 transition-colors truncate">
          {cast.name}
        </h3>
        <span className="text-sm font-bold text-primary-cyan400 flex-shrink-0">¥{cast.price.toLocaleString()}</span>
      </div>

      {/* Title + star rating on same row */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-2xs text-content-muted truncate flex-1 min-w-0">{cast.title}</p>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Star size={13} className="fill-accent-yellow text-accent-yellow" />
          <span className="text-xs font-semibold text-content-secondary">{cast.rating}</span>
        </div>
      </div>

      {cast.games[0] && (
        <span className="w-fit text-2xs font-mono bg-cyber-base border border-cyber-border px-2 py-0.5 rounded text-content-muted">
          {cast.games[0].name}&nbsp;·&nbsp;{cast.games[0].rank}
        </span>
      )}

      <div className="flex flex-wrap gap-1">
        {cast.tags.map((tag, i) => (
          <CyberTag key={i} color="blue">{tag}</CyberTag>
        ))}
      </div>

      <CyberButton text={t.reserve as string} className="w-full mt-1" onClick={onSelect} />
    </div>
  </div>
);

interface CastDetailModalProps {
  cast: CastProfile;
  onClose: () => void;
  t: TranslationMap;
}

const SUPPORTER_RANK_COLOR = ['text-accent-yellow', 'text-content-secondary', 'text-content-muted'] as const;

const CastDetailModal = ({ cast, onClose, t }: CastDetailModalProps) => (
  <div
    className="fixed inset-0 bg-cyber-base/80 backdrop-blur-sm z-max flex items-center justify-center p-6"
    onClick={onClose}
  >
    <div
      className="relative bg-cyber-panel border border-cyber-border rounded-2xl w-full max-w-3xl max-h-[90vh] md:max-h-[78vh] flex flex-col md:flex-row overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-cyber-surface/80 hover:bg-cyber-surface rounded-full flex items-center justify-center text-content-muted hover:text-content-primary transition-colors"
      >
        ✕
      </button>

      {/* ── Left: portrait card + desktop CTA ── */}
      <div className="flex-shrink-0 md:w-52 flex flex-col">
        <div className="relative h-48 md:h-auto md:aspect-[3/4] overflow-hidden">
          <img src={cast.avatar} alt={cast.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-panel/60 via-transparent to-transparent" />
          {cast.isOnline && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-cyber-base/70 backdrop-blur-sm border border-primary-cyan400/40 px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-primary-cyan400 rounded-full animate-pulse" />
              <span className="text-2xs font-mono font-bold text-primary-cyan400 tracking-wider">LIVE</span>
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col gap-3 p-4 border-t border-cyber-border mt-auto">
          <CyberButton text={t.reserveCast as string} className="w-full" />
        </div>
      </div>

      {/* ── Right: scrollable content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-5 border-t border-cyber-border md:border-t-0 md:border-l">
        {/* Name / profession / key stats */}
        <div className="mb-5 pr-8">
          <h2 className="text-xl font-black text-content-primary leading-tight">{cast.name}</h2>
          <p className="text-xs text-content-muted tracking-wider mt-0.5 mb-3">{cast.title}</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Star size={15} className="fill-accent-yellow text-accent-yellow" />
              <span className="text-sm font-bold text-content-primary">{cast.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-content-muted">
              <Users size={13} />
              <span className="text-xs">{cast.totalOrders}件</span>
            </div>
            <span className="text-base font-black text-primary-cyan400 ml-auto">¥{cast.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-5">
          <SectionHeader title={t.bioTitle as string} />
          <p className="text-content-secondary text-sm leading-relaxed">{cast.bio}</p>
        </div>

        {/* Games */}
        <div className="mb-5">
          <SectionHeader title={t.gamesTitle as string} />
          <div className="grid grid-cols-2 gap-2">
            {cast.games.map((game, i) => (
              <div key={i} className="flex items-center gap-3 bg-cyber-base/40 border border-cyber-border rounded-xl p-3">
                <span className="text-lg">{game.icon}</span>
                <div>
                  <p className="text-xs font-bold text-content-primary">{game.name}</p>
                  <p className="text-2xs text-content-muted font-mono mt-0.5">{game.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available slots */}
        <div className="mb-5">
          <SectionHeader title={t.slotsTitle as string} />
          <div className="flex flex-wrap gap-2">
            {cast.availableSlots.map((slot, i) => (
              <span key={i} className="px-3 py-1.5 bg-status-success/10 border border-status-success/20 rounded-lg text-status-success text-xs font-mono">
                {slot}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-5">
          <SectionHeader title={t.reviewsTitle as string} />
          <div className="space-y-2">
            {cast.reviews.map((review, i) => (
              <div key={i} className="bg-cyber-base/30 border border-cyber-border rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-content-primary">{review.user}</span>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} size={13} className="fill-accent-yellow text-accent-yellow" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supporters — 3-column data cards */}
        <div className="mb-5">
          <SectionHeader title={t.supportersTitle as string} />
          <div className="grid grid-cols-3 gap-2">
            {cast.topSupporters.map((supporter, i) => (
              <div key={i} className="bg-cyber-base/40 border border-cyber-border rounded-xl p-3 flex flex-col items-center gap-1">
                <span className={`text-xs font-black font-mono ${SUPPORTER_RANK_COLOR[i] ?? SUPPORTER_RANK_COLOR[2]}`}>
                  #{i + 1}
                </span>
                <p className="text-2xs text-content-muted font-mono truncate w-full text-center">{supporter.name}</p>
                <p className="text-sm font-bold text-primary-cyan400">¥{supporter.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden">
          <CyberButton text={t.reserveCast as string} className="w-full" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const CastListPage = () => {
  const { t } = useTranslations();
  const [selectedCast, setSelectedCast] = useState<CastProfile | null>(null);
  const [filterOnline, setFilterOnline] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingCastId, setPlayingCastId] = useState<number | null>(null);

  const toggleAudio = (castId: number) => setPlayingCastId((prev) => (prev === castId ? null : castId));

  // Page-scoped translations — all CastListPage-specific keys live under this namespace
  const p = t.castListPage as TranslationMap;

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = selectedCast ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedCast]);

  const sortOptions = useMemo<{ value: SortBy; label: string }[]>(
    () => [
      { value: 'featured', label: p.sortFeatured as string },
      { value: 'rating', label: p.sortRating as string },
      { value: 'orders', label: p.sortOrders as string },
      { value: 'price', label: p.sortPrice as string },
    ],
    [p],
  );

  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? '';

  const filteredCasts = MOCK_CASTS.filter((cast) => !filterOnline || cast.isOnline)
    .filter(
      (cast) =>
        !searchQuery ||
        cast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cast.games.some((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortBy === 'featured') return Number(b.isFeatured) - Number(a.isFeatured);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

  return (
    <>
      <div className="min-h-screen text-content-primary pb-16 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-cyan/10 rounded-full blur-ambient-lg" />
          <div className="absolute bottom-1/4 -left-12 w-80 h-80 bg-primary-neonPurple/10 rounded-full blur-ambient-md" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* ── Hero header ── */}
          <PageTitle title={t.castList as string} comment={p.subtitle as string} />

          {/* Hairline separator */}
          <div className="h-px mb-5 bg-gradient-to-r from-transparent via-primary-cyan400/20 to-transparent" />

          {/* ── Controls bar — constrained width on desktop ── */}
          <div className="max-w-2xl mx-auto flex items-center gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={14} />
              <CyberInput
                variant="glass"
                rounded="full"
                placeholder={p.searchPlaceholder as string}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 py-2 md:py-1.5 font-sans font-medium text-slate-300 placeholder:text-slate-500"
                containerClassName="w-full"
              />
            </div>

            <button
              onClick={() => setFilterOnline(!filterOnline)}
              className={`flex items-center gap-1.5 px-4 py-2 md:py-1.5 rounded-full text-xs font-sans font-medium tracking-wider flex-shrink-0 backdrop-blur-md border transition-[background-color,border-color,box-shadow,color] duration-300 ease-in-out ${
                filterOnline
                  ? 'bg-primary-cyan/10 border-primary-cyan400/40 text-primary-cyan400 shadow-neon-cyan'
                  : 'bg-cyber-glass border-cyber-border text-slate-300 hover:bg-cyber-surface hover:border-cyan-500/30 hover:shadow-neon-cyan hover:text-cyan-50'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300 ${filterOnline ? 'bg-primary-cyan400 animate-pulse' : 'bg-slate-500'}`} />
              {t.online as string}
            </button>

            <CyberSelect
              value={sortBy}
              label={currentSortLabel}
              options={sortOptions}
              onChange={(val) => setSortBy(val as SortBy)}
            />
          </div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {filteredCasts.map((cast) => (
              <CastCard
                key={cast.id}
                cast={cast}
                isPlaying={playingCastId === cast.id}
                onSelect={() => setSelectedCast(cast)}
                onToggleAudio={() => toggleAudio(cast.id)}
                t={p}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal outside relative z-10 — escapes stacking context, covers sticky header */}
      {selectedCast && (
        <CastDetailModal
          cast={selectedCast}
          onClose={() => setSelectedCast(null)}
          t={p}
        />
      )}
    </>
  );
};

export default CastListPage;
