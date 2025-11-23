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

// TODO

// <!DOCTYPE html>
// <html lang="zh-CN">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Canvas UI Replication</title>
//     <style>
//         body {
//             margin: 0;
//             overflow: hidden;
//             background-color: #050510; /* 深色背景以凸显光效 */
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//         }
//         canvas {
//             box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
//         }
//     </style>
// </head>
// <body>

// <canvas id="myCanvas"></canvas>

// <script>
//     const canvas = document.getElementById('myCanvas');
//     const ctx = canvas.getContext('2d');

//     // 设置画布尺寸
//     function resizeCanvas() {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         draw();
//     }

//     window.addEventListener('resize', resizeCanvas);

//     // 绘制圆角矩形的辅助函数
//     function roundRect(ctx, x, y, width, height, radius) {
//         ctx.beginPath();
//         ctx.moveTo(x + radius, y);
//         ctx.lineTo(x + width - radius, y);
//         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//         ctx.lineTo(x + width, y + height - radius);
//         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//         ctx.lineTo(x + radius, y + height);
//         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//         ctx.lineTo(x, y + radius);
//         ctx.quadraticCurveTo(x, y, x + radius, y);
//         ctx.closePath();
//     }

//     function draw() {
//         const w = canvas.width;
//         const h = canvas.height;
//         const centerX = w / 2;
//         const centerY = h / 2;

//         // 清空画布
//         ctx.clearRect(0, 0, w, h);

//         // --- 0. 背景 (模拟原图的深色环境) ---
//         // 为了让发光效果可见，我们需要一个深色背景
//         const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
//         bgGradient.addColorStop(0, '#0a0b1e');
//         bgGradient.addColorStop(1, '#1a102e');
//         ctx.fillStyle = bgGradient;
//         ctx.fillRect(0, 0, w, h);

//         // --- 1. 主标题: IDOL STAGE LIVE ---
//         ctx.save();
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
        
//         // 字体设置：粗体、无衬线
//         // 根据屏幕宽度动态调整字体大小
//         const titleSize = Math.min(w * 0.08, 80); 
//         ctx.font = `900 ${titleSize}px "Arial", "Helvetica", sans-serif`;

//         // 创建渐变色 (左边青色 -> 右边白色/粉色)
//         const textWidth = ctx.measureText("IDOL STAGE LIVE").width;
//         const gradient = ctx.createLinearGradient(centerX - textWidth/2, 0, centerX + textWidth/2, 0);
//         gradient.addColorStop(0, '#6eeeff'); // 青色
//         gradient.addColorStop(0.5, '#e0ffff'); // 浅青白
//         gradient.addColorStop(1, '#ffddee'); // 浅粉白

//         // 设置发光效果 (Neon Glow)
//         ctx.shadowColor = "rgba(100, 220, 255, 0.8)";
//         ctx.shadowBlur = 25;
//         ctx.fillStyle = gradient;
        
//         // 绘制文字
//         ctx.fillText("IDOL STAGE LIVE", centerX, centerY - 60);
        
//         // 再次绘制以增强高亮核心 (Optional)
//         ctx.shadowBlur = 10;
//         ctx.fillText("IDOL STAGE LIVE", centerX, centerY - 60);
//         ctx.restore();

//         // --- 2. 副标题: 未来への光、君と奏でるステージ。 ---
//         ctx.save();
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
//         const subTitleSize = Math.min(w * 0.03, 24);
//         ctx.font = `bold ${subTitleSize}px "Microsoft YaHei", "Hiragino Sans GB", sans-serif`;
//         ctx.fillStyle = "#ffffff";
        
//         // 轻微的阴影增加可读性
//         ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
//         ctx.shadowBlur = 4;
//         ctx.shadowOffsetX = 0;
//         ctx.shadowOffsetY = 2;

//         ctx.fillText("未来への光、君と奏でるステージ。", centerX, centerY + 10);
//         ctx.restore();

//         // --- 3. 按钮: 参加する ---
//         const btnWidth = Math.min(w * 0.25, 200);
//         const btnHeight = 50;
//         const btnX = centerX - btnWidth / 2;
//         const btnY = centerY + 60;
//         const radius = 25; // 圆角半径 (高度的一半形成胶囊状)

//         ctx.save();
        
//         // 3.1 按钮背景 (半透明深色)
//         roundRect(ctx, btnX, btnY, btnWidth, btnHeight, radius);
//         ctx.fillStyle = "rgba(20, 30, 50, 0.7)";
//         ctx.fill();

//         // 3.2 按钮边框 (发光渐变)
//         // 创建边框渐变
//         const borderGradient = ctx.createLinearGradient(btnX, btnY, btnX + btnWidth, btnY);
//         borderGradient.addColorStop(0, '#00ccff');
//         borderGradient.addColorStop(1, '#aa00ff');

//         ctx.lineWidth = 2;
//         ctx.strokeStyle = borderGradient;
        
//         // 边框发光
//         ctx.shadowColor = "rgba(0, 200, 255, 0.6)";
//         ctx.shadowBlur = 15;
//         ctx.stroke();

//         // 3.3 按钮文字
//         ctx.shadowBlur = 0; //文字不需要太多发光，保持清晰
//         ctx.fillStyle = "#ffffff";
//         ctx.font = `bold 18px sans-serif`;
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
//         ctx.fillText("参加する", centerX, btnY + btnHeight / 2);

//         ctx.restore();
//     }

//     // 初始化
//     resizeCanvas();

//     // 添加简单的交互效果（鼠标移动增加辉光）
//     canvas.addEventListener('mousemove', (e) => {
//         // 这里可以添加悬停检测逻辑，为演示简单起见，我们仅重绘
//         // 在实际应用中，会检测鼠标坐标是否在按钮区域内
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         // 简单的重绘，实际项目中可以在这里改变按钮样式变量
//         requestAnimationFrame(draw);
//     });

// </script>

// </body>
// </html>











