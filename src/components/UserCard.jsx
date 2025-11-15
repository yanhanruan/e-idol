import { Play,Pause } from "lucide-react";

const AudioWaveButton = ({ isPlaying, onClick }) => {
  const waveConfig = [
    { duration: '1.2s', delay: '0s' },
    { duration: '1.0s', delay: '0.15s' },
    { duration: '1.3s', delay: '0.3s' },
    // { duration: '1.1s', delay: '0.15s' },
    // { duration: '1.2s', delay: '0s' },
  ];

  return (
    <button
      onClick={onClick}
      className="flex px-3 py-1.5 md:px-4 md:py-2 items-center justify-center space-x-1 bg-gradient-to-r opacity-80 from-pink-400 to-purple-400 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 w-full"
    >
      <div className="relative w-4 h-4 flex-shrink-0">
        <Play className={`w-4 h-4 fill-white transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
        <Pause className={`absolute top-0 left-0 w-4 h-4 fill-white transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div className="flex items-center justify-center space-x-1 h-5 md:h-6">
        {waveConfig.map((bar, i) => (
          <div
            key={i}
            className="w-1 bg-white rounded-full animate-wave"
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

const Tag = ({ children, color = "blue", paddingType = "service" }) => {
  // 颜色查找表
  const colors = {
    blue: "from-blue-100/70 to-cyan-100/70 border-blue-200/70",
    purple: "from-purple-100/70 to-pink-100/70 border-purple-200/70",
  };

  // 根据 paddingType 选择不同的 padding 变量
  const paddingClasses = {
    service: "px-[var(--service-tag-px)] py-[var(--service-tag-py)]",
    rank: "px-[var(--rank-tag-px-base)] py-[var(--rank-tag-py)] md:px-[var(--rank-tag-px-md)]",
  };

  return (
    <span
      className={`
        text-slate-200
        font-extrabold
        ${paddingType === 'rank' ? paddingClasses.rank : paddingClasses.service}
        [font-size:var(--font-tag-base)] md:[font-size:var(--font-tag-md)]
      `}
    >
      {children}
    </span>
  );
};


const UserCard = ({ user, idx, t, playingAudio, toggleAudio, size = "full" }) => (
  
  // LAYER 0: 卡片容器 (Hover 目标) 和 背景光 (::before)
  // 这是从 ProductCard 移植过来的新父级 div。
  // 它负责 'group' 状态和 '::before' 辉光。
  <div 
    className={`
      group relative
      // 将您原来的 hover:scale-105 和 transition 移到这个父容器
      transition-transform duration-300 ease-out
      hover:scale-105

      // LAYER 1: 背景光 (::before)
      // (从 ProductCard 复制)
      before:content-[''] before:absolute before:inset-0 before:z-10
      before:rounded-[var(--card-radius)] // 使用您卡片自己的圆角变量
      before:blur-[30px]
      before:bg-gradient-to-l before:from-[#7e0fff] before:to-[#0fffc1] // 您可以自定义颜色
      before:bg-[200%_200%] before:opacity-0
      before:transition-[opacity,transform] before:duration-400 before:ease-in-out

      // 动画: 背景光 (在 group-hover 时触发)
      hover:before:opacity-60 hover:before:scale-115 hover:before:animate-animateGlow
    `}
  >
    {/* LAYER 2: 卡片内容 (可见层) 
      这就是您 *原来* 的 UserCard 根 div。
    */}
    <div 
      className={`
        ${size === 'full' ? 'user-card-full' : 'user-card-small'}
        
        // 关键: 添加 'relative z-20' 
        // 1. relative: 确保内部的绝对定位(光扫)正确
        // 2. z-20: 让卡片内容浮在辉光(z-10)之上
        relative z-20 
        
        // 'overflow-hidden' 是裁剪光扫的关键, 您原本就有, 很好
        overflow-hidden 
        
        rounded-[var(--card-radius)]
        border-[var(--card-border)] border-white
        
        // 注意: 'hover:scale-105' 和 'transition' 已移到外层 'group'
      `}
    >
      {/* 这是您原来的背景层, 保持不变 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${user.color} opacity-30`}></div>
      

      {/* LAYER 3: 光扫特效 (已修改)
        放在背景层之上, 内容层(z-10)之下。
      */}
      <div
        className={`
          absolute top-0 left-[-150%] w-[60%] h-full
          
          // 关键: 提高 z-index, 确保它在背景和模糊层之上
          z-5 
          
          // 关键: 增强了亮度! 
          // 从 via-white/10 改为 via-white/30, 否则在透明背景上看不见
          bg-gradient-to-r from-transparent via-white/30 to-transparent 
          
          skew-x-[-30deg] blur-sm
          transition-transform duration-700
          
          // 假设您已在 tailwind.config.js 中定义了 'ease-shine'
          ease-shine 
          
          // 关键: 响应外层 'group' 的 hover
          group-hover:translate-x-[250%] 
        `}
      ></div>

      {/* 这是您原来的内容层 (z-10)
        它现在会浮在光扫(z-5)和背景(z-auto)之上
        保持 'relative z-10' 不变
      */}
      <div className={`
        relative z-10 
        p-[var(--card-padding-base)] 
        sm:p-[var(--card-padding-sm)] 
        lg:p-[var(--card-padding-lg)]
      `}>
        {/* ... 您的所有内部内容 (保持不变) ... */}
        <div className="flex flex-col space-y-2 ">
          <div className="flex items-center space-x-3 w-full ">
            <p className={`
                flex-1
                text-center
                font-black text-slate-100 
                [font-size:var(--font-name-base)]
                md:[font-size:var(--font-name-md)]
              `}>
              {user.name}
            </p>
            <div className="flex flex-col items-center ">
              <AudioWaveButton
                isPlaying={playingAudio === idx}
                onClick={() => toggleAudio(idx)}
              />
            </div>
          </div>
          <div className="space-y-3 w-full " >
            <div className={`
                flex flex-col justify-end bg-cover bg-center bg-no-repeat backdrop-blur-sm shadow-lg
                min-h-[var(--content-min-height)]
                rounded-[var(--content-radius)]
                p-[var(--content-padding-base)] 
                md:p-[var(--content-padding-md)]
                h-60
                brightness-90
                 contrast-111
              `}
              style={{ backgroundImage: "url('/cyber.jpg')" }}
              >

              <div className="flex flex-wrap gap-1 md:gap-2">
                {user.games.map((game, gIdx) => (
                  <div key={gIdx} className="flex items-center justify-between gap-1">
                    <span className={`
                        font-bold text-slate-100
                        [font-size:var(--font-rank-base)]
                        md:text-[var(--font-rank-md)]
                      `}>
                      {t.games[game.name]}
                    </span>
                    <span className={`
                        font-bold text-indigo-600 bg-white/50 rounded-full 
                        [font-size:var(--font-rank-base)] 
                        py-[var(--rank-tag-py)]
                        px-[var(--rank-tag-px-base)]
                        md:px-[var(--rank-tag-px-md)]
                      `}>
                      {t.ranks[game.rank]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 w-full">
                {user.services.map((service, sIdx) => (
                  <Tag key={sIdx} color="blue" paddingType="service">
                    {t.serviceContent[service]}
                  </Tag>
                ))}
                {user.methods.map((method, mIdx) => (
                  <Tag key={mIdx} color="purple" paddingType="service">
                    {t.serviceMethod[method]}
                  </Tag>
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