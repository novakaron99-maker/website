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
      size: Math.random() * 1.2 + 0.8, speed: Math.random() * 0.24 + 0.18,
      sway: Math.random() * Math.PI * 2, alpha: Math.random() * 0.35 + 0.5,
    });
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: width < 700 ? 30 : 64 }, () => reset(true));
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
        const brightness = Math.max(0, alpha);
        ctx.fillStyle = `rgba(255, ${110 + index % 65}, 55, ${brightness})`;
        ctx.shadowColor = '#ff542b'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size * 0.75, p.size * 1.4, 0.3, 0, Math.PI * 2); ctx.fill();
        // A warm, crisp center keeps small sparks visible on high-density phone displays.
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 205, 135, ${brightness * .85})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * .35, 0, Math.PI * 2); ctx.fill();
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
