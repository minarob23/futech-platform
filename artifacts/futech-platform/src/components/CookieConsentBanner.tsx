import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const COOKIE_STORAGE_KEY = 'futech_cookie_consent';

interface CookieConsentBannerProps {
  go: (path: string) => void;
}

export function CookieConsentBanner({ go }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Check consent status on initial mount and listen for reset events
  useEffect(() => {
    let timer: any = null;

    const checkConsent = () => {
      try {
        const consent = localStorage.getItem(COOKIE_STORAGE_KEY);
        if (!consent) {
          // Slight delay for smooth natural entrance
          timer = setTimeout(() => setIsVisible(true), 600);
        } else {
          setIsVisible(false);
        }
      } catch {
        setIsVisible(false);
      }
    };

    checkConsent();

    // Listen to custom reset event so the user can re-trigger the banner from the Cookie Policy page
    window.addEventListener('futech_cookie_reset', checkConsent);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('futech_cookie_reset', checkConsent);
    };
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
      window.dispatchEvent(new Event('futech_cookie_updated'));
    } catch {}
    setIsVisible(false);
  };

  const handleClose = () => {
    // Dismiss without permanent acceptance or for this session
    setIsVisible(false);
  };

  const handleOpenPolicy = () => {
    go('/cookies');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
          className="fixed bottom-6 left-6 z-[99990] w-[calc(100%-3rem)] max-w-[390px] text-right font-sans"
          dir="rtl"
        >
          <div className="relative overflow-hidden rounded-[26px] border border-slate-100 bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.14)] ring-1 ring-black/5 dark:border-slate-800 dark:bg-[#0c1626] dark:ring-white/10 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Top row: Title + Cookie Icon Badge + Dismiss button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-500/20 dark:bg-teal-950/70 dark:text-teal-400 dark:ring-teal-500/30">
                  <Cookie size={19} className="stroke-[2.2]" />
                </div>
                <h3 className="text-sm font-black text-slate-900 sm:text-base dark:text-white">
                  نحن نهتم بخصوصيتك
                </h3>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
                title="إغلاق"
              >
                <X size={15} />
              </button>
            </div>

            {/* Description Text */}
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              نستخدم ملفات تعريف الارتباط للحفاظ على أمان فوتيك وتذكّر تفضيلاتك وتحسين تجربة المنصة ومطابقة الجودة FQS. بمتابعة التصفح فأنت توافق على{' '}
              <button
                type="button"
                onClick={handleOpenPolicy}
                className="font-black text-teal-700 underline underline-offset-4 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 transition"
              >
                سياسة ملفات الارتباط.
              </button>
            </p>

            {/* Action Row: Accept Button */}
            <div className="mt-4 flex items-center justify-start pt-1">
              <button
                type="button"
                onClick={handleAccept}
                className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-7 text-xs font-black text-white shadow-md shadow-teal-500/25 transition hover:brightness-105 active:scale-95"
              >
                قبول
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
