import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  ChevronDown,
  Activity,
  Menu,
  X,
  ArrowLeft,
  LogOut,
  Building2,
  Code2,
  ShieldCheck,
  Crown,
  Briefcase,
  BriefcaseBusiness,
  Layers,
  HelpCircle,
  BookOpen,
  MoreHorizontal,
  Wallet,
  LogIn,
  UserPlus,
  Bell,
  BellRing,
  Lock,
  GitFork,
  Ticket,
  MessageSquare,
  Inbox,
  Check,
  CheckCheck,
  Trash2,
  Scale,
} from 'lucide-react';
import { User, UserRole, Store, AppNotification } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../lib/AuthContext';
import { UserAvatar } from './UserAvatar';
import { isOwnerIdentity, isOwnerEmail } from '../lib/ownerAuth';
import {
  getRealNotifications,
  saveReadNotificationId,
  saveAllReadNotificationIds,
  saveDismissedNotificationId,
  saveAllDismissedNotificationIds,
} from '../lib/notifications';
import {
  isPushSupported,
  getPushPermissionStatus,
  requestPushPermission,
} from '../lib/webPushNotifications';

interface UnifiedNavbarProps {
  currentUser?: User;
  store?: Store;
  update?: (key: keyof Store, value: any) => void;
  go?: (path: string) => void;
  onOpenAuth?: (role?: 'developer' | 'client', mode?: 'login' | 'register', portal?: 'members' | 'admin' | 'owner') => void;
  onSwitchUser?: (user: User) => void;
  onLogout?: () => void;
  notify?: (msg: string) => void;
}

