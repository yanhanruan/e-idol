import type { GameKey, GameRank, ServiceContent, ServiceMethod } from '../types';
import AudioWaveButton from './ui/AudioWaveButton';
import CyberTag from './ui/CyberTag';

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
      before:blur-glow
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
                font-black text-content-primary 
                [font-size:var(--font-name-base)]
                md:[font-size:var(--font-name-md)]
                line-clamp-2  
                break-words
                text-balance
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
                        text-2xs leading-none tracking-wider
                        px-1.5 py-1      
                        clip-chamfer-bl
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
                        text-2xs leading-none
                        px-2 py-1 
                        -ml-1.5 pl-2.5
                        clip-chamfer-br
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
