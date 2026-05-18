// src/components/ui/CyberInput.tsx
import type { InputHTMLAttributes } from 'react';

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  variant?: 'default' | 'glass';
  rounded?: 'lg' | 'full';
}

const CyberInput = ({
  label,
  error,
  containerClassName = '',
  className = '',
  variant = 'default',
  rounded = 'lg',
  ...rest
}: CyberInputProps) => {
  const bgClass = variant === 'glass' ? 'bg-cyber-glass backdrop-blur-md' : 'bg-cyber-base';
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-lg';

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-2xs md:text-xs font-medium tracking-widest text-content-muted uppercase">
          {label}
        </label>
      )}

      <div className="relative group">
        <div className={`absolute -inset-px bg-gradient-to-r from-primary-aqua/40 via-primary-blue/30 to-primary-neonPurple/40 ${roundedClass} opacity-50 blur-px group-focus-within:opacity-100 group-focus-within:blur-xs transition-all duration-300 pointer-events-none`} />

        <input
          {...rest}
          className={`
            relative w-full px-4
            py-3 md:py-2.5
            ${roundedClass}
            ${bgClass} border border-cyber-border
            text-sm md:text-xs
            text-content-primary placeholder:text-content-ghost
            outline-none
            focus:border-primary-cyan/50
            transition-all duration-300
            ${error ? 'border-status-error/50' : ''}
            ${className}
          `}
        />
      </div>

      {error && (
        <p className="text-2xs md:text-xs text-status-error mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default CyberInput;
