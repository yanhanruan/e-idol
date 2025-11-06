const GamerCard = ({ user, idx, t, playingAudio, toggleAudio }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition cursor-pointer border-4 border-white hover:scale-105 mx-6">
      {/* 背景图 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${user.color} opacity-60`}></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      {/* 内容区 */}
      <div className="relative z-10 p-3 sm:p-5 lg:p-6">
        {/* 上半部分：左右布局 */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 items-start ">
          {/* 左侧：头像和声音 */}
          <div className="flex justify-between w-full">
            <div className="flex justify-center relative mb-3">
              <div className={`w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br ${user.color} rounded-full flex items-center justify-center text-4xl md:text-5xl border-4 border-white shadow-2xl`}>
                {user.avatar}
              </div>
              {user.online && (
                <div className="absolute -top-0 -right-0 md:-top-1 md:-right-1 w-5 h-5 md:w-7 md:h-7 bg-green-400 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
              )}
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-black text-slate-800 mb-2">{user.name}</p>

              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => toggleAudio(idx)}
                  className="flex px-3 py-1.5 md:px-4 md:py-2 items-center justify-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 w-full"
                >
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Play
                      className={`w-4 h-4 fill-white transition-opacity duration-300 ease-in-out ${playingAudio === idx ? 'opacity-0' : 'opacity-100'
                        }`}
                    />
                    <Pause
                      className={`absolute top-0 left-0 w-4 h-4 fill-white transition-opacity duration-300 ease-in-out ${playingAudio === idx ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                  </div>

                  <div className="flex items-center justify-center space-x-1 h-5 md:h-6">
                    {[
                      { duration: '1.2s', delay: '0s' },
                      { duration: '1.0s', delay: '0.15s' },
                      { duration: '1.3s', delay: '0.3s' },
                      { duration: '1.1s', delay: '0.15s' },
                      { duration: '1.2s', delay: '0s' },
                    ].map((bar, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-wave"
                        style={{
                          animationDuration: bar.duration,
                          animationDelay: bar.delay,
                          animationPlayState: playingAudio === idx ? 'running' : 'paused',
                          animationFillMode: 'backwards',
                        }}
                      ></div>
                    ))}
                  </div>
                </button>
              </div>

            </div>
          </div>
          {/* 游戏和段位以及摄影 */}
          <div className=" space-y-3 w-full" >
            <div className="flex flex-col justify-end min-h-[300px] bg-cover bg-center bg-no-repeat backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-lg" style={{ backgroundImage: "url('./filter.png')" }}>
              <div className="flex flex-wrap gap-1 md:gap-2 ">
                {user.games.map((game, gIdx) => (
                  <div key={gIdx} className="flex items-center justify-between  gap-1">
                    <span className="text-[10px] md:text-xs md:sm font-bold text-slate-800">{t.games[game.name]}</span>
                    <span className="text-[10px] md:text-xs font-bold text-indigo-600 bg-white/50 px-2 py-1 md:px-3 md:py-1 rounded-full shadow">
                      {t.ranks[game.rank]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 w-full">
                {user.services.map((service, sIdx) => (
                  <span
                    key={sIdx}
                    className="bg-gradient-to-r from-blue-100/50 to-cyan-100/50 text-slate-700 px-1.5 py-1 rounded-full text-[10px] md:text-xs font-bold border-2 border-blue-200/50 shadow-sm"
                  >
                    {t.serviceContent[service]}
                  </span>
                ))}

                {user.methods.map((method, mIdx) => (
                  <span
                    key={mIdx}
                    className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 text-slate-700 px-1.5 py-1 rounded-full text-[10px] md:text-xs font-bold border-2 border-purple-200/50 shadow-sm"
                  >
                    {t.serviceMethod[method]}
                  </span>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default GamerCard;