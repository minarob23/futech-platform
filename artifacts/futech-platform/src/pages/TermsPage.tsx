import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  ShieldCheck,
  Lock,
  GitBranch,
  Percent,
  Clock,
  Mail,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Building2,
  Cpu,
  Search,
  Sparkles,
  Share2,
  Check,
  Coins,
  FileCode2,
  ChevronLeft,
  LifeBuoy,
  MessageSquare,
  AlertCircle,
  Shield,
  Layers,
} from 'lucide-react';

interface TermsPageProps {
  go: (path: string) => void;
  notify?: (msg: string) => void;
}

export function TermsPage({ go, notify }: TermsPageProps) {
  const [activeSection, setActiveSection] = useState<string>('escrow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);

  const sections = [
    {
      id: 'definitions',
      title: '1. التعريفات ونطاق الحوكمة القانونية',
      icon: Building2,
      badge: 'الأطر النظامية',
      summary: 'تحديد المصطلحات الرسمية ونطاق التعاقد الهندسي عبر المنصة.',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-sm">
            تُعد منصة <strong>فوتيك (FuTech)</strong> حاضنة برمجية متطورة وسوقاً تقنياً متخصصاً يهدف إلى حوكمة وتوثيق التعاقدات البرمجية، وربط الكفاءات الهندسية العربية بالشركات وأصحاب المشاريع والشركات الناشئة وفق معايير الجودة الدولية.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mt-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold text-xs">01</span>
                <h5 className="font-black text-slate-900 dark:text-white text-sm">«صاحب المشروع / العميل»</h5>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                أي فرد، شركة، أو مؤسسة تجارية تطرح متطلبات برمجية وتخصص ميزانية للمشروع وفق مراحل إنجاز واضحة.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold text-xs">02</span>
                <h5 className="font-black text-slate-900 dark:text-white text-sm">«المهندس / المطور المعتمد»</h5>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                المبرمج أو المهندس التقني المؤهل الخاضع لمعايير مؤشر الجودة FQS والملتزم بالهندسة النظيفة وتسليم الكود عبر مستودعات Git.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs text-slate-600 dark:border-white/5 dark:bg-white/[0.01] dark:text-slate-400">
            تخضع كافة المعاملات عبر المنصة للأنظمة والقوانين المنظمة للتعاملات الإلكترونية والتجارة الرقمية وحماية الملكية الفكرية وسرية البيانات.
          </div>
        </div>
      ),
    },
    {
      id: 'escrow',
      title: '2. ميثاق الضمان المالي وحوكمة المراحل (100% Escrow & Milestones)',
      icon: ShieldCheck,
      badge: 'حوكمة وتسليم مرحلي',
      summary: 'مبدأ الأمان المزدوج: تقسيم ميزانية المشروع على دفعات مرحلية معتمدة.',
      content: (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/70 p-4.5 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-sm font-black text-emerald-800 dark:text-emerald-300">
              <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
              <span>مبدأ الأمان المزدوج: صفر مخاطرة للطرفين</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
              يتم تقسيم المشروع إلى مراحل برمجية واضحة (Milestones). لا يبدأ المطور مرحلة جديدة إلا بعد الاتفاق على متطلباتها وتأكيد تسليم مخرجات المرحلة السابقة ومطابقتها لمعايير الفحص الهندسي.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>تقسيم المراحل</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                يُمنع دفع الميزانية كاملة مقدماً للمشاريع الكبيرة؛ بل تُقسّم لمراحل محددة التسليمات ومواعيد الإنجاز لحماية رأس المال.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock size={15} className="text-cyan-500 shrink-0" />
                <span>مهلة فحص 7 أيام</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                يحق لصاحب المشروع مهلة 7 أيام كاملة لمعاينة مخرجات الكود، واختبار الواجهات، والتأكد من مطابقة المواصفات قبل الاعتماد.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-teal-500 shrink-0" />
                <span>قبولية الدفع المباشر</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                نظراً لأن بوابات الدفع الإلكتروني قيد البرمجة والربط، يتم سداد كل مرحلة بالتراضي والتحويل المباشر مع توثيق التسليم عبر المنصة.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'commission',
      title: '3. سياسة الـ 0% عمولة للمطورين (Zero Commission Policy)',
      icon: Percent,
      badge: '100% من أرباحك لك',
      summary: 'أتعاب المطور بالكامل دون أي استقطاعات أو عمولات وسيط.',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-sm">
            إيماناً من منصة فوتيك بدعم الكفاءات الهندسية البرمجية في العالم العربي، تعتمد المنصة نموذج <strong>العمولة الصفرية (0% Freelancer Fee)</strong> على مستحقات المطورين:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-teal-500/30 bg-teal-50/80 p-4 text-center dark:bg-teal-950/20">
              <div className="text-3xl font-black text-teal-700 dark:text-teal-300">0%</div>
              <div className="mt-1 text-xs font-black text-slate-900 dark:text-white">عمولة من المطور</div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">يحصل المهندس على 100% من المبلغ المتفق عليه دون أي خصم</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-3xl font-black text-amber-500">رسوم الطرف الثالث</div>
              <div className="mt-1 text-xs font-black text-slate-900 dark:text-white">بوابات الدفع البنكية</div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">تخضع لرسوم بوابات الدفع ومزودي التحويلات البنكية فقط</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">شفافية تامة</div>
              <div className="mt-1 text-xs font-black text-slate-900 dark:text-white">بدون مصاريف خفية</div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">كافة الاتفاقات المالية معلنة وموضحة بفواتير رقمية موثقة</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ip-ownership',
      title: '4. نقل ملكية الشيفرة البرمجية (IP & Code Ownership)',
      icon: GitBranch,
      badge: 'ملكية 100% للعميل',
      summary: 'انتقال فوري للملكية الفكرية وأصول ومستودعات Git للعميل فور السداد.',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-sm">
            يُعتبر تسليم وتوثيق الكود البرمجي ونقل ملكيته حجر الزاوية في ميثاق جودة فوتيك:
          </p>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-white/5 dark:bg-white/[0.01]">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" />
              <div>
                <strong className="text-slate-900 dark:text-white text-sm">انتقال الملكية الفورية:</strong>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  بمجرد سداد مستحقات مرحلة أو المشروع بالكامل، تنتقل الملكية الفكرية والحقوق التجارية لكافة الشيفرات البرمجية، التصاميم، وقواعد البيانات المبتكرة فوراً لصالح العميل دون أي مطالبات مستقبلية.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-white/5 dark:bg-white/[0.01]">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" />
              <div>
                <strong className="text-slate-900 dark:text-white text-sm">معايير التسليم التقنية عبر Git:</strong>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  يلتزم المطور بتسليم مستودع Git نظيف وموثق يحتوي على ملف <code>README.md</code> لشرح التشغيل، وملف <code>.env.example</code> لمتغيرات البيئة، وإرشادات النشر السحابي، مع تسليم صلاحيات المالك (Owner Access).
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 dark:border-white/5 dark:bg-white/[0.01]">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400" />
              <div>
                <strong className="text-slate-900 dark:text-white text-sm">المكتبات مفتوحة المصدر (Open Source):</strong>
                <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  يجب الإفصاح عن أي مكتبات مفتوحة المصدر مستخدمة والتأكد من توافق رخصها (مثل MIT، Apache 2.0، BSD) مع الاستخدام التجاري للعميل وعدم فرض قيود Copyleft غير مرغوبة.
                </p>
              </div>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'auto-nda',
      title: '5. اتفاقية سرية المعلومات التلقائية (Mutual Auto-NDA)',
      icon: Lock,
      badge: 'حماية قانونية فورية',
      summary: 'عقد سرية تلقائي سارٍ وفوري لحماية الأفكار والأسرار البرمجية وتفاصيل الأعمال.',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-sm">
            بمجرد بدء محادثة أو التعاقد على مشروع في منصة فوتيك، يسري تلقائياً عقد حماية سرية المعلومات (Non-Disclosure Agreement) بين الطرفين دون الحاجة لتوقيع ورقي منفصل:
          </p>
          <div className="rounded-2xl border border-blue-500/30 bg-blue-50/70 p-4.5 dark:bg-blue-950/20">
            <h5 className="font-black text-blue-900 dark:text-blue-300 text-sm flex items-center gap-2">
              <Lock size={16} />
              <span>الالتزام المشترك بالسرية المطلقة:</span>
            </h5>
            <p className="mt-2 text-xs leading-relaxed text-blue-950/90 dark:text-blue-100/90">
              يلتزم كل من العميل والمطور بالحفاظ على سرية الأفكار، الخطط التجارية، المخططات الهندسية، بيانات المستخدمين، والشيفرات البرمجية. يُحظر تماماً نشر أو تسريب أو إعادة بيع أي جزء من أصول المشروع لأي طرف ثالث، وتستمر هذه السرية سارية المفعول لأجل غير مسمى.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'sla-warranty',
      title: '6. ضمان الصيانة المجانية لمدة 30 يوماً (30-Day Engineering SLA)',
      icon: Clock,
      badge: 'ضمان هندسي حصري',
      summary: 'التزام بإصلاح أي ثغرات أو أخطاء برمجية لمدة شهر كامل بعد التسليم.',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-sm">
            تنفرد فوتيك بفرض ضمان صيانة برمجي إلزامي لحماية أصحاب المشاريع من أخطاء الكود غير المكتشفة وقت التسليم:
          </p>
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-50/70 p-4.5 dark:bg-cyan-950/20">
            <h5 className="font-black text-cyan-900 dark:text-cyan-300 text-sm flex items-center gap-2">
              <Clock size={16} />
              <span>التزامات فترة الضمان (30 يوماً بعد الاعتماد النهائي):</span>
            </h5>
            <ul className="mt-2.5 space-y-2 list-disc pr-4 text-xs text-cyan-950/90 dark:text-slate-300">
              <li>إصلاح أي ثغرات أو أخطاء برمجية (Bugs) ظهرت في النطاق المتفق عليه دون أي تكلفة إضافية.</li>
              <li>الرد على استفسارات صاحب المشروع حول تشغيل الكود وتكوين الخوادم خلال 24 ساعة كحد أقصى.</li>
              <li>لا يشمل الضمان إضافة ميزات برمجية جديدة تخرج عن وثيقة المواصفات الأصلية للمشروع.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'dispute-resolution',
      title: '7. فض النزاعات والتحكيم الهندسي المحايد (Dispute Protocol)',
      icon: Scale,
      badge: 'تحكيم حي محايد',
      summary: 'فحص فني لأكواد Git وسجلات الالتزام لفض أي نزاع بنزاهة هندسية.',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-sm">
            في حال نشوء أي خلاف فني أو تعاقدي بين العميل والمطور، توفر منصة فوتيك لجنة تحكيم هندسية مستقلة:
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 font-black text-xs">
                1
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white text-sm">المرحلة الودية:</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">مهلة 48 ساعة للتباحث المباشر عبر تذكرة النزاع للوصول إلى تسوية مرضية للطرفين.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-black text-xs">
                2
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white text-sm">الفحص الهندسي لـ Git Commits:</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  يقوم مهندس تدقيق مستقل من إدارة فوتيك بمقارنة متطلبات وثيقة المشروع مع التعديلات المرفوعة على مستودع Git الفعلي وفحص كفاءة الكود واختباراته.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                3
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white text-sm">القرار النهائي والملزم:</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  تصدر اللجنة قراراً غير قابل للنقض بإعادة الدفعة للعميل، أو إطلاقها للمطور، أو تقاسمها نسبياً حسب نسبة الإنجاز المثبتة، مع تعديل مؤشر FQS للمخالف.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'direct-payment-policy',
      title: '8. ميثاق النزاهة وقبولية الدفع المباشر والتعامل الخارجي',
      icon: CheckCircle2,
      badge: 'مقبول ومتاح بحرية تامة 🟢',
      summary: 'حرية السداد المباشر بين المطور والعميل لحين اكتمال برمجة بوابات الدفع الإلكتروني.',
      content: (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/80 p-4.5 dark:bg-emerald-950/20">
            <h5 className="font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-2 text-sm">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>شفافية كاملة: قبول وحرية الدفع والتحويل المباشر بين المطور والعميل</span>
            </h5>
            <p className="mt-2 text-xs leading-relaxed text-emerald-950/90 dark:text-emerald-100/90">
              نظراً لأن منصة فوتيك تعمل حالياً بنظام الإطلاق التجريبي الحي (Live Beta) ويجري العمل هندسياً على استكمال برمجة وربط بوابات السداد والتحصيل الإلكتروني الرسمية (مثل InstaPay، Vodafone Cash، Fawry، والبطاقات البنكية)، فإن <strong>التعامل المالي والدفع المباشر أو الخارجي بين صاحب المشروع والمطور مقبول ومسموح به بالكامل وبحرية تامة دون أي قيود أو حظر</strong>.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>حرية الاتفاق والتراضي</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                يحق للطرفين الاتفاق بالتراضي التام على آلية السداد وجدول الدفعات التي تناسبهما (مثل التحويل البنكي، المحافظ، إنستاباي، أو نقداً).
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-500" />
                <span>استمرار التوثيق الهندسي</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                تتيح المنصة غرف المحادثة، تسليم وفحص مستودعات Git، مطابقة مؤشر FQS، والتحكيم الهندسي الفني لحفظ حقوق العمل بغض النظر عن طريقة السداد.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Coins size={14} className="text-cyan-500" />
                <span>مستقبل بوابات السداد</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                بمجرد اكتمال البرمجة الرسمية للبوابات، سيتاح نظام الحجز الآلي في محفظة الضمان (Escrow Vault) كخيار إضافي متاح لمن يرغب بأعلى درجات الأمان.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contact-support',
      title: '9. قنوات التواصل والدعم الفني والقانوني',
      icon: Mail,
      badge: 'دعم مباشر 24/7',
      summary: 'قنوات التواصل المعتمدة لطلب مراجعة العقود وفض النزاعات التقنية.',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed text-sm">
            لأي استفسارات قانونية، أو طلب مراجعة عقود خاصة، أو الإبلاغ عن انتهاكات الملكية الفكرية، يسعدنا التواصل المباشر عبر قنواتنا المعتمدة:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-2">
                <Mail size={16} />
                <span>البريد الإلكتروني المعتمد للمنصة</span>
              </div>
              <a
                href="mailto:menarobir246m@gmail.com"
                className="mt-2 block font-mono text-sm font-bold text-slate-900 transition hover:text-teal-600 hover:underline dark:text-white dark:hover:text-teal-300"
              >
                menarobir246m@gmail.com
              </a>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">زمن الاستجابة والمتابعة الرسمية خلال 12-24 ساعة كحد أقصى.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4.5 dark:border-white/10 dark:bg-white/[0.02]">
              <div className="text-xs font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                <LifeBuoy size={16} />
                <span>نظام التذاكر المباشر</span>
              </div>
              <button
                onClick={() => go('/support')}
                className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-slate-900 transition hover:text-cyan-600 hover:underline dark:text-white dark:hover:text-cyan-300"
              >
                <span>فتح تذكرة دعم فني جديدة ←</span>
              </button>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">متاح على مدار الساعة 24/7 لمتابعة النزاعات والطلبات التقنية.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase().trim();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(query) ||
        sec.summary.toLowerCase().includes(query) ||
        (sec.badge && sec.badge.toLowerCase().includes(query))
    );
  }, [searchQuery, sections]);

  const handleCopyLink = (id: string) => {
    try {
      const url = `${window.location.origin}/terms#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedSectionId(id);
      if (notify) notify('تم نسخ رابط البند المباشر إلى الحافظة بنجاح! 📋');
      setTimeout(() => setCopiedSectionId(null), 2500);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 transition-colors duration-200 dark:bg-[#070e17] dark:text-slate-200 pt-8 pb-20" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Luxury Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-teal-50/30 p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0d1825] dark:via-[#09121d] dark:to-[#070e17] dark:shadow-2xl">
          <div className="absolute top-0 left-0 -mt-12 -ml-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 -mb-12 -mr-12 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-black text-teal-800 dark:text-teal-300 mb-3 shadow-xs">
                <Scale size={14} className="text-teal-600 dark:text-teal-400" />
                <span>ميثاق الحوكمة والشروط القانونية • FuTech Legal Code 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                شروط الاستخدام واتفاقية الضمان المالي
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                الإطار القانوني والتنفيذي المعتمد لضمان حقوق أصحاب المشاريع والشركات والمهندسين بدقة 100%، مع حماية الملكية الفكرية وتوثيق الشيفرات البرمجية.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white active:scale-95"
                title="طباعة أو تصدير الوثيقة كملف PDF"
              >
                <Download size={15} />
                <span>طباعة / حفظ PDF</span>
              </button>
              <button
                onClick={() => go('/')}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-teal-500/25 transition hover:brightness-105 active:scale-95"
              >
                <span>الرئيسية</span>
                <ArrowRight size={15} className="rotate-180" />
              </button>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="relative mt-8 max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في بنود الميثاق (مثال: دفع مباشر، ملكية الكود، ضمان 30 يوم، نزاع)..."
              className="w-full rounded-2xl border border-slate-200 bg-white/90 py-3 pr-11 pl-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-xs backdrop-blur-md focus:border-teal-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 dark:border-white/10 dark:bg-black/30 dark:text-white dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-400"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* 4 Quick Trust Metrics Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          <div className="group rounded-3xl border border-emerald-500/20 bg-white p-4 sm:p-5 shadow-xs transition hover:border-emerald-500/40 hover:shadow-md dark:border-emerald-500/20 dark:bg-[#0c1626]/80">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <div className="mt-3 text-sm font-black text-slate-900 dark:text-white">ضمان Escrow 100%</div>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">أموالك ومستحقاتك مؤمنة بموجب إنجاز المراحل البرمجية</p>
          </div>

          <div className="group rounded-3xl border border-teal-500/20 bg-white p-4 sm:p-5 shadow-xs transition hover:border-teal-500/40 hover:shadow-md dark:border-teal-500/20 dark:bg-[#0c1626]/80">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Percent size={22} />
            </div>
            <div className="mt-3 text-sm font-black text-slate-900 dark:text-white">0% عمولة للمطورين</div>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">المهندس يستلم 100% من أتعابه بالكامل بدون أي خصم وسيط</p>
          </div>

          <div className="group rounded-3xl border border-cyan-500/20 bg-white p-4 sm:p-5 shadow-xs transition hover:border-cyan-500/40 hover:shadow-md dark:border-cyan-500/20 dark:bg-[#0c1626]/80">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <GitBranch size={22} />
            </div>
            <div className="mt-3 text-sm font-black text-slate-900 dark:text-white">ملكية الشيفرة 100%</div>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">نقل مستودع Git كامل مع صلاحيات المالك فور انتهاء العمل</p>
          </div>

          <div className="group rounded-3xl border border-purple-500/20 bg-white p-4 sm:p-5 shadow-xs transition hover:border-purple-500/40 hover:shadow-md dark:border-purple-500/20 dark:bg-[#0c1626]/80">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Clock size={22} />
            </div>
            <div className="mt-3 text-sm font-black text-slate-900 dark:text-white">30 يوماً صيانة SLA</div>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">ضمان إصلاح أي أخطاء وثغرات بعد التسليم مجاناً</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Sidebar Navigation & Table of Contents */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-[#0c1626]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>فهرس البنود والسياسات</span>
                </h3>
                <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300">
                  {sections.length} بنود
                </span>
              </div>

              <nav className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {filteredSections.map((sec) => {
                  const Icon = sec.icon;
                  const active = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id);
                        const el = document.getElementById(sec.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-right text-xs font-bold transition-all ${
                        active
                          ? 'border border-teal-500/30 bg-teal-50 text-teal-900 shadow-xs dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-500/40'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon size={15} className={active ? 'text-teal-600 dark:text-teal-400 shrink-0' : 'text-slate-400 shrink-0'} />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      {sec.badge && (
                        <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-black ${
                          sec.id === 'direct-payment-policy'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                            : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                        }`}>
                          {sec.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-5 border-t border-slate-100 dark:border-white/5 pt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>تاريخ الاعتماد الرسمي:</span>
                  <strong className="text-slate-900 dark:text-white">نوفمبر 2026</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>رقم الإصدار الحاكم:</span>
                  <strong className="text-teal-600 dark:text-teal-400 font-mono">v2.6-Live-SLA</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Clauses List */}
          <div className="space-y-6 lg:col-span-8">
            {filteredSections.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-white/15 dark:bg-[#0c1626]">
                <AlertCircle className="mx-auto text-slate-400" size={36} />
                <h4 className="mt-3 text-sm font-black text-slate-800 dark:text-white">لا توجد بنود مطابقة لبحثك</h4>
                <p className="mt-1 text-xs text-slate-500">جرب البحث بكلمات أخرى أو امسح شريط البحث لعرض كامل الميثاق.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500"
                >
                  عرض كافة البنود
                </button>
              </div>
            ) : (
              filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isDirectPayment = sec.id === 'direct-payment-policy';
                return (
                  <section
                    key={sec.id}
                    id={sec.id}
                    className={`rounded-3xl border transition-all duration-200 p-6 sm:p-8 ${
                      isDirectPayment
                        ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-50/60 via-white to-white shadow-md dark:border-emerald-500/30 dark:bg-gradient-to-br dark:from-emerald-950/20 dark:via-[#0c1626] dark:to-[#0c1626]'
                        : 'border-slate-200/90 bg-white shadow-sm hover:border-teal-500/30 hover:shadow-md dark:border-white/10 dark:bg-[#0c1626]/90'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${
                          isDirectPayment
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
                        }`}>
                          <Icon size={22} />
                        </span>
                        <div>
                          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{sec.title}</h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sec.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sec.badge && (
                          <span className={`rounded-full px-3 py-1 text-xs font-black border ${
                            isDirectPayment
                              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : 'border-teal-500/30 bg-teal-500/10 text-teal-800 dark:text-teal-300'
                          }`}>
                            {sec.badge}
                          </span>
                        )}

                        <button
                          onClick={() => handleCopyLink(sec.id)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-slate-200 transition"
                          title="نسخ رابط هذا البند"
                        >
                          {copiedSectionId === sec.id ? (
                            <Check size={14} className="text-emerald-500" />
                          ) : (
                            <Share2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {sec.content}
                    </div>
                  </section>
                );
              })
            )}

            {/* Bottom Final CTA */}
            <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-900 via-[#102235] to-slate-950 p-6 sm:p-8 text-center text-white shadow-xl">
              <span className="text-2xl">🛡️</span>
              <h3 className="mt-2 text-lg sm:text-xl font-black text-white">
                جاهز للبدء في بيئة هندسية متكاملة ومحمية بالكامل؟
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                انضم الآن لمجتمع المهندسين والرياديين في فوتيك وابدأ مشروعك القادم بثقة مطلقة وأمان تعاقدي كامل.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => go('/post-project')}
                  className="rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 px-6 py-3 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/25 transition hover:brightness-105 active:scale-95"
                >
                  نشر مشروعك الآن بدون عمولة 🚀
                </button>
                <button
                  onClick={() => go('/support')}
                  className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  تواصل مع الدعم الفني والقانوني
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
