import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!canvas || !dot || !ring) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Dot follows instantly
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      // Spawn particles on move
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          life: 1,
          decay: 0.015 + Math.random() * 0.02,
          size: 1.5 + Math.random() * 2,
          hue: 160 + Math.random() * 60, // cyan to green range
        });
      }

      // Cap particles using in-place splice to avoid generating garbage arrays
      if (particles.current.length > 80) {
        particles.current.splice(0, particles.current.length - 80);
      }
    };

    // Hover detection
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .project-card, .dot, .game-start-btn')) {
        ring.classList.add('hovering');
      }
    };
    const handleMouseOut = (e) => {
      if (e.target.closest('a, button, .project-card, .dot, .game-start-btn')) {
        ring.classList.remove('hovering');
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth ring follow (GPU accelerated)
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;

      // Draw & update particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        const alpha = p.life * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha * 0.15})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-canvas" />
      <div className="cursor-dot neon" ref={dotRef} />
      <div className="cursor-ring neon" ref={ringRef} />
    </>
  );
};

export default CustomCursor;
