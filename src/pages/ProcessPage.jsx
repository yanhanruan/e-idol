import React, { useState, useMemo, useContext, createContext, useEffect } from 'react';
import { Gamepad2, AlarmClock, FileText, CreditCard, PartyPopper, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useTranslations } from '@src/contexts/LanguageContext';

// 图标映射表
const IconMap = {
  Gamepad2, AlarmClock, FileText, CreditCard, PartyPopper
};


const ProcessPage = () => {
  const { t } = useTranslations();
  
  const containerClass = "min-h-screen bg-[#0B0E14] text-white font-sans relative overflow-hidden pb-20";
  // [修改 2]: 将 max-w-5xl 改为 max-w-4xl，使PC端更紧凑，两侧留白更多
  const contentWidth = "max-w-4xl mx-auto px-6 sm:px-8 relative z-10";

  return (
    <div className={containerClass}>
      
      {/* 注入电流动画样式 */}
      <style>{`
        @keyframes electricFlow {
          0% { top: -150px; opacity: 0; height: 100px; }
          20% { opacity: 1; height: 150px; }
          50% { opacity: 0.8; height: 150px; }
          80% { opacity: 1; height: 100px; }
          100% { top: 100%; opacity: 0; height: 50px; }
        }
      `}</style>

      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className={contentWidth}>
        
        {/* [修改 1]: 头部区域减小 padding，字体也稍微缩小 */}
        <div className="pt-20 pb-8 text-center">
          <span className="inline-block py-0.5 px-3 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-[0.2em] mb-3">
            {t.processFlow.subtitle}
          </span>
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            {t.processFlow.title}
          </h1>
        </div>

        {/* 流程图主体 */}
        <div className="relative">
          {/* 中轴线 (The Timeline Base) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] md:-ml-[1px] bg-slate-800/80 rounded-full"></div>
          
          {/* [修改 3]: 动态电流 (The Electric Current) */}
          {/* 使用 style 注入 animation，模拟从上到下流动的电流效果 */}
          <div 
            className="absolute left-4 md:left-1/2 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent md:-ml-[1px] blur-[1px] z-0 shadow-[0_0_10px_#22d3ee]"
            style={{ animation: 'electricFlow 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
          ></div>

          {/* [修改 2]: 减小卡片之间的垂直间距 space-y-12 -> space-y-8 */}
          <div className="space-y-8 md:space-y-12">
            {t.processFlow.steps.map((step, index) => {
              const Icon = IconMap[step.iconName] || Gamepad2;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className={`relative flex items-center md:justify-between ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* --- 卡片内容区 --- */}
                  <div className="w-full md:w-[45%] pl-12 md:pl-0">
                    <div className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-1 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]">
                      
                      {/* 卡片内部布局 */}
                      <div className="relative rounded-lg overflow-hidden bg-[#0F1219]">
                        {/* [修改 2]: 减小图片占位高度 h-32 -> h-24 */}
                        <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 to-transparent"></div>
                            {/* 减小背景图标尺寸 */}
                            <Icon size={40} className="text-cyan-400/20 absolute -right-3 -bottom-3 rotate-12" />
                            
                            {/* [修改 2]: 减小核心图标尺寸 */}
                            <div className="z-10 w-12 h-12 bg-slate-950/50 rounded-full flex items-center justify-center border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                               <Icon size={24} className="text-cyan-400" />
                            </div>
                        </div>

                        {/* [修改 2]: 减小内容区域 padding p-6 -> p-4 */}
                        <div className="p-4">
                           <div className="flex items-baseline justify-between mb-1">
                              {/* [修改 2]: 减小标题字号 text-xl -> text-lg */}
                              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {step.title}
                              </h3>
                              {/* [修改 2]: 减小序号字号 text-4xl -> text-3xl */}
                              <span className="text-3xl font-black text-slate-800 group-hover:text-slate-700 transition-colors select-none italic">
                                {step.id}
                              </span>
                           </div>
                           {/* [修改 2]: 减小描述文字号 text-sm -> text-xs */}
                           <p className="text-slate-300 text-xs font-medium mb-2">
                             {step.desc}
                           </p>
                           <p className="text-slate-500 text-[10px] leading-relaxed border-t border-slate-800 pt-2">
                             {step.detail}
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- 中心节点 --- */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-[#0B0E14] border-[3px] border-slate-800 z-10 -ml-3 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                     <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:animate-ping"></div>
                  </div>

                  {/* --- 另一侧的占位 --- */}
                  <div className="hidden md:block w-[45%]" />
                  
                </div>
              );
            })}
          </div>

          {/* 底部：地区信息 */}
          <div className="mt-16 relative flex flex-col items-center">
             <div className="w-10 h-10 bg-purple-900/20 border border-purple-500/50 rounded-full flex items-center justify-center mb-4 z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-sm">
                <MapPin className="text-purple-400" size={20} />
             </div>
             
             <div className="max-w-xl w-full text-center bg-gradient-to-b from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-2">{t.processFlow.areaInfo.title}</h3>
                <p className="text-slate-400 text-xs mb-4">{t.processFlow.areaInfo.desc}</p>
                <div className="flex flex-wrap justify-center gap-2">
                   {["Tokyo", "Kanagawa", "Chiba", "Saitama", "Online"].map((city) => (
                     <span key={city} className="px-3 py-1 bg-slate-950 border border-slate-700 rounded text-[10px] text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default">
                       {city}
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

export default ProcessPage;
