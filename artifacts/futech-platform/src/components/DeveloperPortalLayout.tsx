import { useState } from 'react';
import { Link } from 'wouter';
import {
  Activity, Building2, BriefcaseBusiness, CheckCircle, FileCode2,
  Layers, FileText, Wallet, Settings, MessageCircle, BookOpen,
  Compass, X, BadgeCheck, ShieldCheck, ArrowLeft, ExternalLink, Menu, Bell
} from 'lucide-react';
import { Store } from '../types';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from './ThemeToggle';
import { isOwnerEmail } from '../lib/ownerAuth';

interface DeveloperPortalLayoutProps {
  store: Store;
  route: string;
  searchStr: string;
  notify: (msg: string) => void;
  children: React.ReactNode;
}

export function DeveloperPortalLayout({
  store,
  route,
  searchStr,
  notify,
  children,
}: DeveloperPortalLayoutProps) {
  const [devMobileOpen, setDevMobileOpen] = useState(false);
  const isOwnerUser = Boolean(store.currentUser?.email && isOwnerEmail(store.currentUser.email));
  const activeDevTab = route === '/dashboard' ? (new URLSearchParams(searchStr).get('tab') || 'overview') : null;

  const devSuiteItems = [
    { tab: 'overview', href: '/dashboard?tab=overview', label: 'نظرة عامة والتقارير', icon: Activity },
    { tab: 'clients', href: '/dashboard?tab=clients', label: 'دليل العملاء والشركات', icon: Building2, badge: 'مشاريع حية' },
    { tab: 'projects', href: '/dashboard?tab=projects', label: 'المشاريع والمراحل', icon: BriefcaseBusiness },
    { tab: 'deliveries', href: '/dashboard?tab=deliveries', label: 'سجل التسليم وفحص Git', icon: CheckCircle },
    { tab: 'proposals', href: '/dashboard?tab=proposals', label: 'خطط التقديم والعروض', icon: FileCode2, count: store.applications.length },
    { tab: 'portfolio', href: '/dashboard?tab=portfolio', label: 'معرض الأعمال', icon: Layers, badge: 'جديد' },
    { tab: 'cv', href: '/dashboard?tab=cv', label: 'السيرة الذاتية (CV)', icon: FileText },
    {
      tab: 'wallet',
      href: '/dashboard?tab=wallet',
      label: 'المحفظة والضمان المشفر',
      icon: Wallet,
      badge: `${(store.developerWallet?.totalBalance || 0).toLocaleString()} ${store.developerWallet?.currency || 'ج.م'}`
    },
    { tab: 'settings', href: '/dashboard?tab=settings', label: 'إعدادات الملف والصورة', icon: Settings },
  ];

  const devSupportItems = [
    { href: '/chat', label: 'المحادثات المباشرة', icon: MessageCircle },
    { href: '/docs', label: 'مركز التوثيق وميثاق FQS', icon: BookOpen },
    { href: '/projects', label: 'سوق المشاريع المفتوحة', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 dark:bg-[#070c16] dark:text-slate-100" dir="rtl">
      {/* Developer Dedicated Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-72 max-w-[85vw] flex-col bg-[#14263b] text-slate-100 transition-transform duration-300 md:translate-x-0 ${
          devMobileOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/" className="group flex items-center gap-3 transition">
            <img
              src="/images/futech-logo.jpg"
              alt="شعار فوتيك FuTech"
              className="h-10 w-10 rounded-xl object-cover shadow-md ring-2 ring-[#2db1ba]/40 transition group-hover:scale-105"
            />
            <div>
              <div className="text-sm font-black text-white group-hover:text-[#55cfd6] transition">مساحة عمل المطور</div>
              <div className="text-[10px] font-bold text-[#55cfd6]">بوابة المطورين المعتمدين</div>
            </div>
          </Link>
          <button
            onClick={() => setDevMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Developer Profile Card in Sidebar */}
        <div className="p-4">
          <div className="rounded-2xl border border-white/10 bg-[#1d3550] p-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <UserAvatar
                src={store.currentUser?.avatar}
                name={store.currentUser?.name || 'مهندس برمجيات'}
                size="md"
                shape="rounded"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs font-black text-white" title={store.currentUser?.name || 'مهندس برمجيات'}>
                    {store.currentUser?.name || 'مهندس برمجيات'}
                  </span>
                  <BadgeCheck size={14} className="text-[#39c4cc] shrink-0" />
                </div>
                <div className="truncate text-[10px] text-slate-300 mt-0.5" title={store.currentUser?.title || 'مهندس برمجيات معتمد'}>
                  {store.currentUser?.title || 'مهندس برمجيات معتمد'}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-[#4cd3d9]">
                  <ShieldCheck size={12} className="shrink-0" />
                  <span>{isOwnerUser ? 'المالك ومطور معتمد 👑' : 'مطور معتمد FQS'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Navigation Links */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
          <div>
            <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              أدوات وقوائم المطور
            </div>
            <div className="space-y-1">
              {devSuiteItems.map((item) => {
                const Icon = item.icon;
                const active = route === '/dashboard' && activeDevTab === item.tab;
                return (
                  <Link
                    key={item.tab}
                    href={item.href}
                    onClick={() => {
                      setDevMobileOpen(false);
                      window.dispatchEvent(new Event('popstate'));
                    }}
                    className={`flex h-10 items-center justify-between rounded-xl px-3 text-xs font-extrabold transition ${
                      active
                        ? 'bg-gradient-to-r from-[#203d62] to-[#1c646b] text-white shadow-xs border-r-4 border-r-[#39c4cc]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className={active ? 'text-[#39c4cc]' : 'text-slate-400'} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="shrink-0 rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-black text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                    {typeof item.count === 'number' && (
                      <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] font-black text-slate-300">
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              التواصل والدعم الفني
            </div>
            <div className="space-y-1">
              {devSupportItems.map((item) => {
                const Icon = item.icon;
                const active = route === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDevMobileOpen(false)}
                    className={`flex h-10 items-center justify-between rounded-xl px-3 text-xs font-extrabold transition ${
                      active
                        ? 'bg-[#223d5d] text-white shadow-xs border-r-4 border-r-[#39c4cc]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={active ? 'text-[#39c4cc]' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    <ArrowLeft size={12} className="text-slate-500" />
                  </Link>
                );
              })}
            </div>
          </div>
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
      <main className="min-h-screen md:mr-72">
        {/* Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur-xl md:px-8 dark:border-white/[0.08] dark:bg-[#070d18]/85">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setDevMobileOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden dark:border-white/10 dark:text-slate-300"
            >
              <Menu size={20} />
            </button>
            <Link href="/" className="flex items-center md:hidden">
              <img
                src="/images/futech-logo.jpg"
                alt="شعار فوتيك"
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-[#2db1ba]/40"
              />
            </Link>
            <div>
              <h1 className="text-base font-black text-[#152a3f] dark:text-white">لوحة تحكم المطور</h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                مساحتك الهندسية الخاصة لمتابعة المشاريع والأرباح ومؤشر الجودة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <BriefcaseBusiness size={14} className="text-[#208f97] dark:text-teal-400" />
              <span>تصفح سوق المشاريع</span>
            </Link>

            <button
              onClick={() => notify('لا توجد إشعارات جديدة حالياً')}
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Bell size={17} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#27a8b1]" />
            </button>

            <ThemeToggle variant="minimal" />
          </div>
        </header>

        {/* Page children */}
        {children}
      </main>
    </div>
  );
}
