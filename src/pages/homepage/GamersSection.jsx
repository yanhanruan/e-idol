import { Heart } from "lucide-react";
import UserCard from "@src/components/UserCard";

const GamersSection = ({ users, t, playingAudio, toggleAudio }) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex justify-center w-7 h-7 text-gray-500 animate-pulse" style={{
            filter: 'drop-shadow(0 0 5px #fff)'
          }} >
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl md:text-3xl font-black text-slate-100">{t.selectGamer}</h3>
      </div>
      <button className="text-sm text-slate-300 bg-blue-1000 border-2 border-indigo-500/70 px-2 py-2.5 rounded-full transition font-bold shadow-md hover:shadow-lg hover:scale-105">
        {t.seeMore}
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {users.map((user, idx) => (
        <UserCard
          key={idx}
          user={user}
          idx={idx}
          t={t}
          playingAudio={playingAudio}
          toggleAudio={toggleAudio}
          size='small'
        />
      ))}
    </div>
  </div>
);

export default GamersSection;