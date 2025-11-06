// 特色用户卡片组件
const FeaturedUserCard = ({ user, t }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition cursor-pointer border-4 border-white hover:scale-105 hover:-translate-y-1">
      <div className={`h-48 bg-gradient-to-br ${user.bgColor} flex items-center justify-center text-6xl relative`}>
        {user.image}
        {user.online && (
          <div className="absolute top-3 right-3 bg-green-400 text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1 font-bold border-2 border-white shadow-lg animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span>{t.online}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-slate-800/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1 font-bold border-2 border-white shadow-lg">
          <span>⏱️</span>
          <span>{user.duration}分</span>
        </div>
      </div>
      <div className="p-5 bg-gradient-to-b from-white to-blue-50/50">
        <h4 className="font-black text-slate-800 mb-1 text-lg">{user.name}</h4>
        <p className="text-xs text-slate-500 mb-3 font-medium">{user.username}</p>
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-sm text-slate-600 ml-2 font-bold">{user.rating}</span>
          <span className="text-xs text-slate-400">({user.reviews})</span>
        </div>
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-2xl border-2 border-indigo-200">
          <div>
            <span className="text-indigo-600 font-black text-2xl">{user.price}</span>
            <span className="text-sm text-slate-500 ml-1 font-bold">{t.coins}</span>
          </div>
          <MessageCircle className="w-6 h-6 text-indigo-500" />
        </div>
      </div>
    </div>
  );
};

export default FeaturedUserCard;