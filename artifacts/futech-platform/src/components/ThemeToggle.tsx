import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export interface ThemeToggleProps {
  /**
   * Display variant:
   * - 'segmented': Subtle luxury micro-capsule switch (Apple/Raycast style, neutral track) - Default
   * - 'minimal': Clean, refined square/rounded icon button
   * - 'floating': Floating round button with smooth backdrop blur
   */
  variant?: 'segmented' | 'minimal' | 'floating' | 'capsule' | 'button';
  /**
   * Extra classes
   */
  className?: string;
  /**
   * Optional custom toggle callback
   */
  onToggle?: (isDark: boolean) => void;
}

export function ThemeToggle({
  variant = 'segmented',
  className = '',
  onToggle,
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    onToggle?.(!isDark);
  };

  // 1. MINIMAL ICON BUTTON (زر أيقونة مربع ناعم ومختصر)
  if (variant === 'minimal' || variant === 'button') {
    return (
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
        title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
        className={`group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
          isDark
            ? 'border-slate-700/80 bg-slate-800/80 text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-200 shadow-xs'
            : 'border-slate-200/90 bg-slate-50/90 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-amber-600 shadow-2xs'
        } ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="dark-icon"
              initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-center text-cyan-300"
            >
              <Moon size={16} strokeWidth={2.2} className="fill-cyan-400/20" />
            </motion.div>
          ) : (
            <motion.div
              key="light-icon"
              initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-center text-slate-700 group-hover:text-amber-500"
            >
              <Sun size={16} strokeWidth={2.2} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  // 2. SEGMENTED / CAPSULE MICRO-SWITCH (مفتاح كبسولة فاخر وراقي بأسلوب Raycast & Apple)
  if (variant === 'segmented' || variant === 'capsule') {
    return (
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
        title={isDark ? 'التبديل إلى الوضع النهاري (Light)' : 'التبديل إلى الوضع الليلي (Dark)'}
        className={`group relative flex h-[32px] w-[62px] shrink-0 cursor-pointer items-center justify-between rounded-full px-1 border transition-all duration-300 select-none ${
          isDark
            ? 'border-cyan-500/25 bg-[#0b1424] shadow-inner shadow-black/40 hover:border-cyan-500/40'
            : 'border-slate-200/90 bg-slate-100 hover:bg-slate-200/70 hover:border-slate-300 shadow-inner'
        } ${className}`}
        dir="ltr"
      >
        {/* Left icon (Moon - Dark Mode position) */}
        <div className="relative z-10 flex h-6 w-6 items-center justify-center">
          <Moon
            size={12}
            className={`transition-all duration-200 ${
              isDark ? 'text-cyan-300 fill-cyan-300/30 scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          />
        </div>

        {/* Right icon (Sun - Light Mode position) */}
        <div className="relative z-10 flex h-6 w-6 items-center justify-center">
          <Sun
            size={13}
            className={`transition-all duration-200 ${
              !isDark ? 'text-amber-500 fill-amber-500/20 scale-105' : 'text-slate-500 hover:text-slate-400'
            }`}
          />
        </div>

        {/* Sliding thumb knob */}
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 480,
            damping: 32,
          }}
          className={`absolute top-[3px] z-20 flex h-[24px] w-[24px] items-center justify-center rounded-full shadow-sm transition-all duration-200 ${
            isDark
              ? 'left-[4px] bg-[#162740] text-cyan-300 border border-cyan-400/40 shadow-cyan-500/20 shadow-md'
              : 'left-[32px] bg-white text-amber-500 border border-slate-200/90 shadow-md shadow-slate-900/10'
          }`}
        >
          {isDark ? (
            <Moon size={11} className="fill-cyan-400/30" strokeWidth={2.5} />
          ) : (
            <Sun size={12} strokeWidth={2.5} className="fill-amber-400/20" />
          )}
        </motion.div>
      </motion.button>
    );
  }

  // 3. FLOATING VARIANT (للزاوية العائمة أسفل الصفحة)
  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
      title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-200 ${
        isDark
          ? 'border-slate-700 bg-slate-900/95 text-cyan-300 hover:border-cyan-500/50 shadow-slate-950/60'
          : 'border-slate-200/90 bg-white/95 text-slate-700 hover:text-amber-500 hover:border-slate-300 shadow-slate-900/10'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="float-dark"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.18 }}
          >
            <Moon size={18} strokeWidth={2.3} className="fill-cyan-400/20" />
          </motion.div>
        ) : (
          <motion.div
            key="float-light"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.18 }}
          >
            <Sun size={18} strokeWidth={2.3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
