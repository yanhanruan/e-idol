const GamesSection = ({ games, t }) => (
  <div className="mb-12">
    
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="flex justify-center w-7 h-7 text-gray-500 animate-pulse" style={{
            filter: 'drop-shadow(0 0 5px #fff)'
          }} >
            🕹️
          </div>
        </div>
      <h3 className="text-xl md:text-3xl font-black text-slate-300">{t.gameList}</h3>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {games.map((game, idx) => (
        <div key={idx} className="flex flex-col items-center cursor-pointer group">
          <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl mb-2 group-hover:scale-110 group-hover:shadow-2xl transition border-2 border-white shadow-lg`}>
            {game.image}
          </div>
          <span className="text-xs text-slate-400 text-center truncate w-full font-bold">{game.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default GamesSection;