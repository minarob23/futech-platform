import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2,
  Sparkles, ExternalLink, Github, ShieldCheck, Film, Monitor,
  Cpu, CheckCircle2, Award, Zap
} from 'lucide-react';
import { PortfolioItem, Developer } from '../types';

interface VideoTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortfolioItem | null;
  developer?: Developer | null;
  onOpenLiveDemo?: (url: string) => void;
}

export function VideoTrailerModal({
  isOpen,
  onClose,
  project,
  developer,
  onOpenLiveDemo,
}: VideoTrailerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [useSimulatedTrailer, setUseSimulatedTrailer] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Default trailer duration in seconds (1 min 45 sec = 105s)
  const totalDuration = 105;

  const trailerScenes = [
    {
      time: '00:00 - 00:25',
      title: 'المشهد الأول: المعمارية السحابية وتهيئة المحرك العصبي',
      desc: 'بناء خطوط الاتصال اللحظية عبر WebSockets وتحليل شجرة الكود المجردة AST لفحص مستودعات Git الضخمة.',
      icon: Cpu,
      status: 'Engine Initialized',
    },
    {
      time: '00:26 - 00:55',
      title: 'المشهد الثاني: رصد ثغرات OWASP وحقن قواعد البيانات',
      desc: 'فحص عميق للثغرات الأمنية من الدرجة الأولى (Zero-Days, SQL Injection, XSS, Broken Auth) واعتراض تسريب مفاتيح الـ API.',
      icon: ShieldCheck,
      status: 'Threats Intercepted (0 Zero-Days)',
    },
    {
      time: '00:56 - 01:25',
      title: 'المشهد الثالث: الترقيع البرمجي الذاتي والفحص الحي',
      desc: 'خوارزميات تصحيح الكود آلياً وتطبيق أفضل ممارسات Clean Architecture واختبارات الأداء بأقل من 20ms.',
      icon: Zap,
      status: 'Auto-Patched in Pipeline',
    },
    {
      time: '01:26 - 01:45',
      title: 'المشهد الرابع: الاعتماد الرسمي وتوثيق جودة FQS',
      desc: 'إصدار التقرير الأمني الموثق بشهادة تشفير SHA-256 وربطه مباشرة بنظام الضمان والمخرجات المعتمدة.',
      icon: Award,
      status: 'FQS Elite Certified ✓',
    },
  ];

  // Simulated trailer timer if no HTML5 video or user switches
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackTime((prev) => {
        const next = prev + 1;
        if (next >= totalDuration) {
          return 0;
        }
        // update scene
        if (next < 25) setActiveScene(0);
        else if (next < 55) setActiveScene(1);
        else if (next < 85) setActiveScene(2);
        else setActiveScene(3);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen || !project) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setPlaybackTime(0);
    setActiveScene(0);
    setIsPlaying(true);
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 sm:p-6 backdrop-blur-md"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-[#08101d] text-white shadow-2xl"
        >
          {/* Top Bar / Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0b172a] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-indigo-600 text-white shadow-lg shadow-rose-500/25">
                <Film size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-black uppercase text-rose-300 border border-rose-500/30">
                    🎬 4K OFFICIAL TRAILER
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">
                    المدة: {project.trailerDuration || '01:45'} دقيقة
                  </span>
                </div>
                <h3 className="mt-0.5 text-sm sm:text-base font-black text-white">
                  تريلر المشروع: {project.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseSimulatedTrailer(!useSimulatedTrailer)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-white/10 transition"
              >
                <Monitor size={13} className="text-teal-400" />
                <span>{useSimulatedTrailer ? 'مشاهدة الفيديو المباشر' : 'محاكي التريلر السيبراني'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Video Player Display Area */}
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center group">
            {!useSimulatedTrailer && project.trailerVideoUrl ? (
              <video
                ref={videoRef}
                src={project.trailerVideoUrl}
                poster={project.previewImage || '/images/ai-sentinel-preview.svg'}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onError={() => {
                  setUseSimulatedTrailer(true);
                }}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    setPlaybackTime(videoRef.current.currentTime);
                  }
                }}
                className="h-full w-full object-cover"
              />
            ) : (
              // Simulated Interactive Cinematic Trailer Scene
              <div className="relative h-full w-full bg-gradient-to-br from-[#060e1a] via-[#091629] to-[#040810] p-6 flex flex-col justify-between">
                {/* Background Grid & Ambient Lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(#1c7e86_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

                {/* Top overlay watermark */}
                <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
                      FUTECH LABS // PROJECT TEASER 4K
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-500">
                    BITRATE: 48.2 MBPS • 60 FPS
                  </span>
                </div>

                {/* Center Dynamic Showcase Box */}
                <div className="relative z-10 mx-auto max-w-xl text-center space-y-3">
                  <motion.div
                    key={activeScene}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5 backdrop-blur-md shadow-2xl shadow-cyan-500/10"
                  >
                    <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                      {React.createElement(trailerScenes[activeScene].icon, { size: 24 })}
                      <span className="text-xs font-mono font-bold tracking-wider">
                        {trailerScenes[activeScene].status}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white">
                      {trailerScenes[activeScene].title}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                      {trailerScenes[activeScene].desc}
                    </p>
                  </motion.div>
                </div>

                {/* Bottom Timeline indicators */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>المشهد الحالي: {activeScene + 1} من 4</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {formatTime(playbackTime)} / {formatTime(totalDuration)}
                  </span>
                </div>
              </div>
            )}

            {/* Cinematic Floating Play/Pause overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md transition"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-current" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
                    title="إعادة تشغيل التريلر"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  <span className="font-mono text-[11px] text-slate-300 mr-2">
                    {formatTime(playbackTime)} / {project.trailerDuration || '01:45'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-teal-500/20 px-2.5 py-1 text-[10px] font-black text-teal-300 border border-teal-500/30">
                    DOLBY 5.1 STEREO
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (playbackTime / totalDuration) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Project Details & Action Links */}
          <div className="border-t border-white/10 bg-[#091526] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-400">مهندس المشروع:</span>
                <span className="font-black text-teal-400">
                  {developer?.name || 'م. عمر المطيري'}
                </span>
                <span className="rounded-md bg-teal-950/60 border border-teal-500/30 px-1.5 py-0.5 text-[9px] font-black text-teal-300">
                  FQS 92
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-xl line-clamp-2">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-teal-500/20 hover:brightness-110 active:scale-95 transition"
                >
                  <ExternalLink size={14} />
                  <span>المعاينة الحية</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/10 transition"
                >
                  <Github size={14} />
                  <span>الكود</span>
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                إغلاق التريلر
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
