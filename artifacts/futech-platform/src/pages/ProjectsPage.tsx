import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Search, Plus, Briefcase, Clock, DollarSign, ShieldCheck, CheckCircle2,
  Code2, Sparkles, ArrowLeft, ArrowUpRight, Filter, Layers, Globe,
  Paperclip, Users, Terminal, Lock, CircleUserRound, Check, Zap,
  FileCode2, Building2, ChevronDown, Award, GitBranch
} from 'lucide-react';
import { Store, Project, Application } from '../types';

interface ProjectsPageProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  setModal: (modal: any) => void;
  go: (path: string) => void;
}

export function ProjectsPage({ store, update, notify, setModal, go }: ProjectsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'saas', label: 'منصات سحابية (SaaS)' },
    { id: 'ecommerce', label: 'متاجر إلكترونية' },
    { id: 'cms', label: 'مواقع CMS ومتاجر (WordPress / Shopify)' },
    { id: 'mobile', label: 'تطبيقات الجوال' },
    { id: 'ai', label: 'ذكاء اصطناعي وأتمتة' },
    { id: 'api', label: 'أنظمة Backend & APIs' },
  ];

  // Dynamic Skills set from active projects
  const allSkills = useMemo<string[]>(() => {
    const defaultTechs = ['React', 'TypeScript', 'Node.js', 'WordPress', 'Shopify', 'WooCommerce', 'Wix', 'Python', 'Next.js', 'Flutter', 'PostgreSQL', 'TailwindCSS'];
    const projectTechs = store.projects.flatMap((p: Project) => p.stack || []);
    return ['all', ...Array.from(new Set<string>([...defaultTechs, ...projectTechs]))];
  }, [store.projects]);

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return store.projects.filter((p: Project) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.owner.toLowerCase().includes(search.toLowerCase()) ||
        (p.stack && p.stack.some((s) => s.toLowerCase().includes(search.toLowerCase())));
      const matchesCategory =
        selectedCategory === 'all' ||
        (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        p.title.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSkill = skillFilter === 'all' || (p.stack && p.stack.includes(skillFilter));
      const matchesDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesSkill && matchesDiff;
    });
  }, [store.projects, search, selectedCategory, skillFilter, difficultyFilter]);

  return (
    <div className="space-y-10" dir="rtl">
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. Header & Live Cyber Marketplace Hero                   */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-[#102238] to-[#0a182a] p-7 text-white shadow-xl md:p-10 dark:border-white/10">
        {/* Ambient Radial Lights */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-35"
          style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-black text-cyan-300 border border-cyan-500/20 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>سوق المشاريع البرمجية المعتمدة • FuTech Live Market</span>
            </div>

            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl lg:text-4xl">
              سوق المشاريع الهندسية المحددة النطاق
            </h1>

            <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
              تصفح المشاريع الموثقة، قدم خطة عملك الهندسية مباشرة لأصحاب الأعمال، واستلم أتعابك كاملة بنظام الضمان المالي Escrow وبدون أي عمولات أو اقتطاعات.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/post-project"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 transition hover:opacity-95 active:scale-95"
            >
              <Plus size={16} className="transition group-hover:rotate-90" />
              <span>انشر مشروعًا جديدًا</span>
            </Link>

            <Link
              href="/developers"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3.5 text-xs font-black text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <Users size={16} className="text-cyan-400" />
              <span>تصفح النخبة</span>
            </Link>
          </div>
        </div>

        {/* 4 Pillars Trust Bar */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-6 sm:grid-cols-4 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Lock size={14} />
            </div>
            <div>
              <div className="text-white font-black text-[11px]">ضمان مالي 100%</div>
              <div className="text-[10px] text-slate-400">حفظ المستحقات بالمراحل</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300">
              <GitBranch size={14} />
            </div>
            <div>
              <div className="text-white font-black text-[11px]">تسليم Git كامل</div>
              <div className="text-[10px] text-slate-400">نقل المستودع والتوثيق</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
              <ShieldCheck size={14} />
            </div>
            <div>
              <div className="text-white font-black text-[11px]">اتفاقية Auto-NDA</div>
              <div className="text-[10px] text-slate-400">حماية سرية الأكواد</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
              <Award size={14} />
            </div>
            <div>
              <div className="text-white font-black text-[11px]">صفر عمولات (0%)</div>
              <div className="text-[10px] text-slate-400">لا اقتطاعات من أتعابك</div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. Interactive Search & Multi-Filter Console             */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1524]">
        {/* Search Input & Selectors */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن اسم مشروع، تقنية (مثل: React, Python)، أو صاحب عمل..."
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 py-2.5 pe-4 ps-10 text-xs font-bold text-slate-800 outline-none transition focus:border-cyan-500 focus:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:border-cyan-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Technology Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-2.5 pe-8 text-xs font-bold text-slate-700 outline-none transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              >
                <option value="all">كل التقنيات</option>
                {allSkills.filter((s) => s !== 'all').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Difficulty Level Filter */}
            <div className="relative">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="appearance-none rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-2.5 pe-8 text-xs font-bold text-slate-700 outline-none transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
              >
                <option value="all">كل المستويات</option>
                <option value="مبتدئ">مستوى مبتدئ (Junior)</option>
                <option value="متوسط">مستوى متوسط (Mid-Level)</option>
                <option value="متقدم">مستوى متقدم (Senior)</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-white/5">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === c.id
                  ? 'bg-gradient-to-r from-[#203d62] to-[#1c6488] text-white shadow-sm dark:from-cyan-500/25 dark:to-teal-500/25 dark:text-cyan-300 dark:border dark:border-cyan-400/40'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. Projects Grid OR Clean Empty State                    */}
      {/* ──────────────────────────────────────────────────────── */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((p: Project) => {
            const applied = store.applications.some((a: Application) => a.projectId === p.id);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-cyan-400 hover:shadow-lg dark:border-white/10 dark:bg-[#0c1524] dark:hover:border-cyan-400/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-xl bg-[#eaf6f6] px-3 py-1 text-[11px] font-black text-[#1f878f] dark:bg-cyan-950/60 dark:text-cyan-300">
                      مستوى {p.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <Clock size={12} />
                      <span>التسليم: {p.deadline}</span>
                    </span>
                  </div>

                  <h3 className="mt-3.5 text-base font-black text-[#152c42] group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400 transition">
                    {p.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                    <CircleUserRound size={13} className="text-cyan-500" />
                    <span>صاحب المشروع: {p.owner}</span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {p.description}
                  </p>

                  {/* Stack Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack?.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:bg-white/[0.05] dark:text-slate-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Milestones list */}
                  {p.milestones && p.milestones.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-xs dark:bg-slate-900/60 border border-slate-100 dark:border-white/5">
                      <div className="mb-2 font-black text-slate-700 dark:text-slate-300">مراحل التسليم المقترحة:</div>
                      <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        {p.milestones.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-cyan-100 text-[9px] font-black text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300">
                              {idx + 1}
                            </span>
                            <span className="truncate">{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {p.attachments && p.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">المرفقات:</span>
                      {p.attachments.map((att: any) => (
                        <span
                          key={att.id}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          <Paperclip size={10} className="text-teal-500" />
                          <span className="max-w-[120px] truncate">{att.name}</span>
                          <span className="text-[9px] text-slate-400">({att.size})</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                  <div>
                    <div className="text-[10px] text-slate-400">الميزانية المرصودة</div>
                    <div className="text-base font-black text-[#183452] dark:text-emerald-400">
                      {p.budget?.toLocaleString('ar-EG')} ر.س
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setModal({ type: 'projectDetail', data: p })}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
                    >
                      التفاصيل
                    </button>
                    <button
                      type="button"
                      disabled={applied}
                      onClick={() => setModal({ type: 'apply', data: p })}
                      className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                        applied
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-white/10 dark:text-slate-500'
                          : 'bg-gradient-to-r from-cyan-600 to-teal-500 text-white hover:opacity-95 shadow-sm'
                      }`}
                    >
                      {applied ? 'تم التقديم' : 'قدّم بخطة عمل'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ──────────────────────────────────────────────────────── */
        /* Empty State & Guarantees Bar                             */
        /* ──────────────────────────────────────────────────────── */
        <div className="space-y-10">
          {/* Main Empty State Interactive Card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-[#0c1524] md:p-12">
            {/* Holographic Glowing Beacon Icon */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin dark:border-cyan-400/80"
                style={{ animationDuration: '16s' }}
              />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-xl shadow-cyan-500/25">
                <Briefcase size={26} />
              </div>
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping" />
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
              سوق المشاريع في انتظار نشر أول فرصة برمجية
            </h3>

            <p className="mx-auto mt-2.5 max-w-xl text-xs leading-relaxed text-slate-600 dark:text-slate-300 sm:text-sm">
              المجال مفتوح الآن لأصحاب الشركات والمؤسسات لنشر متطلبات مشاريعهم الرقمية واستقطاب نخبة المبرمجين العرب المعتمدين وفق معايير FQS والضمان المالي الكامل (Escrow).
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/post-project"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-teal-500/20 transition hover:opacity-95 active:scale-95"
              >
                <Plus size={16} />
                <span>انشر مشروعك البرمجي الآن (0% عمولة)</span>
              </Link>

              <Link
                href="/developers"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-xs font-black text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
              >
                <Users size={16} className="text-cyan-500" />
                <span>تصفح المطورين الجاهزين للعمل</span>
              </Link>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* Engineering Guarantees in FuTech Marketplace            */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-cyan-50/20 p-8 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#091524] dark:to-[#081a28]">
            <div className="text-center">
              <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                ضمانات العمل والتعاقد في منصة فوتيك
              </span>
              <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                بيئة برمجية آمنة ومحصنة لطرفي التعاقد
              </h3>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Lock size={18} />
                </div>
                <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
                  محفظة الضمان الذكية (Escrow)
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  أموال المشروع مجمدة في محفظة ضمان آمنة ولا تُصرف إلا بعد اعتماد العميل الصريح لكود كل مرحلة.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
                  اتفاقية عدم الإفصاح (Auto-NDA)
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  حماية رقمية وقانونية لسرية الأفكار والبيانات تمنع تسريب الشفرة أو إعادة بيعها لأي جهة.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
                  <GitBranch size={18} />
                </div>
                <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
                  نقل ملكية Git للعميل 100%
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  تسليم كامل للمستودع، ملفات التوثيق، وDockerfile لحساب العميل دون أي قفل للمصدر (Vendor Lock-in).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <Clock size={18} />
                </div>
                <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
                  ضمان صيانة مجاني 30 يوماً
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  فترة دعم فني إلزامي تبدأ بعد استلام الكود لمعالجة أي أخطاء أو ثغرات دون أي تكلفة إضافية.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
