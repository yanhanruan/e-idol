import React, { useEffect, useRef } from 'react';

// --- 素材生成逻辑 (保持不变) ---
const createGlowDiamondImage = () => {
  const canvas = document.createElement('canvas');
  const size = 128; 
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const center = size / 2;
  const radius = 2;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; 
  ctx.shadowBlur = 20;
  ctx.shadowColor = 'rgba(34, 211, 238, 1)';

  ctx.translate(center, center);
  ctx.rotate(Math.PI / 4);
  ctx.beginPath();
  ctx.rect(-radius, -radius, radius * 2, radius * 2);
  ctx.fill();

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
    this.init(w, h);
  }

  init(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.scale = 1.0;
    
    // 速度单位改为：像素/每秒 (Pixels Per Second)
    // 之前是 0.1~0.3 像素/每帧。假设60fps，相当于 6~18 px/s
    // 我们设定为 10 ~ 25 px/s，保证极慢但可见
    this.speed = Math.random() * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed;
    
    this.opacity = 0;
    this.state = 'fadingIn';
    // 淡入速度也基于时间 (1秒完成)
    this.fadeDuration = this.config.fadeDuration; 
    this.lifeTime = 0; // 记录存活时间
  }

  // --- 关键修改：接收 deltaTime (时间增量) ---
  update(h, dt) {
    // 1. 基于时间的移动： 速度 * (经过的秒数)
    // 这样无论 60Hz 还是 120Hz 还是卡顿，移动距离都是平滑的
    const moveStep = this.speed * (dt / 1000); 
    this.y -= moveStep;
    this.lifeTime += dt;

    if (this.state === 'fadingIn') {
      // 计算当前透明度： 存活时间 / 总淡入时间
      this.opacity = Math.min(1, this.lifeTime / this.fadeDuration);
      if (this.opacity >= 1) {
        this.state = 'alive';
      }
    } else if (this.state === 'alive') {
      // 随机消亡 (概率需要根据 dt 调整，保证不同帧率下概率一致)
      // 这里的简化处理：每秒约 5% 概率死亡
      if (Math.random() < this.config.deathChance * (dt / 16)) {
        this.state = 'fadingOut';
      }
      if (this.y < -100) return false;
    } else if (this.state === 'fadingOut') {
      // 简单的线性递减
      this.opacity -= 0.001 * dt; // 约1秒淡出
      if (this.opacity <= 0) return false;
    }
    return true;
  }

  draw(ctx, particleImage) {
    const twinkle = Math.random() * 0.05; 
    ctx.globalAlpha = Math.max(0, this.opacity - twinkle);
    const drawSize = 128 * this.scale;
    // Math.floor 优化：有时强制整数坐标能解决某些特定机型的抖动，
    // 但配合 DPR 优化后，直接用浮点数通常更丝滑。
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
    let lastTime = 0; // 用于计算时间增量

    // 判断移动端
    const isMobile = window.innerWidth < 768;

    const CONFIG = {
      count: isMobile ? 8 : 20,
      // 速度单位：像素/秒
      minSpeed: 10, 
      maxSpeed: 25, 
      fadeDuration: 1500,
      deathChance: 0.001,
    };

    particleImageRef.current = createGlowDiamondImage();

    // --- 核心优化 1: 高清屏 (Retina/High-DPI) 适配 ---
    const resizeCanvas = () => {
      // 获取设备像素比 (通常是 2 或 3)
      const dpr = window.devicePixelRatio || 1;
      
      // 设置 Canvas 的内部“物理分辨率” (变大)
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // 设置 Canvas 的 CSS“显示尺寸” (保持不变)
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // 关键：缩放绘图上下文，让我们依然可以用逻辑像素坐标思考
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 初始化 (注意：这里传入的是逻辑宽高，因为我们已经 scale 了 context)
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle(window.innerWidth, window.innerHeight, CONFIG));
    }

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      // 计算两帧之间的时间差 (ms)
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // 限制最大 dt，防止切换标签页回来后粒子瞬移
      const safeDt = Math.min(deltaTime, 64);

      // 清空画布 (使用逻辑尺寸)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'screen'; 

      particles.forEach(p => {
        // --- 核心优化 2: 传入 dt 确保平滑 ---
        const isAlive = p.update(window.innerHeight, safeDt);
        if (isAlive) {
          p.draw(ctx, particleImageRef.current);
        } else {
          p.init(window.innerWidth, window.innerHeight);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

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