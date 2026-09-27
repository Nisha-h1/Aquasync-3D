import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
}

export const WaterFlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseDistAccumulatorRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize aquatic bubbles
    const bubbleCount = 45;
    bubblesRef.current = [];
    for (let i = 0; i < bubbleCount; i++) {
      bubblesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1.2,
        speed: Math.random() * 0.6 + 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.4 + 0.15
      });
    }

    // Interactive mouse listeners
    const addRipple = (x: number, y: number, initialRadius: number = 5, maxRadius: number = 140) => {
      if (ripplesRef.current.length > 25) {
        ripplesRef.current.shift();
      }
      ripplesRef.current.push({
        x,
        y,
        radius: initialRadius,
        maxRadius,
        alpha: 0.65,
        speed: 2.2
      });
    };

    const handlePointerMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      mouseDistAccumulatorRef.current += dist;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      // Spawn a ripple every 45px of mouse movement
      if (mouseDistAccumulatorRef.current > 45) {
        addRipple(e.clientX, e.clientY, 8, 90);
        mouseDistAccumulatorRef.current = 0;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Big ripple on click
      addRipple(e.clientX, e.clientY, 10, 180);
      addRipple(e.clientX, e.clientY, 25, 140);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    // Water Animation Loop
    let time = 0;

    const render = () => {
      time += 0.012;

      // 1. Clear background with deep aquatic navy gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020612');
      bgGrad.addColorStop(0.4, '#040d22');
      bgGrad.addColorStop(0.8, '#030a1b');
      bgGrad.addColorStop(1, '#020510');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Caustic light wave reflection overlay
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const causticGrad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(time * 0.8) * (width * 0.2),
        height * 0.3 + Math.cos(time * 0.6) * (height * 0.15),
        20,
        width * 0.5,
        height * 0.3,
        width * 0.75
      );
      causticGrad.addColorStop(0, 'rgba(0, 240, 255, 0.07)');
      causticGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.04)');
      causticGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = causticGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Flowing Water Sine Waves (Bottom & Top layers)
      const drawWave = (
        yOffset: number,
        amplitude: number,
        frequency: number,
        speed: number,
        colorStart: string,
        colorEnd: string,
        alpha: number
      ) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 12) {
          const y =
            yOffset +
            Math.sin(x * frequency + time * speed) * amplitude +
            Math.cos(x * frequency * 0.5 - time * speed * 0.7) * (amplitude * 0.5);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, yOffset - amplitude, 0, height);
        waveGrad.addColorStop(0, colorStart);
        waveGrad.addColorStop(1, colorEnd);
        ctx.fillStyle = waveGrad;
        ctx.fill();
        ctx.restore();
      };

      // Background subtle waves
      drawWave(height * 0.85, 32, 0.002, 1.2, 'rgba(6, 182, 212, 0.12)', 'rgba(2, 6, 23, 0.6)', 0.5);
      drawWave(height * 0.78, 24, 0.003, -0.9, 'rgba(14, 165, 233, 0.10)', 'rgba(3, 10, 28, 0.4)', 0.6);
      drawWave(height * 0.90, 40, 0.0018, 1.5, 'rgba(0, 240, 255, 0.08)', 'rgba(2, 8, 20, 0.7)', 0.7);

      // Top delicate wave current
      drawWave(height * 0.12, 18, 0.0025, 0.8, 'rgba(56, 189, 248, 0.05)', 'transparent', 0.4);

      // 4. Update and render rising water micro-bubbles
      ctx.save();
      bubblesRef.current.forEach((b) => {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobble) * 1.5;

        // Reset if reaches top
        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${b.opacity})`;
        ctx.fill();

        // Bubble highlight glint
        ctx.beginPath();
        ctx.arc(currentX - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 1.2})`;
        ctx.fill();
      });
      ctx.restore();

      // 5. Update and render interactive ripples
      ctx.save();
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.alpha -= 0.012;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        // Outer water ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = `rgba(0, 240, 255, ${r.alpha})`;
        ctx.stroke();

        // Secondary interior ripple
        if (r.radius > 16) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.68, 0, Math.PI * 2);
          ctx.lineWidth = 1.0;
          ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha * 0.6})`;
          ctx.stroke();
        }
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
