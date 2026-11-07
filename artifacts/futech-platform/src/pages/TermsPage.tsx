import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  ShieldCheck,
  Lock,
  GitBranch,
  Percent,
  Clock,
  AlertTriangle,
  Mail,
  CheckCircle2,
  FileText,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Building2,
  Cpu,
} from 'lucide-react';

interface TermsPageProps {
  go: (path: string) => void;
  notify?: (msg: string) => void;
}

export function TermsPage({ go, notify }: TermsPageProps) {
  const [activeSection, setActiveSection] = useState<string>('escrow');

  const sections = [
    {
      id: 'definitions',
      title: '1. التعريفات ونطاق الحوكمة',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            تُعد منصة <strong>فوتيك (FuTech)</strong> حاضنة متطورة وسوقاً تقنياً مستقلاً لتنظيم واستقطاب الكفاءات الهندسية البرمجية العربية، وربطها بالشركات وأصحاب المشاريع والشركات الناشئة وفق معايير هندسية صارمة.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <h5 className="font-bold text-[#5ce0e8]">«صاحب المشروع / العميل»</h5>
              <p className="mt-1 text-xs text-slate-400">
                أي فرد أو شركة أو كيان تجاري يعرض احتياجات برمجية ويوفر ميزانية للمشروع عبر نظام الضمان المالي.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <h5 className="font-bold text-[#5ce0e8]">«المهندس / المطور المعتمد»</h5>
              <p className="mt-1 text-xs text-slate-400">
                المستقل المتخصص الخاضع لمؤشر الجودة FQS والملتزم بالمعايير الهندسية وتسليم الأكواد عبر Git.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            تخضع كافة المعاملات عبر المنصة للأنظمة والقوانين المنظمة للتعاملات الإلكترونية والتجارة الرقمية وحماية الملكية الفكرية.
          </p>
        </div>
      ),
    },
    {
      id: 'escrow',
      title: '2. ميثاق الضمان المالي المشفر (100% Escrow Protection)',
      icon: ShieldCheck,
      badge: 'ضمان مالي إلزامي',
      content: (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-emerald-400">
              <ShieldCheck size={18} />
              <span>مبدأ الأمان المزدوج: صفر مخاطرة للطرفين</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-emerald-100/90">
              لا يبدأ المطور كتابة سطر برمجي واحد إلا بعد إيداع دفعة المرحلة (Milestone) في محفظة الضمان المشفرة للمنصة، ولا تُحوّل الأموال للمطور إلا بعد موافقة العميل وفحص مخرجات الكود.
            </p>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>
                <strong>تقسيم الدفعات على مراحل (Milestones):</strong> يُمنع تحويل ميزانية المشروع كاملة دفعة واحدة للمشاريع الكبيرة؛ بل تُقسّم لمراحل محددة التسليمات ومواعيد الإنجاز.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>
                <strong>فترة الفحص والاعتماد (7 أيام):</strong> يحق لصاحب المشروع مهلة 7 أيام تقويمية لمراجعة مخرجات المرحلة والتأكد من خلوها من الأخطاء قبل إطلاق الدفعة.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>
                <strong>الاعتماد التلقائي:</strong> في حال عدم إبداء العميل لأي ملاحظات أو تقديم طلب تعديل خلال مهلة 7 أيام بعد التسليم الرسمي عبر المنصة، يتم الإفراج عن مستحقات المرحلة للمطور تلقائياً لضمان عدم تجميد حقوقه.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'commission',
      title: '3. سياسة الـ 0% عمولات للمطورين (Zero Commission Policy)',
      icon: Percent,
      badge: '100% من أرباحك لك',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            إيماناً من منصة فوتيك بدعم الكفاءات الهندسية البرمجية في العالم العربي، تعتمد المنصة نموذج <strong>العمولة الصفرية (0% Freelancer Fee)</strong> على مستحقات المطورين:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#20878e]/30 bg-[#20878e]/10 p-3.5 text-center">
              <div className="text-2xl font-black text-[#5ce0e8]">0%</div>
              <div className="mt-1 text-xs font-bold text-white">استقطاع من المطور</div>
              <p className="mt-1 text-[11px] text-slate-400">يحصل المهندس على 100% من المبلغ المتفق عليه</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-center">
              <div className="text-2xl font-black text-amber-400">رسوم المعالجة</div>
              <div className="mt-1 text-xs font-bold text-white">بوابات الدفع البنكية</div>
              <p className="mt-1 text-[11px] text-slate-400">تخضع لرسوم بوابات الدفع الخارجية (Stripe/PayPal) فقط</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-center">
              <div className="text-2xl font-black text-emerald-400">شفافية تامة</div>
              <div className="mt-1 text-xs font-bold text-white">بدون مصاريف خفية</div>
              <p className="mt-1 text-[11px] text-slate-400">كافة الرسوم معلنة وموضحة بفواتير رسمية رقمية</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ip-ownership',
      title: '4. نقل ملكية الشيفرة البرمجية (IP & Code Ownership)',
      icon: GitBranch,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            يُعتبر تسليم وتوثيق الكود البرمجي ونقل ملكيته حجر الزاوية في ميثاق جودة فوتيك:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#5ce0e8]" />
              <span>
                <strong>انتقال الملكية الفورية:</strong> بمجرد دفع مستحقات مرحلة أو المشروع بالكامل، تنتقل الملكية الفكرية والحقوق التجارية لكافة الشيفرات البرمجية، التصاميم، وقواعد البيانات المبتكرة فوراً لصالح العميل.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#5ce0e8]" />
              <span>
                <strong>معايير التسليم التقنية:</strong> يلتزم المطور بتسليم مستودع Git نظيف وموثق يحتوي على ملف <code>README.md</code> لشرح التشغيل، وملف <code>.env.example</code> لمتغيرات البيئة، وإرشادات النشر السحابي.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#5ce0e8]" />
              <span>
                <strong>المكتبات مفتوحة المصدر:</strong> يجب الإفصاح عن أي مكتبات مفتوحة المصدر (Open Source) مستخدمة والتأكد من توافق رخصها (مثل MIT، Apache 2.0) مع الاستخدام التجاري للعميل.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'auto-nda',
      title: '5. اتفاقية سرية المعلومات التلقائية (Mutual Auto-NDA)',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            بمجرد بدء محادثة أو التعاقد على مشروع في منصة فوتيك، يسري تلقائياً عقد حماية سرية المعلومات (Non-Disclosure Agreement) بين الطرفين دون الحاجة لتوقيع ورقي منفصل:
          </p>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-slate-300">
            <p>
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
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            تنفرد فوتيك بفرض ضمان صيانة برمجي إلزامي لحماية أصحاب المشاريع من أخطاء الكود غير المكتشفة وقت التسليم:
          </p>
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs text-slate-200">
            <h5 className="font-black text-cyan-300">التزامات فترة الضمان (30 يوماً بعد الاعتماد النهائي):</h5>
            <ul className="mt-2 space-y-1.5 list-disc pr-4 text-slate-300">
              <li>إصلاح أي ثغرات أو أخطاء برمجية (Bugs) ظهرت في النطاق المتفق عليه دون أي تكلفة إضافية.</li>
              <li>الرد على استفسارات صاحب المشروع حول تشغيل الكود وتكوين الخوادم خلال 24 ساعة.</li>
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
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            في حال نشوء أي خلاف فني أو تعاقدي بين العميل والمطور، توفر منصة فوتيك لجنة تحكيم هندسية مستقلة:
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[#20878e]/20 text-[#5ce0e8] font-black">
                1
              </span>
              <div>
                <strong className="text-white">المرحلة الودية:</strong>
                <p className="text-slate-400">مهلة 48 ساعة للتباحث المباشر عبر تذكرة النزاع للوصول إلى تسوية مرضية.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[#20878e]/20 text-[#5ce0e8] font-black">
                2
              </span>
              <div>
                <strong className="text-white">الفحص الهندسي لـ Git Commits:</strong>
                <p className="text-slate-400">
                  يقوم مهندس تدقيق مستقل من إدارة فوتيك بمقارنة متطلبات وثيقة المشروع مع التعديلات المرفوعة على مستودع Git الفعلي.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-[#20878e]/20 text-[#5ce0e8] font-black">
                3
              </span>
              <div>
                <strong className="text-white">القرار النهائي والملزم:</strong>
                <p className="text-slate-400">
                  تصدر اللجنة قراراً غير قابل للنقض بإعادة الدفعة للعميل، أو إطلاقها للمطور، أو تقاسمها نسبياً حسب نسبة الإنجاز المثبتة، مع تعديل مؤشر FQS للمخالف.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'off-platform-ban',
      title: '8. حظر المعاملات خارج المنصة والنزاهة المهنية',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200">
            <h5 className="font-black text-red-400">سياسة صارمة لمنع التهرب والتعامل الخارجي:</h5>
            <p className="mt-1.5 leading-relaxed">
              يُحظر منعاً باتاً طلب أو تقديم وسائل دفع خارجية أو التفاوض على إجراء المعاملات بعيداً عن نظام الضمان المالي في فوتيك. يؤدي خرق هذا البند إلى الحظر الدائم للحساب ومصادرة مستحقات المخالف لتعويض الأضرار.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'contact-support',
      title: '9. قنوات التواصل والدعم القانوني',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            لأي استفسارات قانونية، أو طلب مراجعة عقود خاصة، أو الإبلاغ عن انتهاكات الملكية الفكرية، يسعدنا التواصل المباشر عبر قنواتنا المعتمدة:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
              <div className="font-bold text-[#5ce0e8]">البريد الإلكتروني الرسمي</div>
              <a
                href="mailto:support@futech.com"
                className="mt-1 block font-mono text-white transition hover:underline"
              >
                support@futech.com
              </a>
              <p className="mt-1 text-[11px] text-slate-400">زمن الاستجابة خلال 12-24 ساعة كحد أقصى.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
              <div className="font-bold text-[#5ce0e8]">نظام التذاكر المباشر</div>
              <button
                onClick={() => go('/support')}
                className="mt-1 text-white font-bold transition hover:text-[#5ce0e8] hover:underline"
              >
                فتح تذكرة دعم فني جديدة ←
              </button>
              <p className="mt-1 text-[11px] text-slate-400">متاح 24/7 لمتابعة النزاعات والطلبات التقنية.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-200 pt-8 pb-20" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#20878e]/30 bg-[#20878e]/10 px-3 py-1 text-xs font-black text-[#5ce0e8]">
              <Scale size={14} />
              <span>ميثاق الحوكمة والشروط القانونية • FuTech Legal Code</span>
            </div>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              شروط الاستخدام واتفاقية الضمان المالي
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              الإطار القانوني والتنفيذي الذي يضمن حقوق أصحاب المشاريع والمهندسين بدقة 100%
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Download size={14} />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              onClick={() => go('/')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#20878e] to-[#2db1ba] px-4 py-2 text-xs font-black text-[#0b1c28] shadow-md transition hover:opacity-90"
            >
              <span>الرئيسية</span>
              <ArrowRight size={14} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Quick Trust Highlights Banner */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <ShieldCheck size={24} className="mx-auto text-emerald-400" />
            <div className="mt-2 text-sm font-black text-white">ضمان Escrow 100%</div>
            <div className="text-[11px] text-slate-400">أموالك مؤمنة بموجب إنجاز المراحل</div>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
            <Percent size={24} className="mx-auto text-cyan-400" />
            <div className="mt-2 text-sm font-black text-white">0% عمولة مطورين</div>
            <div className="text-[11px] text-slate-400">استلم كامل أتعابك بدون استقطاعات</div>
          </div>
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-center">
            <GitBranch size={24} className="mx-auto text-blue-400" />
            <div className="mt-2 text-sm font-black text-white">ملكية الشيفرة كاملة</div>
            <div className="text-[11px] text-slate-400">نقل أصول Git مع انتهاء المشروع</div>
          </div>
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-center">
            <Clock size={24} className="mx-auto text-purple-400" />
            <div className="mt-2 text-sm font-black text-white">30 يوماً صيانة SLA</div>
            <div className="text-[11px] text-slate-400">ضمان خلو الأكواد من الأخطاء</div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0d1825] p-4">
              <h3 className="mb-3 px-2 text-xs font-black uppercase tracking-wider text-slate-400">
                فهرس البنود والسياسات
              </h3>
              <nav className="space-y-1.5">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const active = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id);
                        const el = document.getElementById(sec.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-right text-xs font-bold transition ${
                        active
                          ? 'border border-[#20878e]/40 bg-[#20878e]/15 text-[#5ce0e8]'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={15} />
                        <span>{sec.title}</span>
                      </div>
                      {sec.badge && (
                        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                          {sec.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-white/10 pt-4 text-xs text-slate-400">
                <p>تاريخ آخر مراجعة واعتماد: <strong className="text-white">نوفمبر 2026</strong></p>
                <p className="mt-1">رقم الإصدار التعاقدي: <strong className="text-[#5ce0e8]">v2.4-SLA</strong></p>
              </div>
            </div>
          </div>

          {/* Clauses List */}
          <div className="space-y-6 lg:col-span-8">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="rounded-3xl border border-white/10 bg-[#0d1825]/90 p-6 shadow-xl backdrop-blur-md transition hover:border-[#20878e]/30 md:p-8"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#20878e]/20 text-[#5ce0e8]">
                        <Icon size={20} />
                      </span>
                      <h2 className="text-base font-black text-white sm:text-lg">{sec.title}</h2>
                    </div>
                    {sec.badge && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                        {sec.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-5 text-sm text-slate-300">{sec.content}</div>
                </section>
              );
            })}

            {/* Bottom Final CTA */}
            <div className="rounded-3xl border border-[#20878e]/30 bg-gradient-to-br from-[#122436] to-[#0a1624] p-6 text-center md:p-8">
              <h3 className="text-lg font-black text-white sm:text-xl">
                جاهز للبدء في بيئة هندسية متكاملة ومحمية بالكامل؟
              </h3>
              <p className="mt-2 text-xs text-slate-300">
                انضم الآن لمجتمع المهندسين والرياديين في فوتيك وابدأ مشروعك القادم بثقة مطلقة.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => go('/post-project')}
                  className="rounded-xl bg-gradient-to-r from-[#20878e] to-[#2db1ba] px-6 py-2.5 text-xs font-black text-[#0b1c28] shadow-md transition hover:opacity-90"
                >
                  نشر مشروعك الآن بدون عمولة
                </button>
                <button
                  onClick={() => go('/support')}
                  className="rounded-xl border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
                >
                  تواصل مع الدعم القانوني
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
