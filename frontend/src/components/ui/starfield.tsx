import { useEffect, useRef } from 'react';

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { 
      x: number; 
      y: number; 
      radius: number; 
      speedY: number; 
      speedX: number; 
      opacity: number; 
      opacitySpeed: number;
      hue: number;
      sparkle: boolean;
      sparkleFactor: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numStars; i++) {
        // High-quality stars with occasional colored hues (purple, teal, pink) and sparkles
        const hasHue = Math.random() > 0.7;
        let hue = 0; // white
        if (hasHue) {
          const rand = Math.random();
          hue = rand < 0.4 ? 270 : rand < 0.7 ? 180 : 320; // Purple, Teal, Pink HSL Hues
        }

        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.0 + 0.4, // slightly larger, crisp stars
          speedY: Math.random() * 0.15 + 0.03, // slow, majestic upward drift
          speedX: (Math.random() - 0.5) * 0.05,
          opacity: Math.random() * 0.8 + 0.2,
          opacitySpeed: (Math.random() * 0.015 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
          hue,
          sparkle: Math.random() > 0.8, // 20% of stars will have a diffraction glow flare (sparkle)
          sparkleFactor: Math.random() * 0.4 + 0.8
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        // Twinkling opacity cycles
        star.opacity += star.opacitySpeed;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.opacitySpeed = -star.opacitySpeed;
        } else if (star.opacity <= 0.15) {
          star.opacity = 0.15;
          star.opacitySpeed = -star.opacitySpeed;
        }

        // Slow movement drift
        star.y -= star.speedY;
        star.x += star.speedX;

        // Loop constraints
        if (star.y < -20) {
          star.y = canvas.height + 20;
          star.x = Math.random() * canvas.width;
        }
        if (star.x < -20) {
          star.x = canvas.width + 20;
        } else if (star.x > canvas.width + 20) {
          star.x = -20;
        }

        // Set rendering colors (neon glow matches ContentOS color palette)
        ctx.globalAlpha = star.opacity;
        if (star.hue === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        } else {
          ctx.fillStyle = `hsla(${star.hue}, 100%, 85%, 1)`;
          ctx.shadowColor = `hsla(${star.hue}, 100%, 65%, 0.5)`;
        }
        ctx.shadowBlur = star.radius * 3;

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw elegant cross-flare sparkle on selected premium stars
        if (star.sparkle && star.opacity > 0.4) {
          ctx.strokeStyle = star.hue === 0 ? 'rgba(255, 255, 255, 0.45)' : `hsla(${star.hue}, 100%, 80%, 0.45)`;
          ctx.lineWidth = 0.5;
          
          const flareLength = star.radius * 4 * star.sparkleFactor;
          
          ctx.beginPath();
          // Horizontal Flare
          ctx.moveTo(star.x - flareLength, star.y);
          ctx.lineTo(star.x + flareLength, star.y);
          // Vertical Flare
          ctx.moveTo(star.x, star.y - flareLength);
          ctx.lineTo(star.x, star.y + flareLength);
          ctx.stroke();
        }
      });

      // Reset shadow parameters for performance
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

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
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-85"
      style={{ background: 'transparent' }}
    />
  );
}
