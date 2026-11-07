import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Home,
  Users,
  Award,
  Briefcase,
  Layers,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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
  const [ecoMode, setEcoMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('futech_eco_mode') === 'true';
    }
    return false;
  });

  const toggleEcoMode = () => {
    const next = !ecoMode;
    setEcoMode(next);
    localStorage.setItem('futech_eco_mode', String(next));
    window.dispatchEvent(new CustomEvent('futech_eco_mode_changed', { detail: next }));
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setShowScrollTop(scrollY > 160);

          if (isHome) {
            const offsets = HOME_SECTIONS.map((sec) => {
              const el = document.getElementById(sec.id);
              if (!el) return { id: sec.id, top: 0, bottom: 0 };
              const rect = el.getBoundingClientRect();
              const top = rect.top + scrollY - 220;
              const bottom = top + rect.height;
              return { id: sec.id, top, bottom };
            });

            const current = offsets.find((o) => scrollY >= o.top && scrollY < o.bottom);
            if (current) {
              setActiveSection(current.id);
            } else if (scrollY < 200) {
              setActiveSection('home');
            }
          }
          ticking = false;
        });
        ticking = true;
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
      {/* 1. BOTTOM-RIGHT: Sleek Floating Theme Switcher, Performance Mode & Scroll to Top */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 select-none">
        {/* Quick Performance / Eco Mode Toggle */}
        <button
          onClick={toggleEcoMode}
          title={ecoMode ? 'تفعيل المؤثرات الكاملة 🌟' : 'تفعيل وضع السرعة الفائقة وتوفير الأداء ⚡'}
          aria-label="تبديل وضع الأداء"
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-300 backdrop-blur-md active:scale-95 shadow-md ${
            ecoMode
              ? 'border-amber-400 bg-amber-500/20 text-amber-500 ring-2 ring-amber-400/30'
              : 'border-slate-200/90 bg-white/90 text-slate-500 hover:text-cyan-600 hover:border-cyan-400 dark:border-white/10 dark:bg-[#0c1626] dark:text-slate-300'
          }`}
        >
          <Zap size={17} className={ecoMode ? 'fill-amber-400 text-amber-500' : ''} />
        </button>

        {/* Floating Quick Theme Toggle */}
        <ThemeToggle variant="floating" />

        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
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
      </div>

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

                      {/* Tooltip Label */}
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
    </>
  );
}
