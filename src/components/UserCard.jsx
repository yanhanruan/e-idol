import { Play, Pause } from "lucide-react";

const AudioWaveButton = ({ isPlaying, onClick }) => {
  const waveConfig = [
    { duration: '1.2s', delay: '0s' },
    { duration: '1.0s', delay: '0.15s' },
    { duration: '1.3s', delay: '0.3s' },
    { duration: '1.1s', delay: '0.15s' },
    { duration: '1.2s', delay: '0s' },
  ];

  return (
    <button
      onClick={onClick}
      // 改用暗黑半透明背景 + 霓虹青色边框 + 发光阴影，减少圆角弧度
      className="flex px-3 py-1.5 md:px-4 md:py-2 items-center justify-center space-x-2 bg-black/50 backdrop-blur-sm text-cyan-400 rounded-md hover:scale-105 duration-300"
    >
      <div className="relative w-4 h-4 flex-shrink-0">
        {/* 图标颜色改为霓虹青色 */}
        <Play className={`w-4 h-4 fill-cyan-400 text-cyan-400 transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
        <Pause className={`absolute top-0 left-0 w-4 h-4 fill-cyan-400 text-cyan-400 transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      <div className="flex items-center justify-center space-x-1 h-5 md:h-6">
        {waveConfig.map((bar, i) => (
          <div
            key={i}
            // 波形图改为青色
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

const CyberTag = ({ children, color = "blue" }) => {
  const styles = {
    blue: "text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/40",
    purple: "text-purple-400 border-purple-500/30 hover:bg-purple-900/40",
  };
  
  const accentColor = color === "blue" ? "bg-cyan-400" : "bg-purple-400";

  return (
    <div className={`
      relative flex items-center gap-1.5 
      px-2 py-0.5 /* 大幅减少内边距，原本是 py-1.5 */
      border bg-black/50 backdrop-blur-sm
      font-mono text-[10px] /* 缩小字号 */
      tracking-wider uppercase font-bold
      transition-all duration-300 cursor-default
      /* 缩小切角尺寸 */
      [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,0_100%)]
      ${styles[color] || styles.blue}
    `}>
      {/* 装饰方块也缩小 */}
      <span className={`w-1 h-1 block ${accentColor} shadow-[0_0_4px_currentColor]`}></span>
      {children}
    </div>
  );
};


const UserCard = ({ user, idx, t, playingAudio, toggleAudio, size = "full" }) => (

  // LAYER 0: 卡片容器 (Hover 目标) 和 背景光 (::before)
  // 这是从 ProductCard 移植过来的新父级 div。
  // 它负责 'group' 状态和 '::before' 辉光。
  <div
    className={`
      group relative
      transition-transform duration-300 ease-out
      hover:scale-105
      // LAYER 1: backgound gromming(::before)
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
            <div className="flex flex-col items-center shrink-0 w-22">
              <AudioWaveButton
                isPlaying={playingAudio === idx}
                onClick={() => toggleAudio(idx)}
              />
            </div>
          </div>
          <div className="space-y-3 w-full " >
            <div className={`
                flex flex-col justify-end bg-cover bg-center bg-no-repeat shadow-lg
                rounded-[var(--content-radius)]
                p-[var(--content-padding-base)] 
                md:p-[var(--content-padding-md)]
                h-60
                brightness-90
              `}
              style={{ backgroundImage: "url('/cyber.jpg')" }}
            >

              {/* 游戏与段位区 */}
              {/* 游戏与段位区：增加了 w-fit 防止拉伸，整体缩小尺寸 */}
              <div className="flex flex-wrap gap-2 w-full mb-1">
                {user.games.map((game, gIdx) => (
                  // 关键点：w-fit 让它只包裹内容，不再撑满一行
                  <div key={gIdx} className="flex relative group w-fit">

                    {/* 左侧：游戏名 (超迷你版) */}
                    <div className={`
        relative z-10 flex items-center justify-center
        bg-[#fce300] text-black 
        font-black uppercase 
        text-[10px] leading-none tracking-wider /* 极小字号 */
        px-1.5 py-1 
        shadow-[0_0_5px_rgba(252,227,0,0.4)]
        /* 切角也对应缩小，从8px改为4px，更精致 */
        [clip-path:polygon(0_0,100%_0,100%_100%,4px_100%,0_calc(100%-4px))]
        cursor-default
      `}>
                      {t.games[game.name]}
                    </div>

                    {/* 右侧：段位 (超迷你版) */}
                    <div className={`
        flex items-center
        bg-black/90 border-t border-b border-r border-[#fce300]/60 text-[#fce300] 
        font-mono font-bold 
        text-[10px] leading-none
        px-2 py-1 
        -ml-1.5 pl-2.5 /* 调整重叠距离 */
        [clip-path:polygon(0_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]
      `}>
                      {t.ranks[game.rank]}
                    </div>

                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-2 gap-y-1 w-full">
                {user.services.map((service, sIdx) => (
                  <CyberTag key={sIdx} color="blue" >
                    {t.serviceContent[service]}
                  </CyberTag>
                ))}
                {user.methods.map((method, mIdx) => (
                  <CyberTag key={mIdx} color="purple" >
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