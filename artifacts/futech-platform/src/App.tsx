import { useEffect, useState, useMemo, useRef, lazy, Suspense } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CodeXml, Plus, Users, BriefcaseBusiness, Activity, MessageCircle,
  BookOpen, Bell, Menu, X, ArrowLeft, ArrowUpRight, BadgeCheck,
  CheckCircle2, Search, CircleUserRound, CalendarDays, MoreHorizontal,
  Send, Layers, ShieldCheck, DollarSign, LogOut, ExternalLink, Check,
  Crown, Paperclip, Trash2, UploadCloud, FileText, Archive, Eye, Download,
  User as UserIcon, LogIn, UserPlus, Building2, Briefcase, FileCode2,
  CheckCircle, Wallet, Settings, Compass, Sparkles
} from 'lucide-react';
import {
  Store, Project, ProjectAttachment, Developer, Application, Conversation, Ticket, Doc, Delivery, MessageItem, MessageAttachment,
  INITIAL_DEVELOPERS, INITIAL_PROJECTS, INITIAL_TICKETS, INITIAL_DOCS, INITIAL_DELIVERIES, INITIAL_CONVERSATIONS,
  User, UserRole, FqsWeights, INITIAL_CLIENT_WALLET, INITIAL_DEVELOPER_WALLET, UserWallet,
  INITIAL_NOTIFICATIONS, AppNotification
} from './types';
import { useAuth } from './lib/AuthContext';
import {
  isOwnerEmail,
  isOwnerIdentity,
  OWNER_FULL_NAME,
  getOwnerSyncedAvatar,
  setOwnerSyncedAvatar,
  OWNER_GOOGLE_AVATAR_URL,
  buildOwnerDeveloper,
} from './lib/ownerAuth';
import {
  fetchDevelopers,
  fetchProjects,
  fetchUserWallet,
  saveProjectToSupabase,
  saveProposalToSupabase,
  sendMessageInSupabase,
  subscribeToLiveMessages,
} from './lib/supabaseData';
import { sendBrowserNotification } from './lib/webPushNotifications';

