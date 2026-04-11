import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ReactElement } from 'react';

const glassStyle = 'bg-[#050510]/80 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]';
const transitionStyle = 'transition-all duration-300 ease-in-out';

interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CyberSelectProps<T extends string = string> {
  value: T;
  label?: string;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  icon?: ReactElement;
}

const CyberSelect = <T extends string = string>({ value, label, options, onChange, icon }: CyberSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: T) => {
    if (val === value) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    onChange(val);
  };

  return (
    <div className="relative z-50" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative flex items-center justify-center font-sans font-medium cursor-pointer group 
          w-9 h-9 rounded-full md:w-36 md:h-auto md:py-1.5 md:px-4 md:justify-between
          text-slate-300 hover:bg-[#0a0a20] hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:text-cyan-50
          ${glassStyle} ${transitionStyle}
        `}
      >
        <span className="md:hidden">{icon ?? label?.slice(0, 2)}</span>

        <span className="hidden md:block truncate tracking-wide text-sm md:text-xs">{label}</span>
        <ChevronDown className={`hidden md:block w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`
          absolute top-full right-0 mt-2 w-36 rounded-xl overflow-hidden
          border border-white/10 bg-[#0a0a1ad1] shadow-[0_0_30px_rgba(0,0,0,0.8)] origin-top-right
          ${transitionStyle}
          ${isOpen ? 'max-h-[200px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {options.map((opt, i) => (
          <div key={opt.value}>
            {i > 0 && <div className="mx-2 h-[1px] bg-white/5" />}
            <button
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-4 py-3 text-sm md:text-xs font-medium font-sans tracking-wide transition-colors duration-200 
                  ${value === opt.value ? 'text-cyan-400 bg-cyan-900/20' : 'text-slate-400 hover:text-cyan-50 hover:bg-white/5'}`}
            >
              {opt.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberSelect;
