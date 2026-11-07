import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Terminal, Zap, Gauge, Code2, Sparkles, Layers } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  depth: number;
  pulsePhase: number;
}

export function CyberBackground3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [ecoMode, setEcoMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('futech_eco_mode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleEcoChange = (e: any) => {
      setEcoMode(e.detail ?? false);
    };
    window.addEventListener('futech_eco_mode_changed', handleEcoChange);
    return () => window.removeEventListener('futech_eco_mode_changed', handleEcoChange);
  }, []);

  useEffect(() => {
    if (ecoMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isVisible = true;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Pause when tab is hidden or user scrolls far down past hero
    const handleVisibility = () => {
      isVisible = !document.hidden && window.scrollY < 1400;
    };
    document.addEventListener('visibilitychange', handleVisibility, { passive: true });
    window.addEventListener('scroll', handleVisibility, { passive: true });

    // Optimized particle count (22 nodes is lightweight and gives high 60fps performance)
    const particleCount = Math.min(Math.floor(width / 55), 24);
    const colors = ['#00f2fe', '#38bdf8', '#2dd4bf', '#818cf8', '#34d399'];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 1.8,
        alpha: Math.random() * 0.35 + 0.45,
        color: colors[i % colors.length],
        depth: Math.random() * 0.6 + 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    // Mouse movement updates DOM directly via transform without React re-renders!
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
        spotlightRef.current.style.opacity = '0.4';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;
    let lastTime = performance.now();

    // High performance 60fps render loop (NO shadowBlur, pure hardware-accelerated 2D)
    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      // Frame rate throttling for buttery performance
      const delta = currentTime - lastTime;
      if (delta < 15) return; // Cap at ~60fps
      lastTime = currentTime;

      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Draw particles and lightweight filaments
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx * p1.depth;
        p1.y += p1.vy * p1.depth;

        // Wrap edges
        if (p1.x < -10) p1.x = width + 10;
        if (p1.x > width + 10) p1.x = -10;
        if (p1.y < -10) p1.y = height + 10;
        if (p1.y > height + 10) p1.y = -10;

        // Mouse repelling force (optimized distance check)
        const dx = mouseX - p1.x;
        const dy = mouseY - p1.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 22500) { // 150px squared
          const dist = Math.sqrt(distSq);
          const force = (150 - dist) / 150;
          p1.x -= (dx / dist) * force * 2;
          p1.y -= (dy / dist) * force * 2;
        }

        const currentSize = p1.size * (1 + 0.15 * Math.sin(time + p1.pulsePhase));

        // Concentric glow halo (Extremely fast, 0ms blur cost)
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha * 0.18;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha;
        ctx.fill();

        // Lightweight connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ldx = p1.x - p2.x;
          const ldy = p1.y - p2.y;
          const ldistSq = ldx * ldx + ldy * ldy;
          if (ldistSq < 10000) { // 100px squared
            const ldist = Math.sqrt(ldistSq);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = (1 - ldist / 100) * 0.32;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('scroll', handleVisibility);
    };
  }, [ecoMode]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. Hardware Accelerated Cursor Spotlight (Zero React lag) */}
      {/* ──────────────────────────────────────────────────────── */}
      {!ecoMode && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-300 will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(0,242,254,0.22) 0%, rgba(56,189,248,0.12) 35%, transparent 70%)',
            transform: 'translate3d(-1000px, -1000px, 0)',
          }}
        />
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. Soft Ambient Radial Aurora Clouds (Zero Gaussian Blur) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-[650px] w-[650px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0,242,254,0.14) 0%, rgba(45,212,191,0.06) 40%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-24 h-[650px] w-[650px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-[600px] w-[600px] rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)',
        }}
      />

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. 3D Perspective Runway Grid (GPU Composited)           */}
      {/* ──────────────────────────────────────────────────────── */}
      {!ecoMode && (
        <div className="absolute top-0 left-0 right-0 h-[750px] opacity-20 dark:opacity-30 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] pointer-events-none">
          <div
            className="h-full w-full will-change-transform"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(6, 182, 212, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(14, 165, 233, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              transform: 'perspective(550px) rotateX(54deg) translateY(-85px)',
              transformOrigin: 'top center',
            }}
          />

          {/* Sweeping Laser Line (Subtle Ambient Glow, No Glare) */}
          <div
            className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f2fe]/60 via-cyan-300/80 to-transparent shadow-[0_0_12px_#00f2fe] will-change-transform opacity-60"
            style={{
              top: '35%',
            }}
          />
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. Optimized Floating 3D Cyber Polyhedrons (Composite)   */}
      {/* ──────────────────────────────────────────────────────── */}
      {!ecoMode && (
        <>
          {/* 3D Shape 1: Top-Right Gyro-Cube */}
          <div
            style={{ transformStyle: 'preserve-3d', perspective: 1000, willChange: 'transform' }}
            className="absolute top-28 right-[8%] hidden lg:block animate-pulse"
          >
            <div className="relative h-18 w-18">
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/60 bg-white/95 shadow-xl shadow-cyan-500/10 backdrop-blur-md dark:border-cyan-400/70 dark:bg-[#071322]/90 dark:shadow-[0_0_35px_rgba(0,242,254,0.35)]" />
              <div className="absolute inset-3 rounded-xl border border-teal-400 bg-cyan-400/20 rotate-45 dark:border-cyan-300 dark:bg-cyan-400/30" />
              <div
                className="absolute -inset-2.5 rounded-full border border-dashed border-cyan-400/40 animate-spin dark:border-cyan-300/60"
                style={{ animationDuration: '14s' }}
              />
            </div>
          </div>

          {/* 3D Shape 2: Mid-Left Floating Prism */}
          <div
            style={{ transformStyle: 'preserve-3d', perspective: 1000, willChange: 'transform' }}
            className="absolute top-1/2 left-[5%] hidden xl:block"
          >
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-3xl border-2 border-purple-400/60 bg-white/95 shadow-xl shadow-purple-500/10 rotate-45 backdrop-blur-md dark:border-purple-400/70 dark:bg-[#100d28]/90 dark:shadow-[0_0_35px_rgba(168,85,247,0.35)]" />
              <div className="absolute inset-3.5 rounded-2xl border border-cyan-400/60 bg-cyan-400/20 -rotate-12 dark:border-purple-300 dark:bg-purple-400/30" />
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 5. 3D Holographic Orbit Nodes (Replacing Pill Badges)    */}
          {/* ──────────────────────────────────────────────────────── */}
          {/* Top-Left: 3D Holographic Quantum Gyroscope Ring */}
          <div
            style={{ transformStyle: 'preserve-3d', perspective: 1000, willChange: 'transform' }}
            className="absolute top-36 left-[7%] hidden lg:block"
          >
            <div className="relative h-20 w-20 flex items-center justify-center">
              {/* Outer Orbital Neon Ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin dark:border-cyan-300/70"
                style={{ animationDuration: '18s' }}
              />
              {/* Counter-Rotating Slanted Ring */}
              <div
                className="absolute inset-2 rounded-full border border-teal-400/60 dark:border-cyan-400/80"
                style={{
                  transform: 'rotateX(65deg) rotateY(25deg)',
                  boxShadow: '0 0 15px rgba(0, 242, 254, 0.35)',
                }}
              />
              {/* Central Frosted Glass Core with Code Glyph */}
              <div className="relative h-10 w-10 rounded-2xl border border-cyan-400/60 bg-white/95 dark:bg-[#061527]/95 dark:border-cyan-400/70 dark:shadow-[0_0_25px_rgba(0,242,254,0.4)] shadow-lg shadow-cyan-500/20 backdrop-blur-md flex items-center justify-center transform hover:scale-110 transition-transform">
                <Code2 size={18} className="text-cyan-600 dark:text-cyan-300 animate-pulse" />
              </div>
              {/* Orbital Mini Satellite Dot */}
              <div
                className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f2fe] animate-ping"
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>

          {/* Lower-Right: 3D Holographic Cryptographic Crystal Prism */}
          <div
            style={{ transformStyle: 'preserve-3d', perspective: 1000, willChange: 'transform' }}
            className="absolute top-2/3 right-[6%] hidden lg:block"
          >
            <div className="relative h-20 w-20 flex items-center justify-center">
              {/* Outer Pulsing Aura Ring */}
              <div
                className="absolute inset-0 rounded-3xl border-2 border-indigo-400/50 bg-gradient-to-tr from-indigo-500/10 via-cyan-400/10 to-transparent rotate-45 shadow-xl shadow-indigo-500/15 backdrop-blur-md animate-pulse dark:border-indigo-400/70 dark:shadow-[0_0_30px_rgba(99,102,241,0.35)]"
                style={{ animationDuration: '4s' }}
              />
              {/* Inner Diamond Core */}
              <div
                className="absolute inset-3 rounded-2xl border border-indigo-400/60 bg-white/95 dark:bg-[#0c142c]/95 dark:border-indigo-400/70 -rotate-12 shadow-inner flex items-center justify-center"
              >
                <Lock size={16} className="text-indigo-600 dark:text-indigo-300" />
              </div>
              {/* Cyber Corner Sparks */}
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8] animate-ping" />
            </div>
          </div>
        </>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 6. High-Performance Canvas Particles                     */}
      {/* ──────────────────────────────────────────────────────── */}
      {!ecoMode && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none will-change-contents" />
      )}
    </div>
  );
}