// Code-splitting via React.lazy for all pages & heavy modals
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const DevelopersPage = lazy(() =>
  import('./pages/DevelopersPage').then((m) => ({ default: m.DevelopersPage }))
);
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const PostProjectPage = lazy(() =>
  import('./pages/PostProjectPage').then((m) => ({ default: m.PostProjectPage }))
);
const ChatPage = lazy(() =>
  import('./pages/ChatPage').then((m) => ({ default: m.ChatPage }))
);
const NotFound = lazy(() =>
  import('./pages/not-found').then((m) => ({ default: m.NotFound }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const ProjectModal = lazy(() =>
  import('./components/ProjectModal').then((m) => ({ default: m.ProjectModal }))
);
const DeveloperDashboard = lazy(() =>
  import('./pages/DeveloperDashboard').then((m) => ({ default: m.DeveloperDashboard }))
);
const ClientDashboard = lazy(() =>
  import('./pages/ClientDashboard').then((m) => ({ default: m.ClientDashboard }))
);
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const OwnerDashboard = lazy(() =>
  import('./pages/OwnerDashboard').then((m) => ({ default: m.OwnerDashboard }))
);
const SupportPage = lazy(() =>
  import('./pages/SupportPage').then((m) => ({ default: m.SupportPage }))
);
const SuggestionsPage = lazy(() =>
  import('./pages/SuggestionsPage').then((m) => ({ default: m.SuggestionsPage }))
);
const DocsPage = lazy(() =>
  import('./pages/DocsPage').then((m) => ({ default: m.DocsPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const CookiesPolicyPage = lazy(() =>
  import('./pages/CookiesPolicyPage').then((m) => ({ default: m.CookiesPolicyPage }))
);
const StaffIsolatedGateway = lazy(() =>
  import('./pages/StaffIsolatedGateway').then((m) => ({ default: m.StaffIsolatedGateway }))
);

function PageLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-16" dir="rtl">
      <div className="relative">
        <div className="h-12 w-12 rounded-2xl border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-teal-400 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-xs font-black tracking-wide text-slate-400 animate-pulse">
        جاري تحميل مساحة العمل...
      </p>
    </div>
  );
}
const UnifiedNavbar = lazy(() =>
  import('./components/UnifiedNavbar').then((m) => ({ default: m.UnifiedNavbar }))
);
const Footer = lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer }))
);
const FloatingControls = lazy(() =>
  import('./components/FloatingControls').then((m) => ({ default: m.FloatingControls }))
);
const CookieConsentBanner = lazy(() =>
  import('./components/CookieConsentBanner').then((m) => ({ default: m.CookieConsentBanner }))
);
const DeveloperPortalLayout = lazy(() =>
  import('./components/DeveloperPortalLayout').then((m) => ({ default: m.DeveloperPortalLayout }))
);
import { DaySplashLoader } from './components/DaySplashLoader';
import { ThemeToggle } from './components/ThemeToggle';
import { UserAvatar } from './components/UserAvatar';
import { recordPageView } from './lib/visitorTracking';

const STORAGE_KEY = 'futech_platform_v8_live';

// One-time cleanup of legacy localStorage
try {
  localStorage.removeItem('futech_platform_v7');
  localStorage.removeItem('futech_platform_v6');
  localStorage.removeItem('futech_platform_v5');
} catch {}

function loadInitialStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        developers: [],
        projects: [],
        applications: [],
        conversations: [],
        tickets: [],
        docs: INITIAL_DOCS,
        deliveries: [],
        currentUser: null as any,
        fqsWeights: {
          completionRate: 35,
          onTimeBudget: 30,
          clientRating: 20,
          repeatHireRate: 15,
        },
        clientWallet: INITIAL_CLIENT_WALLET,
        developerWallet: INITIAL_DEVELOPER_WALLET,
        notifications: INITIAL_NOTIFICATIONS,
      };
    }
    const parsed = JSON.parse(raw);
    // Documentation and legal policies are authoritative and must always strictly reflect the latest INITIAL_DOCS
    const mergedDocs = INITIAL_DOCS;
    const rawDevs = Array.isArray(parsed.developers) ? parsed.developers : [];
    const otherDevs = rawDevs.filter((d: any) => {
      return d.id !== 'usr-owner-mina' && d.id !== 'e75a3a4f-b00b-458d-98a5-16d53922e54b' && d.name !== 'المهندس مينا روبير مجدى فوزى' && !d.level?.includes('المالك');
    });
    const ownerDev = buildOwnerDeveloper();
    const sanitizedDevs = [ownerDev, ...otherDevs];

    let sanitizedUser = parsed.currentUser && parsed.currentUser.id ? parsed.currentUser : null;
    if (sanitizedUser) {
      if (sanitizedUser.email && isOwnerEmail(sanitizedUser.email)) {
        sanitizedUser.name = OWNER_FULL_NAME;
        sanitizedUser.role = 'owner';
        const syncedAvatar = getOwnerSyncedAvatar();
        if (syncedAvatar) {
          sanitizedUser.avatar = syncedAvatar;
        } else if (sanitizedUser.avatar) {
          setOwnerSyncedAvatar(sanitizedUser.avatar);
        } else {
          sanitizedUser.avatar = OWNER_GOOGLE_AVATAR_URL;
          setOwnerSyncedAvatar(OWNER_GOOGLE_AVATAR_URL);
        }
      } else {
        if (sanitizedUser.role === 'owner') {
          sanitizedUser.role = 'developer';
        }
      }
      if (sanitizedUser.avatar) {
        if (
          sanitizedUser.avatar.includes('dev-male') ||
          sanitizedUser.avatar.includes('dev-female')
        ) {
          sanitizedUser = { ...sanitizedUser, avatar: '' };
        }
      }
      // Purge any legacy mock injected skills/scores
      if (Array.isArray(sanitizedUser.skills) && (sanitizedUser.skills.includes('OWASP Security') || (sanitizedUser.skills.length === 4 && sanitizedUser.skills.includes('PostgreSQL') && sanitizedUser.skills.includes('React 19')))) {
        sanitizedUser.skills = [];
      }
      if (sanitizedUser.fqs === 100 && (!sanitizedUser.completedProjects || sanitizedUser.completedProjects === 0)) {
        sanitizedUser.fqs = 0;
      }
      if (sanitizedUser.rating === 5 && (!sanitizedUser.reviewsCount || sanitizedUser.reviewsCount === 0)) {
        sanitizedUser.rating = 0;
      }
    }

    const rawApps = Array.isArray(parsed.applications) ? parsed.applications : [];
    const sanitizedApps = rawApps.filter((a: any) => !a?.id?.startsWith('app-tariq') && !a?.id?.startsWith('app-layan') && !a?.id?.startsWith('app-sarah'));

    return {
      developers: sanitizedDevs,
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      applications: sanitizedApps,
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
      docs: mergedDocs.length >= INITIAL_DOCS.length ? mergedDocs : INITIAL_DOCS,
      deliveries: Array.isArray(parsed.deliveries) ? parsed.deliveries : [],
      currentUser: sanitizedUser,
      fqsWeights: parsed.fqsWeights || {
        completionRate: 35,
        onTimeBudget: 30,
        clientRating: 20,
        repeatHireRate: 15,
      },
      clientWallet: parsed.clientWallet || INITIAL_CLIENT_WALLET,
      developerWallet: parsed.developerWallet || INITIAL_DEVELOPER_WALLET,
      notifications: Array.isArray(parsed.notifications)
        ? parsed.notifications.filter(
            (n: any) =>
              !n?.id?.startsWith('notif-escrow') &&
              !n?.id?.startsWith('notif-delivery') &&
              !n?.id?.startsWith('notif-proposal') &&
              !n?.id?.startsWith('notif-sla') &&
              !n?.id?.startsWith('notif-git')
          )
        : [],
    };
  } catch {
    return {
      developers: [],
      projects: [],
      applications: [],
      conversations: [],
      tickets: [],
      docs: INITIAL_DOCS,
      deliveries: [],
      currentUser: null as any,
      fqsWeights: {
        completionRate: 35,
        onTimeBudget: 30,
        clientRating: 20,
        repeatHireRate: 15,
      },
      clientWallet: INITIAL_CLIENT_WALLET,
      developerWallet: INITIAL_DEVELOPER_WALLET,
      notifications: INITIAL_NOTIFICATIONS,
    };
  }
}

