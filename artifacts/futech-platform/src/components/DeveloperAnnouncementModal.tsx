import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ShieldCheck, Heart, MessageSquare, Mail, Github,
  Linkedin, Phone, ExternalLink, CheckCircle2, AlertTriangle,
  CreditCard, Rocket, Code2, Cpu, Database, Cloud, Terminal,
  Calendar, MapPin, Briefcase, Award, X, Copy, Check, ChevronRight,
  Shield, CheckCheck, Clock, Flag, UserCheck, Flame
} from 'lucide-react';

interface DeveloperAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperAnnouncementModal({ isOpen, onClose }: DeveloperAnnouncementModalProps) {
  const [activeTab, setActiveTab] = useState<'announcement' | 'profile' | 'experience'>('announcement');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const whatsappUrl =
    'https://wa.me/201115294735?text=' +
    encodeURIComponent('مرحباً يا باشمهندس مينا، تواصلت معك من خلال منصة فوتيك FuTech...');
  const emailUrl =
    'mailto:menarobir246rm@gmail.com?subject=' +
    encodeURIComponent('تواصل بخصوص منصة فوتيك FuTech ومشاريع البرمجة');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Main Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[32px] bg-white text-slate-800 shadow-2xl ring-1 ring-slate-200/80 overflow-hidden dark:bg-[#0a1220] dark:text-slate-100 dark:ring-white/10"
          dir="rtl"
        >
          {/* Top Rainbow Accent Strip */}
          <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500" />

          {/* Close Button (Fixed in Corner) */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100/80 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition dark:bg-white/5 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            title="إغلاق النافذة"
          >
            <X size={20} />
          </button>

          {/* ================= MODAL HEADER (Centered, Professional, Eye-Catching) ================= */}
          <div className="relative text-center px-6 pt-7 pb-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white dark:border-white/5 dark:from-[#0f1a2d]/60 dark:to-transparent">
            {/* Centered Glowing Icon Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-400 text-white shadow-xl shadow-teal-500/25 ring-4 ring-teal-500/15"
            >
              <Sparkles size={26} className="animate-pulse" />
            </motion.div>

            {/* Centered Badges */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 px-3 py-1 text-[11px] font-black text-emerald-800 shadow-2xs dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                الموقع متاح للعمل الفعلي 100%
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/90 px-3 py-1 text-[11px] font-black text-amber-800 shadow-2xs dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300">
                <Flame size={12} className="text-amber-600" />
                قيد التجربة والتحديثات المستمرة
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-indigo-50 border border-indigo-200/90 px-2.5 py-1 text-[10px] font-mono font-bold text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300">
                v2.6 PRO
              </span>
            </div>

            {/* Centered Grand Title */}
            <h2 className="text-xl sm:text-2xl md:text-[25px] font-black text-slate-900 tracking-tight dark:text-white">
              إعلان تشغيل منصة فوتيك ورسالة المهندس{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-300 dark:to-indigo-300">
                مينا روبير مجدى
              </span>
            </h2>

            {/* Centered Subtitle */}
            <p className="mt-2 text-xs sm:text-sm font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed dark:text-slate-400">
              بيان رسمي حول جاهزية المنصة للاستخدام الحر للمطور والعميل، التحديثات الجارية، وتفاصيل الخدمة العسكرية للمطور
            </p>
          </div>

          {/* ================= SEGMENTED NAVIGATION TABS (Centered) ================= */}
          <div className="flex items-center justify-center border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-white/5 dark:bg-[#070e1b]/70">
            <div className="inline-flex rounded-2xl bg-slate-200/70 p-1 ring-1 ring-slate-300/40 dark:bg-white/5 dark:ring-white/10">
              <button
                onClick={() => setActiveTab('announcement')}
                className={`flex items-center gap-2 rounded-xl py-2 px-3.5 sm:px-5 text-xs font-black transition-all ${
                  activeTab === 'announcement'
                    ? 'bg-white text-teal-700 shadow-md ring-1 ring-slate-200/70 dark:bg-teal-600 dark:text-white dark:ring-teal-400/30'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Rocket size={14} className={activeTab === 'announcement' ? 'text-teal-600 dark:text-white' : ''} />
                <span>إعلان المنصة والتحديثات</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 rounded-xl py-2 px-3.5 sm:px-5 text-xs font-black transition-all ${
                  activeTab === 'profile'
                    ? 'bg-white text-rose-700 shadow-md ring-1 ring-slate-200/70 dark:bg-rose-600 dark:text-white dark:ring-rose-400/30'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Heart size={14} className={activeTab === 'profile' ? 'fill-rose-600 text-rose-600 dark:fill-white dark:text-white' : 'text-rose-500'} />
                <span>رسالة المطور والجيش</span>
              </button>

              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 rounded-xl py-2 px-3.5 sm:px-5 text-xs font-black transition-all ${
                  activeTab === 'experience'
                    ? 'bg-white text-indigo-700 shadow-md ring-1 ring-slate-200/70 dark:bg-indigo-600 dark:text-white dark:ring-indigo-400/30'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Code2 size={14} className={activeTab === 'experience' ? 'text-indigo-600 dark:text-white' : ''} />
                <span>English CV & Skills</span>
              </button>
            </div>
          </div>

          {/* ================= MODAL BODY (Scrollable & Refined) ================= */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6">
            {/* ================= TAB 1: ANNOUNCEMENT & UPDATES ================= */}
            {activeTab === 'announcement' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Hero Announcement Banner (Centered Content) */}
                <div className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-50/80 via-cyan-50/50 to-white p-6 sm:p-7 text-center shadow-sm dark:from-teal-950/40 dark:via-cyan-950/20 dark:to-transparent dark:border-teal-500/25">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/30">
                    <CheckCheck size={26} />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    منصة فوتيك متاحة الآن للعمل الفعلي ويمكنك استخدامها بحرية تامة!
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 max-w-2xl mx-auto dark:text-slate-300">
                    نعلن بكل فخر عن إطلاق منصة <strong className="text-teal-600 dark:text-teal-400 font-black">فوتيك (FuTech Platform)</strong>{' '}
                    لتكون جاهزة لاستقبال المطورين والشركات وأصحاب الأعمال. المنصة تعمل بكافة وظائفها البرمجية ولكنها حالياً في مرحلة{' '}
                    <strong className="text-amber-700 dark:text-amber-400">التجربة الحية (Live Beta)</strong> لتلقي كافة المقترحات والتطوير المستمر.
                  </p>

                  {/* Two Columns: Developers & Clients Freedom */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-right pt-5 border-t border-teal-200/60 dark:border-teal-800/40">
                    {/* For Developers */}
                    <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 shadow-xs dark:bg-[#070d18] dark:ring-white/10">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-teal-800 dark:text-teal-400">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                          <Code2 size={16} />
                        </div>
                        <span>للمهندسين والمطورين (متاح بالكامل):</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        سجّل حسابك الآن، وثّق مهاراتك الهندسية، أنشئ معرض أعمالك التفاعلي، وقدّم عروضك على المشاريع المطروحة بحرية وبدون أي عمولات أو رسوم اشتراك (0% Commission).
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold">
                        <span className="rounded-md bg-teal-50 text-teal-800 px-2 py-0.5 border border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300">
                          WordPress / Shopify / Wix
                        </span>
                        <span className="rounded-md bg-teal-50 text-teal-800 px-2 py-0.5 border border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300">
                          Full-Stack / AI / Mobile
                        </span>
                      </div>
                    </div>

                    {/* For Clients */}
                    <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 shadow-xs dark:bg-[#070d18] dark:ring-white/10">
                      <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black text-cyan-800 dark:text-cyan-400">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
                          <Briefcase size={16} />
                        </div>
                        <span>لأصحاب المشاريع والشركات (متاح بالكامل):</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        اطرح متطلبات مشروعك البرمجي، حدد ميزانيتك، تصفح أفضل الكفاءات في 18 دولة عربية، وابدأ المحادثات الفورية المشفرة لمتابعة التسليم مرحلة بمرحلة تحت حماية الضمان المالي.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold">
                        <span className="rounded-md bg-cyan-50 text-cyan-800 px-2 py-0.5 border border-cyan-200/80 dark:bg-cyan-950/60 dark:text-cyan-300">
                          ضمان Escrow الذكي
                        </span>
                        <span className="rounded-md bg-cyan-50 text-cyan-800 px-2 py-0.5 border border-cyan-200/80 dark:bg-cyan-950/60 dark:text-cyan-300">
                          فحص الجودة Git FQS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Payments & Technical Innovations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payments Card */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-white/10 dark:bg-[#0c1524]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          وسائل الدفع وبوابات السداد
                        </h4>
                        <div className="text-[11px] text-amber-700 font-bold dark:text-amber-400">
                          قيد إتمام الربط الرسمي والامتثال المالي
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      يجري حالياً تجهيز وربط بوابات الدفع الإلكترونية المعتمدة لتمكين الدفع والسحب الفوري:
                    </p>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                        <span className="text-slate-800 dark:text-white">Vodafone Cash</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                        <span className="text-slate-800 dark:text-white">InstaPay</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                        <span className="text-slate-800 dark:text-white">Visa / Master</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                        <span className="text-slate-800 dark:text-white">USDT Escrow</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                        <span className="text-slate-800 dark:text-white">Fawry Pay</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
                        <span className="text-slate-800 dark:text-white">Bank Wire</span>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>محفظة الضمان المشفرة (Escrow Vault) مفعلة وتضمن حقوق الطرفين.</span>
                    </p>
                  </div>

                  {/* Ongoing Updates Card */}
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-white/10 dark:bg-[#0c1524]">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <Cpu size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          أبرز التحديثات المنفذة والجارية
                        </h4>
                        <div className="text-[11px] text-indigo-700 font-bold dark:text-indigo-400">
                          هندسة برمجية بأعلى كفاءة وسرعة
                        </div>
                      </div>
                    </div>

                    <ul className="mt-3.5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0 font-bold" />
                        <span><strong>Code Splitting:</strong> تقليص الحزمة الأولية 90% لتسريع التصفح.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0 font-bold" />
                        <span><strong>3D Spatial Objects:</strong> كائنات ثلاثية الأبعاد تفاعلية متطورة.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0 font-bold" />
                        <span><strong>دعم CMS الكامل:</strong> تصنيف متخصص لـ WordPress و Shopify و Wix.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0 font-bold" />
                        <span><strong>نظام التشفير والأمان:</strong> حماية ضد التسريب (Zero Leak) واتفاقيات NDA.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Call to Action Banner */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-slate-900 p-5 sm:p-6 text-white text-center sm:text-right">
                  <div>
                    <div className="text-sm font-black text-teal-400">هل لديك استفسار أو مقترح لتطوير المنصة؟</div>
                    <div className="text-xs text-slate-300 mt-1">تواصل مباشرة مع المهندس مينا روبير عبر واتساب أو البريد الإلكتروني.</div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-xs font-black text-white hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/25"
                    >
                      <MessageSquare size={16} />
                      <span>واتساب مباشر</span>
                    </a>
                    <a
                      href={emailUrl}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-xs font-black text-white hover:bg-white/20 transition"
                    >
                      <Mail size={16} />
                      <span>إيميل</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 2: DEVELOPER & MILITARY SERVICE ================= */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-center"
              >
                {/* Heartfelt Military Service Card */}
                <div className="rounded-3xl border border-rose-200 bg-gradient-to-b from-rose-50/70 via-amber-50/30 to-white p-6 sm:p-8 shadow-sm dark:from-rose-950/30 dark:via-amber-950/15 dark:to-transparent dark:border-rose-900/40">
                  {/* Centered Flag & Military Emblem */}
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-xl shadow-rose-600/30 ring-4 ring-rose-500/15">
                    <Heart size={26} className="fill-white" />
                  </div>

                  <span className="inline-block rounded-full bg-rose-100 text-rose-800 border border-rose-300 px-3.5 py-1 text-xs font-black dark:bg-rose-900/60 dark:text-rose-200 dark:border-rose-700">
                    دعوة صادقة من القلب • الواجب الوطني 🇪🇬
                  </span>

                  <h3 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    رسالة المطور والمهندس:{' '}
                    <span className="text-rose-600 dark:text-rose-400">مينا روبير مجدى فوزى</span>
                  </h3>

                  {/* Centered Quote Box */}
                  <div className="mt-4 rounded-3xl bg-white/95 p-5 sm:p-6 ring-1 ring-rose-200/80 text-slate-700 leading-relaxed text-xs sm:text-sm text-center max-w-2xl mx-auto shadow-xs dark:bg-[#070d18] dark:ring-white/10 dark:text-slate-200">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      « أخواتي وزملائي المطورين وأصحاب الأعمال الكرام، أنا أخوكم المهندس{' '}
                      <strong className="text-rose-600 dark:text-rose-400 font-black">مينا روبير مجدى فوزى</strong>
                      ، مؤسس ومطور هذه المنصة.
                    </p>

                    <p className="mt-2 text-rose-600 dark:text-rose-400 font-black text-sm sm:text-base">
                      أطلب منكم جميعاً بصدق خالص الدعاء لي بالتوفيق والسلامة، حيث أؤدي حالياً واجبي الوطني في الجيش (وزارة الداخلية).
                    </p>

                    {/* 3 Interactive Highlight Badges (Centered) */}
                    <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-200/80 dark:bg-white/5 dark:ring-white/10">
                        <div className="text-[10px] font-bold text-slate-400">نظام الخدمة</div>
                        <div className="mt-1 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          20 يوم خدمة / 10 أيام إجازة
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-200/80 dark:bg-white/5 dark:ring-white/10">
                        <div className="text-[10px] font-bold text-slate-400">مكان الخدمة</div>
                        <div className="mt-1 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                          مدينة المنصورة
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-200/80 dark:bg-white/5 dark:ring-white/10">
                        <div className="text-[10px] font-bold text-slate-400">تاريخ انتهاء الخدمة</div>
                        <div className="mt-1 text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">
                          25 فبراير 2027 (25/2/2027)
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ورغم مسؤوليات الخدمة، أحرص دائماً خلال فترات إجازتي على متابعة المنصة وتطويرها وتقديم الدعم الفوري لأي مطور أو عميل. دعواتكم الصادقة هي أغلى ما أملك! »
                    </p>
                  </div>
                </div>

                {/* Direct Contact Channels (Centered) */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs text-center dark:border-white/10 dark:bg-[#0c1524]">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                    قنوات التواصل المباشرة مع المهندس مينا روبير
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto text-right">
                    {/* WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 transition hover:bg-emerald-100 hover:border-emerald-400 shadow-2xs dark:bg-emerald-950/20 dark:border-emerald-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white shadow-md">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                            واتساب مباشر (انقر للمراسلة فوراً)
                          </div>
                          <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400" dir="ltr">
                            +20 111 529 4735
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={15} className="text-emerald-600 transition group-hover:translate-x-[-3px]" />
                    </a>

                    {/* Email */}
                    <a
                      href={emailUrl}
                      className="group flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50/70 p-4 transition hover:bg-teal-100 hover:border-teal-400 shadow-2xs dark:bg-teal-950/20 dark:border-teal-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white shadow-md">
                          <Mail size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-teal-900 dark:text-teal-300">
                            البريد الإلكتروني المعتمد
                          </div>
                          <div className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400" dir="ltr">
                            menarobir246rm@gmail.com
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={15} className="text-teal-600 transition group-hover:translate-x-[-3px]" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/in/minarob23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/70 p-4 transition hover:bg-blue-100 hover:border-blue-400 shadow-2xs dark:bg-blue-950/20 dark:border-blue-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-md">
                          <Linkedin size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-blue-900 dark:text-blue-300">
                            حساب LinkedIn الرسمي
                          </div>
                          <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400" dir="ltr">
                            linkedin.com/in/minarob23
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={15} className="text-blue-600 transition group-hover:translate-x-[-3px]" />
                    </a>

                    {/* GitHub */}
                    <a
                      href="https://github.com/minarob23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 hover:border-slate-400 shadow-2xs dark:bg-white/5 dark:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white shadow-md dark:bg-slate-800">
                          <Github size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">
                            مستودع الأكواد GitHub
                          </div>
                          <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400" dir="ltr">
                            github.com/minarob23
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={15} className="text-slate-500 transition group-hover:translate-x-[-3px]" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 3: ENGLISH CV & TECH SKILLS ================= */}
            {activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-left"
                dir="ltr"
              >
                {/* Centered Profile Hero Card */}
                <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-md text-center">
                  <span className="inline-block rounded-full bg-teal-400/20 border border-teal-400/40 px-3.5 py-1 text-xs font-mono font-bold text-teal-300">
                    FULL STACK SOFTWARE ENGINEER
                  </span>

                  <h3 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
                    MINA ROBIR MAGDY FAWZY
                  </h3>

                  <div className="mt-2 flex items-center justify-center gap-3 text-xs font-mono text-slate-300 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-teal-400" />
                      Location: Cairo, Egypt
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} className="text-teal-400" />
                      +201115294735
                    </span>
                  </div>

                  {/* Contact Action Pills (Centered) */}
                  <div className="mt-4 flex items-center justify-center gap-2.5 flex-wrap">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-sm"
                    >
                      <MessageSquare size={14} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={emailUrl}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <Mail size={14} />
                      <span>menarobir246rm@gmail.com</span>
                    </a>
                    <a
                      href="https://github.com/minarob23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                    <a
                      href="https://linkedin.com/in/minarob23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      <Linkedin size={14} />
                      <span>LinkedIn</span>
                    </a>
                  </div>

                  {/* Summary */}
                  <div className="mt-5 pt-5 border-t border-white/10 text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans text-left max-w-3xl mx-auto">
                    <strong>Professional Summary:</strong> Full Stack Software Engineer with 3+ years of experience, including a systems engineering internship and contract delivery of production web applications across the full Software Development Life Cycle (SDLC) for Health Tech SaaS, B2B e-commerce, and POS clients. Builds responsive frontends with React and Next.js (App Router) and backend services and APIs with Node.js (Express.js) and Python (FastAPI), with additional experience in Java (Spring Boot) and C++ through academic and systems projects. Designs PostgreSQL multi-tenant schemas with Row-Level Security and deploys on AWS. Integrates AI-assisted workflows (Claude Code) into daily development to speed up scaffolding and testing.
                  </div>
                </div>

                {/* Technical Skills Matrix */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0c1524]">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Terminal size={15} className="text-teal-500" />
                    <span>Technical Skills Matrix</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="font-bold text-teal-600 dark:text-teal-400 text-sm">AI & LLM Engineering</div>
                      <p className="mt-1.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        LLM Function Calling, Retrieval-Augmented Generation (RAG), Multimodal LLM APIs, Prompt Engineering.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">Frontend Development</div>
                      <p className="mt-1.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        React, Next.js (App Router), TypeScript, JavaScript (ES6+), Tailwind CSS, Vite, Electron.js, Three.js, Responsive Web Design, HTML5, CSS3.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">Backend & Distributed Systems</div>
                      <p className="mt-1.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        Node.js, Express.js, Python, FastAPI, Java, Spring Boot, C# (coursework), RESTful APIs, API Design & Integration, WebSockets, Redis, BullMQ, OAuth 2.0, JWT, RBAC, Rate Limiting.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Databases & Data Engineering</div>
                      <p className="mt-1.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        PostgreSQL (Supabase, Neon), SQLite (better-sqlite3), Row-Level Security (RLS), Supabase Auth, Drizzle ORM, Prisma ORM, Database Schema Design, Query Index Optimization, ACID Transactions.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="font-bold text-purple-600 dark:text-purple-400 text-sm">Cloud, DevOps & Architecture</div>
                      <p className="mt-1.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        AWS (S3, Lambda, API Gateway, EC2), Docker, Docker Compose, CI/CD, GitHub Actions, Git, Code Review, Agile/Scrum, Jest, PyTest, JUnit, Unit & Integration Testing.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <div className="font-bold text-amber-600 dark:text-amber-400 text-sm">Machine Learning & Systems Engineering</div>
                      <p className="mt-1.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        Scikit-Learn, XGBoost, LightGBM, Predictive Modeling, C, C++, POSIX Systems Programming, Memory Management, OOP, Data Structures & Algorithms, System Design.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Work Experience */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0c1524]">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Briefcase size={15} className="text-teal-500" />
                    <span>Work Experience</span>
                  </h4>

                  <div className="space-y-5 text-xs">
                    {/* Role 1 */}
                    <div className="border-l-2 border-teal-500 pl-4 py-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          Full Stack Software Engineer (Contract) / Consultant
                        </span>
                        <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                          Jul 2025 – Present
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">B2B SaaS & Commercial Solutions • Independent</div>
                      <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
                        <li>Delivered 5 production full-stack platforms for clients in Health Tech SaaS (Algostep), B2B textile marketplace (Nile Tex), custom apparel e-commerce (ECS), and commercial POS for restaurant and laundry businesses, owning database design, API development, and deployment on AWS.</li>
                        <li>Built Puno POS, an offline-capable desktop cashier system (Electron, React, Vite, Tailwind CSS) packaged as a portable executable and delivered to a restaurant client for table management and delivery orders.</li>
                        <li>Implemented offline-first local persistence using Electron's LocalStorage with serialized JSON behind a custom store layer for orders, tables, and customers, with no external database or native module dependencies.</li>
                        <li>Secured Electron IPC communication in Puno POS using contextBridge with contextIsolation enabled, exposing only a defined API surface to the renderer.</li>
                        <li>Implemented a non-blocking thermal receipt printing pipeline using hidden background BrowserWindow instances via asynchronous IPC, avoiding UI freezing during cashier operations.</li>
                        <li>Architected multi-tenant PostgreSQL schemas scoped by tenant-level UUIDs and cascading constraints, enforcing tenant-level data isolation across clinic accounts.</li>
                        <li>Implemented JWT session management and Role-Based Access Control (RBAC) across production client platforms, securing access across 4 distinct user roles.</li>
                        <li>Accelerated feature delivery cycles by ~50% leveraging AI-assisted engineering workflows (Claude Code) to automate schema scaffolding, boilerplate code, and test generation.</li>
                      </ul>
                    </div>

                    {/* Role 2 */}
                    <div className="border-l-2 border-indigo-500 pl-4 py-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          Mathematics Assistant & Tutor
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          Sep 2021 – Jun 2025
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">Educational Center</div>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Tutored 120+ students in applied and discrete mathematics, and supported coursework in programming (Java, Python, C++) and data structures. Developed automated assessment reconciliation scripts, saving 180+ administrative hours annually.
                      </p>
                    </div>

                    {/* Role 3 */}
                    <div className="border-l-2 border-cyan-500 pl-4 py-1">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          Software Systems Engineering Intern
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          Nov 2023 – Dec 2024
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">ALX Africa</div>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Developed 15+ low-level UNIX systems tools in C, C++, and Python, optimizing POSIX system calls, memory buffers, and multithreaded synchronization handling simulated concurrent processes. Engineered custom dynamic memory allocation algorithms validated via strict Valgrind memory profiling, eliminating memory leaks across 50+ test suites.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* ================= MODAL FOOTER (Balanced & Centered) ================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-[#080e1a]">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
              تمت برمجة وهندسة المنصة بالكامل بواسطة المهندس مينا روبير مجدى فوزى © 2026
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-600 transition shadow-md shadow-emerald-500/20"
              >
                <MessageSquare size={15} />
                <span>واتساب المهندس مينا</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-100 transition shadow-2xs dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                فهمت ومتابعة للموقع
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
