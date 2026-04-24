import type { ReactNode } from 'react';

interface PageTitleProps {
  subtitle?: ReactNode;
  title: ReactNode;
  comment?: ReactNode;
  className?: string;
}

const PageTitle = ({ subtitle, title, comment, className = '' }: PageTitleProps) => {
  const showSubtitle = subtitle && subtitle !== '';

  return (
    <div className={`px-3 py-5 text-center ${className}`}>
      {showSubtitle && (
        <div className="whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 py-0.5 px-3 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-primary-cyan400 text-2xs font-bold tracking-md mb-3 shadow-neon-cyan">
          {subtitle}
        </div>
      )}

      <h1 className="text-xl md:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-primary-cyan400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        {title}
      </h1>

      {comment && <p className="mt-2 text-slate-400 text-xs italic max-w-2xl mx-auto">{comment}</p>}
    </div>
  );
};

export default PageTitle;
