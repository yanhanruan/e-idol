import type { ReactNode } from 'react';

interface CyberButtonProps {
  text?: string;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const CyberButton = ({ text, children, onClick, className = '' }: CyberButtonProps) => {
  const content = text || children;

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full opacity-70 blur-[2px] group-hover:opacity-100 group-hover:blur-[4px] transition duration-300"></div>

      <button
        onClick={onClick}
        className="relative px-5 py-1 bg-[#050510] rounded-full flex items-center justify-center border border-white/10 hover:bg-[#0a0a20] transition-colors duration-300 overflow-hidden w-full h-full"
      >
        <span className="text-sm md:text-xs font-semibold bg-gradient-to-r from-cyan-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{content}</span>
        <div className="absolute top-0 -left-10 w-10 h-full bg-white/10 -skew-x-12 group-hover:translate-x-40 transition-transform duration-700 ease-in-out"></div>
      </button>
    </div>
  );
};

export default CyberButton;
