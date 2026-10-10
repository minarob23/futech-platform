import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CodeXml, Plus, Users, BriefcaseBusiness, Activity, MessageCircle,
  BookOpen, Bell, Menu, X, ArrowLeft, ArrowUpRight, BadgeCheck,
  CheckCircle2, Search, CircleUserRound, CalendarDays, MoreHorizontal,
  Send, Layers, ShieldCheck, DollarSign, LogOut, ExternalLink, Check
} from 'lucide-react';
import {
  Store, Project, Developer, Application, Conversation, Ticket, Doc, Delivery, MessageItem,
  INITIAL_DEVELOPERS, INITIAL_PROJECTS, INITIAL_TICKETS, INITIAL_DOCS, INITIAL_DELIVERIES, INITIAL_CONVERSATIONS
} from './data/mockData';
import { HomePage } from './pages/HomePage';
import { DevelopersPage } from './pages/DevelopersPage';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { SupportPage } from './pages/SupportPage';
import { DocsPage } from './pages/DocsPage';
import { Footer } from './components/Footer';
import { FloatingControls } from './components/FloatingControls';

const STORAGE_KEY = 'futech_platform_v4';

function loadInitialStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        developers: INITIAL_DEVELOPERS,
        projects: INITIAL_PROJECTS,
        applications: [
          {
            id: 'app-1',
            projectId: 'p-102',
            developerName: 'مروان صالح',
            plan: 'سأقوم بتحليل الحزم البرمجية وضغط الأصول عبر تقرير أداء تفصيلي.',
            status: 'قيد المراجعة',
            submittedAt: 'أمس',
          },
        ],
        conversations: INITIAL_CONVERSATIONS,
        tickets: INITIAL_TICKETS,
        docs: INITIAL_DOCS,
        deliveries: INITIAL_DELIVERIES,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      developers: Array.isArray(parsed.developers) && parsed.developers.length ? parsed.developers : INITIAL_DEVELOPERS,
      projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_PROJECTS,
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : INITIAL_CONVERSATIONS,
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : INITIAL_TICKETS,
      docs: Array.isArray(parsed.docs) ? parsed.docs : INITIAL_DOCS,
      deliveries: Array.isArray(parsed.deliveries) ? parsed.deliveries : INITIAL_DELIVERIES,
    };
  } catch {
    return {
      developers: INITIAL_DEVELOPERS,
      projects: INITIAL_PROJECTS,
      applications: [],
      conversations: INITIAL_CONVERSATIONS,
      tickets: INITIAL_TICKETS,
      docs: INITIAL_DOCS,
      deliveries: INITIAL_DELIVERIES,
    };
  }
}

