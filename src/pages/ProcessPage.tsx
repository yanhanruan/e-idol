import { AlarmClock, CreditCard, FileText, Gamepad2, MapPin, PartyPopper } from 'lucide-react';
import { useTranslations } from '@src/contexts/LanguageContext';
import PageTitle from '@src/components/ui/PageTitle';

type IconName = 'Gamepad2' | 'AlarmClock' | 'FileText' | 'CreditCard' | 'PartyPopper';

interface ProcessStep {
  id: string;
  title: string;
  desc: string;
  detail: string;
  iconName: IconName;
}

interface ProcessFlowTranslation {
  subtitle: string;
  title: string;
  steps: ProcessStep[];
  areaInfo: {
    title: string;
    desc: string;
  };
}

const DEFAULT_PROCESS_FLOW: ProcessFlowTranslation = {
  subtitle: '',
  title: '',
  steps: [],
  areaInfo: {
    title: '',
    desc: '',
  },
};

const isProcessFlowTranslation = (value: unknown): value is ProcessFlowTranslation => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return typeof data.subtitle === 'string' && typeof data.title === 'string' && Array.isArray(data.steps) && typeof data.areaInfo === 'object' && data.areaInfo !== null;
};

const IconMap = {
  Gamepad2,
  AlarmClock,
  FileText,
  CreditCard,
  PartyPopper,
};

const ProcessPage = () => {
  const processFlow = useTranslations().t.processFlow;
  const r = isProcessFlowTranslation(processFlow) ? processFlow : DEFAULT_PROCESS_FLOW;
  const contentWidth = 'max-w-4xl mx-auto px-6 sm:px-8 relative z-10';

  return (
    <div>
      <style>{`
        @keyframes electricFlow {
          0% { 
            top: 0%; 
            height: 0%; 
            opacity: 0; 
          }
          10% {
            top: 0%;
            height: 15%;
            opacity: 1;
          }
          50% { 
            opacity: 1;
            height: 20%;
          }
          90% {
            height: 15%;
            opacity: 1;
          }
          100% { 
            top: 100%; 
            height: 0%; 
            opacity: 0; 
          }
        }
      `}</style>

      <div className={contentWidth}>
        <PageTitle subtitle={r.subtitle} title={r.title} comment="" />

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] md:-ml-[1px] bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="absolute left-0 w-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-[1px] shadow-[0_0_10px_#22d3ee]"
              style={{ animation: 'electricFlow 3s ease-in-out infinite' }}
            ></div>
          </div>

          <div className="space-y-8 md:space-y-12">
            {r.steps.map((step, index) => {
              const Icon = IconMap[step.iconName] || Gamepad2;
              const isEven = index % 2 === 0;

              return (
                <div key={index} className={`relative flex items-center md:justify-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="w-full md:w-[35%] pl-12 md:pl-0">
                    <div className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-1 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]">
                      <div className="relative rounded-lg overflow-hidden bg-[#0F1219]">
                        <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 to-transparent"></div>
                          <Icon size={40} className="text-cyan-400/20 absolute -right-3 -bottom-3 md:-right-2 md:-bottom-2 rotate-12" />
                          <div className="z-10 w-12 h-12 bg-slate-950/50 rounded-full flex items-center justify-center border border-cyan-500/30 shadow-neon-cyan">
                            <Icon size={24} className="text-cyan-400" />
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-baseline justify-between mb-1">
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{step.title}</h3>
                            <span className="text-3xl font-black text-slate-800 group-hover:text-slate-700 transition-colors select-none italic">
                              {step.id}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs font-medium mb-2">{step.desc}</p>
                          <p className="text-slate-500 text-[10px] leading-relaxed border-t border-slate-800 pt-2">{step.detail}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-[#0B0E14] border-[3px] border-slate-800 z-10 -ml-3 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:animate-ping"></div>
                  </div>

                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>

          <div className="mt-16 relative flex flex-col items-center">
            <div className="w-10 h-10 bg-purple-900/20 border border-purple-500/50 rounded-full flex items-center justify-center mb-4 z-10 shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-sm">
              <MapPin className="text-purple-400" size={20} />
            </div>

            <div className="max-w-xl w-full text-center bg-gradient-to-b from-slate-800/40 to-slate-900/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-2">{r.areaInfo.title}</h3>
              <p className="text-slate-400 text-xs mb-4">{r.areaInfo.desc}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Tokyo', 'Kanagawa', 'Chiba', 'Saitama', 'Online'].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 bg-slate-950 border border-slate-700 rounded text-[10px] text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default"
                  >
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
