import { Filter, Star, MessageCircle } from "lucide-react";

const FeaturedUserCard = ({ user, t }) => (
    <div className="rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-3 group" style={{
        background: 'linear-gradient(135deg, rgba(10, 20, 40, 0.6), rgba(20, 10, 40, 0.6))',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 255, 255, 0.2) inset',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 255, 0.2)'
    }}>
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
        <div className="p-5 bg-gradient-to-b ">
            <h4 className="font-bold text-xl mb-1" style={{
                fontFamily: "'Orbitron', sans-serif",
                background: 'linear-gradient(135deg, #00ffff, #0099ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))'
            }}>{user.name}</h4>
            <p className="text-xs text-slate-500 mb-3 font-medium">{user.username}</p>
            <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-slate-600 ml-2 font-bold">{user.rating}</span>
                <span className="text-xs text-slate-400">({user.reviews})</span>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50/10 to-purple-50/10 p-3 rounded-xl ">
                <div>
                    <span className="text-green-400/100 font-black text-2xl">{user.price}</span>
                    <span className="text-sm text-slate-500 ml-1 font-bold">{t.coins}</span>
                </div>
                <MessageCircle className="w-6 h-6 text-indigo-500" />
            </div>
        </div>
    </div>
);

const FeaturedUsersSection = ({ featuredUsers, sortBy, setSortBy, t }) => (
    <div>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center relative" style={{
                    background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
                    border: '2px solid rgba(0, 255, 255, 0.5)',
                    boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <Star className="w-7 h-7 text-white animate-pulse" style={{
                        filter: 'drop-shadow(0 0 5px #fff)'
                    }} />
                </div>
                <h3 className="text-xl md:text-4xl font-black" style={{
                    fontFamily: "'Orbitron', sans-serif",
                    background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 30px rgba(255, 0, 255, 0.4))'
                }}>{t.featuredUsers}</h3>
            </div>

            <div className="flex items-center space-x-3 px-4 py-2 rounded-xl" style={{
                background: 'rgba(10, 20, 40, 0.4)',
                border: '1px solid rgba(0, 255, 255, 0.2)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
                <Filter className="w-5 h-5" style={{
                    color: '#00ffff',
                    filter: 'drop-shadow(0 0 5px #00ffff)'
                }} />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none cursor-pointer transition-all" style={{
                        fontFamily: "'Roboto Mono', monospace",
                        color: '#00ffff',
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                        border: 'none'
                    }}
                >
                    <option value="weeklyPopular" style={{ background: '#0a0d1e', color: '#00ffff' }}>{t.weeklyPopular}</option>
                    <option value="newRecommend" style={{ background: '#0a0d1e', color: '#00ffff' }}>{t.newRecommend}</option>
                    <option value="mostOrders" style={{ background: '#0a0d1e', color: '#00ffff' }}>{t.mostOrders}</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-10 lg:grid-cols-4 gap-6 px-5 sm:px-0">
            {featuredUsers.map((user, idx) => (
                <FeaturedUserCard key={idx} user={user} t={t} />
            ))}
        </div>
    </div>
);

export default FeaturedUsersSection;