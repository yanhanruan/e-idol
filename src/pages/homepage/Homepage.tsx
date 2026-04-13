import { useState } from 'react';
import { useTranslations } from '@src/contexts/LanguageContext';
import { useAudioPlayer } from '@src/hooks/useAudioPlayer';
import { FEATURED_USERS_DATA, GAMES_DATA, USERS_DATA } from '@src/data/mockData';
import HeroCarousel from '../../components/HeroCarousel';
import FeaturedUsersSection from './FeaturedUsersSection';
import GamersSection from './GamersSection';
import GamesSection from './GamesSection';
import type { UserCardTranslations } from '@src/components/UserCard';
import type { GameKey, GameRank, ServiceContent, ServiceMethod } from '@src/types';

const HomePage = () => {
  const { playingAudio, toggleAudio } = useAudioPlayer();
  const { t } = useTranslations();
  const [currentSlide, setCurrentSlide] = useState(0);

  const gamersT = {
    games: t.games as Record<GameKey, string>,
    ranks: t.ranks as Record<GameRank, string>,
    serviceContent: t.serviceContent as Record<ServiceContent, string>,
    serviceMethod: t.serviceMethod as Record<ServiceMethod, string>,
    seeMore: t.seeMore as string,
    selectGamer: t.selectGamer as string,
  } satisfies UserCardTranslations & { seeMore: string; selectGamer: string };

  return (
    <>
      <HeroCarousel currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} t={t} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GamersSection users={USERS_DATA} t={gamersT} playingAudio={playingAudio} toggleAudio={toggleAudio} />
        <GamesSection games={GAMES_DATA} t={t} />
        <FeaturedUsersSection featuredUsers={FEATURED_USERS_DATA} />
      </div>
    </>
  );
};

export default HomePage;
