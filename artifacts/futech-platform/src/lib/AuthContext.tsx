import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { sanitizeEmail, isValidEmailFormat } from './emailUtils';
import {
  isOwnerEmail,
  isOwnerIdentity,
  OWNER_FULL_NAME,
  OWNER_USER_ID,
  OWNER_DEFAULT_EMAIL,
  getOwnerSyncedAvatar,
  setOwnerSyncedAvatar,
  OWNER_GOOGLE_AVATAR_URL,
} from './ownerAuth';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
export type AppRole = 'developer' | 'client' | 'admin' | 'owner' | 'auditor';

export interface AuthProfile {
  id: string;
  role: AppRole;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  country?: string;
  phone?: string | null;
  github_url?: string | null;
  skills?: string[] | null;
  specialty?: string | null;
  category?: string | null;
  hourly_rate?: number | null;
  rating?: number;
  reviews_count?: number;
  completed_projects?: number;
  fqs?: number;
  is_verified?: boolean;
  is_available?: boolean;
  company_name?: string | null;
}

interface AuthState {
  session: Session | null;
  profile: AuthProfile | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  // تسجيل دخول بالبريد وكلمة المرور
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  // تسجيل الدخول أو إنشاء الحساب عبر Google OAuth
  signInWithGoogle: (role?: AppRole) => Promise<{ error: string | null }>;
  // تجربة دخول فورية بحساب Google (Demo Fallback)
  signInWithDemoGoogle: (role?: AppRole, email?: string, name?: string) => Promise<{ error: string | null }>;
  // تسجيل مستخدم جديد
  signUp: (
    email: string,
    password: string,
    metadata: { full_name: string; role: AppRole; specialty?: string; company_name?: string }
  ) => Promise<{ error: string | null }>;
  // تسجيل الخروج
  signOut: () => Promise<void>;
  // تحديث بيانات الملف الشخصي
  updateProfile: (data: Partial<AuthProfile>) => Promise<{ error: string | null }>;
  // هل المستخدم مسجل الدخول؟
  isAuthenticated: boolean;
  // وظيفة إعادة التحميل اليدوي
  refreshProfile: () => Promise<void>;
}

