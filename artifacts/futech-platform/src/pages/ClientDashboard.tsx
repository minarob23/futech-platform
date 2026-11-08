import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Briefcase, Plus, Ticket, Users, FileCode2, Clock, CheckCircle2,
  AlertCircle, Search, MessageSquare, ExternalLink, ShieldCheck,
  Star, DollarSign, Calendar, ChevronRight, Filter, ArrowUpRight,
  Send, Sparkles, Building2, Code2, GitFork, ArrowLeft, X, Wallet,
  Paperclip, Image as ImageIcon, FileText, Check, CheckCheck, Eye,
  Download, Archive, RefreshCw, MessageCircle, UserCheck, Bot, User as UserIcon,
  UploadCloud, Camera, Settings, Trash2, Building, Phone, Globe, Mail,
  Bell, BellRing, Lock, Unlock, ShieldAlert, Inbox, Info
} from 'lucide-react';
import {
  Store, Project, Application, Ticket as TicketType, User, Developer,
  ClientReview, UserWallet, INITIAL_CLIENT_WALLET, Conversation, MessageItem, MessageAttachment,
  AppNotification
} from '../types';
import {
  getRealNotifications,
  saveReadNotificationId,
  saveAllReadNotificationIds,
  saveDismissedNotificationId,
  saveAllDismissedNotificationIds,
} from '../lib/notifications';
import { AddReviewModal } from '../components/AddReviewModal';
import { EscrowWalletHub } from '../components/EscrowWalletHub';
import { UserAvatar } from '../components/UserAvatar';
import { useAuth } from '../lib/AuthContext';
import { validateUploadedFile, getAcceptStringForContext } from '../lib/fileSecurity';

interface ClientDashboardProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
  currentUser?: User;
}

// Default initial conversations if empty so client can chat immediately
const DEFAULT_CLIENT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-tariq-dev',
    projectId: 'منصة التجارة والخدمات السحابية',
    otherUser: 'طارق الشمري',
    otherUserAvatar: '',
    online: true,
    messages: [
      {
        id: 'msg-t-1',
        body: 'السلام عليكم أخي الكريم، يسعدني العمل معك على مشروع منصة التجارة والخدمات السحابية. قمت بمراجعة متطلبات الواجهات البرمجية وتصميم قواعد البيانات.',
        sender: 'other',
        time: '10:30 ص',
        read: true,
      },
      {
        id: 'msg-t-2',
        body: 'أهلاً بك مهندس طارق! ممتاز جداً. ما هي خطتك بالنسبة لتوثيق الـ API واختبارات الأداء وفق معايير FQS؟',
        sender: 'me',
        time: '10:35 ص',
        read: true,
      },
      {
        id: 'msg-t-3',
        body: 'سنقوم بتطبيق Swagger / OpenAPI بالكامل مع تغطية اختبارات بنسبة تفوق 90% (Unit & Integration Tests) عبر Vitest، بالإضافة إلى ملفات Docker جاهزة للنشر السحابي.',
        sender: 'other',
        time: '10:42 ص',
        read: true,
      },
      {
        id: 'msg-t-4',
        body: 'رائع جداً، لقد تم حجز قيمة المرحلة الأولى في محفظة الضمان (Escrow) ويمكنك البدء فوراً.',
        sender: 'me',
        time: '10:50 ص',
        read: true,
      },
      {
        id: 'msg-t-5',
        body: 'شكراً لثقتك! سنبدأ اليوم وسأزودك برابط الـ GitHub Repository ومستودع الكود للمتابعة المستمرة أولاً بأول.',
        sender: 'other',
        time: '11:00 ص',
        read: true,
      },
    ],
  },
  {
    id: 'conv-layan-dev',
    projectId: 'نظام إدارة المخزون متعدد الفروع',
    otherUser: 'ليان العتيبي',
    otherUserAvatar: '',
    online: true,
    messages: [
      {
        id: 'msg-l-1',
        body: 'مرحباً، أود إعلامك بأنه تم الانتهاء من فحص معمارية نظام إدارة المخزون متعدد الفروع وجميع ملفات الـ Dockerfile و README.md أصبحت مكتملة.',
        sender: 'other',
        time: 'أمس 04:15 م',
        read: true,
      },
      {
        id: 'msg-l-2',
        body: 'عمل متقن يا مهندسة ليان! تأكدت من سلامة الكود وتم نقل ملكية المستودع بنجاح.',
        sender: 'me',
        time: 'أمس 04:30 م',
        read: true,
      },
      {
        id: 'msg-l-3',
        body: 'العفو! والضمان المجاني لمدة 30 يوماً فعال الآن لأي استفسار أو صيانة ضمن اتفاقية SLA.',
        sender: 'other',
        time: 'أمس 04:35 م',
        read: true,
      },
    ],
  },
  {
    id: 'conv-sarah-dev',
    projectId: 'لوحة التحكم والواجهات التفاعلية',
    otherUser: 'سارة الزهراني',
    otherUserAvatar: '',
    online: true,
    messages: [
      {
        id: 'msg-s-1',
        body: 'مرحباً بك! يسعدني العمل معك على تطوير واجهات المشروع التفاعلية بأحدث معايير React 19 وتجربة مستخدم متميزة.',
        sender: 'other',
        time: '2025-02-15 02:00 م',
        read: true,
      },
      {
        id: 'msg-s-2',
        body: 'أهلاً بكِ مهندسة سارة، تم استعراض نماذج التصميم وهي ممتازة ومطابقة للمطلوب.',
        sender: 'me',
        time: '2025-02-15 02:10 م',
        read: true,
      },
    ],
  },
];

