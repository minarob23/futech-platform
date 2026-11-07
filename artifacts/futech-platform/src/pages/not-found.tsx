import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  Compass, ArrowLeft, Home, Search, Terminal, Code2, RefreshCw,
  HelpCircle, ShieldAlert, Sparkles, Briefcase, Users, BookOpen,
  ArrowRight, CornerDownLeft
} from 'lucide-react';

interface NotFoundProps {
  onGoHome?: () => void;
}

export function NotFound({ onGoHome }: NotFoundProps) {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLocation(`/projects?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div
      dir="rtl"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a1624] via-[#102237] to-[#142b44] px-4 py-16 text-white selection:bg-[#259ea7] selection:text-[#081e28]"
    >
      {/* Background Animated Gradient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-[#2798a0]/30 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute -bottom-28 -right-28 h-[450px] w-[450px] rounded-full bg-[#3b82f6]/25 blur-[140px]"
      />

      {/* Floating Code & Math Symbols (Decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden text-slate-700/30 font-mono text-sm select-none">
        <span className="absolute top-16 right-20 text-2xl font-bold opacity-40">{"{ 404: 'Route_Undefined' }"}</span>
        <span className="absolute top-36 left-24 text-xl opacity-30">git checkout -b fix/lost-page</span>
        <span className="absolute bottom-24 right-32 text-lg opacity-35">{"<NotFound code={404} />"}</span>
        <span className="absolute bottom-40 left-16 text-xl opacity-25">SELECT * FROM routes WHERE path = NULL;</span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Top Radar/Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#3ec4cb]/30 bg-[#163852]/60 px-4 py-1.5 text-xs font-black text-[#5be1e9] shadow-lg backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ec4cb] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3ec4cb]" />
          </span>
          <span>خطأ استجابة HTTP: 404 NOT FOUND</span>
        </motion.div>

        {/* Big Glitch 404 Display */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative my-4"
        >
          <div className="select-none text-8xl font-black tracking-tighter text-transparent bg-gradient-to-r from-[#2ab6be] via-[#5ae2ea] to-[#80e9ef] bg-clip-text sm:text-[140px] md:text-[170px] drop-shadow-2xl">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none text-8xl font-black text-white sm:text-[140px] md:text-[170px] blur-sm">
            404
          </div>
        </motion.div>

        {/* Heading & Witty Tech Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-xl font-black text-white sm:text-3xl">
            يبدو أنك سلكت مساراً غير موثق في مستودع المنصة!
          </h1>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            الصفحة التي تحاول الوصول إليها قد تم نقلها، أو حُذف مسارها، أو أنك طلبت Endpoint غير موجود
            في معمارية النظام. لا تقلق، الكود النظيف لا يخلو من بعض الـ 404 العابرة!
          </p>
        </motion.div>

        {/* Interactive Simulated Dev Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-6 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#09131e]/90 text-left font-mono text-xs shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="mr-2 text-[10px] text-slate-400 font-sans font-bold">futech-terminal</span>
            </div>
            <span className="text-[10px] text-[#4dd2d9]">bash (v5.2)</span>
          </div>

          <div className="p-4 space-y-1.5 text-slate-300" dir="ltr">
            <div>
              <span className="text-emerald-400">futech@router</span>:<span className="text-blue-400">~</span>$ curl -I https://futech.dev{location}
            </div>
            <div className="text-rose-400 font-bold">
              HTTP/2 404 Not Found
            </div>
            <div className="text-slate-400 text-[11px]">
              x-futech-status: &quot;path_unmapped_in_react_router&quot;<br />
              suggestion: &quot;Redirecting client to registered platform services...&quot;
            </div>
          </div>
        </motion.div>

        {/* Quick Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mt-6 w-full max-w-md"
        >
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مشروع، مطور، أو تقنية بديلة..."
              className="w-full rounded-2xl border border-white/15 bg-white/10 pe-11 ps-4 py-3 text-xs text-white placeholder-slate-400 outline-none backdrop-blur-md transition focus:border-[#3ec4cb] focus:bg-white/15 focus:ring-2 focus:ring-[#3ec4cb]/20"
            />
            <button
              type="submit"
              className="absolute left-2 rounded-xl bg-gradient-to-r from-[#2399a1] to-[#36c2ca] p-2 text-[#081e28] transition hover:opacity-95"
            >
              <Search size={16} />
            </button>
          </form>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#21959d] to-[#39c4cc] px-6 py-3.5 text-xs font-black text-[#081e28] shadow-lg shadow-[#21959d]/25 transition hover:opacity-95 active:scale-95 sm:text-sm"
          >
            <Home size={17} />
            <span>العودة للرئيسية</span>
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:text-sm"
          >
            <Briefcase size={16} className="text-[#39c4cc]" />
            <span>سوق المشاريع</span>
          </Link>

          <Link
            href="/developers"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:text-sm"
          >
            <Users size={16} className="text-[#39c4cc]" />
            <span>تصفح المطورين</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-transparent px-4 py-3.5 text-xs font-bold text-slate-300 transition hover:bg-white/5"
          >
            <ArrowRight size={15} />
            <span>الصفحة السابقة</span>
          </button>
        </motion.div>

        {/* Helpful Shortcut Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 gap-3 text-right sm:grid-cols-4"
        >
          <Link
            href="/projects"
            className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs transition hover:border-[#3ec4cb]/40 hover:bg-white/10"
          >
            <div className="text-[10px] font-bold text-[#4dd2d9]">سوق المشاريع</div>
            <div className="mt-1 text-xs font-black text-white">تصفح المشاريع المتاحة</div>
          </Link>

          <Link
            href="/post-project"
            className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs transition hover:border-[#3ec4cb]/40 hover:bg-white/10"
          >
            <div className="text-[10px] font-bold text-[#4dd2d9]">ابدأ مشروعك اليوم</div>
            <div className="mt-1 text-xs font-black text-white">نشر مشروع جديد</div>
          </Link>

          <Link
            href="/docs"
            className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs transition hover:border-[#3ec4cb]/40 hover:bg-white/10"
          >
            <div className="text-[10px] font-bold text-[#4dd2d9]">مركز التوثيق التقني</div>
            <div className="mt-1 text-xs font-black text-white">شروحات ومعايير FQS</div>
          </Link>

          <Link
            href="/support"
            className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs transition hover:border-[#3ec4cb]/40 hover:bg-white/10"
          >
            <div className="text-[10px] font-bold text-rose-400">وجدت رابطاً معطلاً؟</div>
            <div className="mt-1 text-xs font-black text-white">فتح تذكرة دعم فني</div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFound;
