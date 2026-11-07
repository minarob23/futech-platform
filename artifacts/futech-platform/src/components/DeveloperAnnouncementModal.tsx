import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ShieldCheck, Heart, MessageSquare, Mail, Github,
  Linkedin, Phone, ExternalLink, CheckCircle2, AlertTriangle,
  CreditCard, Rocket, Code2, Cpu, Database, Cloud, Terminal,
  Calendar, MapPin, Briefcase, Award, X, Copy, Check, ChevronRight
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

  const whatsappUrl = 'https://wa.me/201115294735?text=' + encodeURIComponent('مرحباً يا باشمهندس مينا، تواصلت معك من خلال منصة فوتيك FuTech...');
  const emailUrl = 'mailto:menarobir246rm@gmail.com?subject=' + encodeURIComponent('تواصل بخصوص منصة فوتيك FuTech ومشاريع البرمجة');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white text-slate-800 shadow-2xl ring-1 ring-slate-200 overflow-hidden dark:bg-[#0b1322] dark:text-slate-100 dark:ring-white/10"
          dir="rtl"
        >
          {/* Top Decorative Header Accent */}
          <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500" />

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-8 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-500/20 dark:bg-teal-950/50 dark:text-teal-400">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    الموقع متاح للعمل الفعلي • تحت التجربة
                  </span>
                  <span className="hidden sm:inline-flex rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-black text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300">
                    FuTech Platform v2.6
                  </span>
                </div>
                <h2 className="mt-1 text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  إعلان تشغيل المنصة ورسالة المطور مينا روبير مجدى
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition dark:hover:bg-white/5 dark:hover:text-white"
              title="إغلاق"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/70 px-5 sm:px-8 dark:border-white/5 dark:bg-[#080e1a]/60">
            <button
              onClick={() => setActiveTab('announcement')}
              className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-black transition ${
                activeTab === 'announcement'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Rocket size={15} />
              <span>إعلان المنصة والتحديثات</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-black transition ${
                activeTab === 'profile'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Heart size={15} className="text-rose-500" />
              <span>رسالة المطور والخدمة العسكرية</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-black transition ${
                activeTab === 'experience'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Code2 size={15} />
              <span>English CV & Technical Skills</span>
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            {/* ================= TAB 1: ANNOUNCEMENT & UPDATES ================= */}
            {activeTab === 'announcement' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Highlight Card: Freedom of use */}
                <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-50/70 via-cyan-50/40 to-white p-5 sm:p-6 shadow-sm dark:from-teal-950/30 dark:via-cyan-950/10 dark:to-transparent dark:border-teal-500/20">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/30">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        الموقع متاح للعمل الفعلي ويمكنك استخدامه بحرية تامة!
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        يسعدنا إعلام كافة المطورين والمهندسين وأصحاب الأعمال والشركات بأن منصة{' '}
                        <strong className="text-teal-600 dark:text-teal-400 font-black">فوتيك (FuTech Platform)</strong>{' '}
                        أصبحت <strong>متاحة ومفتوحة للاستخدام المباشر</strong>. المنصة تعمل بكامل طاقتها البرمجية ولكنها
                        حالياً في <strong>مرحلة التجربة العملية النشطة (Live Beta Testing)</strong> لتلقي المقترحات وتطوير
                        الأداء بأعلى جودة ممكنة.
                      </p>
                    </div>
                  </div>

                  {/* Bullet points for developers and clients */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4 border-t border-teal-200/50 dark:border-teal-800/30">
                    <div className="rounded-xl bg-white/90 p-3.5 ring-1 ring-slate-200/70 dark:bg-[#070d18] dark:ring-white/10">
                      <div className="flex items-center gap-2 text-xs font-black text-teal-700 dark:text-teal-400">
                        <Code2 size={16} />
                        <span>للمهندسين والمطورين:</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                        يمكنك إنشاء ملفك الشخصي، رفع مشاريعك ومعرض أعمالك، استعراض مؤشر الجودة FQS، والتقديم على المشاريع وسحب الأرباح الافتراضية بكل حرية. تم إضافة تصنيف منصات CMS (WordPress, Shopify, Wix) بالكامل.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/90 p-3.5 ring-1 ring-slate-200/70 dark:bg-[#070d18] dark:ring-white/10">
                      <div className="flex items-center gap-2 text-xs font-black text-cyan-700 dark:text-cyan-400">
                        <Briefcase size={16} />
                        <span>لأصحاب المشاريع والشركات:</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                        يمكنك نشر مشاريعك البرمجية، تحديد الميزانية، تصفح المطورين واختيار الأنسب، واستخدام المحادثات المباشرة المشفرة لمتابعة مراحل التسليم تحت نظام الضمان المالي.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section: Payments and Ongoing updates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Payments Card */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]/70">
                    <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-sm">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                        <CreditCard size={18} />
                      </div>
                      <span>تكامل وسائل الدفع والضمان المالي</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      نعمل حالياً على إتمام الربط الرسمي مع بوابات الدفع الإلكترونية:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-mono font-bold">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-300">Vodafone Cash</span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-300">InstaPay</span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-300">Visa / Mastercard</span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-300">Crypto USDT Escrow</span>
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-white/10 dark:text-slate-300">Fawry Pay</span>
                    </div>
                    <p className="mt-2.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ✓ محفظة الضمان (Smart Escrow Simulation) مفعلة وجاهزة لتأمين مستحقات الطرفين.
                    </p>
                  </div>

                  {/* Ongoing Updates Card */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]/70">
                    <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-black text-sm">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                        <Cpu size={18} />
                      </div>
                      <span>التحديثات التقنية الجارية</span>
                    </div>
                    <ul className="mt-2.5 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0" />
                        <span>تقسيم الشيفرات (Code Splitting) لرفع سرعة التحميل 90%.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0" />
                        <span>مؤثرات بصرية وهندسية ثلاثية الأبعاد (3D Spatial Objects).</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0" />
                        <span>إضافة مجالات CMS والمتاجر الإلكترونية في كافة مراحل المنصة.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-teal-500 shrink-0" />
                        <span>تحصين منظومة التشفير وعدم الإفصاح (NDA & Zero Leak).</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Direct Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-slate-900 p-4 text-white">
                  <div>
                    <div className="text-xs font-black text-teal-400">هل لديك استفسار أو مقترح للمنصة؟</div>
                    <div className="text-[11px] text-slate-300">تواصل مباشرة مع المهندس مينا روبير عبر واتساب أو البريد.</div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-600 transition"
                    >
                      <MessageSquare size={14} />
                      <span>واتساب مباشر</span>
                    </a>
                    <a
                      href={emailUrl}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-black text-white hover:bg-white/20 transition"
                    >
                      <Mail size={14} />
                      <span>إيميل</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 2: DEVELOPER & MILITARY SERVICE ================= */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Heartfelt Military Service Card */}
                <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-white p-6 shadow-sm dark:from-rose-950/20 dark:via-amber-950/10 dark:to-transparent dark:border-rose-900/30">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/30">
                      <Heart size={24} className="fill-white" />
                    </div>
                    <div>
                      <span className="inline-block rounded-full bg-rose-100 text-rose-800 border border-rose-300 px-3 py-0.5 text-[10px] font-black dark:bg-rose-900/60 dark:text-rose-200 dark:border-rose-700">
                        دعوة من القلب • الواجب الوطني 🇪🇬
                      </span>
                      <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                        رسالة المطور والمهندس: مينا روبير مجدى فوزى
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/90 p-4 sm:p-5 ring-1 ring-rose-200/70 text-slate-700 leading-relaxed text-xs sm:text-sm dark:bg-[#070d18] dark:ring-white/10 dark:text-slate-200">
                    <p className="font-semibold">
                      « أخواتي وزملائي المطورين وأصحاب الأعمال الكرام، أنا أخوكم المهندس{' '}
                      <strong className="text-rose-600 dark:text-rose-400 font-black">
                        مينا روبير مجدى فوزى
                      </strong>
                      ، مؤسس ومطور هذه المنصة. أطلب منكم جميعاً بصدق{' '}
                      <span className="underline decoration-rose-400 font-black">الدعاء لي بالتوفيق والسلامة</span>{' '}
                      حيث أؤدي واجبي الوطني حالياً في <strong>الجيش (وزارة الداخلية)</strong>.
                    </p>

                    <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                      <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                        <div className="text-[10px] font-bold text-slate-400">نظام الخدمة</div>
                        <div className="mt-0.5 text-xs font-black text-slate-800 dark:text-white">
                          20 يوم خدمة / 10 أيام إجازة
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                        <div className="text-[10px] font-bold text-slate-400">مكان الخدمة</div>
                        <div className="mt-0.5 text-xs font-black text-slate-800 dark:text-white">
                          مدينة المنصورة
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                        <div className="text-[10px] font-bold text-slate-400">تاريخ انتهاء الخدمة</div>
                        <div className="mt-0.5 text-xs font-black text-rose-600 dark:text-rose-400">
                          25 فبراير 2027 (25/2/2027)
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ورغم مسؤوليات الخدمة، أحرص دائماً في فترات إجازتي على متابعة المنصة والرد على أي استفسارات وتطوير النظام ودعم المطورين. دعواتكم هي أكبر سند لي! »
                    </p>
                  </div>
                </div>

                {/* Developer Direct Contact Hub */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]/70">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
                    قنوات التواصل المباشرة مع المهندس مينا روبير
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 transition hover:bg-emerald-100/80 hover:border-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm">
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                            واتساب مباشر (انقر للمراسلة)
                          </div>
                          <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400" dir="ltr">
                            +20 111 529 4735
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-emerald-600 transition group-hover:translate-x-[-2px]" />
                    </a>

                    {/* Email */}
                    <a
                      href={emailUrl}
                      className="group flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/60 p-3.5 transition hover:bg-teal-100/80 hover:border-teal-400 dark:bg-teal-950/20 dark:border-teal-900/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-600 text-white shadow-sm">
                          <Mail size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-teal-900 dark:text-teal-300">
                            البريد الإلكتروني الرسمي
                          </div>
                          <div className="text-[11px] font-mono text-teal-700 dark:text-teal-400" dir="ltr">
                            menarobir246rm@gmail.com
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-teal-600 transition group-hover:translate-x-[-2px]" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/in/minarob23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 transition hover:bg-blue-100/80 hover:border-blue-400 dark:bg-blue-950/20 dark:border-blue-900/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
                          <Linkedin size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-blue-900 dark:text-blue-300">
                            LinkedIn Profile
                          </div>
                          <div className="text-[11px] font-mono text-blue-700 dark:text-blue-400" dir="ltr">
                            linkedin.com/in/minarob23
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-blue-600 transition group-hover:translate-x-[-2px]" />
                    </a>

                    {/* GitHub */}
                    <a
                      href="https://github.com/minarob23"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 transition hover:bg-slate-100 hover:border-slate-400 dark:bg-white/5 dark:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white shadow-sm dark:bg-slate-800">
                          <Github size={18} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">
                            GitHub Code Repository
                          </div>
                          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400" dir="ltr">
                            github.com/minarob23
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-slate-500 transition group-hover:translate-x-[-2px]" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 3: ENGLISH CV & TECH SKILLS ================= */}
            {activeTab === 'experience' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-left"
                dir="ltr"
              >
                {/* Header Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-teal-400/20 border border-teal-400/40 px-3 py-0.5 text-[10px] font-mono font-bold text-teal-300">
                        FULL STACK SOFTWARE ENGINEER
                      </span>
                      <h3 className="mt-2 text-2xl font-black tracking-tight text-white">
                        MINA ROBIR MAGDY FAWZY
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs font-mono text-slate-300">
                        <MapPin size={13} className="text-teal-400" />
                        <span>Location: Cairo, Egypt</span>
                        <span>•</span>
                        <Phone size={13} className="text-teal-400" />
                        <span>+201115294735</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition"
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={emailUrl}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition"
                      >
                        <Mail size={13} />
                        <span>Email</span>
                      </a>
                      <a
                        href="https://github.com/minarob23"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition"
                      >
                        <Github size={13} />
                        <span>GitHub</span>
                      </a>
                      <a
                        href="https://linkedin.com/in/minarob23"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                      >
                        <Linkedin size={13} />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                    <strong>Professional Summary:</strong> Full Stack Software Engineer with 3+ years of experience, including a systems engineering internship and contract delivery of production web applications across the full Software Development Life Cycle (SDLC) for Health Tech SaaS, B2B e-commerce, and POS clients. Builds responsive frontends with React and Next.js (App Router) and backend services and APIs with Node.js (Express.js) and Python (FastAPI), with additional experience in Java (Spring Boot) and C++ through academic and systems projects. Designs PostgreSQL multi-tenant schemas with Row-Level Security and deploys on AWS. Integrates AI-assisted workflows (Claude Code) into daily development to speed up scaffolding and testing.
                  </div>
                </div>

                {/* Technical Skills Matrix */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]/70">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Terminal size={14} className="text-teal-500" />
                    <span>Technical Skills Matrix</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
                      <div className="font-bold text-teal-600 dark:text-teal-400">AI & LLM Engineering</div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        LLM Function Calling, Retrieval-Augmented Generation (RAG), Multimodal LLM APIs, Prompt Engineering.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
                      <div className="font-bold text-cyan-600 dark:text-cyan-400">Frontend Development</div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        React, Next.js (App Router), TypeScript, JavaScript (ES6+), Tailwind CSS, Vite, Electron.js, Three.js, Responsive Web Design, HTML5, CSS3.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">Backend & Distributed Systems</div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        Node.js, Express.js, Python, FastAPI, Java, Spring Boot, C# (coursework), RESTful APIs, API Design & Integration, WebSockets, Redis, BullMQ, OAuth 2.0, JWT, RBAC, Rate Limiting.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">Databases & Data Engineering</div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        PostgreSQL (Supabase, Neon), SQLite (better-sqlite3), Row-Level Security (RLS), Supabase Auth, Drizzle ORM, Prisma ORM, Database Schema Design, Query Index Optimization, ACID Transactions.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
                      <div className="font-bold text-purple-600 dark:text-purple-400">Cloud, DevOps & Architecture</div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        AWS (S3, Lambda, API Gateway, EC2), Docker, Docker Compose, CI/CD, GitHub Actions, Git, Code Review, Agile/Scrum, Jest, PyTest, JUnit, Unit & Integration Testing.
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-white/5">
                      <div className="font-bold text-amber-600 dark:text-amber-400">Machine Learning & Systems Engineering</div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        Scikit-Learn, XGBoost, LightGBM, Predictive Modeling, C, C++, POSIX Systems Programming, Memory Management, OOP, Data Structures & Algorithms, System Design.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Work Experience */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]/70">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <Briefcase size={14} className="text-teal-500" />
                    <span>Work Experience Highlights</span>
                  </h4>

                  <div className="space-y-4 text-xs">
                    {/* Role 1 */}
                    <div className="border-l-2 border-teal-500 pl-4 py-1">
                      <div className="flex items-center justify-between flex-wrap">
                        <span className="font-black text-slate-900 dark:text-white">
                          Full Stack Software Engineer (Contract) / Consultant
                        </span>
                        <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400">
                          Jul 2025 – Present
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">B2B SaaS & Commercial Solutions • Independent</div>
                      <ul className="mt-2 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 list-disc list-inside">
                        <li>Delivered 5 production full-stack platforms for clients in Health Tech SaaS (Algostep), B2B textile marketplace (Nile Tex), custom apparel e-commerce (ECS), and commercial POS for restaurant and laundry businesses, owning database design, API development, and deployment on AWS.</li>
                        <li>Built Puno POS, an offline-capable desktop cashier system (Electron, React, Vite, Tailwind CSS) packaged as a portable executable for restaurant operations.</li>
                        <li>Implemented offline-first local persistence using Electron's LocalStorage with serialized JSON behind a custom store layer.</li>
                        <li>Secured Electron IPC communication in Puno POS using contextBridge with contextIsolation enabled.</li>
                        <li>Implemented non-blocking thermal receipt printing pipeline via hidden background BrowserWindow instances.</li>
                        <li>Architected multi-tenant PostgreSQL schemas scoped by tenant-level UUIDs and cascading constraints.</li>
                        <li>Accelerated feature delivery cycles by ~50% leveraging AI-assisted engineering workflows (Claude Code).</li>
                      </ul>
                    </div>

                    {/* Role 2 */}
                    <div className="border-l-2 border-indigo-500 pl-4 py-1">
                      <div className="flex items-center justify-between flex-wrap">
                        <span className="font-black text-slate-900 dark:text-white">
                          Mathematics Assistant & Tutor
                        </span>
                        <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                          Sep 2021 – Jun 2025
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">Educational Center</div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                        Tutored 120+ students in applied and discrete mathematics, and supported coursework in programming (Java, Python, C++) and data structures. Developed automated assessment reconciliation scripts, saving 180+ administrative hours annually.
                      </p>
                    </div>

                    {/* Role 3 */}
                    <div className="border-l-2 border-cyan-500 pl-4 py-1">
                      <div className="flex items-center justify-between flex-wrap">
                        <span className="font-black text-slate-900 dark:text-white">
                          Software Systems Engineering Intern
                        </span>
                        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                          Nov 2023 – Dec 2024
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">ALX Africa</div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                        Developed 15+ low-level UNIX systems tools in C, C++, and Python, optimizing POSIX system calls, memory buffers, and multithreaded synchronization. Engineered custom dynamic memory allocation algorithms validated via strict Valgrind memory profiling, eliminating memory leaks across 50+ test suites.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-8 dark:border-white/5 dark:bg-[#080e1a]">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-center sm:text-right">
              <span>تم تصميم وبرمجة المنصة بالكامل بواسطة المهندس مينا روبير مجدى فوزى © 2026</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-white hover:bg-emerald-600 transition shadow-sm"
              >
                <MessageSquare size={14} />
                <span>واتساب المهندس مينا</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 transition dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
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