export default function App() {
  const [location, setLocation] = useLocation();
  const searchStr = useSearch();
  const path = location.split('?')[0];
  const [store, setStore] = useState<Store>(loadInitialStore);
  const [toast, setToast] = useState('');
  const [showDaySplash, setShowDaySplash] = useState(true);
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null);

  // Supabase Auth
  const auth = useAuth();

  // Auth & Account State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<'developer' | 'client'>('developer');
  const [authInitialPortal, setAuthInitialPortal] = useState<'members' | 'admin' | 'owner'>('members');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Track Pageview and Unique Visitor across routes
  useEffect(() => {
    recordPageView(path);
  }, [path]);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.body.dir = 'rtl';
  }, []);

  // Scroll to top immediately on route/navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location, searchStr]);

  // 0. Force sync authoritative legal and platform documentation from INITIAL_DOCS to purge any stale cached docs
  useEffect(() => {
    setStore((prev) => ({
      ...prev,
      docs: INITIAL_DOCS,
    }));
  }, []);

  // 1. Live Data Sync from Supabase (Real Developers & Projects)
  useEffect(() => {
    let isMounted = true;
    const loadLivePlatformData = async () => {
      try {
        const [liveDevs, liveProjects] = await Promise.all([
          fetchDevelopers(),
          fetchProjects(),
        ]);
        if (!isMounted) return;
        setStore((prev) => ({
          ...prev,
          developers: liveDevs,
          projects: liveProjects,
        }));
      } catch (err) {
        console.error('Error fetching live data:', err);
      }
    };

    loadLivePlatformData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Sync Authenticated User & Live Wallet from Supabase Auth
  useEffect(() => {
    const currentProfile = auth.profile;
    if (currentProfile) {
      setStore((prev) => {
        const activeEmail = auth.session?.user?.email || (currentProfile as any).email || '';
        const isMina = Boolean(activeEmail && isOwnerEmail(activeEmail));
        const resolvedRole: UserRole = isMina
          ? 'owner'
          : (currentProfile.role === 'admin' ? 'admin' : (currentProfile.role === 'client' ? 'client' : 'developer'));

        // Extract Google avatar from session metadata if present
        const googleAvatar =
          auth.session?.user?.user_metadata?.avatar_url ||
          auth.session?.user?.user_metadata?.picture ||
          (auth.session?.user as any)?.identities?.[0]?.identity_data?.avatar_url ||
          (auth.session?.user as any)?.identities?.[0]?.identity_data?.picture ||
          '';

        let resolvedAvatar = googleAvatar || currentProfile.avatar_url || '';
        if (isMina) {
          if (googleAvatar) {
            setOwnerSyncedAvatar(googleAvatar);
            resolvedAvatar = googleAvatar;
          } else {
            const synced = getOwnerSyncedAvatar();
            if (resolvedAvatar && !synced) {
              setOwnerSyncedAvatar(resolvedAvatar);
            } else if (synced) {
              resolvedAvatar = synced;
            } else {
              resolvedAvatar = OWNER_GOOGLE_AVATAR_URL;
              setOwnerSyncedAvatar(OWNER_GOOGLE_AVATAR_URL);
            }
          }
        }

        const liveUser: User = {
          id: isMina ? 'usr-owner-mina' : currentProfile.id,
          name: isMina ? OWNER_FULL_NAME : (currentProfile.full_name || 'مستخدم مسجل'),
          email: activeEmail,
          role: resolvedRole,
          avatar: resolvedAvatar,
          title: isMina ? 'المالك التنفيذي ومطور المنصة الأوحد' : (currentProfile.specialty || 'عضو مسجل'),
          company: isMina ? 'المالك والمطور الأوحد لمنصة فوتيك' : (currentProfile.company_name || ''),
          country: isMina ? 'جمهورية مصر العربية' : (currentProfile.country || 'مصر'),
          currency: isMina ? 'ج.م' : (currentProfile.country === 'السعودية' ? 'ر.س' : 'ج.م'),
          currencyCode: isMina ? 'EGP' : (currentProfile.country === 'السعودية' ? 'SAR' : 'EGP'),
          bio: isMina ? 'المطور والمالك الأوحد لمنصة فوتيك، مهندس برمجيات وتطوير شامل (Full-Stack Engineer) ومتحكم بصلاحيات الإدارة وحوكمة المنصة.' : (currentProfile.bio || ''),
          githubUrl: isMina ? 'https://github.com/minarob23' : (currentProfile.github_url || undefined),
          hourlyRate: isMina ? 1750 : (currentProfile.hourly_rate || 200),
          skills: currentProfile.skills || [],
          verified: true,
          createdAt: isMina ? '2024-01-01' : ((currentProfile as any).created_at || new Date().toISOString().split('T')[0]),
        };

        return {
          ...prev,
          currentUser: liveUser,
        };
      });
      // Fetch user's real wallet from Supabase
      const isMina =
        isOwnerIdentity(currentProfile) ||
        isOwnerEmail(auth.session?.user?.email);

      fetchUserWallet(currentProfile.id).then((wallet) => {
        if (auth.profile?.role === 'developer' || isMina) {
          setStore((prev) => ({ ...prev, developerWallet: wallet }));
        } else {
          setStore((prev) => ({ ...prev, clientWallet: wallet }));
        }
      });
    } else if (!auth.session) {
      setStore((prev) => {
        if (prev.currentUser) {
          return { ...prev, currentUser: null as any };
        }
        return prev;
      });
    }
  }, [auth.profile, auth.session]);

  // Handle post-OAuth redirect based on role or owner status
  useEffect(() => {
    if (!store.currentUser) return;

    if (typeof window !== 'undefined') {
      const isOAuthPending =
        sessionStorage.getItem('futech_oauth_pending_redirect') === 'true' ||
        window.location.hash.includes('access_token') ||
        window.location.search.includes('code=');

      if (isOAuthPending) {
        sessionStorage.removeItem('futech_oauth_pending_redirect');

        const isOwner =
          store.currentUser.role === 'owner' ||
          isOwnerIdentity(store.currentUser) ||
          isOwnerEmail(store.currentUser.email);

        if (isOwner) {
          notify('مرحباً بك يا بشمهندس مينا! تم التعرف على حسابك كمالك المنصة والدخول بنجاح 👑');
          setLocation('/owner-dashboard');
        } else if (store.currentUser.role === 'developer') {
          notify(`أهلاً بك يا ${store.currentUser.name}! تم تسجيل دخولك بنجاح كمطور برمجيات 💻`);
          setLocation('/dashboard');
        } else if (store.currentUser.role === 'client') {
          notify(`أهلاً بك يا ${store.currentUser.name}! تم تسجيل دخولك بنجاح كصاحب عمل 🏢`);
          setLocation('/client-dashboard');
        }
      }
    }
  }, [store.currentUser, setLocation]);

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

  useEffect(() => {
    if (path === '/login' || path === '/register' || path === '/signup') {
      setAuthInitialPortal('members');
      setAuthInitialMode(path === '/login' ? 'login' : 'register');
      setAuthModalOpen(true);
    }
  }, [path, store.currentUser]);

  const notify = (msg: string) => setToast(msg);
  const update = (key: keyof Store, value: any) =>
    setStore((prev) => ({
      ...prev,
      [key]: typeof value === 'function' ? value(prev[key]) : value,
    }));

  const validRoutes = [
    '/',
    '/client-dashboard',
    '/admin',
    '/admin-login',
    '/owner-dashboard',
    '/owner-login',
    '/staff-portal',
    '/secret-portal',
    '/system-portal',
    '/login',
    '/register',
    '/signup',
    '/developers',
    '/projects',
    '/post-project',
    '/dashboard',
    '/chat',
    '/docs',
    '/support',
    '/suggestions',
    '/cookies',
    '/cookie-policy',
    '/terms',
    '/privacy-policy',
  ];
  const isNotFound = !validRoutes.includes(path);
  const route = isNotFound ? '/404' : path;

  // 0. 404 Not Found Page
  if (isNotFound) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="not-found"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense fallback={<PageLoadingFallback />}>
            <NotFound onGoHome={() => setLocation('/')} />
          </Suspense>
          {toast && <ToastMessage message={toast} />}
        </motion.div>
      </AnimatePresence>
    );
  }

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
          <Suspense fallback={<PageLoadingFallback />}>
            <HomePage
              store={store}
              update={update}
              go={setLocation}
              notify={notify}
              isLandingVisible={!showDaySplash}
              onOpenAuth={(role, mode, portal) => {
                if (store.currentUser) {
                  const target = portal === 'owner' || store.currentUser.role === 'owner'
                    ? '/owner-dashboard'
                    : portal === 'admin' || store.currentUser.role === 'admin'
                    ? '/admin'
                    : store.currentUser.role === 'developer'
                    ? '/dashboard'
                    : '/client-dashboard';
                  setLocation(target);
                  notify(`أنت مسجل الدخول بالفعل بحساب: ${store.currentUser.name}`);
                  return;
                }
                setAuthInitialRole(role || 'developer');
                setAuthInitialMode(mode || 'login');
                setAuthInitialPortal(portal || 'members');
                setAuthModalOpen(true);
              }}
              onSwitchUser={(user) => {
                update('currentUser', user);
              }}
            />
          </Suspense>
          {showDaySplash && (
            <DaySplashLoader onComplete={() => setShowDaySplash(false)} />
          )}
          {toast && <ToastMessage message={toast} />}
          <Suspense fallback={null}>
            <CookieConsentBanner go={setLocation} />
          </Suspense>
          {authModalOpen && (
            <Suspense fallback={null}>
              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                currentUser={store.currentUser || undefined}
                onLogin={(user) => {
                  update('currentUser', user);
                }}
                notify={notify}
                go={setLocation}
                initialMode={authInitialMode}
                initialRole={authInitialRole}
                initialPortal={authInitialPortal}
              />
            </Suspense>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // 2. Dedicated Developer Portal (/dashboard, /chat, /docs)
  if (isDeveloperPortal) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <DeveloperPortalLayout
          store={store}
          route={route}
          searchStr={searchStr}
          notify={notify}
        >
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
            <Suspense fallback={<PageLoadingFallback />}>
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
                      requestedId={new URLSearchParams(location.split('?')[1] || '').get('conversation') || undefined}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>

          {showDaySplash && (
            <DaySplashLoader onComplete={() => setShowDaySplash(false)} />
          )}
          {toast && <ToastMessage message={toast} />}
          <Suspense fallback={null}>
            <CookieConsentBanner go={setLocation} />
          </Suspense>
        </DeveloperPortalLayout>
      </Suspense>
    );
  }

  // 3. Public Platform Pages (/developers, /projects, /post-project, /docs)
  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1a2d42] dark:bg-[#070c16] dark:text-slate-100" dir="rtl">
      {/* Unified World-Class Modern Navbar */}
      <Suspense fallback={<div className="h-20 w-full bg-white dark:bg-[#070c16] border-b border-slate-200/80 dark:border-slate-800" />}>
        <UnifiedNavbar
          currentUser={store.currentUser || undefined}
          store={store}
          update={update}
          go={setLocation}
          onOpenAuth={(role, mode, portal) => {
            if (store.currentUser) {
              const target = portal === 'owner' || store.currentUser.role === 'owner'
                ? '/owner-dashboard'
                : portal === 'admin' || store.currentUser.role === 'admin'
                ? '/admin'
                : store.currentUser.role === 'developer'
                ? '/dashboard'
                : '/client-dashboard';
              setLocation(target);
              notify(`أنت مسجل الدخول بالفعل بحساب: ${store.currentUser.name}`);
              return;
            }
            setAuthInitialRole(role || 'developer');
            setAuthInitialMode(mode || 'login');
            setAuthInitialPortal(portal || 'members');
            setAuthModalOpen(true);
          }}
          onSwitchUser={(user) => update('currentUser', user)}
          onLogout={async () => {
            await auth.signOut();
            update('currentUser', null as any);
            setLocation('/');
            notify('تم تسجيل الخروج بنجاح 👋');
          }}
          notify={notify}
        />
      </Suspense>

      {/* Main Public Content Layout (Full Width) */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<PageLoadingFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
            {route === '/client-dashboard' && (
              <ClientDashboard
                store={store}
                update={update}
                notify={notify}
                go={setLocation}
                currentUser={store.currentUser || undefined}
              />
            )}
            {(route === '/admin-login' || route === '/owner-login' || route === '/staff-portal' || route === '/secret-portal' || route === '/system-portal') && (
              <StaffIsolatedGateway
                store={store}
                update={update}
                notify={notify}
                go={setLocation}
                initialPortal={route === '/admin-login' ? 'admin' : 'owner'}
              />
            )}
            {(route === '/login' || route === '/register' || route === '/signup') && (
              <div className="mx-auto max-w-lg my-12 rounded-[32px] border border-slate-200/80 bg-white p-8 text-center shadow-xl transition-colors dark:border-slate-800 dark:bg-[#0c1524]">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-600 ring-2 ring-teal-500/30 shadow-md dark:bg-teal-950/60 dark:text-teal-400">
                  <UserIcon size={32} />
                </div>
                <h2 className="mt-4 text-xl font-black text-[#14283d] dark:text-white">
                  {route === '/login' ? 'تسجيل الدخول إلى فوتيك' : 'إنشاء حساب جديد في فوتيك'}
                </h2>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {store.currentUser
                    ? `أنت متصل حالياً بحساب: ${store.currentUser.name}. يمكنك الدخول بحساب آخر أو إنشاء حساب جديد أدناه.`
                    : (route === '/login' ? 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم وحسابك' : 'أنشئ حسابك الجديد كمهندس برمجيات أو صاحب مشروع')}
                </p>
                <div className="mt-6 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthInitialPortal('members');
                        setAuthInitialMode('login');
                        setAuthModalOpen(true);
                      }}
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-xs font-black text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <LogIn size={15} className="text-teal-600 dark:text-teal-400" />
                      <span>نافذة تسجيل الدخول</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthInitialPortal('members');
                        setAuthInitialMode('register');
                        setAuthModalOpen(true);
                      }}
                      className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 text-xs font-black text-white shadow-md shadow-teal-500/20 hover:brightness-105"
                    >
                      <UserPlus size={15} />
                      <span>نافذة إنشاء حساب</span>
                    </button>
                  </div>

                  {store.currentUser && (
                    <Link
                      href={store.currentUser.role === 'owner' ? '/owner-dashboard' : store.currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <span>المتابعة إلى لوحة التحكم ({store.currentUser.name})</span>
                      <ArrowLeft size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )}
            {route === '/admin' && (
              store.currentUser?.role === 'admin' || store.currentUser?.role === 'owner' ? (
                <AdminDashboard
                  store={store}
                  update={update}
                  notify={notify}
                  setModal={setModal}
                  go={setLocation}
                  currentUser={store.currentUser || undefined}
                />
              ) : (
                <div className="mx-auto max-w-lg my-14 rounded-[32px] border border-slate-200/80 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-[#0c1524]" dir="rtl">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 ring-2 ring-indigo-500/30 shadow-md dark:bg-indigo-950/60 dark:text-indigo-400">
                    <ShieldCheck size={32} />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-[#14283d] dark:text-white">منطقة إدارية مشفرة ومحمية (Admin Clearance)</h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    تم حجب هذه اللوحة تلقائياً. للوصول إليها، يرجى تسجيل الدخول عبر البوابة الإدارية المعزولة المخصصة للمشرفين.
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => setLocation('/admin-login')}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-black text-white shadow-lg shadow-indigo-600/20 hover:brightness-105 transition"
                    >
                      <ShieldCheck size={16} />
                      <span>الانتقال إلى بوابة الإدارة المعزولة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocation('/')}
                      className="flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      العودة إلى الموقع العام
                    </button>
                  </div>
                </div>
              )
            )}
            {route === '/owner-dashboard' && (
              Boolean(store.currentUser?.email && isOwnerEmail(store.currentUser.email)) ? (
                <OwnerDashboard
                  store={store}
                  update={update}
                  notify={notify}
                  go={setLocation}
                  currentUser={store.currentUser || undefined}
                />
              ) : (
                <div className="mx-auto max-w-lg my-14 rounded-[32px] border border-slate-200/80 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-[#0c1524]" dir="rtl">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-50 text-amber-600 ring-2 ring-amber-500/30 shadow-md dark:bg-amber-950/60 dark:text-amber-400">
                    <Crown size={32} />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-[#14283d] dark:text-white">مجلس الحوكمة العليا لمالك المنصة</h2>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    لوحة التحكم التنفيذية معزولة ومخصصة حصرياً للمطور والمالك الأوحد للمنصة (مينا روبير مجدى فوزى). يرجى تأكيد الصلاحيات للمتابعة.
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => setLocation('/owner-login')}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-105 transition"
                    >
                      <Crown size={16} />
                      <span>تسجيل دخول المالك في البوابة المعزولة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocation('/')}
                      className="flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      العودة إلى الموقع العام
                    </button>
                  </div>
                </div>
              )
            )}
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
            {route === '/suggestions' && (
              <SuggestionsPage notify={notify} go={setLocation} />
            )}
            {(route === '/cookies' || route === '/cookie-policy') && (
              <CookiesPolicyPage store={store} notify={notify} go={setLocation} />
            )}
            {(route === '/terms' || route === '/privacy-policy') && (
              <TermsPage go={setLocation} notify={notify} />
            )}
          </motion.div>
        </AnimatePresence>
        </Suspense>
      </main>

      {/* Public Footer */}
      <Suspense fallback={null}>
        <Footer onNotify={notify} />
      </Suspense>

      {/* Floating Controls for Public Pages */}
      <Suspense fallback={null}>
        <FloatingControls isHome={false} />
      </Suspense>

      {toast && <ToastMessage message={toast} />}

      {/* Cookie Consent Banner */}
      <Suspense fallback={null}>
        <CookieConsentBanner go={setLocation} />
      </Suspense>

      {/* Auth Modal */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            currentUser={store.currentUser || undefined}
            onLogin={(user) => {
              update('currentUser', user);
            }}
            notify={notify}
            go={setLocation}
            initialMode={authInitialMode}
            initialRole={authInitialRole}
            initialPortal={authInitialPortal}
          />
        </Suspense>
      )}

      {/* Modal */}
      {modal && (
        <Suspense fallback={null}>
          <ProjectModal
            modal={modal}
            close={() => setModal(null)}
            store={store}
            update={update}
            notify={notify}
          />
        </Suspense>
      )}

      {showDaySplash && (
        <DaySplashLoader onComplete={() => setShowDaySplash(false)} />
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
      className="fixed bottom-6 left-6 z-[99999] flex items-center gap-2 rounded-2xl bg-[#162c44] px-5 py-3 text-xs font-bold text-white shadow-2xl"
    >
      <CheckCircle2 size={16} className="text-[#3ec4cb]" />
      <span>{message}</span>
    </motion.div>
  );
}
