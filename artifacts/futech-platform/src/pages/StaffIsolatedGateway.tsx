import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft,
  CheckCircle2, AlertTriangle, ShieldAlert, KeyRound, Sparkles, Home, LogOut
} from 'lucide-react';
import { Store, User } from '../types';
import { useAuth } from '../lib/AuthContext';
import {
  OWNER_EMAILS,
  OWNER_FULL_NAME,
  isOwnerEmail,
  buildOwnerUser,
  getOwnerSyncedAvatar,
} from '../lib/ownerAuth';

interface StaffIsolatedGatewayProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
  initialPortal?: 'owner' | 'admin';
}

export function StaffIsolatedGateway({
  store,
  update,
  notify,
  go,
  initialPortal = 'owner',
}: StaffIsolatedGatewayProps) {
  const auth = useAuth();
  const [activePortal, setActivePortal] = useState<'owner' | 'admin'>(initialPortal);

  // Sync if initialPortal changes
  useEffect(() => {
    if (initialPortal) {
      setActivePortal(initialPortal);
    }
  }, [initialPortal]);

  // Owner Form State
  const [ownerEmail, setOwnerEmail] = useState('menarobir246rm@gmail.com');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerShowPassword, setOwnerShowPassword] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('admin@futech.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminShowPassword, setAdminShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const currentUser = store.currentUser;
  const isOwnerLoggedIn = Boolean(currentUser?.email && isOwnerEmail(currentUser.email));
  const isAdminLoggedIn = isOwnerLoggedIn || currentUser?.role === 'admin';

  // Handle Owner Login
  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = ownerEmail.trim();
    const cleanPwd = ownerPassword.trim();
    if (!cleanEmail || !cleanPwd) {
      notify('يرجى إدخال البريد الإلكتروني وكلمة المرور التنفيذية كاملة');
      return;
    }

    if (!isOwnerEmail(cleanEmail)) {
      notify('⛔ هذا البريد الإلكتروني غير مسجل ضمن العناوين الرسمية لمالك المنصة');
      return;
    }

    setOwnerLoading(true);
    const { error } = await auth.signIn(cleanEmail, cleanPwd);
    setOwnerLoading(false);

    if (error) {
      notify(`❌ ${error}`);
      return;
    }

    const ownerUser = buildOwnerUser(cleanEmail, auth.profile?.avatar_url || undefined);
    update('currentUser', ownerUser);
    notify('تم التحقق بنجاح! مرحباً بك يا بشمهندس مينا في مجلس الحوكمة العليا 👑');
    go('/owner-dashboard');
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim();
    const cleanPwd = adminPassword.trim();
    if (!cleanEmail || !cleanPwd) {
      notify('يرجى إدخال بيانات الدخول الإدارية كاملة (البريد وكلمة المرور)');
      return;
    }

    setAdminLoading(true);
    const { error } = await auth.signIn(cleanEmail, cleanPwd);
    setAdminLoading(false);

    if (error) {
      notify(`❌ ${error}`);
      return;
    }

    if (auth.profile?.role !== 'admin' && !isOwnerEmail(cleanEmail)) {
      await auth.signOut();
      notify('⛔ هذا الحساب لا يملك صلاحيات الإدارة ومشرف العمليات');
      return;
    }

    const adminUser: User = {
      id: auth.profile?.id || 'usr-admin-ops',
      name: auth.profile?.full_name || 'مهندس إدارة المنصة والعمليات',
      email: cleanEmail,
      role: 'admin',
      avatar: auth.profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      country: auth.profile?.country || 'جمهورية مصر العربية',
      title: auth.profile?.specialty || 'مشرف فني وتدقيق جودة FQS',
      bio: auth.profile?.bio || 'مشرف فني مسؤول عن مراجعة المشاريع، تدقيق الكود، وفحص معيار FQS والنزاعات الهندسية.',
      createdAt: '2024-03-01',
    };

    update('currentUser', adminUser);
    notify('تم تسجيل الدخول بنجاح كمسؤول ومشرف عمليات المنصة 🛡️');
    go('/admin');
  };

  return (
    <div className="relative min-h-[85vh] py-10 px-4 sm:px-6" dir="rtl">
      {/* Background Decorative Tech Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/5" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
      </div>

      <div className="relative mx-auto max-w-2xl">
        {/* Top Confidential Security Badge */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 backdrop-blur-md shadow-xs dark:border-slate-800 dark:bg-[#0c1524]/80">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
            <ShieldAlert size={16} className="text-amber-500 shrink-0" />
            <span>بوابة معزولة ومحمية — وصول مقيد ومخصص للإدارة والمالك فقط</span>
          </div>

          <button
            type="button"
            onClick={() => go('/')}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Home size={13} />
            <span>العودة للمنصة العامة</span>
          </button>
        </div>

        {/* Main Gateway Card */}
        <div className="relative overflow-hidden rounded-[36px] border border-slate-200/80 bg-white p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-slate-800/80 dark:bg-[#0c1524]">
          {/* Top Brand & Gateway Heading */}
          <div className="text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-50/70 px-3.5 py-1 text-[11px] font-black text-teal-800 dark:border-teal-500/30 dark:bg-teal-950/40 dark:text-teal-300">
              <KeyRound size={13} />
              <span>نظام الرقابة والتحكم المشفر (Futech Security Vault)</span>
            </div>

            <h1 className="mt-4 text-2xl font-black text-[#14283d] sm:text-3xl dark:text-white">
              {activePortal === 'owner' ? 'البوابة التنفيذية العليا لمالك المنصة' : 'بوابة إدارة المنصة والعمليات (Admin)'}
            </h1>

            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {activePortal === 'owner'
                ? 'مجلس الحوكمة العليا، أوزان خوارزمية FQS، وتعيين وإدارة صلاحيات المشرفين'
                : 'مركز الإشراف التقني، تدقيق المستودعات، مطابقة الجودة، ومتابعة النزاعات'}
            </p>
          </div>

          {/* THE TWO ISOLATED BUTTONS (الزرين المعزولين: المالك والإدارة) */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {/* Owner Button (Golden Crown Circle) */}
            <button
              type="button"
              onClick={() => setActivePortal('owner')}
              className={`group flex items-center gap-3 rounded-2xl p-2.5 pe-5 transition-all duration-200 ${
                activePortal === 'owner'
                  ? 'border-2 border-amber-400 bg-amber-50/70 shadow-lg shadow-amber-500/10 dark:border-amber-500 dark:bg-amber-950/30'
                  : 'border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-full text-base transition-all duration-200 ${
                  activePortal === 'owner'
                    ? 'bg-gradient-to-tr from-[#d4af37] via-[#f3cf65] to-[#ffeaa7] text-slate-950 shadow-md ring-2 ring-amber-400/50 scale-105'
                    : 'border border-amber-500/20 bg-amber-50/60 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                }`}
              >
                <Crown size={20} className="stroke-[2.2]" />
              </span>
              <div className="text-right">
                <div
                  className={`text-xs font-black ${
                    activePortal === 'owner'
                      ? 'text-amber-900 dark:text-amber-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  مالك المنصة
                </div>
                <div className="text-[10px] text-slate-400">مينا روبير مجدى فوزى</div>
              </div>
            </button>

            {/* Admin Button (Indigo Shield Circle) */}
            <button
              type="button"
              onClick={() => setActivePortal('admin')}
              className={`group flex items-center gap-3 rounded-2xl p-2.5 pe-5 transition-all duration-200 ${
                activePortal === 'admin'
                  ? 'border-2 border-indigo-400 bg-indigo-50/70 shadow-lg shadow-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-950/30'
                  : 'border border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800'
              }`}
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-full text-base transition-all duration-200 ${
                  activePortal === 'admin'
                    ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 text-white shadow-md ring-2 ring-indigo-400/50 scale-105'
                    : 'border border-indigo-500/20 bg-indigo-50/60 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                }`}
              >
                <ShieldCheck size={20} className="stroke-[2.2]" />
              </span>
              <div className="text-right">
                <div
                  className={`text-xs font-black ${
                    activePortal === 'admin'
                      ? 'text-indigo-900 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  إدارة المنصة
                </div>
                <div className="text-[10px] text-slate-400">فريق العمليات والرقابة</div>
              </div>
            </button>
          </div>

          {/* Logged in state check */}
          {currentUser && (isOwnerLoggedIn || isAdminLoggedIn) && (
            <div className="mt-8 rounded-2xl border border-teal-500/30 bg-teal-50/80 p-4 dark:border-teal-500/30 dark:bg-teal-950/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <div className="text-xs font-black text-teal-950 dark:text-teal-100">
                      أنت مسجل الدخول حالياً: <b>{currentUser.name}</b> ({isOwnerLoggedIn ? '👑 مالك المنصة' : '🛡️ مشرف إدارة'})
                    </div>
                    <div className="text-[11px] text-teal-700 dark:text-teal-300">
                      يمكنك الدخول مباشرة إلى لوحة التحكم أو التبديل بحساب إداري آخر أدناه
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isOwnerLoggedIn) go('/owner-dashboard');
                      else go('/admin');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#14293f] px-4 py-2 text-xs font-black text-white shadow-md hover:bg-[#1f3f61] transition"
                  >
                    <span>الدخول للوحة التحكم</span>
                    <ArrowLeft size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form container */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {activePortal === 'owner' ? (
                <motion.form
                  key="owner-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleOwnerLogin}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-50/40 p-4 text-xs font-medium text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200">
                    👑 <b>بوابة مالك المنصة الحصرية:</b> تمنح حق التحكم الكامل بالأوزان النسبية لخوارزمية FQS وإدارة صلاحيات المشرفين.
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                      البريد الإلكتروني للقيادة التنفيذية
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="menarobir246rm@gmail.com"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                        required
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>

                    {/* Quick selection pills for the 3 owner emails */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400">حسابات المالك المعتمدة:</span>
                      {OWNER_EMAILS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setOwnerEmail(em)}
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition ${
                            ownerEmail === em
                              ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                      مفتاح الحوكمة السري (Executive Passkey)
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type={ownerShowPassword ? 'text' : 'password'}
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setOwnerShowPassword(!ownerShowPassword)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {ownerShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={ownerLoading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-xs font-black text-slate-950 shadow-xl shadow-amber-500/20 transition hover:brightness-105 active:scale-98 disabled:opacity-60"
                  >
                    {ownerLoading ? (
                      <span>جاري التحقق من الصلاحيات التنفيذية...</span>
                    ) : (
                      <>
                        <Crown size={16} />
                        <span>دخول مجلس الإدارة التنفيذي لمالك المنصة</span>
                        <ArrowLeft size={15} />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="admin-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleAdminLogin}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-indigo-500/20 bg-indigo-50/40 p-4 text-xs font-medium text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-950/20 dark:text-indigo-200">
                    🛡️ <b>بوابة إدارة العمليات (Admin Portal):</b> مخصصة للمشرفين المعتمدين لفحص مستودعات Git، ومطابقة معيار FQS، وإدارة التذاكر.
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                      البريد الإلكتروني الإداري المعتمد
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@futech.com"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                        required
                      />
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                      كلمة المرور / مفتاح التحقق المشفر
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type={adminShowPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setAdminShowPassword(!adminShowPassword)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {adminShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={adminLoading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 text-xs font-black text-white shadow-xl shadow-indigo-600/20 transition hover:brightness-105 active:scale-98 disabled:opacity-60"
                  >
                    {adminLoading ? (
                      <span>جاري التحقق من بيانات المشرف...</span>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>تسجيل الدخول إلى لوحة إدارة وتشغيل المنصة</span>
                        <ArrowLeft size={15} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer note */}
          <div className="mt-8 border-t border-slate-100 pt-5 text-center dark:border-slate-800">
            <p className="text-[11px] text-slate-400">
              منصة فوتيك للبرمجيات — جميع حقوق الإدارة والحوكمة محفوظة © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
