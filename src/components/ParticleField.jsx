import { useEffect, useRef } from 'react';

export default function ParticleField() {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = Math.min(160, Math.floor((width * height) / 22000));
    particlesRef.current = new Array(particleCount).fill(0).map(() => (
      createParticle(width, height)
    ));

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // subtle vignette background
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, 'rgba(0,10,20,0.1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life <= 0) {
          Object.assign(p, createParticle(width, height));
        }
        const alpha = Math.max(0, Math.min(1, p.life));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(${p.color}, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-70" aria-hidden="true"
    />
  );
}

function createParticle(width, height) {
  const palette = [
    '34,211,238', // cyan-400
    '168,85,247', // purple-500
    '236,72,153', // pink-500
    '56,189,248', // sky-400
  ];
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 1.8 + 0.6,
    color: palette[Math.floor(Math.random() * palette.length)],
    life: Math.random() * 0.8 + 0.2,
  };
}
