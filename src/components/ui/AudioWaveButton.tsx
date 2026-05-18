import { Pause, Play } from 'lucide-react';

interface AudioWaveButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const waveConfig = [
  { duration: '1.2s', delay: '0s' },
  { duration: '1.0s', delay: '0.15s' },
  { duration: '1.3s', delay: '0.3s' },
  { duration: '1.1s', delay: '0.15s' },
  { duration: '1.2s', delay: '0s' },
];

const AudioWaveButton = ({ isPlaying, onClick }: AudioWaveButtonProps) => (
  <button
    onClick={onClick}
    className="flex px-3 py-1.5 md:px-4 md:py-2 items-center justify-center space-x-2 bg-cyber-base/50 backdrop-blur-sm text-primary-cyan400 rounded-md hover:scale-105 duration-300"
  >
    <div className="relative w-4 h-4 flex-shrink-0">
      <Play
        className={`w-4 h-4 fill-primary-cyan400 text-primary-cyan400 transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
      />
      <Pause
        className={`absolute top-0 left-0 w-4 h-4 fill-primary-cyan400 text-primary-cyan400 transition-opacity duration-300 ease-in-out ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
    <div className="flex items-center justify-center space-x-1 h-5 md:h-6">
      {waveConfig.map((bar, i) => (
        <div
          key={i}
          className="w-[3px] bg-primary-cyan400 rounded-sm animate-wave shadow-neon-cyan"
          style={{
            animationDuration: bar.duration,
            animationDelay: bar.delay,
            animationPlayState: isPlaying ? 'running' : 'paused',
            animationFillMode: 'backwards',
          }}
        />
      ))}
    </div>
  </button>
);

export default AudioWaveButton;