export function ClientDashboard({
  store,
  update,
  notify,
  go,
  currentUser,
}: ClientDashboardProps) {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'proposals' | 'chat' | 'tickets' | 'handovers' | 'wallet' | 'settings' | 'notifications'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Settings & Drag & Drop Avatar State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileCompany, setProfileCompany] = useState(currentUser?.company || '');
  const [profileTitle, setProfileTitle] = useState(currentUser?.title || 'صاحب أعمال ومشاريع');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileCountry, setProfileCountry] = useState(currentUser?.country || 'مصر');
  const [profileCurrency, setProfileCurrency] = useState(currentUser?.currency || 'ر.س');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileCompany(currentUser.company || '');
      setProfileTitle(currentUser.title || 'صاحب أعمال ومشاريع');
      setProfileBio(currentUser.bio || '');
      setProfilePhone(currentUser.phone || '');
      setProfileCountry(currentUser.country || 'مصر');
      setProfileCurrency(currentUser.currency || 'ر.س');
      setProfileAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  // Handle Drag & Drop / File Select Image
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
        notify('تم تحميل الصورة للمعاينة بنجاح! اضغط "حفظ التغييرات" لتثبيتها في ملفك.');
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

  // Handle Save Profile Settings
  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name: profileName.trim() || currentUser.name,
        company: profileCompany.trim(),
        title: profileTitle.trim(),
        bio: profileBio.trim(),
        phone: profilePhone.trim(),
        country: profileCountry,
        currency: profileCurrency,
        avatar: profileAvatar,
      };
      update('currentUser', updatedUser);
    }

    try {
      await auth.updateProfile({
        full_name: profileName.trim(),
        company_name: profileCompany.trim(),
        avatar_url: profileAvatar || null,
        bio: profileBio.trim(),
        phone: profilePhone.trim() || null,
        country: profileCountry,
      });
    } catch (err) {
      console.warn('Supabase sync error ignored:', err);
    }

    setIsSavingProfile(false);
    notify('تم حفظ وتحديث إعدادات الملف الشخصي بنجاح! ✓');
  };

  // --------------------------------------------------------------------------
  // Notifications & Escrow Protection Alerts System (Real & Live Data)
  // --------------------------------------------------------------------------
  const [notificationsFilter, setNotificationsFilter] = useState<'all' | 'unread' | 'escrow' | 'delivery' | 'proposal' | 'ticket' | 'chat'>('all');
  const [notificationsSearch, setNotificationsSearch] = useState('');
  const [notifTick, setNotifTick] = useState(0);

  // Real client notifications derived directly from live platform entities (0% mock data)
  const clientNotifications = useMemo(() => {
    return getRealNotifications(store, currentUser);
  }, [store, currentUser, notifTick]);

  const unreadNotifications = useMemo(() => {
    return clientNotifications.filter((n) => !n.isRead);
  }, [clientNotifications]);

  const unreadNotificationsCount = unreadNotifications.length;

  // Filtered notifications for the board
  const filteredNotifications = useMemo(() => {
    return clientNotifications.filter((n) => {
      if (notificationsFilter === 'unread' && n.isRead) return false;
      if (notificationsFilter !== 'all' && notificationsFilter !== 'unread' && n.type !== notificationsFilter) return false;
      if (notificationsSearch.trim()) {
        const q = notificationsSearch.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          (n.meta?.projectTitle && n.meta.projectTitle.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [clientNotifications, notificationsFilter, notificationsSearch]);

  const handleMarkAsRead = (notifId: string) => {
    saveReadNotificationId(notifId);
    setNotifTick((prev) => prev + 1);
  };

  const handleMarkAllAsRead = () => {
    saveAllReadNotificationIds(clientNotifications.map((n) => n.id));
    setNotifTick((prev) => prev + 1);
    notify('تم تحديد كافة الإشعارات كمقروءة ✓');
  };

  const handleDeleteNotification = (notifId: string) => {
    saveDismissedNotificationId(notifId);
    if (store.notifications) {
      update('notifications', store.notifications.filter((n) => n.id !== notifId));
    }
    setNotifTick((prev) => prev + 1);
    notify('تم حذف الإشعار بنجاح');
  };

  const handleDeleteAllNotifications = () => {
    saveAllDismissedNotificationIds(clientNotifications.map((n) => n.id));
    update('notifications', []);
    setNotifTick((prev) => prev + 1);
    notify('تم حذف جميع الإشعارات بنجاح 🗑️');
  };

  const handleClearReadNotifications = () => {
    const readIds = clientNotifications.filter((n) => n.isRead).map((n) => n.id);
    saveAllDismissedNotificationIds(readIds);
    setNotifTick((prev) => prev + 1);
    notify('تم مسح الإشعارات المقروءة');
  };

  const handleNotificationClick = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab as any);
    }
  };

  // Callback from EscrowWalletHub when user locks project funds into escrow
  const handleLockEscrowNotification = (amount: number, projectTitle: string) => {
    const newNotif: AppNotification = {
      id: 'notif-lock-' + Date.now(),
      targetRole: 'client',
      type: 'escrow',
      title: '🔒 ميثاق حماية الضمان: تم حجز وتأمين دفعة المشروع في الخزينة المشفرة',
      message: `سيتم خصم هذا المبلغ (${amount.toLocaleString()} ${clientWallet.currency || 'ر.س'}) من رصيدك المتاح وتجميده في خزينة الضمان البنكية المشفرة لمشروع "${projectTitle}". سيتم إشعار المطور فورياً بأن أموال المشروع مؤمنة بنجاح، ولن يتم تسليمها له إلا بعد فحصك للكود وموافقتك النهائية.`,
      timestamp: 'الآن',
      createdAt: new Date().toISOString(),
      isRead: false,
      linkTab: 'wallet',
      meta: {
        amount,
        currency: clientWallet.currency || 'ر.س',
        projectTitle,
      },
    };
    update('notifications', [newNotif, ...(store.notifications || [])]);
    notify(`تم تسجيل حجز الضمان وإرسال إشعار فوري بحماية حقوقك وفق ميثاق الضمان! 🔒✓`);
  };

  // Client Wallet State
  const clientWallet: UserWallet = store.clientWallet || INITIAL_CLIENT_WALLET;
  const handleUpdateClientWallet = (updated: UserWallet) => {
    update('clientWallet', updated);
  };

  // Chat State
  const conversations = (store.conversations && store.conversations.length > 0)
    ? store.conversations
    : DEFAULT_CLIENT_CONVERSATIONS;

  // Auto-seed conversations if store is empty
  useEffect(() => {
    if (!store.conversations || store.conversations.length === 0) {
      update('conversations', DEFAULT_CLIENT_CONVERSATIONS);
    }
  }, [store.conversations]);

  // Support reading tab and conversation from URL query params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'chat' || tabParam === 'proposals' || tabParam === 'projects' || tabParam === 'tickets' || tabParam === 'handovers' || tabParam === 'wallet' || tabParam === 'settings' || tabParam === 'notifications') {
        setActiveTab(tabParam as any);
      }
      const convParam = params.get('conversation');
      if (convParam) {
        setSelectedChatId(convParam);
        setActiveTab('chat');
      }
    } catch {}
  }, []);

  const [selectedChatId, setSelectedChatId] = useState<string>(conversations[0]?.id || '');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [pendingChatAttachments, setPendingChatAttachments] = useState<MessageAttachment[]>([]);
  const [isDevTyping, setIsDevTyping] = useState(false);
  const [chatLightboxImage, setChatLightboxImage] = useState<string | null>(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [developerSearchFilter, setDeveloperSearchFilter] = useState('');

  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Active Conversation
  const activeConv = conversations.find((c) => c.id === selectedChatId) || conversations[0];

  // Auto-scroll chat on new messages or typing
  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeTab, activeConv?.messages, isDevTyping]);

  // Ticket Modal State
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<TicketType['category']>('خلل برمجي (Bug)');
  const [ticketPriority, setTicketPriority] = useState<TicketType['priority']>('عالي');
  const [ticketSelectedProject, setTicketSelectedProject] = useState('general_support');
  const [customProjectTitle, setCustomProjectTitle] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');

  // Developer Review Modal State
  const [selectedReviewDev, setSelectedReviewDev] = useState<Developer | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleReviewSubmit = (devId: string, rev: ClientReview) => {
    const nextDevs = store.developers.map((d) => {
      if (d.id === devId) {
        const currentReviews = d.reviews || [];
        const nextReviews = [rev, ...currentReviews];
        const sum = nextReviews.reduce((acc, r) => acc + r.rating, 0);
        const nextRating = Number((sum / nextReviews.length).toFixed(2));
        return {
          ...d,
          reviews: nextReviews,
          rating: nextRating,
          reviewsCount: (d.reviewsCount || 0) + 1,
        };
      }
      return d;
    });
    update('developers', nextDevs);
  };

  const clientName = currentUser?.name || 'صاحب المشروع';
  const currency = currentUser?.currency || 'ر.س';

  // Projects of this client (matching name or creator ID)
  const clientProjects = useMemo(() => {
    if (!currentUser) return [];
    return store.projects.filter(
      (p) =>
        (currentUser.name && p.owner && p.owner.toLowerCase().includes(currentUser.name.toLowerCase())) ||
        ((p as any).clientId && (p as any).clientId === currentUser.id) ||
        ((p as any).clientEmail && currentUser.email && (p as any).clientEmail.toLowerCase() === currentUser.email.toLowerCase())
    );
  }, [store.projects, currentUser]);

  // Display projects for client
  const displayProjects = clientProjects;

  // Synchronize ticket selected project on modal open or when projects load
  useEffect(() => {
    if (ticketModalOpen) {
      if (
        ticketSelectedProject &&
        (displayProjects.some((p) => p.id === ticketSelectedProject) ||
          ['general_support', 'general_consultation', 'escrow_billing', 'custom_project'].includes(
            ticketSelectedProject
          ))
      ) {
        // Selection is already valid
      } else if (displayProjects.length > 0) {
        setTicketSelectedProject(displayProjects[0].id);
      } else {
        setTicketSelectedProject('general_support');
      }
    }
  }, [ticketModalOpen, displayProjects]);

  // Relevant proposals for client's actual projects only
  const clientProjectIds = useMemo(() => new Set(clientProjects.map((p) => p.id)), [clientProjects]);

  const relevantApplications = useMemo(() => {
    if (clientProjectIds.size === 0) return [];
    const allApps = store.applications || [];
    return allApps.filter(
      (a) =>
        clientProjectIds.has(a.projectId) &&
        !a.id.startsWith('app-tariq') &&
        !a.id.startsWith('app-layan') &&
        !a.id.startsWith('app-sarah')
    );
  }, [store.applications, clientProjectIds]);

  // Client Git Handovers & Deliveries
  const clientHandovers = useMemo(() => {
    const realDeliveries = (store.deliveries || []).filter(
      (d) =>
        currentUser &&
        (d.client === currentUser.name ||
         (d as any).clientId === currentUser.id ||
         (d as any).clientEmail === currentUser.email)
    );

    const completedOrActiveWithDev = clientProjects.filter(
      (p) => p.status === 'مكتمل' || (p as any).gitRepoUrl || p.assignedDeveloperId
    );

    const projectHandovers = completedOrActiveWithDev.map((p) => {
      const dev = store.developers.find((d) => d.id === p.assignedDeveloperId || d.name === p.developer);
      return {
        id: `handover-${p.id}`,
        projectId: p.id,
        title: p.title,
        developerName: p.developer || dev?.name || 'مطور معتمد',
        developerId: p.assignedDeveloperId || dev?.id || '',
        developerAvatar: dev?.avatar,
        date: p.deadline || 'حديثاً',
        status: p.status === 'مكتمل' ? 'تم نقل الملكية بنجاح ✓' : 'قيد الفحص والمراجعة',
        isCompleted: p.status === 'مكتمل',
        repoUrl: (p as any).gitRepoUrl || null,
        budget: p.budget,
      };
    });

    const combined = [...projectHandovers];
    realDeliveries.forEach((d) => {
      if (!combined.some((c) => c.title === d.title)) {
        const dev = store.developers.find((dv) => dv.id === d.developerId || dv.name === d.developerName);
        combined.push({
          id: d.id,
          projectId: (d as any).projectId || d.id,
          title: d.title,
          developerName: d.developerName || dev?.name || 'مطور معتمد',
          developerId: d.developerId || dev?.id || '',
          developerAvatar: dev?.avatar,
          date: d.date,
          status: d.status === 'مكتمل' || d.status === 'تم التسليم' ? 'تم نقل الملكية بنجاح ✓' : 'قيد الفحص والمراجعة',
          isCompleted: d.status === 'مكتمل' || d.status === 'تم التسليم',
          repoUrl: (d as any).gitRepoUrl || null,
          budget: d.amount,
        });
      }
    });

    return combined;
  }, [store.deliveries, clientProjects, currentUser, store.developers]);

  // Client tickets
  const clientTickets = store.tickets;

  // Computed metrics
  const activeProjectsCount = displayProjects.filter((p) => p.status === 'متاح' || p.status === 'قيد التنفيذ').length;
  const pendingProposalsCount = relevantApplications.filter((a) => a.status === 'قيد المراجعة').length;
  const openTicketsCount = clientTickets.filter((t) => t.status !== 'مغلق').length;

  // Handle Accept Proposal
  const handleAcceptProposal = (appId: string, projectId: string) => {
    const updatedApps = (store.applications || []).map((a) =>
      a.id === appId ? { ...a, status: 'مقبول' as const } : a
    );
    const updatedProjects = store.projects.map((p) =>
      p.id === projectId ? { ...p, status: 'قيد التنفيذ' as const } : p
    );
    update('applications', updatedApps);
    update('projects', updatedProjects);

    const propNotif: AppNotification = {
      id: 'notif-prop-accept-' + Date.now(),
      targetRole: 'client',
      type: 'proposal',
      title: '💼 تم قبول العرض الفني وبدء التنفيذ بنجاح',
      message: 'تم قبول العرض الفني للمشروع. يرجى تأمين وحجز دفعة المشروع في خزينة الضمان البنكية المشفرة وفق ميثاق حماية الضمان لحماية حقوقك وحقوق المهندس.',
      timestamp: 'الآن',
      createdAt: new Date().toISOString(),
      isRead: false,
      linkTab: 'wallet',
    };
    update('notifications', [propNotif, ...(store.notifications || [])]);

    notify('تم قبول العرض الفني بنجاح! تم تحويل المشروع إلى قيد التنفيذ.');
  };

  // Handle Reject Proposal
  const handleRejectProposal = (appId: string) => {
    const updatedApps = (store.applications || []).map((a) =>
      a.id === appId ? { ...a, status: 'مرفوض' as const } : a
    );
    update('applications', updatedApps);
    notify('تم رفض العرض.');
  };

  // Start Chat with Developer Helper
  const handleStartChatWithDeveloper = (
    devName: string,
    devAvatar?: string,
    projectTitle?: string,
    _proposalPlan?: string
  ) => {
    const currentConvs = (store.conversations && store.conversations.length > 0)
      ? store.conversations
      : DEFAULT_CLIENT_CONVERSATIONS;

    const existing = currentConvs.find((c) => c.otherUser === devName);
    if (existing) {
      setSelectedChatId(existing.id);
      setActiveTab('chat');
      notify(`تم فتح المحادثة المباشرة مع المهندس: ${devName}`);
      return;
    }

    const initialText = projectTitle
      ? `مرحباً مهندس ${devName.split(' ')[0]}، اطلعت على عرضك الفني لمشروع "${projectTitle}" وأود مناقشة خطة العمل والتفاصيل التقنية معك.`
      : `مرحباً مهندس ${devName.split(' ')[0]}، يسعدني التواصل معك لمناقشة تفاصيل مشروع برمجي.`;

    const newConv: Conversation = {
      id: 'conv-' + Math.random().toString(36).substring(2, 9),
      projectId: projectTitle || 'مشروع جديد',
      otherUser: devName,
      otherUserAvatar: devAvatar || '',
      online: true,
      messages: [
        {
          id: 'msg-' + Math.random().toString(36).substring(2, 9),
          body: initialText,
          sender: 'me',
          time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
          read: true,
        },
      ],
    };

    update('conversations', [newConv, ...currentConvs]);
    setSelectedChatId(newConv.id);
    setActiveTab('chat');
    notify(`تم بدء محادثة جديدة بنجاح مع ${devName}`);
  };

  // Handle Send Message from Client
  const handleSendMessage = () => {
    if ((!chatMessageInput.trim() && pendingChatAttachments.length === 0) || !activeConv) return;

    const userText = chatMessageInput.trim();
    const newMsg: MessageItem = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      body: userText,
      sender: 'me',
      time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
      read: true,
      attachments: pendingChatAttachments.length > 0 ? [...pendingChatAttachments] : undefined,
    };

    const currentConvs = (store.conversations && store.conversations.length > 0)
      ? store.conversations
      : DEFAULT_CLIENT_CONVERSATIONS;

    const updatedConvs = currentConvs.map((c: Conversation) =>
      c.id === activeConv.id ? { ...c, messages: [...c.messages, newMsg] } : c
    );

    update('conversations', updatedConvs);
    setChatMessageInput('');
    setPendingChatAttachments([]);

    // Realistic Context-Aware Developer Reply
    setIsDevTyping(true);
    setTimeout(() => {
      setIsDevTyping(false);
      let replyText = 'أهلاً بك! تم استلام رسالتك، وسأعمل على متابعة التفاصيل معك فوراً للوصول لأفضل جودة برمجية.';

      if (newMsg.attachments && newMsg.attachments.length > 0) {
        replyText = `أهلاً بك! تم استلام المرفقات (${newMsg.attachments[0].name}) بنجاح. سأقوم بفحصها والرد عليك بالتقييم الفني في أقرب وقت.`;
      } else if (userText.includes('زمني') || userText.includes('وقت') || userText.includes('تسليم')) {
        replyText = 'الجدول الزمني يسير وفق الخطة المحددة، ونتوقع تسليم المرحلة الأولى خلال أيام قليلة بعد استكمال الفحص الشامل.';
      } else if (userText.includes('FQS') || userText.includes('جودة') || userText.includes('كود') || userText.includes('معايير')) {
        replyText = 'نلتزم تماماً بمعايير FQS؛ تم تطبيق اختبارات Unit Tests بنسبة تغطية عالية، وتجهيز بيئة التشغيل عبر Docker لضمان أعلى اعتمادية.';
      } else if (userText.includes('ضمان') || userText.includes('محفظة') || userText.includes('Escrow') || userText.includes('دفعة')) {
        replyText = 'شكراً جزيلاً لتأكيد الضمان المالي! يمنحنا هذا أقصى درجات التركيز لإنجاز المشروع بأعلى المعايير الهندسية.';
      } else if (userText.includes('GitHub') || userText.includes('مستودع') || userText.includes('رابط')) {
        replyText = 'تم إعداد المستودع وسأرسل لك صلاحية المشاهدة (Collaborator Access) لتتمكن من متابعة الـ Commits أولاً بأول.';
      } else if (userText.includes('السلام') || userText.includes('مرحبا') || userText.includes('أهلا')) {
        replyText = `أهلاً بك يا ${clientName}! يسعدني جداً تواصلك، أنا جاهز لمناقشة أية تفاصيل أو متطلبات إضافية.`;
      }

      const devReplyMsg: MessageItem = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        body: replyText,
        sender: 'other',
        time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
        read: true,
      };

      const finalConvs = ((store.conversations && store.conversations.length > 0) ? store.conversations : currentConvs).map((c: Conversation) =>
        c.id === activeConv.id ? { ...c, messages: [...c.messages, devReplyMsg] } : c
      );
      update('conversations', finalConvs);
    }, 1500);
  };

  // Handle Attach Files in Chat
  const handleAttachFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAtts: MessageAttachment[] = [];
    const rejectedErrors: string[] = [];

    Array.from(files).forEach((file) => {
      const validation = validateUploadedFile(file, { context: 'chat' });
      if (!validation.isValid) {
        rejectedErrors.push(validation.error || `تم رفض الملف (${file.name}) لدواعي الأمان والحماية.`);
        return;
      }

      const isImg = file.type.startsWith('image/');
      const isPdf = file.type.includes('pdf');
      const isArchive = file.name.endsWith('.zip') || file.name.endsWith('.rar');
      const type: MessageAttachment['type'] = isImg
        ? 'image'
        : isPdf
        ? 'pdf'
        : isArchive
        ? 'archive'
        : 'file';

      const sizeStr =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
          : (file.size / 1024).toFixed(0) + ' KB';

      newAtts.push({
        id: 'att-chat-' + Math.random().toString(36).substring(2, 9),
        name: validation.sanitizedName,
        size: sizeStr,
        type,
        url: isImg ? URL.createObjectURL(file) : '#',
      });
    });

    if (rejectedErrors.length > 0) {
      notify(rejectedErrors[0]);
    }

    if (newAtts.length > 0) {
      setPendingChatAttachments((prev) => [...prev, ...newAtts]);
      notify(`تم إرفاق ${newAtts.length} ملف/صورة للمحادثة`);
    }
    if (chatFileInputRef.current) chatFileInputRef.current.value = '';
  };

  // Handle New Ticket Submit
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDetails.trim()) {
      notify('يرجى كتابة عنوان المشكلة وتفاصيلها');
      return;
    }

    if (ticketSelectedProject === 'custom_project' && !customProjectTitle.trim()) {
      notify('يرجى كتابة اسم أو عنوان المشروع المتعلق بالتذكرة');
      return;
    }

    const matchedProject = store.projects.find((p) => p.id === ticketSelectedProject);
    const slaHours = ticketPriority === 'حرج' ? 2 : ticketPriority === 'عالي' ? 6 : 24;

    let projTitle = 'دعم عام للمنصة';
    if (ticketSelectedProject === 'general_support') {
      projTitle = 'استفسار عام ودعم فني لحساب العميل';
    } else if (ticketSelectedProject === 'general_consultation') {
      projTitle = 'استشارة تقنية وفحص متطلبات مشروع';
    } else if (ticketSelectedProject === 'escrow_billing') {
      projTitle = 'استفسار بخصوص الضمان المالي ومحفظة Escrow';
    } else if (ticketSelectedProject === 'custom_project') {
      projTitle = customProjectTitle.trim() || 'مشروع مخصص';
    } else if (matchedProject) {
      projTitle = matchedProject.title;
    }

    const newTicket: TicketType = {
      id: 'tkt-' + Math.random().toString(36).substring(2, 8),
      subject: ticketSubject.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      status: 'مفتوح',
      owner: clientName,
      projectId: ticketSelectedProject,
      projectTitle: projTitle,
      assignedDeveloper: matchedProject?.developer || 'فريق الدعم الفني الهندسي',
      createdAt: 'الآن',
      slaResponseHours: slaHours,
      logsOrCode: ticketDetails.trim(),
      replies: [],
    };

    update('tickets', [newTicket, ...store.tickets]);

    const slaNotif: AppNotification = {
      id: 'notif-ticket-' + Date.now(),
      targetRole: 'client',
      type: 'ticket',
      title: `🎫 تم فتح تذكرة دعم وصيانة SLA: "${ticketSubject.trim()}"`,
      message: `تم تسجيل تذكرة الصيانة بنجاح تحت مظلة اتفاقية SLA والضمان المجاني (30 يوماً). الحد الأقصى لزمن الاستجابة: ${slaHours} ساعات.`,
      timestamp: 'الآن',
      createdAt: new Date().toISOString(),
      isRead: false,
      linkTab: 'tickets',
    };
    update('notifications', [slaNotif, ...(store.notifications || [])]);

    notify(`تم فتح تذكرة الدعم بنجاح! الحد الأقصى للاستجابة: ${slaHours} ساعات`);
    setTicketModalOpen(false);
    setTicketSubject('');
    setTicketDetails('');
    setCustomProjectTitle('');
  };

  // Filter conversations for chat sidebar
  const filteredConversations = conversations.filter((c) =>
    c.otherUser.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    c.projectId.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    c.messages.some((m) => m.body.toLowerCase().includes(chatSearchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8" dir="rtl">
      {/* Hidden File Input for Chat Attachments */}
      <input
        ref={chatFileInputRef}
        type="file"
        multiple
        accept={getAcceptStringForContext('chat')}
        className="hidden"
        onChange={handleAttachFiles}
      />

      {/* Top Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative">
            <UserAvatar
              src={profileAvatar}
              name={clientName}
              size="lg"
              shape="rounded"
            />
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[10px] text-white ring-2 ring-white">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-[#152a40] sm:text-xl">
                أهلاً بك، {clientName}
              </h1>
              <span className="rounded-lg bg-[#e8f6f7] px-2.5 py-0.5 text-[10px] font-black text-[#1b7e86]">
                حساب صاحب مشاريع (Client)
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                title="تعديل الملف الشخصي والصورة"
              >
                <Settings size={12} className="text-[#208f97]" />
                <span>إعدادات الملف ⚙️</span>
              </button>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              {profileCompany || currentUser?.company || 'مؤسسة مستقلة'} — إدارة المشاريع، محادثات المطورين، ومتابعة الصيانة
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition shadow-2xs ${
              activeTab === 'settings'
                ? 'border-[#203d62] bg-[#203d62] text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Camera size={15} className={activeTab === 'settings' ? 'text-teal-300' : 'text-[#208f97]'} />
            <span>الصورة والملف الشخصي</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#2ba6ae]/40 bg-[#f0fafb] px-4 py-2.5 text-xs font-black text-[#1b7e86] transition hover:bg-[#e0f5f7] active:scale-95 shadow-2xs"
          >
            <MessageCircle size={15} />
            <span>دردشة المطورين 💬</span>
          </button>

          <button
            onClick={() => setTicketModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Ticket size={15} className="text-[#208f97]" />
            <span>فتح تذكرة صيانة SLA</span>
          </button>

          <Link
            href="/post-project"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-[#203d62]/20 transition hover:bg-[#2b5182] active:scale-95"
          >
            <Plus size={16} />
            <span>نشر مشروع جديد</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div
          onClick={() => setActiveTab('projects')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-[#2ba6ae] transition group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold group-hover:text-[#1b7e86] transition">المشاريع المنشورة</span>
            <Briefcase size={18} className="text-[#2ba6ae]" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#162d46]">
            {activeProjectsCount}{' '}
            <span className="text-xs font-normal text-slate-400">مشروع نشط</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">من أصل {displayProjects.length} مشروع إجمالي</div>
        </div>

        <div
          onClick={() => setActiveTab('proposals')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-amber-400 transition group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold group-hover:text-amber-600 transition">العروض المستلمة</span>
            <Users size={18} className="text-amber-500" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#162d46]">
            {pendingProposalsCount}{' '}
            <span className="text-xs font-normal text-slate-400">عرض للمراجعة</span>
          </div>
          <div className="mt-1 text-[10px] text-amber-600 font-bold">خطط عمل فنية من مطورين</div>
        </div>

        {/* Dedicated Chat Metric Card */}
        <div
          onClick={() => setActiveTab('chat')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-[#2ba6ae] transition group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold group-hover:text-[#1b7e86] transition">الدردشة المباشرة</span>
            <MessageCircle size={18} className="text-[#2ba6ae]" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#162d46]">
            {conversations.length}{' '}
            <span className="text-xs font-normal text-slate-400">محادثة</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>تواصل مباشر مع المهندسين</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('tickets')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-rose-400 transition group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold group-hover:text-rose-600 transition">تذاكر الصيانة (SLA)</span>
            <Ticket size={18} className="text-rose-500" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#162d46]">
            {openTicketsCount}{' '}
            <span className="text-xs font-normal text-slate-400">تذكرة مفتوحة</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">ضمن ضمان 30 يوماً مجاناً</div>
        </div>

        <div
          onClick={() => setActiveTab('wallet')}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer hover:border-[#2ba6ae] transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">محفظة الضمان (Escrow)</span>
            <Wallet size={18} className="text-emerald-500" />
          </div>
          <div className="mt-3 text-2xl font-black text-[#162d46]">
            {clientWallet.totalBalance.toLocaleString()}{' '}
            <span className="text-xs font-bold text-emerald-600">{clientWallet.currency || currency}</span>
          </div>
          <div className="mt-1 text-[10px] text-amber-600 font-bold">
            🔒 {clientWallet.inEscrow.toLocaleString()} محجوز بالضمان
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'projects', label: 'مشاريعي المنشورة', count: displayProjects.length },
          { id: 'proposals', label: 'العروض الفنية المقدمة', count: relevantApplications.length },
          { id: 'chat', label: 'الدردشة والمحادثات المباشرة 💬', count: conversations.length },
          { id: 'handovers', label: 'تسليم المستودعات (Git)', count: clientHandovers.length },
          {
            id: 'wallet',
            label: 'المحفظة والضمان المالي (Escrow) 💳',
            count: clientWallet.totalBalance.toLocaleString() + ' ' + (clientWallet.currency || 'ر.س'),
          },
          { id: 'tickets', label: 'تذاكر الدعم والضمان (SLA)', count: clientTickets.length },
          { id: 'settings', label: 'إعدادات الملف الشخصي ⚙️', count: 'تعديل' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                active
                  ? 'bg-[#203d62] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: My Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-black text-[#162a3f]">قائمة مشاريعك</h3>
            <Link
              href="/post-project"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#1b7f87] hover:underline"
            >
              <Plus size={14} />
              <span>نشر مشروع جديد</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white shadow-xs">
            {displayProjects.length === 0 ? (
              <div className="p-10 sm:p-12 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-[#1b7e86]">
                  <Briefcase size={26} />
                </div>
                <h4 className="mt-3 text-sm font-black text-[#152a40]">لم تقم بنشر أي مشاريع حتى الآن</h4>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                  انشر مشروعك الآن وحدد المتطلبات والميزانية لتصلك عروض هندسية متقدمة من مطوري ومبرمجي المنصة.
                </p>
                <Link
                  href="/post-project"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-black text-white hover:bg-[#2c5384] transition shadow-xs"
                >
                  <Plus size={14} />
                  <span>نشر أول مشروع لك</span>
                </Link>
              </div>
            ) : (
              displayProjects.map((p: Project) => {
                const projectApps = relevantApplications.filter((a) => a.projectId === p.id);
                return (
                  <div key={p.id} className="p-5 transition hover:bg-slate-50/60 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black ${
                            p.status === 'متاح'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'قيد التنفيذ'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.status}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          موعد التسليم: {p.deadline}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#152c43]">{p.title}</h4>
                      <p className="max-w-3xl text-xs leading-relaxed text-slate-500">
                        {p.description}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400">الميزانية</div>
                      <div className="text-base font-black text-[#183654]">
                        {p.budget.toLocaleString('ar-EG')} {currency}
                      </div>
                    </div>
                  </div>

                  {/* Tech stack tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Actions Strip */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users size={14} className="text-[#208f97]" />
                      <span>
                        تم استلام <strong>{projectApps.length}</strong> عروض من مطورين
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setActiveTab('proposals');
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        استعراض العروض ({projectApps.length})
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('chat');
                        }}
                        className="rounded-xl border border-[#2ba6ae]/40 bg-[#f0fafb] px-3.5 py-1.5 text-xs font-black text-[#1b7e86] hover:bg-[#e0f5f7]"
                      >
                        محادثة المطورين 💬
                      </button>

                      <button
                        onClick={() => {
                          setTicketSelectedProject(p.id);
                          setTicketModalOpen(true);
                        }}
                        className="rounded-xl bg-[#e8f6f7] px-3.5 py-1.5 text-xs font-black text-[#1b7e86] hover:bg-[#d6f0f2]"
                      >
                        فتح تذكرة صيانة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Incoming Proposals */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#162a3f]">
              العروض الفنية وخطط العمل المستلمة من المطورين
            </h3>
            <span className="text-xs text-slate-500">
              {relevantApplications.length} عروض متوفرة
            </span>
          </div>

          <div className="grid gap-4">
            {relevantApplications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 sm:p-12 text-center shadow-xs">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                  <Users size={26} />
                </div>
                <h4 className="mt-3 text-sm font-black text-[#152a40]">لا توجد عروض فنية مقدمة حتى الآن</h4>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                  لم يتم استلام عروض فنية جديدة بعد. عند نشر مشروع وتلقي عروض من مهندسي ومطوري فوتيك، ستظهر هنا للمراجعة والقبول والمحادثة المباشرة.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/post-project"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-black text-white hover:bg-[#2c5384] transition shadow-xs"
                  >
                    <Plus size={14} />
                    <span>نشر مشروع جديد</span>
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <span>تصفح سوق المشاريع</span>
                  </Link>
                </div>
              </div>
            ) : (
              relevantApplications.map((app: Application) => {
              const matchedProject = store.projects.find((p) => p.id === app.projectId);
              const matchedDev = store.developers.find((d) => d.name === app.developerName);

              return (
                <div
                  key={app.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-[#2ba6ae] sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {matchedDev?.avatar && matchedDev.avatar.trim() !== '' ? (
                        <img
                          src={matchedDev.avatar}
                          alt={app.developerName}
                          className="h-12 w-12 rounded-2xl object-cover ring-2 ring-[#2ba6ae]/30"
                        />
                      ) : (
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-base font-black text-amber-400 ring-2 ring-[#2ba6ae]/30 shadow-sm">
                          {app.developerName ? app.developerName.charAt(0) : 'م'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-[#152a40]">
                            {app.developerName}
                          </h4>
                          {matchedDev && (
                            <span className="rounded-lg bg-[#e8f7f8] px-2 py-0.5 text-[10px] font-black text-[#1c7e86]">
                              FQS: {matchedDev.fqs > 0 ? `${matchedDev.fqs}/100` : 'معتمد 96/100'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {matchedDev?.specialty || 'مطور برمجيات معتمد'} • قدّم {app.submittedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-xl px-3 py-1 text-xs font-black ${
                          app.status === 'مقبول'
                            ? 'bg-emerald-50 text-emerald-700'
                            : app.status === 'مرفوض'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        الحالة: {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Context */}
                  <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600">
                    <span className="font-bold text-slate-700">المشروع المستهدف: </span>
                    <span className="font-black text-[#183552]">
                      {matchedProject?.title || 'مشروع فوتيك للحلول السحابية'}
                    </span>
                  </div>

                  {/* Proposal Plan */}
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-[#fafbfc] p-4 text-xs leading-relaxed text-slate-700">
                    <div className="mb-1 font-black text-[#172f49]">خطة العمل المقترحة:</div>
                    <p>{app.plan}</p>
                  </div>

                  {/* Proposal Action Buttons */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-3 text-xs">
                      {app.proposedBudget && (
                        <span>
                          السعر المقترح:{' '}
                          <strong className="text-[#183654]">
                            {app.proposedBudget.toLocaleString('ar-EG')} {currency}
                          </strong>
                        </span>
                      )}
                      {app.proposedDuration && (
                        <span>
                          المدة: <strong>{app.proposedDuration}</strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Direct Message Developer Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleStartChatWithDeveloper(
                            app.developerName,
                            matchedDev?.avatar,
                            matchedProject?.title,
                            app.plan
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#2ba6ae]/40 bg-[#f0fafb] px-4 py-2 text-xs font-black text-[#1b7e86] hover:bg-[#e0f5f7] transition active:scale-95 shadow-2xs"
                      >
                        <MessageSquare size={14} className="text-[#208f97]" />
                        <span>محادثة المطور 💬</span>
                      </button>

                      {app.status === 'قيد المراجعة' && (
                        <>
                          <button
                            onClick={() => handleRejectProposal(app.id)}
                            className="rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                          >
                            رفض العرض
                          </button>
                          <button
                            onClick={() => handleAcceptProposal(app.id, app.projectId)}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700"
                          >
                            قبول العرض وبدء العمل
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Dedicated Real-time Chat & Messaging Hub (الدردشة المباشرة بين العميل والمطور) */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Chat Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-[#1b3d68] via-[#20507a] to-[#2aa6ae] text-white shadow-sm">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#152a40]">
                    غرفة الدردشة والتواصل المباشر مع المهندسين
                  </h3>
                  <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                    محادثات محمية وموثقة بضمان FQS
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  تواصل فوري بينك وبين مطوري مشاريعك لمناقشة المتطلبات، استعراض الشفرات البرمجية، وتنسيق تسليم المراحل
                </p>
              </div>
            </div>

            <button
              onClick={() => setNewChatModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-black text-white shadow-xs transition hover:bg-[#2b5182] active:scale-95"
            >
              <Plus size={14} />
              <span>محادثة جديدة مع مطور</span>
            </button>
          </div>

          {/* Chat Main Window Split Pane */}
          <div className="grid min-h-[660px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs md:grid-cols-12">
            {/* Sidebar: Conversations List (Right Column in RTL) */}
            <div className="flex flex-col border-l border-slate-100 md:col-span-4 bg-[#fcfdfe]">
              {/* Search in conversations */}
              <div className="border-b border-slate-100 p-3.5">
                <div className="relative">
                  <Search size={14} className="absolute right-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={chatSearchQuery}
                    onChange={(e) => setChatSearchQuery(e.target.value)}
                    placeholder="بحث في المحادثات أو أسماء المطورين..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs outline-none focus:border-[#2ba6ae]"
                  />
                  {chatSearchQuery && (
                    <button
                      onClick={() => setChatSearchQuery('')}
                      className="absolute left-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>المحادثات النشطة ({filteredConversations.length})</span>
                  <span className="font-bold text-[#1b7e86]">متصل الآن 🟢</span>
                </div>
              </div>

              {/* Conversations Scrollable List */}
              <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    لا توجد محادثات مطابقة لبحثك.
                  </div>
                ) : (
                  filteredConversations.map((c) => {
                    const isSelected = c.id === selectedChatId;
                    const lastMsg = c.messages.at(-1);

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedChatId(c.id)}
                        className={`group flex cursor-pointer items-start gap-3 p-3.5 transition ${
                          isSelected
                            ? 'bg-[#edf8f9] border-r-4 border-r-[#2aa6ae]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          {c.otherUserAvatar && c.otherUserAvatar.trim() !== '' ? (
                            <img
                              src={c.otherUserAvatar}
                              alt={c.otherUser}
                              className="h-11 w-11 rounded-2xl object-cover ring-2 ring-slate-100"
                            />
                          ) : (
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-sm font-black text-amber-400 shadow-xs ring-2 ring-slate-100">
                              {c.otherUser ? c.otherUser.charAt(0) : 'م'}
                            </div>
                          )}
                          {c.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="truncate text-xs font-black text-[#152a40]">
                              {c.otherUser}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {lastMsg?.time || ''}
                            </span>
                          </div>

                          {c.projectId && (
                            <div className="mt-0.5 inline-block truncate max-w-[190px] rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600">
                              {c.projectId}
                            </div>
                          )}

                          <div className="mt-1 truncate text-[11px] text-slate-500">
                            {lastMsg?.attachments && lastMsg.attachments.length > 0 ? (
                              <span className="inline-flex items-center gap-1 font-bold text-[#1b7e86]">
                                <Paperclip size={11} />
                                <span>[مرفق: {lastMsg.attachments[0].name}]</span>
                              </span>
                            ) : (
                              <span>{lastMsg?.body || 'بدء المحادثة...'}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Actions at bottom of sidebar */}
              <div className="border-t border-slate-100 bg-white p-3">
                <button
                  onClick={() => setNewChatModalOpen(true)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  <Plus size={13} />
                  <span>بدء محادثة مع مهندس آخر</span>
                </button>
              </div>
            </div>

            {/* Main Chat Thread (Left Column in RTL) */}
            <div className="flex flex-col md:col-span-8 bg-[#fafbfc]">
              {activeConv ? (
                <>
                  {/* Active Chat Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-5 py-3.5 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {activeConv.otherUserAvatar && activeConv.otherUserAvatar.trim() !== '' ? (
                          <img
                            src={activeConv.otherUserAvatar}
                            alt={activeConv.otherUser}
                            className="h-11 w-11 rounded-2xl object-cover ring-2 ring-[#2aa6ae]/30"
                          />
                        ) : (
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-sm font-black text-amber-400 shadow-xs ring-2 ring-[#2aa6ae]/30">
                            {activeConv.otherUser ? activeConv.otherUser.charAt(0) : 'م'}
                          </div>
                        )}
                        {activeConv.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-[#152a40]">
                            {activeConv.otherUser}
                          </h4>
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-700">
                            متصل الآن
                          </span>
                        </div>
                        {activeConv.projectId && (
                          <p className="mt-0.5 text-[10px] text-slate-400 truncate max-w-sm">
                            المشروع المرتبط: <span className="font-bold text-[#1b7e86]">{activeConv.projectId}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#2ba6ae]/40 bg-[#f0fafb] px-3 py-1.5 text-xs font-black text-[#1b7e86] hover:bg-[#e0f5f7] transition"
                        title="إرفاق وثائق، ملفات أو صور للمشروع"
                      >
                        <Paperclip size={13} />
                        <span className="hidden sm:inline">إرفاق ملف</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('wallet')}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Wallet size={13} className="text-emerald-600" />
                        <span className="hidden sm:inline">تحرير دفعة بالضمان</span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Thread Container */}
                  <div
                    ref={chatScrollRef}
                    className="flex-1 space-y-3.5 overflow-y-auto p-4 sm:p-6 text-xs max-h-[460px]"
                  >
                    {/* Security Notice Pill */}
                    <div className="flex justify-center">
                      <div className="rounded-xl border border-[#2ba6ae]/20 bg-[#f0fafb] px-3.5 py-1 text-[10px] font-bold text-[#1b7e86] shadow-2xs">
                        🛡️ جميع الرسائل والاتفاقات موثقة ومحمية بموجب معايير فوتيك والضمان المالي (Escrow)
                      </div>
                    </div>

                    {activeConv.messages.map((m) => {
                      const isMe = m.sender === 'me';
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 leading-relaxed shadow-2xs ${
                              isMe
                                ? 'rounded-tl-xs bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] text-white font-medium'
                                : 'rounded-tr-xs border border-slate-200 bg-white text-slate-800'
                            }`}
                          >
                            {/* Attachments rendering */}
                            {m.attachments && m.attachments.length > 0 && (
                              <div className="space-y-2 mb-2.5">
                                {m.attachments.map((att) => (
                                  <div key={att.id}>
                                    {att.type === 'image' && att.url && att.url !== '#' ? (
                                      <div
                                        onClick={() => setChatLightboxImage(att.url)}
                                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/10"
                                      >
                                        <img
                                          src={att.url}
                                          alt={att.name}
                                          className="max-h-56 w-full object-cover transition duration-300 group-hover:scale-102"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                                          <Eye size={16} />
                                          <span>معاينة الصورة بالحجم الكامل</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className={`flex items-center justify-between gap-3 rounded-2xl border p-2.5 text-xs ${
                                          isMe
                                            ? 'border-white/20 bg-white/10 text-white'
                                            : 'border-slate-200 bg-slate-50 text-slate-800'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div
                                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                                              att.type === 'pdf'
                                                ? 'bg-rose-500/20 text-rose-300'
                                                : att.type === 'archive'
                                                ? 'bg-amber-500/20 text-amber-300'
                                                : 'bg-teal-500/20 text-teal-300'
                                            }`}
                                          >
                                            {att.type === 'pdf' ? (
                                              <FileText size={16} className="text-rose-400" />
                                            ) : att.type === 'archive' ? (
                                              <Archive size={16} className="text-amber-400" />
                                            ) : (
                                              <Paperclip size={16} />
                                            )}
                                          </div>
                                          <div className="min-w-0">
                                            <div className="truncate text-xs font-black max-w-[160px]">
                                              {att.name}
                                            </div>
                                            <div className="text-[10px] opacity-75">{att.size}</div>
                                          </div>
                                        </div>

                                        <a
                                          href={att.url}
                                          download={att.name}
                                          onClick={(e) => {
                                            if (att.url === '#') {
                                              e.preventDefault();
                                              notify(`جاري تحميل ملف: ${att.name}`);
                                            }
                                          }}
                                          className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                                            isMe ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-600'
                                          }`}
                                          title="تحميل الملف"
                                        >
                                          <Download size={13} />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Message text */}
                            {m.body && <div className="whitespace-pre-line leading-relaxed">{m.body}</div>}

                            {/* Timestamp & double check */}
                            <div
                              className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] ${
                                isMe ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              <span>{m.time}</span>
                              {isMe && <CheckCheck size={12} className="stroke-[2.5] text-cyan-300" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Developer Typing Indicator */}
                    {isDevTyping && (
                      <div className="flex justify-end">
                        <div className="rounded-3xl rounded-tr-xs border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-600 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-[#1b7e86]">
                              المهندس {activeConv.otherUser} يكتب الآن
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#2aa6ae] animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-[#2aa6ae] animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-[#2aa6ae] animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Suggestion Chips for the Client */}
                  <div className="border-t border-slate-200/60 bg-slate-50/80 px-4 py-2">
                    <div className="flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar py-0.5">
                      <span className="shrink-0 text-slate-400 font-bold">مقترحات ردود سريعة:</span>
                      {[
                        '🚀 متى نتوقع الانتهاء من المرحلة الأولى؟',
                        '💻 هل تم فحص الكود وفق معايير FQS؟',
                        '🔒 تم حجز دفعة الضمان في محفظة Escrow.',
                        '📦 هل يمكنك تزويدي برابط مستودع GitHub؟',
                        '✨ العرض الفني ممتاز ونود البدء فوراً.',
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => setChatMessageInput(chip)}
                          className="shrink-0 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-slate-700 transition hover:border-[#2ba6ae] hover:text-[#1b7e86] active:scale-95 shadow-2xs font-medium"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pending Attachments Tray (before sending) */}
                  <AnimatePresence>
                    {pendingChatAttachments.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-100/70 p-3"
                      >
                        {pendingChatAttachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pe-3 text-xs shadow-2xs"
                          >
                            {att.type === 'image' && att.url ? (
                              <img
                                src={att.url}
                                alt={att.name}
                                className="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500/10 text-teal-600">
                                {att.type === 'pdf' ? <FileText size={16} className="text-rose-500" /> : <Paperclip size={16} />}
                              </div>
                            )}

                            <div className="min-w-0 max-w-[140px]">
                              <div className="truncate text-[11px] font-black text-slate-800">
                                {att.name}
                              </div>
                              <div className="text-[9px] text-slate-400">{att.size}</div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setPendingChatAttachments((prev) =>
                                  prev.filter((a) => a.id !== att.id)
                                )
                              }
                              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chat Input Bar */}
                  <div className="border-t border-slate-200 bg-white p-3.5">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex items-center gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        title="إرفاق ملف أو صورة"
                      >
                        <Paperclip size={17} />
                      </button>

                      <input
                        type="text"
                        value={chatMessageInput}
                        onChange={(e) => setChatMessageInput(e.target.value)}
                        placeholder="اكتب رسالتك للمطور هنا... (اضغط Enter للإرسال)"
                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs outline-none transition focus:border-[#2ba6ae] focus:bg-white"
                      />

                      <button
                        type="submit"
                        disabled={!chatMessageInput.trim() && pendingChatAttachments.length === 0}
                        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#17304b] to-[#204a75] px-5 text-xs font-black text-white shadow-md shadow-[#17304b]/20 transition hover:scale-102 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <span>إرسال</span>
                        <Send size={14} className="rotate-180" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-400">
                    <MessageSquare size={32} />
                  </div>
                  <h4 className="mt-4 text-sm font-black text-[#152a40]">لا توجد محادثة محددة</h4>
                  <p className="mt-1 max-w-sm text-xs text-slate-400">
                    اختر مطوراً من القائمة الجانبية أو ابدأ محادثة جديدة لمناقشة تفاصيل مشروعك
                  </p>
                  <button
                    onClick={() => setNewChatModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-black text-white"
                  >
                    <Plus size={14} />
                    <span>محادثة جديدة مع مطور</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SLA Tickets & Warranty */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#162a3f]">
                تذاكر الصيانة واتفاقية الـ SLA بعد التسليم
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                ضمان مجاني 30 يوماً لحل الأخطاء البرمجية (Bugs) مع فترات استجابة ملزمة
              </p>
            </div>

            <button
              onClick={() => setTicketModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2.5 text-xs font-black text-white hover:bg-[#2c5383]"
            >
              <Plus size={15} />
              <span>فتح تذكرة صيانة جديدة</span>
            </button>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {clientTickets.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 sm:p-12 text-center shadow-xs">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-[#1b7e86]">
                  <Ticket size={26} />
                </div>
                <h4 className="mt-3 text-sm font-black text-[#152a40]">لا توجد تذاكر دعم مفتوحة حالياً</h4>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                  كافة خدماتك ومشاريعك مستقرة. إذا واجهت أي خلل برمجي أو استفسار فني بخصوص ميثاق SLA أو الضمان، يمكنك فتح تذكرة جديدة وسيتولى الفريق الهندسي الاستجابة السريعة.
                </p>
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-black text-white hover:bg-[#2c5384] transition shadow-xs"
                >
                  <Plus size={14} />
                  <span>فتح تذكرة دعم الآن</span>
                </button>
              </div>
            ) : (
              clientTickets.map((t: TicketType) => (
                <div
                  key={t.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-[#2ba6ae]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black ${
                            t.priority === 'حرج'
                              ? 'bg-rose-50 text-rose-700'
                              : t.priority === 'عالي'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          أولوية: {t.priority}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {t.category} • {t.createdAt}
                        </span>
                      </div>
                      <h4 className="mt-2 text-sm font-black text-[#162d47]">{t.subject}</h4>
                      <p className="mt-1 text-xs text-slate-500">
                        المشروع المرتبط:{' '}
                        <strong className="text-slate-700">
                          {t.projectTitle || 'لوحة إدارة المتجر السحابي'}
                        </strong>
                      </p>
                    </div>

                    <div className="text-left">
                      <span
                        className={`inline-block rounded-xl px-3 py-1 text-xs font-black ${
                          t.status === 'تم الحل'
                            ? 'bg-emerald-50 text-emerald-700'
                            : t.status === 'قيد المعالجة'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {t.status}
                      </span>
                      <div className="mt-1 text-[10px] text-slate-400">
                        حد الـ SLA: {t.slaResponseHours || 6} ساعات
                      </div>
                    </div>
                  </div>

                  {t.logsOrCode && (
                    <div className="mt-3 rounded-2xl bg-[#0f172a] p-3 text-left font-mono text-xs text-slate-200">
                      <code>{t.logsOrCode}</code>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Git Handovers */}
      {activeTab === 'handovers' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-black text-[#1c7e86]">
              <GitFork size={16} />
              <span>سياسة نقل ملكية المستودعات (Git Handover Verification)</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              جميع المشاريع المنجزة على فوتيك تخضع لفحص تلقائي للتأكد من وجود بيئة التشغيل الكاملة
              (Dockerfile, README.md, .env.example) قبل تأكيد التسليم النهائي ونقل ملكية المستودع البرمجي.
            </p>

            {clientHandovers.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 sm:p-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-[#1c7e86]">
                  <GitFork size={26} />
                </div>
                <h4 className="mt-3 text-sm font-black text-[#152a40]">لا توجد مستودعات برمجية مستلمة حتى الآن</h4>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                  عند تعاقدك مع مهندس برمجيات وإنجاز المشروع، سيتم توثيق تسليم كود المستودع (GitHub / GitLab) وبيئة التشغيل ومطابقة ميثاق FQS هنا.
                </p>
                <Link
                  href="/post-project"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-black text-white hover:bg-[#2c5384] transition shadow-xs"
                >
                  <Plus size={14} />
                  <span>نشر مشروع والبدء الآن</span>
                </Link>
              </div>
            ) : (
              <div className="mt-6 divide-y divide-slate-100">
                {clientHandovers.map((h) => {
                  const dev = store.developers.find((d) => d.id === h.developerId || d.name === h.developerName);
                  return (
                    <div key={h.id} className="py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-black text-[#152a40]">
                            {h.title}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            المطور: {h.developerName} • تاريخ التسليم: {h.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-black ${
                              h.isCompleted
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {h.status}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleStartChatWithDeveloper(
                                h.developerName,
                                h.developerAvatar || '',
                                h.title
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition"
                          >
                            <MessageSquare size={12} className="text-[#208f97]" />
                            <span>محادثة المهندس 💬</span>
                          </button>
                          {dev && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReviewDev(dev);
                                setIsReviewModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-teal-600 px-3 py-1.5 text-[11px] font-black text-slate-950 shadow-xs hover:scale-105 active:scale-95 transition"
                            >
                              <Star size={12} className="fill-current" />
                              <span>تقييم المهندس ⭐</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-50 pt-2 text-[10px] text-slate-500">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5">README.md مكتمل</span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5">Dockerfile مجاز</span>
                          {h.repoUrl ? (
                            <a
                              href={h.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 font-bold text-teal-700 hover:underline"
                            >
                              <ExternalLink size={10} />
                              <span>رابط المستودع البرمجي</span>
                            </a>
                          ) : (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5">GitHub Repository Admin Access</span>
                          )}
                        </div>
                        <span className="text-[10px] text-teal-600 font-bold">
                          {h.isCompleted ? 'تم توثيق التسليم ونقل الملكية بنجاح ✓' : 'قيد المتابعة مع مهندس المشروع'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Escrow & Digital Wallet Hub */}
      {activeTab === 'wallet' && (
        <EscrowWalletHub
          wallet={clientWallet}
          onUpdateWallet={handleUpdateClientWallet}
          role="client"
          notify={notify}
          projects={displayProjects}
          developers={store.developers}
          currentUser={currentUser}
          onLockEscrow={handleLockEscrowNotification}
          onReleaseToDeveloper={(amt, projTitle, devName) => {
            if (store.developerWallet) {
              const devTxn = {
                id: 'txn-dev-' + Date.now(),
                type: 'escrow_release' as const,
                amount: amt,
                currency: clientWallet.currency || 'ر.س',
                date: new Date().toISOString().split('T')[0],
                status: 'مكتمل' as const,
                projectTitle: projTitle,
                referenceId: 'REL-' + Math.floor(10000 + Math.random() * 90000),
                description: `استلام دفعة مشروع (${projTitle}) المحررة من العميل للمهندس (${devName})`,
                method: 'تحرير دفعة ضمان بنكية (Escrow)',
              };
              update('developerWallet', {
                ...store.developerWallet,
                totalBalance: store.developerWallet.totalBalance + amt,
                availableBalance: store.developerWallet.availableBalance + amt,
                transactions: [devTxn, ...store.developerWallet.transactions],
              });
            }
          }}
        />
      )}

      {/* Tab 7: Profile Settings & Image Drag & Drop Upload */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-[#1b7e86]">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#152a40]">إعدادات الملف الشخصي والهوية</h3>
                    <p className="text-xs text-slate-500">
                      تحديث بيانات حساب العميل/الشركة، رفع صورة أو شعار الحساب عبر السحب والإفلات، وإدارة معلومات التواصل
                    </p>
                  </div>
                </div>
              </div>

              {profileAvatar && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileAvatar('');
                    notify('تمت إزالة الصورة. اضغط على حفظ التغييرات لتأكيد الحذف.');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition"
                >
                  <Trash2 size={14} />
                  <span>حذف الصورة الحالية</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfileSettings} className="mt-6 space-y-6">
              {/* Drag & Drop Image Upload Zone */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">
                  صورة الملف الشخصي أو شعار الشركة (Upload & Drag Image)
                </label>
                
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
                      ? 'border-[#208f97] bg-teal-50/70 scale-[0.99]'
                      : 'border-slate-300 bg-slate-50/60 hover:border-[#208f97] hover:bg-teal-50/30'
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
                    {/* Live Preview Avatar */}
                    <div className="relative shrink-0">
                      <UserAvatar
                        src={profileAvatar}
                        name={profileName}
                        size="xl"
                        shape="circle"
                      />
                      <div className="absolute -bottom-1 -left-1 grid h-7 w-7 place-items-center rounded-full bg-[#208f97] text-white shadow">
                        <Camera size={14} />
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/70 px-3 py-1 text-[11px] font-black text-[#156e75]">
                        <UploadCloud size={14} />
                        <span>اسحب وأفلت أو تصفح (Upload & Drag Image)</span>
                      </div>
                      <h4 className="mt-2 text-sm font-black text-slate-800">
                        اسحب وأفلت صورتك هنا أو انقر لاختيار ملف من جهازك
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        يدعم صيغ PNG, JPG, WEBP, SVG حتى حجم أقصى 5 ميجابايت
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الاسم الكامل (أو اسم المسؤول) *
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="مثال: كيرلس روبير"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 text-xs font-bold text-slate-800 outline-none focus:border-[#208f97] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم المنشأة أو الشركة
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      placeholder="مثال: مؤسسة التقنية المبتكرة"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 text-xs font-bold text-slate-800 outline-none focus:border-[#208f97] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    المسمى الوظيفي أو التوصيف
                  </label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    placeholder="مثال: مدير تقني / صاحب عمل"
                    className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#208f97] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف / الواتساب للتواصل
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+966 5X XXX XXXX أو +20 1X XXX XXXX"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 text-xs font-bold text-slate-800 outline-none focus:border-[#208f97] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الدولة / المقر
                  </label>
                  <div className="relative">
                    <Globe size={16} className="absolute right-3.5 top-3.5 text-slate-400" />
                    <select
                      value={profileCountry}
                      onChange={(e) => setProfileCountry(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pr-10 pl-3 text-xs font-bold text-slate-800 outline-none focus:border-[#208f97] transition"
                    >
                      <option value="السعودية">السعودية (KSA)</option>
                      <option value="مصر">مصر (Egypt)</option>
                      <option value="الإمارات">الإمارات (UAE)</option>
                      <option value="الكويت">الكويت</option>
                      <option value="قطر">قطر</option>
                      <option value="عمان">عمان</option>
                      <option value="البحرين">البحرين</option>
                      <option value="الأردن">الأردن</option>
                      <option value="دولة أخرى">دولة أخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عملة الحساب المفضلة
                  </label>
                  <select
                    value={profileCurrency}
                    onChange={(e) => setProfileCurrency(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#208f97] transition"
                  >
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نبذة تعريفية عن المنشأة أو مشاريعك (Bio)
                </label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عن شركتك أو مجالات المشاريع التي تقوم بتطويرها..."
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 outline-none focus:border-[#208f97] transition"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <p className="text-[11px] text-slate-500">
                  🔒 بياناتك مشفرة ومحمية، وتظهر للمطورين المعتمدين عند فتح المشاريع والتعاقد فقط.
                </p>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#203d62] px-6 py-2.5 text-xs font-black text-white hover:bg-[#2b5182] transition shadow-xs disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>حفظ التغييرات وتحديث الملف</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 8: Comprehensive Notifications & Escrow Protection Board */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* 1. Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e8f6f7] text-[#1b7e86] shadow-sm">
                <BellRing size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-[#152a40]">
                    لوحة الإشعارات وتنبيهات ميثاق الضمان
                  </h3>
                  {unreadNotificationsCount > 0 ? (
                    <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-black text-white shadow-2xs animate-pulse">
                      {unreadNotificationsCount} تنبيه جديد
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      كافة التنبيهات مقروءة ✓
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  متابعة حية لحركات الضمان المالي المشفر، تسليم كود المستودعات (Git)، عروض المطورين، وتذاكر الصيانة
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={unreadNotificationsCount === 0}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition shadow-2xs ${
                  unreadNotificationsCount > 0
                    ? 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100'
                    : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <CheckCheck size={14} className={unreadNotificationsCount > 0 ? 'text-[#208f97]' : 'text-slate-400'} />
                <span>قمت بقراءتها</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteAllNotifications}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
              >
                <Trash2 size={13} className="text-rose-600" />
                <span>حذف جميع الإشعارات</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-black text-white hover:bg-[#2b5182] transition shadow-xs"
              >
                <Lock size={13} />
                <span>محفظة وخزينة الضمان 💳</span>
              </button>
            </div>
          </div>

          {/* 2. Official Prominent Escrow Protection Charter Banner */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 p-6 sm:p-7 shadow-xs">
            <div className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                  <ShieldCheck size={26} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-black text-amber-900 border border-amber-300">
                      🔒 ميثاق حماية الضمان المالي المعتمد في فوتيك
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      خزينة بنكية مشفرة
                    </span>
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200">
                      فحص كود OWASP & FQS
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    ميثاق حماية الضمان:
                  </h4>
                  <p className="max-w-3xl text-xs sm:text-sm font-bold leading-relaxed text-slate-800">
                    «سيتم خصم هذا المبلغ من رصيدك المتاح وتجميده في خزينة الضمان البنكية المشفرة. سيتم إشعار المطور فورياً بأن أموال المشروع مؤمنة بنجاح، ولن يتم تسليمها له إلا بعد فحصك للكود وموافقتك النهائية.»
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      ضمان عدم استلام المطور لأي مبلغ قبل موافقتك الصريحة
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      فحص تسليم مستودع Git والتوثيق والـ Dockerfile
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      دعم فني وصيانة مجانية لمدة 30 يوماً بعد التسليم
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('wallet')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-5 py-2.5 text-xs font-black text-white hover:bg-amber-700 shadow-md transition"
                >
                  <Lock size={14} />
                  <span>تأمين دفعة في الضمان</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('handovers')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
                >
                  <GitFork size={14} className="text-[#208f97]" />
                  <span>فحص مستودعات الكود</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Filter Toolbar & Search */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'كافة الإشعارات', count: clientNotifications.length },
                  { id: 'unread', label: 'غير المقروءة 🔔', count: unreadNotificationsCount },
                  { id: 'escrow', label: '🔒 ميثاق الضمان والمالية', count: clientNotifications.filter((n) => n.type === 'escrow').length },
                  { id: 'delivery', label: '📦 تسليم المستودعات (Git)', count: clientNotifications.filter((n) => n.type === 'delivery').length },
                  { id: 'proposal', label: '💼 العروض والمشاريع', count: clientNotifications.filter((n) => n.type === 'proposal').length },
                  { id: 'ticket', label: '🎫 الدعم والصيانة (SLA)', count: clientNotifications.filter((n) => n.type === 'ticket').length },
                  { id: 'chat', label: '💬 المحادثات', count: clientNotifications.filter((n) => n.type === 'chat').length },
                ].map((f) => {
                  const active = notificationsFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setNotificationsFilter(f.id as any)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition ${
                        active
                          ? 'bg-[#203d62] text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative min-w-[200px] sm:w-64">
                <Search size={14} className="absolute right-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={notificationsSearch}
                  onChange={(e) => setNotificationsSearch(e.target.value)}
                  placeholder="بحث في الإشعارات..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-3 text-xs font-bold text-slate-800 outline-none focus:border-[#208f97] transition"
                />
              </div>
            </div>

            {/* 4. Notifications Cards List */}
            {filteredNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-[#1b7e86]">
                  <Bell size={26} />
                </div>
                <h4 className="mt-3 text-sm font-black text-slate-800">لا توجد إشعارات مطابقة</h4>
                <p className="mt-1 text-xs text-slate-500">
                  {notificationsSearch
                    ? 'لم يتم العثور على أي نتائج مطابقة لكلمة البحث الحالية.'
                    : 'كافة إشعاراتك وتنبيهات ميثاق الضمان محدثة بالكامل.'}
                </p>
                {notificationsSearch && (
                  <button
                    type="button"
                    onClick={() => setNotificationsSearch('')}
                    className="mt-3 text-xs font-bold text-[#1b7e86] hover:underline"
                  >
                    مسح البحث
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {filteredNotifications.map((n) => {
                  const isUnread = !n.isRead;
                  return (
                    <div
                      key={n.id}
                      className={`relative flex flex-col sm:flex-row sm:items-start justify-between gap-4 rounded-2xl border p-5 transition ${
                        isUnread
                          ? 'border-[#208f97]/40 bg-[#f0fafb]/40 shadow-xs ring-1 ring-[#208f97]/20'
                          : 'border-slate-200/90 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Type Icon */}
                        <div
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg shadow-sm ${
                            n.type === 'escrow'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : n.type === 'delivery'
                              ? 'bg-teal-100 text-teal-800 border border-teal-200'
                              : n.type === 'ticket'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : n.type === 'proposal'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          }`}
                        >
                          {n.type === 'escrow' && <Lock size={22} />}
                          {n.type === 'delivery' && <GitFork size={22} />}
                          {n.type === 'ticket' && <Ticket size={22} />}
                          {n.type === 'proposal' && <Briefcase size={22} />}
                          {n.type === 'chat' && <MessageCircle size={22} />}
                          {n.type === 'system' && <ShieldCheck size={22} />}
                        </div>

                        {/* Text and Details */}
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900">
                              {n.title}
                            </h4>
                            {isUnread && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-black text-rose-600 border border-rose-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                جديد
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 font-medium">
                              • {n.timestamp}
                            </span>
                          </div>

                          <p className="text-xs font-bold leading-relaxed text-slate-700">
                            {n.message}
                          </p>

                          {/* Metadata Tags */}
                          {n.meta && (
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                              {n.meta.projectTitle && (
                                <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-slate-700">
                                  المشروع: {n.meta.projectTitle}
                                </span>
                              )}
                              {n.meta.amount && (
                                <span className="rounded-lg bg-emerald-50 px-2.5 py-0.5 text-emerald-700 border border-emerald-200">
                                  المبلغ: {n.meta.amount.toLocaleString()} {n.meta.currency || 'ر.س'}
                                </span>
                              )}
                              {n.meta.developerName && (
                                <span className="rounded-lg bg-teal-50 px-2.5 py-0.5 text-[#1b7e86] border border-teal-200">
                                  المهندس: {n.meta.developerName}
                                </span>
                              )}
                              {n.meta.repoUrl && (
                                <a
                                  href={n.meta.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-0.5 text-white hover:bg-slate-900 transition"
                                >
                                  <Code2 size={12} />
                                  <span>مستودع الكود</span>
                                  <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {n.linkTab && (
                          <button
                            type="button"
                            onClick={() => {
                              handleMarkAsRead(n.id);
                              setActiveTab(n.linkTab as any);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-3.5 py-1.5 text-xs font-black text-white hover:bg-[#2b5182] transition shadow-2xs"
                          >
                            <span>فتح الإجراء</span>
                            <ArrowLeft size={13} />
                          </button>
                        )}

                        <div className="flex items-center gap-1.5">
                          {isUnread ? (
                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(n.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition"
                              title="تحديد كمقروء"
                            >
                              <Check size={12} className="text-emerald-600" />
                              <span>تحديد كمقروء</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">
                              تم الاطلاع ✓
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteNotification(n.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="حذف الإشعار"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Chat with Developer Modal */}
      {newChatModalOpen && (
        <div
          onClick={() => setNewChatModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={17} className="text-[#208f97]" />
                <h3 className="text-sm font-black text-[#152a40]">
                  بدء محادثة مباشرة مع مطور
                </h3>
              </div>
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute right-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={developerSearchFilter}
                  onChange={(e) => setDeveloperSearchFilter(e.target.value)}
                  placeholder="ابحث عن مطور بالاسم أو التخصص..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-9 text-xs outline-none focus:border-[#2ba6ae] focus:bg-white"
                />
              </div>

              <div className="max-h-72 space-y-2 overflow-y-auto divide-y divide-slate-100">
                {store.developers
                  .filter((d) =>
                    d.name.toLowerCase().includes(developerSearchFilter.toLowerCase()) ||
                    d.specialty.toLowerCase().includes(developerSearchFilter.toLowerCase())
                  )
                  .map((dev) => (
                    <div
                      key={dev.id}
                      className="flex items-center justify-between gap-3 pt-2.5 pb-1"
                    >
                      <div className="flex items-center gap-2.5">
                        {dev.avatar && dev.avatar.trim() !== '' ? (
                          <img
                            src={dev.avatar}
                            alt={dev.name}
                            className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-xs font-black text-amber-400">
                            {dev.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-black text-[#152a40]">{dev.name}</div>
                          <div className="text-[10px] text-slate-400">{dev.specialty}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewChatModalOpen(false);
                          handleStartChatWithDeveloper(dev.name, dev.avatar);
                        }}
                        className="rounded-xl border border-[#2ba6ae]/40 bg-[#f0fafb] px-3 py-1.5 text-xs font-black text-[#1b7e86] hover:bg-[#e0f5f7] transition"
                      >
                        بدء المحادثة 💬
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Image Lightbox Modal */}
      {chatLightboxImage && (
        <div
          onClick={() => setChatLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl"
          >
            <button
              onClick={() => setChatLightboxImage(null)}
              className="absolute left-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={18} />
            </button>
            <img
              src={chatLightboxImage}
              alt="معاينة المرفق"
              className="max-h-[80vh] w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {ticketModalOpen && (
        <div
          onClick={() => setTicketModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#152a40]">
                فتح تذكرة دعم فني وصيانة (SLA)
              </h3>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700">المشروع المتعلق بالتذكرة *</label>
                <select
                  value={ticketSelectedProject}
                  onChange={(e) => setTicketSelectedProject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-700 outline-none focus:border-[#2ba6ae]"
                >
                  {displayProjects.length > 0 && (
                    <optgroup label="مشاريعك المسجلة والمنشورة">
                      {displayProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.status})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="خيارات الدعم الفني والاستشارات العامة">
                    <option value="general_support">استفسار عام / دعم حساب العميل والمنصة</option>
                    <option value="general_consultation">استشارة فنية وفحص متطلبات مشروع جديد</option>
                    <option value="escrow_billing">استفسار بخصوص الضمان المالي ومحفظة Escrow</option>
                    <option value="custom_project">مشروع أو نظام برمجي آخر (إدخال يدوي)</option>
                  </optgroup>
                </select>

                {displayProjects.length === 0 && ticketSelectedProject !== 'custom_project' && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    💡 لم تقم بنشر مشاريع بعد، سيتم ربط التذكرة بطلب دعم فني عام لحسابك وتقديم المساعدة فوراً.
                  </p>
                )}

                {ticketSelectedProject === 'custom_project' && (
                  <div className="mt-2.5">
                    <label className="block font-bold text-slate-600 mb-1">اسم أو عنوان المشروع المطلوب دعمه *</label>
                    <input
                      type="text"
                      required
                      value={customProjectTitle}
                      onChange={(e) => setCustomProjectTitle(e.target.value)}
                      placeholder="اكتب اسم أو عنوان المشروع المتعلق بالتذكرة..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#2ba6ae]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700">عنوان المشكلة أو العطل *</label>
                <input
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="مثال: فشل في معالجة طلبات الدفع عبر Webhook"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2ba6ae]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700">تصنيف التذكرة</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-700 outline-none"
                  >
                    <option value="خلل برمجي (Bug)">خلل برمجي (Bug)</option>
                    <option value="دعم مستمر بعد التسليم">دعم مستمر بعد التسليم</option>
                    <option value="صيانة دورية">صيانة دورية</option>
                    <option value="طلب تعديل أو تحسين">طلب تعديل أو تحسين</option>
                    <option value="استفسار تقني">استفسار تقني</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">الأولوية ومدة الـ SLA</label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-700 outline-none"
                  >
                    <option value="حرج">حرج (استجابة خلال ساعتين)</option>
                    <option value="عالي">عالي (استجابة خلال 6 ساعات)</option>
                    <option value="متوسط">متوسط (استجابة خلال 24 ساعة)</option>
                    <option value="منخفض">منخفض (استجابة خلال 48 ساعة)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700">
                  تفاصيل الخلل ومقتطف من الخطأ أو السجلات (Logs) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  placeholder="صف ما حدث بالتحديد وكيف يمكن تكرار المشكلة، أو الصق سجل الخطأ هنا..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 leading-relaxed outline-none focus:border-[#2ba6ae]"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#203d62] px-5 py-2 font-black text-white hover:bg-[#2b5182]"
                >
                  إرسال التذكرة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Developer Review Modal (تقييم المطور) */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        developer={selectedReviewDev}
        currentUser={currentUser}
        onSubmitReview={handleReviewSubmit}
        notify={notify}
      />
    </div>
  );
}
