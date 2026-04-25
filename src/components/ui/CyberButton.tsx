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
      <div className="cyber-glow-backdrop" />

      <button
        onClick={onClick}
        className="relative px-5 py-1 bg-cyber-base rounded-full flex items-center justify-center border border-cyber-border hover:bg-cyber-surface transition-colors duration-300 overflow-hidden w-full h-full"
      >
        <span className="text-sm md:text-xs font-semibold bg-gradient-to-r from-cyan-100 to-white bg-clip-text text-transparent drop-shadow-text-glow">{content}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
      </button>
    </div>
  );
};

export default CyberButton;
