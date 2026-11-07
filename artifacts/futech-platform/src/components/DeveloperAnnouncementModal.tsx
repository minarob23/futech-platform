import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Heart, MessageSquare, Mail, Github,
  Linkedin, Phone, ExternalLink, CheckCircle2,
  CreditCard, Rocket, Code2, Cpu, Database, Cloud, Terminal,
  Calendar, MapPin, Briefcase, Award, Check, CheckCheck,
  Flame, ScrollText, Flag, Shield, Laptop
} from 'lucide-react';

interface DeveloperAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperAnnouncementModal({ isOpen, onClose }: DeveloperAnnouncementModalProps) {
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
        {/* Solid Dark Backdrop (No skip on click) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window: Styled as an Authentic Warm Egyptian Letter */}
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

          {/* ================= LETTERHEAD (الهيدر في المنتصف تماماً) ================= */}
          <div className="relative text-center px-6 pt-7 pb-5 border-b border-slate-200/80 bg-white/90 dark:bg-[#0f1a2d]/90 dark:border-white/10 shrink-0">
            {/* Centered Seal */}
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#122840] via-[#1c3d60] to-teal-700 text-teal-300 shadow-xl shadow-teal-900/20 ring-4 ring-teal-500/15">
              <ScrollText size={30} className="text-teal-300" />
            </div>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-300 shadow-2xs">
                📜 رسالة وبيان مفتوح من القلب • اقرأ براحتك
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300 shadow-2xs">
                🟢 الموقع متاح وشغال فعلياً • تحت التجربة الحية
              </span>
            </div>

