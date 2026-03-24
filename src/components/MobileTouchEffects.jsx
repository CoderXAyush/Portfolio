import { useEffect, useRef } from 'react';

const MobileTouchEffects = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const ambientParticles = useRef([]);
  const animId = useRef(null);
  const dpr = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    dpr.current = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr.current;
      canvas.height = h * dpr.current;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr.current, dpr.current);
    };
    resize();

    // Seed ambient floating particles
    const seedAmbient = () => {
      ambientParticles.current = [];
      const w = window.innerWidth;
      const h = window.innerHeight * 3; // Cover scroll height
      for (let i = 0; i < 35; i++) {
        ambientParticles.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 1 + Math.random() * 2.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: -0.15 - Math.random() * 0.3,
          opacity: 0.1 + Math.random() * 0.25,
          hue: 155 + Math.random() * 50,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02,
        });
      }
    };
    seedAmbient();

    // Burst particles on touch/click
    const spawnBurst = (x, y) => {
      const count = 12 + Math.floor(Math.random() * 8);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 4;
        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.015 + Math.random() * 0.015,
          size: 2 + Math.random() * 3,
          hue: 150 + Math.random() * 70,
          type: 'burst',
        });
      }
      // Add a ring ripple
      particles.current.push({
        x,
        y,
        vx: 0,
        vy: 0,
        life: 1,
        decay: 0.025,
        size: 5,
        hue: 170,
        type: 'ring',
        radius: 3,
      });
    };

    // Trail particles on swipe/drag
    const spawnTrail = (x, y) => {
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 1,
          decay: 0.025 + Math.random() * 0.02,
          size: 1.5 + Math.random() * 2,
          hue: 160 + Math.random() * 50,
          type: 'trail',
        });
      }
    };

    // Event handlers
    const getScrollOffset = () => {
      const mobileMode = document.querySelector('.page.mobile-mode');
      return mobileMode ? mobileMode.scrollTop : 0;
    };

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      spawnBurst(touch.clientX, touch.clientY + getScrollOffset());
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      spawnTrail(touch.clientX, touch.clientY + getScrollOffset());
    };

    let isMouseDown = false;
    const onMouseDown = (e) => {
      isMouseDown = true;
      spawnBurst(e.clientX, e.clientY + getScrollOffset());
    };

    const onMouseMove = (e) => {
      if (isMouseDown) {
        spawnTrail(e.clientX, e.clientY + getScrollOffset());
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    // Cap particles
    const cap = () => {
      if (particles.current.length > 150) {
        particles.current.splice(0, particles.current.length - 150);
      }
    };

    // Main animation loop
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scrollY = getScrollOffset();

      ctx.setTransform(dpr.current, 0, 0, dpr.current, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Draw ambient floating particles (parallax with scroll)
      for (const p of ambientParticles.current) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        // Wrap around
        if (p.y < -10) p.y = h * 3;
        if (p.x < -10) p.x = w;
        if (p.x > w + 10) p.x = 0;

        // Only draw if visible in current viewport
        const screenY = p.y - scrollY;
        if (screenY < -20 || screenY > h + 20) continue;

        const pulseAlpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Core
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${pulseAlpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${pulseAlpha * 0.12})`;
        ctx.fill();
      }

      // Draw touch/click particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        const screenY = p.y - scrollY;

        if (p.type === 'ring') {
          p.radius += 2.5;
          ctx.beginPath();
          ctx.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 65%, ${p.life * 0.5})`;
          ctx.lineWidth = 1.5 * p.life;
          ctx.stroke();
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;

          const alpha = p.life * 0.7;

          // Core
          ctx.beginPath();
          ctx.arc(p.x, screenY, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
          ctx.fill();

          // Glow
          ctx.beginPath();
          ctx.arc(p.x, screenY, p.size * p.life * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha * 0.15})`;
          ctx.fill();
        }
      }

      cap();
      animId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseup', onMouseUp);
    animate();

    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9990,
      }}
    />
  );
};

export default MobileTouchEffects;
