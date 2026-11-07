import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, MessageSquare, Mail, Github,
  Linkedin, MapPin, Briefcase, Award, Check,
  CreditCard, Rocket, Code2, ShieldCheck, Terminal,
  Calendar, CheckCircle2, ChevronLeft, ArrowLeft,
  Phone, Globe, Layers, ArrowRight
} from 'lucide-react';

interface DeveloperAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperAnnouncementModal({ isOpen, onClose }: DeveloperAnnouncementModalProps) {
  const [activeTab, setActiveTab] = useState<'message' | 'platform' | 'cv_ar' | 'cv_en' | 'all'>('message');

  const whatsappUrl =
    'https://wa.me/201115294735?text=' +
    encodeURIComponent('يا باشمهندس مينا، قريت رسالتك وبيان منصة فوتيك، وربنا يوفقك ويحميك في خدمتك العسكرية وترجع بألف سلامة...');
  const emailUrl =
    'mailto:menarobir246rm@gmail.com?subject=' +
    encodeURIComponent('تواصل بخصوص منصة فوتيك FuTech - المهندس مينا روبير');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Solid Backdrop (Strictly No Close on Backdrop Click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window: 100% Crisp Pure White Card (لونها أبيض) & Responsive Fit (بدون أي قطع إطلاقاً) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-[24px] sm:rounded-[32px] bg-white text-slate-800 shadow-2xl ring-1 ring-slate-200/90 overflow-hidden"
          dir="rtl"
        >
          {/* Top Decorative Gradient Accent Bar */}
          <div className="h-2 sm:h-2.5 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 shrink-0" />

          {/* Modal Header: Clean White with Complete Contact Channels (WhatsApp, GitHub, LinkedIn, Email, Phone) */}
          <div className="bg-white border-b border-slate-100 p-4 sm:p-6 pb-3 sm:pb-4 shrink-0">
            {/* Top Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/80 px-3 py-1 text-xs sm:text-sm font-black text-teal-800">
                  <Sparkles size={14} className="text-teal-600" />
                  <span>بيان رسمي ورسالة من القلب</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs sm:text-sm font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>الموقع متاح للعمل الفعلي • تحت التجربة الحية</span>
                </span>
              </div>

              <div className="text-xs sm:text-sm font-mono font-black text-slate-400">
                FuTech Platform v2.6 🇪🇬
              </div>
            </div>

            {/* Founder Profile Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pt-1">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 p-0.5 shadow-md shadow-teal-500/25">
                  <img
                    src="/images/futech-logo.jpg"
                    alt="شعار فوتيك"
                    className="h-full w-full rounded-[14px] object-cover"
                  />
                  <div className="absolute -bottom-1 -left-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white text-white text-[11px] font-black">
                    ✓
                  </div>
                </div>

                <div>
                  {/* Name In One Line */}
                  <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    المهندس مينا روبير مجدى فوزى
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                    <span className="font-black text-teal-700">Full Stack Software Engineer & Founder</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-slate-600 font-bold">
                      <MapPin size={13} className="text-teal-600" />
                      <span>القاهرة، مصر • المنصورة</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Complete Direct Instant Action Links: WhatsApp + GitHub + LinkedIn + Email */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs sm:text-sm font-black text-white transition shadow-sm shadow-emerald-500/30 active:scale-98"
                >
                  <MessageSquare size={15} />
                  <span>واتساب (+201115294735)</span>
                </a>

                <a
                  href="https://github.com/minarob23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-black px-3 py-2 text-xs sm:text-sm font-bold text-white transition shadow-xs"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>

                <a
                  href="https://linkedin.com/in/minarob23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-2 text-xs sm:text-sm font-bold text-white transition shadow-xs"
                >
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={emailUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 transition"
                >
                  <Mail size={14} className="text-rose-500" />
                  <span>إيميل</span>
                </a>
              </div>
            </div>

            {/* Navigation Tabs Bar with Option to View Everything */}
            <div className="mt-4 flex items-center gap-1.5 sm:gap-2 border-t border-slate-100 pt-3 overflow-x-auto text-xs sm:text-sm font-black scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('message')}
                className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'message'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart size={15} className={activeTab === 'message' ? 'fill-white' : 'text-rose-500'} />
                <span>رسالة المطور والجيش 🇪🇬</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('platform')}
                className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'platform'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Rocket size={15} />
                <span>بيان المنصة وبوابات الدفع</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cv_ar')}
                className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'cv_ar'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Code2 size={15} />
                <span>خبرات وسيرة مينا (عربي)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cv_en')}
                className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'cv_en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Globe size={15} />
                <span>English CV & Stack</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 rounded-xl px-3 sm:px-3.5 py-2 transition shrink-0 cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Layers size={15} />
                <span>عرض البيان كاملاً 📜</span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body: Pure White Background */}
          <div className="p-4 sm:p-6 md:p-7 overflow-y-auto space-y-6 bg-white text-slate-800">
            {/* ================= SECTION 1: MINA'S HEARTFELT MESSAGE & ARMY SERVICE ================= */}
            {(activeTab === 'message' || activeTab === 'all') && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-right"
              >
                {/* Heartfelt Note Box */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-6">
                  <div className="flex items-center gap-2.5 text-rose-800 text-sm sm:text-base md:text-lg font-black mb-2.5">
                    <Heart size={20} className="fill-rose-500 text-rose-500 shrink-0" />
                    <span>دعوة من القلب • الواجب الوطني في الجيش 🇪🇬</span>
                  </div>

                  <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-800 font-medium">
                    « يا جماعة، أنا أخوكم المهندس مينا روبير.. بقضي حالياً واجبي الوطني في <strong className="text-rose-700 font-black">الجيش (جيش الداخلية - قوات أمن)</strong> في مدينة المنصورة، وعاوزكم تدعولي من قلبكم ربنا يوفقني ويحميني ويعديها على خير وترجع الأيام بسلام! »
                  </p>
                </div>

                {/* Military Service Details: IN ONE LINE / ONE ROW (في سطر واحد) */}
                <div>
                  <div className="text-xs sm:text-sm md:text-base font-black text-slate-700 mb-2.5">
                    تفاصيل الخدمة العسكرية (نظام الخدمة والمكان وتاريخ الانتهاء):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Badge 1 */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 sm:p-4 flex flex-col justify-center shadow-2xs">
                      <span className="text-xs sm:text-sm font-bold text-amber-800">نظام الخدمة بالكتيبة:</span>
                      <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 mt-1">
                        20 يوم خدمة / 10 أيام إجازة
                      </span>
                    </div>

                    {/* Badge 2 */}
                    <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-3.5 sm:p-4 flex flex-col justify-center shadow-2xs">
                      <span className="text-xs sm:text-sm font-bold text-teal-800">مكان الخدمة:</span>
                      <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 mt-1">
                        مدينة المنصورة (قوات الأمن)
                      </span>
                    </div>

                    {/* Badge 3 */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 sm:p-4 flex flex-col justify-center shadow-2xs">
                      <span className="text-xs sm:text-sm font-bold text-emerald-800">تاريخ إنهاء الخدمة:</span>
                      <span className="text-sm sm:text-base md:text-lg font-black text-emerald-700 mt-1">
                        25 فبراير 2027 (25/2/2027)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                  💡 <strong className="text-slate-900">ملاحظة للمطورين والعملاء:</strong> في كل إجازة بنزلها بيتنا في القاهرة، بفتح اللابتوب فوراً وأكمل تطوير المنصة ومتابعة متطلباتكم عشان نوفر بيئة عمل هندسية تخدمكم جميعاً بدون أي استغلال أو عمولات!
                </div>

                {activeTab === 'message' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('platform')}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-teal-700 hover:text-teal-800 underline cursor-pointer"
                    >
                      <span>الانتقال لبيان المنصة وبوابات الدفع</span>
                      <ArrowLeft size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ================= SECTION 2: PLATFORM STATUS & PAYMENTS ================= */}
            {(activeTab === 'platform' || activeTab === 'all') && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-right pt-2"
              >
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900">
                    يا مساء الفل! المنصة شغالة ومفتوحة للجميع بحرية تامة 🎉
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                    تقدروا تستخدموا المنصة فوراً وتتعاملوا عليها بدون أي وسيط، إحنا حالياً في فترة <strong>التجربة الحية (Live Beta)</strong> عشان نطوّر السيستم ونسمع آراءكم واقتراحاتكم أولاً بأول.
                  </p>
                </div>

                {/* 2 Roles Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-teal-900 mb-1.5">
                      <Code2 size={18} className="text-teal-600" />
                      <span>لأخواتي المطورين:</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                      اعمل بروفايلك، ارفع بورتفوليو أعمالك، وقدم على المشاريع براحتك، وهتاخد فلوسك كاملة بدون خصم مليم عمولة (0% Commission). وضفنا قسم كامل لمطوري <strong>WordPress و Shopify و Wix</strong>.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-cyan-900 mb-1.5">
                      <Briefcase size={18} className="text-cyan-600" />
                      <span>لأصحاب البيزنس والشركات:</span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
                      انشر طلبات مشاريعك، حدد ميزانيتك، تصفح شغل أشطر مهندسين، وابدأ شات مشفر مع ضمان مالي ذكي بيحجز فلوسك ومابيدفعهاش إلا لما تستلم الشغل سليم بنسبة 100%.
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-900">
                      <CreditCard size={18} className="text-amber-600" />
                      <span>وسائل الدفع وبوابات السداد (شغالين على إنهاء الربط الرسمي):</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      Escrow Vault شغال
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center text-xs sm:text-sm font-mono font-bold">
                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-800 shadow-2xs">
                      Vodafone Cash
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-800 shadow-2xs">
                      InstaPay اللحظي
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-800 shadow-2xs">
                      Visa / Mastercard
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-800 shadow-2xs">
                      USDT (Crypto)
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-800 shadow-2xs">
                      Fawry Pay
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-2.5 text-slate-800 shadow-2xs">
                      تحويل بنكي مباشر
                    </div>
                  </div>
                </div>

                {activeTab === 'platform' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('cv_ar')}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-teal-700 hover:text-teal-800 underline cursor-pointer"
                    >
                      <span>الانتقال لسيرة وخبرات المهندس مينا</span>
                      <ArrowLeft size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ================= SECTION 3: ARABIC CV & PROJECTS ================= */}
            {(activeTab === 'cv_ar' || activeTab === 'all') && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-right pt-2"
              >
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900">
                    سيرة وخبرات المهندس مينا روبير مجدى فوزى (بالبلدي وبكل فخر):
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
                    مهندس برمجيات Full Stack بخبرة أكثر من 3 سنوات، وخريج تدريب هندسة الأنظمة ALX Africa، وسلمت 5 منصات إنتاجية حية.
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 sm:p-5 text-xs sm:text-sm md:text-base text-indigo-950 leading-relaxed font-medium">
                  ببني واجهات أمامية فائقة السرعة بـ <strong>React و Next.js (App Router)</strong>، وخدمات باك إند بـ <strong>Node.js و Python FastAPI و Java Spring Boot</strong>، وبصمم قواعد بيانات PostgreSQL سحابية بـ RLS على سيرفرات AWS، وبستخدم الذكاء الاصطناعي لتسريع الإنجاز بنسبة 50%.
                </div>

                {/* 4 Skill Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="font-black text-teal-800 text-sm">🤖 ذكاء اصطناعي</div>
                    <div className="text-xs text-slate-600 mt-1">
                      Function Calling, RAG, Prompt Engineering.
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="font-black text-cyan-800 text-sm">💻 فرونت إند و 3D</div>
                    <div className="text-xs text-slate-600 mt-1">
                      React, Next.js, TS, Tailwind, Electron.js.
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="font-black text-indigo-800 text-sm">⚙️ باك إند وسيرفرات</div>
                    <div className="text-xs text-slate-600 mt-1">
                      Node.js, Express, FastAPI, Redis, JWT.
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="font-black text-emerald-800 text-sm">🗄️ داتابيز و AWS</div>
                    <div className="text-xs text-slate-600 mt-1">
                      PostgreSQL, Supabase RLS, Docker, Git.
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 text-xs sm:text-sm md:text-base text-slate-700">
                  <div className="font-black text-slate-900 mb-1.5">📌 من أهم المشاريع اللي سلمتها:</div>
                  <p className="leading-relaxed">
                    • <strong>Puno POS:</strong> سيستم كاشير مطاعم ديسكتوب أوفلاين كامل بـ Electron و React متغلف Portable شغال عند عميل مع طباعة فواتير حرارية بدون أي تهنيج.
                    <br />
                    • <strong>5 منصات برمجية حية:</strong> في الرعاية الصحية (Algostep)، وسوق النسيج (Nile Tex)، وتجارة الملابس (ECS).
                  </p>
                </div>
              </motion.div>
            )}

            {/* ================= SECTION 4: COMPLETE ENGLISH CV ================= */}
            {(activeTab === 'cv_en' || activeTab === 'all') && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-left border-t border-slate-100 pt-4"
                dir="ltr"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      MINA ROBIR MAGDY FAWZY
                    </h3>
                    <div className="text-xs text-teal-700 font-bold">
                      FULL STACK SOFTWARE ENGINEER • Cairo, Egypt
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
                    <span>Phone: +201115294735</span>
                    <span>•</span>
                    <a href="mailto:menarobir246rm@gmail.com" className="text-rose-600 underline">
                      menarobir246rm@gmail.com
                    </a>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  <strong>PROFESSIONAL SUMMARY:</strong> Full Stack Software Engineer with 3+ years of experience, including a systems engineering internship and contract delivery of production web applications across the full Software Development Life Cycle (SDLC) for Health Tech SaaS, B2B e-commerce, and POS clients. Builds responsive frontends with React and Next.js (App Router) and backend services and APIs with Node.js (Express.js) and Python (FastAPI), with additional experience in Java (Spring Boot) and C++. Designs PostgreSQL multi-tenant schemas with Row-Level Security and deploys on AWS.
                </div>

                {/* Technical Skills Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="rounded-xl border border-slate-200 p-3 bg-white">
                    <div className="font-bold text-teal-800">AI & LLM Engineering:</div>
                    <div className="text-slate-600 mt-1">
                      LLM Function Calling, RAG, Multimodal LLM APIs, Prompt Engineering.
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3 bg-white">
                    <div className="font-bold text-cyan-800">Frontend Development:</div>
                    <div className="text-slate-600 mt-1">
                      React, Next.js (App Router), TypeScript, Tailwind CSS, Vite, Electron.js, Three.js.
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3 bg-white">
                    <div className="font-bold text-indigo-800">Backend & Distributed Systems:</div>
                    <div className="text-slate-600 mt-1">
                      Node.js, Express.js, Python, FastAPI, Java Spring Boot, RESTful APIs, WebSockets, Redis, JWT.
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-3 bg-white">
                    <div className="font-bold text-emerald-800">Databases & Cloud Architecture:</div>
                    <div className="text-slate-600 mt-1">
                      PostgreSQL (Supabase RLS, Neon), SQLite, AWS (S3, Lambda, EC2), Docker, CI/CD, Git.
                    </div>
                  </div>
                </div>

                {/* Experience Highlights */}
                <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50 text-xs text-slate-700 space-y-1.5 font-sans">
                  <div className="font-bold text-slate-900">WORK EXPERIENCE:</div>
                  <div>• <strong>Full Stack Software Engineer (Contract)</strong> (Jul 2025 - Present): Delivered 5 production platforms (Algostep, Nile Tex, ECS, Puno POS).</div>
                  <div>• <strong>Mathematics Assistant & Tutor</strong> (Sep 2021 - Jun 2025): Supported 120+ students, automated scripts saving 180+ hours.</div>
                  <div>• <strong>Software Systems Engineering Intern - ALX Africa</strong> (Nov 2023 - Dec 2024): 15+ UNIX system tools in C/C++/Python, memory profiling with Valgrind.</div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer: Responsive, Generous Padding, ZERO Clipping (مستحيل يتقطع على أي شاشة) */}
          <div className="bg-white border-t border-slate-100 p-4 sm:p-5 px-5 sm:px-7 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs sm:text-sm font-bold text-slate-600 text-center sm:text-right">
              شكراً لوقتكم ولدعواتكم لينا بالتوفيق والسلامة! ❤️
            </div>

            {/* Sole Exit Button: Responsive Padding and Clean Flow */}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 hover:brightness-110 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-black text-white transition shadow-md shadow-teal-600/25 active:scale-98 cursor-pointer text-center"
            >
              <Check size={18} className="shrink-0" />
              <span>قرأت الرسالة وربنا معاك يا باشمهندس مينا • ادخل على فوتيك</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
