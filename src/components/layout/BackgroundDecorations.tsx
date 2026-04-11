import { useEffect, useRef } from 'react';

const createGlowDiamondImage = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const size = 128;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

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
  ctx.rect(-radius / 2, -radius / 2, radius, radius);
  ctx.fill();

  return canvas;
};

interface ParticleConfig {
  minSpeed: number;
  maxSpeed: number;
  fadeDuration: number;
  deathChance: number;
}

class Particle {
  private config: ParticleConfig;
  x = 0;
  y = 0;
  scale = 1;
  speed = 0;
  opacity = 0;
  state: 'fadingIn' | 'alive' | 'fadingOut' = 'fadingIn';
  fadeDuration = 0;
  lifeTime = 0;

  constructor(w: number, h: number, config: ParticleConfig) {
    this.config = config;
    this.init(w, h);
  }

  init(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.scale = 1.0;
    this.speed = Math.random() * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed;
    this.opacity = 0;
    this.state = 'fadingIn';
    this.fadeDuration = this.config.fadeDuration;
    this.lifeTime = 0;
  }

  update(h: number, dt: number): boolean {
    const moveStep = this.speed * (dt / 1000);
    this.y -= moveStep;
    this.lifeTime += dt;

    if (this.state === 'fadingIn') {
      this.opacity = Math.min(1, this.lifeTime / this.fadeDuration);
      if (this.opacity >= 1) this.state = 'alive';
    } else if (this.state === 'alive') {
      if (Math.random() < this.config.deathChance * (dt / 16)) this.state = 'fadingOut';
      if (this.y < -100 || h < 0) return false;
    } else if (this.state === 'fadingOut') {
      this.opacity -= 0.001 * dt;
      if (this.opacity <= 0) return false;
    }
    return true;
  }

  draw(ctx: CanvasRenderingContext2D, particleImage: CanvasImageSource) {
    const twinkle = Math.random() * 0.05;
    ctx.globalAlpha = Math.max(0, this.opacity - twinkle);
    const drawSize = 128 * this.scale;
    ctx.drawImage(particleImage, this.x - drawSize / 2, this.y - drawSize / 2, drawSize, drawSize);
  }
}

const BackgroundDecorations = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleImageRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    let lastTime = 0;

    const isMobile = window.innerWidth < 768;
    const CONFIG = {
      count: isMobile ? 8 : 20,
      minSpeed: 10,
      maxSpeed: 25,
      fadeDuration: 1500,
      deathChance: 0.001,
    };

    particleImageRef.current = createGlowDiamondImage();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle(window.innerWidth, window.innerHeight, CONFIG));
    }

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      const safeDt = Math.min(deltaTime, 64);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = 'screen';

      particles.forEach((p) => {
        const isAlive = p.update(window.innerHeight, safeDt);
        if (isAlive && particleImageRef.current) {
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

export default BackgroundDecorations;
