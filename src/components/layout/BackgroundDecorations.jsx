import React, { useEffect, useRef } from 'react';

// --- 核心视觉调整：柔和光晕菱形 ---
const createGlowDiamondImage = () => {
  const canvas = document.createElement('canvas');
  // 1. 扩大画板：为了容纳巨大的柔和光晕，画板必须足够大，否则光晕会被切成方形
  const size = 128; 
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = 2; // 粒子实际大小 (菱形半径)

  // 2. 强光晕配置
  // 核心不再是纯白，而是半透明，让它看起来“透”
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; 
  
  // 3. 制造明显的辉光
  // Blur 值很大 (20)，且颜色饱和度高
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(34, 211, 238, 1)'; // 强青色光晕

  // 4. 绘制菱形
  ctx.translate(center, center);
  ctx.rotate(Math.PI / 4); // 旋转45度
  ctx.beginPath();
  // 绘制实心矩形(即旋转后的菱形)
  ctx.rect(-radius, -radius, radius * 2, radius * 2);
  ctx.fill();

  // 5. [可选] 二次叠加增强核心
  // 为了让最中心稍微亮一点点，避免看起来像一团模糊的雾
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.rect(-radius/2, -radius/2, radius, radius);
  ctx.fill();

  return canvas;
};

class Particle {
  constructor(w, h, config) {
    this.config = config;
    this.init(w, h); // 移除 isInitial 参数，统一逻辑
  }

  init(w, h) {
    this.x = Math.random() * w;
    
    // --- 核心逻辑修改：全屏随机出生 ---
    // 无论是初始化还是重生，都在屏幕任意高度生成
    // 配合 fade-in 动画，这会让粒子看起来是“慢慢浮现”的，而不是突然弹出来
    this.y = Math.random() * h;
    
    this.scale = 1.0;
    
    // 保持极慢的速度
    this.speed = Math.random() * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed;
    
    this.opacity = 0;
    this.state = 'fadingIn';
    this.fadeStep = 1 / (this.config.fadeDuration / 16.6);
  }

  update(h) {
    this.y -= this.speed;

    if (this.state === 'fadingIn') {
      this.opacity += this.fadeStep;
      if (this.opacity >= 1) {
        this.opacity = 1;
        this.state = 'alive';
      }
    } else if (this.state === 'alive') {
      // 随机消亡
      if (Math.random() < this.config.deathChance) {
        this.state = 'fadingOut';
      }
      
      // 边界检查：只有当粒子完全跑出屏幕很远才判定为死亡
      // 因为现在可以在任意位置出生，如果太靠近顶部出生，很快就会飞出去，这没关系
      if (this.y < -100) return false;
    } else if (this.state === 'fadingOut') {
      this.opacity -= this.fadeStep;
      if (this.opacity <= 0) return false;
    }
    return true;
  }

  draw(ctx, particleImage) {
    // 呼吸感 (Twinkle)
    const twinkle = Math.random() * 0.05; 
    ctx.globalAlpha = Math.max(0, this.opacity - twinkle);
    
    // 绘制离屏图片
    // 因为离屏Canvas很大(128px)以容纳光晕，绘制时保持这个尺寸，让光晕自然铺开
    // 视觉上的“粒子”看起来还是很小，但占据的像素空间包含了光晕
    const drawSize = 128 * this.scale;
    ctx.drawImage(particleImage, this.x - drawSize/2, this.y - drawSize/2, drawSize, drawSize);
  }
}

const BackgroundDecorations = () => {
  const canvasRef = useRef(null);
  const particleImageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // --- 1. 智能配置：根据屏幕宽度决定数量 ---
    const isMobile = window.innerWidth < 768; // 常见的手机/平板分界线

    const CONFIG = {
      count: isMobile ? 8 : 25,              // --- 手机优化 ---
      minSpeed: 0.1,          // 极慢
      maxSpeed: 0.3, 
      fadeDuration: 1500,     // --- 增加淡入时间 --- (让“随机出生”更自然，像是在呼吸)
      deathChance: 0.001,     // 低消亡率
    };

    // 生成素材
    particleImageRef.current = createGlowDiamondImage();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 初始化
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle(canvas.width, canvas.height, CONFIG));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 使用 screen 混合模式，确保光晕通透
      ctx.globalCompositeOperation = 'screen'; 

      particles.forEach(p => {
        const isAlive = p.update(canvas.height);
        if (isAlive) {
          p.draw(ctx, particleImageRef.current);
        } else {
          // 死亡后，重新随机生成在全屏任意位置
          p.init(canvas.width, canvas.height);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default BackgroundDecorations;