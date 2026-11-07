import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  CodeXml, Plus, Users, ShieldCheck, Activity, Layers, ArrowLeft,
  Briefcase, CheckCircle2, Star, Sparkles, ChevronLeft, Clock,
  FileCode2, CheckCheck, Lock, Award, Cpu, Terminal, ArrowUpRight,
  TrendingUp, Check, Zap, Eye, ChevronDown, MessageCircle, Lightbulb,
  HeartHandshake, Globe2, Building2, Play, Image as ImageIcon
} from 'lucide-react';
import { Store, Project, Developer, PortfolioItem, User } from '../types';
import { Footer } from '../components/Footer';
import { FloatingControls } from '../components/FloatingControls';
import { ThemeToggle } from '../components/ThemeToggle';
import { UnifiedNavbar } from '../components/UnifiedNavbar';
import { DeveloperShowcaseModal } from '../components/DeveloperShowcaseModal';
import { LiveProjectPreviewModal } from '../components/LiveProjectPreviewModal';
import { DeveloperAnnouncementModal } from '../components/DeveloperAnnouncementModal';
import { CyberHeroCard3D } from '../components/CyberHeroCard3D';
import { CyberBackground3D } from '../components/CyberBackground3D';
import { getDeveloperCurrency } from '../data/countries';

interface HomePageProps {
  store: Store;
  go: (path: string) => void;
  notify?: (msg: string) => void;
  onOpenAuth?: (role?: 'developer' | 'client', mode?: 'login' | 'register', portal?: 'members' | 'admin' | 'owner') => void;
  onSwitchUser?: (user: User) => void;
  update?: (key: keyof Store, value: any) => void;
}

