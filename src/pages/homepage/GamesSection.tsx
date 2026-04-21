import { Gamepad2 } from "lucide-react";
import HomepageSecTitle from "@src/components/HomepageSecTitle";
import type { GameCard, TranslationMap } from "@src/types";

interface GamesSectionProps {
  games: GameCard[];
  t: TranslationMap;
}

const GamesSection = ({ games, t }: GamesSectionProps) => (
  <div className="mb-12">
    <HomepageSecTitle
      icon={Gamepad2}
      title={t.gameList as string}
    />
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {games.map((game, idx) => (
        <div key={idx} className="flex flex-col items-center cursor-pointer group">
          <div
            className={`
              p-1 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-lg
              border-2 border-cyan-500/30 transition-smooth
              group-hover:scale-110 group-hover:shadow-2xl group-hover:border-cyan-500/55
            `}
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>
          <span className="text-xs text-slate-400 text-center truncate w-full font-bold">{game.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default GamesSection;