export default function App() {
  const [location, setLocation] = useLocation();
  const [store, setStore] = useState<Store>(loadInitialStore);
  const [toast, setToast] = useState('');
  const [devMobileOpen, setDevMobileOpen] = useState(false);
  const [publicMobileOpen, setPublicMobileOpen] = useState(false);
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.dir = 'rtl';
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {}
  }, [store]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (msg: string) => setToast(msg);
  const update = (key: keyof Store, value: any) =>
    setStore((prev) => ({
      ...prev,
      [key]: typeof value === 'function' ? value(prev[key]) : value,
    }));

  const path = location.split('?')[0];
  const validRoutes = [
    '/',
    '/developers',
    '/projects',
    '/post-project',
    '/dashboard',
    '/chat',
    '/docs',
    '/support',
  ];
  const route = validRoutes.includes(path) ? path : '/';

  // Check if current route is part of the dedicated Developer Portal
  const isDeveloperPortal = route === '/dashboard' || route === '/chat';

  // 1. Home / Landing Page
  if (route === '/') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <HomePage store={store} go={setLocation} notify={notify} />
          {toast && <ToastMessage message={toast} />}
        </motion.div>
      </AnimatePresence>
    );
  }

  // 2. Dedicated Developer Portal (/dashboard, /chat)
  if (isDeveloperPortal) {
    const devNavItems = [
      { href: '/dashboard', label: 'لوحة التحكم والتقارير', icon: Activity },
      { href: '/chat', label: 'المحادثات المباشرة', icon: MessageCircle },
      { href: '/docs', label: 'مركز التوثيق والدعم', icon: BookOpen },
    ];

    return (
      <div className="min-h-screen bg-[#f4f7fa] text-slate-800" dir="rtl">
        {/* Developer Dedicated Sidebar */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 flex w-64 flex-col bg-[#14263b] text-slate-100 transition-transform duration-300 md:translate-x-0 ${
            devMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-[#25979f] to-[#39c4cc] text-[#0b2130] font-black">
                DEV
              </span>
              <div>
                <div className="text-sm font-black text-white">مساحة عمل المطور</div>
                <div className="text-[10px] text-[#55cfd6]">بوابة المطورين المعتمدين</div>
              </div>
            </div>
            <button
              onClick={() => setDevMobileOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Developer Profile Card in Sidebar */}
          <div className="p-4">
            <div className="rounded-2xl border border-white/10 bg-[#1d3550] p-3.5">
              <div className="flex items-center gap-3">
                <img
                  src="/images/dev-male.jpg"
                  alt="عمر المطيري"
                  className="h-11 w-11 rounded-xl object-cover ring-2 ring-[#39c4cc]/40"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs font-black text-white">عمر المطيري</span>
                    <BadgeCheck size={14} className="text-[#39c4cc]" />
                  </div>
                  <div className="text-[10px] text-slate-300">مطور Full-Stack</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-[#4cd3d9]">
                    <ShieldCheck size={12} />
                    <span>FQS: 92/100 (خبير)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Navigation Links */}
          <div className="flex-1 space-y-1.5 overflow-y-auto px-4 py-2">
            <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              أدوات المطور
            </div>
            {devNavItems.map((item) => {
              const Icon = item.icon;
              const active = route === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDevMobileOpen(false)}
                  className={`flex h-11 items-center gap-3 rounded-2xl px-4 text-xs font-extrabold transition ${
                    active
                      ? 'bg-[#223d5d] text-white shadow-xs'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-[#39c4cc]' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Exit to Main Public Platform Button */}
          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              onClick={() => setDevMobileOpen(false)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-extrabold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={15} className="text-[#39c4cc]" />
                <span>العودة للمنصة الرئيسية</span>
              </span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {devMobileOpen && (
          <div
            onClick={() => setDevMobileOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Developer Portal Content Area */}
        <main className="min-h-screen md:mr-64">
          {/* Header Bar */}
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDevMobileOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-base font-black text-[#152a3f]">لوحة تحكم المطور</h1>
                <p className="hidden text-xs text-slate-400 sm:block">
                  مساحتك الهندسية الخاصة لمتابعة المشاريع والأرباح ومؤشر الجودة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <BriefcaseBusiness size={14} className="text-[#208f97]" />
                <span>تصفح سوق المشاريع</span>
              </Link>

              <button
                onClick={() => notify('لا توجد إشعارات جديدة حالياً')}
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800"
              >
                <Bell size={17} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#27a8b1]" />
              </button>
            </div>
          </header>

          {/* Developer Portal Content */}
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={route}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {route === '/dashboard' && (
                  <DeveloperDashboard
                    store={store}
                    update={update}
                    notify={notify}
                    go={setLocation}
                  />
                )}
                {route === '/chat' && (
                  <ChatPage
                    store={store}
                    update={update}
                    notify={notify}
                    requestedId={new URLSearchParams(location.split('?')[1] || '').get('conversation')}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {toast && <ToastMessage message={toast} />}
      </div>
    );
  }

  // 3. Public Platform Pages (/developers, /projects, /post-project, /docs)
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1a2d42]" dir="rtl">
      {/* Unified Public Top Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/futech-logo.jpg"
              alt="شعار فوتيك FuTech"
              className="h-11 w-11 rounded-2xl object-cover shadow-md shadow-[#162a42]/20 ring-2 ring-[#2798a0]/30"
            />
            <span>
              <span className="block text-xl font-black tracking-tight text-[#162a42]">
                فوتيك <span className="text-xs font-bold text-[#2798a0]">FuTech</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400">
                منصة البرمجيات والمشاريع التقنية
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/"
              className={`text-xs font-extrabold transition ${
                route === '/' ? 'text-[#279ba4]' : 'text-slate-600 hover:text-[#279ba4]'
              }`}
            >
              الرئيسية
            </Link>
            <Link
              href="/developers"
              className={`text-xs font-extrabold transition ${
                route === '/developers' ? 'text-[#279ba4]' : 'text-slate-600 hover:text-[#279ba4]'
              }`}
            >
              البحث عن المطورين
            </Link>
            <Link
              href="/projects"
              className={`text-xs font-extrabold transition ${
                route === '/projects' ? 'text-[#279ba4]' : 'text-slate-600 hover:text-[#279ba4]'
              }`}
            >
              سوق المشاريع
            </Link>
            <Link
              href="/post-project"
              className={`text-xs font-extrabold transition ${
                route === '/post-project' ? 'text-[#279ba4]' : 'text-slate-600 hover:text-[#279ba4]'
              }`}
            >
              نشر مشروع جديد
            </Link>
            <Link
              href="/docs"
              className={`text-xs font-extrabold transition ${
                route === '/docs' ? 'text-[#279ba4]' : 'text-slate-600 hover:text-[#279ba4]'
              }`}
            >
              مركز المعرفة
            </Link>
            <Link
              href="/support"
              className={`text-xs font-extrabold transition ${
                route === '/support' ? 'text-[#279ba4]' : 'text-slate-600 hover:text-[#279ba4]'
              }`}
            >
              الدعم الفني والاقتراحات
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl border border-[#2798a0]/30 bg-[#edf8f9] px-4 py-2.5 text-xs font-black text-[#196b72] shadow-xs transition hover:border-[#2798a0] hover:bg-[#e4f6f7]"
            >
              <Activity size={15} className="text-[#2798a0]" />
              <span>لوحة تحكم المطور</span>
              <ArrowLeft size={13} className="transition group-hover:-translate-x-0.5" />
            </Link>

            <Link
              href="/post-project"
              className="hidden items-center gap-1.5 rounded-2xl bg-[#203d62] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-[#203d62]/20 transition hover:bg-[#2b507d] active:scale-95 sm:inline-flex"
            >
              <Plus size={16} />
              <span>انشر مشروعًا</span>
            </Link>

            <button
              onClick={() => setPublicMobileOpen(!publicMobileOpen)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
            >
              {publicMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {publicMobileOpen && (
          <div className="border-t border-slate-100 bg-white p-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setPublicMobileOpen(false)}
                className="rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                الرئيسية
              </Link>
              <Link
                href="/developers"
                onClick={() => setPublicMobileOpen(false)}
                className="rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                البحث عن المطورين
              </Link>
              <Link
                href="/projects"
                onClick={() => setPublicMobileOpen(false)}
                className="rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                سوق المشاريع
              </Link>
              <Link
                href="/post-project"
                onClick={() => setPublicMobileOpen(false)}
                className="rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                نشر مشروع جديد
              </Link>
              <Link
                href="/docs"
                onClick={() => setPublicMobileOpen(false)}
                className="rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                مركز المعرفة
              </Link>
              <Link
                href="/support"
                onClick={() => setPublicMobileOpen(false)}
                className="rounded-xl p-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                الدعم الفني والاقتراحات
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setPublicMobileOpen(false)}
                className="rounded-xl bg-[#edf8f9] p-2.5 text-xs font-black text-[#1e838b]"
              >
                الدخول للوحة المطور
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Public Content Layout (Full Width) */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {route === '/developers' && (
              <DevelopersPage store={store} update={update} notify={notify} go={setLocation} />
            )}
            {route === '/projects' && (
              <ProjectsPage
                store={store}
                update={update}
                notify={notify}
                setModal={setModal}
                go={setLocation}
              />
            )}
            {route === '/post-project' && (
              <PostProjectPage store={store} update={update} notify={notify} go={setLocation} />
            )}
            {route === '/docs' && <DocsPage store={store} notify={notify} />}
            {route === '/support' && (
              <SupportPage store={store} update={update} notify={notify} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Public Footer */}
      <Footer onNotify={notify} />

      {/* Floating Controls for Public Pages */}
      <FloatingControls isHome={false} />

      {toast && <ToastMessage message={toast} />}

      {/* Modal */}
      {modal && (
        <ProjectModal
          modal={modal}
          close={() => setModal(null)}
          store={store}
          update={update}
          notify={notify}
        />
      )}
    </div>
  );
}

// Toast Component
function ToastMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-[#162c44] px-5 py-3 text-xs font-bold text-white shadow-2xl"
    >
      <CheckCircle2 size={16} className="text-[#3ec4cb]" />
      <span>{message}</span>
    </motion.div>
  );
}

// Projects Marketplace Page Component
function ProjectsPage({ store, update, notify, setModal, go }: any) {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const allSkills = useMemo<string[]>(
    () => ['all', ...Array.from(new Set<string>(store.projects.flatMap((p: Project) => p.stack)))],
    [store.projects]
  );

  const filteredProjects = store.projects.filter((p: Project) => {
    const matchesSearch =
      !search ||
      p.title.includes(search) ||
      p.description.includes(search) ||
      p.owner.includes(search);
    const matchesSkill = skillFilter === 'all' || p.stack.includes(skillFilter);
    const matchesDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesSkill && matchesDiff;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#152a40]">سوق المشاريع البرمجية</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            تصفح المشاريع المحددة النطاق وقدم خطة عملك البرمجية مباشرة
          </p>
        </div>

        <Link
          href="/post-project"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#2b5182]"
        >
          <Plus size={16} />
          <span>انشر مشروعًا جديدًا</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن مشروع أو تقنية..."
            className="w-full rounded-xl border border-slate-200 pe-4 ps-10 py-2.5 text-xs outline-none focus:border-[#2ba6ae]"
          />
        </div>

        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none"
        >
          <option value="all">كل التقنيات</option>
          {allSkills.filter((s) => s !== 'all').map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none"
        >
          <option value="all">كل المستويات</option>
          <option value="مبتدئ">مبتدئ</option>
          <option value="متوسط">متوسط</option>
          <option value="متقدم">متقدم</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {filteredProjects.map((p: Project) => {
          const applied = store.applications.some((a: Application) => a.projectId === p.id);
          return (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:border-[#5ec5cb]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-[#eaf6f6] px-2.5 py-1 text-[10px] font-extrabold text-[#1f878f]">
                    {p.difficulty}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    التسليم: {p.deadline}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-black text-[#152c42]">{p.title}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <CircleUserRound size={13} />
                  <span>{p.owner}</span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">{p.description}</p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Milestones list */}
                <div className="mt-4 rounded-2xl bg-[#f8fafc] p-3 text-xs">
                  <div className="mb-2 font-black text-slate-700">مراحل التسليم المقترحة:</div>
                  <div className="space-y-1.5 text-[11px] text-slate-500">
                    {p.milestones.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-[#daf2f3] text-[9px] font-black text-[#1d828a]">
                          {idx + 1}
                        </span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <div className="text-[10px] text-slate-400">الميزانية المرصودة</div>
                  <div className="text-base font-black text-[#183452]">
                    {p.budget.toLocaleString('ar-EG')} ر.س
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setModal({ type: 'projectDetail', data: p })}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    التفاصيل
                  </button>
                  <button
                    disabled={applied}
                    onClick={() => setModal({ type: 'apply', data: p })}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      applied
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#203d62] text-white hover:bg-[#2b5182]'
                    }`}
                  >
                    {applied ? 'تم التقديم' : 'قدّم بخطة عمل'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Post Project Page Component
function PostProjectPage({ store, update, notify, go }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('');
  const [milestones, setMilestones] = useState([
    'تحديد النطاق وهيكلة قواعد البيانات',
    'بناء الواجهات وتكامل واجهات API',
    'فحص الاختبارات وتسليم التوثيق النهائي',
  ]);
  const [deadline, setDeadline] = useState('2025-07-20');
  const [budget, setBudget] = useState(5500);
  const [difficulty, setDifficulty] = useState<'مبتدئ' | 'متوسط' | 'متقدم'>('متوسط');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || description.trim().length < 20) {
      notify('يرجى ملء جميع الحقول المطلوبة وكتابة وصف واضح من 20 حرفًا على الأقل');
      return;
    }

    const newProject: Project = {
      id: 'p-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      description: description.trim(),
      stack: stack.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
      difficulty,
      budget: Number(budget),
      deadline,
      milestones: milestones.filter((m) => m.trim().length > 0),
      owner: 'صاحب مشروع (أنت)',
      status: 'متاح',
      requiredFqs: 82,
    };

    update('projects', [newProject, ...store.projects]);
    notify('تم نشر مشروعك بنجاح في سوق المشاريع');
    go('/projects');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#152a40]">نشر مشروع برمجي جديد</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          حوّل فكرتك إلى مراحل واضحة المعالم لجذب أفضل المطورين المعتمدين
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs md:p-8">
        <div>
          <label className="block text-xs font-bold text-slate-700">عنوان المشروع *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تطوير لوحة متابعة الطلبات والمخزون"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#2ba6ae]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700">النطاق والمتطلبات بالتفصيل *</label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ما المطلوب تنفيذه بالتحديد؟ ما هي السيناريوهات والشاشات الرئيسية؟ اذكر القيود التقنية..."
            className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs leading-relaxed outline-none focus:border-[#2ba6ae]"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-700">التقنيات المطلوبة (مفصولة بفاصلة)</label>
            <input
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#2ba6ae]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">مستوى الصعوبة</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none"
            >
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-700">الميزانية المرصودة (ر.س) *</label>
            <input
              type="number"
              min={100}
              required
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#2ba6ae]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">الموعد النهائي للتسليم *</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#2ba6ae]"
            />
          </div>
        </div>

        {/* Milestones list */}
        <div>
          <label className="block text-xs font-bold text-slate-700">مراحل التسليم المقترحة</label>
          <div className="mt-2 space-y-2">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-600">
                  {i + 1}
                </span>
                <input
                  value={m}
                  onChange={(e) =>
                    setMilestones(milestones.map((item, idx) => (idx === i ? e.target.value : item)))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#2ba6ae]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => go('/projects')}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#203d62] px-6 py-2.5 text-xs font-black text-white hover:bg-[#2c5383]"
          >
            نشر المشروع في السوق
          </button>
        </div>
      </form>
    </div>
  );
}

// Chat Page Component (inside Developer Portal)
function ChatPage({ store, update, notify, requestedId }: any) {
  const [selectedId, setSelectedId] = useState<string>(
    requestedId || store.conversations[0]?.id || ''
  );
  const [message, setMessage] = useState('');

  const conv = store.conversations.find((c: Conversation) => c.id === selectedId);

  const handleSend = () => {
    if (!message.trim() || !conv) return;
    const newMsg: MessageItem = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      body: message.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
      read: true,
    };

    update(
      'conversations',
      store.conversations.map((c: Conversation) =>
        c.id === conv.id ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );
    setMessage('');

    setTimeout(() => {
      const replyMsg: MessageItem = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        body: 'أهلاً بك! تم استلام رسالتك وسأراجع التفاصيل معك فوراً للاتفاق على خطة العمل.',
        sender: 'other',
        time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
        read: true,
      };
      update(
        'conversations',
        store.conversations.map((c: Conversation) =>
          c.id === conv.id ? { ...c, messages: [...c.messages, replyMsg] } : c
        )
      );
    }, 1500);
  };

  return (
    <div className="grid min-h-[600px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs md:grid-cols-12">
      {/* Conversations List */}
      <div className="border-l border-slate-200 md:col-span-4">
        <div className="border-b border-slate-100 p-4">
          <h3 className="text-sm font-black text-[#152a40]">المحادثات المفتوحة</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {store.conversations.map((c: Conversation) => (
            <div
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex cursor-pointer items-center gap-3 p-4 transition ${
                c.id === selectedId ? 'bg-[#edf7f7]' : 'hover:bg-slate-50'
              }`}
            >
              <img
                src={c.otherUserAvatar || '/images/dev-male.jpg'}
                alt={c.otherUser}
                className="h-11 w-11 rounded-xl object-cover ring-2 ring-slate-100"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#152a40]">{c.otherUser}</h4>
                  <span className="text-[10px] text-slate-400">
                    {c.messages.at(-1)?.time || ''}
                  </span>
                </div>
                <p className="mt-1 truncate text-[11px] text-slate-500">
                  {c.messages.at(-1)?.body || 'بدء المحادثة'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Chat View */}
      <div className="flex flex-col md:col-span-8">
        {conv ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={conv.otherUserAvatar || '/images/dev-male.jpg'}
                  alt={conv.otherUser}
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs font-black text-[#152a40]">{conv.otherUser}</h4>
                  <span className="text-[10px] font-bold text-[#34b476]">متصل الآن</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#fafbfc] p-6 text-xs">
              {conv.messages.map((m: MessageItem) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'me' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                      m.sender === 'me'
                        ? 'rounded-tl-xs bg-[#203d62] text-white'
                        : 'rounded-tr-xs border border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    <div>{m.body}</div>
                    <div
                      className={`mt-1 text-left text-[9px] ${
                        m.sender === 'me' ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 border-t border-slate-100 p-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-[#2ba6ae]"
              />
              <button
                onClick={handleSend}
                className="inline-flex items-center gap-1 rounded-xl bg-[#203d62] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#2b5182]"
              >
                <Send size={15} />
                <span>إرسال</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-xs text-slate-400">
            اختر محادثة من القائمة
          </div>
        )}
      </div>
    </div>
  );
}


// Global Project / Application Modal
function ProjectModal({ modal, close, store, update, notify }: any) {
  const { type, data } = modal;
  const [plan, setPlan] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan.trim() || plan.trim().length < 15) {
      notify('يرجى كتابة خطة عمل واضحة من 15 حرفًا على الأقل');
      return;
    }

    const newApp: Application = {
      id: 'app-' + Math.random().toString(36).substring(2, 9),
      projectId: data.id,
      developerName: 'عمر المطيري',
      plan: plan.trim(),
      status: 'قيد المراجعة',
      submittedAt: 'الآن',
    };

    update('applications', [newApp, ...store.applications]);
    notify('تم إرسال خطة التقديم إلى صاحب المشروع بنجاح');
    close();
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-[#152a40]">
            {type === 'apply' ? 'تقديم عرض وخطة عمل' : data?.title}
          </h3>
          <button onClick={close} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={17} />
          </button>
        </div>

        {type === 'apply' ? (
          <form onSubmit={handleApply} className="mt-4 space-y-4 text-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-500">المشروع المطلوب:</div>
              <div className="text-sm font-black text-[#172e47]">{data?.title}</div>
            </div>

            <div>
              <label className="block font-bold text-slate-700">خطة العمل والتنفيذ المقترحة *</label>
              <textarea
                required
                rows={5}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="وضح كيف ستبدأ بالمشروع، وما هي المخرجات التي ستسلمها في كل مرحلة..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 leading-relaxed outline-none focus:border-[#2ea5ad]"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={close}
                className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#203d62] px-5 py-2 font-black text-white hover:bg-[#2b5182]"
              >
                إرسال الخطة
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4 text-xs text-slate-600">
            <p className="leading-relaxed">{data?.description}</p>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="font-black text-slate-800">مراحل التسليم:</div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
                {data?.milestones?.map((m: string, idx: number) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={close}
                className="rounded-xl bg-[#203d62] px-5 py-2 font-bold text-white"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
