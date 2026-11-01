import { useEffect, useRef } from 'react';

export default function Embers() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    type Particle = { x: number; y: number; size: number; speed: number; sway: number; alpha: number };
    let particles: Particle[] = [];
    const reset = (randomY = false): Particle => ({
      x: Math.random() * width, y: randomY ? Math.random() * height : height + 10,
      size: Math.random() * 1 + 0.45, speed: Math.random() * 0.18 + 0.1,
      sway: Math.random() * Math.PI * 2, alpha: Math.random() * 0.3 + 0.18,
    });
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: width < 700 ? 18 : 36 }, () => reset(true));
    };
    const draw = (time: number) => {
      const delta = Math.min((time - previousTime) / 16.67 || 1, 2);
      previousTime = time;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, index) => {
        p.y -= p.speed * delta;
        p.x += Math.sin(time * 0.0003 + p.sway) * 0.12 * delta;
        if (p.y < -10) particles[index] = reset();
        const alpha = p.alpha * Math.min(1, (height - p.y) / 100, p.y / 120);
        ctx.fillStyle = `rgba(255, ${75 + index % 55}, 45, ${Math.max(0, alpha)})`;
        ctx.shadowColor = '#ff4b2c'; ctx.shadowBlur = 5;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size * 0.65, p.size * 1.25, 0.4, 0, Math.PI * 2); ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) { previousTime = 0; frame = requestAnimationFrame(draw); }
    };
    resize(); frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelAnimationFrame(frame); window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return <canvas ref={ref} className="embers" aria-hidden="true" />;
}
