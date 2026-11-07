import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, MessageSquare, Mail, Github,
  Linkedin, Phone, ExternalLink, CheckCircle2,
  CreditCard, Rocket, Code2, Cpu, Database, Cloud, Terminal,
  Calendar, MapPin, Briefcase, Award, Check, CheckCheck,
  Flame, ScrollText, Flag, Shield, Laptop, Star, ChevronLeft
} from 'lucide-react';

interface DeveloperAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperAnnouncementModal({ isOpen, onClose }: DeveloperAnnouncementModalProps) {
  const [activeTab, setActiveTab] = useState<'platform' | 'developer_cv'>('platform');

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
        {/* Solid Dark Backdrop (No skip on click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window: High-Impact Split-Screen Presentation (Completely Different & Eye-Catching) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-[32px] sm:rounded-[38px] bg-white text-slate-800 shadow-2xl ring-1 ring-slate-300/80 overflow-hidden dark:bg-[#091120] dark:text-slate-100 dark:ring-white/10"
          dir="rtl"
        >
          {/* Top Decorative Color Accent Strip */}
          <div className="h-2.5 w-full bg-gradient-to-r from-teal-500 via-amber-400 to-cyan-500 shrink-0" />

          {/* Grid Layout: Founder Sidebar (Right in RTL) + Dynamic Content (Left in RTL) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
            {/* ================= COLUMN 1: THE FOUNDER & MILITARY CARD (lg:col-span-5) ================= */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-[#0f2136] via-[#142d48] to-[#0a1626] text-white p-6 sm:p-7 md:p-8 border-b lg:border-b-0 lg:border-l border-white/10 overflow-y-auto">
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-400/40 px-3 py-1 text-xs font-bold text-teal-300">
                    <Sparkles size={12} className="text-teal-400" />
                    مؤسس ومطور المنصة
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    FuTech Platform 🇪🇬
                  </span>
                </div>

                {/* Founder Identity Card */}
                <div className="mt-5 flex items-center gap-4">
                  <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-400 p-1 shadow-xl shadow-teal-500/20">
                    <img
                      src="/images/futech-logo.jpg"
                      alt="شعار فوتيك"
                      className="h-full w-full rounded-[20px] object-cover"
                    />
                    <div className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900 text-[10px]">
                      👑
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      المهندس مينا روبير مجدى فوزى
                    </h3>
                    <div className="mt-1 text-xs font-bold text-teal-300">
                      Full Stack Software Engineer
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                      <MapPin size={13} className="text-teal-400" />
                      <span>القاهرة، مصر • المنصورة</span>
                    </div>
                  </div>
                </div>

                {/* Military Service Feature Card (Highlighted) */}
                <div className="mt-6 rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-rose-900/20 to-transparent p-5 backdrop-blur-xs">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-black">
                    <Heart size={16} className="fill-rose-500 text-rose-500" />
                    <span>دعوة من القلب • الواجب الوطني في الجيش 🇪🇬</span>
                  </div>

                  <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-slate-200 font-medium">
                    « يا جماعة، أنا أخوكم المهندس مينا.. بقضي حالياً واجبي الوطني في <strong className="text-rose-400 font-black">الجيش (جيش الداخلية - قوات أمن)</strong> في المنصورة. عاوزكم تدعولي من قلبكم ربنا يوفقني ويعديها على خير! »
                  </p>

                  {/* 3 Visual Counter Badges */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs">
                      <span className="text-slate-400 font-medium">نظام الخدمة:</span>
                      <span className="font-black text-amber-300">20 يوم خدمة بالكتيبة / 10 أيام إجازة</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs">
                      <span className="text-slate-400 font-medium">مكان الخدمة:</span>
                      <span className="font-black text-white">مدينة المنصورة (قوات الأمن)</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs">
                      <span className="text-slate-400 font-medium">تاريخ إنهاء الخدمة:</span>
                      <span className="font-black text-emerald-400">25 فبراير 2027 (25/2/2027) بمشيئة الله</span>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-300">
                    في كل إجازة بنزلها بيتنا في القاهرة، بفتح اللابتوب وأكمل تطوير الموقع عشان يخدمكم كلكم بأعلى كفاءة!
                  </p>
                </div>
              </div>

              {/* Direct Instant Contact Channels */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                <div className="text-xs font-bold text-slate-400 text-center">
                  تواصل مباشرة مع المهندس مينا روبير:
                </div>

                {/* WhatsApp Big Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-black text-white transition shadow-lg shadow-emerald-500/25 active:scale-98"
                >
                  <MessageSquare size={17} />
                  <span>كلّم مينا واتساب على طول (+201115294735)</span>
                </a>

                {/* Contact Links Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={emailUrl}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 p-2.5 text-slate-200 transition font-bold"
                  >
                    <Mail size={14} />
                    <span>إيميل رسمي</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/minarob23"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 p-2.5 text-white transition font-bold"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ================= COLUMN 2: EASY INTERACTIVE SHOWCASE (lg:col-span-7) ================= */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-[#0c1524] p-5 sm:p-7 md:p-8 overflow-y-auto">
              <div className="space-y-6">
                {/* Modern Switcher: 2 Distinct Tabs */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('platform')}
                      className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-black transition-all ${
                        activeTab === 'platform'
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400'
                      }`}
                    >
                      <Rocket size={15} />
                      <span>بيان المنصة وبوابات الدفع</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('developer_cv')}
                      className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-black transition-all ${
                        activeTab === 'developer_cv'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400'
                      }`}
                    >
                      <Code2 size={15} />
                      <span>خبرات وسيرة مينا الهندسية</span>
                    </button>
                  </div>

                  <span className="hidden sm:inline-flex rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 text-xs font-black dark:bg-emerald-950/60 dark:text-emerald-300">
                    🟢 متاح للعمل 100%
                  </span>
                </div>

                {/* TAB 1 CONTENT: PLATFORM STATUS & PAYMENTS */}
                {activeTab === 'platform' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5 text-right"
                  >
                    {/* Welcome Title */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        يا مساء الفل! المنصة شغالة ومفتوحة للجميع بحرية تامة 🎉
                      </h2>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        تقدروا تستخدموا المنصة فوراً وتتعاملوا عليها بدون وسيط. إحنا حالياً في فترة <strong>التجربة الحية (Live Beta)</strong> عشان نطوّر السيستم ونسمع آراءكم واقتراحاتكم.
                      </p>
                    </div>

                    {/* Freedom of Use Cards (Developers & Clients) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
                        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-teal-900 dark:text-teal-300">
                          <Code2 size={16} className="text-teal-600" />
                          <span>لأخواتي المطورين:</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          اعمل بروفايلك، ارفع بورتفوليو شغلك، وقدم على المشاريع براحتك، وهتاخد فلوسك كاملة بدون خصم مليم عمولة (0% Commission). وضفنا مخصوص قسم كامل لمطوري <strong>WordPress و Shopify و Wix</strong>.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-900/40 dark:bg-cyan-950/20">
                        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-cyan-900 dark:text-cyan-300">
                          <Briefcase size={16} className="text-cyan-600" />
                          <span>لأصحاب البيزنس والشركات:</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                          انشر طلبات مشاريعك، حدد ميزانيتك، تصفح شغل أشطر مهندسين، وابدأ شات مشفر مع ضمان مالي ذكي بيحجز فلوسك ومابيدفعهاش إلا لما تستلم الشغل سليم بنسبة 100%.
                        </p>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                        <CreditCard size={17} className="text-amber-500" />
                        <span>وسائل الدفع وبوابات السداد (شغالين على إنهاء الربط الرسمي):</span>
                      </div>

                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        بنجهز بوابات السحب والإيداع الرسمية عشان تتعاملوا بأسهل الطرق:
                      </p>

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
                        <div className="rounded-xl bg-white border border-slate-200/80 p-2 text-slate-800 dark:bg-[#070d18] dark:border-white/10 dark:text-slate-200">
                          Vodafone Cash
                        </div>
                        <div className="rounded-xl bg-white border border-slate-200/80 p-2 text-slate-800 dark:bg-[#070d18] dark:border-white/10 dark:text-slate-200">
                          InstaPay اللحظي
                        </div>
                        <div className="rounded-xl bg-white border border-slate-200/80 p-2 text-slate-800 dark:bg-[#070d18] dark:border-white/10 dark:text-slate-200">
                          Visa / Mastercard
                        </div>
                        <div className="rounded-xl bg-white border border-slate-200/80 p-2 text-slate-800 dark:bg-[#070d18] dark:border-white/10 dark:text-slate-200">
                          USDT Escrow (Crypto)
                        </div>
                        <div className="rounded-xl bg-white border border-slate-200/80 p-2 text-slate-800 dark:bg-[#070d18] dark:border-white/10 dark:text-slate-200">
                          Fawry Pay
                        </div>
                        <div className="rounded-xl bg-white border border-slate-200/80 p-2 text-slate-800 dark:bg-[#070d18] dark:border-white/10 dark:text-slate-200">
                          تحويل بنكي مباشر
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={14} className="shrink-0" />
                        <span>محفظة الضمان الذكية (Escrow Vault) شغالة حالياً لحفظ مستحقات كل خطوة.</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2 CONTENT: DEVELOPER CV & TECH SKILLS IN EGYPTIAN ARABIC */}
                {activeTab === 'developer_cv' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 text-right"
                  >
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        خبرات وسابقة أعمال المهندس مينا روبير (بالبلدي وبكل فخر):
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        مهندس Full Stack بقالي أكتر من 3 سنين، سلمت 5 منصات حية، وخريج تدريب هندسة الأنظمة ALX.
                      </p>
                    </div>

                    {/* Summary Box */}
                    <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200 p-4 text-xs leading-relaxed text-indigo-950 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-200">
                      ببني واجهات أمامية فائقة السرعة بـ <strong>React و Next.js (App Router)</strong>، وخدمات باك إند قوية بـ <strong>Node.js و Python FastAPI و Java Spring Boot</strong>. وبصمم قواعد بيانات PostgreSQL سحابية بـ RLS على سيرفرات AWS، وبستخدم أدوات الـ AI لتسريع الإنجاز بنسبة 50%.
                    </div>

                    {/* Skills Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 dark:bg-white/5 dark:border-white/10">
                        <div className="font-black text-teal-700 dark:text-teal-400">🤖 ذكاء اصطناعي و LLMs</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                          ربط دوال الذكاء الاصطناعي (Function Calling)، أنظمة RAG، و Prompt Engineering.
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 dark:bg-white/5 dark:border-white/10">
                        <div className="font-black text-cyan-700 dark:text-cyan-400">💻 فرونت إند و 3D</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                          React, Next.js, TypeScript, Tailwind CSS, Electron.js للديسكتوب، و Three.js للـ 3D.
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 dark:bg-white/5 dark:border-white/10">
                        <div className="font-black text-indigo-700 dark:text-indigo-400">⚙️ باك إند وسيرفرات</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                          Node.js, Express, Python FastAPI, Java Spring Boot, REST APIs, WebSockets, Redis, JWT.
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 dark:bg-white/5 dark:border-white/10">
                        <div className="font-black text-emerald-700 dark:text-emerald-400">🗄️ داتابيز وسحابة AWS</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                          PostgreSQL (Supabase RLS), SQLite, AWS (S3, Lambda, EC2), Docker, CI/CD, Git.
                        </div>
                      </div>
                    </div>

                    {/* Past Work Highlights */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      <div className="font-black text-slate-900 dark:text-white mb-1">
                        📌 من أهم المشاريع اللي سلمتها:
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        • <strong>Puno POS:</strong> سيستم كاشير مطاعم ديسكتوب أوفلاين كامل بـ Electron و React متغلف Portable شغال عند عميل مع طباعة فواتير حرارية بدون أي تهنيج.
                        <br />
                        • <strong>5 منصات برمجية حية:</strong> في مجالات الرعاية الصحية (Algostep)، وسوق النسيج (Nile Tex)، وتجارة الملابس (ECS).
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ================= FINAL ACTION: READ & ENTER (NO SKIP) ================= */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center sm:text-right">
                  شكراً لوقتكم ولدعواتكم لينا بالسلامة والتوفيق! ❤️
                </div>

                {/* Sole Action Button to Enter the Platform */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 hover:brightness-110 px-7 py-3 text-xs sm:text-sm font-black text-white transition shadow-lg shadow-teal-600/25 active:scale-98 cursor-pointer"
                >
                  <Check size={17} />
                  <span>قرأت الرسالة يا باشمهندس مينا وربنا معاك • ادخل على فوتيك</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
