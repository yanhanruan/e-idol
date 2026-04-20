// src/components/ui/CyberInput.tsx
import type { InputHTMLAttributes } from 'react';

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

/**
 * 赛博朋克风格输入框原子组件
 * 外层辉光边框 + 玻璃态背景，focus 时霓虹增强
 */
const CyberInput = ({ label, error, containerClassName = '', className = '', ...rest }: CyberInputProps) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          {label}
        </label>
      )}

      {/* 辉光边框容器 */}
      <div className="relative group">
        {/* 背景辉光层 */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-purple-600/40 rounded-lg opacity-50 blur-[2px] group-focus-within:opacity-100 group-focus-within:blur-[3px] transition-all duration-300 pointer-events-none" />

        <input
          {...rest}
          className={`
            relative w-full px-4 py-3 rounded-lg
            bg-[#050510] border border-white/10
            text-sm text-cyan-50 placeholder:text-slate-600
            outline-none
            focus:border-cyan-500/50
            transition-all duration-300
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-xs text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.6)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default CyberInput;
