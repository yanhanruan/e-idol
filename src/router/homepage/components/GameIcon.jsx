// 游戏图标组件
const GameIcon = ({ game }) => {
  return (
    <div className="flex flex-col items-center cursor-pointer group">
      <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:scale-110 group-hover:shadow-2xl transition border-2 border-white shadow-lg`}>
        {game.image}
      </div>
      <span className="text-xs text-slate-700 text-center truncate w-full font-bold">{game.name}</span>
    </div>
  );
};

export default GameIcon;