export function HomePage({ store, go, notify, onOpenAuth, onSwitchUser, update }: HomePageProps) {
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(true);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'workflow' | 'fqs' | 'community'>('workflow');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedDevShowcase, setSelectedDevShowcase] = useState<Developer | null>(null);
  const [selectedLiveProject, setSelectedLiveProject] = useState<PortfolioItem | null>(null);
  const [livePreviewDev, setLivePreviewDev] = useState<Developer | null>(null);

  const availableProjects = store.projects.filter((p) => p.status === 'متاح').slice(0, 3);
  const topDevelopers = store.developers.slice(0, 4);

  const stats = [
    { label: 'مشاريع تقنية موثقة', value: store.projects.length > 0 ? `+${store.projects.length}` : '0', detail: 'مسجلة وموثقة في المنصة' },
    { label: 'مطورين ومبرمجين معتمدين', value: store.developers.length > 0 ? `+${store.developers.length}` : '0', detail: 'من كافة الدول العربية' },
    { label: 'معايير أمان OWASP', value: '100%', detail: 'فحص الحماية وتوثيق Git' },
    { label: 'رسوم خفية أو وسطاء', value: '0%', detail: 'حساب ضمان مالي مشفر ومباشر' },
  ];

  const arabCountries = [
    { name: 'السعودية', flag: '🇸🇦', code: 'sa' },
    { name: 'مصر', flag: '🇪🇬', code: 'eg' },
    { name: 'الإمارات', flag: '🇦🇪', code: 'ae' },
    { name: 'المغرب', flag: '🇲🇦', code: 'ma' },
    { name: 'الأردن', flag: '🇯🇴', code: 'jo' },
    { name: 'العراق', flag: '🇮🇶', code: 'iq' },
    { name: 'الكويت', flag: '🇰🇼', code: 'kw' },
    { name: 'الجزائر', flag: '🇩🇿', code: 'dz' },
    { name: 'عُمان', flag: '🇴🇲', code: 'om' },
    { name: 'قطر', flag: '🇶🇦', code: 'qa' },
    { name: 'تونس', flag: '🇹🇳', code: 'tn' },
    { name: 'البحرين', flag: '🇧🇭', code: 'bh' },
    { name: 'لبنان', flag: '🇱🇧', code: 'lb' },
    { name: 'فلسطين', flag: '🇵🇸', code: 'ps' },
    { name: 'السودان', flag: '🇸🇩', code: 'sd' },
    { name: 'ليبيا', flag: '🇱🇾', code: 'ly' },
    { name: 'اليمن', flag: '🇾🇪', code: 'ye' },
    { name: 'موريتانيا', flag: '🇲🇷', code: 'mr' },
  ];

  const faqs = [
    {
      q: 'ما هو مؤشر FQS (Freelancer Quality Score) وكيف يُحسب للمبرمجين؟',
      a: 'مؤشر FQS (مؤشر جودة المستقل) هو نظام تقييم متطور ومعتمد في منصات العمل الحر لقياس مدى كفاءة، والتزام، واحترافية المبرمجين. يحدد هذا المؤشر مدى ظهور الملف الشخصي للمطور في صدارة نتائج البحث وفرص فوزه بالمشاريع. وتعتمد خوارزميته على 4 عوامل أساسية: معدل إكمال المشاريع، الالتزام بالوقت والميزانية، تقييم العملاء بالنجوم، ومعدل التوظيف المتكرر.',
    },
    {
      q: 'كيف يتم الاتفاق والتعاقد بين المطور وصاحب المشروع؟',
      a: 'يتم الاتفاق بحرية وشفافية تامة بين الطرفين على مراحل التسليم واستلام الكود المصدري مباشرة عبر المنصة وبدون أي رسوم وساطة أو اقتطاعات مالية.',
    },
    {
      q: 'هل يمكنني التواصل المباشر مع المطور قبل بدء العمل؟',
      a: 'نعم، تتيح لك المنصة نظام محادثة فورية مدمج لمناقشة المتطلبات، استعراض النماذج، والاتفاق على النطاق الزمني والتقني قبل تأكيد أي عرض عمل.',
    },
    {
      q: 'ما هي التخصصات البرمجية المتوفرة في المنصة؟',
      a: 'تضم المنصة نخبة المطورين في مجالات الويب الشامل (Full-Stack)، الواجهات الأمامية (Frontend)، الأنظمة الخلفية والسحابية (Backend & Cloud)، تطبيقات الجوال (Mobile)، الذكاء الاصطناعي (AI/ML)، وتطوير منصات CMS والمتاجر الجاهزة (WordPress / Shopify / Wix).',
    },
  ];

  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-white text-[#1a2d42] dark:bg-[#070c16] dark:text-slate-100 selection:bg-teal-500/30">
      {/* 3D Animated Ambient Cyber Background */}
      <CyberBackground3D />

      {/* Top Announcement Bar in One Line & Crisp White (شريط إعلاني أبيض في سطر واحد) */}
      <div className="relative z-30 bg-white border-b border-slate-200/90 py-2 px-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-black shrink-0 text-[11px]">
              📢 بيان رسمي
            </span>
            <span className="font-bold text-slate-800 truncate">
              المنصة متاحة للعمل الفعلي وتحت التجربة الحية • دعواتكم لأخوكم المهندس مينا روبير مجدى فوزى (جيش الداخلية - قوات أمن المنصورة)
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAnnouncementOpen(true)}
              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-black underline text-xs cursor-pointer whitespace-nowrap"
            >
              قراءة الرسالة كاملة
            </button>
            <span className="text-slate-300">|</span>
            <a
              href="https://wa.me/201115294735"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 text-xs"
            >
              واتساب المطور
            </a>
          </div>
        </div>
      </div>

      {/* Top Unified Modern Navbar */}
      <div className="relative z-20">
        <UnifiedNavbar
          currentUser={store.currentUser || undefined}
          store={store}
          update={update}
          go={go}
          onOpenAuth={onOpenAuth}
          onSwitchUser={onSwitchUser}
          notify={notify}
        />
      </div>

      {/* Hero Section */}
      <section id="home" className="relative z-10 overflow-hidden bg-transparent py-14 md:py-24">
        {/* Soft Ambient Radial Accents (Zero Gaussian Blur Overhead) */}
        <div
          className="pointer-events-none absolute -left-20 top-0 h-[450px] w-[450px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(62,196,203,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-20 top-24 h-[480px] w-[480px] rounded-full will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(27,61,104,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Text and Actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              {/* Highlight Badge & Announcement Trigger */}
              <div className="flex flex-wrap items-center gap-2.5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-cyan-400/40 bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-transparent px-4 py-2 text-xs font-black text-[#0f555b] dark:text-cyan-300 shadow-sm backdrop-blur-md"
                >
                  <Sparkles size={15} className="text-cyan-500 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>المنصة العربية الرائدة لهندسة البرمجيات</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                </motion.div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsAnnouncementOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full border border-teal-500/50 bg-teal-500/15 hover:bg-teal-500/25 px-4 py-2 text-xs font-black text-teal-800 dark:text-teal-200 transition shadow-xs cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>📢 بيان المنصة: متاح للعمل • تحت التجربة • رسالة المهندس مينا روبير</span>
                  <ArrowLeft size={13} className="text-teal-600 transition group-hover:-translate-x-1" />
                </motion.button>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.2] tracking-tight text-[#14283d] dark:text-white sm:text-5xl lg:text-[49px]">
                حاضنة الكفاءات البرمجية العربية <br />
                <span className="relative inline-block mt-2 bg-gradient-to-l from-[#0ea5e9] via-[#0d9488] to-[#6366f1] bg-clip-text text-transparent dark:from-cyan-300 dark:via-teal-300 dark:to-indigo-300 drop-shadow-xs">
                  ملتقى نخبة المطورين لإنجاز المشاريع باحترافية
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                نربط أصحاب المشاريع والشركات بأمهر مهندسي ومطوري البرمجيات في العالم العربي،
                وفق معايير جودة الشيفرة (FQS)، مع تسليم مباشر وتعاقد شفاف يضمن نجاح أفكارك الرقمية
                بدون أي رسوم وساطة أو اقتطاعات مالية.
              </p>

              {/* Main Actions (Balanced, Professional, Single-Row with 3D Hover) */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/projects"
                    className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f2742] via-[#183b5e] to-[#1e4873] px-8 text-sm font-black text-white shadow-xl shadow-[#0f2742]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 active:scale-98 dark:from-teal-600 dark:via-teal-500 dark:to-cyan-500 dark:text-slate-950"
                  >
                    <Briefcase size={19} className="text-[#3ec4cb] dark:text-slate-950" />
                    <span>سوق المشاريع البرمجية</span>
                    <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/developers"
                    className="group inline-flex h-14 items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white/90 px-8 text-sm font-black text-[#152a40] shadow-md backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-50 hover:shadow-lg dark:border-white/10 dark:bg-[#0c1626] dark:text-white dark:hover:border-cyan-400"
                  >
                    <Users size={19} className="text-teal-600 dark:text-teal-400" />
                    <span>تصفح نخبة المطورين</span>
                    <ArrowLeft size={16} className="text-slate-400 transition group-hover:-translate-x-1 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/post-project"
                    className="inline-flex h-14 items-center gap-2 rounded-2xl border-2 border-dashed border-[#2ba6ae]/50 bg-[#f0fafb]/90 px-6 text-xs font-black text-[#1a767d] backdrop-blur-md transition-all duration-300 hover:border-[#2ba6ae] hover:bg-[#e4f6f7] dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-400/40"
                  >
                    <Plus size={16} />
                    <span>انشر مشروعًا</span>
                  </Link>
                </motion.div>
              </div>

              {/* Badges strip */}
              <div className="mt-10 flex flex-wrap items-center gap-3.5 border-t border-slate-200/80 pt-6 text-xs font-bold text-slate-600 dark:border-white/10 dark:text-slate-300">
                <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 shadow-2xs border border-slate-200/60 dark:bg-white/[0.04] dark:border-white/10 backdrop-blur-sm">
                  <Globe2 size={16} className="text-cyan-500" />
                  <span>مبرمجون من كل الدول العربية</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 shadow-2xs border border-slate-200/60 dark:bg-white/[0.04] dark:border-white/10 backdrop-blur-sm">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>تشفير تام وحصانة لبيانات المشاريع</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 shadow-2xs border border-slate-200/60 dark:bg-white/[0.04] dark:border-white/10 backdrop-blur-sm">
                  <Award size={16} className="text-teal-500" />
                  <span>معيار FQS وضمان تسليم الكود</span>
                </div>
              </div>
            </motion.div>

            {/* Hero 3D Interactive Cyber Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <CyberHeroCard3D
                onExploreDevelopers={() => go('/developers')}
                onExploreProjects={() => go('/projects')}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pan-Arab Countries Flag Strip */}
      <section className="relative z-10 border-y border-slate-200/70 bg-white/80 py-7 backdrop-blur-xl dark:border-white/10 dark:bg-[#08101d]/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-center text-xs font-black tracking-wide text-slate-600 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
            <span>نحتضن ونربط المبرمجين العرب المبدعين من:</span>
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-black text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
              18 دولة عربية
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {arabCountries.map((c) => (
              <motion.div
                key={c.name}
                whileHover={{ y: -3, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="group relative inline-flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-cyan-400 hover:bg-slate-50 hover:shadow-md hover:shadow-cyan-500/15 dark:border-white/10 dark:bg-[#0c1728]/90 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:bg-[#112138]"
              >
                <span className="relative flex h-4 w-6 shrink-0 overflow-hidden rounded-xs border border-slate-300/80 shadow-xs dark:border-white/20 transition-transform duration-200 group-hover:scale-110">
                  <img
                    src={`/flags/${c.code}.svg`}
                    alt={`علم ${c.name}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </span>
                <span className="whitespace-nowrap font-black">{c.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Platform Stats Strip */}
      <section className="relative z-10 bg-white/40 py-10 backdrop-blur-xs shadow-xs dark:bg-[#070d18]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border-2 border-slate-200/90 bg-white/90 p-5 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_15px_35px_rgba(0,242,254,0.2)] dark:border-white/10 dark:bg-[#0b1525]/90 dark:hover:border-cyan-400"
              >
                {/* Top Glowing Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 opacity-60 transition-opacity group-hover:opacity-100" />
                <div className="text-3xl font-black tracking-tight text-[#173250] dark:text-white">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs font-black text-slate-800 dark:text-slate-200">{stat.label}</div>
                <div className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{stat.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Developers Talent Carousel */}
      <section id="devs" className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black tracking-wider text-[#249fa6]">كفاءات استثنائية</span>
              <h2 className="mt-1.5 text-2xl font-black text-[#152a40] md:text-3xl">
                أبرز المطورين المتاحين للعمل الآن
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                مهندسون عرب موثقون ومعتمدون وفق اختبارات الكود وتجارب العملاء السابقة
              </p>
            </div>

            <Link
              href="/developers"
              className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-[#203d62] transition hover:border-[#30a7b0] hover:bg-[#f6fcfa] hover:text-[#187f87]"
            >
              <span>البحث في دليل المطورين</span>
              <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
            </Link>
          </div>

          {topDevelopers.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topDevelopers.map((dev, idx) => (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-[#5ec5cb] hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        {dev.avatar && dev.avatar.trim() !== '' ? (
                          <img
                            src={dev.avatar}
                            alt={dev.name}
                            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-xl font-black text-amber-400 ring-2 ring-slate-100 shadow-sm">
                            {dev.name ? dev.name.charAt(0) : 'م'}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#37b878]" />
                      </div>
                      {dev.fqs > 0 && (dev.completedProjects > 0 || dev.reviewsCount > 0) ? (
                        <div className="rounded-xl border border-[#d6f2f3] bg-[#edf8f9] px-2.5 py-1 text-center">
                          <span className="text-xs font-black text-[#1e8992]">{dev.fqs}</span>
                          <span className="block text-[8px] font-bold text-[#35979f]">FQS</span>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-center">
                          <span className="text-[10px] font-black text-teal-700 dark:text-teal-300">مطور معتمد</span>
                          <span className="block text-[8px] font-bold text-teal-600/70">FQS جديد</span>
                        </div>
                      )}
                    </div>

                    <h3 className="mt-3.5 text-sm font-black text-[#172b40]">{dev.name}</h3>
                    <p className="text-[11px] font-semibold text-slate-500">{dev.specialty}</p>

                    {dev.reviewsCount > 0 ? (
                      <div className="mt-2.5 flex items-center gap-1 text-[11px]">
                        <Star size={13} className="fill-[#e5a93b] text-[#e5a93b]" />
                        <span className="font-extrabold text-slate-700">{dev.rating}</span>
                        <span className="text-[10px] text-slate-400">({dev.reviewsCount} تقييم)</span>
                      </div>
                    ) : (
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-400">
                        <Star size={13} className="text-slate-300" />
                        <span className="text-[10px] font-semibold">عضو جديد (بدون تقييمات)</span>
                      </div>
                    )}

                    <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                      {dev.bio}
                    </p>

                    {/* Top Project Image Strip */}
                    {dev.portfolio && dev.portfolio.length > 0 && (
                      <div
                        onClick={() => {
                          setSelectedDevShowcase(dev);
                        }}
                        className="mt-3 cursor-pointer rounded-2xl border border-teal-500/30 bg-teal-500/10 p-2.5 transition hover:bg-teal-500/20 hover:border-teal-400 group/p"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-teal-700 dark:text-teal-300">
                          <span className="flex items-center gap-1.5 font-black">
                            <ImageIcon size={11} className="text-teal-500" />
                            <span>صورة من أعمال المطور</span>
                          </span>
                          <span className="text-[9px] text-teal-600 dark:text-teal-300 group-hover/p:translate-x-0.5 transition">عرض الصور ↗</span>
                        </div>
                        <div className="mt-1 font-black text-slate-800 dark:text-white text-xs truncate">
                          {dev.portfolio[0].title}
                        </div>
                        {dev.portfolio[0].metrics && (
                          <div className="mt-0.5 text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                            ⚡ {dev.portfolio[0].metrics}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1">
                      {dev.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-black text-[#203d62] dark:text-teal-300">
                        {dev.hourlyRate} <span className="text-[10px] text-slate-500 font-normal">{getDeveloperCurrency(dev)}/س</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {dev.completedProjects} مشاريع منجزة
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDevShowcase(dev)}
                        className="flex-1 rounded-xl bg-[#203d62] py-2 text-center text-[11px] font-bold text-white hover:bg-[#2c5383] shadow-xs active:scale-95 transition"
                      >
                        السيرة الذاتية والملف 📄
                      </button>

                      {dev.portfolio && dev.portfolio.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLiveProject(dev.portfolio[0]);
                            setLivePreviewDev(dev);
                          }}
                          className="rounded-xl border border-teal-500/40 bg-teal-500/10 px-3 py-2 text-[11px] font-black text-teal-700 hover:bg-teal-500/20 dark:text-teal-300 transition"
                          title="معاينة حية للمشروع"
                        >
                          معاينة 🚀
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                <Users size={28} />
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900 dark:text-white">
                كن أول مهندس ينضم إلى نخبة فوتيك المعتمدة!
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                سجّل حسابك الآن كمهندس برمجيات، وثّق مهاراتك ومعايير تسليم Git، واستقبل طلبات المشاريع الحصرية مباشرة.
              </p>
              {store.currentUser ? (
                <button
                  type="button"
                  onClick={() => go(store.currentUser?.role === 'owner' ? '/owner-dashboard' : '/dashboard')}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-105"
                >
                  <span>الانتقال إلى لوحة التحكم الخاصة بك</span>
                  <ArrowLeft size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth('developer', 'register')}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-105"
                >
                  <span>انضم الآن كمهندس برمجيات</span>
                  <ArrowLeft size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Multi-Image Interactive Showcase (Workflow, FQS Engine, Community) */}
      <section id="fqs" className="relative z-10 border-y border-slate-200/60 bg-gradient-to-b from-[#eaf4f7]/75 via-white/50 to-[#eef6f8]/75 py-16 backdrop-blur-md dark:border-white/10 dark:from-[#091523]/75 dark:via-[#070d18]/50 dark:to-[#091523]/75 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-black tracking-wider text-[#249fa6]">ركائز المنصة</span>
            <h2 className="mt-2 text-2xl font-black text-[#152a40] md:text-4xl">
              تكنولوجيا متقدمة وبيئة هندسية متكاملة
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 md:text-sm">
              استكشف كيف تجمع فوتيك بين سير العمل الهندسي، قياس جودة الكود، واحتضان المبرمجين العرب
            </p>

            {/* Feature Tabs Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveFeatureTab('workflow')}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition ${
                  activeFeatureTab === 'workflow'
                    ? 'bg-[#203d62] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers size={16} />
                <span>سير العمل والمراحل الذكية</span>
              </button>

              <button
                onClick={() => setActiveFeatureTab('fqs')}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition ${
                  activeFeatureTab === 'fqs'
                    ? 'bg-[#203d62] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Award size={16} />
                <span>محرك تقييم الجودة FQS</span>
              </button>

              <button
                onClick={() => setActiveFeatureTab('community')}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition ${
                  activeFeatureTab === 'community'
                    ? 'bg-[#203d62] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Globe2 size={16} />
                <span>حاضنة المبرمجين العرب</span>
              </button>
            </div>
          </div>

          {/* Interactive Feature View with Generated Images */}
          <div className="mt-12">
            <AnimatePresence mode="wait">
              {activeFeatureTab === 'workflow' && (
                <motion.div
                  key="workflow"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid items-center gap-10 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl lg:grid-cols-12 lg:p-10"
                >
                  <div className="lg:col-span-6">
                    <img
                      src="/images/collab.jpg"
                      alt="فريق التطوير وسير العمل"
                      className="h-80 w-full rounded-2xl object-cover shadow-lg md:h-96"
                    />
                  </div>

                  <div className="lg:col-span-6">
                    <span className="rounded-md bg-[#eaf6f6] px-2.5 py-1 text-[10px] font-black text-[#218f97]">
                      تتبع لحظي للمراحل
                    </span>
                    <h3 className="mt-3 text-xl font-black text-[#152c42] md:text-2xl">
                      تقسيم المشاريع إلى محطات إنجاز واضحة وقابلة للقياس
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 md:text-sm">
                      وداعًا للغموض وضياع المتطلبات؛ في فوتيك يتم تحديد النطاق ومخرجات كل مرحلة
                      مسبقًا، مما يمكن صاحب المشروع من مراجعة الكود واختبار الشاشات قبل اعتماد التسليم.
                    </p>

                    <div className="mt-6 space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#2ca5ae]" />
                        <span>مخطط زمني تفاعلي لتسليم الميزات ومراجعة الشيفرة</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#2ca5ae]" />
                        <span>فحص تجربة المستخدم والمخرجات في بيئة تجريبية حية</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#2ca5ae]" />
                        <span>محادثات فورية مرتبطة بسياق كل مهمة برمجية</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeFeatureTab === 'fqs' && (
                <motion.div
                  key="fqs"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid items-center gap-10 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl lg:grid-cols-12 lg:p-10"
                >
                  <div className="lg:col-span-6">
                    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-[#091524] p-6 text-white shadow-2xl dark:border-white/10 dark:bg-[#071322]">
                      {/* Widget Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-[#091524] shadow-md">
                            <ShieldCheck size={22} className="stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black tracking-wide text-white">
                                محرك قياس الجودة الهندسية FQS
                              </span>
                              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                                Live Engine
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              خوارزمية ذكية لاحتساب موثوقية الأداء البرمجي
                            </span>
                          </div>
                        </div>

                        <div className="text-left font-mono">
                          <div className="text-xl font-black text-emerald-400">100 / 100</div>
                          <div className="text-[9px] text-slate-400">تصنيف: خبير برمجيات</div>
                        </div>
                      </div>

                      {/* 4 Interactive Algorithmic Criteria */}
                      <div className="mt-5 space-y-3.5">
                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-200">1. معدل إكمال المشاريع (Completion Rate)</span>
                            <span className="font-mono font-black text-cyan-400">99% · وزن 35%</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400" style={{ width: '99%' }} />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-200">2. الالتزام بالوقت والميزانية (On Time & Budget)</span>
                            <span className="font-mono font-black text-teal-400">98% · وزن 30%</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400" style={{ width: '98%' }} />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-200">3. تقييم العملاء وفحص الكود (Code Rating)</span>
                            <span className="font-mono font-black text-emerald-400">98% · وزن 20%</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: '98%' }} />
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-200">4. معدل التوظيف المتكرر (Repeat Hire Rate)</span>
                            <span className="font-mono font-black text-indigo-400">92% · وزن 15%</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" style={{ width: '92%' }} />
                          </div>
                        </div>
                      </div>

                      {/* Footer Guarantee Pill */}
                      <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-[11px] text-emerald-300">
                        <span className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>فحص كود OWASP معتمد + تسليم مستودع Git مباشر</span>
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400">100% Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <span className="rounded-md bg-[#eaf6f6] px-2.5 py-1 text-[10px] font-black text-[#218f97]">
                      خوارزمية تقييم المطورين المعتمدة
                    </span>
                    <h3 className="mt-3 text-xl font-black text-[#152c42] md:text-2xl">
                      مؤشر FQS: معيار جودة المستقل والمبرمج الاحترافي
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 md:text-sm">
                      يقيس مؤشر Freelancer Quality Score كفاءة واحترافية المبرمجين وفق خوارزمية ذكية تجمع عدة معايير تقنية وسلوكية، ليحدد أولوية ظهور ملف المطور للعملاء وفرص فوزه بأهم المشاريع البرمجية.
                    </p>

                    <div className="mt-6 space-y-3 text-xs">
                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#2ca5ae]" />
                        <div>
                          <strong className="text-slate-800">معدل إكمال المشاريع (Job Completion Rate):</strong>
                          <p className="mt-0.5 text-[11px] text-slate-500">تسليم الأكواد والأنظمة كاملة دون إلغاء أو ثغرات أو تعثر في التنفيذ البرمجي.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#2ca5ae]" />
                        <div>
                          <strong className="text-slate-800">الالتزام بالوقت والميزانية (On Time & On Budget):</strong>
                          <p className="mt-0.5 text-[11px] text-slate-500">تسليم برمجيات خالية من المشاكل في الموعد المحدد ودون المطالبة بتكاليف إضافية غير متفق عليها.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#2ca5ae]" />
                        <div>
                          <strong className="text-slate-800">تقييم العملاء (Average Star Rating):</strong>
                          <p className="mt-0.5 text-[11px] text-slate-500">النجوم (من 1 إلى 5) ومراجعات أصحاب المشاريع التفصيلية بعد فحص الكود وتجربة البرنامج.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#2ca5ae]" />
                        <div>
                          <strong className="text-slate-800">معدل التوظيف المتكرر (Repeat Hire Rate):</strong>
                          <p className="mt-0.5 text-[11px] text-slate-500">عودة العميل للتعاقد مجدداً في مشاريع برمجية أخرى، وهو أقوى مؤشر على تميز جودة عملك.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeFeatureTab === 'community' && (
                <motion.div
                  key="community"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid items-center gap-10 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl lg:grid-cols-12 lg:p-10"
                >
                  <div className="lg:col-span-6">
                    <img
                      src="/images/escrow.jpg"
                      alt="حاضنة المبرمجين العرب"
                      className="h-80 w-full rounded-2xl object-cover shadow-lg md:h-96"
                    />
                  </div>

                  <div className="lg:col-span-6">
                    <span className="rounded-md bg-[#eaf6f6] px-2.5 py-1 text-[10px] font-black text-[#218f97]">
                      بيئة تقنية عربية متكاملة
                    </span>
                    <h3 className="mt-3 text-xl font-black text-[#152c42] md:text-2xl">
                      بيئة متكاملة تجمع نخبة الكفاءات والمطورين العرب
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 md:text-sm">
                      تجمع فوتيك الكفاءات البرمجية من كافة الأقطار العربية دون أي قيود، مع ربط مباشر
                      بأصحاب المشاريع، واتفاق شفاف على مراحل التسليم وتسليم الكود المصدري بدون أي رسوم وساطة أو اقتطاعات.
                    </p>

                    <div className="mt-6 space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#2ca5ae]" />
                        <span>اتفاقات عمل مباشرة ومرنة بين المطور وصاحب المشروع</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#2ca5ae]" />
                        <span>توثيق رسمي للكود المصدري وفق معايير FQS العالمية</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-[#2ca5ae]" />
                        <span>مجتمع برمجي داعم من المحيط إلى الخليج</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Available Projects Section */}
      <section id="projects" className="relative z-10 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black tracking-wider text-[#249fa6]">سوق الفرص</span>
              <h2 className="mt-1.5 text-2xl font-black text-[#152a40] md:text-3xl">
                أحدث المشاريع النشطة المعروضة
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                مشاريع جاهزة للتنفيذ بنطاق محدد وميزانيات مؤكدة
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-[#203d62] transition hover:bg-slate-50"
            >
              <span>تصفح كافة المشاريع</span>
              <ArrowLeft size={15} />
            </Link>
          </div>

          {availableProjects.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {availableProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-[#67c7cd] hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-[#eaf6f6] px-2.5 py-1 text-[10px] font-bold text-[#1f878f]">
                        {project.difficulty}
                      </span>
                      <span className="text-xs font-extrabold text-slate-400">
                        التسليم: {project.deadline}
                      </span>
                    </div>

                    <h3 className="mt-3.5 text-sm font-black leading-snug text-[#162c42]">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.stack?.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">الميزانية المرصودة</div>
                        <div className="text-base font-black text-[#173352]">
                          {project.budget.toLocaleString('ar-EG')} ر.س
                        </div>
                      </div>

                      <Link
                        href="/projects"
                        className="rounded-xl bg-[#203d62] px-4 py-2 text-xs font-bold text-white hover:bg-[#2b5182]"
                      >
                        تقديم عرض
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                <Briefcase size={28} />
              </div>
              <h3 className="mt-4 text-base font-black text-slate-900 dark:text-white">
                لا توجد مشاريع منشورة حالياً
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                كن أول من ينشر مشروعه البرمجي ويستقطب أفضل الكفاءات التقنية العربية مع حماية الضمان المالي Escrow وتسليم الكود الموثق.
              </p>
              <button
                type="button"
                onClick={() => go('/post-project')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#203d62] to-[#2b5182] px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-105"
              >
                <span>نشر مشروعك البرمجي الآن</span>
                <ArrowLeft size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it Works Roadmap */}
      <section id="roadmap" className="relative z-10 border-t border-slate-200/60 bg-white/70 py-16 backdrop-blur-md dark:border-white/10 dark:bg-[#0a1220]/70 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-black tracking-wider text-[#249fa6]">خطوات ميسرة</span>
            <h2 className="mt-2 text-2xl font-black text-[#152a40] md:text-3xl dark:text-white">
              كيف تنفذ مشروعك بنجاح في فوتيك؟
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400">
              دورة عمل سلسة تضمن الشفافية والراحة التامة للطرفين
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 text-center shadow-xs backdrop-blur-md transition hover:border-[#2dbdc4]/40 hover:shadow-lg dark:border-white/10 dark:bg-[#0b1525]/85"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e5f6f7] text-lg font-black text-[#229098] dark:bg-cyan-950/60 dark:text-cyan-300">
                ١
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f] dark:text-white">تحديد النطاق والمراحل</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                اكتب النتائج المتوقعة بوضوح، وقسّم المشروع إلى مراحل تسليم قابلة للفحص والمعاينة.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 text-center shadow-xs backdrop-blur-md transition hover:border-[#2dbdc4]/40 hover:shadow-lg dark:border-white/10 dark:bg-[#0b1525]/85"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf1fb] text-lg font-black text-[#345b96] dark:bg-blue-950/60 dark:text-blue-300">
                ٢
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f] dark:text-white">اختيار المطور المناسب</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                ابحث عبر دليل المطورين بمعيار FQS أو استقبل خطط العمل والعروض على مشروعك.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 text-center shadow-xs backdrop-blur-md transition hover:border-[#2dbdc4]/40 hover:shadow-lg dark:border-white/10 dark:bg-[#0b1525]/85"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f2eefb] text-lg font-black text-[#6942ad] dark:bg-purple-950/60 dark:text-purple-300">
                ٣
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f] dark:text-white">الاتفاق وبدء العمل</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                يتم الاتفاق مباشرة على تسليم المرحلة ويبدأ المطور بالتنفيذ والتواصل الفوري معك.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 text-center shadow-xs backdrop-blur-md transition hover:border-[#2dbdc4]/40 hover:shadow-lg dark:border-white/10 dark:bg-[#0b1525]/85"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf6ef] text-lg font-black text-[#338e5e] dark:bg-emerald-950/60 dark:text-emerald-300">
                ٤
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f] dark:text-white">المعاينة واستلام الكود</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                تفحص المرحلة وتستلم الكود المصدري كاملاً مع التوثيق المعتمد وفق معيار FQS.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section id="faqs" className="relative z-10 border-t border-slate-200/60 bg-white/40 py-16 backdrop-blur-md dark:border-white/10 dark:bg-[#070d18]/40 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-black tracking-wider text-[#249fa6]">الأسئلة الشائعة</span>
            <h2 className="mt-2 text-2xl font-black text-[#152a40] md:text-3xl dark:text-white">
              كل ما تود معرفته عن منصة فوتيك
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-xs transition backdrop-blur-md dark:border-white/10 dark:bg-[#0b1525]/85"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-right text-xs font-black text-[#18314e] transition hover:bg-slate-50 sm:text-sm"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#2ba3ac]' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50 p-5 text-xs leading-relaxed text-slate-600"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-10 bg-gradient-to-r from-[#14263b] via-[#1c3653] to-[#122336] py-16 text-white md:py-20 shadow-2xl">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-extrabold text-[#5cd5dc]">
            <Sparkles size={14} />
            <span>المنصة الوحيدة في العالم العربي تحتضن المبرمجين العرب من كل مكان</span>
          </div>
          <h2 className="mt-4 text-2xl font-black md:text-4xl">
            جاهز لبناء فكرتك التقنية مع أفضل الكفاءات؟
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-slate-300 md:text-sm">
            انضم إلى مجتمع فوتيك، تواصل مع المطورين، وانشر مشروعك في بيئة هندسية متكاملة تضمن لك
            راحة البال وجودة النتيجة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/post-project"
              className="rounded-2xl bg-[#2dbdc4] px-8 py-3.5 text-xs font-black text-[#0d2232] shadow-lg shadow-[#2dbdc4]/20 transition hover:brightness-110 active:scale-95"
            >
              انشر مشروعك مجانًا
            </Link>
            <Link
              href="/developers"
              className="rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-xs font-black text-white backdrop-blur-md hover:bg-white/20 active:scale-95"
            >
              ابحث عن المطورين
            </Link>
            <Link
              href="/support"
              className="rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-xs font-black text-white backdrop-blur-md hover:bg-white/20 active:scale-95"
            >
              الدعم ومقترحات التطوير
            </Link>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <Footer onNotify={notify} />

      {/* Floating Controls (Scroll to Top in bottom-right, Dot navigation & Live terminal on left) */}
      <FloatingControls isHome={true} />

      {/* Developer Comprehensive Showcase Modal */}
      <DeveloperShowcaseModal
        isOpen={Boolean(selectedDevShowcase)}
        onClose={() => setSelectedDevShowcase(null)}
        developer={selectedDevShowcase}
        onStartChat={(dev) => {
          setSelectedDevShowcase(null);
          go(`/chat?conversation=dev-${dev.id}`);
        }}
        onHireDeveloper={(dev) => {
          setSelectedDevShowcase(null);
          go('/post-project');
        }}
        notify={notify}
        currentUser={store.currentUser}
        onAddReview={(devId, rev) => {
          if (!update) return;
          const nextDevs = store.developers.map((d) => {
            if (d.id === devId) {
              const currentReviews = d.reviews || [];
              const nextReviews = [rev, ...currentReviews];
              const sum = nextReviews.reduce((acc, r) => acc + r.rating, 0);
              const nextRating = Number((sum / nextReviews.length).toFixed(2));
              return {
                ...d,
                reviews: nextReviews,
                rating: nextRating,
                reviewsCount: (d.reviewsCount || 0) + 1,
              };
            }
            return d;
          });
          update('developers', nextDevs);
        }}
      />

      {/* Live Project Preview Modal */}
      <LiveProjectPreviewModal
        isOpen={Boolean(selectedLiveProject)}
        onClose={() => {
          setSelectedLiveProject(null);
          setLivePreviewDev(null);
        }}
        project={selectedLiveProject}
        developer={livePreviewDev}
        onHireDeveloper={(dev) => {
          setSelectedLiveProject(null);
          go('/post-project');
        }}
      />

      {/* Platform Status & Developer Mina Robir Announcement Modal */}
      <DeveloperAnnouncementModal
        isOpen={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
      />
    </div>
  );
}
