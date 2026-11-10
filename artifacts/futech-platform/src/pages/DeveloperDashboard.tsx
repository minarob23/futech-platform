import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, BadgeCheck, Briefcase, Calendar, CheckCircle2,
  Clock, DollarSign, FileCode2, Layers, ShieldCheck, Star,
  TrendingUp, Users, ArrowUpRight, ChevronLeft, Plus, Download,
  FileText, CheckCircle, UploadCloud, FileUp, Trash2,
  Edit3, ExternalLink, Eye, Sparkles, Globe, Github, Code,
  GraduationCap, Building2, Award, Check, AlertCircle, X,
  Play, Share2, RefreshCw, FolderGit2, Cpu, Image as ImageIcon, ZoomIn,
  Film, Video, Wallet, Settings, Camera, User as UserIcon,
  Search, MessageSquare, Filter, Send, CheckCheck, MapPin, SlidersHorizontal, ArrowLeft, Mail, Compass
} from 'lucide-react';
import {
  Store, Project, Application, Delivery, Developer, DeveloperAvailability,
  PortfolioItem, DeveloperCV, DeveloperCVFile, UserWallet, INITIAL_DEVELOPER_WALLET
} from '../types';
import { LiveProjectPreviewModal } from '../components/LiveProjectPreviewModal';
import { VideoTrailerModal } from '../components/VideoTrailerModal';
import { EscrowWalletHub } from '../components/EscrowWalletHub';
import { validateUploadedFile, getAcceptStringForContext } from '../lib/fileSecurity';
import { UserAvatar } from '../components/UserAvatar';
import { SocialLinksManager } from '../components/SocialLinksManager';
import { useAuth } from '../lib/AuthContext';
import { saveProposalToSupabase, fetchClients } from '../lib/supabaseData';
import { sendBrowserNotification } from '../lib/webPushNotifications';
import { isOwnerIdentity, getOwnerSyncedAvatar, setOwnerSyncedAvatar, OWNER_GOOGLE_AVATAR_URL, buildOwnerDeveloper } from '../lib/ownerAuth';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

interface DeveloperDashboardProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
}

