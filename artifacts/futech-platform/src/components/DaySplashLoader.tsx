import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface DaySplashLoaderProps {
  onComplete: () => void;
}

// -------------------------------------------------------------
// 3D Wireframe Polyhedron (Icosahedron) Math & Canvas Renderer
// -------------------------------------------------------------
const PHI = (1 + Math.sqrt(5)) / 2;
// 12 Normalized Vertices of an Icosahedron
const ICO_VERTICES: [number, number, number][] = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
].map(([x, y, z]) => {
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len];
});

// Calculate the 30 Edges (pairs of vertices connected by distance)
const ICO_EDGES: [number, number][] = [];
for (let i = 0; i < ICO_VERTICES.length; i++) {
  for (let j = i + 1; j < ICO_VERTICES.length; j++) {
    const [x1, y1, z1] = ICO_VERTICES[i];
    const [x2, y2, z2] = ICO_VERTICES[j];
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dz = z1 - z2;
    const distSq = dx * dx + dy * dy + dz * dz;
    // For normalized icosahedron, connected vertices have distSq approx 1.05
    if (distSq < 1.2) {
      ICO_EDGES.push([i, j]);
    }
  }
}

function WireframeIcosahedron3D({ mouseOffset }: { mouseOffset: { x: number; y: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleX = 0.2;
    let angleY = 0.4;
    let angleZ = 0.1;

    const size = 300;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const radius = 105;
    const focalLength = 320;
    const cx = size / 2;
    const cy = size / 2;

    const render = () => {
      // Natural idle rotation + dynamic mouse tracking
      angleY += 0.009 + mouseOffset.x * 0.02;
      angleX += 0.006 + mouseOffset.y * 0.02;
      angleZ += 0.003;

      ctx.clearRect(0, 0, size, size);

      // Precalculate Sin / Cos
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Rotate and Project Vertices
      const projected = ICO_VERTICES.map(([vx, vy, vz]) => {
        // Rotate Y
        let x1 = vx * cosY + vz * sinY;
        let y1 = vy;
        let z1 = -vx * sinY + vz * cosY;

        // Rotate X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Rotate Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        // Scale by radius
        x3 *= radius;
        y3 *= radius;
        z3 *= radius;

        // 3D Perspective Projection
        const scale = focalLength / (focalLength + z3);
        const px = cx + x3 * scale;
        const py = cy + y3 * scale;

        return { px, py, z: z3, scale };
      });

      // Draw 3D Edges
      for (const [i, j] of ICO_EDGES) {
        const p1 = projected[i];
        const p2 = projected[j];

        // Depth-based opacity: edges closer to camera are crisper
        const avgZ = (p1.z + p2.z) / 2;
        const depthAlpha = Math.max(0.12, Math.min(0.55, 0.35 + (avgZ / radius) * 0.25));

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = `rgba(13, 148, 136, ${depthAlpha})`;
        ctx.lineWidth = Math.max(1, 1.8 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();
      }

      // Draw Glowing 3D Vertices
      for (const p of projected) {
        const dotAlpha = Math.max(0.2, Math.min(0.9, 0.55 + (p.z / radius) * 0.35));
        const dotRadius = Math.max(1.8, 3.2 * p.scale);

        // Vertex core
        ctx.beginPath();
        ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${dotAlpha})`;
        ctx.fill();

        // Vertex glow
        ctx.beginPath();
        ctx.arc(p.px, p.py, dotRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(20, 184, 166, ${dotAlpha * 0.25})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mouseOffset]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 300, height: 300 }}
      className="pointer-events-none absolute -inset-8 m-auto select-none opacity-85"
    />
  );
}

// -------------------------------------------------------------
// Pure CSS 3D Polyhedral Object: Rotating Glass Cube
// -------------------------------------------------------------
function FloatingGlassCube3D({ size = 52, className = '' }: { size?: number; className?: string }) {
  const half = size / 2;
  return (
    <motion.div
      animate={{
        rotateX: [0, 360],
        rotateY: [360, 0],
        rotateZ: [0, 180, 0],
        y: [-12, 12, -12],
      }}
      transition={{
        rotateX: { duration: 18, repeat: Infinity, ease: 'linear' },
        rotateY: { duration: 24, repeat: Infinity, ease: 'linear' },
        rotateZ: { duration: 32, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Front */}
      <div
        className="absolute inset-0 rounded-xl border border-teal-500/50 bg-gradient-to-br from-teal-400/20 to-cyan-500/10 backdrop-blur-2xs shadow-inner"
        style={{ transform: `translateZ(${half}px)` }}
      />
      {/* Back */}
      <div
        className="absolute inset-0 rounded-xl border border-cyan-500/50 bg-gradient-to-br from-cyan-400/20 to-teal-500/10 backdrop-blur-2xs shadow-inner"
        style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}
      />
      {/* Right */}
      <div
        className="absolute inset-0 rounded-xl border border-teal-500/40 bg-teal-400/15"
        style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}
      />
      {/* Left */}
      <div
        className="absolute inset-0 rounded-xl border border-cyan-500/40 bg-cyan-400/15"
        style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}
      />
      {/* Top */}
      <div
        className="absolute inset-0 rounded-xl border border-teal-300/60 bg-teal-300/20"
        style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}
      />
      {/* Bottom */}
      <div
        className="absolute inset-0 rounded-xl border border-cyan-300/60 bg-cyan-300/20"
        style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}
      />
      {/* Glowing Energy Core at Center of 3D Cube */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-cyan-400 shadow-[0_0_16px_#22d3ee]"
        style={{ transform: 'translateZ(0px)' }}
      />
    </motion.div>
  );
}

// -------------------------------------------------------------
// Pure CSS 3D Polyhedral Object: Floating Crystal Octahedron
// -------------------------------------------------------------
function FloatingCrystalDiamond3D({ size = 46, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.div
      animate={{
        rotateY: [0, 360],
        rotateX: [30, 50, 30],
        rotateZ: [-15, 15, -15],
        y: [10, -10, 10],
      }}
      transition={{
        rotateY: { duration: 14, repeat: Infinity, ease: 'linear' },
        rotateX: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
        rotateZ: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Facet 1 */}
      <div
        className="absolute inset-0 rounded-lg border border-emerald-400/60 bg-gradient-to-tr from-emerald-400/25 to-teal-300/10"
        style={{ transform: 'rotateX(45deg) rotateY(45deg) translateZ(16px)' }}
      />
      {/* Facet 2 */}
      <div
        className="absolute inset-0 rounded-lg border border-cyan-400/60 bg-gradient-to-tr from-cyan-400/25 to-emerald-300/10"
        style={{ transform: 'rotateX(-45deg) rotateY(45deg) translateZ(16px)' }}
      />
      {/* Facet 3 */}
      <div
        className="absolute inset-0 rounded-lg border border-teal-400/60 bg-gradient-to-tr from-teal-400/25 to-cyan-300/10"
        style={{ transform: 'rotateX(45deg) rotateY(-45deg) translateZ(16px)' }}
      />
      {/* Facet 4 */}
      <div
        className="absolute inset-0 rounded-lg border border-emerald-400/60 bg-gradient-to-tr from-emerald-400/25 to-teal-300/10"
        style={{ transform: 'rotateX(-45deg) rotateY(-45deg) translateZ(16px)' }}
      />
      {/* Glowing Star Core */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399]"
        style={{ transform: 'translateZ(0px)' }}
      />
    </motion.div>
  );
}

// -------------------------------------------------------------
// Pure CSS 3D Polyhedral Object: Rotating Developer Code Cube
// -------------------------------------------------------------
function FloatingCodeCube3D({ size = 36, className = '' }: { size?: number; className?: string }) {
  const half = size / 2;
  return (
    <motion.div
      animate={{
        rotateX: [360, 0],
        rotateY: [0, 360],
        y: [-8, 8, -8],
      }}
      transition={{
        rotateX: { duration: 22, repeat: Infinity, ease: 'linear' },
        rotateY: { duration: 19, repeat: Infinity, ease: 'linear' },
        y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center rounded-md border border-cyan-500/50 bg-cyan-50/80 text-[10px] font-mono font-black text-cyan-700 shadow-inner"
        style={{ transform: `translateZ(${half}px)` }}
      >
        &lt;/&gt;
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center rounded-md border border-teal-500/50 bg-teal-50/80 text-[10px] font-mono font-black text-teal-700"
        style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}
      >
        &#123; &#125;
      </div>
      <div
        className="absolute inset-0 rounded-md border border-emerald-400/40 bg-emerald-50/70"
        style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}
      />
      <div
        className="absolute inset-0 rounded-md border border-cyan-400/40 bg-cyan-50/70"
        style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}
      />
      <div
        className="absolute inset-0 rounded-md border border-teal-400/40 bg-teal-50/70"
        style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}
      />
      <div
        className="absolute inset-0 rounded-md border border-cyan-400/40 bg-cyan-50/70"
        style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}
      />
    </motion.div>
  );
}

// =============================================================
// Main DaySplashLoader Component
// =============================================================
export function DaySplashLoader({ onComplete }: DaySplashLoaderProps) {
  const [progress, setProgress] = useState(12);
  const [isClosing, setIsClosing] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Interactive Spring Physics for Pointer Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 22, mass: 0.2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-18, 18]);

  const handleFinish = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  useEffect(() => {
    // Timed progress progression (No skip, automatically completes smoothly)
    const t1 = setTimeout(() => setProgress(38), 350);
    const t2 = setTimeout(() => setProgress(72), 850);
    const t3 = setTimeout(() => setProgress(94), 1400);
    const t4 = setTimeout(() => setProgress(100), 1850);
    const finishTimer = setTimeout(() => handleFinish(), 2300);

    // Track mouse for 3D parallax tilt & 3D objects physics
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(finishTimer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between items-center overflow-hidden text-slate-800 select-none py-6 px-4"
          style={{
            backgroundColor: '#ffffff',
            perspective: '1200px',
          }}
          dir="rtl"
        >
          {/* ================= 3D AMBIENT ENVIRONMENT ================= */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {/* Subtle soft ambient glow spots */}
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-teal-400/10 via-cyan-300/15 to-blue-400/10 blur-[100px]" />
            <div className="absolute right-10 top-1/4 h-72 w-72 rounded-full bg-teal-200/20 blur-[80px]" />

            {/* 3D Horizon Grid Floor */}
            <div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[160vw] h-[340px]"
              style={{
                perspective: '600px',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className="w-full h-full opacity-35"
                style={{
                  transform: 'rotateX(72deg) translateY(20px)',
                  transformOrigin: 'bottom center',
                  backgroundImage: `
                    linear-gradient(to right, rgba(13, 148, 136, 0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(13, 148, 136, 0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0) 90%)',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0) 90%)',
                }}
              />
            </div>
          </div>

          {/* ================= FLOATING 3D OBJECTS ================= */}
          {/* 3D Glass Cyber Cube (Top Left) */}
          <div className="absolute top-20 left-10 sm:left-24 z-20">
            <FloatingGlassCube3D size={52} />
          </div>

          {/* 3D Crystal Octahedron Diamond (Top Right) */}
          <div className="absolute top-24 right-10 sm:right-28 z-20">
            <FloatingCrystalDiamond3D size={48} />
          </div>

          {/* 3D Developer Code Cube (Bottom Left) */}
          <div className="absolute bottom-28 left-8 sm:left-28 z-20 hidden sm:block">
            <FloatingCodeCube3D size={38} />
          </div>

          {/* 3D Mini Cube (Bottom Right) */}
          <div className="absolute bottom-32 right-8 sm:right-32 z-20 hidden sm:block">
            <FloatingGlassCube3D size={32} />
          </div>

          {/* ================= TOP BAR (Clean Minimalist, No Skip, No 3D Spatial active badge) ================= */}
          <div className="relative z-10 flex w-full max-w-2xl items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>منصة فوتيك // v2.6 PRO</span>
            </div>

            {/* Completely removed '3D SPATIAL ENGINE ACTIVE' as requested */}
            <div />
          </div>

          {/* ================= CENTER: 3D OBJECTS + LOGO & IDENTITY ================= */}
          <div
            className="relative z-10 flex flex-col items-center text-center max-w-md w-full my-auto"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D Dynamic Gyroscopic Stage */}
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative mb-7 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              {/* 3D Mathematical Wireframe Polyhedron (Icosahedron) in the center */}
              <WireframeIcosahedron3D mouseOffset={mouseOffset} />

              {/* Outer 3D Gyro Orbit Ring 1 (Horizontal Inclined) */}
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute h-44 w-44 sm:h-52 sm:w-52 rounded-full border border-teal-500/30 pointer-events-none"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(68deg) rotateY(15deg)',
                }}
              >
                {/* Traveling Satellite Pulse on Ring 1 */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_12px_#0d9488]" />
              </motion.div>

              {/* Middle 3D Gyro Orbit Ring 2 (Opposite Diagonal Inclined) */}
              <motion.div
                animate={{ rotateZ: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                className="absolute h-36 w-36 sm:h-44 sm:w-44 rounded-full border border-dashed border-cyan-500/35 pointer-events-none"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(55deg) rotateY(-40deg)',
                }}
              >
                {/* Traveling Satellite Pulse on Ring 2 */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              </motion.div>

              {/* Dynamic 3D Projected Ground Shadow */}
              <motion.div
                animate={{
                  scale: [1, 0.85, 1],
                  opacity: [0.35, 0.18, 0.35],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-8 h-8 w-28 rounded-full bg-teal-950/20 blur-md pointer-events-none"
                style={{
                  transform: 'rotateX(75deg) translateZ(-50px)',
                }}
              />

              {/* Central 3D Floating Logo Card */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(50px)',
                }}
                className="relative"
              >
                {/* Multi-layered Soft Aura behind logo */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-teal-500/25 via-cyan-400/20 to-blue-500/25 blur-lg pointer-events-none" />

                {/* The 3D Logo Cube / Badge */}
                <div
                  className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-3xl overflow-hidden p-1.5 ring-2 ring-white/90 shadow-2xl shadow-teal-900/15 bg-white"
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow:
                      '0 20px 35px -10px rgba(13, 148, 136, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <img
                    src="/images/futech-logo.jpg"
                    alt="FuTech Platform"
                    className="h-full w-full object-cover rounded-[18px]"
                  />

                  {/* 3D Specular Light Sweep Reflection */}
                  <motion.div
                    animate={{
                      x: ['-120%', '220%'],
                    }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 w-1/2 -skew-x-25 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
                  />
                </div>

                {/* Floating Corner Holographic Tech Indicator */}
                <motion.div
                  style={{
                    transform: 'translateZ(25px)',
                  }}
                  className="absolute -top-2 -right-2 flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-700/30"
                >
                  <Sparkles size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Platform Identity with 3D Depth */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ transform: 'translateZ(20px)' }}
            >
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                <span>فوتيك</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                  FuTech
                </span>
                <span className="text-slate-800">Platform</span>
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
                حاضنة الكفاءات الهندسية وسوق البرمجيات المعتمدة
              </p>
            </motion.div>

            {/* Simple Value Badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-4 flex items-center justify-center gap-2"
              style={{ transform: 'translateZ(15px)' }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 px-3 py-1 text-[11px] font-bold text-emerald-800 shadow-2xs">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>ضمان Escrow 100%</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/90 px-3 py-1 text-[11px] font-bold text-amber-800 shadow-2xs">
                <Zap size={13} className="text-amber-600" />
                <span>0% عمولة مطور</span>
              </span>
            </motion.div>

            {/* Minimalist 3D High-Tech Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="mt-8 w-full max-w-xs"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 mb-2 px-1">
                <span className="text-slate-600 text-[11px] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
                  {progress < 40 && 'تهيئة الكائنات ثلاثية الأبعاد...'}
                  {progress >= 40 && progress < 85 && 'فحص بروتوكولات الأمان والضمان...'}
                  {progress >= 85 && progress < 100 && 'تحميل بيئة العمل الهندسية...'}
                  {progress >= 100 && 'مرحباً بك في فوتيك 🚀'}
                </span>
                <span className="text-teal-700 font-mono font-black">{progress}%</span>
              </div>

              {/* Progress Track */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200/80 shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 relative"
                  initial={{ width: '12%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.35 }}
                >
                  {/* Neon Glow Tip */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-white/60 blur-[2px] rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ================= FOOTER ================= */}
          <footer className="relative z-10 text-[11px] font-mono text-slate-400 text-center">
            منصة فوتيك للحلول البرمجية والهندسية • FuTech © 2026
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}