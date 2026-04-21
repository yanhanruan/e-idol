import { Check, Crown, Shield, Sparkles, Star, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslations } from '../contexts/LanguageContext';
import PageTitle from '@src/components/ui/PageTitle';

interface PlanTheme {
  border: string;
  borderHover?: string;
  bgGradient: string;
  text: string;
  iconColor: string;
  btn: string;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  coins: string;
  bonus?: string;
  isPopular?: boolean;
  features: string[];
  icon: LucideIcon;
  theme: PlanTheme;
}

interface PricingCardProps {
  plan: Plan;
  isPopular?: boolean;
}

const PricingCard = ({ plan, isPopular = false }: PricingCardProps) => {
  const Icon = plan.icon;
  const hoverBorderClass = plan.theme.borderHover ? `group-hover:${plan.theme.borderHover}` : '';

  return (
    <div className="group relative h-full">
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-purple-600 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-white/20 tracking-widest uppercase flex items-center gap-1">
            <Sparkles size={10} /> Recommended
          </div>
        </div>
      )}

      <div
        className={`
          relative h-full overflow-hidden
          bg-[#0F1219]/90 backdrop-blur-md
          rounded-2xl border 
          flex flex-col
          transition-transform duration-500 ease-out 
          will-change-transform 
          [transform:translateZ(0)] 
          [backface-visibility:hidden]
          group-hover:-translate-y-2
          transition-colors duration-300
          ${plan.theme.border}
          ${hoverBorderClass}
          ${isPopular ? 'shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]' : 'shadow-none'}
          group-hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]
        `}
      >
        <div className={`h-28 relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${plan.theme.bgGradient} isolate`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none [transform:translateZ(0)]"></div>
          <Icon size={100} className="text-white/5 absolute -right-6 -bottom-6 rotate-12 group-hover:rotate-6 transition-transform duration-700 ease-out [transform:translateZ(0)]" />
          <div className={`z-10 w-14 h-14 bg-slate-950/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-cyber-border shadow-lg group-hover:scale-110 transition-transform duration-500 [transform:translateZ(0)] ${plan.theme.iconColor}`}>
            <Icon size={28} />
          </div>
        </div>

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
                <span className="text-xs text-slate-300 font-medium leading-relaxed subpixel-antialiased">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            className={`
            w-full py-3 text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all duration-300
            ${plan.theme.btn}
          `}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  const r = useTranslations().t.pricingPage as {
    subtitle: string;
    title: string;
    comment: string;
    plans: {
      starter: { name: string; bonus: string; features: string[] };
      popular: { name: string; bonus: string; features: string[] };
      elite: { name: string; bonus: string; features: string[] };
    };
  };

  const plans: Plan[] = [
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
        btn: 'border border-slate-600 hover:bg-slate-700 text-slate-300',
      },
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
        btn: 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]',
      },
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
        btn: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]',
      },
    },
  ];

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <PageTitle subtitle={r.subtitle} title={r.title} comment={r.comment} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isPopular={plan.isPopular} />
          ))}
        </div>

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
