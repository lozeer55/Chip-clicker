

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const PARTICLE_COLORS = ['#a855f7', '#d946ef', '#f472b6', '#ecf0f1', '#a78bfa', '#c084fc'];
const BOOSTED_PARTICLE_COLORS = ['#ffffff', '#fbcfe8', '#f472b6', '#d946ef', '#c084fc'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  shape: 'circle' | 'square' | 'line' | 'star' | 'shockwave';
  rotation: number;
  rotationSpeed: number;
}

export interface ParticleCanvasHandle {
  createBurst: (x: number, y: number, isBoosted: boolean, amount: number) => void;
}

const ParticleCanvas = forwardRef<ParticleCanvasHandle, {}>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    createBurst: (x, y, isBoosted, amount) => {
      const newParticles: Particle[] = [];
      if (isBoosted) {
          const numParticles = 20 + Math.floor(Math.log2(amount + 1)) * 3;
          const speed = 4 + Math.log2(amount + 1) * 0.5;
          const shapes: Array<'star' | 'circle'> = ['star', 'circle'];

          for (let i = 0; i < numParticles; i++) {
              const angle = Math.random() * Math.PI * 2;
              const currentSpeed = 1 + (Math.random() * speed);
              const life = 60 + Math.random() * 40;
              const size = 5 + Math.random() * 10;
              newParticles.push({
                  x, y,
                  vx: Math.cos(angle) * currentSpeed,
                  vy: Math.sin(angle) * currentSpeed - 2,
                  size,
                  color: BOOSTED_PARTICLE_COLORS[Math.floor(Math.random() * BOOSTED_PARTICLE_COLORS.length)],
                  life,
                  maxLife: life,
                  shape: shapes[Math.floor(Math.random() * shapes.length)],
                  rotation: Math.random() * Math.PI * 2,
                  rotationSpeed: (Math.random() - 0.5) * 0.2,
              });
          }

          // Add sparks for boosted clicks
          const numSparks = 15 + Math.floor(Math.log2(amount + 1)) * 3;
          for (let i = 0; i < numSparks; i++) {
              const angle = Math.random() * Math.PI * 2;
              const sparkSpeed = speed * (1.2 + Math.random() * 0.8);
              const life = 25 + Math.random() * 20;
              newParticles.push({
                  x, y,
                  vx: Math.cos(angle) * sparkSpeed,
                  vy: Math.sin(angle) * sparkSpeed,
                  size: 5 + Math.random() * 10, // Length of the spark
                  color: ['#ffffff', '#fbcfe8', '#f0abfc'][Math.floor(Math.random() * 3)],
                  life,
                  maxLife: life,
                  shape: 'line',
                  rotation: angle, // Align with velocity
                  rotationSpeed: 0,
              });
          }

          // Add a shockwave for boosted clicks
          const shockwaveLife = 30;
          newParticles.push({
              x, y, vx: 0, vy: 0,
              size: 10, // Initial radius
              color: BOOSTED_PARTICLE_COLORS[2],
              life: shockwaveLife,
              maxLife: shockwaveLife,
              shape: 'shockwave',
              rotation: 0, rotationSpeed: 0,
          });

      } else {
          const numParticles = Math.min(20, 5 + Math.floor(amount / 25));
          const speed = Math.min(5, 2 + amount * 0.02);
          const shapes: Array<'circle' | 'square'> = ['circle', 'square'];

          for (let i = 0; i < numParticles; i++) {
              const angle = Math.random() * Math.PI * 2;
              const currentSpeed = 1 + (Math.random() * speed);
              const life = 40 + Math.random() * 30;
              const size = 2 + Math.random() * 6;
              newParticles.push({
                  x, y,
                  vx: Math.cos(angle) * currentSpeed,
                  vy: Math.sin(angle) * currentSpeed - 1,
                  size,
                  color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
                  life,
                  maxLife: life,
                  shape: shapes[Math.floor(Math.random() * shapes.length)],
                  rotation: Math.random() * Math.PI * 2,
                  rotationSpeed: (Math.random() - 0.5) * 0.1,
              });
          }
      }
      particlesRef.current.push(...newParticles);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    };


    const animate = () => {
      // PERFORMANCE OPTIMIZATION: Use clearRect for fast, full canvas clearing
      // This is much faster than filling with a semi-transparent color
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.size = Math.max(0, p.size * 0.99);

        // Physics
        if (p.shape === 'line') { // Sparks decelerate
            p.vx *= 0.95;
            p.vy *= 0.95;
        } else if (p.shape !== 'shockwave') {
            p.vy += 0.08; // Gravity for others
        }
        
        if (p.shape !== 'line' && p.shape !== 'shockwave') {
            p.rotation += p.rotationSpeed;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // PERFORMANCE OPTIMIZATION: Removed shadowBlur and shadowColor.
        // These properties are computationally expensive and can cause major frame drops
        // when many particles are on screen.

        switch (p.shape) {
            case 'shockwave': {
                const progress = p.life / p.maxLife;
                ctx.beginPath();
                ctx.arc(0, 0, p.size + (p.maxLife - p.life) * 2, 0, Math.PI * 2);
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 3 * progress;
                ctx.stroke();
                break;
            }
            case 'line': { // Render sparks as lines
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1 + p.size / 5;
                ctx.beginPath();
                ctx.moveTo(-p.size / 2, 0);
                ctx.lineTo(p.size / 2, 0);
                ctx.stroke();
                break;
            }
            case 'square':
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                break;
            case 'star':
                ctx.fillStyle = p.color;
                drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
                ctx.fill();
                break;
            case 'circle':
            default:
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
});

export default ParticleCanvas;