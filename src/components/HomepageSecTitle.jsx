import React from 'react';

// 接收参数说明：
// icon: Lucide 图标组件 (例如 Star, Heart)
// title: 标题文本
// action: (可选) 右侧的操作区域，传入具体的组件（Button 或 Selector）
// titleGradient: (可选) 布尔值，是否启用那种酷炫的渐变文字样式
const HomepageSecTitle = ({ icon: Icon, title, action, titleGradient = false }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* 左侧：图标 + 标题 */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* 统一的图标容器样式 */}
        <div 
          className="w-8 h-8 rounded-md flex items-center justify-center relative shrink-0" 
          style={{
            background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
            border: '2px solid rgba(0, 255, 255, 0.5)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* 渲染传入的 Icon 组件 */}
          <div className="animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #fff)' }}>
             {Icon && <Icon className="w-4 h-4 text-white" />}
          </div>
        </div>

        {/* 标题部分：根据 titleGradient 判断使用哪种样式 */}
        {titleGradient ? (
          <h3 className="text-lg font-black" style={{
            fontFamily: "'Orbitron', sans-serif",
            background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 30px rgba(255, 0, 255, 0.4))'
          }}>
            {title}
          </h3>
        ) : (
          <h3 className="text-lg font-black text-slate-200">
            {title}
          </h3>
        )}
      </div>

      {/* 右侧：插槽 (如果有 action 就显示，没有就不显示) */}
      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default HomepageSecTitle;