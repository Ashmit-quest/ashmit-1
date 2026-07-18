import { useEffect, useRef } from 'react';

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; radius: number; speedY: number; speedX: number; opacity: number; opacitySpeed: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      // Calculate number of stars based on screen size
      const numStars = Math.floor((canvas.width * canvas.height) / 7000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2 + 0.2,
          speedY: Math.random() * 0.2 + 0.05,
          speedX: (Math.random() - 0.5) * 0.1,
          opacity: Math.random(),
          opacitySpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';

      stars.forEach(star => {
        // Twinkling effect
        star.opacity += star.opacitySpeed;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.opacitySpeed = -star.opacitySpeed;
        } else if (star.opacity <= 0.1) {
          star.opacity = 0.1;
          star.opacitySpeed = -star.opacitySpeed;
        }

        // Upward movement
        star.y -= star.speedY;
        star.x += star.speedX;

        // Reset if goes off screen
        if (star.y < -10) {
          star.y = canvas.height + 10;
          star.x = Math.random() * canvas.width;
        }
        if (star.x < -10) {
          star.x = canvas.width + 10;
        } else if (star.x > canvas.width + 10) {
          star.x = -10;
        }

        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-60"
      style={{ background: 'transparent' }}
    />
  );
}
