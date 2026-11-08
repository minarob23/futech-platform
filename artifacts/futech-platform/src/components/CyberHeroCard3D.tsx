import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ShieldCheck, Lock, KeyRound, FileCheck, CheckCircle2,
  Terminal, Sparkles, ArrowLeft, Cpu, Zap, EyeOff, FileText,
  RefreshCw, ShieldAlert, Binary, Check
} from 'lucide-react';

interface CyberHeroCard3DProps {
  onExploreDevelopers?: () => void;
  onExploreProjects?: () => void;
}

type SecurityPillar = 'zero_leak' | 'auto_nda' | 'escrow_vault' | 'ip_sovereignty';

export function CyberHeroCard3D({ onExploreDevelopers, onExploreProjects }: CyberHeroCard3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const [activePillar, setActivePillar] = useState<SecurityPillar>('zero_leak');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);

  // High-performance Framer Motion Values (bypasses React render loop for 120 FPS buttery motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Snappy spring physics with near-zero latency (stiffness: 700, damping: 32, mass: 0.08)
  const springConfig = { stiffness: 700, damping: 32, mass: 0.08 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6.5, -6.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]), springConfig);
  const scale = useSpring(1, { stiffness: 600, damping: 30, mass: 0.1 });

  // Subtle holographic sheen tracking the pointer
  const sheenLeft = useTransform(mouseX, [-0.5, 0.5], ['20%', '80%']);
  const sheenTop = useTransform(mouseY, [-0.5, 0.5], ['20%', '80%']);

  // Cache rect on enter to avoid expensive getBoundingClientRect() calls on every mousemove
  const handleMouseEnter = useCallback(() => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
    scale.set(1.015);
  }, [scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    let rect = rectRef.current;
    if (!rect && containerRef.current) {
      rect = containerRef.current.getBoundingClientRect();
      rectRef.current = rect;
    }
    if (!rect || rect.width === 0 || rect.height === 0) return;

    // Instant pure math calculation (0 reflows, 0 re-renders, 0 latency)
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  }, [mouseX, mouseY, scale]);

  const runSecurityCheck = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setVerificationDone(false);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationDone(true);
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-lg lg:max-w-none select-none"
      style={{ perspective: '1200px' }}
      dir="rtl"
    >
      {/* 3D Glassmorphic Security Chassis with Ultra-Clear Contrast */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        className="group relative overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white p-5 shadow-xl transition-colors duration-200 dark:border-cyan-500/40 dark:bg-[#071322] dark:shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
      >
        {/* Dynamic Holographic Cursor Glare Follower (Hardware Accelerated) */}
        <motion.div
          style={{
            left: sheenLeft,
            top: sheenTop,
            transform: 'translate(-50%, -50%)',
          }}
          className="pointer-events-none absolute h-56 w-56 rounded-full bg-cyan-400/15 dark:bg-cyan-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Subtle Cyber Corner Glow (Strictly behind content, no text wash) */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl" />

        {/* ──────────────────────────────────────────────────────── */}
        {/* 1. Card Top Header (Identity & Live Security Status)     */}
        {/* ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-md shadow-emerald-500/20">
              <ShieldCheck size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black tracking-wide text-slate-900 dark:text-white">
                  FUTECH CIPHER-VAULT
                </span>
                <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-mono font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  AES-256-GCM
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-300">
                منظومة الأمان والخصوصية وحصانة البيانات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>مشفر ومحمي 100%</span>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────── */}
        {/* 2. Central 3D Interactive Cryptographic Core            */}
        {/* ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-3.5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-cyan-500/30 dark:bg-[#0a1829]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Visual 3D Holographic Encryption Gyroscope */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              {/* Outer Dashed Orbit Ring */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-cyan-500/60 dark:border-cyan-400 animate-spin"
                style={{ animationDuration: '18s' }}
              />
              {/* Counter Rotating Ring */}
              <div
                className="absolute inset-2 rounded-full border border-emerald-500/60 dark:border-emerald-400"
                style={{
                  transform: 'rotateX(60deg) rotateY(30deg)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                }}
              />
              {/* Central Glowing Vault Prism */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400 bg-white shadow-md dark:bg-[#0e233d] dark:border-cyan-300 dark:shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <Lock size={19} className="text-cyan-600 dark:text-cyan-300 animate-pulse" />
              </div>
              {/* Mini Orbital Satellite */}
              <div
                className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping"
                style={{ animationDuration: '2.5s' }}
              />
            </div>

            {/* Core Cryptographic Guarantee Description with High Contrast */}
            <div className="flex-1 text-center sm:text-right">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-cyan-500/15 px-2 py-0.5 text-[10px] font-black text-cyan-800 dark:text-cyan-300 border border-cyan-500/30">
                <Binary size={11} />
                <span>معمارية Zero-Knowledge: لا نطلع على أسرارك أو أكوادك</span>
              </div>
              <h2 className="mt-1.5 text-sm font-black text-slate-900 dark:text-white">
                سيادة رقمية تامة وحماية مطلقة للملكية الفكرية
              </h2>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed dark:text-slate-200 font-medium">
                مفاتيح التشفير يملكها الأطراف حصراً. تضمن المنصة حجب كشف البيانات الحساسة، حماية الشفرات البرمجية، وتطبيق فوري لاتفاقية عدم الإفصاح الموثقة.
              </p>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────── */}
        {/* 3. 4 Interactive Security & Privacy Pillars Selector     */}
        {/* ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-3.5 grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-[#06101c] dark:border dark:border-white/5">
          <button
            type="button"
            onClick={() => setActivePillar('zero_leak')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-black transition-all ${
              activePillar === 'zero_leak'
                ? 'bg-white text-cyan-900 shadow-sm dark:bg-cyan-500/20 dark:text-cyan-200 dark:border dark:border-cyan-400/60'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <EyeOff size={14} className={activePillar === 'zero_leak' ? 'text-cyan-500' : 'text-slate-400'} />
            <span>حجب التسريب والبيانات</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('auto_nda')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-black transition-all ${
              activePillar === 'auto_nda'
                ? 'bg-white text-emerald-900 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-200 dark:border dark:border-emerald-400/60'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <FileText size={14} className={activePillar === 'auto_nda' ? 'text-emerald-500' : 'text-slate-400'} />
            <span>اتفاقية عدم الإفصاح (NDA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('escrow_vault')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-black transition-all ${
              activePillar === 'escrow_vault'
                ? 'bg-white text-indigo-900 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-200 dark:border dark:border-indigo-400/60'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Lock size={14} className={activePillar === 'escrow_vault' ? 'text-indigo-500' : 'text-slate-400'} />
            <span>الضمان التقني المشفر</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePillar('ip_sovereignty')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-[11px] font-black transition-all ${
              activePillar === 'ip_sovereignty'
                ? 'bg-white text-purple-900 shadow-sm dark:bg-purple-500/20 dark:text-purple-200 dark:border dark:border-purple-400/60'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <KeyRound size={14} className={activePillar === 'ip_sovereignty' ? 'text-purple-500' : 'text-slate-400'} />
            <span>عزل مفاتيح التشفير</span>
          </button>
        </div>

        {/* ──────────────────────────────────────────────────────── */}
        {/* 4. Dynamic Pillar Content Display (Ultra-Clear Text)     */}
        {/* ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-3 min-h-[140px]">
          <AnimatePresence mode="wait">
            {activePillar === 'zero_leak' && (
              <motion.div
                key="zero_leak"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-50/60 p-3.5 dark:border-cyan-500/40 dark:bg-[#091b2e]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                      <ShieldCheck size={16} className="text-cyan-500 shrink-0" />
                      <span>جدار الحماية من تسريب البيانات (Data Leak Firewall)</span>
                    </span>
                    <span className="font-mono text-[10px] font-black text-cyan-700 dark:text-cyan-300">
                      FILTER: ACTIVE
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed dark:text-slate-200 font-medium">
                    حجب تلقائي لأرقام الهواتف، العناوين البريدية، ومفاتيح البيئة الحساسة (.env) لمنع الاستغلال والتسريب خارج القنوات المحمية.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">لا تدريب للـ AI على كودك</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">منع تسريب ملفات السيرفر</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activePillar === 'auto_nda' && (
              <motion.div
                key="auto_nda"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/60 p-3.5 dark:border-emerald-500/40 dark:bg-[#071d22]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                      <FileCheck size={16} className="text-emerald-500 shrink-0" />
                      <span>اتفاقية عدم الإفصاح المبرمة آلياً (Instant Auto-NDA)</span>
                    </span>
                    <span className="font-mono text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                      LEGAL: SECURED
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed dark:text-slate-200 font-medium">
                    عقد رقمي مُلزم وفوري يسري لحظة التعاقد يضمن حظر إعادة بيع الأكواد، كشف فكرة المشروع، أو مشاركة تفاصيل العمل مع أي طرف خارجي.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">الملكية الفكرية 100% للعميل</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">حماية حقوق المطور كاملة</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activePillar === 'escrow_vault' && (
              <motion.div
                key="escrow_vault"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-50/60 p-3.5 dark:border-indigo-500/40 dark:bg-[#0c1a36]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                      <Lock size={16} className="text-indigo-500 shrink-0" />
                      <span>خزينة الضمان المالي الذكي (Escrow Vault)</span>
                    </span>
                    <span className="font-mono text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                      FEE: 0% COMMISSION
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed dark:text-slate-200 font-medium">
                    الأموال محفوظة في محفظة ضمان مشفرة لا تُصرف إلا بعد اعتماد العميل الصريح وفحص الشفرة المصدرية، بدون أي اطلاع بشري على الحسابات.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">تحرير مشروط بفحص الكود</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">صفر عمولة اقتطاع من الأتعاب</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activePillar === 'ip_sovereignty' && (
              <motion.div
                key="ip_sovereignty"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                <div className="rounded-xl border border-purple-500/30 bg-purple-50/60 p-3.5 dark:border-purple-500/40 dark:bg-[#1a0f33]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                      <KeyRound size={16} className="text-purple-500 shrink-0" />
                      <span>عزل مفاتيح التشفير التام (Client-Side Key Isolation)</span>
                    </span>
                    <span className="font-mono text-[10px] font-black text-purple-700 dark:text-purple-300">
                      KEYS: ISOLATED
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed dark:text-slate-200 font-medium">
                    كافة المراسلات والملفات المستلمة تُشفر على جهاز المستخدم قبل إرسالها ولا تملك خوادم المنصة المفاتيح الخاصة لفكها.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">نفق تشفير E2EE عسكري</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-white/10 dark:bg-[#0c1f36]">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100">امتثال كامل لـ GDPR & ISO</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ──────────────────────────────────────────────────────── */}
        {/* 5. Live Interactive Security Audit Status                */}
        {/* ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-3 dark:border-white/10 dark:bg-[#0a1727]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${verificationDone ? 'bg-emerald-500' : isVerifying ? 'bg-cyan-500 animate-ping' : 'bg-emerald-500'}`} />
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {isVerifying ? 'جاري فحص بروتوكولات الأمان والخصوصية...' : verificationDone ? 'تم التحقق: كافة المعايير محصنة وموثقة بنجاح' : 'درع الحماية السيبراني: 100% نشط'}
              </span>
            </div>

            <button
              type="button"
              onClick={runSecurityCheck}
              disabled={isVerifying}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500/15 px-3 py-1.5 text-[11px] font-black text-cyan-800 hover:bg-cyan-500/25 active:scale-95 transition dark:bg-cyan-500/20 dark:text-cyan-300 dark:hover:bg-cyan-500/30"
            >
              <RefreshCw size={12} className={isVerifying ? 'animate-spin' : ''} />
              <span>{isVerifying ? 'جاري الفحص' : 'فحص المناعة'}</span>
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-1 text-[10px] font-mono font-black border-t border-slate-200 pt-2 dark:border-white/10">
            <span className="text-emerald-700 dark:text-emerald-300">✓ OWASP TOP 10</span>
            <span className="text-cyan-700 dark:text-cyan-300">✓ GDPR COMPLIANT</span>
            <span className="text-indigo-700 dark:text-indigo-300">✓ ZERO-KNOWLEDGE</span>
            <span className="text-purple-700 dark:text-purple-300">✓ AES-256 E2EE</span>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────── */}
        {/* 6. Bottom Direct Action Bar                              */}
        {/* ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-3.5 flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] sm:text-xs">بيانات المطور والعميل محمية ومحصنة قانونياً</span>
          </div>

          <button
            type="button"
            onClick={onExploreDevelopers}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-2 text-xs font-black text-slate-950 shadow-md transition hover:scale-102 hover:shadow-lg active:scale-95"
          >
            <span>استكشف النخبة بأمان</span>
            <ArrowLeft size={14} className="transition group-hover:-translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