export function UnifiedNavbar({
  currentUser,
  store,
  update,
  go,
  onOpenAuth,
  onSwitchUser,
  onLogout,
  notify,
}: UnifiedNavbarProps) {
  const auth = useAuth();
  const [location, setLocation] = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [forceTick, setForceTick] = useState(0);

  const route = location.split('?')[0];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute 100% real, dynamic notifications from actual store and user entities
  const realNotifications = useMemo(() => {
    if (!store) return [];
    return getRealNotifications(store, currentUser);
  }, [store, currentUser, forceTick]);

  const unreadCount = useMemo(() => {
    return realNotifications.filter((n: AppNotification) => !n.isRead).length;
  }, [realNotifications]);

  const handleMarkAllAsRead = () => {
    const ids = realNotifications.map((n: AppNotification) => n.id);
    saveAllReadNotificationIds(ids);
    setForceTick((t) => t + 1);
    notify?.('تم تحديد كافة الإشعارات كمقروءة ✓');
  };

  const handleMarkSingleAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    saveReadNotificationId(id);
    setForceTick((t) => t + 1);
    notify?.('تم تحديد الإشعار كمقروء ✓');
  };

  const handleDeleteSingleNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    saveDismissedNotificationId(id);
    if (update && store?.notifications) {
      update('notifications', store.notifications.filter((n) => n.id !== id));
    }
    setForceTick((t) => t + 1);
    notify?.('تم حذف الإشعار بنجاح');
  };

  const handleDeleteAllNotifications = () => {
    const ids = realNotifications.map((n: AppNotification) => n.id);
    saveAllDismissedNotificationIds(ids);
    if (update) {
      update('notifications', []);
    }
    setForceTick((t) => t + 1);
    notify?.('تم حذف جميع الإشعارات بنجاح 🗑️');
  };

  const handleNotificationClick = (n: AppNotification) => {
    saveReadNotificationId(n.id);
    setForceTick((t) => t + 1);
    setNotificationsOpen(false);

    if (currentUser?.role === 'developer') {
      if (n.linkTab === 'chat') {
        if (go) go('/chat');
        else setLocation('/chat');
      } else {
        if (go) go('/dashboard');
        else setLocation('/dashboard');
      }
    } else {
      const tab = n.linkTab || 'proposals';
      const targetUrl = `/client-dashboard?tab=${tab}`;
      if (go) go(targetUrl);
      else setLocation(targetUrl);
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'escrow':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <Lock size={15} />
          </div>
        );
      case 'delivery':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
            <GitFork size={15} />
          </div>
        );
      case 'proposal':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Briefcase size={15} />
          </div>
        );
      case 'ticket':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <Ticket size={15} />
          </div>
        );
      case 'chat':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <MessageSquare size={15} />
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-500/10 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <Bell size={15} />
          </div>
        );
    }
  };

  interface NavLink {
    href: string;
    label: string;
    badge?: string;
    highlight?: boolean;
  }

  const navLinks: NavLink[] = [
    { href: '/', label: 'الرئيسية' },
    {
      href: '/suggestions',
      label: 'مقترحات\u00A0تطوير\u00A0المنصة',
      badge: 'جديد\u00A0💡',
      highlight: true,
    },
    { href: '/developers', label: 'نخبة\u00A0المطورين' },
    { href: '/projects', label: 'سوق\u00A0المشاريع' },
    { href: '/docs', label: 'مركز\u00A0المعرفة' },
    { href: '/support', label: 'الدعم\u00A0الفني' },
  ];

  // Core links for medium laptop screens (1024px - 1279px)
  const primaryLinks = navLinks.slice(0, 4);
  const secondaryLinks = navLinks.slice(4);

  const isOwnerUser = Boolean(isOwnerIdentity(currentUser) || isOwnerEmail(currentUser?.email));

  const getDashboardPath = (role?: UserRole, name?: string) => {
    if (isOwnerUser || role === 'owner') return '/owner-dashboard';
    if (role === 'client') return '/client-dashboard';
    if (role === 'admin') return '/admin';
    return '/dashboard';
  };

  const getRoleLabel = (role?: UserRole, name?: string) => {
    if (isOwnerUser || role === 'owner') return 'مالك المنصة 👑';
    if (role === 'client') return 'صاحب عمل';
    if (role === 'admin') return 'مشرف عام';
    return 'مطور معتمد';
  };

  const getRoleBadgeStyle = (role?: UserRole, name?: string) => {
    if (isOwnerUser || role === 'owner') return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
    if (role === 'client') return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20';
    if (role === 'admin') return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
    return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-xl transition-colors duration-200 dark:border-white/[0.08] dark:bg-[#070d18]/90">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-3 sm:px-6 lg:px-8 xl:px-10">
        
        {/* RIGHT (RTL): Brand Logo & Title (shrink-0 ensures it never squishes) */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          <Link href="/" className="group flex items-center gap-2.5 sm:gap-3 transition">
            <div className="relative shrink-0">
              <picture>
                <source type="image/webp" srcSet="/images/futech-logo.webp" />
                <img
                  src="/images/futech-logo.jpg"
                  alt="شعار فوتيك FuTech"
                  width="40"
                  height="40"
                  decoding="async"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl object-cover shadow-sm ring-2 ring-[#2798a0]/25 transition duration-300 group-hover:scale-105 group-hover:ring-[#2798a0]/60"
                />
              </picture>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#14283d] dark:text-white">
                  فوتيك
                </span>
                <span className="rounded-md bg-gradient-to-l from-[#229ca4] to-[#16385b] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-2xs">
                  FuTech
                </span>
              </div>
              <span className="mt-1 hidden 2xl:block text-[10px] font-bold text-slate-400 dark:text-slate-400 leading-none whitespace-nowrap" style={{ whiteSpace: 'nowrap' }}>
                حاضنة الكفاءات البرمجية العربية
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: Single Unified Sleek Nav Capsule (Never duplicated) */}
        <nav
          className="hidden items-center gap-0.5 2xl:gap-1 rounded-full border border-slate-200/70 bg-slate-100/70 p-1 shadow-2xs backdrop-blur-md lg:flex dark:border-white/[0.08] dark:bg-white/[0.04] shrink-0 whitespace-nowrap"
          style={{ whiteSpace: 'nowrap' }}
        >
          {/* Primary 4 Links (Always visible on all desktop/laptop screens) */}
          {primaryLinks.map((link) => {
            const isActive = route === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ whiteSpace: 'nowrap' }}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1.5 text-xs font-black whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#156e75] shadow-xs dark:bg-[#121f33] dark:text-[#38d9df] dark:shadow-none'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
                }`}
              >
                <span className="whitespace-nowrap inline-block" style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
                {link.badge && (
                  <span
                    style={{ whiteSpace: 'nowrap' }}
                    className="shrink-0 whitespace-nowrap inline-block rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 px-1.5 2xl:px-2 py-0.5 text-[9px] font-black text-[#156e75] ring-1 ring-teal-500/30 dark:from-teal-500/30 dark:to-cyan-500/30 dark:text-teal-300"
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Secondary Links (Docs & Support) - Inline on wide screens (xl+) */}
          <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1 shrink-0 whitespace-nowrap" style={{ whiteSpace: 'nowrap' }}>
            {secondaryLinks.map((sub) => {
              const isActive = route === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  style={{ whiteSpace: 'nowrap' }}
                  className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-2.5 2xl:px-3 py-1.5 text-xs font-black whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#156e75] shadow-xs dark:bg-[#121f33] dark:text-[#38d9df] dark:shadow-none'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
                  }`}
                >
                  <span className="whitespace-nowrap inline-block" style={{ whiteSpace: 'nowrap' }}>{sub.label}</span>
                </Link>
              );
            })}
          </div>

          {/* "المزيد" Dropdown for Docs and Support - Shown on standard laptop screens (< xl) */}
          <div className="xl:hidden relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition ${
                moreMenuOpen
                  ? 'bg-white text-teal-700 shadow-xs dark:bg-[#121f33] dark:text-teal-300'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 dark:text-slate-300'
              }`}
            >
              <span>المزيد</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {moreMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-48 origin-top-left rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl z-50 dark:border-slate-800 dark:bg-[#0c1524]"
                  dir="rtl"
                >
                  {secondaryLinks.map((sub) => {
                    const isActive = route === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMoreMenuOpen(false)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                          isActive
                            ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900'
                        }`}
                      >
                        {sub.href === '/docs' ? <BookOpen size={14} className="text-teal-500" /> : <HelpCircle size={14} className="text-cyan-500" />}
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <Link
                    href="/terms"
                    onClick={() => setMoreMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                      route === '/terms'
                        ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Scale size={14} className="text-emerald-500" />
                    <span>ميثاق الضمان والشروط</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* LEFT (RTL): Actions, User Account, Theme Toggle & Mobile Button (shrink-0 ensures it NEVER cuts off!) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-3.5">
          
          {/* Post Project CTA Button */}
          <Link
            href="/post-project"
            style={{ whiteSpace: 'nowrap' }}
            className="group hidden h-9 shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] px-3.5 sm:px-4 text-xs font-black text-white shadow-sm transition-all duration-200 hover:opacity-95 hover:shadow-md active:scale-95 sm:inline-flex dark:from-teal-600 dark:via-teal-500 dark:to-cyan-500 dark:text-slate-950 dark:shadow-teal-500/15"
          >
            <Plus size={14} className="transition group-hover:rotate-90 duration-200" />
            <span className="whitespace-nowrap">انشر مشروعًا</span>
          </Link>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Notifications Bell in Navbar */}
              <div className="relative shrink-0" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((prev) => !prev);
                    setUserMenuOpen(false);
                  }}
                  className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                    notificationsOpen
                      ? 'border-teal-500 bg-teal-50 text-teal-800 dark:border-teal-400 dark:bg-teal-950/60 dark:text-teal-200 shadow-xs'
                      : 'border-slate-200/80 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0e1726] dark:text-slate-300 dark:hover:border-white/20'
                  }`}
                  title="الإشعارات والتنبيهات المباشرة"
                >
                  <Bell size={16} className={notificationsOpen ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300'} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-xs animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Popover */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full mt-2 w-auto sm:w-96 origin-top-left rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl z-50 dark:border-slate-800 dark:bg-[#0c1524]"
                      dir="rtl"
                    >
                      {/* Header */}
                      <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BellRing size={16} className="text-teal-600 dark:text-teal-400" />
                            <h4 className="text-xs font-black text-[#152a40] dark:text-white">
                              الإشعارات والتنبيهات
                            </h4>
                            {unreadCount > 0 ? (
                              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-black text-rose-600 dark:text-rose-400">
                                {unreadCount} جديد
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                الكل مقروء ✓
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-bold text-slate-400">
                            {realNotifications.length} إشعار
                          </span>
                        </div>

                        {/* Action buttons: "قمت بقراءتها" & "حذف جميع الإشعارات" */}
                        {realNotifications.length > 0 && (
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80 dark:border-slate-800/80">
                            <button
                              type="button"
                              onClick={handleMarkAllAsRead}
                              disabled={unreadCount === 0}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
                                unreadCount > 0
                                  ? 'border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                                  : 'opacity-50 cursor-not-allowed text-slate-400 bg-slate-50 dark:bg-slate-900'
                              }`}
                              title="تحديد كافة التنبيهات كمقروءة"
                            >
                              <CheckCheck size={13} className={unreadCount > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'} />
                              <span>قمت بقراءتها</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleDeleteAllNotifications}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200/80 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300"
                              title="حذف ومسح كافة الإشعارات"
                            >
                              <Trash2 size={13} className="text-rose-600 dark:text-rose-400" />
                              <span>حذف جميع الإشعارات</span>
                            </button>
                          </div>
                        )}
                        {/* Web Push Browser Permission Toggle Banner */}
                        <div className="mt-2.5">
                          {isPushSupported() && getPushPermissionStatus() !== 'granted' ? (
                            <button
                              type="button"
                              onClick={async () => {
                                const ok = await requestPushPermission();
                                if (ok) {
                                  notify?.('تم تفعيل إشعارات المتصفح بنجاح! 🔔');
                                  setForceTick((t) => t + 1);
                                } else {
                                  notify?.('يرجى السماح بالإشعارات من إعدادات المتصفح');
                                }
                              }}
                              className="flex w-full items-center justify-between rounded-xl border border-teal-500/30 bg-teal-500/10 p-2 text-right transition hover:bg-teal-500/20 dark:bg-teal-950/30 dark:hover:bg-teal-950/50"
                            >
                              <div className="flex items-center gap-2">
                                <BellRing size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                <div>
                                  <div className="text-[11px] font-black text-teal-800 dark:text-teal-300">
                                    تفعيل إشعارات المتصفح الفورية
                                  </div>
                                  <div className="text-[9px] text-teal-700/80 dark:text-teal-400/80">
                                    تصلك تنبيهات الشات والعروض خارج الموقع
                                  </div>
                                </div>
                              </div>
                              <span className="shrink-0 rounded-lg bg-teal-600 px-2 py-0.5 text-[10px] font-black text-white shadow-xs">
                                تفعيل 🔔
                              </span>
                            </button>
                          ) : isPushSupported() ? (
                            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                              <span className="flex items-center gap-1.5">
                                <Check size={12} className="stroke-[3] text-emerald-600 dark:text-emerald-400" />
                                <span>إشعارات المتصفح الفورية مفعّلة على هذا الجهاز</span>
                              </span>
                              <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400">ON ✓</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                        {realNotifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400">
                            <Inbox size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                            <p className="font-bold text-slate-600 dark:text-slate-300">لا توجد إشعارات حالياً</p>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              تم حذف كافة الإشعارات أو لا توجد أحداث جديدة. ستصلك تنبيهات فورية عند وصول عروض جديدة أو حركات بالضمان.
                            </p>
                          </div>
                        ) : (
                          realNotifications.map((n: AppNotification) => (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`group relative flex cursor-pointer items-start gap-2.5 rounded-2xl p-2.5 transition ${
                                !n.isRead
                                  ? 'bg-teal-50/60 hover:bg-teal-50 dark:bg-teal-950/20 dark:hover:bg-teal-950/30'
                                  : 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-900/40 dark:hover:bg-slate-900/60'
                              }`}
                            >
                              {/* Icon */}
                              <div className="shrink-0 mt-0.5">
                                {getNotificationIcon(n.type)}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h5 className="truncate text-xs font-black text-slate-800 dark:text-slate-200">
                                    {n.title}
                                  </h5>
                                  <span className="text-[9px] text-slate-400 shrink-0">{n.timestamp}</span>
                                </div>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                                  {n.message}
                                </p>

                                {/* Action buttons on each notification card */}
                                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                                  {!n.isRead ? (
                                    <button
                                      type="button"
                                      onClick={(e) => handleMarkSingleAsRead(n.id, e)}
                                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-teal-700 hover:bg-teal-100/80 dark:text-teal-400 dark:hover:bg-teal-950/50 transition"
                                      title="تحديد هذا الإشعار كمقروء"
                                    >
                                      <Check size={11} className="text-teal-600 dark:text-teal-400" />
                                      <span>قمت بقراءتها</span>
                                    </button>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                      <CheckCheck size={11} className="text-emerald-500" />
                                      <span>مقروء ✓</span>
                                    </span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteSingleNotification(n.id, e)}
                                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                                    title="حذف هذا الإشعار"
                                  >
                                    <Trash2 size={11} />
                                    <span>حذف</span>
                                  </button>
                                </div>
                              </div>

                              {!n.isRead && (
                                <span className="h-2 w-2 rounded-full bg-teal-500 shrink-0 self-start mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800 text-center">
                        <Link
                          href={currentUser.role === 'developer' ? '/dashboard' : '/client-dashboard?tab=proposals'}
                          onClick={() => setNotificationsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 dark:text-teal-400"
                        >
                          <span>عرض لوحة المتابعة الكاملة</span>
                          <ArrowLeft size={12} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{ whiteSpace: 'nowrap' }}
                className="flex h-9 shrink-0 whitespace-nowrap items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-2.5 sm:px-3 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0e1726] dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-[#131f33]"
              >
                <UserAvatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="xs"
                  indicator={true}
                />
                <span className="hidden max-w-[85px] truncate whitespace-nowrap text-xs font-extrabold sm:inline-block md:max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className={`hidden 2xl:inline-block rounded-full border px-2 py-0.5 text-[9px] font-black whitespace-nowrap ${getRoleBadgeStyle(currentUser.role, currentUser.name)}`}>
                  {getRoleLabel(currentUser.role, currentUser.name)}
                </span>
                <ChevronDown
                  size={13}
                  className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                    userMenuOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-72 origin-top-left rounded-3xl border border-slate-100 bg-white p-3 shadow-2xl z-50 dark:border-slate-800 dark:bg-[#0c1524]"
                    dir="rtl"
                  >
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-900/60">
                      <UserAvatar
                        src={currentUser.avatar}
                        name={currentUser.name}
                        size="md"
                        shape="rounded"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate text-xs font-black text-slate-900 dark:text-white">
                            {currentUser.name}
                          </span>
                          {currentUser.currency && (
                            <span className="shrink-0 rounded-md bg-teal-500/15 px-1.5 py-0.5 text-[9px] font-black text-teal-700 dark:text-teal-300">
                              {currentUser.currency}
                            </span>
                          )}
                        </div>
                        <div className="truncate text-[10px] text-slate-400">
                          {currentUser.country ? `${currentUser.country} • ` : ''}{currentUser.email}
                        </div>
                      </div>
                    </div>

                    {/* Go to Dashboard Link */}
                    <div className="mt-2.5 space-y-1.5">
                      {currentUser.role === 'owner' ? (
                        <>
                          <Link
                            href="/owner-dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-500/15 via-teal-500/15 to-cyan-500/15 p-2.5 text-xs font-black text-[#156f76] transition hover:from-amber-500/25 hover:to-cyan-500/25 dark:text-amber-300"
                          >
                            <span className="flex items-center gap-2">
                              <Crown size={15} className="text-amber-500 stroke-[2.5]" />
                              <span>لوحة قيادة المالك والتحكم التنفيذي</span>
                            </span>
                            <ArrowLeft size={13} />
                          </Link>

                          {/* Direct Developer Workspace for Platform Owner Mina Roubir */}
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between rounded-xl border border-teal-200/80 bg-teal-50/80 p-2.5 text-xs font-black text-teal-800 transition hover:bg-teal-100 dark:border-teal-900/60 dark:bg-teal-950/50 dark:text-teal-300"
                          >
                            <span className="flex items-center gap-2">
                              <Code2 size={15} className="text-teal-600 dark:text-teal-400" />
                              <span>لوحة تحكم ومساحة عمل المطور</span>
                            </span>
                            <ArrowLeft size={12} />
                          </Link>
                        </>
                      ) : currentUser.role === 'admin' ? (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/70 p-2.5 text-xs font-black text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
                        >
                          <span className="flex items-center gap-2">
                            <ShieldCheck size={15} className="text-indigo-500" />
                            <span>لوحة إدارة وتشغيل المنصة</span>
                          </span>
                          <ArrowLeft size={13} />
                        </Link>
                      ) : currentUser.role === 'client' ? (
                        <Link
                          href="/client-dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                        >
                          <span className="flex items-center gap-2">
                            <Briefcase size={15} className="text-teal-500" />
                            <span>لوحة متابعة المشاريع والتعاقدات</span>
                          </span>
                          <ArrowLeft size={12} />
                        </Link>
                      ) : (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
                        >
                          <span className="flex items-center gap-2">
                            <Code2 size={15} className="text-teal-500" />
                            <span>لوحة المطور والأكواد والتسليمات</span>
                          </span>
                          <ArrowLeft size={12} />
                        </Link>
                      )}
                    </div>

                    {/* Direct Executive & Admin Portals (Only for Authorized Staff) */}
                    {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
                      <div className="mt-3 border-t border-slate-100 pt-2 space-y-1 dark:border-slate-800">
                        {currentUser.role === 'owner' && (
                          <>
                            <Link
                              href="/owner-dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex w-full items-center justify-between rounded-xl p-2 text-xs font-bold text-amber-700 transition hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/40"
                            >
                              <span className="flex items-center gap-2">
                                <Crown size={14} className="text-amber-500" />
                                <span>لوحة تحكم مالك المنصة</span>
                              </span>
                              <ArrowLeft size={12} />
                            </Link>

                            <Link
                              href="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex w-full items-center justify-between rounded-xl p-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/40"
                            >
                              <span className="flex items-center gap-2">
                                <Code2 size={14} className="text-teal-500" />
                                <span>لوحة تحكم المطور</span>
                              </span>
                              <ArrowLeft size={12} />
                            </Link>
                          </>
                        )}

                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center justify-between rounded-xl p-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
                        >
                          <span className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-indigo-500" />
                            <span>لوحة إدارة المنصة (Admin)</span>
                          </span>
                          <ArrowLeft size={12} />
                        </Link>
                      </div>
                    )}

                    <div className="mt-3 border-t border-slate-100 pt-2 space-y-1 dark:border-slate-800">

                      {/* Quick Switch / Sign In with Another Account */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onOpenAuth) onOpenAuth('developer', 'login', 'members');
                        }}
                        className="flex w-full items-center justify-between rounded-xl p-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <span className="flex items-center gap-2">
                          <LogIn size={14} className="text-teal-500" />
                          <span>تسجيل الدخول بحساب آخر</span>
                        </span>
                        <ArrowLeft size={12} />
                      </button>

                      {/* Create New Account */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onOpenAuth) onOpenAuth('developer', 'register', 'members');
                        }}
                        className="flex w-full items-center justify-between rounded-xl p-2 text-xs font-bold text-teal-700 transition hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/40"
                      >
                        <span className="flex items-center gap-2">
                          <UserPlus size={14} className="text-teal-500" />
                          <span>إنشاء حساب جديد</span>
                        </span>
                        <ArrowLeft size={12} />
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await auth.signOut();
                          if (onLogout) onLogout();
                          if (notify) notify('تم تسجيل الخروج بنجاح 👋');
                          setLocation('/');
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        <LogOut size={14} className="text-red-400" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('developer', 'login', 'members');
                }}
                className="flex h-9 items-center rounded-full border border-slate-200/80 bg-white/90 px-3.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-[#0e1726] dark:text-slate-200 dark:hover:bg-[#131f33]"
              >
                تسجيل الدخول
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAuth) onOpenAuth('developer', 'register', 'members');
                }}
                className="flex h-9 items-center rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-3.5 text-xs font-black text-white shadow-sm transition hover:brightness-105 active:scale-95"
              >
                إنشاء حساب
              </button>
            </div>
          )}

          <div className="hidden sm:block h-5 w-px bg-slate-200/90 dark:bg-white/10 mx-0.5" />

          {/* Luxury Theme Toggle - Segmented on desktop (xl+), Minimal icon button on compact screens */}
          <div className="hidden xl:block">
            <ThemeToggle variant="segmented" />
          </div>
          <div className="block xl:hidden">
            <ThemeToggle variant="minimal" />
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 lg:hidden dark:border-white/10 dark:bg-[#0e1726] dark:text-slate-200"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200/80 bg-white px-4 py-5 shadow-2xl lg:hidden dark:border-white/10 dark:bg-[#09101d]"
            dir="rtl"
          >
            <div className="space-y-1.5">
              {navLinks.map((link) => {
                const isActive = route === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-black transition ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[9px] font-black text-teal-700 dark:text-teal-300">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                href="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-black transition ${
                  route === '/terms'
                    ? 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale size={14} className="text-emerald-500" />
                  <span>ميثاق الضمان والشروط القانونية</span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-700 dark:text-emerald-300">
                  Escrow
                </span>
              </Link>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/10 space-y-2">
              {/* Quick Auth Actions in Mobile Drawer */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth('developer', 'login', 'members');
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <LogIn size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>تسجيل الدخول</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth('developer', 'register', 'members');
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-xs font-black text-white shadow-sm"
                >
                  <UserPlus size={14} />
                  <span>إنشاء حساب</span>
                </button>
              </div>

              <Link
                href="/post-project"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] text-xs font-black text-white shadow-sm dark:from-teal-600 dark:to-cyan-600 dark:text-slate-950"
              >
                <Plus size={15} />
                <span>انشر مشروعًا جديدًا</span>
              </Link>

              {/* Theme Toggle row inside mobile drawer */}
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                  مظهر المنصة (الوضع الليلي والنهاري)
                </span>
                <ThemeToggle variant="segmented" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
