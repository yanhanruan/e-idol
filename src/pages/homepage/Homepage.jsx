import { useTranslations } from "@src/contexts/LanguageContext";
import { FEATURED_USERS_DATA, GAMES_DATA, USERS_DATA } from "@src/data/mockData";
import { useAudioPlayer } from "@src/hooks/useAudioPlayer";
import { useState } from "react";

import HeroCarousel from "../../components/HeroCarousel";
import FeaturedUsersSection from "./FeaturedUsersSection";
import GamersSection from "./GamersSection";
import GamesSection from "./GamesSection";

const HomePage = () => {
   
  const [sortBy, setSortBy] = useState('weeklyPopular');
  const { playingAudio, toggleAudio } = useAudioPlayer();
  const { t } = useTranslations(); 
  const [currentSlide, setCurrentSlide] = useState(0);

    return(
        <>
        <HeroCarousel currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} t={t} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <GamersSection
                  users={USERS_DATA}
                  t={t}
                  playingAudio={playingAudio}
                  toggleAudio={toggleAudio}
                />
                <GamesSection games={GAMES_DATA} t={t} />
                <FeaturedUsersSection
                  featuredUsers={FEATURED_USERS_DATA}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  t={t}
                />
              </div>
        </>
    );
};

export default HomePage