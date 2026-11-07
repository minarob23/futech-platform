import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, MessageSquare, Mail, Github,
  Linkedin, MapPin, Briefcase, Award, Check,
  CreditCard, Rocket, Code2, ShieldCheck, Terminal,
  Calendar, CheckCircle2, ChevronLeft, ArrowLeft
} from 'lucide-react';

interface DeveloperAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperAnnouncementModal({ isOpen, onClose }: DeveloperAnnouncementModalProps) {
  const [activeTab, setActiveTab] = useState<'message' | 'platform' | 'cv'>('message');

  const whatsappUrl =
    'https://wa.me/201115294735?text=' +
    encodeURIComponent('يا باشمهندس مينا، قريت رسالتك وبيان منصة فوتيك، وربنا يوفقك ويحميك في خدمتك العسكرية وترجع بألف سلامة...');
  const emailUrl =
    'mailto:menarobir246rm@gmail.com?subject=' +
    encodeURIComponent('تواصل بخصوص منصة فوتيك FuTech - المهندس مينا روبير');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
        {/* Solid Backdrop (Strictly No Close on Backdrop Click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window: 100% Crisp Pure White Card (لونها أبيض) & In One Flow (في سطر واحد) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[36px] bg-white text-slate-800 shadow-2xl ring-1 ring-slate-200/90 overflow-hidden"
          dir="rtl"
        >
          {/* Top Decorative Gradient Accent Bar */}
          <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 shrink-0" />

          {/* Modal Header: Clean White with Founder Avatar and Single-Line Identity */}
          <div className="bg-white border-b border-slate-100 p-5 sm:p-6 pb-4 shrink-0">
            {/* Top Single-Line Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200/80 px-3 py-1 text-xs font-black text-teal-800">
                  <Sparkles size={13} className="text-teal-600" />
                  <span>بيان رسمي ورسالة من القلب</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>الموقع متاح للعمل الفعلي • تحت التجربة الحية</span>
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-slate-400">
                FuTech Platform v2.6 🇪🇬
              </div>
            </div>

            {/* Founder Single-Line Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 p-0.5 shadow-md shadow-teal-500/20">
                  <img
                    src="/images/futech-logo.jpg"
                    alt="شعار فوتيك"
                    className="h-full w-full rounded-[14px] object-cover"
                  />
                  <div className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white text-[10px]">
                    ✓
                  </div>
                </div>

                <div>
                  {/* Name In One Line */}
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                    المهندس مينا روبير مجدى فوزى
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                    <span className="font-bold text-teal-700">Full Stack Software Engineer & Founder</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <MapPin size={12} className="text-teal-600" />
                      <span>القاهرة، مصر • المنصورة</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Instant Action Links */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs font-black text-white transition shadow-sm shadow-emerald-500/30 active:scale-98"
                >
                  <MessageSquare size={14} />
                  <span>واتساب (+201115294735)</span>
                </a>