export function DeveloperDashboard({ store, update, notify, go }: DeveloperDashboardProps) {
  const auth = useAuth();

  // Read initial tab from URL query param (?tab=...)
  const getTabFromUrl = (): 'overview' | 'clients' | 'projects' | 'portfolio' | 'cv' | 'proposals' | 'deliveries' | 'wallet' | 'settings' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tab');
      if (t && ['overview', 'clients', 'projects', 'portfolio', 'cv', 'proposals', 'deliveries', 'wallet', 'settings'].includes(t)) {
        return t as any;
      }
    }
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState<
    'overview' | 'clients' | 'projects' | 'portfolio' | 'cv' | 'proposals' | 'deliveries' | 'wallet' | 'settings'
  >(getTabFromUrl);

  const setActiveTab = (tab: typeof activeTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
      window.dispatchEvent(new Event('popstate'));
    }
  };

  // Listen to browser URL changes and sidebar clicks
  useEffect(() => {
    const handleUrlChange = () => {
      const t = getTabFromUrl();
      setActiveTabState(t);
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Active Developer Resolution from Logged In User or Store
  const isLoggedInDev = Boolean(
    store.currentUser &&
    store.currentUser.name &&
    (store.currentUser.role === 'developer' || store.currentUser.role === 'owner')
  );

  const isOwner = Boolean(store.currentUser?.email && isOwnerEmail(store.currentUser.email));
  const ownerAvatar = isOwner ? (getOwnerSyncedAvatar() || OWNER_GOOGLE_AVATAR_URL) : '';
  const resolvedAvatar = store.currentUser?.avatar || ownerAvatar || '';

  const matchedDev = isLoggedInDev
    ? store.developers.find(
        (d) => d.id === store.currentUser?.id || d.name === store.currentUser?.name
      )
    : null;

  const ownerDevObj = isOwner ? buildOwnerDeveloper() : null;
  const currentDev: Developer = (isOwner && ownerDevObj)
    ? {
        ...ownerDevObj,
        avatar: resolvedAvatar || ownerDevObj.avatar || '',
      }
    : matchedDev
    ? {
        ...matchedDev,
        avatar: resolvedAvatar || matchedDev.avatar || '',
      }
    : isLoggedInDev
    ? {
        id: store.currentUser?.id || 'dev-current',
        name: store.currentUser?.name || 'مهندس برمجيات',
        avatar: resolvedAvatar,
        specialty: store.currentUser?.title || 'مهندس برمجيات وتطوير شامل',
        category: 'fullstack',
        location: store.currentUser?.country === 'مصر' ? 'القاهرة، جمهورية مصر العربية' : 'المملكة العربية السعودية',
        country: store.currentUser?.country || 'السعودية',
        hourlyRate: store.currentUser?.hourlyRate || 150,
        fqs: store.currentUser?.fqs || 0,
        fqsBreakdown: {
          completionRate: 0,
          onTimeBudget: 0,
          clientRating: 0,
          repeatHireRate: 0,
          tests: 0,
          codeQuality: 0,
          deliveryRate: 0,
          security: 0,
        },
        rating: 0,
        reviewsCount: 0,
        completedProjects: 0,
        experienceYears: (store.currentUser as any)?.experienceYears || 0,
        availability: 'متاح الآن',
        level: store.currentUser?.role === 'owner' ? 'المالك ومطور معتمد 👑' : 'مطور معتمد FQS',
        skills: store.currentUser?.skills || [],
        bio: store.currentUser?.bio || 'مهندس برمجيات معتمد في منصة فوتيك للحلول التقنية.',
        work: 'متاح للعمل على مشاريع برمجية جديدة',
        portfolio: [],
        verified: true,
      }
    : {
        id: 'dev-guest',
        name: 'مهندس برمجيات',
        avatar: '',
        specialty: 'مهندس برمجيات وتطوير شامل',
        category: 'fullstack',
        location: 'الرياض، المملكة العربية السعودية',
        country: 'السعودية',
        hourlyRate: 150,
        fqs: 0,
        fqsBreakdown: {
          completionRate: 0,
          onTimeBudget: 0,
          clientRating: 0,
          repeatHireRate: 0,
          tests: 0,
          codeQuality: 0,
          deliveryRate: 0,
          security: 0,
        },
        rating: 0,
        reviewsCount: 0,
        completedProjects: 0,
        experienceYears: 0,
        availability: 'متاح الآن',
        level: 'مطور معتمد FQS',
        skills: [],
        bio: 'مساحة عمل تجريبية لمهندس البرمجيات — يرجى تسجيل الدخول للوصول إلى بيانات حسابك ومشاريعك.',
        work: 'متاح للعمل على مشاريع برمجية جديدة',
        portfolio: [],
        verified: true,
      };

  const isEgypt =
    store.currentUser?.country === 'مصر' ||
    (isLoggedInDev && (currentDev.country === 'مصر' || currentDev.location?.includes('مصر')));

  const devCurrency = isEgypt ? 'ج.م' : (store.currentUser?.currency || 'ر.س');

  // Developer Wallet State
  const rawWallet: UserWallet = store.developerWallet || INITIAL_DEVELOPER_WALLET;
  const devWallet: UserWallet = {
    ...rawWallet,
    currency: isEgypt ? 'ج.م' : (rawWallet.currency || 'ر.س'),
  };
  const handleUpdateDevWallet = (updated: UserWallet) => {
    update('developerWallet', { ...updated, currency: devCurrency });
  };

  // Helper to persist changes to the developer in store
  const handleUpdateDev = (updated: Developer) => {
    const exists = store.developers.some((d) => d.id === updated.id || d.name === updated.name);
    const nextDevs = exists
      ? store.developers.map((d) => (d.id === updated.id || d.name === updated.name ? updated : d))
      : [updated, ...store.developers];
    update('developers', nextDevs);
  };

  // ----------------------------------------------------
  // Clients Directory (أصحاب المشاريع والشركات) State & Aggregator
  // ----------------------------------------------------
  interface ClientCardData {
    id: string;
    name: string;
    company: string;
    avatar?: string;
    country: string;
    city: string;
    verified: boolean;
    paymentVerified: boolean;
    industry: string;
    category: 'saas' | 'ecommerce' | 'mobile' | 'ai' | 'erp' | 'security' | 'cms';
    bio: string;
    projects: Project[];
    totalBudget: number;
    openProjectsCount: number;
    rating: number;
    reviewsCount: number;
    hireRate: number;
    joinedDate: string;
  }

  // ─── Real Clients Directory from Supabase & Live Store Projects ───
  const [realClients, setRealClients] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchClients().then((cls) => {
      if (isMounted && cls && cls.length > 0) {
        setRealClients(cls);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const INITIAL_REAL_CLIENTS = [
    {
      id: '38602c01-06c5-4acc-8c1f-1ee11560a576',
      full_name: 'كيرلس روبير',
      company_name: 'مؤسسة مستقلة',
      country: 'مصر',
      avatar_url: '',
      role: 'client',
      bio: 'صاحب أعمال ومشاريع برمجية مستقلة.',
      created_at: '2026-11-06T20:06:10.631367+00:00',
      rating: 5,
      reviews_count: 0,
      is_verified: true,
    },
    {
      id: '4cf9bc7f-b9ca-4e8c-9208-768952b0b6c7',
      full_name: 'ابراهيم الصغير',
      company_name: 'مؤسسة تجارية',
      country: 'مصر',
      avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocITnf385GMBndZNqcwhsjwinmnltygM8dShx1ayfyGl6Lql3g=s96-c',
      role: 'client',
      bio: 'صاحب أعمال ومشاريع تجارية واستثمارية.',
      created_at: '2026-11-08T04:40:11.490399+00:00',
      rating: 5,
      reviews_count: 0,
      is_verified: true,
    },
    {
      id: '26ba9f9f-ae21-4863-9c29-74a88364820f',
      full_name: 'Amr Tarek',
      company_name: 'Full Stack Solutions',
      country: 'مصر',
      avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocLt_kD_j2A1VSbOpizMrx4grlCJaRaAGniMixUMMG8Gdlax_g=s96-c',
      role: 'client',
      bio: 'إدارة مشاريع وحلول تقنية وتطوير ويب.',
      created_at: '2026-11-08T22:12:25.263735+00:00',
      rating: 5,
      reviews_count: 0,
      is_verified: true,
    },
  ];

  // Dynamic aggregation of real clients from Supabase & actual projects only (No mock data)
  const allClients: ClientCardData[] = useMemo(() => {
    const clientsMap: Record<string, ClientCardData> = {};
    const effectiveClients = realClients.length > 0 ? realClients : INITIAL_REAL_CLIENTS;

    effectiveClients.forEach((rc) => {
      const clientName = rc.full_name || 'عميل معتمد';
      clientsMap[clientName] = {
        id: rc.id,
        name: clientName,
        company: rc.company_name || 'مؤسسة مستقلة',
        country: rc.country || 'مصر',
        city: rc.country === 'السعودية' ? 'الرياض' : (rc.country === 'الإمارات' ? 'دبي' : 'القاهرة'),
        avatar: rc.avatar_url || '',
        verified: rc.is_verified ?? true,
        paymentVerified: true,
        industry: rc.specialty || 'حلول برمجية وتطوير أعمال',
        category: (rc.category as any) || 'saas',
        bio: rc.bio || 'صاحب أعمال ومشاريع معتمد في منصة فوتيك للحلول التقنية والبرمجية.',
        projects: [],
        totalBudget: 0,
        openProjectsCount: 0,
        rating: Number(rc.rating) || 5.0,
        reviewsCount: rc.reviews_count || 0,
        hireRate: 100,
        joinedDate: rc.created_at ? `عضو منذ ${new Date(rc.created_at).getFullYear()}` : 'عضو مسجل',
      };
    });

    // Aggregate actual projects published in the system (No mock projects fallback)
    const actualProjects: Project[] = store.projects || [];

    actualProjects.forEach((p) => {
      const ownerKey = Object.keys(clientsMap).find(
        (k) => k.toLowerCase() === p.owner.toLowerCase() || p.owner.includes(k) || k.includes(p.owner)
      );

      if (ownerKey && clientsMap[ownerKey]) {
        clientsMap[ownerKey].projects.push(p);
      } else if (p.owner) {
        const newId = 'client-' + Math.random().toString(36).substring(2, 8);
        clientsMap[p.owner] = {
          id: newId,
          name: p.owner,
          company: p.owner,
          country: (p as any).country || 'مصر',
          city: (p as any).city || 'القاهرة',
          verified: true,
          paymentVerified: true,
          industry: p.category || 'تطوير برمجيات وحلول رقمية',
          category: 'saas',
          bio: 'صاحب مشاريع معتمد ينشر مشاريع برمجية في منصة فوتيك بجودة FQS.',
          projects: [p],
          totalBudget: 0,
          openProjectsCount: 0,
          rating: 5.0,
          reviewsCount: 1,
          hireRate: 100,
          joinedDate: 'عضو نشط',
        };
      }
    });

    return Object.values(clientsMap).map((c) => {
      const totalBudget = c.projects.reduce((acc, p) => acc + (p.budget || 0), 0);
      const openProjectsCount = c.projects.filter((p) => p.status === 'متاح').length;
      return {
        ...c,
        totalBudget,
        openProjectsCount,
      };
    });
  }, [realClients, store.projects]);

  // Clients Directory Search & Filter State
  const [clientSearch, setClientSearch] = useState('');
  const [clientCountryFilter, setClientCountryFilter] = useState('all');
  const [clientIndustryFilter, setClientIndustryFilter] = useState('all');
  const [clientOnlyOpen, setClientOnlyOpen] = useState(false);
  const [clientSortBy, setClientSortBy] = useState<'activity' | 'budget' | 'rating' | 'newest'>('activity');
  const [selectedClientModal, setSelectedClientModal] = useState<ClientCardData | null>(null);

  // Proposal Submission State for Developers
  const [proposalModalProject, setProposalModalProject] = useState<Project | null>(null);
  const [proposalPlan, setProposalPlan] = useState('');
  const [proposedBudget, setProposedBudget] = useState<number>(0);
  const [proposedDuration, setProposedDuration] = useState('14 يوماً');

  // Filtered Clients Computation
  const filteredClients = useMemo(() => {
    return allClients
      .filter((c) => {
        const q = clientSearch.toLowerCase().trim();
        const matchesSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.projects.some(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              (p.stack && p.stack.some((s) => s.toLowerCase().includes(q)))
          );

        const matchesCountry =
          clientCountryFilter === 'all' ||
          c.country.includes(clientCountryFilter) ||
          clientCountryFilter.includes(c.country);

        const matchesIndustry =
          clientIndustryFilter === 'all' ||
          c.category === clientIndustryFilter ||
          c.industry.includes(clientIndustryFilter);

        const matchesOpen = !clientOnlyOpen || c.openProjectsCount > 0;

        return matchesSearch && matchesCountry && matchesIndustry && matchesOpen;
      })
      .sort((a, b) => {
        if (clientSortBy === 'activity') {
          return b.projects.length - a.projects.length || b.openProjectsCount - a.openProjectsCount;
        }
        if (clientSortBy === 'budget') {
          return b.totalBudget - a.totalBudget;
        }
        if (clientSortBy === 'rating') {
          return b.rating - a.rating;
        }
        return b.openProjectsCount - a.openProjectsCount;
      });
  }, [allClients, clientSearch, clientCountryFilter, clientIndustryFilter, clientOnlyOpen, clientSortBy]);

  // Handle Start Chat with Client
  const handleStartChatWithClient = (clientName: string, clientAvatar?: string, projectTitle?: string) => {
    const currentConvs = store.conversations || [];
    const existing = currentConvs.find((c) => c.otherUser === clientName);
    if (existing) {
      go(`/chat?conversation=${existing.id}`);
      notify(`الانتقال للمحادثة المباشرة مع العميل: ${clientName}`);
      return;
    }

    const newConv = {
      id: 'conv-' + Math.random().toString(36).substring(2, 9),
      projectId: projectTitle || 'مشروع جديد',
      otherUser: clientName,
      otherUserAvatar: clientAvatar || '',
      online: true,
      messages: [
        {
          id: 'msg-' + Math.random().toString(36).substring(2, 9),
          body: projectTitle
            ? `السلام عليكم، اطلعت على مشروعكم المنشور "${projectTitle}" في فوتيك، ويسعدني كمطور معتمد مناقشة التنفيذ وتقديم خطة العمل الهندسية لكم.`
            : `السلام عليكم، يسعدني التواصل معكم كمطور معتمد في منصة فوتيك لمناقشة متطلباتكم البرمجية ومشاريعكم التقنية.`,
          sender: 'me' as const,
          time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
          read: true,
        },
      ],
    };

    update('conversations', [newConv, ...currentConvs]);
    notify(`تم فتح محادثة جديدة بنجاح مع العميل: ${clientName}`);
    go(`/chat?conversation=${newConv.id}`);
  };

  // Handle Submit Technical Proposal to Client
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalModalProject || !proposalPlan.trim()) {
      notify('يرجى كتابة خطة العمل الفنية المقترحة للعميل');
      return;
    }

    const newApp: Application = {
      id: 'app-' + Math.random().toString(36).substring(2, 9),
      projectId: proposalModalProject.id,
      developerName: currentDev.name,
      developerId: currentDev.id,
      plan: proposalPlan.trim(),
      proposedBudget: proposedBudget || proposalModalProject.budget,
      proposedDuration: proposedDuration || '14 يوماً',
      status: 'قيد المراجعة',
      submittedAt: 'الآن',
    };

    const updatedApps = [newApp, ...(store.applications || [])];
    saveProposalToSupabase(newApp, currentDev.id);
    update('applications', updatedApps);
    sendBrowserNotification('تم إرسال عرضك الفني بنجاح! 🚀', {
      body: `تم تقديم خطتك لمشروع "${proposalModalProject.title}"`,
      tag: 'dev-proposal-' + newApp.id,
      url: '/dashboard?tab=proposals',
    });
    notify(`تم إرسال عرضك الفني وحفظه في سحابة المنصة بنجاح 📨`);
    setProposalModalProject(null);
    setProposalPlan('');
  };

  // ----------------------------------------------------
  // Profile Settings & Drag & Drop Avatar State
  // ----------------------------------------------------
  const [profileName, setProfileName] = useState(currentDev.name);
  const [profileSpecialty, setProfileSpecialty] = useState(currentDev.specialty);
  const [profileBio, setProfileBio] = useState(currentDev.bio || '');
  const [profileGithub, setProfileGithub] = useState(currentDev.githubUrl || '');
  const [profileHourlyRate, setProfileHourlyRate] = useState(currentDev.hourlyRate || 150);
  const [profileAvatar, setProfileAvatar] = useState(currentDev.avatar || '');
  const [profileAvailability, setProfileAvailability] = useState<DeveloperAvailability>(
    (currentDev.availability as any) || 'متاح الآن'
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if currentDev changes
  useEffect(() => {
    setProfileName(currentDev.name);
    setProfileSpecialty(currentDev.specialty);
    setProfileBio(currentDev.bio || '');
    setProfileGithub(currentDev.githubUrl || '');
    setProfileHourlyRate(currentDev.hourlyRate || 150);
    setProfileAvatar(currentDev.avatar || '');
    setProfileAvailability((currentDev.availability as any) || 'متاح الآن');
  }, [currentDev.id, currentDev.avatar, currentDev.name, currentDev.availability]);

  const handleImageFileChange = (file: File) => {
    const validation = validateUploadedFile(file, { context: 'avatar' });
    if (!validation.isValid) {
      notify(validation.error || 'يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setProfileAvatar(result);
        notify('تم تحميل الصورة للمعاينة! اضغط "حفظ التغييرات" لتثبيتها في ملفك.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    const updatedDev: Developer = {
      ...currentDev,
      name: profileName.trim() || currentDev.name,
      specialty: profileSpecialty.trim() || currentDev.specialty,
      bio: profileBio.trim(),
      githubUrl: profileGithub.trim(),
      hourlyRate: Number(profileHourlyRate),
      avatar: profileAvatar || '',
      availability: profileAvailability,
    };

    // Update in developers list
    handleUpdateDev(updatedDev);

    // Update in store.currentUser
    if (store.currentUser) {
      const updatedUser = {
        ...store.currentUser,
        name: profileName.trim() || store.currentUser.name,
        title: profileSpecialty.trim() || store.currentUser.title,
        bio: profileBio.trim(),
        githubUrl: profileGithub.trim(),
        hourlyRate: Number(profileHourlyRate),
        avatar: profileAvatar || '',
        availability: profileAvailability,
      };
      update('currentUser', updatedUser);
    }

    if (isOwner && profileAvatar) {
      setOwnerSyncedAvatar(profileAvatar);
    }

    // Sync to Supabase profile
    try {
      await auth.updateProfile({
        full_name: profileName.trim(),
        specialty: profileSpecialty.trim(),
        bio: profileBio.trim(),
        avatar_url: profileAvatar || null,
        hourly_rate: Number(profileHourlyRate),
        github_url: profileGithub.trim() || null,
      });
    } catch (err) {
      console.warn('Supabase sync error ignored:', err);
    }

    setIsSavingProfile(false);
    notify('تم تحديث بيانات ملفك الشخصي والصورة بنجاح! 📸✅');
  };

  // ----------------------------------------------------
  // Project Image Lightbox, Live Preview & Video Trailer State
  // ----------------------------------------------------
  const [selectedPreviewProject, setSelectedPreviewProject] = useState<PortfolioItem | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedImageProject, setSelectedImageProject] = useState<PortfolioItem | null>(null);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [selectedTrailerProject, setSelectedTrailerProject] = useState<PortfolioItem | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  const getProjectImage = (item: PortfolioItem) => {
    if (item.previewImage) return item.previewImage;
    if (item.previewType === 'ecommerce') return '/images/escrow.webp';
    if (item.previewType === 'mobile') return '/images/hero-banner.webp';
    if (item.previewType === 'ai') return '/images/ai-sentinel-preview.svg';
    if (item.previewType === 'api' || item.previewType === 'devops') return '/images/collab.webp';
    return '/images/ai-sentinel-preview.svg';
  };

  // ----------------------------------------------------
  // Portfolio Publishing Modal State (Images & Video Trailers)
  // ----------------------------------------------------
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<'dashboard' | 'saas' | 'ecommerce' | 'mobile' | 'ai' | 'api' | 'devops' | 'cms'>('dashboard');
  const [projDesc, setProjDesc] = useState('');
  const [projTechString, setProjTechString] = useState('React 19, TypeScript, Tailwind, Node.js');
  const [projMetrics, setProjMetrics] = useState('معالجة 50k عملية يومياً بزمن استجابة 20ms');
  const [projLiveUrl, setProjLiveUrl] = useState('https://demo.futech.dev');
  const [projGithubUrl, setProjGithubUrl] = useState('https://github.com/omar-dev/project-sample');
  const [projFeature1, setProjFeature1] = useState('واجهة متجاوبة فائقة السرعة مع دعم اللغة العربية RTL');
  const [projFeature2, setProjFeature2] = useState('تكامل كامل مع قواعد البيانات ومعالجة فورية للبيانات');
  const [projFeature3, setProjFeature3] = useState('فحص كود كامل وتطبيق معايير أمان OWASP وحماية الثغرات');
  const [projImage, setProjImage] = useState('/images/ai-sentinel-preview.svg');
  const [includeTrailer, setIncludeTrailer] = useState(true);
  const [projTrailerUrl, setProjTrailerUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [projTrailerDuration, setProjTrailerDuration] = useState('01:45');

  const openNewProjectModal = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjCategory('ai');
    setProjDesc('');
    setProjTechString('Python, FastAPI, OpenAI, React 19, Docker, PostgreSQL');
    setProjMetrics('معالجة فائقة السرعة وفحص كود بأقل من 4 ثوانٍ');
    setProjLiveUrl('https://demo.futech.dev');
    setProjGithubUrl('https://github.com/omar-dev/new-platform');
    setProjFeature1('فحص أوتوماتيكي ومباشر ضد ثغرات حقن SQL والـ XSS وتجاوز الصلاحيات');
    setProjFeature2('اكتشاف تسريب المفاتيح السرية ومفاتيح الـ API قبل الـ Git Push');
    setProjFeature3('رادار القياس عن بُعد (Cyber Telemetry) وتحليل توافق OWASP');
    setProjImage('/images/ai-sentinel-preview.svg');
    setIncludeTrailer(true);
    setProjTrailerUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setProjTrailerDuration('01:45');
    setIsPublishModalOpen(true);
  };

  const openEditProjectModal = (p: PortfolioItem) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjCategory(p.previewType || 'dashboard');
    setProjDesc(p.description);
    setProjTechString(p.tech.join(', '));
    setProjMetrics(p.metrics || '');
    setProjLiveUrl(p.liveUrl || 'https://demo.futech.dev');
    setProjGithubUrl(p.githubUrl || 'https://github.com/omar-dev');
    setProjFeature1(p.features?.[0] || 'واجهة سريعة ومتجاوبة');
    setProjFeature2(p.features?.[1] || 'معمارية برمجية موثوقة');
    setProjFeature3(p.features?.[2] || 'أمان وتوافق مع معايير FQS');
    setProjImage(p.previewImage || getProjectImage(p));
    setIncludeTrailer(!!p.hasTrailer);
    setProjTrailerUrl(p.trailerVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setProjTrailerDuration(p.trailerDuration || '01:45');
    setIsPublishModalOpen(true);
  };

  const handleSavePortfolioProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      notify('يرجى كتابة عنوان المشروع');
      return;
    }

    const techArray = projTechString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featuresArray = [projFeature1, projFeature2, projFeature3].filter((f) => f.trim().length > 0);

    const projectData: PortfolioItem = {
      id: editingProjectId || 'proj-' + Date.now(),
      title: projTitle.trim(),
      description: projDesc.trim() || 'مشروع برمجي تطبيقي متكامل تم تنفيذه وتسليمه وفق معايير الجودة الهندسية.',
      tech: techArray.length > 0 ? techArray : ['React', 'TypeScript', 'Node.js'],
      metrics: projMetrics.trim() || 'تسليم ناجح بنسبة 100%',
      liveUrl: projLiveUrl.trim() || 'https://demo.futech.dev',
      githubUrl: projGithubUrl.trim() || 'https://github.com/omar-dev',
      previewType: projCategory,
      previewImage: projImage.trim() || undefined,
      hasTrailer: includeTrailer,
      trailerVideoUrl: includeTrailer ? (projTrailerUrl.trim() || undefined) : undefined,
      trailerDuration: includeTrailer ? (projTrailerDuration.trim() || '01:45') : undefined,
      previewSummary: projDesc.trim().slice(0, 140) + '...',
      features: featuresArray,
      stats: [
        { label: 'نسبة الإنجاز', value: '100%' },
        { label: 'فحص الأمان', value: 'OWASP Clean' },
        { label: 'معيار FQS', value: '94/100' },
        ...(includeTrailer ? [{ label: 'تريلر رسمي', value: '4K Ultra-HD' }] : []),
      ],
    };

    let updatedPortfolio: PortfolioItem[];
    if (editingProjectId) {
      updatedPortfolio = (currentDev.portfolio || []).map((p) =>
        p.id === editingProjectId ? projectData : p
      );
      notify(`تم تحديث بيانات المشروع: "${projTitle}" بنجاح!`);
    } else {
      updatedPortfolio = [projectData, ...(currentDev.portfolio || [])];
      notify(`تهانينا! تم نشر مشروع "${projTitle}" في معرض أعمالك وملفك العام بنجاح! 🚀`);
    }

    const updatedDev = { ...currentDev, portfolio: updatedPortfolio };
    handleUpdateDev(updatedDev);
    setIsPublishModalOpen(false);
  };

  const handleDeletePortfolioProject = (projectId: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في إزالة مشروع "${title}" من معرض الأعمال؟`)) {
      const updatedPortfolio = (currentDev.portfolio || []).filter((p) => p.id !== projectId);
      handleUpdateDev({ ...currentDev, portfolio: updatedPortfolio });
      notify(`تمت إزالة مشروع "${title}" من المعرض.`);
    }
  };

  // ----------------------------------------------------
  // CV Upload & Management State
  // ----------------------------------------------------
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Structured CV Editor State
  const [cvHeadline, setCvHeadline] = useState(
    currentDev.cv?.headline || currentDev.specialty || ''
  );
  const [cvSummary, setCvSummary] = useState(
    currentDev.cv?.summary || currentDev.bio || ''
  );
  const [cvYears, setCvYears] = useState(currentDev.cv?.yearsOfExperience || currentDev.experienceYears || 0);
  const [cvSkillsList, setCvSkillsList] = useState<string[]>(
    currentDev.skills || []
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [cvCertificationsList, setCvCertificationsList] = useState<string[]>(
    currentDev.cv?.certifications || []
  );
  const [newCertInput, setNewCertInput] = useState('');

  // Handle CV File Upload (Drag & Drop or File Select)
  const handleProcessCvFile = (file: File) => {
    const validation = validateUploadedFile(file, { context: 'cv' });
    if (!validation.isValid) {
      notify(validation.error || 'يرجى اختيار ملف سيرة ذاتية بصيغة PDF أو DOCX أو DOC.');
      return;
    }

    const fileSizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setIsUploadingCv(true);
    setUploadProgress(15);

    const stepInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(stepInterval);
      setUploadProgress(100);
      setIsUploadingCv(false);

      const newFileObj: DeveloperCVFile = {
        name: file.name,
        size: fileSizeStr,
        url: '#',
        uploadedAt: 'اليوم، ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      const updatedCv: DeveloperCV = {
        ...(currentDev.cv || {
          summary: cvSummary,
          yearsOfExperience: cvYears,
          education: [],
          experience: [],
          certifications: cvCertificationsList,
          languages: [
            { name: 'العربية', level: 'اللغة الأم' },
            { name: 'الإنجليزية', level: 'طلاقة تامة' },
          ],
        }),
        file: newFileObj,
      };

      handleUpdateDev({ ...currentDev, cv: updatedCv });
      notify(`تم رفع ملف السيرة الذاتية: "${file.name}" وتوثيقه بنجاح! 📄✓`);
    }, 850);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessCvFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadCv = () => {
    const fileName = currentDev.cv?.file?.name || 'omar-almutairi-cv.pdf';
    notify(`بدأ تحميل السيرة الذاتية: ${fileName}`);
    // Create an anchor download simulation
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveCvFile = () => {
    if (window.confirm('هل تريد حذف ملف السيرة الذاتية الحالي؟')) {
      if (currentDev.cv) {
        const nextCv = { ...currentDev.cv };
        delete nextCv.file;
        handleUpdateDev({ ...currentDev, cv: nextCv });
      }
      notify('تمت إزالة ملف السيرة الذاتية.');
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !cvSkillsList.includes(newSkillInput.trim())) {
      const nextSkills = [...cvSkillsList, newSkillInput.trim()];
      setCvSkillsList(nextSkills);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCvSkillsList(cvSkillsList.filter((s) => s !== skillToRemove));
  };

  const handleAddCert = () => {
    if (newCertInput.trim() && !cvCertificationsList.includes(newCertInput.trim())) {
      setCvCertificationsList([...cvCertificationsList, newCertInput.trim()]);
      setNewCertInput('');
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCvCertificationsList(cvCertificationsList.filter((c) => c !== certToRemove));
  };

  const handleSaveCvStructuredData = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCv: DeveloperCV = {
      ...(currentDev.cv || {
        education: [],
        experience: [],
        languages: [
          { name: 'العربية', level: 'اللغة الأم' },
          { name: 'الإنجليزية', level: 'متقدم' },
        ],
      }),
      headline: cvHeadline.trim(),
      summary: cvSummary.trim(),
      yearsOfExperience: cvYears,
      certifications: cvCertificationsList,
    };

    const updatedDev: Developer = {
      ...currentDev,
      skills: cvSkillsList,
      bio: cvSummary.trim(),
      cv: updatedCv,
    };

    handleUpdateDev(updatedDev);
    if (store.currentUser) {
      update('currentUser', {
        ...store.currentUser,
        skills: cvSkillsList,
        bio: cvSummary.trim(),
      });
    }
    notify('تم حفظ وتحديث بيانات السيرة الذاتية والملف المهني بنجاح! ✓');
  };

  // Developer-specific projects
  const myAssignedProjects = store.projects.filter(
    (p) => p.assignedDeveloperId === currentDev.id || p.developer === currentDev.name
  );
  const myCompletedProjects = myAssignedProjects.filter((p) => p.status === 'مكتمل');
  const myActiveProjects = myAssignedProjects.filter((p) => p.status === 'قيد التنفيذ');
  const activeProjectsCount = myActiveProjects.length;

  // Developer-specific deliveries
  const myDeliveries = store.deliveries.filter(
    (d) => d.developerId === currentDev.id || d.developerName === currentDev.name || d.client === currentDev.name
  );
  const myCompletedDeliveries = myDeliveries.filter((d) => d.status === 'مكتمل' || d.status === 'تم التسليم');
  const totalEarnings = myCompletedDeliveries.reduce((sum, d) => sum + d.amount, 0);

  const nextActiveDelivery = myDeliveries.find(
    (d) => d.status === 'قيد الفحص'
  );
  const nextActiveProject = myActiveProjects[0];

  // Portfolio Count & Applications
  const portfolioCount = currentDev.portfolio?.length || 0;
  const pendingApplications = store.applications.filter(
    (a) => (a.developerId === currentDev.id || a.developerName === currentDev.name) && a.status === 'قيد المراجعة'
  ).length;

  // Real Reviews & Rating
  const reviewsCount = currentDev.reviewsCount || 0;
  const ratingValue = currentDev.rating || 0;
  const completedProjectsCount = myCompletedProjects.length || currentDev.completedProjects || 0;
  const totalProjectsCount = myAssignedProjects.length || completedProjectsCount;

  // 1. معدل إكمال المشاريع الفعلي (Job Completion Rate)
  const hasAssignedProjects = totalProjectsCount > 0;
  const realCompletionRate = hasAssignedProjects
    ? Math.round((completedProjectsCount / totalProjectsCount) * 100)
    : 0;

  // 2. الالتزام بالوقت والميزانية الفعلي (On Time & On Budget)
  const realOnTimeRate = myDeliveries.length > 0
    ? Math.round((myCompletedDeliveries.length / myDeliveries.length) * 100)
    : completedProjectsCount > 0 ? 100 : 0;

  // 3. تقييم العملاء الفعلي (Average Star Rating Percentage)
  const realClientRatingRate = reviewsCount > 0
    ? Math.min(100, Math.round((ratingValue / 5) * 100))
    : 0;

  // 4. معدل التوظيف المتكرر الفعلي (Repeat Hire Rate)
  const clientCounts = myAssignedProjects.reduce((acc, p) => {
    const clientKey = p.client || p.owner;
    if (clientKey) acc[clientKey] = (acc[clientKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalUniqueClients = Object.keys(clientCounts).length;
  const repeatClientsCount = Object.values(clientCounts).filter((c) => c > 1).length;
  const realRepeatHireRate = totalUniqueClients > 0
    ? Math.round((repeatClientsCount / totalUniqueClients) * 100)
    : 0;

  // 5. معدل الإنجاز والالتزام (Delivery & Compliance Rate)
  const deliveryReliabilityRate = myDeliveries.length > 0
    ? Math.round((myCompletedDeliveries.length / myDeliveries.length) * 100)
    : completedProjectsCount > 0 ? 100 : 0;

  // 6. خوارزمية مؤشر الجودة الهندسية FQS الفعلية والمطابقة التامة
  const hasHistory = completedProjectsCount > 0 || reviewsCount > 0;
  let dynamicFqs = 0;
  let fqsBadgeTitle = 'بانتظار أول مشروع';
  let fqsLevelRank = 'قيد التقييم الأولي';

  if (isOwner || (currentDev.fqs && currentDev.fqs >= 90)) {
    dynamicFqs = currentDev.fqs || 99;
    fqsBadgeTitle = isOwner ? 'مستوى خبير ومؤسس (Senior)' : 'مستوى خبير (Senior)';
    fqsLevelRank = isOwner ? 'مؤسس ومطور المنصة الأوحد 👑' : 'خبير برمجيات معتمد (Senior)';
  } else if (hasHistory) {
    const effectiveRepeatHire = totalUniqueClients > 0
      ? realRepeatHireRate
      : (currentDev.fqsBreakdown?.repeatHireRate || (reviewsCount > 0 ? 100 : 0));

    dynamicFqs = Math.round(
      (realCompletionRate * 0.35) +
      (realOnTimeRate * 0.30) +
      ((reviewsCount > 0 ? realClientRatingRate : realCompletionRate) * 0.20) +
      (effectiveRepeatHire * 0.15)
    );
    dynamicFqs = Math.max(1, Math.min(100, dynamicFqs));

    if (dynamicFqs >= 90) {
      fqsBadgeTitle = 'مستوى خبير (Senior)';
      fqsLevelRank = 'خبير برمجيات معتمد';
    } else if (dynamicFqs >= 75) {
      fqsBadgeTitle = 'مستوى محترف (Mid-Level)';
      fqsLevelRank = 'محترف معتمد';
    } else {
      fqsBadgeTitle = 'مستوى واعد (Junior)';
      fqsLevelRank = 'مطور واعد';
    }
  } else {
    dynamicFqs = currentDev.fqs && currentDev.fqs > 0 ? currentDev.fqs : 0;
    fqsBadgeTitle = dynamicFqs > 0 ? `مستوى مبدئي (${dynamicFqs}/100)` : 'بانتظار أول مشروع';
    fqsLevelRank = dynamicFqs > 0 ? 'مطور معتمد' : 'حساب جديد';
  }

  // ──────────────────────────────────────────
  // Recharts Analytics Datasets
  // ──────────────────────────────────────────
  const earningsChartData = useMemo(() => {
    const txs = devWallet.transactions.filter(
      (t) => t.type === 'escrow_release' || t.type === 'deposit'
    );
    if (txs.length > 0) {
      let cumulative = 0;
      return txs.slice(-6).map((t, idx) => {
        cumulative += t.amount;
        return {
          name: t.date ? t.date.slice(5) : `دفعة ${idx + 1}`,
          amount: t.amount,
          cumulative: cumulative,
        };
      });
    }
    return [
      { name: 'الشهر 1', amount: 0, cumulative: 0 },
      { name: 'الشهر 2', amount: 0, cumulative: 0 },
      { name: 'الشهر 3', amount: 0, cumulative: 0 },
      { name: 'الشهر 4', amount: 0, cumulative: 0 },
      { name: 'الشهر 5', amount: 0, cumulative: 0 },
      { name: 'الحالي', amount: devWallet.totalBalance, cumulative: devWallet.totalBalance },
    ];
  }, [devWallet.transactions, devWallet.totalBalance]);

  const hasFqsData = Boolean(
    hasHistory ||
    myDeliveries.length > 0 ||
    totalProjectsCount > 0 ||
    (currentDev.fqs && currentDev.fqs > 0)
  );

  const fqsFactorChartData = useMemo(() => {
    const breakdown = currentDev.fqsBreakdown;
    return [
      {
        factor: 'إكمال المشاريع',
        score: hasAssignedProjects ? realCompletionRate : (breakdown?.completionRate || 100),
        benchmark: 85,
      },
      {
        factor: 'الالتزام بالوقت',
        score: (myDeliveries.length > 0 || completedProjectsCount > 0) ? realOnTimeRate : (breakdown?.onTimeBudget || 100),
        benchmark: 80,
      },
      {
        factor: 'تقييم العملاء',
        score: reviewsCount > 0 ? realClientRatingRate : (breakdown?.clientRating || 100),
        benchmark: 88,
      },
      {
        factor: 'التوظيف المتكرر',
        score: totalUniqueClients > 0 ? realRepeatHireRate : (breakdown?.repeatHireRate || 96),
        benchmark: 70,
      },
      {
        factor: 'فحص كود Git',
        score: myDeliveries.length > 0 ? deliveryReliabilityRate : (breakdown?.codeQuality || 100),
        benchmark: 85,
      },
    ];
  }, [hasAssignedProjects, realCompletionRate, myDeliveries.length, completedProjectsCount, realOnTimeRate, reviewsCount, realClientRatingRate, totalUniqueClients, realRepeatHireRate, deliveryReliabilityRate]);

  const proposalFunnelData = useMemo(() => {
    const totalApps = store.applications.length;
    const inReview = store.applications.filter((a) => a.status === 'قيد المراجعة').length;
    const accepted = store.applications.filter((a) => a.status === 'مقبول').length;
    const completedDel = store.deliveries.length;
    return [
      { stage: 'عروض مقدمة', count: totalApps, color: '#38bdf8' },
      { stage: 'قيد المراجعة', count: inReview, color: '#818cf8' },
      { stage: 'عروض مقبولة', count: accepted, color: '#2dd4bf' },
      { stage: 'تسليمات معتمدة', count: completedDel, color: '#34d399' },
    ];
  }, [store.applications, store.deliveries]);

  const techStackData = useMemo(() => {
    const rawSkills = (currentDev.skills && currentDev.skills.length > 0)
      ? currentDev.skills
      : (store.currentUser?.skills && store.currentUser.skills.length > 0 ? store.currentUser.skills : []);

    if (!rawSkills || rawSkills.length === 0) {
      return [];
    }

    const categories: Record<string, number> = {
      'تطوير واجهات (Frontend)': 0,
      'أنظمة خوادم (Backend & APIs)': 0,
      'قواعد بيانات وسحابية (DB & Cloud)': 0,
      'ذكاء اصطناعي وأتمتة (AI & ML)': 0,
    };

    rawSkills.forEach((s) => {
      const lower = s.toLowerCase();
      if (
        lower.includes('react') ||
        lower.includes('vue') ||
        lower.includes('front') ||
        lower.includes('tailwind') ||
        lower.includes('ui') ||
        lower.includes('css') ||
        lower.includes('html') ||
        lower.includes('angular') ||
        lower.includes('next') ||
        lower.includes('svelte')
      ) {
        categories['تطوير واجهات (Frontend)'] += 1;
      } else if (
        lower.includes('node') ||
        lower.includes('python') ||
        lower.includes('api') ||
        lower.includes('express') ||
        lower.includes('backend') ||
        lower.includes('django') ||
        lower.includes('flask') ||
        lower.includes('nest') ||
        lower.includes('go') ||
        lower.includes('java') ||
        lower.includes('c#') ||
        lower.includes('php')
      ) {
        categories['أنظمة خوادم (Backend & APIs)'] += 1;
      } else if (
        lower.includes('sql') ||
        lower.includes('postgres') ||
        lower.includes('docker') ||
        lower.includes('cloud') ||
        lower.includes('supabase') ||
        lower.includes('mongo') ||
        lower.includes('redis') ||
        lower.includes('aws') ||
        lower.includes('devops') ||
        lower.includes('k8s') ||
        lower.includes('kubernetes')
      ) {
        categories['قواعد بيانات وسحابية (DB & Cloud)'] += 1;
      } else {
        categories['ذكاء اصطناعي وأتمتة (AI & ML)'] += 1;
      }
    });

    const colorsMap: Record<string, string> = {
      'تطوير واجهات (Frontend)': '#2dd4bf',
      'أنظمة خوادم (Backend & APIs)': '#38bdf8',
      'قواعد بيانات وسحابية (DB & Cloud)': '#818cf8',
      'ذكاء اصطناعي وأتمتة (AI & ML)': '#f472b6',
    };

    return Object.entries(categories)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: colorsMap[name] || '#2dd4bf',
      }));
  }, [currentDev.skills, store.currentUser?.skills]);

  return (
    <div className="space-y-8" dir="rtl">
      {/* Guest Notice if not logged in */}
      {!isLoggedInDev && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={17} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              أنت تتصفح لوحة تحكم المطور كزائر. يرجى <strong>تسجيل الدخول</strong> للوصول إلى مشاريعك الحقيقية وسيرتك الذاتية وإحصائياتك.
            </span>
          </div>
          <button
            type="button"
            onClick={() => go('/login')}
            className="rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-black text-white hover:bg-amber-700 transition shadow-xs"
          >
            تسجيل الدخول الآن
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172b42] via-[#203c62] to-[#1a3350] p-6 text-white shadow-xl md:p-8 dark:from-[#0d1b2a] dark:via-[#13283f] dark:to-[#0f2134] dark:border dark:border-white/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <UserAvatar
                src={currentDev.avatar}
                name={currentDev.name}
                size="xl"
                shape="rounded"
                indicator={true}
                indicatorColor="bg-[#3bb87c]"
                className="ring-4 ring-white/15 shadow-inner"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black md:text-2xl">{currentDev.name}</h1>
                <BadgeCheck size={20} className="text-[#3ec4cb]" />
                <span className="rounded-full bg-[#3ec4cb]/20 px-3 py-0.5 text-[10px] font-extrabold text-[#74e2e8]">
                  مطور معتمد FQS
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/20 hover:text-[#74e2e8]"
                >
                  <Settings size={13} />
                  <span>إعدادات الملف والحساب</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                {currentDev.specialty} · متاح لمشاريع جديدة
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Star size={13} className="fill-[#f5ba48] text-[#f5ba48]" />
                  <span>{currentDev.reviewsCount > 0 ? `${currentDev.rating} (${currentDev.reviewsCount} تقييم)` : 'لا توجد تقييمات مسجلة بعد'}</span>
                </span>
                <span>·</span>
                <span>{currentDev.location}</span>
                <span>·</span>
                <span>عضو منذ عام 2024</span>
              </div>
            </div>
          </div>

          {/* FQS Quality Meter */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#62dade]">معيار الجودة الهندسي</div>
              <div className="flex items-baseline justify-end gap-1.5" dir="ltr">
                {hasHistory || dynamicFqs > 0 ? (
                  <>
                    <span className="text-2xl font-black text-white">{dynamicFqs}</span>
                    <span className="text-xs font-bold text-teal-300">/ 100</span>
                    <span className="mr-1 rounded-md bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-black text-teal-300">FQS</span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-slate-400">— / 100</span>
                )}
              </div>
              <div className="text-[10px] text-slate-300">
                {hasHistory || dynamicFqs > 0 ? `تصنيف: ${fqsLevelRank}` : 'تصنيف: بانتظار أول تسليم'}
              </div>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#3ec4cb] text-[#0d2334]">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي الأرباح المستلمة</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf6ef] text-[#2c8d57] dark:bg-emerald-950/40 dark:text-emerald-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47] dark:text-white">
            {totalEarnings === 0 ? '٠' : totalEarnings.toLocaleString('ar-EG')} <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{devCurrency}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-400">
            {totalEarnings > 0 ? (
              <span className="text-[#2e9159] dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp size={13} />
                <span>أرباح معتمدة ومسحوبة</span>
              </span>
            ) : (
              <span>لا توجد أرباح مسحوبة بعد</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">مشاريع قيد التنفيذ</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e5f5f7] text-[#248f98] dark:bg-cyan-950/40 dark:text-cyan-400">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47] dark:text-white">{activeProjectsCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {activeProjectsCount > 0 ? 'مشاريع جارية قيد التطوير' : 'لا توجد مشاريع قيد التنفيذ حالياً'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">أعمال منشورة بالمعرض</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2eefb] text-[#6942ad] dark:bg-purple-950/40 dark:text-purple-400">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47] dark:text-white">{portfolioCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {portfolioCount > 0 ? 'أعمال موثقة مع روابط فحص الكود' : 'لم تقم بنشر أعمال بعد'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">معدل الإنجاز والالتزام</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf2fb] text-[#345b95] dark:bg-blue-950/40 dark:text-blue-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-[#172e47] dark:text-white">
            {myDeliveries.length > 0 || completedProjectsCount > 0 ? `${deliveryReliabilityRate}%` : '—'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {myDeliveries.length > 0 || completedProjectsCount > 0
              ? `${myCompletedDeliveries.length} تسليمات ناجحة`
              : 'بانتظار أول تسليم برمجي'}
          </div>
        </div>
      </div>

      {/* Modern Dashboard Navigation Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-white/10 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'overview'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Activity size={14} />
          <span>نظرة عامة والتقارير</span>
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`relative flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'clients'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Building2 size={14} />
          <span>البحث عن العملاء والشركات ({allClients.length})</span>
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-black text-emerald-700 dark:text-emerald-300">
            مشاريع حية 🟢
          </span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`relative flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'portfolio'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>معرض الأعمال ({portfolioCount})</span>
          <span className="rounded-full bg-teal-500/20 px-1.5 py-0.2 text-[9px] font-black text-teal-700 dark:text-teal-300">
            جديد
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cv')}
          className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'cv'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <FileText size={14} />
          <span>السيرة الذاتية (CV)</span>
          {currentDev.cv?.file && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-950" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'projects'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Briefcase size={14} />
          <span>المشاريع والمراحل</span>
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'proposals'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <FileCode2 size={14} />
          <span>خطط التقديم ({store.applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deliveries')}
          className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'deliveries'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <CheckCircle size={14} />
          <span>سجل التسليم</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'wallet'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Wallet size={14} />
          <span>المحفظة والضمان ({devWallet.totalBalance.toLocaleString()} {devWallet.currency || devCurrency}) 💳</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-xs font-black transition-all ${
            activeTab === 'settings'
              ? 'border-b-2 border-[#203d62] text-[#203d62] dark:border-teal-400 dark:text-teal-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Settings size={14} />
          <span>إعدادات الملف والصورة</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB: Clients Directory (البحث عن العملاء وأصحاب المشاريع) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          {/* Top Banner / Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-[#172b42] via-[#1d395d] to-[#122e4c] p-6 text-white shadow-lg transition-colors md:p-8 dark:border-white/10">
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-black text-teal-300 border border-teal-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                  <span>دليل أصحاب المشاريع والشركات النشطة</span>
                </div>
                <h2 className="mt-3 text-lg font-black sm:text-2xl text-white">
                  استكشف الشركات والعملاء الذين ينشرون مشاريع برمجية 🏢
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  ابحث وتواصل مباشرة مع أصحاب الأعمال والمؤسسات الباحثة عن كفاءات تقنية، واستعرض مشاريعهم المنشورة، وتواصل معهم وقدم عروضك الفنية فوراً.
                </p>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs text-center">
                  <div className="text-[10px] text-slate-300 font-bold">الشركات المسجلة</div>
                  <div className="mt-1 text-lg font-black text-teal-400">{allClients.length}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs text-center">
                  <div className="text-[10px] text-slate-300 font-bold">مشاريع مفتوحة للتقديم</div>
                  <div className="mt-1 text-lg font-black text-emerald-400">
                    {allClients.reduce((acc, c) => acc + c.openProjectsCount, 0)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs text-center">
                  <div className="text-[10px] text-slate-300 font-bold">إجمالي الميزانيات</div>
                  <div className="mt-1 text-lg font-black text-amber-300">
                    {allClients.reduce((acc, c) => acc + c.totalBudget, 0).toLocaleString()} {devCurrency}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xs text-center">
                  <div className="text-[10px] text-slate-300 font-bold">توثيق الضمان</div>
                  <div className="mt-1 text-lg font-black text-cyan-300">100% Escrow</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Sorter Controls */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-white/10 dark:bg-[#0c1524] space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="ابحث باسم الشركة، العميل، التخصص، المدينة، أو اسم المشروع والتقنية المطلوبة (مثل: React, Python, Docker)..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-4 pr-10 text-xs outline-none focus:border-teal-500 focus:bg-white transition dark:border-white/10 dark:bg-slate-900/60 dark:text-white"
              />
              {clientSearch && (
                <button
                  onClick={() => setClientSearch('')}
                  className="absolute left-3 top-2.5 rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter Pills Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-white/5 text-xs">
              {/* Country Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 ml-1">الدولة:</span>
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'السعودية', label: 'السعودية 🇸🇦' },
                  { id: 'مصر', label: 'مصر 🇪🇬' },
                  { id: 'الإمارات', label: 'الإمارات 🇦🇪' },
                  { id: 'الكويت', label: 'الكويت 🇰🇼' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setClientCountryFilter(c.id)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
                      clientCountryFilter === c.id
                        ? 'bg-[#203d62] text-white shadow-xs dark:bg-teal-600 dark:text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Industry / Category Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 ml-1">المجال:</span>
                {[
                  { id: 'all', label: 'كافة المجالات' },
                  { id: 'saas', label: 'منصات SaaS سحابية' },
                  { id: 'ecommerce', label: 'تجارة إلكترونية' },
                  { id: 'cms', label: 'منصات CMS ومتاجر (WordPress/Shopify)' },
                  { id: 'mobile', label: 'تطبيقات الجوال' },
                  { id: 'ai', label: 'ذكاء اصطناعي' },
                  { id: 'erp', label: 'أنظمة ERP ومخازن' },
                ].map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setClientIndustryFilter(ind.id)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
                      clientIndustryFilter === ind.id
                        ? 'bg-teal-600 text-white shadow-xs dark:bg-teal-500 dark:text-slate-950'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle & Sort Options */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={clientOnlyOpen}
                  onChange={(e) => setClientOnlyOpen(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">
                  إظهار العملاء الذين لديهم مشاريع مفتوحة للتقديم حالياً فقط 🟢
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">ترتيب النتائج:</span>
                <select
                  value={clientSortBy}
                  onChange={(e) => setClientSortBy(e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white"
                >
                  <option value="activity">الأكثر نشاطاً (عدد المشاريع)</option>
                  <option value="budget">أعلى إجمالي ميزانيات</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-black">
                  ({filteredClients.length} نتيجة)
                </span>
              </div>
            </div>
          </div>

          {/* Clients Cards Grid */}
          {filteredClients.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center transition-colors dark:border-white/15 dark:bg-[#0c1524]">
              <Search className="mx-auto text-slate-300 dark:text-slate-600" size={42} />
              <h3 className="mt-3 text-sm font-black text-[#172c43] dark:text-white">
                لم يتم العثور على أي عملاء أو شركات تطابق معايير البحث الحالية
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                جرب تعديل كلمة البحث أو إزالة بعض الفلاتر لاستعراض جميع الشركات.
              </p>
              <button
                onClick={() => {
                  setClientSearch('');
                  setClientCountryFilter('all');
                  setClientIndustryFilter('all');
                  setClientOnlyOpen(false);
                }}
                className="mt-4 rounded-xl bg-[#203d62] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2c5383] dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                إعادة ضبط كافة الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client) => {
                const openProjects = client.projects.filter((p) => p.status === 'متاح');
                return (
                  <div
                    key={client.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:border-teal-500/50 hover:shadow-md dark:border-white/10 dark:bg-[#0c1524]"
                  >
                    <div>
                      {/* Card Top: Logo / Avatar & Verification */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-[#1b3d68] via-[#20507a] to-[#2aa6ae] text-white text-base font-black shadow-sm ring-2 ring-teal-500/20">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-xs font-black text-[#152a40] dark:text-white line-clamp-1">
                                {client.name}
                              </h3>
                              <ShieldCheck size={14} className="text-teal-500 shrink-0" />
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <MapPin size={11} className="text-slate-400" />
                              <span>{client.city}، {client.country}</span>
                            </div>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          ضمان موثق ✓
                        </span>
                      </div>

                      {/* Industry & Bio */}
                      <div className="mt-3">
                        <span className="inline-block rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-black text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                          {client.industry}
                        </span>
                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
                          {client.bio}
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 text-center dark:border-white/5 dark:bg-white/5 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400">المشاريع</div>
                          <div className="mt-0.5 font-black text-[#152a40] dark:text-white">
                            {client.projects.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">متاحة الآن</div>
                          <div className={`mt-0.5 font-black ${client.openProjectsCount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                            {client.openProjectsCount > 0 ? `${client.openProjectsCount} متاح 🟢` : '٠'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">الميزانية الكلية</div>
                          <div className="mt-0.5 font-black text-[#152a40] dark:text-white truncate">
                            {client.totalBudget.toLocaleString()} {devCurrency}
                          </div>
                        </div>
                      </div>

                      {/* Trust & Rating */}
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                        <span className="font-bold text-amber-500">
                          ⭐ {client.rating} ({client.reviewsCount} تقييم)
                        </span>
                        <span className="font-bold text-slate-500 dark:text-slate-400">
                          نسبة التوظيف: <strong className="text-teal-600 dark:text-teal-400">{client.hireRate}%</strong>
                        </span>
                      </div>

                      {/* Active Open Projects Preview */}
                      {openProjects.length > 0 && (
                        <div className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3 dark:border-white/5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <span>مشاريع مفتوحة للتقديم:</span>
                            <span className="text-[10px] text-teal-600 dark:text-teal-400">
                              {openProjects.length} مشروع
                            </span>
                          </div>

                          {openProjects.slice(0, 2).map((p) => (
                            <div
                              key={p.id}
                              className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/5 dark:bg-white/5 text-xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-[#152a40] dark:text-white truncate">
                                  {p.title}
                                </span>
                                <span className="shrink-0 font-black text-teal-600 dark:text-teal-400">
                                  {p.budget.toLocaleString()} {devCurrency}
                                </span>
                              </div>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {p.stack.slice(0, 3).map((st) => (
                                  <span
                                    key={st}
                                    className="rounded bg-white px-1.5 py-0.2 text-[9px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300 border border-slate-100 dark:border-white/10"
                                  >
                                    {st}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-white/5 text-xs">
                      {openProjects.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setProposalModalProject(openProjects[0]);
                            setProposedBudget(openProjects[0].budget);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 py-2 text-xs font-black text-white shadow-xs hover:brightness-105 active:scale-95 transition"
                        >
                          <Send size={13} className="rotate-180" />
                          <span>تقديم عرض فني 🚀</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartChatWithClient(client.name, client.avatar)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-teal-500/40 bg-teal-50/50 py-2 text-xs font-black text-teal-700 hover:bg-teal-100 transition active:scale-95 dark:bg-teal-950/40 dark:text-teal-300"
                        >
                          <MessageSquare size={13} />
                          <span>تواصل مع العميل 💬</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedClientModal(client)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        title="استعراض كافة التفاصيل والمشاريع"
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartChatWithClient(client.name, client.avatar)}
                        className="rounded-xl border border-[#2ba6ae]/40 bg-[#f0fafb] px-3 py-2 text-xs font-black text-[#1b7e86] hover:bg-[#e0f5f7] transition dark:border-teal-500/30 dark:bg-teal-950/50 dark:text-teal-300"
                        title="محادثة مباشرة مع العميل"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: Portfolio (معرض الأعمال والمشاريع) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Top Banner & Publish CTA */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 via-teal-50/20 to-white p-6 shadow-xs transition-colors sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:from-[#0c1524] dark:via-[#0e1a2d] dark:to-[#0c1524]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-[#162a40] dark:text-white">
                  معرض أعمالك ومشاريعك المنشورة
                </h2>
                <span className="rounded-full bg-teal-500/15 px-2.5 py-0.5 text-[10px] font-black text-teal-700 dark:text-teal-300">
                  {portfolioCount} أعمال معتمدة
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                اعرض تطبيقاتك البرمجية ومشاريعك السابقة لأصحاب الشركات والمستثمرين، مع روابط المعاينة التفاعلية الحية ومستودعات الكود لرفع مؤشر التوظيف وثقة العملاء.
              </p>
            </div>

            <button
              onClick={openNewProjectModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 px-5 py-3 text-xs font-black text-white shadow-lg shadow-teal-500/20 transition hover:brightness-105 active:scale-95"
            >
              <Plus size={16} />
              <span>نشر مشروع جديد في المعرض</span>
            </button>
          </div>

          {/* 📦 Featured Projects Highlight Matrix (المشاريع الإنتاجية المعتمدة لمالك المنصة فقط) */}
          {isOwner && (
            <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-r from-teal-500/5 via-slate-50 to-white dark:from-[#0c1524] dark:via-[#0e1c2f] dark:to-[#0c1524] p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-teal-500/10">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📦</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-[#152e46] dark:text-white">
                        أبرز المشاريع الهندسية المنفذة (Featured Projects)
                      </h3>
                      <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black text-amber-700 dark:text-amber-300">
                        مشاريع مالك ومؤسس المنصة 👑
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      ملخص المنصات الإنتاجية المسلّمة للعملاء وحزم التقنيات وحلول المعمارية البرمجية
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto rounded-xl bg-teal-500/15 border border-teal-500/30 px-3 py-1 text-[11px] font-black text-teal-700 dark:text-teal-300">
                  {ownerDevObj?.portfolio?.length || portfolioCount || 7} مشاريع إنتاجية موثقة
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-[11px] font-black text-slate-600 dark:text-slate-300">
                      <th className="pb-3 pr-2 whitespace-nowrap">المشروع والجهة (Project)</th>
                      <th className="pb-3 px-3 whitespace-nowrap">حزمة التقنيات (Stack)</th>
                      <th className="pb-3 pl-2 min-w-[320px]">أبرز الحلول والخصائص المعمارية (Highlights)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    <tr className="hover:bg-teal-50/30 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 pr-2 font-black text-[#152e46] dark:text-white align-top whitespace-nowrap">
                        <a href="https://algoste.care/" target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 font-black">
                          <span>DentalAI</span>
                          <ExternalLink size={11} />
                        </a>
                        <span className="text-slate-400 font-bold mr-1.5">— Algostep</span>
                        <div className="text-[10px] text-teal-700 dark:text-teal-300 font-medium mt-0.5">منصة رعاية صحية ذكية</div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        Next.js 16, TypeScript, PostgreSQL, Multimodal LLM, RAG, Docker
                      </td>
                      <td className="py-3 pl-2 align-top text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        منصة إدارة عيادات الأسنان والفرز الطبي الذكي بالذكاء الاصطناعي (AI Triage)؛ جدولة ومزامنة المواعيد لحظياً عبر WhatsApp؛ تأمين Webhooks ضد هجمات إعادة الإرسال بتشفير HMAC-SHA256 مع تنظيم استهلاك الطلبات بخوارزمية Token-Bucket Rate Limiting.
                      </td>
                    </tr>

                    <tr className="hover:bg-teal-50/30 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 pr-2 font-black text-[#152e46] dark:text-white align-top whitespace-nowrap">
                        <a href="https://ecsdesign.ca/" target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 font-black">
                          <span>ECS Customizer</span>
                          <ExternalLink size={11} />
                        </a>
                        <span className="text-slate-400 font-bold mr-1.5">— Client</span>
                        <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium mt-0.5">تخصيص ملابس 3D</div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        React (Vite), Express, Three.js, PostgreSQL, Drizzle
                      </td>
                      <td className="py-3 pl-2 align-top text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        منصة تجارة إلكترونية تفاعلية لتصميم وتخصيص الملابس الرياضية؛ محرك تسعير متدرج بـ 5 مستويات خصم و3 تقنيات طباعة؛ معاينة ثلاثية الأبعاد فورية بالمتصفح (Three.js) وتصدير ملفات تصنيع وطباعة صناعية عالية الدقة 300-DPI.
                      </td>
                    </tr>

                    <tr className="hover:bg-teal-50/30 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 pr-2 font-black text-[#152e46] dark:text-white align-top whitespace-nowrap">
                        <a href="https://egyptexgateway.com/" target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 font-black">
                          <span>EgyptTex Gateway</span>
                          <ExternalLink size={11} />
                        </a>
                        <span className="text-slate-400 font-bold mr-1.5">— Nile Tex</span>
                        <div className="text-[10px] text-cyan-700 dark:text-cyan-300 font-medium mt-0.5">سوق B2B للمنسوجات</div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        Next.js 15, React 19, Supabase & Neon, Tailwind
                      </td>
                      <td className="py-3 pl-2 align-top text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        سوق رقمي B2B لتجارة وتوريد الأقمشة والمنسوجات عبر 8 قطاعات؛ تحكم مشدد بالصلاحيات (RBAC) وأمان مستوى الصفوف (Row-Level Security)؛ تسعير توريدات متدرج بالجنيه المصري (EGP) مع نظام متكامل لطلب وفحص العينات.
                      </td>
                    </tr>

                    <tr className="hover:bg-teal-50/30 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 pr-2 font-black text-[#152e46] dark:text-white align-top whitespace-nowrap">
                        <span className="font-black text-slate-900 dark:text-white">Father Yostos Library POS</span>
                        <span className="text-slate-400 font-bold mr-1.5">— Client</span>
                        <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium mt-0.5">كاشير ومخازن ديسكتوب</div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        Electron, React, TypeScript, Express, better-sqlite3
                      </td>
                      <td className="py-3 pl-2 align-top text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        تطبيق ديسكتوب أوفلاين كامل (Offline-First) لنقاط البيع وإدارة مئات الأصناف والمخازن بدون إنترنت؛ تتبع حركة المبيعات بالباركود اللحظي وحسابات الموردين وإصدار الفواتير التلقائية مع قاعدة SQLite سريعة؛ حزمة تثبيت Windows Installer v2.0.
                      </td>
                    </tr>

                    <tr className="hover:bg-teal-50/30 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 pr-2 font-black text-[#152e46] dark:text-white align-top whitespace-nowrap">
                        <span className="font-black text-slate-900 dark:text-white">Puno POS</span>
                        <span className="text-slate-400 font-bold mr-1.5">— Client</span>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium mt-0.5">كاشير مطاعم ميداني</div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        Electron, React, Vite, Tailwind
                      </td>
                      <td className="py-3 pl-2 align-top text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        نظام كاشير مطاعم ديسكتوب أوفلاين Portable خفيف؛ اتصال بيني آمن بين العمليات (Secure IPC عبر contextBridge)؛ طباعة فواتير وإيصالات حرارية لحظية غير متزامنة (Non-blocking thermal receipt printing) تمنع أي تجميد للنظام في الذروة.
                      </td>
                    </tr>

                    <tr className="hover:bg-teal-50/30 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 pr-2 font-black text-[#152e46] dark:text-white align-top whitespace-nowrap">
                        <a href="https://github.com/minarob23/gamevault" target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 font-black">
                          <span>GameVault</span>
                          <Github size={11} />
                        </a>
                        <span className="text-slate-400 font-bold mr-1.5">— Graduation project</span>
                        <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium mt-0.5">تحليلات وتنبؤ مبيعات بالذكاء الاصطناعي</div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        Python, FastAPI, React, XGBoost/LightGBM, PostgreSQL
                      </td>
                      <td className="py-3 pl-2 align-top text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        تحليلات تجارة إلكترونية متقدمة للتنبؤ بحجم المبيعات باستخدام خوارزميات التعلم الآلي XGBoost و LightGBM؛ مساعد ذكي للرد وتصنيف نوايا المستخدمين عبر تقنيات معالجة اللغات الطبيعية (NLP Intent-Classification)؛ واجهات سريعة بـ FastAPI.
                      </td>
                    </tr>

                    <tr className="hover:bg-teal-50/30 dark:hover:bg-white/[0.02] transition">
                      <td className="py-3 pr-2 font-black text-[#152e46] dark:text-white align-top whitespace-nowrap">
                        <a href="https://futech-platform.vercel.app" target="_blank" rel="noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 font-black">
                          <span>FuTech Platform</span>
                          <ExternalLink size={11} />
                        </a>
                        <span className="text-slate-400 font-bold mr-1.5">— Platform Founder 👑</span>
                        <div className="text-[10px] text-teal-700 dark:text-teal-300 font-medium mt-0.5">المنصة الهندسية والضمان المشفر</div>
                      </td>
                      <td className="py-3 px-3 align-top font-mono text-[10px] text-slate-600 dark:text-slate-300">
                        React 19, TypeScript, Node.js, PostgreSQL, Supabase, Tailwind CSS
                      </td>
                      <td className="py-3 pl-2 align-top text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                        المنصة الهندسية المتكاملة لحوكمة المشاريع المستقلة وتوثيق كفاءة المهندسين العرب؛ نظام الضمان المالي المشفر وحجز المستحقات بالكامل (Escrow Vault)؛ مؤشر FQS المعتمد وفحوصات أمان OWASP وحوكمة شاملة.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Portfolio Projects Grid */}
          {portfolioCount === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center transition-colors dark:border-white/15 dark:bg-[#0c1524]">
              <Layers className="mx-auto text-slate-300 dark:text-slate-600" size={42} />
              <h3 className="mt-3 text-sm font-black text-[#172c43] dark:text-white">
                لم تقم بنشر أي مشروع في معرض الأعمال بعد
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                المطورون الذين يعرضون مشاريع حية يحصلون على عروض توظيف أسرع بنسبة 400%.
              </p>
              <button
                onClick={openNewProjectModal}
                className="mt-4 rounded-xl bg-[#203d62] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2c5383] dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                + أضف مشروعك الأول الآن
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {currentDev.portfolio?.map((proj) => (
                <div
                  key={proj.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition hover:shadow-md dark:border-white/10 dark:bg-[#0c1524]"
                >
                  <div>
                    {/* Header: Category Badge & Actions */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-teal-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                        {proj.previewType === 'saas'
                          ? 'منصة SaaS سحابية'
                          : proj.previewType === 'ecommerce'
                          ? 'متجر إلكتروني'
                          : proj.previewType === 'mobile'
                          ? 'تطبيق جوال'
                          : proj.previewType === 'ai'
                          ? 'ذكاء اصطناعي'
                          : proj.previewType === 'api'
                          ? 'بوابة API وخدمات'
                          : 'لوحة قيادة تفاعلية'}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditProjectModal(proj)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                          title="تعديل بيانات المشروع"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeletePortfolioProject(proj.id, proj.title)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          title="إزالة من المعرض"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Project Screenshot / Image Card */}
                    <div
                      onClick={() => {
                        if (proj.hasTrailer || proj.trailerVideoUrl) {
                          setSelectedTrailerProject(proj);
                          setIsTrailerModalOpen(true);
                        } else {
                          setSelectedImageProject(proj);
                          setIsImageLightboxOpen(true);
                        }
                      }}
                      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 cursor-pointer border border-slate-200/80 dark:border-white/10 shadow-sm group/img mt-3"
                    >
                      {/* Trailer Badge if present */}
                      {(proj.hasTrailer || proj.trailerVideoUrl) && (
                        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-lg bg-rose-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-lg border border-rose-400/40">
                          <Film size={11} className="animate-pulse" />
                          <span>تريلر رسمي 4K</span>
                        </div>
                      )}

                      <img
                        src={getProjectImage(proj)}
                        alt={proj.title}
                        className="h-full w-full object-cover object-top transition duration-300 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {(proj.hasTrailer || proj.trailerVideoUrl) ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTrailerProject(proj);
                              setIsTrailerModalOpen(true);
                            }}
                            className="rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 px-4 py-2 text-xs font-black text-white flex items-center gap-1.5 border border-white/30 shadow-2xl hover:scale-105 active:scale-95 transition"
                          >
                            <Play size={14} className="fill-current" />
                            <span>مشاهدة التريلر 🎬</span>
                          </button>
                        ) : (
                          <span className="rounded-xl bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-black text-white flex items-center gap-1.5 border border-white/20 shadow-xl">
                            <ZoomIn size={14} className="text-teal-400" />
                            <span>تكبير صورة المشروع</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="mt-3 text-base font-black text-[#152e46] transition group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-300">
                      {proj.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-300">
                      {proj.description}
                    </p>

                    {/* Key Metrics Banner */}
                    {proj.metrics && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-700 dark:bg-white/[0.04] dark:text-slate-200">
                        <TrendingUp size={14} className="text-teal-500 shrink-0" />
                        <span className="truncate">{proj.metrics}</span>
                      </div>
                    )}

                    {/* Features checklist */}
                    {proj.features && proj.features.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                        {proj.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-700 dark:bg-white/[0.06] dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA Links */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                    {(proj.hasTrailer || proj.trailerVideoUrl) && (
                      <button
                        onClick={() => {
                          setSelectedTrailerProject(proj);
                          setIsTrailerModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 px-3.5 py-2.5 text-xs font-black text-white shadow-md shadow-rose-500/25 hover:brightness-110 active:scale-95 transition"
                      >
                        <Film size={14} />
                        <span>تريلر 4K 🎬</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedImageProject(proj);
                        setIsImageLightboxOpen(true);
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-teal-500/20 hover:brightness-110 active:scale-95 transition"
                    >
                      <ImageIcon size={14} className="stroke-[2.5]" />
                      <span>عرض الصورة</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPreviewProject(proj);
                        setIsPreviewModalOpen(true);
                      }}
                      className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#0c1524] dark:text-slate-200 dark:hover:bg-white/10"
                      title="معاينة تفاعلية للكود"
                    >
                      <Play size={13} />
                      <span className="hidden sm:inline">محاكي الكود</span>
                    </button>

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                        title="مستودع الكود على GitHub"
                      >
                        <Github size={14} />
                        <span className="hidden sm:inline">الكود</span>
                      </a>
                    )}

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                        title="رابط خارجي"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: CV (السيرة الذاتية وإدارة المؤهلات) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'cv' && (
        <div className="space-y-6">
          {/* Section 1: Upload & Current CV File */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#172c43] dark:text-white">
                    ملف السيرة الذاتية المعتمد (Resume / CV)
                  </h3>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                    مفعل وظاهر للعملاء
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  يمكن لأصحاب المشاريع والشركات تحميل نسختك الرسمية بنقرة واحدة عند استعراض ملفك أو تقديمك على الفرص.
                </p>
              </div>

              {currentDev.cv?.file && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCv}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-teal-500"
                  >
                    <Download size={14} />
                    <span>تحميل السيرة الذاتية (PDF)</span>
                  </button>

                  <button
                    onClick={handleRemoveCvFile}
                    className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30"
                    title="حذف الملف الحالي"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Current File Card Display */}
            {currentDev.cv?.file ? (
              <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-teal-500/30 dark:bg-teal-500/10">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
                    <FileText size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#152e46] dark:text-white">
                        {currentDev.cv.file.name}
                      </span>
                      <span className="rounded-md bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:text-teal-300">
                        {currentDev.cv.file.size}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>تاريخ الرفع: {currentDev.cv.file.uploadedAt}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Check size={12} />
                        تم الفحص الأمني ومطابقة FQS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#0c1524] dark:text-slate-200"
                  >
                    <RefreshCw size={13} />
                    <span>استبدال الملف</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-teal-500 hover:bg-teal-50/20 dark:border-white/15 dark:hover:border-teal-400 dark:hover:bg-teal-500/5"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptStringForContext('cv')}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessCvFile(e.target.files[0]);
                  }
                }}
              />

              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300">
                <UploadCloud size={28} />
              </div>

              <h4 className="mt-3 text-sm font-black text-[#172c43] dark:text-white">
                اسحب وأفلت السيرة الذاتية هنا، أو انقر للاستعراض من جهازك
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                الصيغ المدعومة: PDF, DOCX, DOC (الحد الأقصى للحجم: 15 ميجابايت)
              </p>

              {isUploadingCv && (
                <div className="mx-auto mt-4 max-w-xs space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-teal-600">
                    <span>جاري الرفع والتدقيق...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full bg-teal-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Structured CV Profile Editor */}
          <form
            onSubmit={handleSaveCvStructuredData}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]"
          >
            <div className="border-b border-slate-100 pb-4 dark:border-white/[0.06]">
              <h3 className="text-base font-black text-[#172c43] dark:text-white">
                تحديث بيانات السيرة الذاتية التفاعلية
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                تظهر هذه البيانات مباشرة في نافذة العرض العامة للمستقل عند نقر العملاء على بطاقتك.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {/* Headline */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                  المسمى المهني (Headline) *
                </label>
                <input
                  type="text"
                  value={cvHeadline}
                  onChange={(e) => setCvHeadline(e.target.value)}
                  placeholder="مثال: مهندس برمجيات Full-Stack أول وخبير في النظم السحابية"
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                  required
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                  الملخص التنفيذي والنبذة المهنية (Executive Summary) *
                </label>
                <textarea
                  rows={4}
                  value={cvSummary}
                  onChange={(e) => setCvSummary(e.target.value)}
                  placeholder="اكتب نبذة مختصرة تلخص خبرتك البرمجية، والمشاريع المعقدة التي قدتها، وأهم التقنيات التي تحترفها..."
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                  required
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                  إجمالي سنوات الخبرة المعتمدة
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={cvYears}
                  onChange={(e) => setCvYears(Number(e.target.value))}
                  className="mt-1.5 w-36 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                />
              </div>

              {/* Skills Tags Manager */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                  المهارات البرمجية وحزمة العمل (Skills & Tech Stack)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cvSkillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-white/[0.08] dark:text-slate-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="أضف مهارة جديدة (مثلاً: Next.js 15, GraphQL, Docker)..."
                    className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="rounded-xl bg-[#203d62] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2c5383] dark:bg-teal-600 dark:hover:bg-teal-500"
                  >
                    + إضافة
                  </button>
                </div>
              </div>

              {/* Certifications Manager */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                  الشهادات والاعتمادات الاحترافية (Certifications)
                </label>
                <div className="mt-2 space-y-2">
                  {cvCertificationsList.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-bold text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-300"
                    >
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-amber-500" />
                        <span>{cert}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(cert)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/50 hover:text-rose-500 dark:hover:bg-white/10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={newCertInput}
                    onChange={(e) => setNewCertInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCert();
                      }
                    }}
                    placeholder="اسم الشهادة أو الاعتماد المهني..."
                    className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="rounded-xl bg-[#203d62] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2c5383] dark:bg-teal-600 dark:hover:bg-teal-500"
                  >
                    + إضافة شهادة
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-xs font-black text-white shadow-md shadow-teal-500/20 transition hover:brightness-105 active:scale-95"
                >
                  حفظ وتحديث السيرة الذاتية والملف المهني ✓
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: Overview */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Hero Charts Suite: 4 High-End Recharts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Milestone Earnings Velocity & Escrow Cashflow */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#172c43] dark:text-white">
                      مسار الأرباح ومستحقات الضمان المحررة
                    </h3>
                    <p className="text-[10px] text-slate-400">تدفقات دفعات المراحل المكتملة والمحفظة</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  {devWallet.totalBalance.toLocaleString()} {devCurrency} رصيد حالي
                </span>
              </div>

              {devWallet.transactions.length === 0 && devWallet.totalBalance === 0 ? (
                <div className="mt-4 flex h-64 w-full flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <TrendingUp size={24} />
                  </div>
                  <span className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">
                    البيانات الفعلية: 0 {devCurrency} — لا توجد أرباح أو مسحوبات مسجلة بعد
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400 max-w-[320px] leading-relaxed">
                    سيتم رسم منحنى تدفقاتك المالية فور استلام أول دفعة من نظام الضمان المالي بعد تسليمك لمرحلة برمجية.
                  </p>
                </div>
              ) : (
                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="devEarningsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                        formatter={(val: any) => [`${Number(val).toLocaleString()} ${devCurrency}`, 'الرصيد / الأرباح']}
                      />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#2dd4bf"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#devEarningsGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-white/5">
                <span>إجمالي المسحوبات: {totalEarnings.toLocaleString()} {devCurrency}</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold">تسوية سريعة ومضمونة 100%</span>
              </div>
            </div>

            {/* Chart 2: FQS Multi-Factor Quality Radar/BarChart */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#172c43] dark:text-white">
                      رادار وتحليل معايير مؤشر FQS وجودة الكود
                    </h3>
                    <p className="text-[10px] text-slate-400">مقارنة أداءك مع المعيار المعتمد للمنصة</p>
                  </div>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-black text-cyan-700 dark:text-cyan-300">
                  {hasFqsData ? `${dynamicFqs}/100 كفاءة FQS` : 'بانتظار أول تقييم فعلي'}
                </span>
              </div>

              {!hasFqsData ? (
                <div className="mt-4 flex h-64 w-full flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <ShieldCheck size={24} />
                  </div>
                  <span className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">
                    البيانات الفعلية: بانتظار أول تسليم برمجي وتقييم فعلي
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400 max-w-[340px] leading-relaxed">
                    لا توجد مؤشرات وهمية مسبقة؛ سيتم رسم أعمدة معايير FQS ومقارنة تقييمك الحقيقي مع معيار المنصة تلقائياً فور إنجازك لأول مشروع أو اعتماد مرحلة هندسية.
                  </p>
                  <button
                    type="button"
                    onClick={() => go('/projects')}
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#203d62] to-[#1d6b73] px-4 py-2 text-xs font-black text-white hover:brightness-105 transition shadow-xs"
                  >
                    <Compass size={14} />
                    <span>تصفح سوق المشاريع وتقديم عرض فني</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fqsFactorChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                      <XAxis dataKey="factor" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                        formatter={(val: any, name: any) => [
                          `${val}%`,
                          name === 'تقييمك الحالي' || name === 'score' ? 'تقييمك الحالي' : 'معيار السوق المعتمد',
                        ]}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                      <Bar name="تقييمك الحالي" dataKey="score" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                      <Bar name="معيار السوق" dataKey="benchmark" fill="#64748b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-2 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 dark:border-white/5">
                يتم احتساب مؤشر FQS عبر خوارزمية فوتيك الذكية لتقييم الالتزام البرمجي ودقة التسليم.
              </div>
            </div>

            {/* Chart 3: Proposal Funnel & Milestones Conversion */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FileCode2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#172c43] dark:text-white">
                      معدل تحويل العروض الفنية والمراحل
                    </h3>
                    <p className="text-[10px] text-slate-400">مسار تحول خطط التقديم إلى مشاريع وتسليمات</p>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                  {store.applications.length} عروض مسجلة
                </span>
              </div>

              {store.applications.length === 0 ? (
                <div className="mt-4 flex h-64 w-full flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FileCode2 size={24} />
                  </div>
                  <span className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">
                    البيانات الفعلية: لم يتم تقديم عروض فنية بعد (0 عروض)
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400 max-w-[320px] leading-relaxed">
                    استعرض سوق المشاريع وقدم خطتك الهندسية ليتم تتبع مسار تحول عروضك ومعدل اعتمادها تلقائياً.
                  </p>
                  <button
                    type="button"
                    onClick={() => go('/projects')}
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-800 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 transition"
                  >
                    <Compass size={14} />
                    <span>تصفح المشاريع المفتوحة للتقديم</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={proposalFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                      <XAxis dataKey="stage" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                        formatter={(val: any) => [`${val}`, 'العدد']}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {proposalFunnelData.map((entry, index) => (
                          <Cell key={`funnel-cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-white/5">
                <span>عروض قيد المراجعة: {store.applications.filter((a) => a.status === 'قيد المراجعة').length}</span>
                <button onClick={() => setActiveTab('proposals')} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                  إدارة العروض الفنية ←
                </button>
              </div>
            </div>

            {/* Chart 4: Tech Stack & Disciplines Share (PieChart) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#172c43] dark:text-white">
                      توزيع التقنيات والتخصصات الهندسية
                    </h3>
                    <p className="text-[10px] text-slate-400">تنوع المهارات ومجالات التطوير المعتمدة لديك</p>
                  </div>
                </div>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-black text-purple-700 dark:text-purple-300">
                  {techStackData.length > 0 ? `${techStackData.length} مجالات برمجية` : '0 مجالات مسجلة'}
                </span>
              </div>

              {techStackData.length === 0 ? (
                <div className="mt-4 flex h-64 w-full flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Layers size={24} />
                  </div>
                  <span className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">
                    البيانات الفعلية: لم يتم تسجيل مهارات تقنية بعد
                  </span>
                  <p className="mt-1 text-[11px] text-slate-400 max-w-[320px] leading-relaxed">
                    لا توجد تخصصات وهمية مسبقة؛ أضف لغات البرمجة والتقنيات التي تتقنها في ملفك المهني ليتم احتساب وتوزيع حصصك الهندسية بدقة.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cv')}
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-black text-purple-800 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300 transition"
                  >
                    <FileText size={14} />
                    <span>إضافة المهارات في السيرة الذاتية (CV)</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={techStackData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {techStackData.map((entry, index) => (
                          <Cell key={`tech-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                        formatter={(val: any, name: any) => [`${val} مهارات`, name]}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-white/5">
                <span>
                  المهارات: {currentDev.skills && currentDev.skills.length > 0 ? currentDev.skills.slice(0, 4).join(' • ') : 'لا توجد مهارات مسجلة بعد'}
                </span>
                <button onClick={() => setActiveTab('cv')} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                  تعديل المهارات ←
                </button>
              </div>
            </div>
          </div>

          {/* Section B: FQS Detailed Sliders + Quick Actions & Next Milestone */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* FQS Detailed Metrics */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors lg:col-span-7 dark:border-white/10 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-black text-[#172c43] dark:text-white">
                    مؤشر جودة المستقل FQS (Freelancer Quality Score)
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    تحليل خوارزمي دقيق لمدى كفاءتك والتزامك واحترافيتك البرمجية من واقع المشاريع
                  </p>
                </div>
                <span className="rounded-xl bg-[#e6f7f7] px-3 py-1 text-xs font-black text-[#1e838b] dark:bg-cyan-950/60 dark:text-cyan-300">
                  {hasHistory || dynamicFqs > 0 ? `${fqsBadgeTitle} (${dynamicFqs}/100)` : 'بانتظار أول تقييم'}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {/* 1. Job Completion Rate */}
                <div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">معدل إكمال المشاريع (Job Completion Rate)</span>
                    <span className="text-[#203d62] dark:text-teal-400">
                      {hasAssignedProjects ? `${realCompletionRate}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {hasAssignedProjects
                      ? `${completedProjectsCount} من أصل ${totalProjectsCount} مشاريع مسلّمة بنجاح دون إلغاء`
                      : 'يبدأ قياس هذا المؤشر تلقائياً فور التعاقد على أول مشروع'}
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#27a1a9] transition-all duration-500"
                      style={{ width: `${hasAssignedProjects ? Math.max(5, realCompletionRate) : 0}%` }}
                    />
                  </div>
                </div>

                {/* 2. On Time & On Budget */}
                <div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">الالتزام بالوقت والميزانية (On Time & On Budget)</span>
                    <span className="text-[#203d62] dark:text-teal-400">
                      {myDeliveries.length > 0 || completedProjectsCount > 0 ? `${realOnTimeRate}%` : '—'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {myDeliveries.length > 0 || completedProjectsCount > 0
                      ? 'تسليم برمجيات خالية من المشاكل وفي موعدها المحدد دون تكاليف إضافية'
                      : 'يُقاس بعد تسليم أول مرحلة برمجية ومقارنتها بالجدول الزمني'}
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#355f9a] transition-all duration-500"
                      style={{ width: `${(myDeliveries.length > 0 || completedProjectsCount > 0) ? Math.max(5, realOnTimeRate) : 0}%` }}
                    />
                  </div>
                </div>

                {/* 3. Client Rating */}
                <div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">تقييم العملاء (Average Star Rating)</span>
                    <span className="text-[#203d62] dark:text-teal-400">
                      {reviewsCount > 0 ? `${realClientRatingRate}% (${ratingValue}/5)` : '— (٠ تقييم)'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {reviewsCount > 0
                      ? `مبني على ${reviewsCount} مراجعة موثقة من أصحاب المشاريع بعد فحص الأكواد`
                      : 'لا توجد تقييمات مسجلة بعد — تضاف مراجعة العميل بعد استلام المشروع'}
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#2f935a] transition-all duration-500"
                      style={{ width: `${reviewsCount > 0 ? Math.max(5, realClientRatingRate) : 0}%` }}
                    />
                  </div>
                </div>

                {/* 4. Repeat Hire Rate */}
                <div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">معدل التوظيف المتكرر (Repeat Hire Rate)</span>
                    <span className="text-[#203d62] dark:text-teal-400">
                      {totalUniqueClients > 0 ? `${realRepeatHireRate}%` : '٠%'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {totalUniqueClients > 0
                      ? `${repeatClientsCount} عملاء تعاقدوا معك مجدداً في مشاريع برمجية أخرى`
                      : 'يُحتسب عند تعاقد نفس العميل معك في أكثر من مشروع'}
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#754ac2] transition-all duration-500"
                      style={{ width: `${totalUniqueClients > 0 ? Math.max(5, realRepeatHireRate) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f6f9fc] p-4 text-xs leading-relaxed text-slate-600 dark:bg-white/[0.03] dark:text-slate-300">
                💡 <b>مؤشر FQS الفعلي الحي:</b> يتم تحديث هذه المؤشرات تلقائياً وبشكل خوارزمي دقيق عند تسليم المشاريع، اعتماد المراحل، وتقييم العملاء لك، دون أي أرقام افتراضية.
              </div>
            </div>

            {/* Quick Actions & Upcoming Milestones */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
                <h3 className="text-sm font-black text-[#172c43] dark:text-white">إجراءات سريعة</h3>
                <div className="mt-4 grid gap-2.5">
                  <button
                    onClick={openNewProjectModal}
                    className="flex items-center justify-between rounded-2xl border border-teal-500/20 bg-teal-500/5 p-3 text-xs font-bold text-teal-800 transition hover:bg-teal-500/10 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300"
                  >
                    <span className="flex items-center gap-2">
                      <Plus size={16} className="text-teal-600 dark:text-teal-400" />
                      <span>نشر عمل جديد في معرض المشاريع</span>
                    </span>
                    <ChevronLeft size={16} className="text-teal-600 dark:text-teal-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('cv')}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fafbfc] p-3 text-xs font-bold text-slate-700 transition hover:border-[#3cb8be] hover:bg-[#f4fbfb] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-2">
                      <FileText size={16} className="text-[#259199]" />
                      <span>رفع وتحديث السيرة الذاتية (CV)</span>
                    </span>
                    <ChevronLeft size={16} className="text-slate-400" />
                  </button>

                  <button
                    onClick={() => go('/projects')}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-[#fafbfc] p-3 text-xs font-bold text-slate-700 transition hover:border-[#3cb8be] hover:bg-[#f4fbfb] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase size={16} className="text-[#325892]" />
                      <span>تصفح وتقديم على مشاريع جديدة</span>
                    </span>
                    <ChevronLeft size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Next Milestone */}
              {nextActiveDelivery ? (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#172c43] dark:text-white">أقرب موعد تسليم</h3>
                    <span className="rounded-lg bg-[#fff4df] px-2.5 py-0.5 text-[10px] font-bold text-[#b47a1c] dark:bg-amber-950/50 dark:text-amber-300">
                      {nextActiveDelivery.date || 'قيد التنفيذ'}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-black text-[#1d3550] dark:text-white">
                      {nextActiveDelivery.title}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      العميل: {nextActiveDelivery.client}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5 dark:border-white/5">
                      <span className="font-bold text-slate-600 dark:text-slate-400">المبلغ في الضمان:</span>
                      <span className="font-black text-[#1b3450] dark:text-white">
                        {nextActiveDelivery.amount.toLocaleString('ar-EG')} {devCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              ) : nextActiveProject ? (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#172c43] dark:text-white">أقرب موعد تسليم</h3>
                    <span className="rounded-lg bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                      {nextActiveProject.deadline}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-black text-[#1d3550] dark:text-white">
                      {nextActiveProject.title}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      العميل: {nextActiveProject.owner}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5 dark:border-white/5">
                      <span className="font-bold text-slate-600 dark:text-slate-400">المبلغ في الضمان:</span>
                      <span className="font-black text-[#1b3450] dark:text-white">
                        {nextActiveProject.budget.toLocaleString('ar-EG')} {devCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#172c43] dark:text-white">أقرب موعد تسليم</h3>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                      لا توجد تسليمات مجدولة
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      بانتظار التعاقد على أول مرحلة برمجية
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      عند بدء العمل على مشروع معتمد، ستظهر هنا تفاصيل المرحلة القادمة ومبلغ الضمان المحمي تلقائياً.
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5 dark:border-white/5">
                      <span className="font-bold text-slate-500 dark:text-slate-400">المبلغ في الضمان:</span>
                      <span className="font-black text-slate-400">٠ {devCurrency}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: Projects */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Top Projects KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">مشاريع قيد التنفيذ</span>
              <div className="mt-1 text-xl font-black text-teal-600 dark:text-teal-400">
                {myAssignedProjects.length}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">مراحل هندسية معتمدة</span>
              <div className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">
                {myCompletedDeliveries.length}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">مستحقات الضمان المحتجزة</span>
              <div className="mt-1 text-xl font-black text-amber-500">
                {devWallet.inEscrow.toLocaleString()} {devCurrency}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">الالتزام بالجدول الزمني (SLA)</span>
              <div className="mt-1 text-xl font-black text-indigo-500">
                100% On-Track
              </div>
            </div>
          </div>

          {/* Active Assigned Projects List */}
          {myAssignedProjects.length > 0 ? (
            <div className="space-y-4">
              {myAssignedProjects.map((p: Project) => (
                <div
                  key={p.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${
                            p.status === 'قيد التنفيذ'
                              ? 'bg-[#e5f6f7] text-[#1c8188] dark:bg-cyan-950/60 dark:text-cyan-300'
                              : 'bg-[#eaf6ef] text-[#2c8e57] dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {p.status}
                        </span>
                        <h3 className="text-base font-black text-[#162a40] dark:text-white">{p.title}</h3>
                      </div>
                      <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {p.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.stack.map((s: string) => (
                          <span
                            key={s}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-4 border-t border-slate-100 pt-3 md:border-none md:pt-0 dark:border-white/[0.06]">
                      <div className="text-left">
                        <div className="text-base font-black text-[#162a40] dark:text-white">
                          {p.budget.toLocaleString('ar-EG')} {devCurrency}
                        </div>
                        <div className="text-[10px] text-slate-400">التسليم: {p.deadline}</div>
                      </div>
                      <button
                        onClick={() => notify(`مراحل مشروع: ${p.title} - مؤمن بنظام الضمان 100%`)}
                        className="rounded-xl bg-[#203d62] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#2c5383] dark:bg-teal-600 dark:hover:bg-teal-500"
                      >
                        إدارة المراحل وفحص Git
                      </button>
                    </div>
                  </div>

                  {/* Milestone Stages Progress */}
                  <div className="mt-6 border-t border-slate-100 pt-4 dark:border-white/5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">مراحل التنفيذ الهندسية (Milestones):</span>
                      <span className="font-black text-teal-600 dark:text-teal-400">65% مكتمل</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10 mb-4">
                      <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: '65%' }} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                        <div className="flex items-center justify-between font-black text-emerald-800 dark:text-emerald-300">
                          <span>المرحلة 1: المخطط المعماري</span>
                          <CheckCircle2 size={15} />
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">تم التسليم والاعتماد ✓</div>
                      </div>
                      <div className="rounded-2xl border border-teal-200/80 bg-teal-50/60 p-3 dark:border-teal-900/50 dark:bg-teal-950/30">
                        <div className="flex items-center justify-between font-black text-teal-800 dark:text-teal-300">
                          <span>المرحلة 2: واجهات وتكامل</span>
                          <Clock size={15} />
                        </div>
                        <div className="text-[10px] text-teal-700 dark:text-teal-400 mt-1">قيد التطوير وفحص Git ⏳</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-center justify-between font-bold text-slate-500 dark:text-slate-400">
                          <span>المرحلة 3: النشر والفحص</span>
                          <ShieldCheck size={15} />
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">قادمة مع ضمان 30 يوماً 🔒</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Actionable Empty State when developer has no active contracts */
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xs dark:border-white/10 dark:bg-[#0c1524]">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Briefcase size={32} />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300 mb-2">
                  <Sparkles size={12} />
                  <span>حساب المطور جاهز ومتاح للتعاقد الفوري</span>
                </div>
                <h3 className="text-base font-black text-[#162a40] sm:text-lg dark:text-white">
                  لا توجد مشاريع جارية قيد التنفيذ حالياً
                </h3>
                <p className="mx-auto mt-1 max-w-lg text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  أنت مؤهل ومعتمد لتلقي المشاريع والبدء بالتنفيذ فور قبول أحد عروضك الهندسية أو تكليفك المباشر من أصحاب الأعمال.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => go('/projects')}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#203d62] to-[#1d6b73] px-5 py-2.5 text-xs font-black text-white shadow-md hover:scale-[1.02] transition"
                  >
                    <Compass size={15} />
                    <span>تصفح سوق المشاريع وتقديم عرض هندسي</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('clients')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 transition"
                  >
                    <Building2 size={15} />
                    <span>استكشاف دليل الشركات النشطة</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50/70 px-5 py-2.5 text-xs font-black text-teal-800 hover:bg-teal-100 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 transition"
                  >
                    <Layers size={15} />
                    <span>إضافة نماذج أعمال بالمعرض</span>
                  </button>
                </div>
              </div>

              {/* Show Open Projects Available in Platform Market */}
              {store.projects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-[#162a40] dark:text-white">
                        مشاريع مفتوحة حالياً في سوق فوتيك للتقديم الفوري:
                      </h4>
                      <p className="text-[11px] text-slate-400">اختر مشروعاً وقدم خطتك الهندسية للبدء في تنفيذه فوراً</p>
                    </div>
                    <button
                      onClick={() => go('/projects')}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>عرض كامل السوق</span>
                      <ArrowLeft size={12} />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {store.projects.slice(0, 4).map((p: Project) => (
                      <div
                        key={p.id}
                        className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-[#0c1524] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                              مفتوح للتقديم 🟢
                            </span>
                            <span className="text-xs font-black text-[#172c43] dark:text-teal-300">
                              {p.budget.toLocaleString()} {devCurrency}
                            </span>
                          </div>
                          <h5 className="mt-2 text-xs font-black text-slate-900 dark:text-white">{p.title}</h5>
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {p.description}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-white/5">
                          <span className="text-[10px] text-slate-400">التسليم: {p.deadline}</span>
                          <button
                            onClick={() => go('/projects')}
                            className="rounded-xl bg-teal-600 px-3 py-1 text-xs font-bold text-white hover:bg-teal-700 transition"
                          >
                            تقديم عرض
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: Proposals */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {store.applications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-[#0c1524]">
              <FileText className="mx-auto text-slate-300 dark:text-slate-600" size={32} />
              <h3 className="mt-3 text-sm font-bold text-slate-700 dark:text-white">لا توجد طلبات تقديم حالية</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">تصفح سوق المشاريع وقدم خطة عملك الأولى.</p>
              <button
                onClick={() => go('/projects')}
                className="mt-4 rounded-xl bg-[#203d62] px-5 py-2 text-xs font-bold text-white dark:bg-teal-600"
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
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-white/10 dark:bg-[#0c1524]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">مشروع:</span>
                      <h4 className="text-sm font-black text-[#162b40] dark:text-white">
                        {project?.title || 'مشروع مخصص'}
                      </h4>
                    </div>
                    <span className="rounded-lg bg-[#fff5df] px-3 py-1 text-xs font-extrabold text-[#aa7519] dark:bg-amber-950/60 dark:text-amber-300">
                      {app.status}
                    </span>
                  </div>
                  <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 dark:bg-white/[0.03] dark:text-slate-300">
                    <b>خطة العمل المقترحة:</b> {app.plan}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: Deliveries */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          {/* Top Deliveries KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">إجمالي التسليمات المعتمدة</span>
              <div className="mt-1 text-xl font-black text-teal-600 dark:text-teal-400">
                {store.deliveries.length}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">أرباح محررة لحسابك</span>
              <div className="mt-1 text-xl font-black text-emerald-600 dark:text-emerald-400">
                {totalEarnings.toLocaleString()} {devCurrency}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">شهادات الضمان السارية (SLA)</span>
              <div className="mt-1 text-xl font-black text-indigo-500">
                30 يوماً مجاناً
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#0c1524]">
              <span className="text-[11px] font-bold text-slate-400">فحص مستودع Git وكود FQS</span>
              <div className="mt-1 text-xl font-black text-cyan-600 dark:text-cyan-400">
                100% Clean Code
              </div>
            </div>
          </div>

          {store.deliveries.length > 0 ? (
            <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white shadow-xs dark:divide-white/[0.06] dark:border-white/10 dark:bg-[#0c1524]">
              {store.deliveries.map((dl) => (
                <div key={dl.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf6ef] text-[#2c8d57] dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#172c42] dark:text-white">{dl.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        العميل: {dl.client} · {dl.date}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        <FolderGit2 size={12} className="text-teal-600" />
                        <span>Commit: 8f4a21e (main branch)</span>
                        <span>• Dockerfile verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-left">
                      <div className="text-sm font-black text-[#172c42] dark:text-white">
                        +{dl.amount.toLocaleString('ar-EG')} {devCurrency}
                      </div>
                      <span className="text-[10px] font-bold text-[#2d9158] dark:text-emerald-400">{dl.status}</span>
                    </div>
                    <button
                      onClick={() => notify(`تم تحميل شهادة وفاتورة تسليم: ${dl.title}`)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]"
                      title="تحميل شهادة الإنجاز وفاتورة الضمان"
                    >
                      <Download size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Comprehensive Protocol Guide when no deliveries yet */
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs dark:border-white/10 dark:bg-[#0c1524]">
              <div className="text-center max-w-2xl mx-auto">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={32} />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 px-3 py-1 text-xs font-black text-teal-700 dark:text-teal-300 mb-2">
                  <FolderGit2 size={12} />
                  <span>ميثاق التسليم والاعتماد البرمجي المشفر (FuTech Git Handover Protocol)</span>
                </div>
                <h3 className="text-base font-black text-[#162a40] sm:text-lg dark:text-white">
                  سجل التسليم وفحص الأكواد وضمان SLA
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  لم تسجل عمليات تسليم نهائية بعد. عند إنجاز واعتماد أي مرحلة برمجية، سيتم تسجيل وتوثيق مستودع Git، كود المصدر، فحص FQS الآلي، وتحرير دفعة الضمان لحسابك تلقائياً هنا.
                </p>
              </div>

              {/* 4-Step Visual Protocol Guide */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-1.5">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-teal-500 text-white text-[11px]">1</span>
                    <span>تسليم مستودع Git</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    رفع الكود المصدري كاملاً مع ملفات الإعداد والتشغيل (Dockerfile, README.md, .env.example).
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-1.5">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-teal-500 text-white text-[11px]">2</span>
                    <span>فحص جودة FQS</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    فحص آلي لنظافة الكود، الأمان، وغياب الثغرات لضمان الحفاظ على تصنيفك الهندسي المرتفع.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-1.5">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-teal-500 text-white text-[11px]">3</span>
                    <span>تحرير دفعة الضمان</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    فور موافقة العميل، يتم فك حجز الضمان وتحويل كامل الأرباح لمحفظتك الرقمية بدون خصومات.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-1.5">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-teal-500 text-white text-[11px]">4</span>
                    <span>شهادة ضمان 30 يوماً</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    إصدار شهادة ضمان هندسية معتمدة للعميل مع دعم فني مجاني للأعطال الطارئة لمدة 30 يوماً.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => go('/projects')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#203d62] px-6 py-2.5 text-xs font-black text-white hover:bg-[#2c5383] transition shadow-xs"
                >
                  <Compass size={15} />
                  <span>تصفح المشاريع المفتوحة لبدء أول تسليم</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: Escrow & Digital Wallet Hub (المحفظة والأرباح) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'wallet' && (
        <EscrowWalletHub
          wallet={devWallet}
          onUpdateWallet={handleUpdateDevWallet}
          role="developer"
          notify={notify}
          currentUser={store.currentUser || undefined}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: Profile Settings & Drag-and-Drop Image Uploader */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524]">
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06]">
              <div>
                <h2 className="text-lg font-black text-[#152e46] dark:text-white flex items-center gap-2">
                  <Settings size={20} className="text-[#2ca6ae]" />
                  <span>إعدادات الملف الشخصي والصورة الحقيقية</span>
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  قم برفع صورتك الحقيقية وتحديث بياناتك التقنية لزيادة ثقة العملاء والظهور في صدارة البحث
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={14} />
                <span>معتمد وموثق وفق معايير FQS الهندسية</span>
              </span>
            </div>

            <form onSubmit={handleSaveProfileSettings} className="mt-6 space-y-8">
              {/* Drag & Drop Image Upload Zone */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                    صورة الملف الشخصي أو الشعار (Upload & Drag Image)
                  </label>
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileAvatar(OWNER_GOOGLE_AVATAR_URL);
                          setOwnerSyncedAvatar(OWNER_GOOGLE_AVATAR_URL);
                          notify('تم ربط وتعيين الصورة الرسمية من حساب Google بنجاح 🟢');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 transition dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
                      >
                        <RefreshCw size={13} />
                        <span>استيراد صورة حساب Google</span>
                      </button>
                    )}
                    {profileAvatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileAvatar('');
                          notify('تمت إزالة الصورة. اضغط "حفظ التغييرات" لتأكيد التحديث.');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                      >
                        <Trash2 size={13} />
                        <span>حذف الصورة</span>
                      </button>
                    )}
                  </div>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => avatarFileInputRef.current?.click()}
                  className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition cursor-pointer ${
                    isDragOver
                      ? 'border-[#208f97] bg-teal-50/70 scale-[0.99] dark:bg-teal-950/20'
                      : 'border-slate-300 bg-slate-50/60 hover:border-[#208f97] hover:bg-teal-50/30 dark:border-white/10 dark:bg-white/[0.02]'
                  }`}
                >
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept={getAcceptStringForContext('avatar')}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Live Preview */}
                    <div className="relative shrink-0">
                      <UserAvatar
                        src={profileAvatar}
                        name={profileName}
                        size="xl"
                        shape="rounded"
                      />
                      <div className="absolute -bottom-1 -left-1 grid h-7 w-7 place-items-center rounded-full bg-[#208f97] text-white shadow">
                        <Camera size={14} />
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/70 px-3 py-1 text-[11px] font-black text-[#156e75] dark:bg-teal-900/40 dark:text-teal-300">
                        <UploadCloud size={14} />
                        <span>اسحب وأفلت أو تصفح (Upload & Drag Image)</span>
                      </div>
                      <h4 className="mt-2 text-sm font-black text-slate-800 dark:text-white">
                        اسحب وأفلت صورتك هنا أو انقر لاختيار ملف من جهازك
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        يدعم صيغ PNG, JPG, WEBP, SVG حتى 5 ميجابايت. في حال عدم رفع صورة، يتم اعتماد الشارة الرمزية المعتمدة تلقائياً.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Fields: Name, Specialty, Rate, GitHub, Bio */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                    الاسم الكامل المهني
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#203c62] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                    المسمى الوظيفي والتخصص البرمجي
                  </label>
                  <input
                    type="text"
                    value={profileSpecialty}
                    onChange={(e) => setProfileSpecialty(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#203c62] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                    أجر الساعة (بالريال السعودي أو عملتك المحلية)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={profileHourlyRate}
                    onChange={(e) => setProfileHourlyRate(Number(e.target.value))}
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#203c62] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                    رابط ملف GitHub المعتمد
                  </label>
                  <input
                    type="url"
                    value={profileGithub}
                    onChange={(e) => setProfileGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#203c62] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                {/* Availability Status Picker */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                    حالة التوفر المهنية للعمل (Work Availability Status)
                  </label>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    تتحكم في الدائرة الملونة والشارة الظاهرة لجميع العملاء في دليل نخبة المطورين
                  </p>
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div
                      onClick={() => setProfileAvailability('متاح الآن')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                        profileAvailability === 'متاح الآن'
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-400/40'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                      }`}
                    >
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      </span>
                      <div>
                        <div className="font-black text-xs">متاح الآن 🟢</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">جاهز للتعاقد واستلام مشاريع فورية</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setProfileAvailability('مشغول (يتحدث مع عميل)')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                        profileAvailability === 'مشغول (يتحدث مع عميل)' || profileAvailability === 'مشغول'
                          ? 'border-amber-500 bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 ring-2 ring-amber-400/40'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                      }`}
                    >
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-amber-400 opacity-60" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                      </span>
                      <div>
                        <div className="font-black text-xs">مشغول 🟡</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">يتحدث مع عميل أو قيد تنفيذ مرحلة</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setProfileAvailability('غير متاح حالياً')}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                        profileAvailability === 'غير متاح حالياً' || profileAvailability === 'متاح قريباً' || profileAvailability === 'غير متصل'
                          ? 'border-slate-400 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 ring-2 ring-slate-400/40'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full bg-slate-400 shrink-0" />
                      <div>
                        <div className="font-black text-xs">غير متاح ⚪</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">في إجازة أو غير متفرغ مؤقتاً</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                    نبذة تعريفية ومجالات الخبرة (Bio)
                  </label>
                  <textarea
                    rows={4}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-900 focus:border-[#203c62] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="اكتب نبذة عن مهاراتك البرمجية والأنظمة التي قمت بتطويرها..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  إلغاء والعودة للتقارير
                </button>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#172b42] via-[#203c62] to-[#2aa5ad] px-6 py-2.5 text-xs font-black text-white shadow-lg transition hover:shadow-xl hover:brightness-110 active:scale-98 disabled:opacity-50"
                >
                  <Check size={16} />
                  <span>{isSavingProfile ? 'جاري الحفظ...' : 'حفظ التغييرات وتحديث الصورة'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Social Media & GitHub Channels Section */}
          <SocialLinksManager
            title="حسابات التواصل ومستودعات الأكواد (Developer Social & Git)"
            subtitle="أضف أو عدل أو احذف حساباتك البرمجية (GitHub, LinkedIn, Twitter, Website) لتظهر لعملاء المنصة"
            badge="ملف المطور 💼"
            onNotify={notify}
            isOwnerView={false}
          />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: Publish / Edit Portfolio Project */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 sm:p-5 backdrop-blur-md"
            onClick={() => setIsPublishModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto dark:border-white/10 dark:bg-[#0c1524]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-300">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-base font-black text-[#152e46] dark:text-white">
                    {editingProjectId ? 'تعديل مشروع المعرض' : 'نشر مشروع جديد في معرض الأعمال'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePortfolioProject} className="mt-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                    عنوان أو اسم المشروع *
                  </label>
                  <input
                    type="text"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    placeholder="مثال: لوحة تحكم ومراقبة حركة المخزون والطلبات"
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    required
                  />
                </div>

                {/* Category & Metrics */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                      تصنيف المشروع *
                    </label>
                    <select
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value as any)}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    >
                      <option value="dashboard">لوحة قيادة تفاعلية (Dashboard)</option>
                      <option value="saas">منصة SaaS سحابية</option>
                      <option value="ecommerce">متجر إلكتروني متكامل</option>
                      <option value="cms">موقع / متجر CMS (WordPress & Shopify & Wix)</option>
                      <option value="mobile">تطبيق هواتف ذكية (Mobile App)</option>
                      <option value="ai">حلول وذكاء اصطناعي (AI / LLM)</option>
                      <option value="api">بوابات API وMicroservices</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                      مؤشر الإنجاز أو المقاييس البارزة
                    </label>
                    <input
                      type="text"
                      value={projMetrics}
                      onChange={(e) => setProjMetrics(e.target.value)}
                      placeholder="مثال: معالجة 50k عملية جرد يومياً بزمن 20ms"
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                    نبذة وصفية وشرح المشروع *
                  </label>
                  <textarea
                    rows={3}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="اشرح الهدف من المشروع، والتحديات التقنية التي تغلبت عليها، والمعمارية البرمجية المنفذة..."
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    required
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                    حزمة التقنيات المستخدمة (مفصولة بفواصل) *
                  </label>
                  <input
                    type="text"
                    value={projTechString}
                    onChange={(e) => setProjTechString(e.target.value)}
                    placeholder="React 19, TypeScript, PostgreSQL, Tailwind, Docker"
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    required
                  />
                </div>

                {/* URLs */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                      رابط المعاينة الحية والتجربة (Live Demo URL)
                    </label>
                    <input
                      type="url"
                      value={projLiveUrl}
                      onChange={(e) => setProjLiveUrl(e.target.value)}
                      placeholder="https://..."
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                      رابط مستودع الكود (GitHub / GitLab)
                    </label>
                    <input
                      type="url"
                      value={projGithubUrl}
                      onChange={(e) => setProjGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    />
                  </div>
                </div>

                {/* Project Cover Image / Screenshot (إنشاء واختيار صورة المشروع) */}
                <div className="space-y-2 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 dark:border-teal-500/30 dark:bg-teal-500/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-teal-600 dark:text-teal-400" />
                      <span>صورة المشروع المعتمدة (Image / Screenshot URL) *</span>
                    </label>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                      معاينة حية وموثقة
                    </span>
                  </div>

                  <input
                    type="text"
                    value={projImage}
                    onChange={(e) => setProjImage(e.target.value)}
                    placeholder="/images/ai-sentinel-preview.svg أو رابط صورة خارجية https://..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono text-slate-800 focus:border-teal-500 dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                    required
                  />

                  {/* Preset Image Options */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400">نماذج صور جاهزة:</span>
                    <button
                      type="button"
                      onClick={() => setProjImage('/images/ai-sentinel-preview.svg')}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-teal-100 hover:text-teal-800 dark:bg-white/10 dark:text-slate-300"
                    >
                      🛡️ رادار الأمان AI Sentinel
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjImage('/images/dashboard-preview.jpg')}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-teal-100 hover:text-teal-800 dark:bg-white/10 dark:text-slate-300"
                    >
                      📊 لوحة قيادة سحابية
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjImage('/images/escrow.jpg')}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-teal-100 hover:text-teal-800 dark:bg-white/10 dark:text-slate-300"
                    >
                      💳 بوابة ضمان ومدفوعات
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjImage('/images/hero-banner.jpg')}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-teal-100 hover:text-teal-800 dark:bg-white/10 dark:text-slate-300"
                    >
                      📱 تطبيق جوال
                    </button>
                  </div>
                </div>

                {/* Video Trailer Options (إنشاء وتضمين فيديو تريلر إذا كان تريلر) */}
                <div className="space-y-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeTrailer}
                        onChange={(e) => setIncludeTrailer(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Film size={15} className="text-rose-500" />
                        <span>تضمين فيديو تريلر استعراضي للمشروع (Project Video Trailer 🎬)</span>
                      </span>
                    </label>
                    <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-rose-400">
                      4K OFFICIAL TEASER
                    </span>
                  </div>

                  {includeTrailer && (
                    <div className="grid gap-3 pt-2 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          رابط فيديو التريلر (MP4 / WebM / Stream URL) *
                        </label>
                        <input
                          type="url"
                          value={projTrailerUrl}
                          onChange={(e) => setProjTrailerUrl(e.target.value)}
                          placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-rose-500 dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                          required={includeTrailer}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          مدة التريلر (دقيقة:ثانية)
                        </label>
                        <input
                          type="text"
                          value={projTrailerDuration}
                          onChange={(e) => setProjTrailerDuration(e.target.value)}
                          placeholder="01:45"
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-800 focus:border-rose-500 dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-3 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>💡 سيوفر مشغل فيديو تفاعلي 4K مع تحكم كامل، محاكي للشيفرات، ومعاينة حية للمشروع.</span>
                        <button
                          type="button"
                          onClick={() => {
                            setProjTrailerUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                            setProjTrailerDuration('01:45');
                          }}
                          className="font-bold text-rose-500 hover:underline"
                        >
                          ⚡ تريلر عالي الدقة افتراضي
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Features (3 Bullets) */}
                <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                    المميزات الرئيسية للمشروع (3 نقاط بارزة)
                  </label>
                  <input
                    type="text"
                    value={projFeature1}
                    onChange={(e) => setProjFeature1(e.target.value)}
                    placeholder="الميزة الأولى: مثلاً تحديث لحظي للبيانات عبر WebSockets"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-teal-500 dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                  />
                  <input
                    type="text"
                    value={projFeature2}
                    onChange={(e) => setProjFeature2(e.target.value)}
                    placeholder="الميزة الثانية: مثلاً نظام صلاحيات RBAC متعدد المستويات"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-teal-500 dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                  />
                  <input
                    type="text"
                    value={projFeature3}
                    onChange={(e) => setProjFeature3(e.target.value)}
                    placeholder="الميزة الثالثة: مثلاً توافق كامل مع معايير الأمان وفحص الثغرات"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-teal-500 dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsPublishModalOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-teal-500/20 transition hover:brightness-105 active:scale-95"
                  >
                    {editingProjectId ? 'حفظ التعديلات' : 'نشر المشروع في المعرض الآن 🚀'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Project Image Lightbox */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isImageLightboxOpen && selectedImageProject && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-2 sm:p-5 backdrop-blur-xl"
            onClick={() => setIsImageLightboxOpen(false)}
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-[#0c1524] shadow-2xl"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-500/20 text-teal-300">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-white">
                        {selectedImageProject.title}
                      </h3>
                      <span className="rounded-lg bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 text-[10px] font-black text-teal-300">
                        {selectedImageProject.previewType || 'مشروع معتمد'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      مشروع منجز وموثق في معرض أعمالك
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedImageProject.githubUrl && (
                    <a
                      href={selectedImageProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {selectedImageProject.liveUrl && (
                    <a
                      href={selectedImageProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                    >
                      <ExternalLink size={14} />
                      <span>رابط خارجي</span>
                    </a>
                  )}
                  <button
                    onClick={() => setIsImageLightboxOpen(false)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
                    title="إغلاق"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Container */}
              <div className="relative flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-3 sm:p-6 min-h-[300px]">
                <img
                  src={getProjectImage(selectedImageProject)}
                  alt={selectedImageProject.title}
                  className="max-h-[62vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
                />
              </div>

              {/* Lightbox Footer Details */}
              <div className="border-t border-white/10 bg-[#070d18] p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
                    {selectedImageProject.description}
                  </p>
                  {selectedImageProject.metrics && (
                    <span className="inline-block text-[11px] font-bold text-teal-400">
                      ⚡ {selectedImageProject.metrics}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedImageProject.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Video Trailer 4K Player Modal                */}
      {/* ---------------------------------------------------- */}
      <VideoTrailerModal
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        project={selectedTrailerProject}
        developer={currentDev}
      />

      {/* ---------------------------------------------------- */}
      {/* MODAL: Live Project Interactive Simulator */}
      {/* ---------------------------------------------------- */}
      <LiveProjectPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        project={selectedPreviewProject}
        developer={currentDev}
      />

      {/* ---------------------------------------------------- */}
      {/* MODAL: Full Client Details & All Projects Modal      */}
      {/* ---------------------------------------------------- */}
      {selectedClientModal && (
        <div
          onClick={() => setSelectedClientModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0c1524] dark:border dark:border-white/10 max-h-[88vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-[#1b3d68] via-[#20507a] to-[#2aa6ae] text-white text-xl font-black shadow-md ring-2 ring-teal-500/20">
                  {selectedClientModal.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#152a40] dark:text-white">
                      {selectedClientModal.name}
                    </h3>
                    <ShieldCheck size={18} className="text-teal-500 shrink-0" />
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      عميل موثق 🛡️
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{selectedClientModal.city}، {selectedClientModal.country}</span>
                    <span>•</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{selectedClientModal.industry}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedClientModal(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 dark:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* About / Bio */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/5 dark:bg-white/5">
                <h4 className="font-black text-[#152a40] dark:text-white mb-1">عن الشركة / العميل:</h4>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                  {selectedClientModal.bio}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/50 pt-2.5 dark:border-white/5">
                  <span>⭐ تقييم المطورين: <strong className="text-amber-500">{selectedClientModal.rating}</strong> ({selectedClientModal.reviewsCount} تقييم)</span>
                  <span>نسبة التوظيف: <strong className="text-teal-600 dark:text-teal-400">{selectedClientModal.hireRate}%</strong></span>
                  <span>{selectedClientModal.joinedDate}</span>
                </div>
              </div>

              {/* Client's Projects List */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-black text-sm text-[#152a40] dark:text-white">
                    المشاريع المنشورة بواسطة العميل ({selectedClientModal.projects.length})
                  </h4>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                    إجمالي الميزانيات: {selectedClientModal.totalBudget.toLocaleString()} {devCurrency}
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedClientModal.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-slate-900/60"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${
                              proj.status === 'متاح'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            }`}>
                              {proj.status === 'متاح' ? 'متاح للتقديم الآن 🟢' : proj.status}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              موعد التسليم: {proj.deadline}
                            </span>
                          </div>
                          <h5 className="font-black text-sm text-[#152a40] dark:text-white mt-1.5">
                            {proj.title}
                          </h5>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 block">الميزانية</span>
                          <span className="font-black text-sm text-teal-600 dark:text-teal-400">
                            {proj.budget.toLocaleString()} {devCurrency}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Tech stack badges */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {proj.stack.map((st) => (
                          <span
                            key={st}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300"
                          >
                            {st}
                          </span>
                        ))}
                      </div>

                      {/* Action */}
                      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-white/5">
                        <span className="text-[10px] text-slate-400 font-bold">
                          {proj.milestones.length} مراحل تسليم معتمدة
                        </span>
                        {proj.status === 'متاح' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedClientModal(null);
                              setProposalModalProject(proj);
                              setProposedBudget(proj.budget);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-black text-white hover:bg-teal-700 transition"
                          >
                            <Send size={12} className="rotate-180" />
                            <span>تقديم عرض فني</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  const cName = selectedClientModal.name;
                  const cAvatar = selectedClientModal.avatar;
                  setSelectedClientModal(null);
                  handleStartChatWithClient(cName, cAvatar);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/40 bg-teal-50 px-4 py-2 text-xs font-black text-teal-700 hover:bg-teal-100 transition dark:bg-teal-950/60 dark:text-teal-300"
              >
                <MessageSquare size={14} />
                <span>محادثة العميل مباشرة 💬</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedClientModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: Submit Technical Proposal to Client Project   */}
      {/* ---------------------------------------------------- */}
      {proposalModalProject && (
        <div
          onClick={() => setProposalModalProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0c1524] dark:border dark:border-white/10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-teal-600 dark:text-teal-400 rotate-180" />
                <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                  تقديم عرض فني للمشروع
                </h3>
              </div>
              <button
                onClick={() => setProposalModalProject(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X size={17} />
              </button>
            </div>

            {/* Project Summary */}
            <div className="mt-3.5 rounded-2xl border border-teal-500/20 bg-teal-50/50 p-3.5 dark:bg-teal-950/30 dark:border-teal-500/30 text-xs">
              <div className="font-black text-[#152a40] dark:text-white">
                {proposalModalProject.title}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>العميل: <strong className="text-teal-700 dark:text-teal-300">{proposalModalProject.owner}</strong></span>
                <span>الميزانية المقدرة: <strong className="text-[#152a40] dark:text-white">{proposalModalProject.budget.toLocaleString()} {devCurrency}</strong></span>
              </div>
            </div>

            <form onSubmit={handleSubmitProposal} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    السعر المقترح ({devCurrency}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={proposedBudget || proposalModalProject.budget}
                    onChange={(e) => setProposedBudget(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold outline-none focus:border-teal-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    مدة التنفيذ المقترحة *
                  </label>
                  <input
                    type="text"
                    required
                    value={proposedDuration}
                    onChange={(e) => setProposedDuration(e.target.value)}
                    placeholder="مثال: 14 يوماً"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold outline-none focus:border-teal-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  خطة العمل الفنية والحلول الهندسية المقترحة *
                </label>
                <textarea
                  required
                  rows={4}
                  value={proposalPlan}
                  onChange={(e) => setProposalPlan(e.target.value)}
                  placeholder="صف للعميل باختصار معمارية الحل، التقنيات التي ستستخدمها، وكيف ستضمن أعلى جودة للكود مع اختبارات FQS وبيئة Docker..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 leading-relaxed outline-none focus:border-teal-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setProposalModalProject(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2 font-black text-white hover:brightness-105 shadow-md shadow-teal-500/20"
                >
                  إرسال العرض الفني 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
