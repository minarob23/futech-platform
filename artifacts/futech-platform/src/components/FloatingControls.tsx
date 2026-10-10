import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Terminal,
  X,
  Home,
  Users,
  Award,
  Briefcase,
  Layers,
  HelpCircle
} from 'lucide-react';
import { LiveTerminal } from './LiveTerminal';

interface FloatingControlsProps {
  isHome?: boolean;
}

interface SectionItem {
  id: string;
  label: string;
  arabicLabel: string;
  icon: typeof Home;
}

const HOME_SECTIONS: SectionItem[] = [
  { id: 'home', label: 'HOME', arabicLabel: 'الرئيسية', icon: Home },
  { id: 'devs', label: 'DEVS', arabicLabel: 'نخبة المطورين', icon: Users },
  { id: 'fqs', label: 'FQS', arabicLabel: 'معيار FQS', icon: Award },
  { id: 'projects', label: 'PROJECTS', arabicLabel: 'سوق المشاريع', icon: Briefcase },
  { id: 'roadmap', label: 'WORKFLOW', arabicLabel: 'خطوات العمل', icon: Layers },
  { id: 'faqs', label: 'FAQS', arabicLabel: 'الأسئلة الشائعة', icon: HelpCircle },
];

export function FloatingControls({ isHome = true }: FloatingControlsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [terminalModalOpen, setTerminalModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 160);

      if (!isHome) return;

      const offsets = HOME_SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return { id: sec.id, top: 0, bottom: 0 };
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY - 220;
        const bottom = top + rect.height;
        return { id: sec.id, top, bottom };
      });

      const current = offsets.find((o) => scrollY >= o.top && scrollY < o.bottom);
      if (current) {
        setActiveSection(current.id);
      } else if (scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    setHoveredSection(null);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* 1. BOTTOM-RIGHT: Sleek Scroll to Top Floating Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={scrollToTop}
              title="العودة للأعلى"
              aria-label="العودة للأعلى"
              className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/95 text-[#20878e] shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#20878e] hover:bg-[#20878e] hover:text-white active:scale-95"
            >
              <ArrowUp size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. LEFT SIDE: Modern Glassmorphic Island Navigation Dock */}
      {isHome && (
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 md:flex flex-col items-center select-none"
              dir="ltr"
            >
              {/* Frosted Glass Capsule Container */}
              <div className="flex flex-col items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                {HOME_SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  const isHovered = hoveredSection === sec.id;

                  return (
                    <div
                      key={sec.id}
                      className="relative flex items-center"
                      onMouseEnter={() => setHoveredSection(sec.id)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      {/* Icon Button */}
                      <button
                        onClick={() => scrollToSection(sec.id)}
                        aria-label={sec.arabicLabel}
                        className={`relative grid h-9 w-9 place-items-center rounded-full transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-tr from-[#20878e] to-[#2db1ba] text-white shadow-md shadow-[#2db1ba]/40 scale-105'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-[#20878e]'
                        }`}
                      >
                        <Icon size={16} />
                        {isActive && (
                          <span className="absolute -inset-1 -z-10 rounded-full bg-[#2db1ba]/20 blur-xs animate-pulse" />
                        )}
                      </button>

                      {/* Tooltip Label (Light, Elegant, Matching Website Aesthetics with arrow pointer) */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92, x: -6 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.92, x: -6 }}
                            transition={{ duration: 0.15 }}
                            onClick={() => scrollToSection(sec.id)}
                            className="pointer-events-none absolute left-12 whitespace-nowrap"
                            dir="rtl"
                          >
                            <div className="relative flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-3 py-1.5 text-xs font-black text-[#152a40] shadow-xl shadow-slate-900/10 backdrop-blur-md">
                              {/* Arrow Pointer to the Dock Icon */}
                              <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 -rotate-45 border-t border-l border-slate-200/90 bg-white" />
                              <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-[#20878e]" />
                              <span className="relative z-10 font-bold">{sec.arabicLabel}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 3. BOTTOM-LEFT: Sleek Floating Live Terminal Capsule Badge */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-6 z-40 hidden sm:block select-none"
          >
            <button
              onClick={() => setTerminalModalOpen(true)}
              className="group flex items-center gap-2.5 rounded-full border border-[#1b3d5c] bg-[#0c1827] px-4 py-2 font-mono text-xs font-bold text-[#38d4de] shadow-2xl shadow-black/70 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#38d4de] hover:bg-[#102338]"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
              </span>
              <span>futech — live</span>
              <span className="text-slate-400 font-bold">&gt;_</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Floating Modal (Contains the full Live CLI Engine experience) */}
      <AnimatePresence>
        {terminalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTerminalModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#1d3d60] bg-gradient-to-b from-[#0c1827] to-[#07111c] p-6 text-white shadow-2xl shadow-black/80 md:p-8"
              dir="rtl"
            >
              {/* Close Button */}
              <button
                onClick={() => setTerminalModalOpen(false)}
                className="absolute top-5 left-5 z-20 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>

              {/* Modal Header & Intro */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#2db1ba]/30 bg-[#2db1ba]/10 px-3.5 py-1.5 text-xs font-black text-[#5ce0e8]">
                  <Terminal size={14} />
                  <span>محاكي فوتيك البرمجي الحي • Live CLI Engine</span>
                </div>
                <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">
                  شاهد كيف تُدار وتُسلّم المشاريع في فوتيك باحترافية
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  بيئة تفاعلية تحاكي دورة العمل الهندسية من تهيئة المتطلبات، مطابقة الكفاءات البرمجية العربية المعتمدة، فحص كود المشروع وفق معايير OWASP، وحتى نقل الملكية الكاملة للمستودع وتفعيل ضمان الصيانة.
                </p>

                {/* 3 Value Pillars */}
                <div className="mt-4 flex flex-wrap gap-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 border border-white/5">
                    <span className="text-[#38d4de] font-black">✓</span>
                    <span>مطابقة ذكية تعتمد على مؤشر جودة المستقل FQS الفعلي</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 border border-white/5">
                    <span className="text-[#38d4de] font-black">✓</span>
                    <span>تسليم مباشر ونقل ملكية Git للعميل بنسبة 100%</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 border border-white/5">
                    <span className="text-[#38d4de] font-black">✓</span>
                    <span>صفر عمولات أو اقتطاعات مالية بين الطرفين</span>
                  </div>
                </div>
              </div>

              {/* Interactive Live Terminal Console */}
              <div className="mt-6">
                <LiveTerminal compact={false} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
