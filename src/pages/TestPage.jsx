import React, { useRef, useEffect, useState, useCallback } from 'react';

// ==========================================
// 核心算法: 伪随机与辅助函数
// ==========================================
const lerp = (start, end, factor) => start + (end - start) * factor;
const rand = (min, max) => Math.random() * (max - min) + min;

// ==========================================
// 组件: CyberPunkGlitchImage (V8 Pure Displacement)
// ==========================================
const CyberPunkGlitchImage = ({ src, alt = "Cyber Glitch", className = "" }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  
  // 动画状态
  const animationRef = useRef({
    reqId: null,
    time: 0,
    intensity: 0,
    targetIntensity: 0 
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
      if (canvasRef.current) {
        canvasRef.current.width = img.naturalWidth;
        canvasRef.current.height = img.naturalHeight;
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(img, 0, 0);
      }
    };
    return () => cancelAnimationFrame(animationRef.current.reqId);
  }, [src]);

  const render = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    const w = canvas.width;
    const h = canvas.height;
    const anim = animationRef.current;

    // 1. 时间步进
    anim.time += 0.05;

    // 2. 惯性系统
    anim.intensity += (anim.targetIntensity - anim.intensity) * 0.05;

    // 阈值检查
    if (anim.intensity < 0.001 && anim.targetIntensity === 0) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);
      anim.reqId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, w, h);

    // ==========================================
    // Phase 1: RGB 信号分离 (仅全屏偏移，无局部杂色)
    // ==========================================
    const globalShift = 4 * anim.intensity * anim.intensity; 
    
    // 绘制底图
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, 0, 0);

    if (anim.intensity > 0.01) {
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = anim.intensity * 0.8;

        // 红色通道 (左移)
        ctx.save();
        ctx.translate(-globalShift, 0);
        // 严格裁剪，防止边缘溢出
        ctx.beginPath();
        ctx.rect(globalShift, 0, w - globalShift, h);
        ctx.clip();
        
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = '#ff0033'; 
        ctx.fillRect(0, 0, w, h);
        ctx.restore();

        // 青色通道 (右移)
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

    // ==========================================
    // Phase 2: 数字块状置换 (Pure Blocky Displacement)
    // ==========================================
    // 这里的逻辑已彻底净化：没有 filter，没有 fillRect，只有 translate。
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;

    // 动态切片数量
    const numBlocks = 20 + Math.floor(anim.intensity * 60); 
    const blockHeight = h / numBlocks;

    for (let i = 0; i < numBlocks; i++) {
        const y = i * blockHeight;
        
        // 波形计算
        const mainWave = Math.sin(i * 0.1 + anim.time);
        const jitterWave = Math.sin(i * 3.5 + anim.time * 3);
        let signal = (mainWave + jitterWave) * 0.5;

        // 阈值控制
        if (Math.abs(signal) < 0.2) continue;

        // 位移计算
        const shiftPower = Math.pow(Math.abs(signal), 3); 
        const direction = signal > 0 ? 1 : -1;
        const shiftIntensity = anim.intensity * anim.intensity;
        const offsetX = shiftPower * direction * w * 0.08 * shiftIntensity;

        // 绘制切片
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, y, w, blockHeight);
        ctx.clip();
        ctx.translate(offsetX, 0);
        
        // [已删除] 反色滤镜 ctx.filter = 'invert(1)' 
        // 这一行被删除后，就不会再有白色的亮线了。
        
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    // ==========================================
    // Phase 3: 纯噪点层 (微弱的胶片颗粒)
    // ==========================================
    if (anim.intensity > 0.01) {
        if (w < 1200) { 
            const density = 30; // 更加稀疏
            ctx.globalCompositeOperation = 'overlay';
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.2 * anim.intensity; // 更加微弱
            
            for (let px = 0; px < w; px += density) {
                for (let py = 0; py < h; py += density) {
                    if (Math.random() > 0.9) { // 只有 10% 的概率出现
                        ctx.fillRect(px + rand(-2, 2), py + rand(-2, 2), 1, 1);
                    }
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
    if(isLoaded) animationRef.current.reqId = requestAnimationFrame(render);
  }, [isLoaded, render]);

  return (
    <div 
      className={`relative overflow-hidden group cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-auto object-cover transition-transform duration-300 ease-out group-hover:scale-[1.01]"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
      {!isLoaded && <div className="w-full h-64 bg-gray-900 animate-pulse" />}
    </div>
  );
};

// ==========================================
// Demo Page
// ==========================================
const GlitchDemo = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono selection:bg-[#ff0033] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="text-center space-y-4 relative z-10 pt-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-white mb-2">
            PURE<span className="text-[#ff0033]">V8</span>
          </h1>
          <p className="text-gray-500 text-xs tracking-[0.3em] uppercase max-w-lg mx-auto leading-relaxed">
            Zero Artifacts • Absolute Displacement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="group relative">
             <div className="absolute -inset-0.5 bg-gradient-to-br from-[#ff0033] to-[#330000] rounded opacity-20 group-hover:opacity-100 blur transition duration-500"></div>
             <div className="relative bg-black rounded border border-white/10">
              <CyberPunkGlitchImage 
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="text-[#ff0033] text-xs font-bold bg-black/80 backdrop-blur px-2 py-1 border border-[#ff0033]/30">V8_FINAL</span>
              </div>
            </div>
          </div>

          <div className="group relative">
             <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500 to-blue-900 rounded opacity-20 group-hover:opacity-100 blur transition duration-500"></div>
             <div className="relative bg-black rounded border border-white/10">
              <CyberPunkGlitchImage 
                src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition duration-300">
                 <span className="text-cyan-400 text-xs font-bold bg-black/80 backdrop-blur px-2 py-1 border border-cyan-400/30">NO_LINES</span>
              </div>
            </div>
          </div>

        </div>
        
        <div className="text-center text-gray-700 text-[10px] mt-12">
          ALGORITHM V8: REMOVED ALL FILTERS & INVERSIONS
        </div>

      </div>
    </div>
  );
};

export default GlitchDemo;