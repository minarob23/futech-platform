import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CodeXml,
  ShieldCheck,
  BookOpen,
  LifeBuoy,
  FileText,
  Lock,
  ArrowUp,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Scale,
  CheckCircle2,
  Send,
  Activity,
  Layers,
  Terminal,
  Server
} from 'lucide-react';

interface FooterProps {
  onNotify?: (msg: string) => void;
}

export function Footer({ onNotify }: FooterProps) {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      if (onNotify) onNotify('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    setSubscribed(true);
    if (onNotify) {
      onNotify('تم اشتراكك بنجاح في نشرة فوتيك البرمجية الأسبوعية! 🚀');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="relative mt-24 overflow-hidden border-t border-[#1e344e] bg-gradient-to-b from-[#0f1d2e] via-[#0b1624] to-[#070e17] text-slate-300">
        {/* Subtle Decorative Ambient Glows */}
        <div className="pointer-events-none absolute left-1/4 top-0 -z-10 h-72 w-72 rounded-full bg-[#2798a0]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#183659]/20 blur-3xl" />

        {/* Section 1: Top Bar with Newsletter & Quality Trust Highlights */}
        <div className="border-b border-white/5 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* Left / Newsletter Pitch */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#2db1ba]/30 bg-[#2db1ba]/10 px-3 py-1 text-xs font-black text-[#5ce0e8]">
                  <Sparkles size={13} />
                  <span>النشرة البرمجية الأسبوعية • FuTech Digest</span>
                </div>
                <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">
                  انضم لأكثر من 15,000 مهندس برمجي ومؤسس تقني
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">
                  احصل أسبوعياً على أحدث متطلبات السوق البرمجي، دراسات حالات الأنظمة، وتحديثات مؤشر الجودة FQS.
                </p>

                {/* Newsletter Form */}
                <form onSubmit={handleSubscribe} className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني (e.g. dev@domain.com)"
                      disabled={subscribed}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-hidden transition focus:border-[#2db1ba] focus:bg-[#16273c]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribed}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#20878e] to-[#2db1ba] px-5 py-2.5 text-xs font-black text-[#0b1c28] shadow-md shadow-[#2db1ba]/20 transition hover:from-[#259ca4] hover:to-[#38c8d2] disabled:opacity-60"
                  >
                    {subscribed ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>تم الاشتراك!</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>اشتراك الآن</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right / Platform Trust Highlights Pills */}
              <div className="grid grid-cols-2 gap-3 lg:col-span-5">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-xs transition hover:border-[#2db1ba]/30 hover:bg-white/[0.05]">
                  <div className="flex items-center gap-2.5 text-[#5ce0e8]">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-black text-white">تسليم كود موثق</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    نقل ملكية مستودعات Git وتوثيق README مع ملفات Docker.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-xs transition hover:border-[#2db1ba]/30 hover:bg-white/[0.05]">
                  <div className="flex items-center gap-2.5 text-[#5ce0e8]">
                    <Activity size={18} />
                    <span className="text-xs font-black text-white">معيار FQS الذكي</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    تقييم تلقائي لمعدل الإنجاز والالتزام بالجدول الزمني.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-xs transition hover:border-[#2db1ba]/30 hover:bg-white/[0.05]">
                  <div className="flex items-center gap-2.5 text-[#5ce0e8]">
                    <Lock size={18} />
                    <span className="text-xs font-black text-white">سرية تامة للأكواد</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    حماية الملكية الفكرية وسرية الشيفرة المصدرية 100%.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-xs transition hover:border-[#2db1ba]/30 hover:bg-white/[0.05]">
                  <div className="flex items-center gap-2.5 text-[#5ce0e8]">
                    <LifeBuoy size={18} />
                    <span className="text-xs font-black text-white">دعم وصيانة مستمرة</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    تذاكر دعم فني محددة باتفاقية مستوى الخدمة SLA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Main Footer Navigation Links */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* FuTech Brand Column */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <img
                  src="/images/futech-logo.jpg"
                  alt="شعار فوتيك FuTech"
                  className="h-12 w-12 rounded-2xl object-cover shadow-lg shadow-[#1b3758]/40 ring-2 ring-[#2db1ba]/40"
                />
                <span>
                  <span className="block text-xl font-black tracking-tight text-white">
                    فوتيك <span className="text-xs font-bold text-[#35c3cc]">FuTech</span>
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-400">
                    حاضنة الكفاءات البرمجية العربية
                  </span>
                </span>
              </Link>

              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                حاضنة الكفاءات البرمجية العربية — ملتقى نخبة المطورين لإنجاز المشاريع باحترافية، تسليم مستودعات برمجية معتمدة، وتوثيق تقني متقدم وفق أعلى معايير الجودة العالمية.
              </p>

              {/* Platform Status Pulse Indicator */}
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-bold text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>حالة المنصة: جميع الخدمات ومستودعات التوثيق تعمل بكفاءة (99.98%)</span>
              </div>

              {/* Social Channels Links */}
              <div className="mt-6 flex items-center gap-2.5">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub Community"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#2db1ba]/40 hover:bg-[#2db1ba]/10 hover:text-[#5ce0e8]"
                >
                  <Github size={16} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter / X"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#2db1ba]/40 hover:bg-[#2db1ba]/10 hover:text-[#5ce0e8]"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#2db1ba]/40 hover:bg-[#2db1ba]/10 hover:text-[#5ce0e8]"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  title="المجتمع البرمجي"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#2db1ba]/40 hover:bg-[#2db1ba]/10 hover:text-[#5ce0e8]"
                >
                  <Terminal size={16} />
                </a>
              </div>
            </div>

            {/* Column 2: Platform Navigation */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                استكشاف المنصة
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs font-bold text-slate-400">
                <li>
                  <Link href="/" className="transition hover:text-[#5ce0e8]">
                    الصفحة الرئيسية
                  </Link>
                </li>
                <li>
                  <Link href="/developers" className="transition hover:text-[#5ce0e8]">
                    البحث عن المطورين المعتمدين
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="transition hover:text-[#5ce0e8]">
                    سوق المشاريع البرمجية
                  </Link>
                </li>
                <li>
                  <Link href="/post-project" className="transition hover:text-[#5ce0e8]">
                    نشر مشروع برمجي جديد
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition hover:text-[#5ce0e8]">
                    بوابة ولوحة تحكم المطور
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Requested Links (Knowledge & Support) */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                المعرفة والدعم الفني
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs font-bold text-slate-400">
                <li>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-1.5 font-black text-[#5ce0e8] transition hover:underline"
                  >
                    <BookOpen size={14} />
                    <span>مركز المعرفة (Docs)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-1.5 font-black text-[#5ce0e8] transition hover:underline"
                  >
                    <LifeBuoy size={14} />
                    <span>الدعم الفني والاقتراحات</span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="transition hover:text-[#5ce0e8]">
                    دليل مؤشر الجودة FQS
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="transition hover:text-[#5ce0e8]">
                    إرشادات تسليم الكود عبر GitHub
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="transition hover:text-[#5ce0e8]">
                    نماذج تذاكر الدعم والصيانة SLA
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Requested Links (Terms & Privacy) */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                السياسات والشروط
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs font-bold text-slate-400">
                <li>
                  <button
                    onClick={() => setActiveModal('terms')}
                    className="inline-flex items-center gap-1.5 text-right font-black text-slate-300 transition hover:text-[#5ce0e8]"
                  >
                    <Scale size={14} className="text-[#35c3cc]" />
                    <span>اتفاقية المستخدم</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('privacy')}
                    className="inline-flex items-center gap-1.5 text-right font-black text-slate-300 transition hover:text-[#5ce0e8]"
                  >
                    <Lock size={14} className="text-[#35c3cc]" />
                    <span>سياسة الخصوصية</span>
                  </button>
                </li>
                <li>
                  <Link href="/docs" className="transition hover:text-[#5ce0e8]">
                    معايير الأمان OWASP
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="transition hover:text-[#5ce0e8]">
                    ميثاق النزاهة وحظر الدفع الخارجي
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Prominent Main Buttons Highlight Bar (As explicitly requested by user) */}
        <div className="border-t border-b border-white/5 bg-white/[0.02] py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-extrabold text-slate-400">
              الروابط الأساسية السريعة:
            </span>

            {/* The 4 core buttons requested by user */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => setActiveModal('terms')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-black text-slate-200 transition hover:border-[#2db1ba]/40 hover:bg-white/10 hover:text-white"
              >
                <Scale size={14} className="text-[#35c3cc]" />
                <span>اتفاقية المستخدم</span>
              </button>

              <button
                onClick={() => setActiveModal('privacy')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-black text-slate-200 transition hover:border-[#2db1ba]/40 hover:bg-white/10 hover:text-white"
              >
                <Lock size={14} className="text-[#35c3cc]" />
                <span>سياسة الخصوصية</span>
              </button>

              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2db1ba]/30 bg-[#2db1ba]/10 px-3.5 py-2 text-xs font-black text-[#5ce0e8] transition hover:bg-[#2db1ba]/20"
              >
                <LifeBuoy size={14} />
                <span>الدعم الفني والاقتراحات</span>
              </Link>

              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-xl border border-[#2db1ba]/30 bg-[#2db1ba]/10 px-3.5 py-2 text-xs font-black text-[#5ce0e8] transition hover:bg-[#2db1ba]/20"
              >
                <BookOpen size={14} />
                <span>مركز المعرفة</span>
              </Link>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <span>العودة للأعلى</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

        {/* Section 4: Copyright and Operational Footnote */}
        <div className="py-6 text-center">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-[11px] text-slate-500 sm:flex-row sm:px-6 lg:px-8">
            <div>
              © {new Date().getFullYear()} فوتيك (<span className="text-slate-400 font-bold">FuTech</span>) — حاضنة الكفاءات البرمجية العربية. جميع الحقوق محفوظة.
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1.5">
                <Server size={12} className="text-[#35c3cc]" />
                <span>خوادم الشرق الأوسط (GMT+3)</span>
              </span>
              <span>•</span>
              <span>الإصدار التوثيقي 2.4</span>
              <span>•</span>
              <span>اللغة: العربية (AR)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal 1: اتفاقية المستخدم (User Agreement) */}
      <AnimatePresence>
        {activeModal === 'terms' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#112133] p-6 text-right text-slate-200 shadow-2xl md:p-8"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#20878e]/20 text-[#5ce0e8]">
                    <Scale size={24} />
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-white">اتفاقية المستخدم وميثاق العمل البرمجي</h3>
                    <p className="text-xs text-slate-400">منصة فوتيك — حاضنة الكفاءات البرمجية العربية</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-6 text-xs leading-relaxed text-slate-300">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <CheckCircle2 size={16} />
                    <span>1. نطاق المنصة والهدف التعاقدي</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    منصة فوتيك هي حاضنة وسوق تقني متقدم يربط بين الكفاءات البرمجية العربية وأصحاب المشاريع والشركات الناشئة، بهدف إنجاز المشاريع باحترافية وتوفير التوثيق البرمجي الكامل وضمان تسليم الكود.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <CheckCircle2 size={16} />
                    <span>2. معايير تسليم الكود البرمجي ونقل الملكية (Git Ownership)</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    يلتزم المطور بتسليم الشيفرة المصدرية كاملة ونظيفة عبر منصات Git (مثل GitHub أو GitLab) مع نقل الملكية الكاملة (Transfer Ownership) لصاحب المشروع فور استيفاء شروط التسليم. كما يجب إرفاق ملف توثيق README، ملف متغيرات البيئة .env.example، وإعدادات التحزيم Dockerfile.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <CheckCircle2 size={16} />
                    <span>3. مؤشر جودة المستقل (FQS - Freelancer Quality Score)</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    يخضع كل مطور لمؤشر FQS المستمر والمحسوب تلقائيًا بناءً على أربعة محاور رئيسية: معدل إكمال المشاريع، الالتزام بالوقت والميزانية، متوسط تقييم العملاء، ومعدل التوظيف المتكرر. أي انخفاض غير مبرر في المؤشر يؤثر على أولوية الظهور في المنصة.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <CheckCircle2 size={16} />
                    <span>4. حظر التعاملات خارج المنصة والنزاهة المهنية</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    يُحظر تماماً محاولة توجيه الاتفاقات أو إجراء تسويات مالية خارج نطاق المنصة. يهدف هذا الحظر إلى حماية حقوق الطرفين وضمان توثيق المراسلات وحل النزاعات البرمجية بشكل عادل وفق اتفاقيات مستوى الخدمة المعتمدة.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <CheckCircle2 size={16} />
                    <span>5. الأمان وخلو البرمجيات من الثغرات الخبيثة</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    يتعهد المطور بعدم تضمين أي أكواد خبيثة أو أبواب خلفية (Backdoors) أو ثغرات أمنية شائعة تتعارض مع معايير OWASP Top 10. يتحمل الطرف المخالف التبعات القانونية والمهنية كاملة.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl bg-gradient-to-r from-[#20878e] to-[#2db1ba] px-6 py-2.5 text-xs font-black text-[#0b1c28] shadow-md transition hover:opacity-90"
                >
                  فهمت وأوافق على الاتفاقية
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: سياسة الخصوصية (Privacy Policy) */}
      <AnimatePresence>
        {activeModal === 'privacy' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#112133] p-6 text-right text-slate-200 shadow-2xl md:p-8"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#20878e]/20 text-[#5ce0e8]">
                    <Lock size={24} />
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-white">سياسة الخصوصية وسرية البيانات</h3>
                    <p className="text-xs text-slate-400">حماية سرية الشيفرات البرمجية والبيانات الشخصية</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-6 text-xs leading-relaxed text-slate-300">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <ShieldCheck size={16} />
                    <span>1. سرية الملكية الفكرية والأكواد البرمجية (IP Confidentiality)</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    تعتبر كافة المشاريع والأكواد البرمجية والمستودعات والملفات المرفوعة ملكية خاصة حصرية لأصحابها. لا تقوم المنصة بالاطلاع على محتوى الأكواد الخاصة إلا في حالات حل النزاعات التقنية بناءً على طلب أحد الطرفين.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <ShieldCheck size={16} />
                    <span>2. البيانات التي نجمعها وكيفية حمايتها</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    نجمع البيانات الأساسية الضرورية لتشغيل الحساب (الاسم، البريد الإلكتروني، المهارات البرمجية، ومعلومات التواصل الفني). تُشفر جميع البيانات الحساسة عبر بروتوكولات التشفير القياسية TLS 1.3 مع تخزين آمن لقواعد البيانات.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <ShieldCheck size={16} />
                    <span>3. عدم مشاركة البيانات مع أطراف ثالثة</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    لا تقوم فوتيك مطلقاً ببيع، تأجير، أو مشاركة بياناتك الشخصية أو ملفات مشاريعك مع أي أطراف تسويقية أو جهات تجارية خارجية.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <ShieldCheck size={16} />
                    <span>4. أمان الاتصالات وتذاكر الدعم</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    جميع الرسائل المتبادلة وتذاكر الدعم الفني وسجلات الأخطاء (Error Logs) المرفوعة تخضع لإجراءات وصول صارمة ومقيدة بفريق الدعم الفني المعتمد فقط.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-[#5ce0e8]">
                    <ShieldCheck size={16} />
                    <span>5. حق التعديل وحذف البيانات</span>
                  </h4>
                  <p className="mt-2 text-slate-300">
                    يحق للمستخدم في أي وقت طلب تصدير بيانات حسابه، أو تعديلها، أو إغلاق الحساب وحذف البيانات نهائياً من خوادم المنصة وفق الضوابط الفنية المعمول بها.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-xl bg-gradient-to-r from-[#20878e] to-[#2db1ba] px-6 py-2.5 text-xs font-black text-[#0b1c28] shadow-md transition hover:opacity-90"
                >
                  إغلاق ومتابعة التصفح
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
