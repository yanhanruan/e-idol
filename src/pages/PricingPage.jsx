import React from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { Check, Star, Zap, Crown, Shield, Sparkles } from 'lucide-react';

import PageTitle from '@src/components/ui/PageTitle';

// 只需要替换 PricingCard 组件部分，其他不用变

const PricingCard = ({ plan, isPopular }) => {
  const Icon = plan.icon;

  return (
    <div className="group relative h-full">
      {/* 热门标签 */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-purple-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/20 tracking-widest uppercase flex items-center gap-1">
            <Sparkles size={10} /> Recommended
          </div>
        </div>
      )}

      {/* [修复关键点]: 
         1. [backface-visibility:hidden] -> 隐藏背面，优化 3D 渲染
         2. [transform:translateZ(0)] -> 强制开启硬件加速图层，解决亚像素抖动
         3. will-change-transform -> 提前告知浏览器即将发生位移
      */}
      <div
        className={`
          relative h-full overflow-hidden
          bg-[#0F1219]/90 backdrop-blur-md
          rounded-2xl border 
          flex flex-col
          
          /* 核心动画配置 */
          transition-transform duration-500 ease-out 
          will-change-transform 
          [transform:translateZ(0)] 
          [backface-visibility:hidden]
          group-hover:-translate-y-2
          
          /* 边框颜色分离动画 */
          transition-colors duration-300
          ${plan.theme.border}
          group-hover:${plan.theme.borderHover}

          /* 阴影动画 */
          ${isPopular ? 'shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]' : 'shadow-none'}
          group-hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]
        `}
      >

        {/* --- 头部视觉区 --- */}
        {/* [修复细节]: 添加 isolate 和 z-0 确保层级上下文独立 */}
        <div className={`h-28 relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${plan.theme.bgGradient} isolate`}>

          {/* [修复细节]: 将 absolute 层锁定为 translate-z-0，
              防止父级移动时它因为宽度重算而"闪烁" 
           */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none [transform:translateZ(0)]"></div>

          {/* 装饰大图标 */}
          <Icon size={100} className="text-white/5 absolute -right-6 -bottom-6 rotate-12 group-hover:rotate-6 transition-transform duration-700 ease-out [transform:translateZ(0)]" />

          {/* 核心图标 */}
          <div className={`z-10 w-14 h-14 bg-slate-950/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500 [transform:translateZ(0)] ${plan.theme.iconColor}`}>
            <Icon size={28} />
          </div>
        </div>

        {/* --- 内容区 --- */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-black text-white tracking-tight">{plan.price}</span>
            </div>
            <div className={`text-sm font-bold mt-2 ${plan.theme.text}`}>
              {plan.coins} COINS
              {plan.bonus && <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white font-normal">{plan.bonus}</span>}
            </div>
          </div>

          <div className="h-px w-full bg-slate-800/80 mb-6"></div>

          <ul className="space-y-3 mb-8 flex-grow">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 min-w-[16px] flex justify-center">
                  <Check size={14} className={plan.theme.text} />
                </div>
                {/* 增加 subpixel-antialiased 确保字体渲染在移动时不突变 */}
                <span className="text-xs text-slate-300 font-medium leading-relaxed subpixel-antialiased">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <button className={`
            w-full py-3 text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all duration-300
            ${plan.theme.btn}
          `}>
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 主页面 ---
const PricingPage = () => {
  const r = useTranslations().t.pricingPage;

  // 数据配置 (已简化 Theme 结构，移除冗余类)
  const plans = [
    {
      id: 'starter',
      name: r.plans.starter.name,
      price: '¥1,000',
      coins: '1,000',
      bonus: r.plans.starter.bonus,
      features: r.plans.starter.features,
      icon: Star,
      theme: {
        border: 'border-slate-700/50',
        bgGradient: 'from-slate-800 to-slate-900',
        text: 'text-slate-400',
        iconColor: 'text-slate-400',
        btn: 'border border-slate-600 hover:bg-slate-700 text-slate-300'
      }
    },
    {
      id: 'popular',
      name: r.plans.popular.name,
      price: '¥3,000',
      coins: '3,300',
      bonus: r.plans.popular.bonus,
      isPopular: true,
      features: r.plans.popular.features,
      icon: Zap,
      theme: {
        border: 'border-purple-500/30',
        borderHover: 'border-purple-500/80',
        bgGradient: 'from-purple-900/40 to-slate-900',
        text: 'text-purple-400',
        iconColor: 'text-purple-400',
        btn: 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]'
      }
    },
    {
      id: 'elite',
      name: r.plans.elite.name,
      price: '¥10,000',
      coins: '12,000',
      bonus: r.plans.elite.bonus,
      features: r.plans.elite.features,
      icon: Crown,
      theme: {
        border: 'border-cyan-500/30',
        borderHover: 'border-cyan-500/80',
        bgGradient: 'from-teal-700/50 to-slate-900',
        text: 'text-cyan-400',
        iconColor: 'text-cyan-400',
        btn: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]'
      }
    }
  ];

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">

      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* 标题 */}
        <PageTitle subtitle={r.subtitle} title={r.title} comment={r.comment} />

        {/* 卡片 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isPopular={plan.isPopular} />
          ))}
        </div>

        {/* 底部声明 */}
        <div className="mt-20 text-center opacity-60">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Secure Payment Gateway // SSL Encrypted</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;