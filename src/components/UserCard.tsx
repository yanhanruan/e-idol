import { Pause, Play } from 'lucide-react';
import type { GameKey, GameRank, ServiceContent, ServiceMethod } from '../types';

export interface UserCardTranslations {
  games: Record<GameKey, string>;
  ranks: Record<GameRank, string>;
  serviceContent: Record<ServiceContent, string>;
  serviceMethod: Record<ServiceMethod, string>;
}

interface UserCardGame {
  name: GameKey;
  rank: GameRank;
}

interface UserCardUser {
  name: string;
  color: string;
  games: UserCardGame[];
  services: ServiceContent[];
  methods: ServiceMethod[];
}

interface AudioWaveButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const AudioWaveButton = ({ isPlaying, onClick }: AudioWaveButtonProps) => {
  const waveConfig = [
    { duration: '1.2s', delay: '0s' },
    { duration: '1.0s', delay: '0.15s' },
    { duration: '1.3s', delay: '0.3s' },
    { duration: '1.1s', delay: '0.15s' },
    { duration: '1.2s', delay: '0s' },
  ];

  return (
    <button onClick={onClick} className="flex px-3 py-1.5 md:px-4 md:py-2 items-center justify-center space-x-2 bg-black/50 backdrop-blur-sm text-cyan-400 rounded-md hover:scale-105 duration-300">
      <div className="relative w-4 h-4 flex-shrink-0">
        <Play className={`w-4 h-4 fill-cyan-400 text-cyan-400 transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
        <Pause className={`absolute top-0 left-0 w-4 h-4 fill-cyan-400 text-cyan-400 transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div className="flex items-center justify-center space-x-1 h-5 md:h-6">
        {waveConfig.map((bar, i) => (
          <div
            key={i}
            className="w-[3px] bg-cyan-400 rounded-sm animate-wave shadow-[0_0_5px_rgba(34,211,238,0.8)]"
            style={{
              animationDuration: bar.duration,
              animationDelay: bar.delay,
              animationPlayState: isPlaying ? 'running' : 'paused',
              animationFillMode: 'backwards',
            }}
          ></div>
        ))}
      </div>
    </button>
  );
};

interface CyberTagProps {
  children: string;
  color?: 'blue' | 'purple';
}

const CyberTag = ({ children, color = 'blue' }: CyberTagProps) => {
  const styles = {
    blue: 'text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/40',
    purple: 'text-purple-400 border-purple-500/30 hover:bg-purple-900/40',
  };

  const accentColor = color === 'blue' ? 'bg-cyan-400' : 'bg-purple-400';

  return (
    <div
      className={`
      relative flex items-center gap-1.5 
      px-2 py-0.5
      border bg-black/50 backdrop-blur-sm
      font-mono text-[10px]
      tracking-wider uppercase font-bold
      transition-all duration-300 cursor-default
      [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,0_100%)]
      ${styles[color] || styles.blue}
    `}
    >
      <span className={`w-1 h-1 block ${accentColor} shadow-[0_0_4px_currentColor]`}></span>
      {children}
    </div>
  );
};

interface UserCardProps {
  user: UserCardUser;
  idx: number;
  t: UserCardTranslations;
  playingAudio: number | string | null;
  toggleAudio: (userId: string) => void;
  size?: 'full' | 'small';
}

const UserCard = ({ user, idx, t, playingAudio, toggleAudio, size = 'full' }: UserCardProps) => (
  <div
    className={`
      group relative
      transition-transform duration-300 ease-out
      hover:scale-105
      before:inset-[6px]
      before:blur-[14px]
      before:bg-gradient-to-l
      before:from-[#7e0fff80]
      before:to-[#0fffc180]
      before:bg-[140%_140%]
      before:opacity-0
      before:transition-opacity
      before:duration-300
      hover:before:opacity-30
      hover:cursor-pointer
    `}
  >
    <div
      className={`
        ${size === 'full' ? 'user-card-full' : 'user-card-small'}
        relative z-20 
        overflow-hidden 
        rounded-[var(--card-radius)]
        border-[var(--card-border)] border-white
      `}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${user.color} opacity-30`}></div>

      <div
        className={`
          absolute top-0 left-[-150%] w-[60%] h-full
          z-5 
          bg-gradient-to-r from-transparent via-white/30 to-transparent 
          skew-x-[-30deg] blur-sm
          transition-transform duration-700
          ease-shine 
          group-hover:translate-x-[250%] 
        `}
      ></div>

      <div
        className={`
        relative z-10 
        p-[var(--card-padding-base)] 
        sm:p-[var(--card-padding-sm)] 
        lg:p-[var(--card-padding-lg)]
      `}
      >
        <div className="flex flex-col space-y-2 ">
          <div className="flex items-center space-x-3 w-full ">
            <p
              className={`
                flex-1
                text-center
                font-black text-slate-100 
                [font-size:var(--font-name-base)]
                md:[font-size:var(--font-name-md)]
              `}
            >
              {user.name}
            </p>
            <div className="flex flex-col items-center shrink-0 w-22">
              <AudioWaveButton isPlaying={playingAudio === String(idx)} onClick={() => toggleAudio(String(idx))} />
            </div>
          </div>
          <div className="space-y-3 w-full ">
            <div
              className={`
                flex flex-col justify-end bg-cover bg-center bg-no-repeat shadow-lg
                rounded-[var(--content-radius)]
                p-[var(--content-padding-base)] 
                md:p-[var(--content-padding-md)]
                h-60
                brightness-90
              `}
              style={{ backgroundImage: "url('/cyber.jpg')" }}
            >
              <div className="flex flex-wrap gap-2 w-full mb-1">
                {user.games.map((game, gIdx) => (
                  <div key={gIdx} className="flex relative group w-fit">
                    <div
                      className={`
                        relative z-10 flex items-center justify-center
                        bg-[#fce300] text-black 
                        font-black uppercase 
                        text-[10px] leading-none tracking-wider
                        px-1.5 py-1 
                        shadow-[0_0_5px_rgba(252,227,0,0.4)]
                        [clip-path:polygon(0_0,100%_0,100%_100%,4px_100%,0_calc(100%-4px))]
                        cursor-default
                      `}
                    >
                      {t.games[game.name]}
                    </div>

                    <div
                      className={`
                        flex items-center
                        bg-black/90 border-t border-b border-r border-[#fce300]/60 text-[#fce300] 
                        font-mono font-bold 
                        text-[10px] leading-none
                        px-2 py-1 
                        -ml-1.5 pl-2.5
                        [clip-path:polygon(0_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]
                      `}
                    >
                      {t.ranks[game.rank]}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-2 gap-y-1 w-full">
                {user.services.map((service, sIdx) => (
                  <CyberTag key={sIdx} color="blue">
                    {t.serviceContent[service]}
                  </CyberTag>
                ))}
                {user.methods.map((method, mIdx) => (
                  <CyberTag key={mIdx} color="purple">
                    {t.serviceMethod[method]}
                  </CyberTag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UserCard;