                <a
                  href="https://linkedin.com/in/minarob23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition"
                >
                  <Linkedin size={13} className="text-blue-600" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={emailUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition"
                >
                  <Mail size={13} className="text-rose-500" />
                  <span>إيميل</span>
                </a>
              </div>
            </div>

            {/* Single-Row Navigation Tabs */}
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs sm:text-sm font-black">
              <button
                type="button"
                onClick={() => setActiveTab('message')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
                  activeTab === 'message'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart size={14} className={activeTab === 'message' ? 'fill-white' : 'text-rose-500'} />
                <span>رسالة المطور والجيش 🇪🇬</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('platform')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
                  activeTab === 'platform'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Rocket size={14} />
                <span>بيان المنصة وبوابات الدفع</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('cv')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 transition cursor-pointer ${
                  activeTab === 'cv'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Code2 size={14} />
                <span>خبرات وسيرة مينا الهندسية</span>
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body: Pure White Background */}
          <div className="p-5 sm:p-6 md:p-7 overflow-y-auto space-y-5 bg-white text-slate-800">
            {/* ================= TAB 1: MINA'S HEARTFELT MESSAGE & ARMY SERVICE ================= */}
            {activeTab === 'message' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-right"
              >
                {/* Heartfelt Note Box */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-rose-800 text-xs sm:text-sm font-black mb-2">
                    <Heart size={17} className="fill-rose-500 text-rose-500 shrink-0" />
                    <span>دعوة من القلب • الواجب الوطني في الجيش 🇪🇬</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                    « يا جماعة، أنا أخوكم المهندس مينا روبير.. بقضي حالياً واجبي الوطني في <strong className="text-rose-700 font-black">الجيش (جيش الداخلية - قوات أمن)</strong> في مدينة المنصورة، وعاوزكم تدعولي من قلبكم ربنا يوفقني ويحميني ويعديها على خير وترجع الأيام بسلام! »
                  </p>
                </div>

                {/* Military Service Details: Strictly IN ONE LINE / ONE ROW (في سطر واحد) */}
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    تفاصيل الخدمة العسكرية (نظام الخدمة والمكان وتاريخ الانتهاء):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {/* Badge 1 */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 flex flex-col justify-center">
                      <span className="text-[11px] font-bold text-amber-800">نظام الخدمة بالكتيبة:</span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                        20 يوم خدمة / 10 أيام إجازة
                      </span>
                    </div>

                    {/* Badge 2 */}
                    <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3 flex flex-col justify-center">
                      <span className="text-[11px] font-bold text-teal-800">مكان الخدمة:</span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                        مدينة المنصورة (قوات الأمن)
                      </span>
                    </div>

                    {/* Badge 3 */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 flex flex-col justify-center">
                      <span className="text-[11px] font-bold text-emerald-800">تاريخ إنهاء الخدمة:</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">
                        25 فبراير 2027 (25/2/2027)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-600 leading-relaxed">
                  💡 <strong>ملاحظة للمطورين والعملاء:</strong> في كل إجازة بنزلها بيتنا في القاهرة، بفتح اللابتوب فوراً وأكمل تطوير المنصة ومتابعة متطلباتكم عشان نوفر بيئة عمل هندسية تخدمكم جميعاً بدون أي استغلال أو عمولات!
                </div>
              </motion.div>
            )}

            {/* ================= TAB 2: PLATFORM STATUS & PAYMENTS ================= */}
            {activeTab === 'platform' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-right"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    يا مساء الفل! المنصة شغالة ومفتوحة للجميع بحرية تامة 🎉
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    تقدروا تستخدموا المنصة فوراً بدون أي وسيط، إحنا حالياً في فترة <strong>التجربة الحية (Live Beta)</strong> عشان نطوّر السيستم ونسمع آراءكم واقتراحاتكم أولاً بأول.
                  </p>
                </div>

                {/* 2 Roles Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-teal-900 mb-1">
                      <Code2 size={16} className="text-teal-600" />
                      <span>لأخواتي المطورين:</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      اعمل بروفايلك، ارفع بورتفوليو أعمالك، وقدم على المشاريع براحتك، وهتاخد فلوسك كاملة بدون خصم مليم عمولة (0% Commission). وضفنا قسم كامل لمطوري <strong>WordPress و Shopify و Wix</strong>.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-cyan-900 mb-1">
                      <Briefcase size={16} className="text-cyan-600" />
                      <span>لأصحاب البيزنس والشركات:</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      انشر طلبات مشاريعك، حدد ميزانيتك، تصفح شغل أشطر مهندسين، وابدأ شات مشفر مع ضمان مالي ذكي بيحجز فلوسك ومابيدفعهاش إلا لما تستلم الشغل سليم بنسبة 100%.
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900">
                      <CreditCard size={16} className="text-amber-600" />
                      <span>وسائل الدفع وبوابات السداد (شغالين على إنهاء الربط الرسمي):</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Escrow Vault شغال
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs font-mono font-bold">
                    <div className="rounded-lg bg-white border border-slate-200 p-2 text-slate-800 shadow-2xs">
                      Vodafone Cash
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-2 text-slate-800 shadow-2xs">
                      InstaPay اللحظي
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-2 text-slate-800 shadow-2xs">
                      Visa / Mastercard
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-2 text-slate-800 shadow-2xs">
                      USDT (Crypto)
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-2 text-slate-800 shadow-2xs">
                      Fawry Pay
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-2 text-slate-800 shadow-2xs">
                      تحويل بنكي مباشر
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 3: DEVELOPER CV & TECH STACK ================= */}
            {activeTab === 'cv' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-right"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    سيرة وخبرات المهندس مينا روبير مجدى فوزى (بالبلدي وبكل فخر):
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    مهندس برمجيات Full Stack بخبرة أكثر من 3 سنوات، وخريج تدريب هندسة الأنظمة ALX Africa، وسلمت 5 منصات إنتاجية حية.
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-3.5 text-xs text-indigo-950 leading-relaxed font-medium">
                  ببني واجهات أمامية فائقة السرعة بـ <strong>React و Next.js (App Router)</strong>، وخدمات باك إند بـ <strong>Node.js و Python FastAPI و Java Spring Boot</strong>، وبصمم قواعد بيانات PostgreSQL سحابية بـ RLS على سيرفرات AWS، وبستخدم الذكاء الاصطناعي لتسريع الإنجاز بنسبة 50%.
                </div>

                {/* 4 Skill Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <div className="font-black text-teal-800">🤖 ذكاء اصطناعي</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Function Calling, RAG, Prompt Engineering.
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <div className="font-black text-cyan-800">💻 فرونت إند و 3D</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      React, Next.js, TS, Tailwind, Electron.js.
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <div className="font-black text-indigo-800">⚙️ باك إند وسيرفرات</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Node.js, Express, FastAPI, Redis, JWT.
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <div className="font-black text-emerald-800">🗄️ داتابيز و AWS</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      PostgreSQL, Supabase RLS, Docker, Git.
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
                  <div className="font-black text-slate-900 mb-1">📌 من أهم المشاريع اللي سلمتها:</div>
                  <p className="text-[11px] leading-relaxed">
                    • <strong>Puno POS:</strong> سيستم كاشير مطاعم ديسكتوب أوفلاين كامل بـ Electron و React متغلف Portable شغال عند عميل مع طباعة فواتير حرارية بدون أي تهنيج.
                    <br />
                    • <strong>5 منصات برمجية حية:</strong> في الرعاية الصحية (Algostep)، وسوق النسيج (Nile Tex)، وتجارة الملابس (ECS).
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer: Strictly In One Line (في سطر واحد) with White Background */}
          <div className="bg-white border-t border-slate-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
              شكراً لوقتكم ولدعواتكم لينا بالتوفيق والسلامة! ❤️
            </div>

            {/* Sole Exit Button: Strict No Skip Policy */}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 hover:brightness-110 px-6 py-2.5 text-xs sm:text-sm font-black text-white transition shadow-md shadow-teal-600/20 active:scale-98 cursor-pointer whitespace-nowrap"
            >
              <Check size={16} />
              <span>قرأت الرسالة يا باشمهندس مينا وربنا معاك • ادخل على فوتيك</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
