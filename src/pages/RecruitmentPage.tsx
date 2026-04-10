import { AlertTriangle, Calendar, CheckCircle2, Clock, Gamepad2, Heart, HeartHandshake, MapPin, ShieldCheck, Sparkles, UserCheck, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslations } from '../contexts/LanguageContext';
import PageTitle from '@src/components/ui/PageTitle';

type RecruitmentIconName = 'ShieldCheck' | 'Calendar' | 'Sparkles' | 'UserCheck' | 'Clock' | 'MapPin' | 'Gamepad2' | 'Heart';

interface RecruitmentPoint {
  title: string;
  desc: string;
  icon: RecruitmentIconName;
}

interface RecruitmentRequirement {
  label: string;
  text: string;
}

interface RecruitmentSection {
  title: string;
  items: string[];
}

interface RecruitmentCard {
  title: string;
  desc: string;
}

interface RecruitmentPageTranslation {
  hero: {
    badge: string;
    title: string;
    desc: string;
    salaryPrefix: string;
    salaryAmount: string;
    salarySuffix: string;
  };
  points: RecruitmentPoint[];
  requirements: {
    title: string;
    subtitle: string;
    items: RecruitmentRequirement[];
  };
  ideal: {
    title: string;
    intro: string;
    sections: RecruitmentSection[];
  };
  ng: {
    title: string;
    intro: string;
    cards: RecruitmentCard[];
  };
  message: {
    title: string;
    text: string;
    button: string;
  };
}

const IconMap: Record<RecruitmentIconName, LucideIcon> = {
  ShieldCheck,
  Calendar,
  Sparkles,
  UserCheck,
  Clock,
  MapPin,
  Gamepad2,
  Heart,
};

const RecruitmentPage = () => {
  const { t } = useTranslations();
  const r = t.recruitmentPage as unknown as RecruitmentPageTranslation;
  const contentWidth = 'max-w-4xl mx-auto px-6 sm:px-8 relative z-10';

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden pb-2">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[80px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className={contentWidth}>
        <PageTitle
          subtitle={
            <>
              <Gamepad2 size={14} className="text-cyan-400" />
              <span>{r.hero.badge}</span>
            </>
          }
          title={r.hero.title}
          comment={r.hero.desc}
        />

        <div className="text-center mb-12 md:mb-16 relative">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="inline-block relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 to-cyan-500/50 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-[#13161c]/80 backdrop-blur border border-slate-700/50 px-6 py-3 rounded-lg flex items-baseline gap-2 shadow-xl">
                <span className="text-slate-500 font-bold text-xs">{r.hero.salaryPrefix}</span>
                <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tight">
                  {r.hero.salaryAmount}
                </span>
                <span className="text-slate-500 font-bold text-xs">{r.hero.salarySuffix}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {r.points.map((point, index) => {
            const Icon = IconMap[point.icon] || ShieldCheck;
            return (
              <div key={index} className="group relative bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl hover:border-cyan-500/30 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 bg-slate-800/80 rounded-lg flex items-center justify-center mb-3 group-hover:bg-cyan-900/20 transition-colors border border-slate-700/30">
                  <Icon className="text-cyan-400/80 group-hover:text-cyan-400" size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{point.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{point.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]"></div>
            <div>
              <h2 className="text-2xl font-bold text-white">{r.requirements.title}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{r.requirements.subtitle}</p>
            </div>
          </div>

          <div className="bg-slate-900/20 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="grid divide-y divide-slate-800/50">
              {r.requirements.items.map((item, idx) => (
                <div key={idx} className="p-4 md:grid md:grid-cols-12 md:gap-4 hover:bg-slate-800/30 transition-colors group">
                  <div className="md:col-span-3 mb-1 md:mb-0">
                    <span className="flex items-center gap-2 text-cyan-500/80 group-hover:text-cyan-400 font-bold text-xs uppercase tracking-wide">
                      <CheckCircle2 size={14} />
                      {item.label}
                    </span>
                  </div>
                  <div className="md:col-span-9">
                    <p className="text-slate-300 text-sm font-medium leading-normal">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{r.ideal.title}</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">{r.ideal.intro}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {r.ideal.sections.map((section, idx) => (
              <div key={idx} className="bg-[#13161c] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                  <HeartHandshake size={48} className="text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-3 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((text, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-400 text-xs leading-relaxed">
                      <span className="mt-1.5 w-0.5 h-0.5 rounded-full bg-slate-500 flex-shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-red-900/5 rounded-2xl -z-10 blur-xl"></div>
          <div className="bg-[#1a0f0f]/40 border border-red-900/20 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-red-900/20 pb-4">
              <div>
                <h2 className="text-xl font-bold text-red-100/90 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-500/80" />
                  {r.ng.title}
                </h2>
              </div>
              <p className="text-red-200/40 text-[10px] md:text-right max-w-sm leading-tight">{r.ng.intro}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {r.ng.cards.map((card, idx) => (
                <div key={idx} className="bg-red-950/10 border border-red-900/10 p-3 rounded-lg flex gap-3 hover:bg-red-950/20 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <XCircle size={16} className="text-red-500/60" />
                  </div>
                  <div>
                    <h4 className="text-red-100/90 font-bold text-xs mb-0.5">{card.title}</h4>
                    <p className="text-red-200/50 text-[10px] leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center pb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-900/50 to-purple-900/50 border border-cyan-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <Heart size={20} className="text-cyan-200" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">{r.message.title}</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed italic">{r.message.text}</p>

          <button className="group relative px-6 py-3 bg-white text-black font-bold text-sm rounded-full overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <span className="relative z-10">{r.message.button}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentPage;
