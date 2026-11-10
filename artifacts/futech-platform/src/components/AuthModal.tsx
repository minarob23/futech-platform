import { validatePasswordStrength } from '../lib/passwordSecurity';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Lock, Mail, Github, CheckCircle2, ShieldCheck, Building2,
  Code2, ArrowLeft, Sparkles, User as UserIcon, Check, Eye, EyeOff,
  Coins, Globe2, Crown, Key, ShieldAlert, ExternalLink, Loader2, AlertTriangle
} from 'lucide-react';
import { User, UserRole } from '../types';
import { ARAB_AND_GLOBAL_COUNTRIES, getCountryByCodeOrName, CountryConfig } from '../data/countries';
import { useAuth } from '../lib/AuthContext';
import { sanitizeEmail, isValidEmailFormat } from '../lib/emailUtils';
import {
  isOwnerEmail,
  isOwnerIdentity,
  OWNER_FULL_NAME,
  OWNER_EMAILS,
  OWNER_DEFAULT_EMAIL,
  getOwnerSyncedAvatar,
  setOwnerSyncedAvatar,
  buildOwnerUser,
} from '../lib/ownerAuth';

export type AuthPortal = 'members' | 'admin' | 'owner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
  onLogin: (user: User) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
  initialMode?: 'login' | 'register';
  initialRole?: 'developer' | 'client';
  initialPortal?: AuthPortal;
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  notify,
  go,
  initialMode = 'login',
  initialRole = 'developer',
  initialPortal = 'members',
}: AuthModalProps) {
  const auth = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [portal, setPortal] = useState<AuthPortal>(initialPortal);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'developer' | 'client'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);

  // In-Modal Alert Message State (Displays directly inside the modal)
  const [modalMessage, setModalMessage] = useState<{
    type: 'error' | 'success' | 'info';
    text: string;
  } | null>(null);

  // Clear modal message whenever switching tabs, roles, or opening modal
  useEffect(() => {
    setModalMessage(null);
    setShowGoogleRoleModal(false);
  }, [mode, role, isOpen]);

  const showModalError = (text: string) => {
    setModalMessage({ type: 'error', text });
  };

  const showModalSuccess = (text: string) => {
    setModalMessage({ type: 'success', text });
  };

  // If user is already registered and logged in, close modal immediately and redirect to dashboard
  useEffect(() => {
    if (isOpen && currentUser) {
      onClose();
      const target = currentUser.role === 'owner'
        ? '/owner-dashboard'
        : currentUser.role === 'admin'
        ? '/admin'
        : currentUser.role === 'developer'
        ? '/dashboard'
        : '/client-dashboard';
      go(target);
      notify(`أنت مسجل الدخول بالفعل بحساب: ${currentUser.name}`);
    }
  }, [isOpen, currentUser]);

  // Sync with initialPortal when opened
  useEffect(() => {
    if (initialPortal) {
      setPortal(initialPortal);
    }
  }, [initialPortal, isOpen]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminShowPassword, setAdminShowPassword] = useState(false);

  // Owner form state
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerShowPassword, setOwnerShowPassword] = useState(false);

  // Country & Currency State
  const [devCountryCode, setDevCountryCode] = useState('SA');
  const selectedDevCountry = getCountryByCodeOrName(devCountryCode);

  const [clientCountryCode, setClientCountryCode] = useState('SA');
  const selectedClientCountry = getCountryByCodeOrName(clientCountryCode);
  const [clientBudget, setClientBudget] = useState(selectedClientCountry.defaultProjectBudget);

  // Developer Registration State
  const [devName, setDevName] = useState('');
  const [devEmail, setDevEmail] = useState('');
  const [devPassword, setDevPassword] = useState('');
  const [devSpecialty, setDevSpecialty] = useState('تطوير شامل (Full-Stack)');
  const [devExperience, setDevExperience] = useState('خبير (Senior)');
  const [devGithub, setDevGithub] = useState('');
  const [devHourlyRate, setDevHourlyRate] = useState(selectedDevCountry.defaultDevRate);
  const [devFqsPledge, setDevFqsPledge] = useState(true);

  // Client Registration State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientProjectType, setClientProjectType] = useState('منصات ويب سحابية (SaaS)');
  const [clientPledge, setClientPledge] = useState(true);

  const handleClientCountryChange = (code: string) => {
    setClientCountryCode(code);
    const country = getCountryByCodeOrName(code);
    setClientBudget(country.defaultProjectBudget);
  };

  const handleDevCountryChange = (code: string) => {
    setDevCountryCode(code);
    const country = getCountryByCodeOrName(code);
    setDevHourlyRate(country.defaultDevRate);
  };

  if (!isOpen) return null;

  // Handle Admin Direct Login — Supabase Auth
  const handleAdminLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = sanitizeEmail(adminEmail.trim());
    const cleanPwd = adminPassword.trim();
    if (!cleanEmail || !cleanPwd) {
      showModalError('يرجى إدخال البريد الإلكتروني الإداري وكلمة المرور');
      return;
    }
    setAuthLoading(true);
    const { error } = await auth.signIn(cleanEmail, cleanPwd);
    setAuthLoading(false);
    if (error) {
      showModalError(error);
      return;
    }
    if (auth.profile?.role !== 'admin' && !isOwnerEmail(cleanEmail)) {
      await auth.signOut();
      showModalError('⛔ هذا الحساب لا يملك صلاحيات الإدارة ومشرف العمليات.');
      return;
    }
    notify('مرحباً بك! تم تسجيل الدخول إلى لوحة إدارة العمليات.');
    onClose();
    go('/admin');
  };

  // Handle Owner Direct Login — Supabase Auth
  const handleOwnerLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = sanitizeEmail(ownerEmail.trim() || OWNER_DEFAULT_EMAIL);
    const cleanPwd = ownerPassword.trim();
    if (!cleanPwd) {
      showModalError('يرجى إدخال كلمة المرور الخاصة بحساب المالك التنفيذي');
      return;
    }
    if (!isOwnerEmail(cleanEmail)) {
      showModalError('هذا البريد غير مسجل ضمن العناوين الرسمية المعتمدة لمالك المنصة');
      return;
    }
    setAuthLoading(true);
    const { error } = await auth.signIn(cleanEmail, cleanPwd);
    setAuthLoading(false);
    if (error) {
      showModalError(error);
      return;
    }
    const ownerUser = buildOwnerUser(cleanEmail, auth.profile?.avatar_url || undefined);
    onLogin(ownerUser);
    notify('مرحباً بك يا بشمهندس مينا! تم تفعيل صلاحيات مالك المنصة التنفيذية 👑');
    onClose();
    go('/owner-dashboard');
  };

  // Handle Standard Members Login — Supabase Auth
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalMessage(null);
    const cleanEmail = sanitizeEmail(loginEmail);

    if (!cleanEmail || !loginPassword.trim()) {
      showModalError('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }
    if (!isValidEmailFormat(cleanEmail)) {
      showModalError('صيغة البريد الإلكتروني غير صالحة. يرجى التأكد من كتابة البريد بالإنجليزية (مثال: name@example.com)');
      return;
    }

    setAuthLoading(true);
    const { error } = await auth.signIn(cleanEmail, loginPassword.trim());
    setAuthLoading(false);

    if (error) {
      showModalError(error);
      return;
    }

    showModalSuccess('تم تسجيل الدخول بنجاح! جاري تحويلك...');

    // بعد نجاح تسجيل الدخول، نجهز كائن المستخدم المعتمد
    const profile = auth.profile;
    const isOwner = Boolean(cleanEmail && isOwnerEmail(cleanEmail));
    const user: User = isOwner
      ? buildOwnerUser(cleanEmail, profile?.avatar_url || undefined)
      : {
          id: profile?.id || 'user-' + Math.random().toString(36).substring(2, 9),
          name: profile?.full_name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: (profile?.role as UserRole) || 'client',
          avatar: profile?.avatar_url || '',
          title: profile?.specialty || 'عضو مسجل',
          createdAt: new Date().toISOString().split('T')[0],
        };

    onLogin(user);
    if (isOwner) {
      notify('مرحباً بك يا بشمهندس مينا! تم التعرف على حساب مالك المنصة 👑');
    }
    setTimeout(() => {
      onClose();
      if (user.role === 'owner') go('/owner-dashboard');
      else if (user.role === 'developer') go('/dashboard');
      else if (user.role === 'client') go('/client-dashboard');
      else if (user.role === 'admin') go('/admin');
    }, 600);
  };

  // Handle Google OAuth Sign In & Sign Up
  const handleGoogleAuth = async (targetRole: 'developer' | 'client' | 'owner' = role as any) => {
    setModalMessage(null);
    setAuthLoading(true);

    const isOwnerTarget = targetRole === 'owner';
    const { error } = await auth.signInWithGoogle(isOwnerTarget ? 'owner' : targetRole);
    setAuthLoading(false);

    if (error) {
      showModalError('تعذر تسجيل الدخول عبر Google: ' + error);
    }
  };

  // Handle Developer Register Submit — Supabase Auth
  const handleDevRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalMessage(null);
    const cleanEmail = sanitizeEmail(devEmail);

    if (!devName.trim() || !cleanEmail || !devPassword.trim()) {
      showModalError('يرجى استكمال جميع البيانات الإلزامية المطلوبة');
      return;
    }
    if (!isValidEmailFormat(cleanEmail)) {
      showModalError('صيغة البريد الإلكتروني غير صالحة. يرجى كتابة بريد صالح (مثال: dev@example.com)');
      return;
    }
    const pwdValidation = validatePasswordStrength(devPassword);
    if (!pwdValidation.isValid) {
      showModalError(pwdValidation.errorMessage || 'كلمة المرور لا تستوفي المعايير الأمنية المطلوبة');
      return;
    }
    if (!devGithub.trim()) {
      showModalError('يرجى إرفاق رابط حسابك على GitHub لتوثيق معايير Git Handover');
      return;
    }
    if (!devFqsPledge) {
      showModalError('يرجى التعهد بالالتزام بمعايير جودة الشفرة FQS للمتابعة');
      return;
    }

    setAuthLoading(true);
    const { error } = await auth.signUp(cleanEmail, devPassword.trim(), {
      full_name: devName.trim(),
      role: 'developer',
      specialty: `${devSpecialty} - ${devExperience}`,
    });
    setAuthLoading(false);

    if (error) {
      showModalError(error);
      return;
    }

    showModalSuccess(`مرحباً بك يا ${devName.trim()}! تم إنشاء الحساب بنجاح، جاري تحويلك للمنصة...`);

    const devUserId = auth.profile?.id || auth.session?.user?.id || ('dev-' + Math.random().toString(36).substring(2, 9));
    const newUser: User = {
      id: devUserId,
      name: devName.trim(),
      email: cleanEmail,
      role: 'developer',
      avatar: '',
      title: `${devSpecialty} - ${devExperience}`,
      githubUrl: devGithub.trim(),
      hourlyRate: Number(devHourlyRate),
      fqs: 0,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      bio: 'مهندس برمجيات شغوف بالعمل على مشاريع تقنية عالية الجودة وفق معايير FQS.',
      country: selectedDevCountry.name,
      currency: selectedDevCountry.currencySymbol,
      currencyCode: selectedDevCountry.currencyCode,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onLogin(newUser);
    setTimeout(() => {
      onClose();
      go('/dashboard');
    }, 600);
  };

  // Handle Client Register Submit — Supabase Auth
  const handleClientRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalMessage(null);
    const cleanEmail = sanitizeEmail(clientEmail);

    if (!clientName.trim() || !cleanEmail || !clientPassword.trim()) {
      showModalError('يرجى استكمال الحقول المطلوبة (الاسم، البريد، كلمة المرور)');
      return;
    }
    if (!isValidEmailFormat(cleanEmail)) {
      showModalError('صيغة البريد الإلكتروني غير صالحة. يرجى كتابة بريد صالح (مثال: client@company.com)');
      return;
    }
    const clientPwdValidation = validatePasswordStrength(clientPassword);
    if (!clientPwdValidation.isValid) {
      showModalError(clientPwdValidation.errorMessage || 'كلمة المرور لا تستوفي المعايير الأمنية المطلوبة');
      return;
    }
    if (!clientPledge) {
      showModalError('يرجى الموافقة على نظام الضمان المالي ومستوى الخدمة SLA');
      return;
    }

    setAuthLoading(true);
    const { error } = await auth.signUp(cleanEmail, clientPassword.trim(), {
      full_name: clientName.trim(),
      role: 'client',
      company_name: clientCompany.trim() || 'مؤسسة مستقلة',
    });
    setAuthLoading(false);

    if (error) {
      showModalError(error);
      return;
    }

    showModalSuccess(`أهلاً بك يا ${clientName.trim()}! تم إنشاء وتفعيل حسابك بنجاح، جاري نقلك...`);

    const clientUserId = auth.profile?.id || auth.session?.user?.id || ('client-' + Math.random().toString(36).substring(2, 9));
    const newUser: User = {
      id: clientUserId,
      name: clientName.trim(),
      email: cleanEmail,
      role: 'client',
      avatar: '',
      company: clientCompany.trim() || 'مؤسسة مستقلة',
      title: 'صاحب مشاريع',
      country: selectedClientCountry.name,
      currency: selectedClientCountry.currencySymbol,
      currencyCode: selectedClientCountry.currencyCode,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onLogin(newUser);
    setTimeout(() => {
      onClose();
      go('/client-dashboard');
    }, 600);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-lg overflow-hidden rounded-[30px] border border-slate-100 bg-white p-7 sm:p-9 shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-[#0c1524]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-6 top-6 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/20 dark:hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Modal Top Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src="/images/futech-logo.jpg"
              alt="شعار منصة فوتيك FuTech"
              className="h-12 w-12 rounded-2xl object-cover shadow-md shadow-[#152c42]/30 ring-2 ring-[#2798a0]/40 transition duration-300 hover:scale-105"
            />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-[#14283d] sm:text-xl dark:text-white">
              {mode === 'login' ? 'تسجيل الدخول إلى فوتيك' : 'إنشاء حساب جديد في منصة فوتيك'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              حاضنة الكفاءات التقنية العربية ومعايير جودة الكود (FQS)
            </p>
          </div>
        </div>

        {/* Notice when already logged in */}
        {currentUser && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-teal-500/20 bg-teal-50/70 p-3 text-xs dark:border-teal-500/30 dark:bg-teal-950/40">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200">
              <CheckCircle2 size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <span>أنت مسجل الدخول حالياً بحساب: <b className="font-black">{currentUser.name}</b></span>
            </div>
            <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">
              يمكنك تسجيل الدخول بحساب آخر أو إنشاء حساب جديد أدناه
            </span>
          </div>
        )}

        {/* Clean Pill Tab Switcher: Login vs Register */}
        <div className="mt-5 flex rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black transition ${
              mode === 'login'
                ? 'bg-white text-[#13283d] shadow-sm dark:bg-[#142236] dark:text-teal-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-xl py-2.5 text-xs font-black transition ${
              mode === 'register'
                ? 'bg-white text-[#13283d] shadow-sm dark:bg-[#142236] dark:text-teal-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* In-Modal Alert Banner (Error or Success) */}
        <AnimatePresence>
          {modalMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`mt-4 flex items-center justify-between gap-3 rounded-2xl p-3.5 text-xs font-black shadow-md border ${
                modalMessage.type === 'error'
                  ? 'border-rose-300 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20 dark:border-rose-800 dark:bg-rose-950/80 dark:text-rose-100'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {modalMessage.type === 'error' ? (
                  <div className="grid h-7 w-7 place-items-center rounded-xl bg-rose-200 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 shrink-0">
                    <AlertTriangle size={15} />
                  </div>
                ) : (
                  <div className="grid h-7 w-7 place-items-center rounded-xl bg-emerald-200 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
                    <CheckCircle2 size={15} />
                  </div>
                )}
                <span className="leading-relaxed">{modalMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setModalMessage(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-black/5 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white transition shrink-0"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

            {/* 1. LOGIN MODE */}
            {mode === 'login' && (
              <div className="mt-6 space-y-4">
                {/* Google Quick Sign-In Button */}
                <button
                  type="button"
                  onClick={() => setShowGoogleRoleModal(true)}
                  disabled={authLoading}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 px-4 text-xs font-black text-slate-700 shadow-xs transition hover:border-[#4285F4]/40 hover:bg-slate-50/80 hover:shadow-sm active:scale-[0.99] disabled:opacity-60 dark:border-slate-700 dark:bg-[#121c2c] dark:text-slate-200 dark:hover:border-[#4285F4]/50 dark:hover:bg-[#152338]"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>تسجيل الدخول السريع عبر Google</span>
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  <span className="absolute bg-white px-3 text-[11px] font-bold text-slate-400 dark:bg-[#0c1524] dark:text-slate-500">
                    أو عبر البريد الإلكتروني
                  </span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type="email"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u00A0\u202A-\u202E]/g, ''))}
                      placeholder="name@example.com"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/40 pr-4 pl-11 text-xs font-medium text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white focus:ring-4 focus:ring-[#2ba6ae]/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900 text-right placeholder:text-right"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    كلمة المرور <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/40 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white focus:ring-4 focus:ring-[#2ba6ae]/10 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white dark:focus:bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {modalMessage && modalMessage.type === 'error' && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-black text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800">
                    <AlertTriangle size={14} className="shrink-0 text-rose-500" />
                    <span>{modalMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="mt-3 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] text-sm font-black text-white shadow-xl shadow-[#14293f]/25 transition hover:opacity-95 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-teal-300" />
                      <span>جاري التحقق وتسجيل الدخول...</span>
                    </>
                  ) : (
                    <>
                      <span>تسجيل الدخول</span>
                      <ArrowLeft size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

            {/* 2. REGISTER MODE */}
            {mode === 'register' && (
              <div className="mt-5 space-y-4">
                {/* Role Switcher Cards */}
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('developer')}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition ${
                        role === 'developer'
                          ? 'border-[#2798a0] bg-[#eef8f9] text-[#166f76] shadow-sm dark:border-[#2798a0] dark:bg-teal-950/40 dark:text-teal-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <Code2 size={22} className={role === 'developer' ? 'text-[#2798a0] dark:text-[#39c4cc]' : 'text-slate-400'} />
                      <span className="mt-1.5 text-xs font-black">مطور برمجيات</span>
                      <span className="text-[10px] text-slate-400">للمهندسين والمبرمجين</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition ${
                        role === 'client'
                          ? 'border-[#2798a0] bg-[#eef8f9] text-[#166f76] shadow-sm dark:border-[#2798a0] dark:bg-teal-950/40 dark:text-teal-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:border-slate-700'
                      }`}
                    >
                      <Building2 size={22} className={role === 'client' ? 'text-[#2798a0] dark:text-[#39c4cc]' : 'text-slate-400'} />
                      <span className="mt-1.5 text-xs font-black">صاحب عمل أو شركة</span>
                      <span className="text-[10px] text-slate-400">لتوظيف المطورين</span>
                    </button>
                  </div>
                </div>

                {/* Google Quick Sign-Up Button */}
                <button
                  type="button"
                  onClick={() => handleGoogleAuth(role)}
                  disabled={authLoading}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 px-4 text-xs font-black text-slate-700 shadow-xs transition hover:border-[#4285F4]/40 hover:bg-slate-50/80 hover:shadow-sm active:scale-[0.99] disabled:opacity-60 dark:border-slate-700 dark:bg-[#121c2c] dark:text-slate-200 dark:hover:border-[#4285F4]/50 dark:hover:bg-[#152338]"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>
                    {role === 'developer'
                      ? 'إنشاء وتفعيل حساب مطور فوراً عبر Google'
                      : 'إنشاء وتفعيل حساب عميل فوراً عبر Google'}
                  </span>
                </button>

                <div className="relative my-2 flex items-center justify-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  <span className="absolute bg-white px-3 text-[11px] font-bold text-slate-400 dark:bg-[#0c1524] dark:text-slate-500">
                    أو استكمال البيانات يدوياً
                  </span>
                </div>

                {/* Developer Registration Form */}
                {role === 'developer' && (
                  <form onSubmit={handleDevRegisterSubmit} className="space-y-3.5">
                    {/* Country & Currency Selection */}
                    <div className="rounded-2xl border border-teal-500/20 bg-teal-50/50 p-3.5 dark:border-teal-500/20 dark:bg-teal-950/20">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-teal-200">
                          <Globe2 size={14} className="text-[#208b92]" />
                          <span>بلد الإقامة والعملة</span>
                        </label>
                        <span className="rounded-lg bg-teal-500/15 px-2 py-0.5 text-[10px] font-black text-teal-800 dark:text-teal-300">
                          {selectedDevCountry.flag} {selectedDevCountry.currencySymbol} ({selectedDevCountry.currencyCode})
                        </span>
                      </div>

                      <select
                        value={devCountryCode}
                        onChange={(e) => handleDevCountryChange(e.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-teal-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition focus:border-teal-500 dark:border-teal-800 dark:bg-slate-900 dark:text-white"
                      >
                        {ARAB_AND_GLOBAL_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} — ({c.currencySymbol} {c.currencyName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                        الاسم الكامل <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={devName}
                        onChange={(e) => setDevName(e.target.value)}
                        placeholder="مثال: عبد الله السبيعي"
                        className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          البريد المهني <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          value={devEmail}
                          onChange={(e) => setDevEmail(e.target.value.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u00A0\u202A-\u202E]/g, ''))}
                          placeholder="dev@example.com"
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white text-right placeholder:text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          كلمة المرور <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={devPassword}
                          onChange={(e) => setDevPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                        />
                        <PasswordStrengthMeter password={devPassword} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                        رابط حساب GitHub <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <input
                          type="url"
                          required
                          value={devGithub}
                          onChange={(e) => setDevGithub(e.target.value)}
                          placeholder="https://github.com/username"
                          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                        />
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          التخصص التقني
                        </label>
                        <select
                          value={devSpecialty}
                          onChange={(e) => setDevSpecialty(e.target.value)}
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          <option>تطوير شامل (Full-Stack)</option>
                          <option>واجهات أمامية (Front-End)</option>
                          <option>خوادم وقواعد بيانات (Back-End)</option>
                          <option>تطبيقات الجوال (Mobile Apps)</option>
                          <option>ذكاء اصطناعي و ML</option>
                          <option>تطوير منصات CMS ومتاجر (WordPress / Shopify / Wix)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          سعر الساعة ({selectedDevCountry.currencySymbol})
                        </label>
                        <input
                          type="number"
                          value={devHourlyRate}
                          onChange={(e) => setDevHourlyRate(Number(e.target.value))}
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-start gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={devFqsPledge}
                        onChange={(e) => setDevFqsPledge(e.target.checked)}
                        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#2ba6ae]"
                      />
                      <span>أتعهد بالالتزام بمعايير جودة الشفرة FQS وتقديم كود نظيف موثق عبر مستودع Git.</span>
                    </label>

                    {modalMessage && modalMessage.type === 'error' && (
                      <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-black text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800">
                        <AlertTriangle size={14} className="shrink-0 text-rose-500" />
                        <span>{modalMessage.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] text-xs font-black text-white shadow-lg transition hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-teal-300" />
                          <span>جاري تسجيل حساب المطور وتوثيقه...</span>
                        </>
                      ) : (
                        <>
                          <span>انضم لنخبة المهندسين في فوتيك</span>
                          <ArrowLeft size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Client Registration Form */}
                {role === 'client' && (
                  <form onSubmit={handleClientRegisterSubmit} className="space-y-3.5">
                    {/* Country & Currency Selection */}
                    <div className="rounded-2xl border border-teal-500/20 bg-teal-50/50 p-3.5 dark:border-teal-500/20 dark:bg-teal-950/20">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-teal-200">
                          <Globe2 size={14} className="text-[#208b92]" />
                          <span>دولة المشروع والعملة المعتمدة</span>
                        </label>
                        <span className="rounded-lg bg-teal-500/15 px-2 py-0.5 text-[10px] font-black text-teal-800 dark:text-teal-300">
                          {selectedClientCountry.flag} {selectedClientCountry.currencySymbol} ({selectedClientCountry.currencyCode})
                        </span>
                      </div>

                      <select
                        value={clientCountryCode}
                        onChange={(e) => handleClientCountryChange(e.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-teal-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none transition focus:border-teal-500 dark:border-teal-800 dark:bg-slate-900 dark:text-white"
                      >
                        {ARAB_AND_GLOBAL_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name} — ({c.currencySymbol} {c.currencyName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                        اسم صاحب الحساب أو الشركة <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="مثال: سارة الشمري أو شركة الأفق الرقمي"
                        className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          البريد الإلكتروني <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u00A0\u202A-\u202E]/g, ''))}
                          placeholder="client@company.com"
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white text-right placeholder:text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          كلمة المرور <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs text-slate-900 outline-none transition focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                        />
                        <PasswordStrengthMeter password={clientPassword} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          المجال التقني للمشروع
                        </label>
                        <select
                          value={clientProjectType}
                          onChange={(e) => setClientProjectType(e.target.value)}
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        >
                          <option>منصات ويب سحابية (SaaS)</option>
                          <option>تطبيقات جوال (iOS & Android)</option>
                          <option>متاجر إلكترونية متقدمة</option>
                          <option>حلول الذكاء الاصطناعي</option>
                          <option>مواقع ومتاجر CMS (WordPress / Shopify / Wix)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                          الميزانية المقدرة ({selectedClientCountry.currencySymbol})
                        </label>
                        <input
                          type="number"
                          value={clientBudget}
                          onChange={(e) => setClientBudget(Number(e.target.value))}
                          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-start gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={clientPledge}
                        onChange={(e) => setClientPledge(e.target.checked)}
                        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#2ba6ae]"
                      />
                      <span>أوافق على نظام الضمان المالي وتسليم الكود المصدري وفق اتفاقية مستوى الخدمة SLA.</span>
                    </label>

                    {modalMessage && modalMessage.type === 'error' && (
                      <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-black text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-800">
                        <AlertTriangle size={14} className="shrink-0 text-rose-500" />
                        <span>{modalMessage.text}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] text-xs font-black text-white shadow-lg transition hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-teal-300" />
                          <span>جاري إنشاء وتأمين حساب العميل...</span>
                        </>
                      ) : (
                        <>
                          <span>إنشاء حساب العميل والبدء بنشر المشاريع</span>
                          <ArrowLeft size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

        {/* Google New User Role Selection Modal Overlay */}
        <AnimatePresence>
          {showGoogleRoleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 rounded-3xl"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="w-full max-w-sm rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0f172a] text-center"
              >
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 dark:bg-teal-950/60 shadow-sm">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  الدخول السريع عبر Google
                </h3>
                <p className="mt-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  إذا كان هذا حسابك الأول، حدد نوع حسابك في المنصة:
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  (الحسابات المسجلة مسبقاً ستتصل مباشرة بدورها المعتمد)
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleRoleModal(false);
                      handleGoogleAuth('developer');
                    }}
                    className="group flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white p-4 transition hover:border-[#2798a0] hover:bg-[#eef8f9] hover:shadow-md active:scale-98 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-teal-500 dark:hover:bg-teal-950/40"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-[#2798a0] transition group-hover:scale-110 dark:bg-teal-950/60 dark:text-teal-300">
                      <Code2 size={24} />
                    </div>
                    <span className="mt-2.5 text-xs font-black text-slate-900 dark:text-white">مطور برمجيات</span>
                    <span className="mt-0.5 text-[10px] font-medium text-slate-400">للمهندسين والمطورين</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleRoleModal(false);
                      handleGoogleAuth('client');
                    }}
                    className="group flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white p-4 transition hover:border-[#2798a0] hover:bg-[#eef8f9] hover:shadow-md active:scale-98 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-teal-500 dark:hover:bg-teal-950/40"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-[#2798a0] transition group-hover:scale-110 dark:bg-teal-950/60 dark:text-teal-300">
                      <Building2 size={24} />
                    </div>
                    <span className="mt-2.5 text-xs font-black text-slate-900 dark:text-white">صاحب عمل أو شركة</span>
                    <span className="mt-0.5 text-[10px] font-medium text-slate-400">لنشر المشاريع والتوظيف</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGoogleRoleModal(false)}
                  className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  إلغاء التحديد
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
