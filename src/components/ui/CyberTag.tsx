interface CyberTagProps {
  children: string;
  color?: 'blue' | 'purple';
}

const CyberTag = ({ children, color = 'blue' }: CyberTagProps) => {
  const styles = {
    blue: 'text-primary-cyan400 border-cyber-tagCyan/30 hover:bg-cyber-tagCyanDark/40',
    purple: 'text-cyber-tagPurple border-cyber-tagPurple/30 hover:bg-cyber-tagPurpleDark/40',
  };
  const dot = color === 'blue' ? 'bg-primary-cyan400' : 'bg-cyber-tagPurple';

  return (
    <div
      className={`
        relative flex items-center gap-1.5
        px-2 py-0.5
        border bg-cyber-base/50 backdrop-blur-sm
        font-mono text-2xs
        tracking-wider uppercase font-bold
        transition-all duration-300 cursor-default
        clip-chamfer-tr
        ${styles[color]}
      `}
    >
      <span className={`w-1 h-1 block flex-shrink-0 ${dot} shadow-neon-dot`} />
      {children}
    </div>
  );
};

export default CyberTag;
