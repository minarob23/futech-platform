import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ShieldCheck, Heart, MessageSquare, Mail, Github,
  Linkedin, Phone, ExternalLink, CheckCircle2,
  CreditCard, Rocket, Code2, Cpu, Database, Cloud, Terminal,
  Calendar, MapPin, Briefcase, Award, Check, CheckCheck,
  Flame, ScrollText, UserCheck, Flag, ShieldAlert, ArrowDown
} from 'lucide-react';

interface DeveloperAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperAnnouncementModal({ isOpen, onClose }: DeveloperAnnouncementModalProps) {
  const [hasScrolledNearBottom, setHasScrolledNearBottom] = useState(false);

  const whatsappUrl =
    'https://wa.me/201115294735?text=' +
    encodeURIComponent('مرحباً يا باشمهندس مينا، قرأت رسالتك وبيان منصة فوتيك FuTech، وأتمنى لك كل التوفيق والسلامة في خدمتك العسكرية...');
  const emailUrl =
    'mailto:menarobir246rm@gmail.com?subject=' +
    encodeURIComponent('رسالة تواصل بخصوص منصة فوتيك FuTech - المهندس مينا روبير');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Solid Dark Backdrop (No skip on click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window: Styled as an Official Executive Letter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 25 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[36px] bg-[#fafafa] text-slate-800 shadow-2xl ring-1 ring-slate-300/80 overflow-hidden dark:bg-[#0c1424] dark:text-slate-100 dark:ring-white/10"
          dir="rtl"
        >
          {/* Top Decorative Gold & Teal Accent Ribbon */}
          <div className="h-2.5 w-full bg-gradient-to-r from-teal-500 via-amber-400 to-cyan-500 shrink-0" />

          {/* ================= LETTERHEAD (الهيدر الرسمي للرسالة - في المنتصف تماماً) ================= */}
          <div className="relative text-center px-6 pt-7 pb-5 border-b border-slate-200/80 bg-white/90 dark:bg-[#0f1a2d]/90 dark:border-white/10 shrink-0">
            {/* Centered Seal */}
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#122840] via-[#1c3d60] to-teal-700 text-teal-300 shadow-xl shadow-teal-900/20 ring-4 ring-teal-500/15">
              <ScrollText size={30} className="text-teal-300" />
            </div>

            {/* Official Letter Badge */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300 shadow-2xs">
                📜 بيان رسمي ورسالة مفتوحة للقراءة
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300 shadow-2xs">
                🟢 الموقع متاح للعمل الفعلي • تحت التجربة
              </span>
            </div>

            {/* Centered Grand Title */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-black text-slate-900 tracking-tight dark:text-white">
              رسالة من مؤسس ومطور المنصة المهندس{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-300 dark:to-indigo-300">
                مينا روبير مجدى فوزى
              </span>
            </h1>

            {/* Centered Document Metadata */}
            <div className="mt-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 flex-wrap">
              <span>منصة فوتيك FuTech Platform © 2026</span>
              <span>•</span>
              <span>القاهرة / المنصورة • جمهورية مصر العربية 🇪🇬</span>
            </div>
          </div>

          {/* ================= LETTER CONTENT (Continuous Flowing Document) ================= */}
          <div
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
                setHasScrolledNearBottom(true);
              }
            }}
            className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-7 leading-relaxed font-sans text-slate-700 dark:text-slate-200"
          >
            {/* Greeting */}
            <div className="border-r-4 border-teal-500 pr-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                إلى إخوتي وزملائي مهندسي ومطوري البرمجيات، وإلى أصحاب المشاريع والشركات الكرام:
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                تحية طيبة وبعد، أضع بين أيديكم هذه الرسالة الهامة بخصوص المنصة، حالتها، التحديثات الجارية، وتفاصيل واجبي الوطني.
              </p>
            </div>

            {/* Part 1: Platform Readiness & Active Beta */}
            <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-50/70 via-cyan-50/40 to-white p-6 shadow-xs dark:from-teal-950/30 dark:via-cyan-950/15 dark:to-transparent dark:border-teal-500/20">
              <div className="flex items-center gap-2.5 text-teal-800 dark:text-teal-400 font-black text-sm sm:text-base mb-2">
                <Rocket size={20} className="text-teal-600 dark:text-teal-400" />
                <span>أولاً: الموقع متاح للعمل الفعلي ويمكنكم استخدامه بحرية كاملة</span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                أود أن أؤكد لكم رسمياً أن <strong>منصة فوتيك (FuTech Platform)</strong> أصبحت جاهزة ومفتوحة للعمل الفعلي المباشر بين المطورين والعملاء. تعمل المنصة بكافة محركاتها، ولكنها حالياً في مرحلة <strong className="text-amber-700 dark:text-amber-400">التجربة العملية الحية (Live Beta)</strong> لتلقي كافة المقترحات والتطوير المستمر.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-teal-200/60 dark:border-teal-800/40">
                <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 dark:bg-[#070d18] dark:ring-white/10">
                  <div className="font-black text-xs text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                    <Code2 size={16} />
                    <span>للمهندسين والمطورين:</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    يمكنكم إنشاء حساباتكم فوراً، بناء معارض أعمالكم (Portfolios)، التقديم على المشاريع، والتمتع بعمولة 0% (Developers keep 100% of payout). تم دمج تصنيف منصات CMS (WordPress, Shopify, Wix) بالكامل.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 dark:bg-[#070d18] dark:ring-white/10">
                  <div className="font-black text-xs text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                    <Briefcase size={16} />
                    <span>لأصحاب المشاريع والشركات:</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    يمكنكم نشر متطلبات مشاريعكم بحرية، تصفح أفضل المبرمجين العرب، وبدء محادثات فورية مشفرة لضمان استلام مشاريعكم وفق أعلى معايير الجودة (FQS).
                  </p>
                </div>
              </div>
            </div>

            {/* Part 2: Payments & Security */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0b1322]">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-sm sm:text-base mb-2">
                <CreditCard size={20} className="text-amber-500" />
                <span>ثانياً: التحديثات الجارية ومنظومة بوابات السداد والضمان المالي</span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                نعمل حالياً على استكمال إجراءات الربط الرسمي والامتثال المالي مع بوابات الدفع الإلكترونية لتوفير السداد والسحب التلقائي:
              </p>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs font-mono font-bold">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  Vodafone Cash
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  InstaPay
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  Visa / Mastercard
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  USDT Escrow (Crypto)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  Fawry Pay
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  Bank Wire Transfer
                </div>
              </div>

              <p className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>نظام الضمان المشفر (Escrow Vault) يعمل حالياً لحفظ مستحقات كل مرحلة وعدم تحويلها إلا بعد موافقة العميل.</span>
              </p>
            </div>

            {/* Part 3: Personal Letter & Military Service (الرسالة الشخصية من القلب) */}
            <div className="rounded-3xl border border-rose-200 bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-white p-6 sm:p-8 shadow-sm dark:from-rose-950/30 dark:via-amber-950/15 dark:to-transparent dark:border-rose-900/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md">
                  <Heart size={24} className="fill-white" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    ثالثاً: رسالة من القلب • الواجب الوطني في الجيش 🇪🇬
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    طلب دعاء بالتوفيق والسلامة من المهندس مينا روبير
                  </h3>
                </div>
              </div>

              <div className="rounded-2xl bg-white/95 p-5 ring-1 ring-rose-200 text-xs sm:text-sm leading-relaxed text-slate-700 dark:bg-[#070d18] dark:ring-white/10 dark:text-slate-200 space-y-3">
                <p className="font-semibold text-slate-900 dark:text-white">
                  « إخوتي وأحبائي، بصفتي مؤسس ومطور هذه المنصة التي بنيتها بفضل الله سطراً بسطر؛ أطلب منكم جميعاً بصدق خالص الدعاء لي بالتوفيق والسلامة، حيث أؤدي حالياً واجبي الوطني في <strong className="text-rose-600 dark:text-rose-400">الجيش (وزارة الداخلية - قوات الأمن)</strong>.
                </p>

                {/* 3 Status Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 text-center">
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">نظام خدمتي</div>
                    <div className="mt-1 text-xs font-black text-slate-900 dark:text-white">
                      20 يوم خدمة / 10 أيام إجازة
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">مكان خدمتي</div>
                    <div className="mt-1 text-xs font-black text-slate-900 dark:text-white">
                      مدينة المنصورة
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">موعد انتهاء خدمتي</div>
                    <div className="mt-1 text-xs font-black text-rose-600 dark:text-rose-400">
                      25 فبراير 2027 (25/2/2027)
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300">
                  ورغم فترات الخدمة والمسؤولية، أحرص دائماً في فترات إجازاتي على فتح الحاسوب ومتابعة المنصة، مراجعة الأكواد، وتطوير كل جزئية لخدمة المطورين والتقنيين العرب. دعواتكم الصادقة لي هي أكبر سند ودافع! »
                </p>
              </div>
            </div>

            {/* Part 4: Engineer Profile & Technical CV (English CV) */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0b1322] text-left" dir="ltr">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
                    FOUNDER & FULL STACK SOFTWARE ENGINEER
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    MINA ROBIR MAGDY FAWZY
                  </h3>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                    <span>Cairo, Egypt</span>
                    <span>•</span>
                    <span>Phone: +201115294735</span>
                  </div>
                </div>

                {/* Direct Contact Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-sm"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={emailUrl}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition dark:bg-white/10 dark:border-white/10 dark:text-white dark:hover:bg-white/20"
                  >
                    <Mail size={13} />
                    <span>menarobir246rm@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/minarob23"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition dark:bg-slate-800"
                  >
                    <Github size={13} />
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://linkedin.com/in/minarob23"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    <Linkedin size={13} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Summary */}
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <strong>Professional Summary:</strong> Full Stack Software Engineer with 3+ years of experience, including a systems engineering internship and contract delivery of production web applications across the full Software Development Life Cycle (SDLC) for Health Tech SaaS, B2B e-commerce, and POS clients. Builds responsive frontends with React and Next.js (App Router) and backend services and APIs with Node.js (Express.js) and Python (FastAPI), with additional experience in Java (Spring Boot) and C++ through academic and systems projects. Designs PostgreSQL multi-tenant schemas with Row-Level Security and deploys on AWS. Integrates AI-assisted workflows (Claude Code) into daily development to speed up scaffolding and testing.
              </p>

              {/* Skills Grid */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5">
                  <div className="font-bold text-teal-600 dark:text-teal-400">AI & LLM Engineering</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    LLM Function Calling, RAG, Multimodal LLM APIs, Prompt Engineering.
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5">
                  <div className="font-bold text-cyan-600 dark:text-cyan-400">Frontend Development</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    React, Next.js, TypeScript, Tailwind CSS, Vite, Electron.js, Three.js, HTML5/CSS3.
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">Backend & Distributed</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Node.js, Express.js, Python, FastAPI, Java Spring Boot, REST APIs, WebSockets, Redis, JWT.
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">Databases & Cloud</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    PostgreSQL (Supabase, Neon), RLS, SQLite, AWS (S3, Lambda, EC2), Docker, CI/CD, Git.
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
                <div className="font-black text-slate-800 dark:text-slate-200 mb-1">
                  Experience: Full Stack Engineer Consultant (Jul 2025–Present) • Mathematics Tutor (2021–2025) • ALX Africa Systems Intern (2023–2024).
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Delivered 5 production full-stack platforms (Health Tech SaaS, B2B textile marketplace, custom apparel e-commerce, and Puno POS desktop cashier system with Electron).
                </div>
              </div>
            </div>

            {/* Official Closing & Signature */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                مع أطيب تمنياتي لكم بالتوفيق والنجاح الدائم،
              </div>
              <div className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                أخوكم المهندس / مينا روبير مجدى فوزى
              </div>
              <div className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                مؤسس ومطور منصة فوتيك للحلول البرمجية والهندسية • FuTech
              </div>
            </div>
          </div>

          {/* ================= LETTER FOOTER (Strict Action: Read & Acknowledge - NO SKIP) ================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/90 bg-white px-6 py-4 dark:border-white/10 dark:bg-[#0f1a2d] shrink-0">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center sm:text-right">
              للتواصل المباشر مع المهندس مينا روبير:
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

              {/* Sole Action to Enter the Platform after reading */}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2.5 text-xs font-black text-white hover:brightness-110 transition shadow-md shadow-teal-600/20 active:scale-98"
              >
                <Check size={16} />
                <span>قرأت الرسالة كاملة • الدخول إلى منصة فوتيك</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
