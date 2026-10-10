import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  CodeXml, Plus, Users, ShieldCheck, Activity, Layers, ArrowLeft,
  Briefcase, CheckCircle2, Star, Sparkles, ChevronLeft, Clock,
  FileCode2, CheckCheck, Lock, Award, Cpu, Terminal, ArrowUpRight,
  TrendingUp, Check, Zap, Eye, ChevronDown, MessageCircle, Lightbulb,
  HeartHandshake, Globe2
} from 'lucide-react';
import { Store, Project, Developer } from '../data/mockData';
import { Footer } from '../components/Footer';
import { FloatingControls } from '../components/FloatingControls';

interface HomePageProps {
  store: Store;
  go: (path: string) => void;
  notify?: (msg: string) => void;
}

export function HomePage({ store, go, notify }: HomePageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'workflow' | 'fqs' | 'community'>('workflow');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const availableProjects = store.projects.filter((p) => p.status === 'متاح').slice(0, 3);
  const topDevelopers = store.developers.slice(0, 4);

  const stats = [
    { label: 'مشاريع تقنية منجزة', value: '+520', detail: 'تم تسليمها وفق معايير FQS' },
    { label: 'مطورين ومبرمجين عرب', value: '+140', detail: 'من كافة الدول العربية' },
    { label: 'نسبة رضا أصحاب المشاريع', value: '98.9%', detail: 'تقييم 4.9 من 5 نجوم' },
    { label: 'رسوم وساطة أو اقتطاع', value: '0%', detail: 'تعاقد وتسليم حر ومباشر' },
  ];

  const arabCountries = [
    { name: 'السعودية', flag: '🇸🇦' },
    { name: 'مصر', flag: '🇪🇬' },
    { name: 'الإمارات', flag: '🇦🇪' },
    { name: 'المغرب', flag: '🇲🇦' },
    { name: 'الأردن', flag: '🇯🇴' },
    { name: 'العراق', flag: '🇮🇶' },
    { name: 'الكويت', flag: '🇰🇼' },
    { name: 'الجزائر', flag: '🇩🇿' },
    { name: 'عُمان', flag: '🇴🇲' },
    { name: 'قطر', flag: '🇶🇦' },
    { name: 'تونس', flag: '🇹🇳' },
    { name: 'البحرين', flag: '🇧🇭' },
    { name: 'لبنان', flag: '🇱🇧' },
    { name: 'فلسطين', flag: '🇵🇸' },
    { name: 'السودان', flag: '🇸🇩' },
    { name: 'ليبيا', flag: '🇱🇾' },
    { name: 'اليمن', flag: '🇾🇪' },
    { name: 'موريتانيا', flag: '🇲🇷' },
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
      a: 'تضم المنصة مطورين في مجالات الويب الشامل (Full-Stack)، الواجهات الأمامية (Frontend)، الأنظمة الخلفية والسحابية (Backend & Cloud)، تطبيقات الجوال (Mobile)، وحلول وهندسة الذكاء الاصطناعي (AI/ML).',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#fafbfc] text-[#1a2d42]">
      {/* Top Public Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/futech-logo.jpg"
              alt="شعار فوتيك FuTech"
              className="h-11 w-11 rounded-2xl object-cover shadow-md shadow-[#162a42]/20 ring-2 ring-[#2798a0]/30"
            />
            <div>
              <span className="block text-xl font-black tracking-tight text-[#162a42]">
                فوتيك <span className="text-xs font-bold text-[#2798a0]">FuTech</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400">
                حاضنة المبرمجين العرب
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-xs font-extrabold text-[#279ba4] transition"
            >
              الرئيسية
            </Link>
            <Link
              href="/developers"
              className="text-xs font-extrabold text-slate-600 transition hover:text-[#279ba4]"
            >
              البحث عن المطورين
            </Link>
            <Link
              href="/projects"
              className="text-xs font-extrabold text-slate-600 transition hover:text-[#279ba4]"
            >
              سوق المشاريع
            </Link>
            <Link
              href="/post-project"
              className="text-xs font-extrabold text-slate-600 transition hover:text-[#279ba4]"
            >
              نشر مشروع جديد
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-1.5 text-xs font-extrabold text-[#19757c] transition hover:text-[#279ba4]"
            >
              <Lightbulb size={14} className="text-[#2ca5ae]" />
              <span>الدعم الفني والاقتراحات</span>
            </Link>
            <Link
              href="/docs"
              className="text-xs font-extrabold text-slate-600 transition hover:text-[#279ba4]"
            >
              مركز المعرفة
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl border border-[#2798a0]/30 bg-[#edf8f9] px-4 py-2.5 text-xs font-black text-[#196b72] shadow-xs transition hover:border-[#2798a0] hover:bg-[#e4f6f7]"
            >
              <Activity size={15} className="text-[#2798a0]" />
              <span>لوحة تحكم المطور</span>
              <ArrowLeft size={13} className="transition group-hover:-translate-x-0.5" />
            </Link>

            <Link
              href="/post-project"
              className="hidden items-center gap-1.5 rounded-2xl bg-[#203d62] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-[#203d62]/20 transition hover:bg-[#2b507d] active:scale-95 sm:inline-flex"
            >
              <Plus size={16} />
              <span>انشر مشروعًا</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-[#f2f8fa] via-[#edf5f8] to-[#fafbfc] py-14 md:py-24">
        {/* Animated Glow Backdrops */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-20 top-0 h-[480px] w-[480px] rounded-full bg-[#3ec4cb]/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-20 top-28 h-[520px] w-[520px] rounded-full bg-[#1b3d68]/20 blur-3xl"
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
              {/* Highlight Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#2dbdc4]/40 bg-[#2dbdc4]/15 px-4 py-2 text-xs font-black text-[#136167] shadow-xs"
              >
                <Sparkles size={15} className="text-[#2ca5ae]" />
                <span>المنصة العربية الرائدة لهندسة البرمجيات</span>
              </motion.div>

              <h1 className="mt-5 text-3xl font-black leading-[1.25] tracking-tight text-[#14283d] sm:text-5xl lg:text-[48px]">
                حاضنة الكفاءات البرمجية العربية <br />
                <span className="bg-gradient-to-l from-[#229ca4] via-[#1f7c9e] to-[#16385b] bg-clip-text text-transparent">
                  ملتقى نخبة المطورين لإنجاز المشاريع باحترافية
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                نربط أصحاب المشاريع والشركات بأمهر مهندسي ومطوري البرمجيات في العالم العربي،
                وفق معايير جودة الشيفرة (FQS)، مع تسليم مباشر وتعاقد شفاف يضمن نجاح أفكارك الرقمية
                بدون أي رسوم وساطة أو اقتطاعات مالية.
              </p>

              {/* Main Actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/developers"
                  className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-2xl bg-[#203d62] px-8 text-xs font-black text-white shadow-xl shadow-[#203d62]/25 transition hover:-translate-y-0.5 hover:bg-[#2b507d] active:scale-95"
                >
                  <Users size={17} />
                  <span>البحث عن المطورين</span>
                  <ArrowLeft size={15} className="transition group-hover:-translate-x-1" />
                </Link>

                <Link
                  href="/post-project"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 text-xs font-black text-slate-700 shadow-xs transition hover:-translate-y-0.5 hover:border-[#38b5bd] hover:bg-[#f6fcfa] hover:text-[#1e8992]"
                >
                  <Plus size={16} />
                  <span>نشر مشروع جديد</span>
                </Link>

                <Link
                  href="/support"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border border-[#2798a0]/30 bg-[#edf8f9] px-6 text-xs font-black text-[#1e838b] transition hover:bg-[#e4f6f7]"
                >
                  <Lightbulb size={16} />
                  <span>شاركنا مقترحك للتطوير</span>
                </Link>
              </div>

              {/* Badges strip */}
              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-6 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <Globe2 size={18} className="text-[#269ca4]" />
                  <span>مبرمجون من كل الدول العربية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[#269ca4]" />
                  <span>معيار FQS البرمجي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[#269ca4]" />
                  <span>تسليم والتزام بالمواعيد</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image Showcase with floating widgets */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#2ab5bd]/30 to-[#193d65]/30 blur-2xl" />

                <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white p-3 shadow-2xl">
                  <img
                    src="/images/hero-banner.jpg"
                    alt="حاضنة الكفاءات البرمجية العربية"
                    className="h-84 w-full rounded-2xl object-cover transition duration-700 hover:scale-105 md:h-96"
                  />

                  {/* Floating Glass Widget: Pan-Arab Talent Hub */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute right-6 top-6 flex items-center gap-3 rounded-2xl border border-white/30 bg-[#122336]/85 p-3.5 text-white shadow-xl backdrop-blur-md"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#2dbdc4] text-[#0d2232]">
                      <Globe2 size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#63d9de]">حاضنة المبرمجين العرب</div>
                      <div className="text-xs font-black">كفاءات من كافة الدول العربية</div>
                    </div>
                  </motion.div>

                  {/* Floating Glass Widget 2: FQS Score & Direct Collaboration */}
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-white/30 bg-[#122336]/85 p-3.5 text-white shadow-xl backdrop-blur-md"
                  >
                    <div className="flex -space-x-2 space-x-reverse">
                      <img
                        src="/images/dev-female.jpg"
                        alt="ليان"
                        className="h-9 w-9 rounded-full border-2 border-[#122336] object-cover"
                      />
                      <img
                        src="/images/dev-male.jpg"
                        alt="بدر"
                        className="h-9 w-9 rounded-full border-2 border-[#122336] object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-black">تعاقد وتسليم كود مباشر</div>
                      <div className="text-[10px] text-slate-300">تسليم برمجي مباشر وموثوق</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pan-Arab Countries Flag Strip */}
      <section className="border-y border-slate-200/80 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs font-black text-slate-400">
            نحتضن ونربط المبرمجين العرب المبدعين من:
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {arabCountries.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-[#2dbdc4] hover:bg-[#edf8f9]"
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Platform Stats Strip */}
      <section className="bg-[#fbfcfd] py-10 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs"
              >
                <div className="text-3xl font-black tracking-tight text-[#173250]">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-xs font-black text-slate-700">{stat.label}</div>
                <div className="mt-0.5 text-[10px] text-slate-400">{stat.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Developers Talent Carousel */}
      <section id="devs" className="py-16 md:py-24">
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
                      <img
                        src={dev.avatar}
                        alt={dev.name}
                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100"
                      />
                      <span className="absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#37b878]" />
                    </div>
                    <div className="rounded-xl border border-[#d6f2f3] bg-[#edf8f9] px-2.5 py-1 text-center">
                      <span className="text-xs font-black text-[#1e8992]">{dev.fqs}</span>
                      <span className="block text-[8px] font-bold text-[#35979f]">FQS</span>
                    </div>
                  </div>

                  <h3 className="mt-3.5 text-sm font-black text-[#172b40]">{dev.name}</h3>
                  <p className="text-[11px] font-semibold text-slate-500">{dev.specialty}</p>

                  <div className="mt-2.5 flex items-center gap-1 text-[11px]">
                    <Star size={13} className="fill-[#e5a93b] text-[#e5a93b]" />
                    <span className="font-extrabold text-slate-700">{dev.rating}</span>
                    <span className="text-[10px] text-slate-400">({dev.reviewsCount} تقييم)</span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
                    {dev.bio}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {dev.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#203d62]">
                      {dev.hourlyRate} <span className="text-[10px] text-slate-500">ر.س/س</span>
                    </span>
                    <Link
                      href="/developers"
                      className="rounded-xl bg-[#203d62] px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#2c5383]"
                    >
                      عرض الملف
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Image Interactive Showcase (Workflow, FQS Engine, Community) */}
      <section id="fqs" className="border-y border-slate-200/80 bg-[#f3f7f9] py-16 md:py-24">
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
                    <img
                      src="/images/dashboard-mockup.jpg"
                      alt="لوحة فحص جودة الكود FQS"
                      className="h-80 w-full rounded-2xl object-cover shadow-lg md:h-96"
                    />
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
      <section id="projects" className="py-16 md:py-24">
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
                    {project.stack.map((s) => (
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
        </div>
      </section>

      {/* How it Works Roadmap */}
      <section id="roadmap" className="border-t border-slate-200/80 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-black tracking-wider text-[#249fa6]">خطوات ميسرة</span>
            <h2 className="mt-2 text-2xl font-black text-[#152a40] md:text-3xl">
              كيف تنفذ مشروعك بنجاح في فوتيك؟
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">
              دورة عمل سلسة تضمن الشفافية والراحة التامة للطرفين
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-100 bg-[#f9fafc] p-6 text-center shadow-xs"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e5f6f7] text-lg font-black text-[#229098]">
                ١
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f]">تحديد النطاق والمراحل</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                اكتب النتائج المتوقعة بوضوح، وقسّم المشروع إلى مراحل تسليم قابلة للفحص والمعاينة.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-100 bg-[#f9fafc] p-6 text-center shadow-xs"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf1fb] text-lg font-black text-[#345b96]">
                ٢
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f]">اختيار المطور المناسب</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                ابحث عبر دليل المطورين بمعيار FQS أو استقبل خطط العمل والعروض على مشروعك.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-100 bg-[#f9fafc] p-6 text-center shadow-xs"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f2eefb] text-lg font-black text-[#6942ad]">
                ٣
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f]">الاتفاق وبدء العمل</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                يتم الاتفاق مباشرة على تسليم المرحلة ويبدأ المطور بالتنفيذ والتواصل الفوري معك.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-slate-100 bg-[#f9fafc] p-6 text-center shadow-xs"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf6ef] text-lg font-black text-[#338e5e]">
                ٤
              </div>
              <h3 className="mt-4 text-sm font-black text-[#162a3f]">المعاينة واستلام الكود</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                تفحص المرحلة وتستلم الكود المصدري كاملاً مع التوثيق المعتمد وفق معيار FQS.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section id="faqs" className="border-t border-slate-200/80 bg-[#fbfcfd] py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-black tracking-wider text-[#249fa6]">الأسئلة الشائعة</span>
            <h2 className="mt-2 text-2xl font-black text-[#152a40] md:text-3xl">
              كل ما تود معرفته عن منصة فوتيك
            </h2>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition"
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
      <section className="bg-gradient-to-r from-[#14263b] via-[#1c3653] to-[#122336] py-16 text-white md:py-20">
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
    </div>
  );
}
