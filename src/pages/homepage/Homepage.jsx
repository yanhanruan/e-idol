import React, { useState } from "react";
// Context
// 注意：HomePage 本身如果不需要翻译文字，甚至可以不调用 useTranslations，
// 但通常页面级组件可能需要 t 来传递给 Head/Meta 标签或 Hero 组件。
import { useTranslations } from "@src/contexts/LanguageContext";
import { useAudioPlayer } from "@src/hooks/useAudioPlayer";

// Data
import { FEATURED_USERS_DATA, GAMES_DATA, USERS_DATA } from "@src/data/mockData";

// Components
import HeroCarousel from "../../components/HeroCarousel";
import FeaturedUsersSection from "./FeaturedUsersSection";
import GamersSection from "./GamersSection";
import GamesSection from "./GamesSection";

const HomePage = () => {
  const { playingAudio, toggleAudio } = useAudioPlayer();
  // HeroCarousel 可能仍然需要 t，或者你也可以像改造 FeaturedUsersSection 一样改造它
  const { t } = useTranslations(); 
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <HeroCarousel 
          currentSlide={currentSlide} 
          setCurrentSlide={setCurrentSlide} 
          t={t} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* GamersSection 也可以重构为内部调用 useTranslations */}
        <GamersSection
          users={USERS_DATA}
          t={t} 
          playingAudio={playingAudio}
          toggleAudio={toggleAudio}
        />

        {/* GamesSection 也可以重构 */}
        <GamesSection games={GAMES_DATA} t={t} />

        <FeaturedUsersSection featuredUsers={FEATURED_USERS_DATA} />
      </div>
    </>
  );
};

export default HomePage;