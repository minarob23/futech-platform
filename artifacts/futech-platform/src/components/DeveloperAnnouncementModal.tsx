import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, MessageSquare, Mail, Github,
  Linkedin, MapPin, Briefcase, Award, Check,
  CreditCard, Rocket, Code2, ShieldCheck, Terminal,
  Calendar, CheckCircle2, ChevronLeft, ArrowLeft,
  Phone, Globe, Layers, ArrowDown, ExternalLink
} from 'lucide-react';

interface DeveloperAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperAnnouncementModal({ isOpen, onClose }: DeveloperAnnouncementModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const whatsappUrl =
    'https://wa.me/201115294735?text=' +
    encodeURIComponent('يا باشمهندس مينا، قريت رسالتك وبيان منصة فوتيك، وربنا يوفقك ويحميك في خدمتك العسكرية وترجع بألف سلامة...');
  const emailUrl =
    'mailto:menarobir246rm@gmail.com?subject=' +
    encodeURIComponent('تواصل بخصوص منصة فوتيك FuTech - المهندس مينا روبير');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto">
        {/* Solid Dark Backdrop (Strictly No Close on Backdrop Click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window: Modern Dark/Light Glassmorphic Window with Natural Smooth Scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#0c1626] text-slate-800 dark:text-slate-100 shadow-2xl ring-1 ring-slate-200/90 dark:ring-slate-700/60 overflow-hidden"
          dir="rtl"
        >
          {/* Top Decorative Vibrant Accent Bar */}
          <div className="h-2.5 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600 shrink-0" />

          {/* ================= STICKY HEADER: FOUNDER AVATAR & IDENTITY ================= */}
          <div className="bg-white dark:bg-[#0e1726] border-b border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 pb-3 shrink-0 shadow-xs z-10">
            {/* Top Meta Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-500/40 px-3 py-1 text-xs sm:text-sm font-black text-teal-800 dark:text-teal-300">
                  <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>بيان رسمي ورسالة من القلب</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 px-3 py-1 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>الموقع متاح للعمل الفعلي • تحت التجربة الحية</span>
                </span>
              </div>

              <div className="text-xs sm:text-sm font-mono font-black text-slate-400 dark:text-slate-400">
                FuTech Platform v2.6 🇪🇬
              </div>
            </div>

            {/* Founder Profile Card: Centered with Eng. Mina's Real Avatar Image */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Eng. Mina Robir's Real Photo */}
              <div className="relative shrink-0">
                <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl overflow-hidden ring-4 ring-teal-500/30 shadow-lg shadow-teal-500/20 bg-slate-100 dark:bg-slate-800">
                  <img
                    src="/images/owner-google-avatar.png"
                    alt="المهندس مينا روبير مجدى فوزى"
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/futech-logo.jpg';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 text-white text-xs font-black shadow-xs">
                  ✓
                </div>
              </div>

              {/* Founder Information & Contact Grid */}
              <div className="flex-1 text-center sm:text-right">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      المهندس مينا روبير مجدى فوزى
                    </h2>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-400 mt-1">
                      <span>Full Stack Software Engineer & Platform Founder</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                        <MapPin size={13} className="text-teal-600 dark:text-teal-400" />
                        <span>القاهرة، مصر • المنصورة</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant Social & Contact Buttons */}
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs sm:text-sm font-black text-white transition shadow-sm shadow-emerald-600/25 active:scale-98 cursor-pointer"
                  >
                    <MessageSquare size={15} />
                    <span>واتساب (+201115294735)</span>
                  </a>

                  <a
                    href="https://github.com/minarob23"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 text-xs sm:text-sm font-bold text-white transition shadow-xs cursor-pointer"
                  >
                    <Github size={14} />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/minarob23"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs sm:text-sm font-bold text-white transition shadow-xs cursor-pointer"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={emailUrl}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                  >
                    <Mail size={14} className="text-rose-500" />
                    <span>إيميل رسمي</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick-Jump Section Navigation (Smooth Anchors with Clean Contrast) */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm font-black">
              <button
                type="button"
                onClick={() => scrollToSection('sec-military')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 px-3 py-1.5 transition cursor-pointer"
              >
                <Heart size={14} className="fill-rose-500 text-rose-500" />
                <span>دعوة الجيش والخدمة 🇪🇬</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('sec-platform')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-500/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-3 py-1.5 transition cursor-pointer"
              >
                <Rocket size={14} className="text-teal-600 dark:text-teal-400" />
                <span>بيان المنصة وبوابات الدفع 🚀</span>
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('sec-cv-ar')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 px-3.5 py-1.5 transition cursor-pointer"
              >
                <Code2 size={14} className="text-cyan-600 dark:text-cyan-400" />
                <span>سيرة مينا وسابقة الأعمال 💻</span>
              </button>
            </div>
          </div>

          {/* ================= SCROLLABLE MODAL BODY ================= */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-7 bg-white dark:bg-[#0c1626] text-slate-800 dark:text-slate-100 divide-y divide-slate-100 dark:divide-slate-800/80 scroll-smooth"
          >
            {/* ================= SECTION 1: MINA'S HEARTFELT MESSAGE & ARMY SERVICE ================= */}
            <div id="sec-military" className="space-y-4 pt-1 text-right">
              {/* Heartfelt Note Box with Rich Gradient & Crisp Contrast */}
              <div className="rounded-3xl border border-rose-200 dark:border-rose-500/40 bg-gradient-to-br from-rose-50/90 via-white to-rose-50/40 dark:from-rose-950/40 dark:via-[#111927] dark:to-slate-900/90 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2.5 text-rose-800 dark:text-rose-400 text-base sm:text-lg md:text-xl font-black mb-3">
                  <Heart size={22} className="fill-rose-500 text-rose-500 shrink-0" />
                  <span>دعوة من القلب • الواجب الوطني في الجيش 🇪🇬</span>
                </div>

                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-slate-800 dark:text-slate-100 font-semibold">
                  « يا جماعة، أنا أخوكم المهندس مينا روبير.. بقضي حالياً واجبي الوطني في{' '}
                  <strong className="text-rose-700 dark:text-rose-400 font-black">
                    الجيش (جيش الداخلية - قوات أمن)
                  </strong>{' '}
                  في مدينة المنصورة، وعاوزكم تدعولي من قلبكم ربنا يوفقني ويحميني ويعديها على خير وترجع الأيام بسلام! »
                </p>
              </div>

              {/* Military Service Details: 3 Crisp Badges */}
              <div>
                <div className="text-sm sm:text-base font-black text-slate-700 dark:text-slate-200 mb-2.5">
                  تفاصيل الخدمة العسكرية (نظام الخدمة والمكان وتاريخ الانتهاء):
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Badge 1 */}
                  <div className="rounded-2xl border border-amber-200 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/30 p-4 flex flex-col justify-center shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-400">نظام الخدمة بالكتيبة:</span>
                    <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
                      20 يوم خدمة / 10 أيام إجازة
                    </span>
                  </div>

                  {/* Badge 2 */}
                  <div className="rounded-2xl border border-teal-200 dark:border-teal-500/40 bg-teal-50/80 dark:bg-teal-950/30 p-4 flex flex-col justify-center shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-400">مكان الخدمة:</span>
                    <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
                      مدينة المنصورة (قوات الأمن)
                    </span>
                  </div>

                  {/* Badge 3 */}
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-950/30 p-4 flex flex-col justify-center shadow-xs">
                    <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400">تاريخ إنهاء الخدمة:</span>
                    <span className="text-base sm:text-lg md:text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                      25 فبراير 2027 (25/2/2027)
                    </span>
                  </div>
                </div>
              </div>

              {/* Note on Cairo leaves and development */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111927] p-4 sm:p-5 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                💡 <strong className="text-slate-900 dark:text-white font-black">ملاحظة للمطورين والعملاء:</strong> في كل إجازة بنزلها بيتنا في القاهرة، بفتح اللابتوب فوراً وأكمل تطوير المنصة ومتابعة متطلباتكم عشان نوفر بيئة عمل هندسية تخدمكم جميعاً بدون أي استغلال أو عمولات!
              </div>
            </div>

            {/* ================= SECTION 2: PLATFORM STATUS & PAYMENTS ================= */}
            <div id="sec-platform" className="space-y-4 pt-6 text-right">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-500/40 text-teal-800 dark:text-teal-300 text-xs font-black mb-2">
                  <Rocket size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>جاهزية المنصة ومرحلة الإطلاق الحي</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  يا مساء الفل! المنصة شغالة ومفتوحة للجميع بحرية تامة 🎉
                </h3>
                <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  تقدروا تستخدموا المنصة فوراً وتتعاملوا عليها بدون أي وسيط، إحنا حالياً في فترة <strong className="text-slate-900 dark:text-white">التجربة الحية (Live Beta)</strong> عشان نطوّر السيستم ونسمع آراءكم واقتراحاتكم أولاً بأول.
                </p>
              </div>

              {/* 2 Roles Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-teal-200 dark:border-teal-500/40 bg-teal-50/80 dark:bg-gradient-to-br dark:from-teal-950/40 dark:via-[#111b2b] dark:to-slate-900/90 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-base sm:text-lg font-black text-teal-900 dark:text-teal-300 mb-2">
                    <Code2 size={20} className="text-teal-600 dark:text-teal-400" />
                    <span>لأخواتي المطورين:</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                    اعمل بروفايلك، ارفع بورتفوليو أعمالك، وقدم على المشاريع براحتك، وهتاخد فلوسك كاملة بدون خصم مليم عمولة (0% Commission). وضفنا قسم كامل لمطوري <strong className="text-slate-900 dark:text-white font-black">WordPress و Shopify و Wix</strong>.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-200 dark:border-cyan-500/40 bg-cyan-50/80 dark:bg-gradient-to-br dark:from-cyan-950/40 dark:via-[#111b2b] dark:to-slate-900/90 p-4 sm:p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-base sm:text-lg font-black text-cyan-900 dark:text-cyan-300 mb-2">
                    <Briefcase size={20} className="text-cyan-600 dark:text-cyan-400" />
                    <span>لأصحاب البيزنس والشركات:</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                    انشر طلبات مشاريعك، حدد ميزانيتك، تصفح شغل أشطر مهندسين، وابدأ شات مشفر مع ضمان مالي ذكي بيحجز فلوسك ومابيدفعهاش إلا لما تستلم الشغل سليم بنسبة 100%.
                  </p>
                </div>
              </div>

              {/* Payment Methods Notice with High-Contrast Dark Styling */}
              <div className="rounded-2xl border border-amber-200 dark:border-amber-500/40 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 dark:from-amber-950/40 dark:via-[#141b2a] dark:to-slate-900/90 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-base sm:text-lg font-black text-amber-950 dark:text-amber-300">
                    <CreditCard size={20} className="text-amber-600 dark:text-amber-400" />
                    <span>وسائل الدفع وبوابات السداد (لسة متعملوش وشغالين على برمجتهم وربطهم):</span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 px-3 py-1 rounded-lg">
                    ⚠️ لسة ماتعملوش رسمياً (قيد التطوير)
                  </span>
                </div>

                <p className="text-sm sm:text-base text-amber-950 dark:text-amber-100 leading-relaxed font-semibold mb-3">
                  عشان الشفافية والأمانة الكاملة مع حضراتكم: بوابات السداد الإلكتروني المباشر <strong className="text-amber-900 dark:text-amber-300 font-black">لسة متعملتش وماتفعلتش على المنصة</strong>، وإحنا شغالين حالياً على الربط البرمجي والـ APIs الخاصة بيهم. التعامل والاتفاق حالياً بيتم بالتراضي والتواصل المباشر بين المطور والعميل لحين تفعيلهم رسمياً!
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center text-xs sm:text-sm font-mono font-bold">
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700/80 p-2.5 text-slate-800 dark:text-white shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white">Vodafone Cash</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mt-0.5 font-bold">قيد البرمجة ⏳</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700/80 p-2.5 text-slate-800 dark:text-white shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white">InstaPay اللحظي</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mt-0.5 font-bold">قيد البرمجة ⏳</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700/80 p-2.5 text-slate-800 dark:text-white shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white">Visa / Mastercard</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mt-0.5 font-bold">قيد البرمجة ⏳</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700/80 p-2.5 text-slate-800 dark:text-white shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white">USDT (Crypto)</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mt-0.5 font-bold">قيد البرمجة ⏳</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700/80 p-2.5 text-slate-800 dark:text-white shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white">Fawry Pay</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mt-0.5 font-bold">قيد البرمجة ⏳</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700/80 p-2.5 text-slate-800 dark:text-white shadow-2xs">
                    <div className="font-bold text-slate-900 dark:text-white">تحويل بنكي مباشر</div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 font-sans mt-0.5 font-bold">قيد البرمجة ⏳</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 border border-amber-200/60 dark:border-slate-800 p-2.5 rounded-xl">
                  <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <span>محفظة الضمان الذكية (Escrow Vault) هي الخطوة البرمجية القادمة لحفظ حقوق الطرفين وتأمين المعاملات.</span>
                </div>
              </div>
            </div>

            {/* ================= SECTION 3: ARABIC CV & PROJECTS ================= */}
            <div id="sec-cv-ar" className="space-y-4 pt-6 text-right">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 text-xs font-black mb-2">
                  <Code2 size={14} className="text-cyan-600 dark:text-cyan-400" />
                  <span>الخبرات والمسيرة المهنية</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                  سيرة وخبرات المهندس مينا روبير مجدى فوزى (بالبلدي وبكل فخر):
                </h3>
                <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
                  مهندس برمجيات Full Stack بخبرة أكثر من 3 سنوات، وخريج تدريب هندسة الأنظمة ALX Africa، وسلمت 5 منصات إنتاجية حية لعملاء كبار.
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/40 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 dark:from-indigo-950/40 dark:via-[#131b2e] dark:to-slate-900/90 p-4 sm:p-5 text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                ببني واجهات أمامية فائقة السرعة بـ <strong className="text-indigo-800 dark:text-indigo-300 font-bold">React و Next.js (App Router)</strong>، وخدمات باك إند بـ <strong className="text-indigo-800 dark:text-indigo-300 font-bold">Node.js و Python FastAPI و Java Spring Boot</strong>، وبصمم قواعد بيانات PostgreSQL سحابية بـ RLS على سيرفرات AWS، وبستخدم الذكاء الاصطناعي لتسريع الإنجاز بنسبة 50%.
              </div>

              {/* 4 Skill Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
                <div className="rounded-2xl border border-slate-200 dark:border-teal-500/30 bg-slate-50 dark:bg-teal-950/20 p-3.5 shadow-2xs">
                  <div className="font-black text-teal-800 dark:text-teal-300 text-sm sm:text-base">🤖 ذكاء اصطناعي</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Function Calling, RAG, Multimodal APIs, Prompt Engineering.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/30 bg-slate-50 dark:bg-cyan-950/20 p-3.5 shadow-2xs">
                  <div className="font-black text-cyan-800 dark:text-cyan-300 text-sm sm:text-base">💻 فرونت إند و 3D</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    React, Next.js, TS, Tailwind, Electron.js للديسكتوب.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-indigo-500/30 bg-slate-50 dark:bg-indigo-950/20 p-3.5 shadow-2xs">
                  <div className="font-black text-indigo-800 dark:text-indigo-300 text-sm sm:text-base">⚙️ باك إند وسيرفرات</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Node.js, Express, FastAPI, Spring Boot, Redis, JWT.
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-emerald-500/30 bg-slate-50 dark:bg-emerald-950/20 p-3.5 shadow-2xs">
                  <div className="font-black text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">🗄️ داتابيز و AWS</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    PostgreSQL, Supabase RLS, Docker, Git, CI/CD.
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111927] p-4 sm:p-5 text-sm sm:text-base text-slate-700 dark:text-slate-200">
                <div className="font-black text-slate-900 dark:text-white mb-2">📌 من أهم المشاريع اللي سلمتها للعملاء:</div>
                <div className="space-y-1.5 leading-relaxed">
                  <p>
                    • <strong className="text-slate-900 dark:text-white">Puno POS:</strong> سيستم كاشير مطاعم ديسكتوب أوفلاين كامل بـ Electron و React متغلف Portable شغال عند عميل مع طباعة فواتير حرارية بدون أي تهنيج.
                  </p>
                  <p>
                    • <strong className="text-slate-900 dark:text-white">5 منصات برمجية حية:</strong> في الرعاية الصحية (Algostep)، وسوق النسيج (Nile Tex)، وتجارة الملابس المخصصة (ECS).
                  </p>
                  <p>
                    • <strong className="text-slate-900 dark:text-white">ALX Africa:</strong> طوّرت أكثر من 15 أداة برمجية منخفضة المستوى بلغات C و C++ و Python لأنظمة UNIX.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= FIXED MODAL FOOTER ================= */}
          <div className="bg-white dark:bg-[#0e1726] border-t border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-xs">
            <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 text-center sm:text-right">
              شكراً جزيلاً لوقتكم ولدعواتكم لينا بالتوفيق والسلامة! ❤️
            </div>

            {/* Sole Action Button to Enter the Platform */}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 hover:brightness-110 px-6 sm:px-8 py-3 text-xs sm:text-sm md:text-base font-black text-white transition shadow-lg shadow-teal-600/25 active:scale-98 cursor-pointer text-center"
            >
              <Check size={19} className="shrink-0" />
              <span>قرأت الرسالة وربنا معاك يا باشمهندس مينا • ادخل على فوتيك</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
