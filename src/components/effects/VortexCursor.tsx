import React, { useEffect, useState, useRef } from 'react';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const VortexCursor: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  const trailPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const targetPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only run custom cursor on non-touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer, .glass-card-interactive, .water-btn-interactive')
        );
        setIsHovering(isInteractive);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple: ClickRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-6), newRipple]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth animation loop for lagging fluid wake trail
    const loop = () => {
      trailPos.current.x += (targetPos.current.x - trailPos.current.x) * 0.35;
      trailPos.current.y += (targetPos.current.y - trailPos.current.y) * 0.35;
      setPos({ x: trailPos.current.x, y: trailPos.current.y });
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Clean up old ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 700);
    return () => clearTimeout(timer);
  }, [ripples]);

  if (!isVisible) return null;

  return (
    <>
      {/* Click Vortex Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[9998] rounded-full border-2 border-cyan-400/80 animate-ping -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '36px',
            height: '36px',
          }}
        />
      ))}

      {/* Main Mini Vortex Sign Cursor */}
      <div
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out select-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.35 : 1})`,
        }}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Subtle Outer Glowing Halo on Hover */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
              isHovering
                ? 'opacity-80 bg-cyan-400/20 blur-[6px]'
                : 'opacity-40 bg-cyan-500/10 blur-[4px]'
            }`}
          />

          {/* SVG Vortex Spiral Sign (3-Arm Natural Water Whirlpool) */}
          <svg
            viewBox="0 0 40 40"
            className={`w-7 h-7 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.85)] ${
              isHovering ? 'animate-vortex-spin-fast' : 'animate-vortex-spin'
            }`}
          >
            {/* 3 Symmetrical Curved Whirlpool Spiral Arms */}
            {[0, 120, 240].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 20 20)`}>
                <path
                  d="M 20 5 C 28 5, 35 12, 35 20 C 35 26, 30 31, 24 30 C 19 29, 16 25, 17 21 C 18 18, 20 18, 21 19"
                  fill="none"
                  stroke={deg === 0 ? '#00f0ff' : deg === 120 ? '#38bdf8' : '#22d3ee'}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity={deg === 0 ? 0.95 : 0.8}
                />
              </g>
            ))}

            {/* Core Vortex Center Eye */}
            <circle cx="20" cy="20" r="3.2" fill="#ffffff" />
            <circle cx="20" cy="20" r="1.6" fill="#00f0ff" />
          </svg>

          {/* Center Precision Pointer Dot */}
          <div className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
        </div>
      </div>
    </>
  );
};
