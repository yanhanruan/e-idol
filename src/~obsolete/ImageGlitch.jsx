import React, { useRef, useEffect, useState, useCallback } from 'react';

// ==========================================
// 辅助函数
// ==========================================
// 线性插值：让数值从 start 平滑过渡到 end
const lerp = (start, end, factor) => start + (end - start) * factor;

// ==========================================
// 核心组件: SilkyGlitchImage
// ==========================================
const SilkyGlitchImage = ({ src, alt = "Silky Glitch", className = "" }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  // 动画状态引用 (使用 Ref 以避免重渲染中断动画)
  const animationRef = useRef({
    reqId: null,
    time: 0,
    intensity: 0,      // 当前故障强度 (0 ~ 1)
    targetIntensity: 0 // 目标故障强度
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // 1. 初始化资源
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
      if (canvasRef.current) {
        // 设置 Canvas 为高清分辨率
        canvasRef.current.width = img.naturalWidth;
        canvasRef.current.height = img.naturalHeight;
        // 初始画一张静态图
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(img, 0, 0);
      }
    };

    // 清理动画
    return () => {
      if (animationRef.current.reqId) {
        cancelAnimationFrame(animationRef.current.reqId);
      }
    };
  }, [src]);

  // 2. 核心渲染循环 (Render Loop)
  const render = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    const w = canvas.width;
    const h = canvas.height;
    const anim = animationRef.current;

    // A. 状态更新
    anim.time += 0.05; // 时间流逝
    // 平滑过渡 intensity (惯性效果)
    // 0.1 是阻尼系数，越小越顺滑，越大反应越快
    anim.intensity = lerp(anim.intensity, anim.targetIntensity, 0.1);

    // 如果强度极小，几乎看不见，就停止高频渲染，省电；或者画一帧原图待机
    if (anim.intensity < 0.01 && anim.targetIntensity === 0) {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
        // 可以选择在这里停止 requestAnimationFrame，但在 hover 交互中保持循环更简单
        anim.reqId = requestAnimationFrame(render);
        return;
    }

    // B. 清空画布
    ctx.clearRect(0, 0, w, h);

    // C. 绘制底图 (稍微变暗一点，为了让叠加的 Glitch 更亮)
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, 0, 0);

    // D. 核心算法：波浪式切片 (Scanline Wave)
    // 我们把图片分为若干个“带”(Band)，每个带根据正弦波移动
    
    // 参数配置
    const numSlices = 20; // 切片数量，越多越细腻但越费性能
    const sliceHeight = h / numSlices;
    
    // 动态调整振幅：鼠标移上去时震动幅度大
    const maxShift = w * 0.05 * anim.intensity; // 最大水平位移 5%

    for (let i = 0; i < numSlices; i++) {
      // 当前切片的 Y 坐标
      const y = i * sliceHeight;
      
      // 1. 计算偏移量 (The "Flow" Math)
      // 使用 sin 函数创造规律的波动
      // i * 0.5: 让不同高度的切片相位不同，形成波浪
      // anim.time: 让波浪动起来
      let flow = Math.sin(i * 0.5 + anim.time) + Math.sin(i * 1.5 + anim.time * 2) * 0.5;
      
      // 2. 加入一点点随机噪声 (Jitter)，让它不那么像完美的正弦波
      // 只有在高强度时才加入噪声
      const noise = (Math.random() - 0.5) * anim.intensity * 2;
      
      // 最终偏移量
      const xOffset = (flow + noise) * maxShift;

      // 如果偏移量很小，就跳过绘制，优化性能，也保持画面主体清晰
      if (Math.abs(xOffset) < 1) continue;

      // 3. 绘制 "幻影" 切片 (Ghost Slices)
      // 技巧：使用 'screen' 或 'lighter' 混合模式，模拟光的叠加
      ctx.globalCompositeOperation = 'screen';
      
      const sliceH = sliceHeight;

      // 通道 A (模拟青色/蓝色偏移) -> 向左偏
      // 注意：Canvas 2D 很难直接画单色通道，我们用低透明度的原图切片叠加来模拟
      ctx.globalAlpha = 0.6 * anim.intensity; 
      // 绘制第一层幻影
      ctx.drawImage(img, 0, y, w, sliceH, xOffset, y, w, sliceH);

      // 通道 B (模拟红色/洋红偏移) -> 向右偏 (偏移量略有不同，制造分离感)
      ctx.globalAlpha = 0.4 * anim.intensity;
      ctx.drawImage(img, 0, y, w, sliceH, -xOffset * 1.5, y, w, sliceH);
    }
    
    // E. 偶尔的高亮扫描线 (赛博朋克特征)
    if (Math.random() < 0.05 * anim.intensity) {
        const lineY = Math.random() * h;
        const lineH = Math.random() * 2 + 1;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(0, lineY, w, lineH);
    }

    // 继续循环
    anim.reqId = requestAnimationFrame(render);
  }, []);

  // 3. 交互控制
  const handleMouseEnter = () => {
    animationRef.current.targetIntensity = 1; // 目标：完全故障
    // 如果循环停止了，重新启动
    if (!animationRef.current.reqId) {
       animationRef.current.reqId = requestAnimationFrame(render);
    }
  };

  const handleMouseLeave = () => {
    animationRef.current.targetIntensity = 0; // 目标：恢复平静
    // 注意：我们不立即 cancelAnimationFrame，让 render 循环继续跑
    // 直到 intensity 降到 0 自然停止，实现 Fade Out 效果
  };
  
  // 启动初始循环 (确保一开始有画面)
  useEffect(() => {
    if(isLoaded) {
       animationRef.current.reqId = requestAnimationFrame(render);
    }
  }, [isLoaded, render]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-auto object-cover"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
      {!isLoaded && <div className="w-full h-64 bg-gray-900 animate-pulse" />}
      
      {/* 装饰 UI */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none mix-blend-overlay opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

// ==========================================
// 演示页面
// ==========================================
const GlitchDemo = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-mono selection:bg-cyan-500 selection:text-black">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 relative z-10 pt-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-white">
            Silky<span className="text-cyan-400">Glitch</span>
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Sine Wave Distortion • Smooth Lerp • Screen Blending
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Card 1 */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black rounded-lg overflow-hidden border border-white/10">
              <SilkyGlitchImage 
                src="https://images.unsplash.com/photo-1506452819137-0422416856b8?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="p-5 bg-black/80 backdrop-blur-md border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-1">Analog Signal</h3>
                <p className="text-xs text-gray-400">Simulating CRT monitor scanline delays.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black rounded-lg overflow-hidden border border-white/10">
              <SilkyGlitchImage 
                src="https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="p-5 bg-black/80 backdrop-blur-md border-t border-white/10">
                <h3 className="text-xl font-bold text-white mb-1">Liquid Data</h3>
                <p className="text-xs text-gray-400">High frequency sine wave distortion.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Info Box */}
        <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded p-6 text-xs text-gray-400 font-mono leading-relaxed">
          <p className="mb-2 text-cyan-400 font-bold">ALGORITHM UPDATE:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Replaced <span className="text-white">Math.random()</span> with <span className="text-white">Math.sin(t)</span> for fluid motion.</li>
            <li>Added <span className="text-white">Lerp (Linear Interpolation)</span> for smooth hover entry/exit.</li>
            <li>Using <span className="text-white">Screen Blending Mode</span> for realistic light addition (ghosting).</li>
            <li>Implemented scanline-based slicing instead of random rectangles.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default GlitchDemo;