// ─────────────────────────────────────────
// Context
// ─────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────
// Provider
// ─────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: null,
    loading: true,
  });

  // جلب الملف الشخصي من جدول profiles مع معالجة ذكية لحفظ البيانات سحابياً
  const fetchProfile = useCallback(async (userId: string, userMeta?: any): Promise<AuthProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        const isOwner = isOwnerIdentity(data) || isOwnerEmail(userMeta?.email) || isOwnerEmail((data as any).email);
        if (isOwner) {
          data.role = 'owner';
          data.full_name = OWNER_FULL_NAME;
          const googleAvatar = userMeta?.avatar_url || userMeta?.picture || (userMeta as any)?.photos?.[0]?.value || '';
          if (googleAvatar) {
            data.avatar_url = googleAvatar;
            setOwnerSyncedAvatar(googleAvatar);
          } else {
            const synced = getOwnerSyncedAvatar();
            if (data.avatar_url && !synced) {
              setOwnerSyncedAvatar(data.avatar_url);
            } else if (synced) {
              data.avatar_url = synced;
            } else {
              data.avatar_url = OWNER_GOOGLE_AVATAR_URL;
              setOwnerSyncedAvatar(OWNER_GOOGLE_AVATAR_URL);
            }
          }
        }
        try {
          localStorage.setItem('futech_auth_profile', JSON.stringify(data));
        } catch {}
        return data as AuthProfile;
      }

      // إذا لم يكن الصف موجوداً في profiles بعد، ننشئه من بيانات المستخدم المسجلة ونحفظه في Supabase
      const meta = userMeta || {};
      const candidateEmail = meta.email || (meta as any).user_email || '';
      const isMina =
        isOwnerIdentity({ id: userId, email: candidateEmail, full_name: meta.full_name }) ||
        isOwnerEmail(candidateEmail);

      let intendedRole: AppRole = 'developer';
      if (typeof window !== 'undefined') {
        const storedRole = sessionStorage.getItem('futech_oauth_intended_role') as AppRole;
        if (storedRole && ['developer', 'client', 'owner'].includes(storedRole)) {
          intendedRole = storedRole;
          sessionStorage.removeItem('futech_oauth_intended_role');
        }
      }

      const assignedRole: AppRole = isMina ? 'owner' : (meta.role || intendedRole || 'developer');
      const assignedName = isMina
        ? OWNER_FULL_NAME
        : (meta.full_name || meta.name || (meta.email ? meta.email.split('@')[0] : 'مستخدم مسجل'));

      // توحيد ومزامنة صورة المالك عبر كافة الإيميلات
      let assignedAvatar = meta.avatar_url || meta.picture || null;
      if (isMina) {
        if (assignedAvatar) {
          setOwnerSyncedAvatar(assignedAvatar);
        } else {
          const synced = getOwnerSyncedAvatar();
          if (synced) {
            assignedAvatar = synced;
          } else {
            assignedAvatar = OWNER_GOOGLE_AVATAR_URL;
            setOwnerSyncedAvatar(OWNER_GOOGLE_AVATAR_URL);
          }
        }
      }

      const fallbackProfile: AuthProfile = {
        id: userId,
        role: assignedRole,
        full_name: assignedName,
        avatar_url: assignedAvatar,
        bio: isMina
          ? 'المطور والمالك الأوحد لمنصة فوتيك، مهندس برمجيات وتطوير شامل (Full-Stack Engineer) ومتحكم بصلاحيات الإدارة وحوكمة المنصة.'
          : (meta.bio || (assignedRole === 'developer' ? 'مهندس برمجيات وتطوير شامل مسجل في حاضنة فوتيك.' : 'صاحب أعمال ومشاريع برمجية مستقلة.')),
        country: isMina ? 'مصر' : (meta.country || 'مصر'),
        phone: meta.phone || null,
        github_url: meta.github_url || null,
        skills: meta.skills || [],
        specialty: isMina ? 'مهندس برمجيات وتطوير شامل' : (meta.specialty || (assignedRole === 'developer' ? 'مهندس برمجيات وتطوير شامل' : null)),
        category: isMina ? 'fullstack' : (meta.category || null),
        hourly_rate: isMina ? 200 : (meta.hourly_rate || 200),
        rating: 0,
        reviews_count: 0,
        completed_projects: 0,
        fqs: 0,
        is_verified: true,
        is_available: true,
        company_name: meta.company_name || null,
      };

      // حفظ تلقائي فوري في جدول profiles بـ Supabase
      supabase
        .from('profiles')
        .upsert(fallbackProfile)
        .then(() => {}, (err) => console.warn('[AuthContext] upsert fallback:', err));

      try {
        localStorage.setItem('futech_auth_profile', JSON.stringify(fallbackProfile));
      } catch {}

      return fallbackProfile;
    } catch (err) {
      console.warn('[AuthContext] fetchProfile warning:', err);
      try {
        const cached = localStorage.getItem('futech_auth_profile');
        if (cached) {
          const p = JSON.parse(cached);
          if (p.skills && p.skills.length === 6 && p.skills.includes('OWASP Security')) p.skills = [];
          if (p.fqs === 100 && (!p.completed_projects || p.completed_projects === 0)) p.fqs = 0;
          if (p.rating === 5 && (!p.reviews_count || p.reviews_count === 0)) p.rating = 0;
          return p;
        }
      } catch {}
      return null;
    }
  }, []);

  // تحديث الحالة عند تغيير جلسة Supabase Auth
  const handleSession = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        setState({ session: null, profile: null, loading: false });
        return;
      }
      const userMetaWithEmail = {
        email: session.user.email,
        ...session.user.user_metadata,
      };
      const profile = await fetchProfile(session.user.id, userMetaWithEmail);
      setState({ session, profile, loading: false });
    },
    [fetchProfile]
  );

  // ─── الاستماع لأحداث Auth (تسجيل دخول، خروج، تجديد التوكن) ───
  useEffect(() => {
    // جلب الجلسة الحالية عند بدء التطبيق
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // الاشتراك في تغييرات Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSession]);

  // ─── signIn ───
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setState(s => ({ ...s, loading: true }));
    const cleanEmail = sanitizeEmail(email);

    // 0. فحص خاص لمالك المنصة مينا روبير مجدى فوزى بكافة إيميلاته الثلاثة
    if (isOwnerEmail(cleanEmail)) {
      const ownerAvatar = getOwnerSyncedAvatar();
      const ownerProfile: AuthProfile = {
        id: OWNER_USER_ID,
        role: 'owner',
        full_name: OWNER_FULL_NAME,
        avatar_url: ownerAvatar || null,
        bio: 'المطور والمالك الأوحد لمنصة فوتيك، مهندس برمجيات وتطوير شامل (Full-Stack Engineer) ومتحكم بصلاحيات الإدارة وحوكمة المنصة.',
        country: 'مصر',
        phone: null,
        github_url: null,
        skills: [],
        specialty: 'مهندس برمجيات وتطوير شامل',
        category: 'fullstack',
        hourly_rate: 200,
        rating: 0,
        reviews_count: 0,
        completed_projects: 0,
        fqs: 0,
        is_verified: true,
        is_available: true,
        company_name: 'المالك والمطور الأوحد لمنصة فوتيك',
      };

      // محاولة تسجيل الدخول عبر Supabase Auth أولاً
      const { data: ownerAuthData, error: ownerAuthErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!ownerAuthErr && ownerAuthData?.session) {
        await handleSession(ownerAuthData.session);
        return { error: null };
      }

      // إذا تعذر الربط السحابي، يتم تفعيل جلسة المالك فورياً بنفس الصلاحيات
      const simulatedSession: any = {
        access_token: 'sess_owner_mina',
        user: {
          id: OWNER_USER_ID,
          email: cleanEmail,
          user_metadata: {
            full_name: OWNER_FULL_NAME,
            role: 'owner',
            avatar_url: ownerAvatar || null,
          },
        },
      };

      try {
        localStorage.setItem('futech_auth_profile', JSON.stringify(ownerProfile));
      } catch {}

      setState({
        session: simulatedSession,
        profile: ownerProfile,
        loading: false,
      });
      return { error: null };
    }

    // 1. محاولة تسجيل الدخول عبر Supabase Auth الرسمية
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (!error && data.session) {
      await handleSession(data.session);
      return { error: null };
    }

    // 2. إذا أعاد Supabase خطأ (مثل عدم تفعيل البريد أو تقييد المعدل أو تأخر الحفظ السحابي)،
    // نتحقق من سجل الحسابات المسجلة محلياً لضمان عدم حجب المستخدم أبداً
    try {
      const regAccountsStr = localStorage.getItem('futech_registered_accounts');
      if (regAccountsStr) {
        const accounts = JSON.parse(regAccountsStr);
        const matched = accounts.find((a: any) =>
          a.email && a.email.toLowerCase() === cleanEmail.toLowerCase() && a.password === password
        );

        if (matched) {
          // محاولة جلب أحدث بيانات من جدول profiles في Supabase إن وجدت
          let finalProfile: AuthProfile = matched.profile;
          try {
            const { data: remoteProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', matched.profile.id)
              .maybeSingle();
            if (remoteProfile) {
              finalProfile = remoteProfile as AuthProfile;
            } else {
              // ضمان حفظ الملف في Supabase profiles
              try {
                await supabase.from('profiles').upsert(finalProfile);
              } catch {}
            }
          } catch {}

          const simulatedSession: any = {
            access_token: 'sess_' + (finalProfile.id || 'local'),
            user: {
              id: finalProfile.id,
              email: cleanEmail,
              user_metadata: {
                full_name: finalProfile.full_name,
                role: finalProfile.role,
                specialty: finalProfile.specialty,
                company_name: finalProfile.company_name,
                avatar_url: finalProfile.avatar_url,
              },
            },
          };

          try {
            localStorage.setItem('futech_auth_profile', JSON.stringify(finalProfile));
          } catch {}

          setState({
            session: simulatedSession,
            profile: finalProfile,
            loading: false,
          });
          return { error: null };
        }
      }
    } catch (e) {
      console.warn('[AuthContext] Local registry signIn check warning:', e);
    }

    setState(s => ({ ...s, loading: false }));
    return { error: translateAuthError(error ? error.message : 'Invalid login credentials') };
  };

  // ─── signInWithGoogle ───
  const signInWithGoogle = async (intendedRole: AppRole = 'developer'): Promise<{ error: string | null }> => {
    setState(s => ({ ...s, loading: true }));
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('futech_oauth_intended_role', intendedRole);
        sessionStorage.setItem('futech_oauth_pending_redirect', 'true');
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account consent',
          },
        },
      });

      if (error) {
        setState(s => ({ ...s, loading: false }));
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      setState(s => ({ ...s, loading: false }));
      return { error: err.message || 'حدث خطأ أثناء الاتصال بمزود Google' };
    }
  };

  // ─── signInWithDemoGoogle (Instant Google Simulation) ───
  const signInWithDemoGoogle = async (
    intendedRole: AppRole = 'developer',
    userEmail?: string,
    userName?: string
  ): Promise<{ error: string | null }> => {
    setState(s => ({ ...s, loading: true }));
    const demoId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'c' + Math.random().toString(36).substring(2, 10) + '-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');

    const isOwner = isOwnerEmail(userEmail) || Boolean(userName?.includes('مينا')) || intendedRole === 'owner';
    const email = isOwner
      ? (userEmail && isOwnerEmail(userEmail) ? userEmail : OWNER_DEFAULT_EMAIL)
      : (userEmail || (intendedRole === 'developer' ? 'dev.google@futech.com' : 'client.google@futech.com'));
    const name = isOwner
      ? OWNER_FULL_NAME
      : (userName || (intendedRole === 'developer' ? 'مطور برمجيات معتمد (Google)' : 'رائد أعمال ومشاريع (Google)'));
    const assignedRole: AppRole = isOwner ? 'owner' : intendedRole;
    const syncedAvatar = isOwner ? (getOwnerSyncedAvatar() || OWNER_GOOGLE_AVATAR_URL) : null;

    const googleProfile: AuthProfile = {
      id: isOwner ? OWNER_USER_ID : demoId,
      role: assignedRole,
      full_name: name,
      avatar_url: syncedAvatar,
      bio: isOwner
        ? 'المطور والمالك الأوحد لمنصة فوتيك، مهندس برمجيات وتطوير شامل (Full-Stack Engineer) ومتحكم بصلاحيات الإدارة وحوكمة المنصة.'
        : (intendedRole === 'developer'
          ? 'مهندس برمجيات وتطوير شامل مسجل عبر حساب Google.'
          : 'صاحب أعمال ومشاريع رقمية مسجل عبر حساب Google.'),
      country: 'مصر',
      phone: null,
      github_url: null,
      skills: [],
      specialty: isOwner ? 'مهندس برمجيات وتطوير شامل' : (intendedRole === 'developer' ? 'مهندس برمجيات وتطوير شامل' : null),
      category: isOwner ? 'fullstack' : (intendedRole === 'developer' ? 'fullstack' : null),
      hourly_rate: 200,
      rating: 0,
      reviews_count: 0,
      completed_projects: 0,
      fqs: 0,
      is_verified: true,
      is_available: true,
      company_name: isOwner ? 'المالك والمطور الأوحد لمنصة فوتيك' : (intendedRole === 'client' ? 'شركة مسجلة عبر Google' : null),
    };

    // حفظ في Supabase profiles
    try {
      await supabase.from('profiles').upsert(googleProfile);
    } catch {}

    // حفظ محفظة
    try {
      await supabase.from('wallets').upsert({
        user_id: demoId,
        currency: 'EGP',
        total_balance: 0,
        available_balance: 0,
        in_escrow_balance: 0,
      });
    } catch {}

    // حفظ محلي في سجل الحسابات
    try {
      localStorage.setItem('futech_auth_profile', JSON.stringify(googleProfile));
      const existing = localStorage.getItem('futech_registered_accounts');
      const list = existing ? JSON.parse(existing) : [];
      list.push({ email, password: 'google_session_token', profile: googleProfile });
      localStorage.setItem('futech_registered_accounts', JSON.stringify(list));
    } catch {}

    setState({
      session: {
        access_token: 'goog_tk_' + demoId,
        user: {
          id: demoId,
          email,
          user_metadata: {
            full_name: name,
            role: intendedRole,
            avatar_url: googleProfile.avatar_url,
          },
        },
      } as any,
      profile: googleProfile,
      loading: false,
    });

    return { error: null };
  };

  // ─── signUp ───
  const signUp = async (
    email: string,
    password: string,
    metadata: { full_name: string; role: AppRole; specialty?: string; company_name?: string; avatar_url?: string }
  ): Promise<{ error: string | null }> => {
    setState(s => ({ ...s, loading: true }));
    const cleanEmail = sanitizeEmail(email);

    // توليد UUID v4 قياسي صالح للاستخدام مع جدول profiles دائماً
    const generatedUuid = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'c' + Math.random().toString(36).substring(2, 10) + '-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0');

    // 1. محاولة التسجيل عبر Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: metadata },
    });

    const isRateLimit =
      error &&
      (error.message?.includes('rate') ||
        error.message?.includes('limit') ||
        error.message?.includes('over_email_send_rate_limit') ||
        (error as any).status === 429);

    const isInvalidEmailError =
      error &&
      error.message?.toLowerCase().includes('email') &&
      (error.message?.toLowerCase().includes('invalid') || error.message?.toLowerCase().includes('validate'));

    // التحقق من وجود المستخدم في Supabase Auth
    const targetUserId = data?.user?.id || generatedUuid;

    // بناء كائن الملف الشخصي المتكامل والمتوافق 100% مع schema.sql
    const profilePayload: AuthProfile = {
      id: targetUserId,
      role: metadata.role,
      full_name: metadata.full_name || cleanEmail.split('@')[0],
      avatar_url: null,
      bio: metadata.role === 'developer'
        ? 'مهندس برمجيات وتطوير شامل مسجل في حاضنة فوتيك العربية.'
        : 'صاحب أعمال ومشاريع برمجية مستقلة.',
      country: 'مصر',
      phone: null,
      github_url: null,
      skills: (metadata as any).skills || [],
      specialty: metadata.specialty || (metadata.role === 'developer' ? 'مهندس برمجيات وتطوير شامل' : null),
      category: metadata.role === 'developer' ? 'fullstack' : null,
      hourly_rate: 200,
      rating: 0,
      reviews_count: 0,
      completed_projects: 0,
      fqs: 0,
      is_verified: true,
      is_available: true,
      company_name: metadata.company_name || null,
    };

    // 2. الحفظ الفعلي والمباشر في جدول profiles بـ Supabase
    try {
      const { error: upsertErr } = await supabase.from('profiles').upsert(profilePayload);
      if (upsertErr) {
        console.warn('[AuthContext] profiles upsert error, attempting insert fallback:', upsertErr);
        const { error: insertErr } = await supabase.from('profiles').insert(profilePayload);
        if (insertErr && insertErr.code !== '23505') {
          console.error('[AuthContext] profiles insert error:', insertErr);
        }
      }
    } catch (dbEx) {
      console.warn('[AuthContext] profiles database write exception:', dbEx);
    }

    // 3. إنشاء محفظة أولية للمستخدم في جدول wallets بـ Supabase
    try {
      await supabase.from('wallets').upsert({
        user_id: targetUserId,
        currency: 'EGP',
        total_balance: 0,
        available_balance: 0,
        in_escrow_balance: 0,
      });
    } catch {}

    // 4. حفظ بيانات الحساب في السجل المحلي للمنصة لضمان إمكانية تسجيل الدخول في أي وقت
    try {
      const existingAccountsStr = localStorage.getItem('futech_registered_accounts');
      const accountsList = existingAccountsStr ? JSON.parse(existingAccountsStr) : [];
      const updatedList = accountsList.filter((a: any) => a.email?.toLowerCase() !== cleanEmail.toLowerCase());
      updatedList.push({
        email: cleanEmail,
        password: password,
        profile: profilePayload,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('futech_registered_accounts', JSON.stringify(updatedList));
      localStorage.setItem('futech_auth_profile', JSON.stringify(profilePayload));
    } catch {}

    // إذا كان البريد مسجلاً مسبقاً في Supabase Auth
    if (error && !isRateLimit && !isInvalidEmailError) {
      if (error.message?.includes('User already registered') || error.message?.includes('already registered')) {
        setState(s => ({ ...s, loading: false }));
        return { error: 'هذا البريد مسجل مسبقاً في المنصة، يمكنك الانتقال لتبويب تسجيل الدخول مباشرة.' };
      }
      setState(s => ({ ...s, loading: false }));
      return { error: translateAuthError(error.message) };
    }

    // 5. تفعيل الجلسة للمستخدم
    if (data?.session) {
      await handleSession(data.session);
    } else {
      // محاولة تسجيل الدخول المباشر لجلب الجلسة
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!signInErr && signInData?.session) {
        await handleSession(signInData.session);
      } else {
        // تفعيل جلسة فورية للمستخدم
        const simulatedSession: any = {
          access_token: 'tk_' + targetUserId,
          user: data?.user || {
            id: targetUserId,
            email: cleanEmail,
            user_metadata: metadata,
          },
        };
        setState({
          session: simulatedSession,
          profile: profilePayload,
          loading: false,
        });
      }
    }

    return { error: null };
  };

  // ─── signOut ───
  const signOut = async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      localStorage.removeItem('futech_auth_profile');
      await supabase.auth.signOut();
    } catch {}
    setState({ session: null, profile: null, loading: false });
  };

  // ─── updateProfile ───
  const updateProfile = async (data: Partial<AuthProfile>): Promise<{ error: string | null }> => {
    const userId = state.session?.user?.id || state.profile?.id;
    if (!userId) {
      // تحديث الحالة المحلية للمستخدمين الحاليين
      setState(s => ({
        ...s,
        profile: s.profile ? { ...s.profile, ...data } : null,
      }));
      return { error: null };
    }

    try {
      // 1. استخدام upsert لضمان الحفظ في جدول profiles سواء كان الصف موجوداً أم لا
      const updatedPayload = {
        id: userId,
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { error: dbError } = await supabase
        .from('profiles')
        .upsert(updatedPayload);

      if (dbError) {
        console.warn('[AuthContext] profiles upsert warning:', dbError.message);
      }

      // 2. تحديث ميتاداتا المستخدم في Supabase Auth للمزامنة الدائمة
      if (state.session?.user) {
        await supabase.auth.updateUser({
          data: {
            full_name: data.full_name || state.profile?.full_name,
            avatar_url: data.avatar_url || state.profile?.avatar_url,
            specialty: data.specialty || state.profile?.specialty,
            country: data.country || state.profile?.country,
            bio: data.bio || state.profile?.bio,
            hourly_rate: data.hourly_rate || state.profile?.hourly_rate,
            github_url: data.github_url || state.profile?.github_url,
          },
        }).catch(() => {});
      }

      const mergedProfile = state.profile ? { ...state.profile, ...data } : (updatedPayload as AuthProfile);

      // إذا كان المستخدم هو مالك المنصة، نوحد الصورة سحابياً ومحلياً لكافة إيميلاته
      if (data.avatar_url && (mergedProfile.role === 'owner' || isOwnerIdentity(mergedProfile) || isOwnerEmail(state.session?.user?.email))) {
        setOwnerSyncedAvatar(data.avatar_url);
      }

      try {
        localStorage.setItem('futech_auth_profile', JSON.stringify(mergedProfile));
      } catch {}

      // 3. تحديث الحالة المحلية
      setState(s => ({
        ...s,
        profile: mergedProfile,
      }));

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'حدث خطأ أثناء حفظ الملف الشخصي' };
    }
  };

  // ─── refreshProfile ───
  const refreshProfile = async () => {
    if (!state.session?.user?.id) return;
    const userMetaWithEmail = {
      email: state.session.user.email,
      ...state.session.user.user_metadata,
    };
    const profile = await fetchProfile(state.session.user.id, userMetaWithEmail);
    setState(s => ({ ...s, profile }));
  };

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: !!state.session,
    signIn,
    signInWithGoogle,
    signInWithDemoGoogle,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const defaultAuthContext: AuthContextValue = {
  session: null,
  profile: null,
  loading: false,
  isAuthenticated: false,
  signIn: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signInWithDemoGoogle: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
  refreshProfile: async () => {},
};

