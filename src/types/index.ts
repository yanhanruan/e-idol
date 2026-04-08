export type Locale = 'ja' | 'en' | 'zh';

export type GameKey = 'apex' | 'lol' | 'valorant' | 'splatoon' | 'monsterhunter' | 'dbd';
export type GameRank = 'master' | 'diamond' | 'platinum' | 'gold';
export type ServiceContent = 'gaming' | 'chatting' | 'teaching';
export type ServiceMethod = 'online' | 'offline';
export type VoiceType = 'mature' | 'girl' | 'loli';

export interface UserGame {
  name: GameKey;
  rank: GameRank;
}

export interface UserProfile {
  name: string;
  avatar: string;
  color: string;
  online: boolean;
  games: UserGame[];
  voice: VoiceType;
  services: ServiceContent[];
  methods: ServiceMethod[];
}

export interface GameCard {
  name: string;
  image: string;
  color: string;
}

export interface FeaturedUser {
  name: string;
  username: string;
  rating: number;
  reviews: number;
  price: number;
  duration: number;
  image: string;
  bgColor: string;
  online: boolean;
}

export type TranslationValue =
  | string
  | TranslationValue[]
  | {
      [key: string]: TranslationValue;
    };

export type TranslationMap = Record<string, TranslationValue>;
export type AppTranslations = Record<Locale, TranslationMap>;