            {/* Centered Grand Title in Egyptian Spirit */}
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-black text-slate-900 tracking-tight dark:text-white">
              رسالة من أخوكم المهندس{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-600 via-cyan-600 to-indigo-600 dark:from-teal-400 dark:via-cyan-300 dark:to-indigo-300">
                مينا روبير مجدى فوزى
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
              صاحب ومطور منصة فوتيك (FuTech Platform) من الألف للياء • القاهرة / المنصورة 🇪🇬
            </p>
          </div>

          {/* ================= LETTER CONTENT (Continuous Flowing in Egyptian Arabic) ================= */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-7 leading-relaxed font-sans text-slate-700 dark:text-slate-200">
            {/* Egyptian Warm Greeting */}
            <div className="border-r-4 border-teal-500 pr-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                يا مساء الفل والجمال على كل أخواتي المطورين والمبرمجين وأصحاب البيزنس والشركات في مصر والوطن العربي كله! ❤️
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                أنا أخوكم المهندس مينا روبير، حابب أشارككم الرسالة دي من قلبي عشان أحطكم في الصورة عن كل حاجة في المنصة وعن ظروفي في الجيش ودعواتكم ليا.
              </p>
            </div>

            {/* Part 1: Platform is fully open & live in Egyptian Arabic */}
            <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-50/70 via-cyan-50/40 to-white p-6 shadow-xs dark:from-teal-950/30 dark:via-cyan-950/15 dark:to-transparent dark:border-teal-500/20">
              <div className="flex items-center gap-2.5 text-teal-800 dark:text-teal-400 font-black text-sm sm:text-base mb-2">
                <Rocket size={20} className="text-teal-600 dark:text-teal-400" />
                <span>أولاً: الموقع شغال وتقدروا تستخدموه بحرية تامة ومن غير أي قيود!</span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                حابب أطمنكم إن موقع <strong className="text-teal-600 dark:text-teal-400 font-black">فوتيك (FuTech)</strong> شغال وجاهز فعلياً للشغل بين المطورين والعملاء. المنصة مبنية بكل محركاتها البرمجية، بس إحنا حالياً في فترة <strong className="text-amber-700 dark:text-amber-400">التجربة الحية (Live Beta)</strong> عشان نجرب وناخد آراءكم ونطور أول بأول.
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-teal-200/60 dark:border-teal-800/40">
                <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 dark:bg-[#070d18] dark:ring-white/10">
                  <div className="font-black text-xs sm:text-sm text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                    <Code2 size={16} />
                    <span>لأخواتي المطورين والمبرمجين:</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    ادخلوا سجلوا حساباتكم واعملوا البورتفوليو بتاعكم وضيفوا مشاريعكم، وقدموا على عروض الشغل براحتكم.. وخدوا فلوسكم كاملة 100% بدون أي وسيط ولا مليم عمولة (0% Commission). وضفنا مخصوص قسم كامل لمطوري الـ WordPress و Shopify و Wix عشان نغطي كل المجالات المطلوبة.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-slate-200/80 dark:bg-[#070d18] dark:ring-white/10">
                  <div className="font-black text-xs sm:text-sm text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5">
                    <Briefcase size={16} />
                    <span>لأصحاب البيزنس والشركات والعملاء:</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    تقدروا تنشروا مشاريعكم وتحددوا الميزانية اللي تناسبكم، وتتفرجوا على شغل أشطر مهندسين في مصر والوطن العربي، وتتكلموا معاهم شات مشفر ومباشر، وتضمنوا حقكم بنظام الضمان المالي اللي بيحجز فلوس الشغل ومابيدفعهاش إلا لما تستلموا الكود سليم.
                  </p>
                </div>
              </div>
            </div>

            {/* Part 2: Payment Gateways in Egyptian Arabic */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0b1322]">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-sm sm:text-base mb-2">
                <CreditCard size={20} className="text-amber-500" />
                <span>ثانياً: بالنسبة لطرق الدفع والتحديثات اللي شغالة في الموقع</span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                شغالين نخلص الربط الرسمي والأوراق القانونية مع بوابات الدفع الإلكتروني عشان تدفعوا وتسحبوا أرباحكم بأسهل الطرق المتاحة في مصر وبرا مصر:
              </p>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs font-mono font-bold">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  فودافون كاش (Vodafone Cash)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  إنستاباي (InstaPay اللحظي)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  فيزا وماستركارد (Visa/Mastercard)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  الضمان المشفر (USDT Escrow)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  فوري باي (Fawry Pay)
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5 text-slate-800 dark:text-slate-200">
                  تحويل بنكي مباشر (Bank Wire)
                </div>
              </div>

              <p className="mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>محفظة الضمان المشفرة (Escrow Vault) شغالة جوه السيستم وبتحفظ مستحقات كل مرحلة لحد ما المشروع يتسلم تمام.</span>
              </p>
            </div>

            {/* Part 3: Heartfelt Military Service in Egyptian Arabic */}
            <div className="rounded-3xl border border-rose-200 bg-gradient-to-b from-rose-50/80 via-amber-50/40 to-white p-6 sm:p-8 shadow-sm dark:from-rose-950/30 dark:via-amber-950/15 dark:to-transparent dark:border-rose-900/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md">
                  <Heart size={24} className="fill-white" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    ثالثاً: دعوة من القلب • الواجب الوطني في الجيش 🇪🇬
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    أخوكم مينا في الجيش وعاوزكم تدعولي من قلبكم!
                  </h3>
                </div>
              </div>

              <div className="rounded-2xl bg-white/95 p-5 ring-1 ring-rose-200 text-xs sm:text-sm leading-relaxed text-slate-700 dark:bg-[#070d18] dark:ring-white/10 dark:text-slate-200 space-y-3">
                <p className="font-semibold text-slate-900 dark:text-white">
                  « يا جماعة، أنا أخوكم المهندس <strong className="text-rose-600 dark:text-rose-400">مينا روبير مجدى فوزى</strong>، بنيت المنصة دي بكود نضيف من الصفر عشان تكون حاضنة حقيقية للمطورين العرب.
                </p>

                <p className="text-rose-600 dark:text-rose-400 font-black text-sm sm:text-base">
                  عاوز أطلب منكم بجد وأمانة تدعولي من قلبكم بالتوفيق والسلامة والتيسير؛ لأني بقضي حالياً خدمتي العسكرية في الجيش (جيش الداخلية - قوات أمن).
                </p>

                {/* 3 Status Badges in Egyptian Arabic */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3 text-center">
                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">نظام خدمتي</div>
                    <div className="mt-1 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      20 يوم خدمة / 10 أيام إجازة
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">مكان خدمتي بالجيش</div>
                    <div className="mt-1 text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      مدينة المنصورة
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                    <div className="text-[10px] text-slate-400 font-bold">ميعاد خروجي وإنهاء خدمتي</div>
                    <div className="mt-1 text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400">
                      25 فبراير 2027 (25/2/2027) بمشيئة الله
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300">
                  ورغم تعب الخدمة والمسؤولية، في كل يوم بنزله إجازة في بيتنا في القاهرة، بفتح اللابتوب بتاعي وأقعد أراجع السيرفرات والأكواد وأطور المنصة وأحل أي مشكلة تواجه أي حد فيكم. دعواتكم الصادقة هي أغلى حاجة عندي وسندي الحقيقي! »
                </p>
              </div>
            </div>

            {/* Part 4: Engineer Profile & CV Translated into Egyptian Arabic */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0b1322]">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3 dark:border-white/10">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800">
                    مؤسس المنصة ومهندس برمجيات FULL STACK
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                    المهندس / مينا روبير مجدى فوزى (MINA ROBIR MAGDY FAWZY)
                  </h3>
                  <div className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-0.5">
                    <span>القاهرة، مصر</span>
                    <span>•</span>
                    <span dir="ltr">تليفون: +201115294735</span>
                  </div>
                </div>

                {/* Direct Contact Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-sm"
                  >
                    <MessageSquare size={13} />
                    <span>كلّم مينا واتساب</span>
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

              {/* Professional Summary in Egyptian Arabic */}
              <div className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <strong className="text-teal-700 dark:text-teal-400">الملخص المهني والخبرة العملية:</strong>
                <p className="mt-1">
                  مهندس برمجيات Full Stack بقالي أكتر من 3 سنين شغال في المجال الفعلي؛ بدأت بتدريب مكثف في هندسة الأنظمة وسلمت مشاريع ويب حية وكبيرة شغالة لشركات وعملاء في مجالات تكنولوجيا الرعاية الصحية (Health Tech SaaS)، والتجارة الإلكترونية للشركات (B2B E-commerce)، وأنظمة نقاط البيع والكاشير التجاري (POS).
                </p>
                <p className="mt-1">
                  ببني واجهات أمامية سريعة وخفيفة جداً ومتوافقة مع كل الشاشات بـ React و Next.js (App Router)، وببني خدمات الباك إند والـ APIs بقوة وسرعة بـ Node.js (Express.js) و Python (FastAPI)، بالإضافة لخبرتي القوية في الـ Java (Spring Boot) والـ C++ من مشاريعي الأكاديمية وهندسة النظم. بصمم قواعد بيانات PostgreSQL سحابية متعددة المستأجرين مع عزل وأمان كامل على مستوى الصف (RLS) وبرفعها على سيرفرات أمازون AWS. وبدمج أدوات الذكاء الاصطناعي (زي Claude Code) في يومي البرمجي عشان أسرع بناء الأكواد والتستات بنسبة 50%.
                </p>
              </div>

              {/* Skills Grid in Egyptian Arabic */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-white/5 ring-1 ring-slate-200/70 dark:ring-white/10">
                  <div className="font-bold text-teal-700 dark:text-teal-400 text-xs sm:text-sm">
                    🤖 هندسة الذكاء الاصطناعي (AI & LLM Engineering)
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-[11px]">
                    ربط دوال الذكاء الاصطناعي (LLM Function Calling)، أنظمة البحث التوليدي المعتمد (RAG)، استخدام APIs لنماذج الذكاء الاصطناعي متعددة الوسائط، وهندسة الأوامر (Prompt Engineering).
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-white/5 ring-1 ring-slate-200/70 dark:ring-white/10">
                  <div className="font-bold text-cyan-700 dark:text-cyan-400 text-xs sm:text-sm">
                    💻 تطوير الواجهات الأمامية (Frontend Development)
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-[11px]">
                    React، Next.js (App Router)، TypeScript، JavaScript حديثة، Tailwind CSS، Vite، برامج ديسكتوب بـ Electron.js، ومؤثرات 3D تفاعلية بـ Three.js، وتصميم متجاوب 100% مع كل الموبايلات والشاشات بـ HTML5/CSS3.
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-white/5 ring-1 ring-slate-200/70 dark:ring-white/10">
                  <div className="font-bold text-indigo-700 dark:text-indigo-400 text-xs sm:text-sm">
                    ⚙️ الباك إند والأنظمة الموزعة (Backend & Distributed)
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-[11px]">
                    Node.js، Express.js، Python، FastAPI، Java، Spring Boot، C#، وتصميم وتكامل RESTful APIs، تواصل لحظي بـ WebSockets، طوابير وسيرفرات كاش بـ Redis و BullMQ، وتأمين بالـ OAuth 2.0 و JWT والصلاحيات (RBAC)، والتحكم في سرعة الطلبات (Rate Limiting).
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-white/5 ring-1 ring-slate-200/70 dark:ring-white/10">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">
                    🗄️ قواعد البيانات والسحابة (Databases & Cloud)
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed text-[11px]">
                    PostgreSQL (على Supabase و Neon)، و SQLite، وأمان الجداول (RLS)، و Supabase Auth، وأدوات Drizzle و Prisma، وتصميم الجداول وتحسين الفهارس، وسيرفرات أمازون AWS (S3, Lambda, EC2)، وبيئات Docker، وخطوط CI/CD، وإدارة الكود بـ Git.
                  </div>
                </div>
              </div>

              {/* Work Experience in Egyptian Arabic */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/10 text-xs sm:text-sm">
                <div className="font-black text-slate-800 dark:text-slate-200 mb-1.5 text-xs sm:text-sm">
                  📌 سابقة الأعمال والخبرات العملية:
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                  <li>
                    <strong>مهندس برمجيات حر واستشاري مستقل (يوليو 2025 – حتى الآن):</strong> طوّرت وسلمت 5 منصات حية لكلاينتس في مجالات الصحة الرقمية (Algostep)، وسوق تجارة النسيج (Nile Tex)، ومنصة تجارة الملابس (ECS)، ونقاط بيع المطاعم والمغاسل، ونشرتها بالكامل على سيرفرات AWS.
                  </li>
                  <li>
                    <strong>بناء نظام Puno POS:</strong> سيستم كاشير كامل للديسكتوب يشتغل بدون إنترنت (Electron, React, Vite) سلمته لمطعم كبير لإدارة الطاولات والدليفري، بنظام حفظ محلي سريع وأمان تام للعمليات بدون تعليق لشاشة الكاشير أثناء طباعة الفواتير الحرارية.
                  </li>
                  <li>
                    <strong>مساعد ومدرس رياضيات بمركز تعليمي (سبتمبر 2021 – يونيو 2025):</strong> درّست ودعمت أكتر من 120 طالب في الرياضيات والبرمجة (Java, Python, C++)، وطوّرت سكربتات أوتوماتيكية وفرت أكتر من 180 ساعة شغل سنوي.
                  </li>
                  <li>
                    <strong>متدرب هندسة نظم في ALX Africa (نوفمبر 2023 – ديسمبر 2024):</strong> طوّرت أكتر من 15 أداة لنظم UNIX بـ C و C++ و Python وعالجت تسريبات الذاكرة بـ Valgrind واشتغلت في 24 سبرنت لنشر الخدمات بـ Docker.
                  </li>
                </ul>
              </div>
            </div>

            {/* Official Closing & Signature in Egyptian Spirit */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 text-center">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                مع أطيب تمنياتي ودعواتي ليكم كلكم بالنجاح والتوفيق دايماً،
              </div>
              <div className="mt-1 text-base font-black text-slate-900 dark:text-white">
                أخوكم الباشمهندس / مينا روبير مجدى فوزى
              </div>
              <div className="text-xs text-teal-600 dark:text-teal-400 font-bold mt-0.5">
                مؤسس ومطور منصة فوتيك للحلول الهندسية والبرمجية • FuTech © 2026
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
                <span>كلّم مينا واتساب على طول</span>
              </a>

              {/* Sole Action to Enter the Platform after reading */}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2.5 text-xs font-black text-white hover:brightness-110 transition shadow-md shadow-teal-600/20 active:scale-98"
              >
                <Check size={16} />
                <span>قرأت الرسالة يا باشمهندس مينا وربنا معاك • ادخل على فوتيك</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