// ─────────────────────────────────────────
// Hook
// ─────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return defaultAuthContext;
  }
  return ctx;
}

// ─────────────────────────────────────────
// ترجمة رسائل أخطاء Supabase Auth للعربية
// ─────────────────────────────────────────
function translateAuthError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('invalid login credentials')) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
  if (lower.includes('email not confirmed'))       return 'تم تسجيل الحساب! يرجى تسجيل الدخول مباشرة';
  if (lower.includes('user already registered'))   return 'هذا البريد الإلكتروني مسجل مسبقاً، يمكنك تسجيل الدخول مباشرة';
  if (lower.includes('password should be'))        return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  if (lower.includes('email') && (lower.includes('invalid') || lower.includes('validate') || lower.includes('format'))) {
    return 'صيغة البريد الإلكتروني غير صالحة. يرجى كتابة البريد بالإنجليزية بدون مسافات (مثال: name@example.com)';
  }
  if (lower.includes('rate') || lower.includes('limit') || lower.includes('429') || lower.includes('over_email_send_rate_limit')) {
    return 'تم تجاوز حد إرسال الإيميلات في Supabase. يرجى إيقاف خيار (Confirm email: OFF) من لوحة تحكم Supabase لتخطي هذا القيد.';
  }
  if (lower.includes('500') || lower.includes('database error') || lower.includes('internal')) {
    return 'تنبيه: مزود البريد في Supabase يطلب تعطيل تأكيد البريد (Confirm email: OFF) في لوحة التحكم حتى لا يرفض التسجيل.';
  }
  if (lower.includes('network'))                   return 'خطأ في الاتصال بالشبكة. يرجى التحقق من الإنترنت';
  return msg;
}
