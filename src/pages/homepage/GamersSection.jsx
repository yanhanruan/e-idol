import { Heart } from "lucide-react";
import UserCard from "@src/components/UserCard";
import HomepageSecTitle from "@src/components/HomepageSecTitle";

const GamersSection = ({ users, t, playingAudio, toggleAudio }) => {
  const moreButton = (
    <button className="text-sm text-slate-300 bg-blue-1000 border-2 border-indigo-500/70 px-2 py-2.5 rounded-full transition font-bold shadow-md hover:shadow-lg hover:scale-105">
      {t.seeMore}
    </button>
  );
  return(
    <div className="mb-12">
      <HomepageSecTitle
        icon={Heart}
        title={t.selectGamer}
        action={moreButton}
      />

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
}

export default GamersSection;