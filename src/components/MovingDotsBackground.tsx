import React, { useRef, useEffect } from 'react';

const MOVING_DOTS = 60;
const COLORS = [
  'rgba(255, 244, 214, 0.85)', // warm light
  'rgba(255, 193, 7, 0.7)',    // gold
  'rgba(255, 87, 34, 0.5)',    // deep orange
  'rgba(255, 255, 255, 0.5)',  // white
  'rgba(255, 214, 10, 0.4)',   // yellow
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const MovingDotsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef(
    Array.from({ length: MOVING_DOTS }, () => ({
      x: randomBetween(0, 1),
      y: randomBetween(0, 1),
      r: randomBetween(1.5, 3.5),
      dx: randomBetween(-0.03, 0.03),
      dy: randomBetween(-0.02, 0.02),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId: number;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const dot of dots.current) {
        ctx.beginPath();
        ctx.arc(dot.x * canvas.width, dot.y * canvas.height, dot.r, 0, 2 * Math.PI);
        ctx.fillStyle = dot.color;
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
        // Move
        dot.x += dot.dx * 0.2;
        dot.y += dot.dy * 0.2;
        // Bounce
        if (dot.x < 0 || dot.x > 1) dot.dx *= -1;
        if (dot.y < 0 || dot.y > 1) dot.dy *= -1;
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[-25] pointer-events-none"
      style={{ background: 'none' }}
      aria-hidden="true"
    />
  );
};

export default MovingDotsBackground;

