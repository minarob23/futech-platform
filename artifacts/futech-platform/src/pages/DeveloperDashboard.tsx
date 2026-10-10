import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, BadgeCheck, Briefcase, Calendar, CheckCircle2,
  Clock, DollarSign, FileCode2, Layers, ShieldCheck, Star,
  TrendingUp, Users, ArrowUpRight, ChevronLeft, Plus, Download,
  Wallet, FileText, CheckCircle
} from 'lucide-react';
import { Store, Project, Application, Delivery } from '../data/mockData';

interface DeveloperDashboardProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
}

export function DeveloperDashboard({ store, update, notify, go }: DeveloperDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'proposals' | 'deliveries'>('overview');

  // Computed stats
  const totalEarnings = store.deliveries.reduce((sum, d) => sum + d.amount, 0);
  const activeProjectsCount = store.projects.filter((p) => p.status === 'قيد التنفيذ').length;
  const pendingApplications = store.applications.filter((a) => a.status === 'قيد المراجعة').length;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Profile Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172b42] via-[#203c62] to-[#1a3350] p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/images/dev-male.jpg"
                alt="عمر المطيري"
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/15"
              />
              <span className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full border-2 border-[#172b42] bg-[#3bb87c]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black md:text-2xl">عمر المطيري</h1>
                <BadgeCheck size={20} className="text-[#3ec4cb]" />
                <span className="rounded-full bg-[#3ec4cb]/20 px-3 py-0.5 text-[10px] font-extrabold text-[#74e2e8]">
                  مطور معتمد
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                مهندس واجهات وأنظمة تفاعلية Full-Stack · متاح لمشاريع جديدة
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Star size={13} className="fill-[#f5ba48] text-[#f5ba48]" />
                  <span>4.96 (34 تقييم)</span>
                </span>
                <span>·</span>
                <span>الرياض، السعودية</span>
                <span>·</span>
                <span>عضو منذ عام 2024</span>
              </div>
            </div>
          </div>

          {/* FQS Quality Meter */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#62dade]">معيار الجودة الهندسي</div>
              <div className="text-2xl font-black text-white">92 / 100</div>
              <div className="text-[10px] text-slate-300">تصنيف: خبير برمجيات</div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#3ec4cb] text-[#0d2334]">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي الأرباح المستلمة</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf6ef] text-[#2c8d57]">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47]">
            {totalEarnings.toLocaleString('ar-EG')} <span className="text-xs font-bold text-slate-500">ر.س</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#2e9159]">
            <TrendingUp size={13} />
            <span>+18% عن الشهر الماضي</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مشاريع قيد التنفيذ</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e5f5f7] text-[#248f98]">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47]">{activeProjectsCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">جميع المراحل في موعدها</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">طلبات التقديم النشطة</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf2fb] text-[#345b95]">
              <FileText size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47]">{store.applications.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">{pendingApplications} بانتظار رد العميل</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">معدل الإنجاز والالتزام</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2eefb] text-[#6942ad]">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47]">98.5%</div>
          <div className="mt-1 text-[11px] text-slate-400">تسليم بدون تأخيرات</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`border-b-2 px-5 py-3 text-xs font-extrabold transition ${
            activeTab === 'overview'
              ? 'border-[#203d62] text-[#203d62]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          نظرة عامة والتقارير
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`border-b-2 px-5 py-3 text-xs font-extrabold transition ${
            activeTab === 'projects'
              ? 'border-[#203d62] text-[#203d62]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          المشاريع والمراحل
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`border-b-2 px-5 py-3 text-xs font-extrabold transition ${
            activeTab === 'proposals'
              ? 'border-[#203d62] text-[#203d62]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          خطط التقديم ({store.applications.length})
        </button>
        <button
          onClick={() => setActiveTab('deliveries')}
          className={`border-b-2 px-5 py-3 text-xs font-extrabold transition ${
            activeTab === 'deliveries'
              ? 'border-[#203d62] text-[#203d62]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          سجل التسليم والأرباح
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* FQS Detailed Metrics */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-[#172c43]">مؤشر جودة المستقل FQS (Freelancer Quality Score)</h3>
                <p className="mt-0.5 text-xs text-slate-500">تحليل خوارزمي دقيق لمدى كفاءتك والتزامك واحترافيتك البرمجية</p>
              </div>
              <span className="rounded-xl bg-[#e6f7f7] px-3 py-1 text-xs font-black text-[#1e838b]">
                مستوى خبير (94/100)
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">معدل إكمال المشاريع (Job Completion Rate)</span>
                  <span className="text-[#203d62]">99%</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">تسليم أكواد كاملة ومستقرة دون إلغاء أو ثغرات</div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#27a1a9]" style={{ width: '99%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">الالتزام بالوقت والميزانية (On Time & On Budget)</span>
                  <span className="text-[#203d62]">98%</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">تسليم برمجيات خالية من المشاكل في موعدها دون تكاليف إضافية</div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#355f9a]" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">تقييم العملاء (Average Star Rating)</span>
                  <span className="text-[#203d62]">98% (4.98/5)</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">تقييمات ممتازة ومراجعات إيجابية بعد فحص الكود والتطبيق</div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#2f935a]" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">معدل التوظيف المتكرر (Repeat Hire Rate)</span>
                  <span className="text-[#203d62]">92%</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">عودة العملاء للتعاقد مجدداً في مشاريع برمجية أخرى</div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#754ac2]" style={{ width: '92%' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f6f9fc] p-4 text-xs leading-relaxed text-slate-600">
              💡 <b>تأثير مؤشر FQS على ملفك:</b> مؤشر FQS المرتفع يمنح ملفك الشخصي صدارة نتائج البحث وتوصية مباشرة لأصحاب المشاريع، مما يضاعف فرص فوزك بالعروض البرمجية المميزة.
            </div>
          </div>

          {/* Quick Actions & Upcoming Milestones */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-black text-[#172c43]">إجراءات سريعة</h3>
              <div className="mt-4 grid gap-2.5">
                <button
                  onClick={() => go('/projects')}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fafbfc] p-3 text-xs font-bold text-slate-700 transition hover:border-[#3cb8be] hover:bg-[#f4fbfb]"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={16} className="text-[#259199]" />
                    <span>تصفح وتقديم على مشاريع جديدة</span>
                  </span>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => go('/developers')}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fafbfc] p-3 text-xs font-bold text-slate-700 transition hover:border-[#3cb8be] hover:bg-[#f4fbfb]"
                >
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-[#325892]" />
                    <span>تصفح دليل المطورين والزملاء</span>
                  </span>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => notify('طلب سحب الأرباح متاح ومحمي عبر الحساب البنكي المعتمد')}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fafbfc] p-3 text-xs font-bold text-slate-700 transition hover:border-[#3cb8be] hover:bg-[#f4fbfb]"
                >
                  <span className="flex items-center gap-2">
                    <Wallet size={16} className="text-[#2c8d57]" />
                    <span>طلب سحب رصيد الأرباح</span>
                  </span>
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Next Milestone */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#172c43]">أقرب موعد تسليم</h3>
                <span className="rounded-lg bg-[#fff4df] px-2.5 py-0.5 text-[10px] font-bold text-[#b47a1c]">
                  متبقي 4 أيام
                </span>
              </div>
              <div className="mt-3">
                <div className="text-xs font-black text-[#1d3550]">
                  بناء واجهات API وتكامل المخزون
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  مشروع: لوحة متابعة المخزون لمتجر إلكتروني
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">المبلغ في الضمان:</span>
                  <span className="font-black text-[#1b3450]">2,400 ر.س</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {store.projects.map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:flex-row md:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${
                      p.status === 'قيد التنفيذ'
                        ? 'bg-[#e5f6f7] text-[#1c8188]'
                        : p.status === 'متاح'
                        ? 'bg-[#eaf6ef] text-[#2c8e57]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {p.status}
                  </span>
                  <h3 className="text-sm font-black text-[#162a40]">{p.title}</h3>
                </div>
                <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500">
                  {p.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-4 border-t border-slate-100 pt-3 md:border-none md:pt-0">
                <div className="text-left">
                  <div className="text-sm font-black text-[#162a40]">
                    {p.budget.toLocaleString('ar-EG')} ر.س
                  </div>
                  <div className="text-[10px] text-slate-400">التسليم: {p.deadline}</div>
                </div>
                <button
                  onClick={() => notify(`تفاصيل المشروع: ${p.title}`)}
                  className="rounded-xl bg-[#203d62] px-4 py-2 text-xs font-bold text-white hover:bg-[#2c5383]"
                >
                  إدارة المراحل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Proposals */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {store.applications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <FileText className="mx-auto text-slate-300" size={32} />
              <h3 className="mt-3 text-sm font-bold text-slate-700">لا توجد طلبات تقديم حالية</h3>
              <p className="mt-1 text-xs text-slate-500">تصفح سوق المشاريع وقدم خطة عملك الأولى.</p>
              <button
                onClick={() => go('/projects')}
                className="mt-4 rounded-xl bg-[#203d62] px-5 py-2 text-xs font-bold text-white"
              >
                تصفح المشاريع
              </button>
            </div>
          ) : (
            store.applications.map((app) => {
              const project = store.projects.find((p) => p.id === app.projectId);
              return (
                <div
                  key={app.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">مشروع:</span>
                      <h4 className="text-sm font-black text-[#162b40]">
                        {project?.title || 'مشروع مخصص'}
                      </h4>
                    </div>
                    <span className="rounded-lg bg-[#fff5df] px-3 py-1 text-xs font-extrabold text-[#aa7519]">
                      {app.status}
                    </span>
                  </div>
                  <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                    <b>خطة العمل المقترحة:</b> {app.plan}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Deliveries */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white shadow-xs">
            {store.deliveries.map((dl) => (
              <div key={dl.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf6ef] text-[#2c8d57]">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#172c42]">{dl.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      العميل: {dl.client} · {dl.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className="text-sm font-black text-[#172c42]">
                      +{dl.amount.toLocaleString('ar-EG')} ر.س
                    </div>
                    <span className="text-[10px] font-bold text-[#2d9158]">{dl.status}</span>
                  </div>
                  <button
                    onClick={() => notify(`تم تحميل شهادة وفاتورة تسليم: ${dl.title}`)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                    title="تحميل شهادة الإنجاز"
                  >
                    <Download size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
