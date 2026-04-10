import { useCallback, useEffect, useRef, useState } from 'react';

const rand = (min: number, max: number): number => Math.random() * (max - min) + min;

interface AnimationState {
  reqId: number | null;
  time: number;
  intensity: number;
  targetIntensity: number;
}

interface CyberPunkGlitchImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const CyberPunkGlitchImage = ({ src, alt = 'Cyber Glitch', className = '' }: CyberPunkGlitchImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const animationRef = useRef<AnimationState>({
    reqId: null,
    time: 0,
    intensity: 0,
    targetIntensity: 0,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
      if (canvasRef.current) {
        canvasRef.current.width = img.naturalWidth;
        canvasRef.current.height = img.naturalHeight;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      }
    };

    return () => {
      if (animationRef.current.reqId !== null) {
        cancelAnimationFrame(animationRef.current.reqId);
      }
    };
  }, [src]);

  const render = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const anim = animationRef.current;

    anim.time += 0.05;
    anim.intensity += (anim.targetIntensity - anim.intensity) * 0.05;

    if (anim.intensity < 0.001 && anim.targetIntensity === 0) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);
      anim.reqId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, w, h);

    const globalShift = 4 * anim.intensity * anim.intensity;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, 0, 0);

    if (anim.intensity > 0.01) {
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = anim.intensity * 0.8;

      ctx.save();
      ctx.translate(-globalShift, 0);
      ctx.beginPath();
      ctx.rect(globalShift, 0, w - globalShift, h);
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = '#ff0033';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      ctx.save();
      ctx.translate(globalShift, 0);
      ctx.beginPath();
      ctx.rect(0, 0, w - globalShift, h);
      ctx.clip();
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = '#00ccff';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;

    const numBlocks = 20 + Math.floor(anim.intensity * 60);
    const blockHeight = h / numBlocks;

    for (let i = 0; i < numBlocks; i++) {
      const y = i * blockHeight;
      const mainWave = Math.sin(i * 0.1 + anim.time);
      const jitterWave = Math.sin(i * 3.5 + anim.time * 3);
      const signal = (mainWave + jitterWave) * 0.5;
      if (Math.abs(signal) < 0.2) continue;

      const shiftPower = Math.pow(Math.abs(signal), 3);
      const direction = signal > 0 ? 1 : -1;
      const shiftIntensity = anim.intensity * anim.intensity;
      const offsetX = shiftPower * direction * w * 0.08 * shiftIntensity;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y, w, blockHeight);
      ctx.clip();
      ctx.translate(offsetX, 0);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }

    if (anim.intensity > 0.01 && w < 1200) {
      const density = 30;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.2 * anim.intensity;

      for (let px = 0; px < w; px += density) {
        for (let py = 0; py < h; py += density) {
          if (Math.random() > 0.9) {
            ctx.fillRect(px + rand(-2, 2), py + rand(-2, 2), 1, 1);
          }
        }
      }
    }

    anim.reqId = requestAnimationFrame(render);
  }, []);

  const handleMouseEnter = () => {
    animationRef.current.targetIntensity = 1.0;
    if (!animationRef.current.reqId) animationRef.current.reqId = requestAnimationFrame(render);
  };

  const handleMouseLeave = () => {
    animationRef.current.targetIntensity = 0;
  };

  useEffect(() => {
    if (isLoaded) animationRef.current.reqId = requestAnimationFrame(render);
  }, [isLoaded, render]);

  return (
    <div className={`relative overflow-hidden group cursor-pointer ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className="block w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01]"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
      {!isLoaded && <div className="w-full h-64 bg-gray-900 animate-pulse" />}
    </div>
  );
};

const GlitchDemo = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono selection:bg-[#ff0033] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4 relative z-10 pt-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-white mb-2">
            PURE<span className="text-[#ff0033]">V8</span>
          </h1>
          <p className="text-gray-500 text-xs tracking-[0.3em] uppercase max-w-lg mx-auto leading-relaxed">Zero Artifacts • Absolute Displacement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#ff0033] to-[#330000] rounded opacity-20 group-hover:opacity-100 blur transition duration-500"></div>
            <div className="relative bg-black rounded border border-white/10">
              <CyberPunkGlitchImage src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="text-[#ff0033] text-xs font-bold bg-black/80 backdrop-blur px-2 py-1 border border-[#ff0033]/30">V8_FINAL</span>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500 to-blue-900 rounded opacity-20 group-hover:opacity-100 blur transition duration-500"></div>
            <div className="relative bg-black rounded border border-white/10">
              <CyberPunkGlitchImage src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="text-cyan-400 text-xs font-bold bg-black/80 backdrop-blur px-2 py-1 border border-cyan-400/30">NO_LINES</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-700 text-[10px] mt-12">ALGORITHM V8: REMOVED ALL FILTERS & INVERSIONS</div>
      </div>
    </div>
  );
};

export default GlitchDemo;
