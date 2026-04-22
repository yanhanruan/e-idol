import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface HomepageSecTitleProps {
  icon?: LucideIcon;
  title: ReactNode;
  action?: ReactNode;
  titleGradient?: boolean;
}

const HomepageSecTitle = ({ icon: Icon, title, action, titleGradient = false }: HomepageSecTitleProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3 md:space-x-4">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center relative shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.3), rgba(255, 0, 150, 0.3))',
            border: '2px solid rgba(0, 255, 255, 0.5)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #fff)' }}>
            {Icon && <Icon className="w-4 h-4 text-white" />}
          </div>
        </div>

        {titleGradient ? (
          <h3
            className="text-lg font-black"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: 'linear-gradient(135deg, #00ffff, #0099ff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 30px rgba(255, 0, 255, 0.4))',
            }}
          >
            {title}
          </h3>
        ) : (
          <h3 className="text-lg font-black text-content-secondary">{title}</h3>
        )}
      </div>

      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
};

export default HomepageSecTitle;
