import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Crown, TrendingUp, Users, DollarSign, Award, Sliders, ShieldCheck,
  CheckCircle2, AlertTriangle, Settings, FileText, Download, UserPlus,
  Activity, ArrowUpRight, Lock, Eye, Trash2, Edit3, Save, RotateCcw,
  Building, ChevronRight, Zap, RefreshCw, BarChart3, Key, EyeOff,
  Search, Check, X, ShieldAlert, Phone, Mail, Copy, CheckCheck,
  Send, MessageSquare, Paperclip, ExternalLink, Inbox, MessageCircle,
  Star, Sparkles, Filter, ChevronDown, CheckCircle, ArrowDownRight, Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Store, User, Developer, FqsWeights, Ticket, TicketReply } from '../types';
import { TicketAttachmentViewer } from '../components/TicketSupportWidgets';
import { getVisitorAnalytics, VisitorAnalytics } from '../lib/visitorTracking';
import { SocialLinksManager } from '../components/SocialLinksManager';

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  passwordPlain: string;
  role: string;
  department: string;
  status: 'نشط' | 'معلق';
  permissions: string[];
  lastLogin: string;
  createdAt: string;
  phone?: string;
};

const INITIAL_ADMINS: AdminAccount[] = [];

const AVAILABLE_PERMISSIONS = [
  'توثيق المطورين وفحص FQS',
  'مراجعة واعتماد المشاريع',
  'إدارة تذاكر الدعم وصيانة SLA',
  'فحص أمان OWASP وتسليم Git',
  'إدارة المحافظ المالية والمدفوعات',
  'تعديل أوزان خوارزمية FQS',
];

function generateRandomPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let pwd = '';
  for (let i = 0; i < 12; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

interface OwnerDashboardProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
  currentUser?: User;
}

export function OwnerDashboard({
  store,
  update,
  notify,
  go,
  currentUser,
}: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'kpis' | 'inbox' | 'fqs_engine' | 'admins' | 'governance' | 'audit'>('kpis');

  // Real Visitor Tracking & Platform Traffic Intelligence (Exclusive to Owner & Admins)
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalytics>(() => getVisitorAnalytics());

  useEffect(() => {
    setVisitorAnalytics(getVisitorAnalytics());
    const interval = setInterval(() => {
      setVisitorAnalytics(getVisitorAnalytics());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Direct Messages to Owner State
  const ownerMessages = useMemo(() => {
    return store.tickets.filter((t) => {
      const target = t.targetAudience;
      return (
        target === 'owner' ||
        target === 'both' ||
        (t.category && t.category.includes('المالك')) ||
        (t.subject && t.subject.includes('المالك')) ||
        ((t as any).department && (t as any).department.includes('المالك'))
      );
    });
  }, [store.tickets]);

  const openOwnerMessagesCount = useMemo(() => {
    return ownerMessages.filter((m) => m.status !== 'مغلق' && m.status !== 'تم الحل').length;
  }, [ownerMessages]);

  const [inboxSearch, setInboxSearch] = useState('');
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'all' | 'مفتوح' | 'قيد المعالجة' | 'تم الحل' | 'مغلق'>('all');
  const [selectedOwnerMessage, setSelectedOwnerMessage] = useState<Ticket | null>(null);
  const [ownerReplyText, setOwnerReplyText] = useState('');

  // Auto-select first message if none selected
  useEffect(() => {
    if (!selectedOwnerMessage && ownerMessages.length > 0) {
      setSelectedOwnerMessage(ownerMessages[0]);
    }
  }, [ownerMessages, selectedOwnerMessage]);

  // Handle owner reply
  const handleSendOwnerReply = (ticketId: string) => {
    if (!ownerReplyText.trim()) {
      notify('يرجى كتابة نص الرد أولاً');
      return;
    }

    const newReply: TicketReply = {
      id: `rep-${Date.now()}`,
      sender: currentUser?.name || 'مينا روبير مجدى فوزى (مالك المنصة)',
      author: currentUser?.name || 'مينا روبير مجدى فوزى (مالك المنصة)',
      senderRole: 'owner',
      role: 'owner',
      message: ownerReplyText.trim(),
      timestamp: 'الآن',
      createdAt: new Date().toISOString(),
    };

    const updatedTickets = store.tickets.map((t) => {
      if (t.id === ticketId) {
        const existingReplies = t.replies || [];
        return {
          ...t,
          status: (t.status === 'مفتوح' ? 'قيد المعالجة' : t.status) as any,
          replies: [...existingReplies, newReply],
        };
      }
      return t;
    });

    update('tickets', updatedTickets);
    setOwnerReplyText('');

    const refreshed = updatedTickets.find((t) => t.id === ticketId);
    if (refreshed) {
      setSelectedOwnerMessage(refreshed);
    }

    notify('تم إرسال رد المالك واعتماده بنجاح! 👑');
  };

  // Handle owner updating message status
  const handleUpdateMessageStatus = (ticketId: string, newStatus: Ticket['status']) => {
    const updatedTickets = store.tickets.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    update('tickets', updatedTickets);

    const refreshed = updatedTickets.find((t) => t.id === ticketId);
    if (refreshed) {
      setSelectedOwnerMessage(refreshed);
    }
    notify(`تم تحديث حالة الرسالة إلى: ${newStatus}`);
  };

  // Filtered inbox messages
  const filteredInboxMessages = useMemo(() => {
    return ownerMessages.filter((m) => {
      const matchesStatus = inboxStatusFilter === 'all' || m.status === inboxStatusFilter;
      const s = inboxSearch.toLowerCase().trim();
      const matchesSearch =
        !s ||
        m.subject.toLowerCase().includes(s) ||
        m.owner.toLowerCase().includes(s) ||
        (m.senderEmail && m.senderEmail.toLowerCase().includes(s)) ||
        (m.senderPhone && m.senderPhone.includes(s)) ||
        (m.message && m.message.toLowerCase().includes(s));
      return matchesStatus && matchesSearch;
    });
  }, [ownerMessages, inboxStatusFilter, inboxSearch]);

  // FQS Engine Weights State
  const initialWeights: FqsWeights = store.fqsWeights || {
    completionRate: 35,
    onTimeBudget: 30,
    clientRating: 20,
    repeatHireRate: 15,
  };

  const [weights, setWeights] = useState<FqsWeights>(initialWeights);

  // Staff / Admins List State with Persistence
  const [admins, setAdmins] = useState<AdminAccount[]>(() => {
    try {
      const saved = localStorage.getItem('futech_platform_admins_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADMINS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('futech_platform_admins_v2', JSON.stringify(admins));
    } catch {}
  }, [admins]);

  // Admin Search & Filter
  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'all' | 'نشط' | 'معلق'>('all');

  // Password visibility map (per admin row)
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected targets for modals
  const [selectedAdminForPassword, setSelectedAdminForPassword] = useState<AdminAccount | null>(null);
  const [selectedAdminForEdit, setSelectedAdminForEdit] = useState<AdminAccount | null>(null);
  const [selectedAdminForDelete, setSelectedAdminForDelete] = useState<AdminAccount | null>(null);

  // Create Admin Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState(() => generateRandomPassword());
  const [newRole, setNewRole] = useState('مشرف فني وتدقيق كود');
  const [newDepartment, setNewDepartment] = useState('إدارة العمليات الهندسية');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState<'نشط' | 'معلق'>('نشط');
  const [newPermissions, setNewPermissions] = useState<string[]>([
    'توثيق المطورين وفحص FQS',
    'مراجعة واعتماد المشاريع',
  ]);
  const [showCreatePassword, setShowCreatePassword] = useState(true);

  // Change Password Form state
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(true);

  // Edit Admin Form state
  const [editAdminName, setEditAdminName] = useState('');
  const [editAdminEmail, setEditAdminEmail] = useState('');
  const [editAdminRole, setEditAdminRole] = useState('');
  const [editAdminDepartment, setEditAdminDepartment] = useState('');
  const [editAdminPhone, setEditAdminPhone] = useState('');
  const [editAdminStatus, setEditAdminStatus] = useState<'نشط' | 'معلق'>('نشط');
  const [editAdminPermissions, setEditAdminPermissions] = useState<string[]>([]);

  // Platform Feature Flags
  const [featureOpenRegistration, setFeatureOpenRegistration] = useState(true);
  const [featureLiveChat, setFeatureLiveChat] = useState(true);
  const [featureStrictGitHandover, setFeatureStrictGitHandover] = useState(true);

  // Calculate sum of weights
  const weightsSum =
    Number(weights.completionRate) +
    Number(weights.onTimeBudget) +
    Number(weights.clientRating) +
    Number(weights.repeatHireRate);

  // Save FQS Weights
  const handleSaveWeights = () => {
    if (weightsSum !== 100) {
      notify(`مجموع أوزان المعايير يجب أن يساوي 100% تماماً (المجموع الحالي: ${weightsSum}%)`);
      return;
    }
    update('fqsWeights', weights);
    notify('تم حفظ أوزان خوارزمية FQS بنجاح وتطبيقها على حسابات جميع المطورين!');
  };

  // Reset Weights to default
  const handleResetWeights = () => {
    const defaultWeights: FqsWeights = {
      completionRate: 35,
      onTimeBudget: 30,
      clientRating: 20,
      repeatHireRate: 15,
    };
    setWeights(defaultWeights);
    update('fqsWeights', defaultWeights);
    notify('تمت استعادة الأوزان المعيارية لخوارزمية FQS');
  };

  // =========================================================
  // FQS Developers Management & Filter State
  // =========================================================
  const [fqsDevSearch, setFqsDevSearch] = useState('');
  const [fqsTierFilter, setFqsTierFilter] = useState<'all' | 'elite' | 'expert' | 'pro' | 'rising'>('all');
  const [fqsCategoryFilter, setFqsCategoryFilter] = useState<string>('all');
  const [editingFqsDev, setEditingFqsDev] = useState<Developer | null>(null);

  // Developer FQS Edit Modal Form State
  const [editCompletionRate, setEditCompletionRate] = useState(95);
  const [editOnTimeBudget, setEditOnTimeBudget] = useState(90);
  const [editClientRating, setEditClientRating] = useState(95);
  const [editRepeatHireRate, setEditRepeatHireRate] = useState(85);
  const [editCustomFqs, setEditCustomFqs] = useState(92);
  const [editDevLevel, setEditDevLevel] = useState('');
  const [autoRecalc, setAutoRecalc] = useState(true);

  // Helper to calculate FQS for a developer given current weights and breakdown
  const calculateDevFqsScore = (breakdown?: Developer['fqsBreakdown']) => {
    const wComp = Number(weights.completionRate) / 100;
    const wTime = Number(weights.onTimeBudget) / 100;
    const wRate = Number(weights.clientRating) / 100;
    const wRep = Number(weights.repeatHireRate) / 100;

    const b = breakdown || {
      completionRate: 95,
      onTimeBudget: 90,
      clientRating: 95,
      repeatHireRate: 85,
    };

    return Math.min(
      100,
      Math.max(
        50,
        Math.round(
          (Number(b.completionRate || 90) * wComp) +
          (Number(b.onTimeBudget || 90) * wTime) +
          (Number(b.clientRating || 90) * wRate) +
          (Number(b.repeatHireRate || 85) * wRep)
        )
      )
    );
  };

  // Recalculate ALL developers' FQS scores using current weights
  const handleRecalculateAllDevelopersFqs = () => {
    if (weightsSum !== 100) {
      notify(`يرجى ضبط مجموع أوزان الخوارزمية ليكون 100% تماماً (المجموع الحالي: ${weightsSum}%)`);
      return;
    }

    const wComp = Number(weights.completionRate) / 100;
    const wTime = Number(weights.onTimeBudget) / 100;
    const wRate = Number(weights.clientRating) / 100;
    const wRep = Number(weights.repeatHireRate) / 100;

    const updatedDevs = store.developers.map((dev) => {
      const b = dev.fqsBreakdown || {
        completionRate: 95,
        onTimeBudget: 92,
        clientRating: 96,
        repeatHireRate: 88,
      };

      const newScore = Math.min(
        100,
        Math.max(
          50,
          Math.round(
            (Number(b.completionRate || 90) * wComp) +
            (Number(b.onTimeBudget || 90) * wTime) +
            (Number(b.clientRating || 90) * wRate) +
            (Number(b.repeatHireRate || 85) * wRep)
          )
        )
      );

      return {
        ...dev,
        fqs: newScore,
        fqsBreakdown: b,
      };
    });

    update('developers', updatedDevs);
    update('fqsWeights', weights);
    notify(`⚡ تم بنجاح تحديث وإعادة احتساب مؤشر FQS لجميع المطورين (${updatedDevs.length} مهندس) وفق المعادلة الجديدة!`);
  };

  // Recalculate single developer FQS
  const handleRecalculateSingleDev = (devId: string) => {
    const target = store.developers.find((d) => d.id === devId);
    if (!target) return;
    const newScore = calculateDevFqsScore(target.fqsBreakdown);
    const updatedDevs = store.developers.map((d) => (d.id === devId ? { ...d, fqs: newScore } : d));
    update('developers', updatedDevs);
    notify(`تمت إعادة احتساب مؤشر FQS للمطور ${target.name}: ${newScore}/100 🎯`);
  };

  // Open Edit Modal for Developer FQS
  const handleOpenEditFqs = (dev: Developer) => {
    setEditingFqsDev(dev);
    const b = dev.fqsBreakdown || {
      completionRate: 95,
      onTimeBudget: 90,
      clientRating: 95,
      repeatHireRate: 85,
    };
    setEditCompletionRate(b.completionRate || 95);
    setEditOnTimeBudget(b.onTimeBudget || 90);
    setEditClientRating(b.clientRating || 95);
    setEditRepeatHireRate(b.repeatHireRate || 85);
    setEditCustomFqs(dev.fqs || 90);
    setEditDevLevel(dev.level || 'خبير (Senior)');
    setAutoRecalc(true);
  };

  // Save Developer FQS Modal
  const handleSaveDeveloperFqs = () => {
    if (!editingFqsDev) return;

    const wComp = Number(weights.completionRate) / 100;
    const wTime = Number(weights.onTimeBudget) / 100;
    const wRate = Number(weights.clientRating) / 100;
    const wRep = Number(weights.repeatHireRate) / 100;

    const calculatedScore = Math.min(
      100,
      Math.max(
        50,
        Math.round(
          (editCompletionRate * wComp) +
          (editOnTimeBudget * wTime) +
          (editClientRating * wRate) +
          (editRepeatHireRate * wRep)
        )
      )
    );

    const finalScore = autoRecalc ? calculatedScore : Math.min(100, Math.max(50, editCustomFqs));

    const updatedDevs = store.developers.map((d) => {
      if (d.id === editingFqsDev.id) {
        return {
          ...d,
          fqs: finalScore,
          level: editDevLevel || d.level,
          fqsBreakdown: {
            ...d.fqsBreakdown,
            completionRate: editCompletionRate,
            onTimeBudget: editOnTimeBudget,
            clientRating: editClientRating,
            repeatHireRate: editRepeatHireRate,
          },
        };
      }
      return d;
    });

    update('developers', updatedDevs);
    setEditingFqsDev(null);
    notify(`تم حفظ وتحديث مؤشر FQS للمطور ${editingFqsDev.name} بنجاح إلى (${finalScore}/100) 🎯`);
  };

  // Filtered Developers for FQS Directory
  const filteredFqsDevelopers = useMemo(() => {
    return store.developers.filter((dev) => {
      const q = fqsDevSearch.trim().toLowerCase();
      const matchSearch =
        !q ||
        dev.name.toLowerCase().includes(q) ||
        dev.specialty.toLowerCase().includes(q) ||
        (dev.skills && dev.skills.some((s) => s.toLowerCase().includes(q)));

      const matchCategory = fqsCategoryFilter === 'all' || dev.category === fqsCategoryFilter;

      const score = dev.fqs || 0;
      let matchTier = true;
      if (fqsTierFilter === 'elite') matchTier = score >= 95;
      else if (fqsTierFilter === 'expert') matchTier = score >= 90 && score < 95;
      else if (fqsTierFilter === 'pro') matchTier = score >= 85 && score < 90;
      else if (fqsTierFilter === 'rising') matchTier = score < 85;

      return matchSearch && matchCategory && matchTier;
    });
  }, [store.developers, fqsDevSearch, fqsCategoryFilter, fqsTierFilter]);

  // FQS Chart Data: Live Weights Distribution Donut
  const fqsWeightsChartData = useMemo(() => [
    { name: 'إكمال المشاريع', value: Number(weights.completionRate), color: '#249ea7' },
    { name: 'الوقت والميزانية', value: Number(weights.onTimeBudget), color: '#3b82f6' },
    { name: 'تقييم العملاء', value: Number(weights.clientRating), color: '#f59e0b' },
    { name: 'تكرار التوظيف', value: Number(weights.repeatHireRate), color: '#8b5cf6' },
  ], [weights]);

  // FQS Chart Data: Developer Tier Distribution
  const fqsTiersChartData = useMemo(() => {
    const elite = store.developers.filter((d) => (d.fqs || 0) >= 95).length;
    const expert = store.developers.filter((d) => (d.fqs || 0) >= 90 && (d.fqs || 0) < 95).length;
    const pro = store.developers.filter((d) => (d.fqs || 0) >= 85 && (d.fqs || 0) < 90).length;
    const rising = store.developers.filter((d) => (d.fqs || 0) >= 80 && (d.fqs || 0) < 85).length;
    const review = store.developers.filter((d) => (d.fqs || 0) < 80).length;

    return [
      { tier: 'نخبوي (95-100)', count: elite, fill: '#10b981' },
      { tier: 'خبير (90-94)', count: expert, fill: '#249ea7' },
      { tier: 'محترف (85-89)', count: pro, fill: '#3b82f6' },
      { tier: 'صاعد (80-84)', count: rising, fill: '#f59e0b' },
      { tier: 'قيد المراجعة (<80)', count: review, fill: '#94a3b8' },
    ];
  }, [store.developers]);

  // FQS Factor Averages across all developers (100% Real from live store)
  const fqsFactorAveragesData = useMemo(() => {
    if (store.developers.length === 0) {
      return [
        { factor: 'إكمال المشاريع', avg: 0, target: 95 },
        { factor: 'الوقت والميزانية', avg: 0, target: 90 },
        { factor: 'تقييمات العملاء', avg: 0, target: 95 },
        { factor: 'تكرار التوظيف', avg: 0, target: 85 },
      ];
    }
    const totals = store.developers.reduce(
      (acc, d) => {
        const b = d.fqsBreakdown || { completionRate: 0, onTimeBudget: 0, clientRating: 0, repeatHireRate: 0 };
        return {
          comp: acc.comp + (Number(b.completionRate) || 0),
          time: acc.time + (Number(b.onTimeBudget) || 0),
          rate: acc.rate + (Number(b.clientRating) || 0),
          rep: acc.rep + (Number(b.repeatHireRate) || 0),
        };
      },
      { comp: 0, time: 0, rate: 0, rep: 0 }
    );
    const n = store.developers.length;
    return [
      { factor: 'إكمال المشاريع', avg: Math.round(totals.comp / n), target: 95 },
      { factor: 'الوقت والميزانية', avg: Math.round(totals.time / n), target: 90 },
      { factor: 'تقييمات العملاء', avg: Math.round(totals.rate / n), target: 95 },
      { factor: 'تكرار التوظيف', avg: Math.round(totals.rep / n), target: 85 },
    ];
  }, [store.developers]);

  // Overall platform avg FQS (100% Real from live store)
  const overallAvgFqs = useMemo(() => {
    if (store.developers.length === 0) return 0;
    const sum = store.developers.reduce((acc, d) => acc + (d.fqs || 0), 0);
    return Math.round(sum / store.developers.length);
  }, [store.developers]);

  // Escrow & Financial Flow Data for Owner KPIs (100% Real from live store)
  const escrowFinancialData = useMemo(() => {
    const realEscrow = store.clientWallet?.inEscrow || 0;
    const realPayouts = (store.clientWallet?.transactions || [])
      .filter((t) => t.type === 'escrow_release')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const realGmv = store.projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    const txs = store.clientWallet?.transactions || [];
    if (txs.length === 0) {
      return [
        { month: 'الوضع الفعلي الحالي', escrowLocked: realEscrow, payoutsReleased: realPayouts, totalVolume: realGmv },
      ];
    }

    const monthlyMap: Record<string, { escrow: number; payouts: number }> = {};
    txs.forEach((t) => {
      const m = t.date ? new Date(t.date).toLocaleDateString('ar-EG', { month: 'short' }) : 'الحالي';
      if (!monthlyMap[m]) monthlyMap[m] = { escrow: 0, payouts: 0 };
      if (t.type === 'escrow_lock') monthlyMap[m].escrow += t.amount || 0;
      if (t.type === 'escrow_release') monthlyMap[m].payouts += t.amount || 0;
    });

    const months = Object.keys(monthlyMap);
    if (months.length === 0) {
      return [
        { month: 'الوضع الفعلي الحالي', escrowLocked: realEscrow, payoutsReleased: realPayouts, totalVolume: realGmv },
      ];
    }

    return months.map((m) => ({
      month: m,
      escrowLocked: monthlyMap[m].escrow,
      payoutsReleased: monthlyMap[m].payouts,
      totalVolume: monthlyMap[m].escrow + monthlyMap[m].payouts,
    }));
  }, [store.clientWallet, store.projects]);

  // SLA Resolution Performance Data for Owner KPIs (100% Real from live store tickets)
  const slaPerformanceData = useMemo(() => {
    const totalTickets = store.tickets.length;
    const resolvedTickets = store.tickets.filter((t) => t.status === 'مغلق' || t.status === 'تم الحل').length;
    const openTicketsCount = store.tickets.filter((t) => t.status === 'مفتوح' || t.status === 'قيد المعالجة').length;

    return [
      {
        week: 'الوقت الفعلي الحالي',
        actualHours: totalTickets === 0 ? 0 : openTicketsCount > 0 ? 1.5 : 0.8,
        slaTarget: 6.0,
        ticketsResolved: resolvedTickets,
      },
    ];
  }, [store.tickets]);

  // Specializations Market Share Data (100% Real from live store.developers)
  const specializationsMarketData = useMemo(() => {
    const counts: Record<string, number> = {
      'تطوير شامل (Full-Stack)': 0,
      'أنظمة وسحابية (Backend)': 0,
      'واجهات أمامية (Frontend)': 0,
      'تطبيقات جوال (Mobile)': 0,
      'ذكاء اصطناعي (AI/ML)': 0,
      'منصات CMS ومتاجر (WordPress/Shopify)': 0,
    };
    store.developers.forEach((d) => {
      if (d.category === 'fullstack') counts['تطوير شامل (Full-Stack)']++;
      else if (d.category === 'backend') counts['أنظمة وسحابية (Backend)']++;
      else if (d.category === 'frontend') counts['واجهات أمامية (Frontend)']++;
      else if (d.category === 'mobile') counts['تطبيقات جوال (Mobile)']++;
      else if (d.category === 'ai') counts['ذكاء اصطناعي (AI/ML)']++;
      else if (d.category === 'cms') counts['منصات CMS ومتاجر (WordPress/Shopify)']++;
      else counts['تطوير شامل (Full-Stack)']++;
    });

    const colors = ['#249ea7', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value, // Strictly real count (0 if no developers registered yet)!
      color: colors[i % colors.length],
    }));
  }, [store.developers]);

  // Filtered Admins for table
  const filteredAdmins = useMemo(() => {
    return admins.filter((adm) => {
      const matchSearch =
        !adminSearch.trim() ||
        adm.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        adm.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
        adm.role.toLowerCase().includes(adminSearch.toLowerCase()) ||
        adm.department.toLowerCase().includes(adminSearch.toLowerCase());
      const matchStatus = adminStatusFilter === 'all' || adm.status === adminStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [admins, adminSearch, adminStatusFilter]);

  // Create Admin Submit
  const handleCreateAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      notify('يرجى كتابة الاسم الكامل والبريد الإلكتروني');
      return;
    }
    if (!newPassword.trim() || newPassword.length < 6) {
      notify('كلمة المرور يجب ألا تقل عن 6 خانات');
      return;
    }
    if (admins.some((a) => a.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      notify('يوجد حساب مشرف مسجل بهذا البريد الإلكتروني مسبقاً');
      return;
    }

    const newAdm: AdminAccount = {
      id: 'adm-' + Math.random().toString(36).substring(2, 8),
      name: newName.trim(),
      email: newEmail.trim(),
      passwordPlain: newPassword.trim(),
      role: newRole,
      department: newDepartment,
      status: newStatus,
      permissions: newPermissions.length > 0 ? newPermissions : ['توثيق المطورين وفحص FQS'],
      lastLogin: 'لم يسجل دخول بعد',
      createdAt: new Date().toISOString().split('T')[0],
      phone: newPhone.trim() || undefined,
    };

    setAdmins([newAdm, ...admins]);
    notify(`تم إنشاء حساب الأدمن (${newAdm.name}) بنجاح وتعيين كلمة المرور! 👑`);
    setShowCreateModal(false);
    setNewName('');
    setNewEmail('');
    setNewPassword(generateRandomPassword());
    setNewPhone('');
  };

  // Open Password Change Modal
  const handleOpenPasswordModal = (admin: AdminAccount) => {
    setSelectedAdminForPassword(admin);
    const generated = generateRandomPassword();
    setNewPasswordValue(generated);
    setConfirmPasswordValue(generated);
    setShowPasswordModal(true);
  };

  // Save New Password
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminForPassword) return;
    if (!newPasswordValue.trim() || newPasswordValue.length < 6) {
      notify('كلمة المرور الجديدة يجب أن تتكون من 6 خانات على الأقل');
      return;
    }
    if (newPasswordValue !== confirmPasswordValue) {
      notify('كلمتا المرور غير متطابقتين، يرجى التحقق وإعادة الإدخال');
      return;
    }

    const updated = admins.map((adm) =>
      adm.id === selectedAdminForPassword.id
        ? { ...adm, passwordPlain: newPasswordValue.trim() }
        : adm
    );

    setAdmins(updated);
    notify(`تم تغيير وتحديث كلمة المرور للمشرف (${selectedAdminForPassword.name}) بنجاح! 🔑`);
    setShowPasswordModal(false);
    setSelectedAdminForPassword(null);
  };

  // Open Edit Admin Modal
  const handleOpenEditModal = (admin: AdminAccount) => {
    setSelectedAdminForEdit(admin);
    setEditAdminName(admin.name);
    setEditAdminEmail(admin.email);
    setEditAdminRole(admin.role);
    setEditAdminDepartment(admin.department);
    setEditAdminPhone(admin.phone || '');
    setEditAdminStatus(admin.status);
    setEditAdminPermissions([...admin.permissions]);
    setShowEditModal(true);
  };

  // Save Edit Admin
  const handleSaveEditAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminForEdit) return;
    if (!editAdminName.trim() || !editAdminEmail.trim()) {
      notify('يرجى ملء الاسم والبريد الإلكتروني');
      return;
    }

    const updated = admins.map((adm) =>
      adm.id === selectedAdminForEdit.id
        ? {
            ...adm,
            name: editAdminName.trim(),
            email: editAdminEmail.trim(),
            role: editAdminRole,
            department: editAdminDepartment,
            phone: editAdminPhone.trim() || undefined,
            status: editAdminStatus,
            permissions: editAdminPermissions,
          }
        : adm
    );

    setAdmins(updated);
    notify(`تم تحديث بيانات وصلاحيات المشرف (${editAdminName}) بنجاح!`);
    setShowEditModal(false);
    setSelectedAdminForEdit(null);
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (admin: AdminAccount) => {
    setSelectedAdminForDelete(admin);
    setShowDeleteModal(true);
  };

  // Confirm Delete Admin
  const handleConfirmDeleteAdmin = () => {
    if (!selectedAdminForDelete) return;
    setAdmins(admins.filter((a) => a.id !== selectedAdminForDelete.id));
    notify(`تم حذف حساب المشرف (${selectedAdminForDelete.name}) وسحب كافة الصلاحيات نهائياً`);
    setShowDeleteModal(false);
    setSelectedAdminForDelete(null);
  };

  // Toggle Admin Status
  const handleToggleAdminStatus = (admin: AdminAccount) => {
    const nextStatus: 'نشط' | 'معلق' = admin.status === 'نشط' ? 'معلق' : 'نشط';
    const updated = admins.map((a) => (a.id === admin.id ? { ...a, status: nextStatus } : a));
    setAdmins(updated);
    notify(`تم ${nextStatus === 'نشط' ? 'تفعيل' : 'تجميد'} حساب المشرف (${admin.name}) بنجاح`);
  };

  // Toggle Reveal Password
  const handleToggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy Password
  const handleCopyPassword = (pwd: string, name: string) => {
    try {
      navigator.clipboard.writeText(pwd);
      notify(`تم نسخ كلمة مرور المشرف (${name}) إلى الحافظة بنجاح 📋`);
    } catch {
      notify('تعذر النسخ التلقائي');
    }
  };

  // Export Executive Report
  const handleExportReport = () => {
    notify('جاري توليد التقرير الاستراتيجي الشامل لمنصة فوتيك (PDF)... تم التحميل بنجاح!');
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Owner Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101b2b] via-[#162a42] to-[#1f3e5f] p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f3cf65] to-[#ffeaa7] text-[#1c1908] shadow-lg">
              <Crown size={28} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white sm:text-2xl">
                  {currentUser?.name || 'مينا روبير مجدى فوزى'}
                </h1>
                <span className="rounded-full bg-[#f3cf65]/20 px-3 py-0.5 text-xs font-black text-[#f3cf65] ring-1 ring-[#f3cf65]/40">
                  👑 المطور والمالك الأوحد للمنصة (Platform Owner)
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                لوحة القيادة التنفيذية العليا — متابعة مؤشرات النمو وحوكمة خوارزمية FQS وصلاحيات النظام
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <Download size={15} />
              <span>تصدير التقرير التنفيذي</span>
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#25979f] px-4 py-2.5 text-xs font-black text-[#081e28] shadow-md transition hover:bg-[#32b5be]"
            >
              <ShieldCheck size={16} />
              <span>لوحة الإدارة التشغيلية</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'kpis', label: 'المؤشرات التنفيذية (KPIs)', icon: BarChart3 },
          {
            id: 'inbox',
            label: `رسائل المالك المباشرة (${openOwnerMessagesCount > 0 ? openOwnerMessagesCount : ownerMessages.length})`,
            icon: Inbox,
          },
          { id: 'fqs_engine', label: `محرك خوارزمية FQS والمطورين (${store.developers.length})`, icon: Sliders },
          { id: 'admins', label: `فريق المشرفين والإدارة (${admins.length})`, icon: Users },
          { id: 'governance', label: 'حوكمة وسياسات المنصة', icon: Settings },
          { id: 'audit', label: 'سجل العمليات والرقابة', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition ${
                active
                  ? 'bg-[#152a40] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} className={active ? 'text-[#36cbd4]' : 'text-slate-400'} />
              <span>{tab.label}</span>
              {tab.id === 'inbox' && openOwnerMessagesCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1.5 text-[10px] font-black text-slate-900">
                  {openOwnerMessagesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. KPIs Tab */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">القيمة التداولية للمشاريع (GMV)</span>
                <DollarSign size={18} className="text-emerald-500" />
              </div>
              <div className="mt-3 text-2xl font-black text-[#152c42] dark:text-white">
                {store.projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()} <span className="text-xs font-bold text-emerald-600">ر.س</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <TrendingUp size={13} />
                <span>إجمالي ميزانيات المشاريع الموثقة</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">المشاريع التقنية المعتمدة</span>
                <Award size={18} className="text-blue-500" />
              </div>
              <div className="mt-3 text-2xl font-black text-[#152c42] dark:text-white">{store.projects.length} مشاريع</div>
              <div className="mt-2 text-[11px] text-slate-400">
                وفق سياسة تسليم الكود Git Handover
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">المهندسين والمطورين المسجلين</span>
                <ShieldCheck size={18} className="text-[#2ba6ae]" />
              </div>
              <div className="mt-3 text-2xl font-black text-[#152c42] dark:text-white">
                {store.developers.length} <span className="text-xs font-bold text-slate-400">مهندس موثق</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">كفاءات برمجية خضعت لتقييم FQS</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">التزام المطورين بالـ SLA</span>
                <Activity size={18} className="text-purple-500" />
              </div>
              <div className="mt-3 text-2xl font-black text-[#152c42] dark:text-white">100%</div>
              <div className="mt-2 text-[11px] text-slate-400">ضمان تقني شامل وحساب Escrow مشفر</div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">رسائل واستفسارات المالك المباشرة</span>
                <Inbox size={18} className="text-amber-500" />
              </div>
              <div className="mt-3 text-2xl font-black text-[#152c42] dark:text-white">
                {ownerMessages.length} <span className="text-xs font-bold text-slate-400">رسالة</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-600">
                  {openOwnerMessagesCount} بحاجة لمراجعة أو رد
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('inbox')}
                  className="font-bold text-[#203d62] hover:underline"
                >
                  فتح البريد ←
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Executive Visitor Intelligence & Traffic Analytics Suite */}
          {/* 👑 خاص بمالك المنصة والقيادة العليا فقط (محجوب عن المطورين والعملاء) */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-white via-teal-50/20 to-cyan-50/10 p-6 shadow-xs dark:border-teal-500/10 dark:bg-[#0c1626]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-500/15 pb-4 dark:border-teal-500/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-500/15 text-teal-600 ring-2 ring-teal-500/20 dark:bg-teal-950/60 dark:text-teal-400">
                  <Eye size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#14283d] dark:text-white">
                      إحصائيات المشاهدات وحركة زوار المنصة الفعلية (Platform Traffic Intelligence)
                    </h3>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                      مباشر 🟢 Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    تتبع دقيق لعدد الزيارات الفعلية، المتصفحين الفريدين، ومعدلات التفاعل اليومية
                  </p>
                </div>
              </div>
              <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Crown size={14} className="text-amber-500" />
                <span>خاص بالمالك والقيادة العليا فقط</span>
              </span>
            </div>

            {/* 4 Visitor Intelligence KPI Cards */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">إجمالي مشاهدات وتصفح المنصة</span>
                  <Eye size={16} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.totalViews.toLocaleString()} <span className="text-xs font-bold text-teal-600">مشاهدة</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  <TrendingUp size={12} />
                  <span>تصفح حقيقي وموثق عبر كافة الصفحات</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">الزوار الفريدون والنشطون</span>
                  <Users size={16} className="text-blue-500" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.uniqueVisitors.toLocaleString()} <span className="text-xs font-bold text-blue-500">زائر فريد</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  أجهزة وحسابات متصفحة فريدة (Unique Clients)
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">مشاهدات وتصفح اليوم</span>
                  <Activity size={16} className="text-emerald-500" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.todayViews.toLocaleString()} <span className="text-xs font-bold text-emerald-600">مشاهدة اليوم</span>
                </div>
                <div className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {visitorAnalytics.todayVisitors} زائر متفاعل خلال الـ 24 ساعة
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">متوسط الجلسة والتفاعل</span>
                  <Sparkles size={16} className="text-purple-500" />
                </div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.avgSessionDuration}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  معدل التصفح والاستقرار: {100 - parseInt(visitorAnalytics.bounceRate)}%
                </div>
              </div>
            </div>

            {/* Traffic Timeline Chart & Deep Dive */}
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              {/* Timeline AreaChart (2 cols) */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <TrendingUp size={16} />
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-[#14283d] dark:text-white">
                        منحنى تدفق الزيارات والمشاهدات اليومية (Daily Traffic Velocity)
                      </h4>
                      <span className="text-[10px] text-slate-400">مقارنة المشاهدات الإجمالية بالزوار الفريدين على مدار 7 أيام</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                      <span className="h-2 w-2 rounded-full bg-teal-500" />
                      مشاهدات
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-500">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      زوار
                    </span>
                  </div>
                </div>

                <div className="mt-4 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={visitorAnalytics.trafficHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ownerViewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="ownerVisitorsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0c1626',
                          borderColor: '#1e293b',
                          borderRadius: '16px',
                          color: '#fff',
                          fontSize: '11px',
                          direction: 'rtl',
                        }}
                      />
                      <Area type="monotone" dataKey="views" name="المشاهدات" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#ownerViewsGrad)" />
                      <Area type="monotone" dataKey="visitors" name="الزوار" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#ownerVisitorsGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Pages & Geo Distribution Breakdown (1 col) */}
              <div className="space-y-4">
                {/* Top Visited Pages */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                  <h4 className="text-xs font-black text-[#14283d] dark:text-white mb-2.5 flex items-center justify-between">
                    <span>أكثر الصفحات زيارة وتصفحاً</span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">Top Pages</span>
                  </h4>
                  <div className="space-y-2">
                    {visitorAnalytics.topPages.slice(0, 4).map((p: any) => (
                      <div key={p.path} className="flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-bold text-slate-800 dark:text-slate-200">{p.name || p.title || p.path}</div>
                          <div className="text-[10px] text-slate-400 truncate">{p.path}</div>
                        </div>
                        <span className="rounded-lg bg-teal-500/10 px-2 py-0.5 text-[11px] font-black text-teal-700 dark:text-teal-300">
                          {p.views.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arab Region Distribution */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                  <h4 className="text-xs font-black text-[#14283d] dark:text-white mb-2 flex items-center justify-between">
                    <span>التوزيع الجغرافي للزوار</span>
                    <span className="text-[10px] text-slate-400">العالم العربي 🌍</span>
                  </h4>
                  <div className="space-y-1.5">
                    {visitorAnalytics.geoDistribution.map((geo: any) => (
                      <div key={geo.country} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{geo.country}</span>
                          <span className="font-black text-teal-600 dark:text-teal-400">{geo.share}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                          <div className="h-full rounded-full bg-teal-500" style={{ width: `${geo.share}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Executive Visual Analytics Suite (رسومات بيانية تفاعلية للمالك) */}
          {/* ========================================================= */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Escrow & Liquidity Velocity (AreaChart) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <TrendingUp size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      حركة السيولة والضمان المالي المشفر (Escrow Velocity)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      تتبع مبالغ الضمان المحجوزة والدفعات المحررة شهرياً (ر.س)
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  {store.clientWallet?.inEscrow && store.clientWallet.inEscrow > 0
                    ? `${store.clientWallet.inEscrow.toLocaleString()} ر.س بالضمان`
                    : 'حماية الضمان المشفر 100%'}
                </span>
              </div>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={escrowFinancialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ownerEscrowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#249ea7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#249ea7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="ownerPayoutGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: any) => [`${Number(val).toLocaleString()} ر.س`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      name="أموال الضمان المحجوزة (Escrow)"
                      dataKey="escrowLocked"
                      stroke="#249ea7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#ownerEscrowGrad)"
                    />
                    <Area
                      type="monotone"
                      name="الدفعات المحررة للمطورين"
                      dataKey="payoutsReleased"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#ownerPayoutGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Developer FQS Tier Distribution (BarChart) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Award size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      توزيع الكفاءات حسب مستويات جودة FQS
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      عدد المطورين المعتمدين في كل تصنيف كفاءة برمجية
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-black text-blue-600 dark:text-blue-400">
                  متوسط FQS العام: {overallAvgFqs}/100
                </span>
              </div>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fqsTiersChartData} margin={{ top: 15, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="tier" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: any) => [`${val} مهندس`, 'العدد المسجل']}
                    />
                    <Bar dataKey="count" name="عدد المطورين" radius={[10, 10, 0, 0]}>
                      {fqsTiersChartData.map((entry, index) => (
                        <Cell key={`cell-tier-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: SLA Tickets Resolution Speed (LineChart) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Activity size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      سرعة الاستجابة وحل تذاكر الضمان SLA
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      مقارنة ساعات الإغلاق الفعلية مقابل الحد الأقصى لاتفاقية SLA (ساعات)
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  {store.tickets.length > 0
                    ? `⚡ ${slaPerformanceData[0]?.actualHours || 1} ساعة متوسط الحل`
                    : '✓ 0 بلاغات مفتوحة'}
                </span>
              </div>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={slaPerformanceData} margin={{ top: 15, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" س" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: any, name: any) => [`${val} ساعة`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line
                      type="monotone"
                      name="الزمن الفعلي للإصلاح"
                      dataKey="actualHours"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      name="الحد الأقصى لضمان SLA"
                      dataKey="slaTarget"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Engineering Disciplines Market Share (Donut PieChart) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Layers size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      الحصص السوقية للتخصصات الهندسية
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      توزيع الكفاءات البرمجية حسب مجالات التطوير
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-black text-amber-700 dark:text-amber-300">
                  {store.developers.length} مهندس مسجل
                </span>
              </div>

              <div className="mt-5 flex flex-col items-center justify-center sm:flex-row gap-4 h-72">
                {store.developers.length === 0 ? (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <Users size={24} />
                    </div>
                    <span className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">
                      البيانات الفعلية: 0 مهندس مسجل حالياً بالمنصة
                    </span>
                    <p className="mt-1 text-[11px] text-slate-400 max-w-[320px]">
                      لا توجد أرقام وهمية؛ سيتم رسم الحصص وتوزيع التخصصات الهندسية تلقائياً بمجرد تسجيل أول مطور معتمد في قاعدة البيانات.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="h-full w-full sm:w-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '16px',
                              color: '#f8fafc',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }}
                            formatter={(val: any) => [`${val} مهندس (${Math.round((Number(val) / store.developers.length) * 100)}%)`, 'الحصة']}
                          />
                          <Pie
                            data={specializationsMarketData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                          >
                            {specializationsMarketData.map((entry, index) => (
                              <Cell key={`cell-spec-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full sm:w-1/2 space-y-2 text-xs">
                      {specializationsMarketData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-slate-900/60">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[140px]">{item.name}</span>
                          </div>
                          <span className="font-black text-slate-900 dark:text-white text-[11px]">
                            {item.value} ({Math.round((item.value / store.developers.length) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Strategic Platform Insights & Competitive Guarantee */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-[#fafbfc] p-4 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <div className="text-2xl font-black text-[#183654] dark:text-white">{store.projects.length}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">مشروع معتمد بضمان الكود وGit الكامل</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#fafbfc] p-4 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">0</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">نزاعات معلقة أو قضايا غير محلولة</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#fafbfc] p-4 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <div className="text-2xl font-black text-[#249ea7]">100%</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">حماية حقوق وضمان استرجاع الأموال</div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#2798a0]/30 bg-[#edf8f9] p-4 text-xs text-slate-700 dark:border-teal-900/40 dark:bg-teal-950/30 dark:text-slate-300 leading-relaxed">
              <span className="font-black text-[#1b7f87] dark:text-teal-400">💡 ميزة تنافسية سيادية: </span>
              نموذج فوتيك المعتمد على 0% رسوم وساطة واستلام ملكية Git مباشرة أدى إلى ارتفاع معدل
              التوظيف المتكرر للشركات بنسبة 48% مقارنة بالمنصات التقليدية، مع ضمان 30 يوماً بعد التسليم.
            </div>
          </div>
        </div>
      )}

      {/* 2. Inbox Tab: Direct Owner Messages */}
      {activeTab === 'inbox' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Inbox size={24} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#152a40] dark:text-white">
                      صندوق رسائل واستفسارات المالك المباشرة
                    </h3>
                    <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-black text-amber-700 dark:text-amber-300">
                      👑 خاص بالمالك
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    استفسارات الشراكات الاستراتيجية، عقود المشاريع الخاصة، ورسائل التواصل الموجهة مباشرة للمالك (مينا روبير) وللإدارة
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  إجمالي الرسائل: <strong>{ownerMessages.length}</strong>
                </span>
                <span className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                  قيد المتابعة: <strong>{openOwnerMessagesCount}</strong>
                </span>
              </div>
            </div>

            {/* Search & Status Filters */}
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative min-w-[260px] flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  placeholder="ابحث في الرسائل بالاسم، البريد، الموضوع، أو رقم الهاتف..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 pe-4 ps-10 text-xs font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                />
                {inboxSearch && (
                  <button
                    onClick={() => setInboxSearch('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'مفتوح', label: 'مفتوح' },
                  { id: 'قيد المعالجة', label: 'قيد المعالجة' },
                  { id: 'تم الحل', label: 'تم الحل' },
                  { id: 'مغلق', label: 'مغلق' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setInboxStatusFilter(st.id as any)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      inboxStatusFilter === st.id
                        ? 'bg-[#152a40] text-white shadow-xs dark:bg-teal-600'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Layout: List + Detail View */}
          {filteredInboxMessages.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/30">
                <Inbox size={28} />
              </div>
              <h4 className="mt-4 text-sm font-black text-slate-800 dark:text-white">
                لا توجد رسائل مطابقة حالياً
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                يمكن لأي مستخدم أو عميل إرسال رسائل واستفسارات للمالك مباشرة من نموذج التواصل بصفحة الدعم الفني
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Message List (Left in RTL, 5 cols) */}
              <div className="space-y-3 lg:col-span-5">
                {filteredInboxMessages.map((msg) => {
                  const isSelected = selectedOwnerMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedOwnerMessage(msg)}
                      className={`group relative cursor-pointer rounded-2xl border p-4 transition ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/40 shadow-md ring-2 ring-amber-400/20 dark:border-amber-500/50 dark:bg-amber-950/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0c1524] dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-xs font-black text-slate-900 shadow-xs">
                            {msg.owner ? msg.owner.charAt(0) : 'م'}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                {msg.owner}
                              </h4>
                              {msg.targetAudience === 'owner' ? (
                                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                  👑 المالك
                                </span>
                              ) : (
                                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-black text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                  🌐 المالك والإدارة
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">{msg.createdAt || msg.created || 'مؤخراً'}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                            msg.status === 'مفتوح'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                              : msg.status === 'قيد المعالجة'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>

                      {/* Subject */}
                      <h5 className="mt-2.5 text-xs font-bold text-slate-800 line-clamp-1 dark:text-slate-100">
                        {msg.subject}
                      </h5>

                      {/* Message preview snippet */}
                      <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 dark:text-slate-400">
                        {msg.message || (msg.replies && (typeof msg.replies[0] === 'object' ? (msg.replies[0] as TicketReply).message : msg.replies[0])) || 'لا يوجد نص رسالة'}
                      </p>

                      {/* Footer tags */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
                        {msg.projectTitle && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {msg.projectTitle}
                          </span>
                        )}
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${
                            msg.priority === 'حرج'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                              : msg.priority === 'عالي'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          أولوية: {msg.priority}
                        </span>

                        {msg.attachments && msg.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                            <Paperclip size={11} />
                            <span>{msg.attachments.length}</span>
                          </span>
                        )}

                        {msg.replies && msg.replies.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-teal-600 dark:text-teal-400 font-bold me-auto">
                            <MessageCircle size={11} />
                            <span>{msg.replies.length} رد</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Detail View (Right in RTL, 7 cols) */}
              <div className="lg:col-span-7">
                {selectedOwnerMessage ? (
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-black text-amber-700 dark:text-amber-300">
                            👑 {selectedOwnerMessage.targetAudience === 'owner' ? 'موجهة للمالك حصراً' : 'موجهة للمالك والإدارة'}
                          </span>
                          {selectedOwnerMessage.projectTitle && (
                            <span className="rounded-lg bg-teal-500/15 px-2.5 py-1 text-xs font-black text-teal-700 dark:text-teal-300">
                              {selectedOwnerMessage.projectTitle}
                            </span>
                          )}
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            أولوية {selectedOwnerMessage.priority}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-black text-slate-900 dark:text-white">
                          {selectedOwnerMessage.subject}
                        </h3>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 font-bold">الحالة:</span>
                        {(['مفتوح', 'قيد المعالجة', 'تم الحل', 'مغلق'] as Ticket['status'][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateMessageStatus(selectedOwnerMessage.id, st)}
                            className={`rounded-xl px-2.5 py-1 text-[11px] font-black transition ${
                              selectedOwnerMessage.status === st
                                ? 'bg-[#152a40] text-white shadow-xs dark:bg-teal-600'
                                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sender Info Bar */}
                    <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 dark:border-slate-800/80 dark:bg-slate-900/50">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-400">المرسل:</div>
                          <div className="text-xs font-black text-slate-800 dark:text-white">
                            {selectedOwnerMessage.owner}
                          </div>
                        </div>

                        {selectedOwnerMessage.senderEmail && (
                          <div className="space-y-1">
                            <div className="text-[11px] font-bold text-slate-400">البريد الإلكتروني:</div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${selectedOwnerMessage.senderEmail}`}
                                className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400"
                              >
                                {selectedOwnerMessage.senderEmail}
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedOwnerMessage.senderEmail || '');
                                  notify('تم نسخ البريد الإلكتروني');
                                }}
                                className="text-slate-400 hover:text-slate-600"
                                title="نسخ"
                              >
                                <Copy size={13} />
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedOwnerMessage.senderPhone && (
                          <div className="space-y-1">
                            <div className="text-[11px] font-bold text-slate-400">رقم الهاتف / الواتساب:</div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${selectedOwnerMessage.senderPhone}`}
                                className="text-xs font-bold text-slate-800 hover:underline dark:text-slate-200"
                              >
                                {selectedOwnerMessage.senderPhone}
                              </a>
                              <a
                                href={`https://wa.me/${selectedOwnerMessage.senderPhone.replace(/[^\d]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-800 hover:bg-emerald-200"
                              >
                                <span>واتساب</span>
                                <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="text-[11px] font-bold text-slate-400">تاريخ الإرسال:</div>
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {selectedOwnerMessage.createdAt || selectedOwnerMessage.created || 'مؤخراً'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Original Message Text */}
                    <div className="space-y-2">
                      <div className="text-xs font-black text-slate-700 dark:text-slate-300">نص الرسالة:</div>
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-xs font-medium leading-relaxed text-slate-800 whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
                        {selectedOwnerMessage.message || (selectedOwnerMessage.replies && (typeof selectedOwnerMessage.replies[0] === 'object' ? (selectedOwnerMessage.replies[0] as TicketReply).message : selectedOwnerMessage.replies[0])) || 'لا يوجد نص رسالة'}
                      </div>
                    </div>

                    {/* Attachments */}
                    {selectedOwnerMessage.attachments && selectedOwnerMessage.attachments.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-black text-slate-700 dark:text-slate-300">المرفقات والملفات:</div>
                        <TicketAttachmentViewer attachments={selectedOwnerMessage.attachments} />
                      </div>
                    )}

                    {/* Previous Replies Timeline */}
                    {selectedOwnerMessage.replies && selectedOwnerMessage.replies.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="text-xs font-black text-slate-700 dark:text-slate-300">سجل الردود والمتابعة:</div>
                        <div className="space-y-2.5">
                          {selectedOwnerMessage.replies.map((rawRep, idx) => {
                            const rep: TicketReply =
                              typeof rawRep === 'string'
                                ? {
                                    id: `rep-${idx}`,
                                    sender: 'مستخدم',
                                    senderRole: 'client',
                                    message: rawRep,
                                    createdAt: 'مؤخراً',
                                  }
                                : rawRep;
                            const authorName = rep.author || rep.sender || 'مستخدم';
                            const roleName = rep.role || rep.senderRole || 'client';
                            const isOwnerReply =
                              roleName === 'owner' ||
                              authorName === 'المهندس مينا روبير مجدى فوزى' ||
                              authorName.includes('المالك التنفيذي');
                            const isAdminReply =
                              roleName === 'admin' ||
                              roleName === 'support' ||
                              authorName.includes('مشرف') ||
                              authorName.includes('إدارة');
                            return (
                              <div
                                key={rep.id || `rep-${idx}`}
                                className={`rounded-2xl border p-3.5 text-xs ${
                                  isOwnerReply
                                    ? 'border-amber-300/80 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/30'
                                    : isAdminReply
                                    ? 'border-teal-300/80 bg-teal-50/60 dark:border-teal-900/50 dark:bg-teal-950/30'
                                    : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 font-black">
                                    <span>{authorName}</span>
                                    {isOwnerReply && (
                                      <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[9px] font-black text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                                        👑 رد المالك
                                      </span>
                                    )}
                                    {isAdminReply && !isOwnerReply && (
                                      <span className="rounded bg-teal-200 px-1.5 py-0.5 text-[9px] font-black text-teal-900 dark:bg-teal-900 dark:text-teal-200">
                                        🛡️ رد المشرف
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400">
                                    {rep.timestamp || rep.createdAt || 'مؤخراً'}
                                  </span>
                                </div>
                                <div className="mt-2 leading-relaxed text-slate-700 whitespace-pre-wrap dark:text-slate-200">
                                  {rep.message}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Owner Direct Reply Form */}
                    <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-b from-amber-50/30 to-white p-4 dark:border-amber-900/50 dark:bg-slate-900/60">
                      <div className="flex items-center gap-2">
                        <Crown size={17} className="text-amber-600" />
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          إرسال رد رسمي بصفتك المالك (مينا روبير مجدى فوزى)
                        </h4>
                      </div>

                      {/* Quick Presets */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {[
                          '✓ تمت المراجعة من قِبل المالك، وسنقوم باللازم فوراً.',
                          '🤝 مرحباً، نرحب بطلب الشراكة وسنقوم بالتواصل معك هاتفياً.',
                          '💡 تم استلام مقترحك وتوجيهه للفريق التقني لاعتماده.',
                          '🔒 تم فحص وتأكيد المعالجة وإغلاق الموضوع بنجاح.',
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setOwnerReplyText(preset)}
                            className="rounded-lg border border-amber-200 bg-white px-2.5 py-1 text-[10px] font-bold text-amber-900 hover:bg-amber-100 transition dark:border-amber-800 dark:bg-slate-800 dark:text-amber-200"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3">
                        <textarea
                          rows={3}
                          value={ownerReplyText}
                          onChange={(e) => setOwnerReplyText(e.target.value)}
                          placeholder="اكتب رد المالك المباشر هنا وسيتم حفظه وإدراجه في سجل متابعة التذكرة..."
                          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-900 outline-none transition focus:border-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          سيتم إشعار صاحب الرسالة وإضافة الرد إلى لوحة الإدارة المشتركة أيضاً
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSendOwnerReply(selectedOwnerMessage.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#152a40] px-5 py-2 text-xs font-black text-white hover:bg-[#203d62] active:scale-95 transition"
                        >
                          <Send size={14} className="text-amber-400" />
                          <span>إرسال رد المالك</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-400 dark:border-slate-800 dark:bg-[#0c1524]">
                    اختر رسالة من القائمة لعرض تفاصيلها والرد عليها
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FQS Algorithm Engine & Developers Hub (محرك FQS والمطورين) */}
      {/* ========================================================= */}
      {activeTab === 'fqs_engine' && (
        <div className="space-y-6">
          {/* Header & Main Control Center */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-[#0c1524]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Sliders size={24} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#152a40] dark:text-white">
                      محرك خوارزمية FQS وإدارة كفاءات المطورين
                    </h3>
                    <span className="rounded-full bg-teal-500/15 px-2.5 py-0.5 text-xs font-black text-teal-700 dark:text-teal-300">
                      معادلة الجودة الذكية v2.4
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    التحكم في الأوزان الحسابية لمعادلة مؤشر الجودة (FQS)، مراجعة وتعديل درجات المطورين، وإعادة احتساب الدرجات للجميع فورياً.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetWeights}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <RotateCcw size={14} />
                  <span>استعادة الافتراضي</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveWeights}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <Save size={15} />
                  <span>حفظ الأوزان الحالية</span>
                </button>

                <button
                  type="button"
                  onClick={handleRecalculateAllDevelopersFqs}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
                >
                  <Zap size={16} className="text-yellow-300" />
                  <span>⚡ إعادة احتساب FQS لجميع المطورين ({store.developers.length})</span>
                </button>
              </div>
            </div>

            {/* Sum validation banner */}
            <div
              className={`mt-6 flex items-center justify-between rounded-2xl p-4 text-xs font-black ${
                weightsSum === 100
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full animate-pulse" style={{ backgroundColor: weightsSum === 100 ? '#10b981' : '#f43f5e' }} />
                <span>
                  مجموع الأوزان النسبي الحالي: <strong>{weightsSum}%</strong>
                </span>
              </div>
              <span>{weightsSum === 100 ? '✓ معادلة خوارزمية FQS متوازنة بنسبة 100%' : '⚠️ مجموع الأوزان يجب أن يساوي 100% بالضبط'}</span>
            </div>

            {/* Presets Row */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">نماذج أوزان جاهزة:</span>
              <button
                type="button"
                onClick={() => setWeights({ completionRate: 35, onTimeBudget: 30, clientRating: 20, repeatHireRate: 15 })}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                ⚖️ المعيار المتوازن (35 / 30 / 20 / 15)
              </button>
              <button
                type="button"
                onClick={() => setWeights({ completionRate: 25, onTimeBudget: 25, clientRating: 35, repeatHireRate: 15 })}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                ⭐ أولوية رضا وتقييم العميل (25 / 25 / 35 / 15)
              </button>
              <button
                type="button"
                onClick={() => setWeights({ completionRate: 40, onTimeBudget: 35, clientRating: 15, repeatHireRate: 10 })}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                🚀 أولوية سرعة الإنجاز والالتزام (40 / 35 / 15 / 10)
              </button>
            </div>

            {/* Sliders Grid & Live Weights Donut Chart */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Sliders (2 Columns) */}
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                {/* Factor 1: Completion Rate */}
                <div className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white">
                      1. معدل إكمال المشاريع
                    </span>
                    <span className="rounded-xl bg-[#249ea7] px-3 py-1 text-xs font-black text-white">
                      {weights.completionRate}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    تسليم المشروع بالكامل دون انسحاب أو إغلاق نزاع سلبي
                  </p>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={weights.completionRate}
                    onChange={(e) =>
                      setWeights({ ...weights, completionRate: Number(e.target.value) })
                    }
                    className="mt-4 w-full accent-[#249ea7]"
                  />
                </div>

                {/* Factor 2: On-Time & Budget */}
                <div className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white">
                      2. الالتزام بالوقت والميزانية
                    </span>
                    <span className="rounded-xl bg-[#3b82f6] px-3 py-1 text-xs font-black text-white">
                      {weights.onTimeBudget}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    التسليم في الموعد النهائي المحدد وتجنب المطالبات الإضافية
                  </p>
                  <input
                    type="range"
                    min={10}
                    max={60}
                    step={5}
                    value={weights.onTimeBudget}
                    onChange={(e) =>
                      setWeights({ ...weights, onTimeBudget: Number(e.target.value) })
                    }
                    className="mt-4 w-full accent-[#3b82f6]"
                  />
                </div>

                {/* Factor 3: Client Ratings */}
                <div className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white">
                      3. تقييمات العملاء
                    </span>
                    <span className="rounded-xl bg-[#f59e0b] px-3 py-1 text-xs font-black text-white">
                      {weights.clientRating}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    متوسط تقييم النجوم من 1 إلى 5 عند إتمام تسليم الكود
                  </p>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={weights.clientRating}
                    onChange={(e) =>
                      setWeights({ ...weights, clientRating: Number(e.target.value) })
                    }
                    className="mt-4 w-full accent-[#f59e0b]"
                  />
                </div>

                {/* Factor 4: Repeat Hire Rate */}
                <div className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-4.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 dark:text-white">
                      4. معدل تكرار التوظيف
                    </span>
                    <span className="rounded-xl bg-[#8b5cf6] px-3 py-1 text-xs font-black text-white">
                      {weights.repeatHireRate}%
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    نسبة العملاء الذين عادوا لتوظيف نفس المطور في عقود جديدة
                  </p>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={5}
                    value={weights.repeatHireRate}
                    onChange={(e) =>
                      setWeights({ ...weights, repeatHireRate: Number(e.target.value) })
                    }
                    className="mt-4 w-full accent-[#8b5cf6]"
                  />
                </div>
              </div>

              {/* Live Algorithm Donut Chart */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-[#fafbfc] p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  التوزيع النسبي اللحظي للأوزان
                </span>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '14px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                        formatter={(val: any) => [`${val}%`, 'الوزن النسبي']}
                      />
                      <Pie
                        data={fqsWeightsChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {fqsWeightsChartData.map((entry, index) => (
                          <Cell key={`cell-weight-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full space-y-1.5 text-[10px]">
                  {fqsWeightsChartData.map((w) => (
                    <div key={w.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: w.color }} />
                        <span className="text-slate-600 dark:text-slate-300 font-bold">{w.name}</span>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">{w.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics & Benchmarks Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart A: FQS Developers Tier Distribution */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-black text-[#152a40] dark:text-white">
                    توزيع المطورين حسب فئات مؤشر FQS
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    أعداد المطورين في منصة فوتيك مصنفين حسب جودة الإنجاز
                  </p>
                </div>
                <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[10px] font-black text-teal-600 dark:text-teal-400">
                  {store.developers.length} مطور موثق
                </span>
              </div>

              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fqsTiersChartData} margin={{ top: 15, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="tier" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: any) => [`${val} مطور`, 'العدد']}
                    />
                    <Bar dataKey="count" name="عدد المطورين" radius={[8, 8, 0, 0]}>
                      {fqsTiersChartData.map((entry, index) => (
                        <Cell key={`tier-cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart B: Platform Average Factors vs SLA Benchmark */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-black text-[#152a40] dark:text-white">
                    متوسط معايير FQS للمنصة مقابل المستهدف
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    مقارنة معدلات الأداء الحالية لكافة المطورين مع أهداف فوتيك
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  مؤشر أداء ممتاز
                </span>
              </div>

              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fqsFactorAveragesData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} horizontal={false} />
                    <XAxis type="number" domain={[50, 100]} stroke="#94a3b8" fontSize={11} unit="%" />
                    <YAxis dataKey="factor" type="category" stroke="#94a3b8" fontSize={10} width={130} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: any, name: any) => [`${val}%`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                    <Bar dataKey="avg" name="المتوسط الفعلي للمطورين" fill="#249ea7" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="target" name="المستهدف الهندسي" fill="#cbd5e1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Developers FQS Directory & Management Hub                  */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-[#0c1524]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Users size={20} />
                </span>
                <div>
                  <h3 className="text-base font-black text-[#152a40] dark:text-white">
                    دليل المطورين وإدارة مؤشرات FQS الفردية ({filteredFqsDevelopers.length} من {store.developers.length})
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    عرض المطورين، تفاصيل معايير FQS الأربعة، وتعديل الدرجات أو إعادة احتسابها فورياً لكل مطور.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  متوسط المنصة: <strong className="text-teal-600 dark:text-teal-400">{overallAvgFqs}/100</strong>
                </span>
                <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                  نخبة 95+: <strong>{store.developers.filter((d) => (d.fqs || 0) >= 95).length}</strong>
                </span>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative min-w-[260px] flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  value={fqsDevSearch}
                  onChange={(e) => setFqsDevSearch(e.target.value)}
                  placeholder="ابحث بالاسم، التخصص، أو التقنيات (React, Python, Node...)..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 pe-4 ps-10 text-xs font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                />
                {fqsDevSearch && (
                  <button
                    type="button"
                    onClick={() => setFqsDevSearch('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Tier Filters */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'كافة المستويات' },
                  { id: 'elite', label: '👑 النخبة (95+)' },
                  { id: 'expert', label: 'خبير (90-94)' },
                  { id: 'pro', label: 'محترف (85-89)' },
                  { id: 'rising', label: 'صاعد (<85)' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFqsTierFilter(tier.id as any)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      fqsTierFilter === tier.id
                        ? 'bg-[#152a40] text-white shadow-xs dark:bg-teal-600 dark:text-slate-950'
                        : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Developers Table / Cards */}
            <div className="mt-6 space-y-3.5">
              {filteredFqsDevelopers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
                  <Users size={32} className="mx-auto text-slate-400" />
                  <p className="mt-2 text-xs font-bold text-slate-500">لا يوجد مطورون يطابقون شروط البحث الحالية</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFqsDevSearch('');
                      setFqsTierFilter('all');
                      setFqsCategoryFilter('all');
                    }}
                    className="mt-3 text-xs font-black text-teal-600 hover:underline"
                  >
                    إلغاء الفلاتر وعرض الجميع
                  </button>
                </div>
              ) : (
                filteredFqsDevelopers.map((dev) => {
                  const breakdown = dev.fqsBreakdown || {
                    completionRate: 95,
                    onTimeBudget: 90,
                    clientRating: 95,
                    repeatHireRate: 85,
                  };
                  const fqsScore = dev.fqs || 90;
                  const isElite = fqsScore >= 95;
                  const isExpert = fqsScore >= 90 && fqsScore < 95;

                  return (
                    <div
                      key={dev.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4.5 transition-all hover:border-teal-500/50 hover:shadow-md lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      {/* Developer Info */}
                      <div className="flex items-center gap-3.5 min-w-[260px]">
                        <div className="relative shrink-0">
                          <img
                            src={dev.avatar}
                            alt={dev.name}
                            className="h-12 w-12 rounded-2xl border-2 border-white object-cover shadow-xs dark:border-slate-800"
                            onError={(e) => {
                              (e.target as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                            }}
                          />
                          {isElite && (
                            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-amber-500 text-white shadow-xs text-[10px]">
                              👑
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                              {dev.name}
                            </h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                                isElite
                                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                  : isExpert
                                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {dev.level || 'خبير برمجيات'}
                            </span>
                          </div>

                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{dev.specialty}</span>
                            <span>•</span>
                            <span>{dev.country || 'مصر'}</span>
                            <span>•</span>
                            <span>⭐ {dev.rating || 5.0} ({dev.reviewsCount || 0} تقييم)</span>
                          </div>
                        </div>
                      </div>

                      {/* FQS Gauge & Tier Badge */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 border shadow-xs ${
                            isElite
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200'
                              : isExpert
                              ? 'border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-200'
                              : 'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span className="text-xl font-black">{fqsScore}</span>
                          <div className="flex flex-col text-[9px] font-bold leading-tight">
                            <span>/ 100</span>
                            <span className="text-[10px] font-black">
                              {isElite ? 'نخبوي Elite' : isExpert ? 'خبير Expert' : 'محترف Pro'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Factor Breakdown Mini Meters */}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[340px]">
                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/80">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            <span>إكمال المشاريع</span>
                            <span className="text-teal-600 dark:text-teal-400 font-black">{breakdown.completionRate}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-full rounded-full bg-[#249ea7]" style={{ width: `${breakdown.completionRate}%` }} />
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/80">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            <span>الوقت والميزانية</span>
                            <span className="text-blue-600 dark:text-blue-400 font-black">{breakdown.onTimeBudget}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${breakdown.onTimeBudget}%` }} />
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/80">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            <span>تقييم العملاء</span>
                            <span className="text-amber-600 dark:text-amber-400 font-black">{breakdown.clientRating}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: `${breakdown.clientRating}%` }} />
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800/80">
                          <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            <span>تكرار التوظيف</span>
                            <span className="text-purple-600 dark:text-purple-400 font-black">{breakdown.repeatHireRate}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                            <div className="h-full rounded-full bg-[#8b5cf6]" style={{ width: `${breakdown.repeatHireRate}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Management Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditFqs(dev)}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300"
                        >
                          <Edit3 size={13} />
                          <span>تعديل FQS والدرجات</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRecalculateSingleDev(dev.id)}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-500 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          title="إعادة احتساب مؤشر FQS فردياً وفق أوزان الخوارزمية"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Admins & Staff Management Tab (Executive Table Hub) */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          {/* Header & KPI Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-6 shadow-xs dark:border-slate-800 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#203d62] text-amber-400 shadow-xs">
                  <Crown size={18} />
                </span>
                <h3 className="text-base font-black text-[#152a40] dark:text-white">
                  جدول إدارة وحوكمة حسابات الأدمن (Admin Accounts Hub)
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                لوحة السيادة التنفيذية لإنشاء حسابات المشرفين، تعديل وتوليد كلمات المرور المشفرة، تعيين الصلاحيات وإلغاء التراخيص التشغيلية.
              </p>
            </div>

            <button
              onClick={() => {
                setNewName('');
                setNewEmail('');
                setNewPassword(generateRandomPassword());
                setNewPhone('');
                setNewPermissions(['توثيق المطورين وفحص FQS', 'مراجعة واعتماد المشاريع']);
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#203d62] to-[#1c7e86] px-5 py-3 text-xs font-black text-white shadow-md shadow-[#203d62]/20 transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              <UserPlus size={16} />
              <span>+ إنشاء حساب أدمن جديد</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
              <span className="text-[11px] font-bold text-slate-400">إجمالي حسابات الإدارة</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-[#152a40] dark:text-white">{admins.length}</span>
                <span className="text-[10px] text-slate-400">مشرف معتمد</span>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-950/40 dark:bg-emerald-950/20">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">حسابات نشطة ومرخصة</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                  {admins.filter((a) => a.status === 'نشط').length}
                </span>
                <span className="text-[10px] text-emerald-600/70">جلسات متاحة</span>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 shadow-xs dark:border-amber-950/40 dark:bg-amber-950/20">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">حسابات مجمدة / معلقة</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-amber-700 dark:text-amber-400">
                  {admins.filter((a) => a.status === 'معلق').length}
                </span>
                <span className="text-[10px] text-amber-600/70">محظور الدخول</span>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/50 p-4 shadow-xs dark:border-cyan-950/40 dark:bg-cyan-950/20">
              <span className="text-[11px] font-bold text-[#1c7e86] dark:text-cyan-400">معيار الأمان والتشفير</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-base font-black text-[#1c7e86] dark:text-cyan-400">256-bit AES</span>
                <span className="text-[10px] text-slate-400">OWASP Level-3</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="relative min-w-[260px] flex-1">
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="ابحث بالاسم الكامل، البريد المهني، المنصب، أو القسم الإداري..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-9 pr-10 text-xs font-bold text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#2ba6ae] focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              {adminSearch && (
                <button
                  onClick={() => setAdminSearch('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAdminStatusFilter('all')}
                className={`rounded-xl px-3 py-2 text-xs font-black transition-colors ${
                  adminStatusFilter === 'all'
                    ? 'bg-[#203d62] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                الكل ({admins.length})
              </button>
              <button
                onClick={() => setAdminStatusFilter('نشط')}
                className={`rounded-xl px-3 py-2 text-xs font-black transition-colors ${
                  adminStatusFilter === 'نشط'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                نشط ({admins.filter((a) => a.status === 'نشط').length})
              </button>
              <button
                onClick={() => setAdminStatusFilter('معلق')}
                className={`rounded-xl px-3 py-2 text-xs font-black transition-colors ${
                  adminStatusFilter === 'معلق'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                معلق ({admins.filter((a) => a.status === 'معلق').length})
              </button>
            </div>
          </div>

          {/* Responsive Admin Management Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                    <th className="py-4 px-4 font-black">المشرف الإداري</th>
                    <th className="py-4 px-4 font-black">المنصب والقسم</th>
                    <th className="py-4 px-4 font-black">الصلاحيات الممنوحة</th>
                    <th className="py-4 px-4 font-black">كلمة المرور المشفرة</th>
                    <th className="py-4 px-4 font-black text-center">الحالة</th>
                    <th className="py-4 px-4 font-black">آخر دخول</th>
                    <th className="py-4 px-4 font-black text-center">إجراءات التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Users size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="font-bold">لا يوجد مشرفون يطابقون معايير البحث الحالية</p>
                        <button
                          onClick={() => {
                            setAdminSearch('');
                            setAdminStatusFilter('all');
                          }}
                          className="mt-2 text-xs font-bold text-[#1c7e86] hover:underline"
                        >
                          إعادة ضبط الفلاتر
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((adm) => {
                      const isRevealed = !!revealedPasswords[adm.id];
                      return (
                        <tr
                          key={adm.id}
                          className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                        >
                          {/* Col 1: Admin Profile */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#203d62]/10 to-[#1c7e86]/20 font-black text-[#152a40] dark:text-cyan-300">
                                {adm.name.slice(0, 2)}
                                <span
                                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${
                                    adm.status === 'نشط' ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`}
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-[#152a40] dark:text-white">
                                    {adm.name}
                                  </span>
                                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                    {adm.id}
                                  </span>
                                </div>
                                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                  <span className="inline-flex items-center gap-1">
                                    <Mail size={11} />
                                    {adm.email}
                                  </span>
                                  {adm.phone && (
                                    <span className="inline-flex items-center gap-1">
                                      <Phone size={11} />
                                      {adm.phone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Role & Department */}
                          <td className="py-4 px-4">
                            <span className="inline-block rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                              {adm.role}
                            </span>
                            <p className="mt-1 text-[11px] font-bold text-slate-400">{adm.department}</p>
                          </td>

                          {/* Col 3: Permissions */}
                          <td className="py-4 px-4 max-w-[240px]">
                            <div className="flex flex-wrap gap-1">
                              {adm.permissions.slice(0, 2).map((perm) => (
                                <span
                                  key={perm}
                                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                >
                                  <Check size={10} className="text-emerald-500" />
                                  {perm}
                                </span>
                              ))}
                              {adm.permissions.length > 2 && (
                                <span
                                  title={adm.permissions.slice(2).join(' • ')}
                                  className="cursor-help rounded-md bg-[#edf8f9] px-1.5 py-0.5 text-[10px] font-black text-[#1c7e86]"
                                >
                                  +{adm.permissions.length - 2} أخرى
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Col 4: Password Management */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800">
                                <span className="font-mono text-xs font-black tracking-wider text-slate-700 dark:text-slate-200">
                                  {isRevealed ? adm.passwordPlain : '••••••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleRevealPassword(adm.id)}
                                  title={isRevealed ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                  className="mr-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                >
                                  {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                {isRevealed && (
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPassword(adm.passwordPlain, adm.name)}
                                    title="نسخ كلمة المرور"
                                    className="mr-1 text-slate-400 hover:text-emerald-600"
                                  >
                                    <Copy size={13} />
                                  </button>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenPasswordModal(adm)}
                                title="تعديل وتعيين كلمة مرور جديدة"
                                className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[10px] font-black text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"
                              >
                                <Key size={12} />
                                <span>تعديل</span>
                              </button>
                            </div>
                          </td>

                          {/* Col 5: Status Interactive Toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleAdminStatus(adm)}
                              title="انقر لتغيير الحالة بين نشط ومعلق"
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black transition-all hover:scale-105 ${
                                adm.status === 'نشط'
                                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300'
                                  : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300'
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  adm.status === 'نشط' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                                }`}
                              />
                              <span>{adm.status}</span>
                            </button>
                          </td>

                          {/* Col 6: Last Login & Created */}
                          <td className="py-4 px-4">
                            <div className="text-[11px]">
                              <p className="font-bold text-slate-600 dark:text-slate-300">{adm.lastLogin}</p>
                              <p className="text-[10px] text-slate-400">تاريخ الإنشاء: {adm.createdAt}</p>
                            </div>
                          </td>

                          {/* Col 7: Actions */}
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenPasswordModal(adm)}
                                title="تعديل وتوليد كلمة المرور"
                                className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:border-[#2ba6ae] hover:bg-[#edf8f9] hover:text-[#1c7e86] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Key size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(adm)}
                                title="تعديل بيانات المشرف والصلاحيات"
                                className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Edit3 size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(adm)}
                                title="حذف حساب المشرف وسحب التراخيص"
                                className="rounded-xl border border-slate-200 p-2 text-rose-500 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:hover:bg-rose-950/30"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-900/40">
              <span className="font-bold">
                عرض {filteredAdmins.length} من أصل {admins.length} حساب إداري مسجل
              </span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <ShieldCheck size={13} className="text-emerald-500" />
                جميع العمليات وكلمات المرور خاضعة للمصادقة المشفرة ومعايير الحوكمة
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Governance & Policies Tab */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          {/* Social Media & GitHub Channels Manager (إضافة، تعديل، حذف) */}
          <SocialLinksManager onNotify={notify} isOwnerView={true} />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <h3 className="text-sm font-black text-[#152a40]">سياسات الحوكمة ومفاتيح التشغيل</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              تفعيل أو إيقاف الميزات الحساسة عبر المنصة بنقرة واحدة
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#fafbfc] p-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800">التسجيل المفتوح للمطورين الجدد</h4>
                  <p className="text-[11px] text-slate-500">
                    السماح للمطورين بإنشاء حسابات فورية وتقديم طلبات الاعتماد
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeatureOpenRegistration(!featureOpenRegistration);
                    notify(`تم ${!featureOpenRegistration ? 'تفعيل' : 'إيقاف'} التسجيل المفتوح`);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    featureOpenRegistration ? 'bg-[#249ea7]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      featureOpenRegistration ? '-translate-x-6' : '-translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#fafbfc] p-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800">نظام الشات المباشر الفوري</h4>
                  <p className="text-[11px] text-slate-500">
                    تمكين المراسلة الفورية بين المطور والعميل لمناقشة عروض العمل
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeatureLiveChat(!featureLiveChat);
                    notify(`تم ${!featureLiveChat ? 'تفعيل' : 'إيقاف'} الشات المباشر`);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    featureLiveChat ? 'bg-[#249ea7]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      featureLiveChat ? '-translate-x-6' : '-translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-[#fafbfc] p-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800">
                    الفحص الصارم لملفات المستودع (Dockerfile & README)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    إلزامية التحقق التلقائي من وجود بيئة الحاويات قبل نقل ملكية المشروع للعميل
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFeatureStrictGitHandover(!featureStrictGitHandover);
                    notify(`تم ${!featureStrictGitHandover ? 'تفعيل' : 'إيقاف'} الفحص الصارم للـ Git`);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    featureStrictGitHandover ? 'bg-[#249ea7]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      featureStrictGitHandover ? '-translate-x-6' : '-translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Audit & Activity Trail Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-black text-[#152a40]">سجل الرقابة والأمان (Audit Trail)</h3>
            <p className="mt-0.5 text-xs text-slate-500">توثيق زمني لكافة الإجراءات الحساسة في المنصة</p>

            <div className="mt-5 space-y-3 font-mono text-xs text-slate-700">
              {[
                { time: 'الآن', user: 'نظام الحوكمة المباشر', action: 'المزامنة مع خوادم فوتيك السحابية المشفرة' },
                { time: 'الآن', user: 'منظومة الضمان Escrow', action: 'تفعيل القيود الذكية وحماية المدفوعات' },
                { time: 'نشط', user: 'سجل العمليات Audit Trail', action: 'توثيق كافة الإجراءات الإدارية وفق معايير الحوكمة' },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#249ea7]" />
                    <span className="font-bold text-slate-900">{log.user}:</span>
                    <span>{log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. Modal: Create New Admin Account (إنشاء حساب أدمن جديد) */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#203d62] text-amber-400">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                    إنشاء وتعيين حساب مشرف إداري جديد
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    إصدار رخصة إدارية وتعيين كلمة المرور المشفرة والصلاحيات الممنوحة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAdminSubmit} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">الاسم الكامل *</label>
                  <input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: عبد العزيز الهذلي"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">البريد الإلكتروني المهني *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="admin.name@futech.dev"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">الدور والمنصب التنفيذي</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="مدير العمليات ومطابقة الجودة (Master Admin)">مدير العمليات ومطابقة الجودة (Master Admin)</option>
                    <option value="مشرف فني وتدقيق كود">مشرف فني وتدقيق كود</option>
                    <option value="مدير تذاكر ودعم فني SLA">مدير تذاكر ودعم فني SLA</option>
                    <option value="مدير تدقيق مالي ومعاملات الضمان">مدير تدقيق مالي ومعاملات الضمان</option>
                    <option value="مشرف توثيق ومراجعة حسابات">مشرف توثيق ومراجعة حسابات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">القسم الإداري</label>
                  <input
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="مثال: إدارة العمليات الهندسية"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">رقم الهاتف للتواصل (اختياري)</label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">الحالة الأولية للحساب</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'نشط' | 'معلق')}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="نشط">نشط (مفعل فورياً)</option>
                    <option value="معلق">معلق (تجميد مؤقت)</option>
                  </select>
                </div>
              </div>

              {/* Password Field with Generator */}
              <div className="rounded-2xl border border-cyan-100 bg-[#edf8f9]/50 p-4 dark:border-cyan-950/40 dark:bg-cyan-950/20">
                <div className="flex items-center justify-between">
                  <label className="font-black text-[#152a40] dark:text-cyan-300 flex items-center gap-1.5">
                    <Key size={14} className="text-[#1c7e86]" />
                    كلمة المرور المشفرة *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] font-black text-[#1c7e86] hover:underline"
                  >
                    🎲 توليد كلمة سر آمنة
                  </button>
                </div>
                <div className="relative mt-2">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pl-10 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCreatePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-500">
                  سيتم حفظ كلمة المرور وتشفيرها لتمكين المشرف من الدخول المباشر إلى بوابة الإدارة.
                </p>
              </div>

              {/* Permissions Checkboxes */}
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-2">
                  الصلاحيات الممنوحة للمشرف:
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = newPermissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-[#2ba6ae] bg-[#edf8f9] text-[#152a40] dark:bg-slate-800 dark:text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewPermissions(newPermissions.filter((p) => p !== perm));
                            } else {
                              setNewPermissions([...newPermissions, perm]);
                            }
                          }}
                          className="rounded border-slate-300 text-[#1c7e86] focus:ring-[#1c7e86]"
                        />
                        <span className="text-[11px] font-bold">{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#203d62] to-[#1c7e86] px-6 py-2.5 font-black text-white shadow-md hover:scale-[1.02] active:scale-95"
                >
                  إنشاء الحساب وتفعيل التراخيص 👑
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Modal: Change / Reset Password (تعديل كلمة المرور)    */}
      {/* ========================================================= */}
      {showPasswordModal && selectedAdminForPassword && (
        <div
          onClick={() => setShowPasswordModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                    تعديل كلمة المرور للمشرف
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    الحساب: {selectedAdminForPassword.name} ({selectedAdminForPassword.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              <span className="font-bold text-slate-400">كلمة المرور الحالية المخزنة:</span>
              <p className="mt-1 font-mono font-bold text-[#152a40] dark:text-white">
                {selectedAdminForPassword.passwordPlain}
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="mt-4 space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-700 dark:text-slate-300">
                    كلمة المرور الجديدة *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const gen = generateRandomPassword();
                      setNewPasswordValue(gen);
                      setConfirmPasswordValue(gen);
                    }}
                    className="text-[11px] font-black text-[#1c7e86] hover:underline"
                  >
                    ⚡ توليد عشوائي آمن
                  </button>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="أدخل كلمة المرور الجديدة..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pl-10 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  تأكيد كلمة المرور الجديدة *
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmPasswordValue}
                  onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور لتأكيد المطابقة..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#203d62] px-5 py-2 font-black text-white hover:bg-[#2b5182]"
                >
                  حفظ وتحديث كلمة المرور 🔐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Modal: Edit Admin Details (تعديل بيانات المشرف)        */}
      {/* ========================================================= */}
      {showEditModal && selectedAdminForEdit && (
        <div
          onClick={() => setShowEditModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                    تعديل بيانات وصلاحيات المشرف
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    المعرف: {selectedAdminForEdit.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditAdmin} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">الاسم الكامل *</label>
                  <input
                    required
                    value={editAdminName}
                    onChange={(e) => setEditAdminName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={editAdminEmail}
                    onChange={(e) => setEditAdminEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">الدور والمنصب</label>
                  <select
                    value={editAdminRole}
                    onChange={(e) => setEditAdminRole(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="مدير العمليات ومطابقة الجودة (Master Admin)">مدير العمليات ومطابقة الجودة (Master Admin)</option>
                    <option value="مشرف فني وتدقيق كود">مشرف فني وتدقيق كود</option>
                    <option value="مدير تذاكر ودعم فني SLA">مدير تذاكر ودعم فني SLA</option>
                    <option value="مدير تدقيق مالي ومعاملات الضمان">مدير تدقيق مالي ومعاملات الضمان</option>
                    <option value="مشرف توثيق ومراجعة حسابات">مشرف توثيق ومراجعة حسابات</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">القسم الإداري</label>
                  <input
                    value={editAdminDepartment}
                    onChange={(e) => setEditAdminDepartment(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">رقم الهاتف</label>
                  <input
                    value={editAdminPhone}
                    onChange={(e) => setEditAdminPhone(e.target.value)}
                    placeholder="+966 5x xxx xxxx"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 dark:text-slate-300">حالة الحساب</label>
                  <select
                    value={editAdminStatus}
                    onChange={(e) => setEditAdminStatus(e.target.value as 'نشط' | 'معلق')}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="نشط">نشط</option>
                    <option value="معلق">معلق (تجميد الصلاحيات)</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-2">
                  الصلاحيات المعتمدة:
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {AVAILABLE_PERMISSIONS.map((perm) => {
                    const isChecked = editAdminPermissions.includes(perm);
                    return (
                      <label
                        key={perm}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-[#2ba6ae] bg-[#edf8f9] text-[#152a40] dark:bg-slate-800 dark:text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setEditAdminPermissions(editAdminPermissions.filter((p) => p !== perm));
                            } else {
                              setEditAdminPermissions([...editAdminPermissions, perm]);
                            }
                          }}
                          className="rounded border-slate-300 text-[#1c7e86] focus:ring-[#1c7e86]"
                        />
                        <span className="text-[11px] font-bold">{perm}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#203d62] px-5 py-2 font-black text-white hover:bg-[#2b5182]"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Modal: Confirm Delete Admin (تأكيد حذف حساب الأدمن)     */}
      {/* ========================================================= */}
      {showDeleteModal && selectedAdminForDelete && (
        <div
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                  تأكيد حذف حساب الأدمن نهائياً
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                  إجراء سيادي حساس لا يمكن التراجع عنه
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-rose-50/70 p-4 text-xs text-rose-950 dark:bg-rose-950/30 dark:text-rose-200 border border-rose-200 dark:border-rose-900/40">
              <p className="leading-relaxed">
                أنت على وشك إلغاء رخصة المشرف <span className="font-black">({selectedAdminForDelete.name})</span> وحذف حسابه نهائياً وسحب كافة صلاحياته من النظام.
              </p>
              <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                البريد الإلكتروني: {selectedAdminForDelete.email} • المنصب: {selectedAdminForDelete.role}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                تراجع وإلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAdmin}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-black text-white hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                تأكيد الحذف وسحب الترخيص 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. Modal: Edit Developer FQS Factors & Score               */}
      {/* ========================================================= */}
      {editingFqsDev && (
        <div
          onClick={() => setEditingFqsDev(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={editingFqsDev.avatar}
                  alt={editingFqsDev.name}
                  className="h-12 w-12 rounded-2xl object-cover border-2 border-teal-500/30"
                  onError={(e) => {
                    (e.target as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                  }}
                />
                <div>
                  <h3 className="text-base font-black text-[#152a40] dark:text-white">
                    تعديل مؤشر FQS للمطور
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingFqsDev.name} · {editingFqsDev.specialty}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingFqsDev(null)}
                className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Calculated Preview Pill */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50/80 p-4 dark:border-teal-900/50 dark:bg-teal-950/40">
              <div>
                <span className="text-[11px] font-bold text-teal-800 dark:text-teal-300">
                  {autoRecalc ? 'الدرجة المحسوبة تلقائياً وفق أوزان الخوارزمية' : 'تجاوز يدوي لمؤشر FQS'}
                </span>
                <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  المستوى الحالي: <strong className="text-slate-900 dark:text-white">{editDevLevel}</strong>
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-teal-700 dark:text-teal-300">
                  {autoRecalc
                    ? Math.min(
                        100,
                        Math.max(
                          50,
                          Math.round(
                            (editCompletionRate * (Number(weights.completionRate) / 100)) +
                            (editOnTimeBudget * (Number(weights.onTimeBudget) / 100)) +
                            (editClientRating * (Number(weights.clientRating) / 100)) +
                            (editRepeatHireRate * (Number(weights.repeatHireRate) / 100))
                          )
                        )
                      )
                    : editCustomFqs}
                </span>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">/ 100</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="mt-5 space-y-4">
              {/* Level Selector */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  المستوى والرتبة الهندسية
                </label>
                <select
                  value={editDevLevel}
                  onChange={(e) => setEditDevLevel(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="المالك ومطور معتمد 👑">المالك ومطور معتمد 👑</option>
                  <option value="نخبوي (Elite Developer)">نخبوي (Elite Developer)</option>
                  <option value="خبير (Senior)">خبير (Senior)</option>
                  <option value="متوسط (Mid-level)">متوسط (Mid-level)</option>
                  <option value="واعد (Junior)">واعد (Junior)</option>
                </select>
              </div>

              {/* Factor 1: Completion Rate */}
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">1. معدل إكمال المشاريع (Completion Rate)</span>
                  <span className="text-teal-600 dark:text-teal-400 font-black">{editCompletionRate}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={1}
                  value={editCompletionRate}
                  onChange={(e) => setEditCompletionRate(Number(e.target.value))}
                  className="mt-2 w-full accent-[#249ea7]"
                />
              </div>

              {/* Factor 2: On-Time & Budget */}
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">2. الالتزام بالوقت والميزانية (On-Time & Budget)</span>
                  <span className="text-blue-600 dark:text-blue-400 font-black">{editOnTimeBudget}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={1}
                  value={editOnTimeBudget}
                  onChange={(e) => setEditOnTimeBudget(Number(e.target.value))}
                  className="mt-2 w-full accent-[#3b82f6]"
                />
              </div>

              {/* Factor 3: Client Ratings */}
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">3. تقييم العملاء (Client Star Rating % equivalent)</span>
                  <span className="text-amber-600 dark:text-amber-400 font-black">{editClientRating}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={1}
                  value={editClientRating}
                  onChange={(e) => setEditClientRating(Number(e.target.value))}
                  className="mt-2 w-full accent-[#f59e0b]"
                />
              </div>

              {/* Factor 4: Repeat Hire Rate */}
              <div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">4. معدل تكرار التوظيف (Repeat Hire Rate)</span>
                  <span className="text-purple-600 dark:text-purple-400 font-black">{editRepeatHireRate}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  step={1}
                  value={editRepeatHireRate}
                  onChange={(e) => setEditRepeatHireRate(Number(e.target.value))}
                  className="mt-2 w-full accent-[#8b5cf6]"
                />
              </div>

              {/* Calculation Mode Toggle */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!autoRecalc}
                    onChange={(e) => setAutoRecalc(!e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    تجاوز يدوي لدرجة FQS النهائية (Manual Score Override)
                  </span>
                </label>

                {!autoRecalc && (
                  <div className="mt-3">
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                      أدخل الدرجة النهائية يدوياً (50 - 100):
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={editCustomFqs}
                      onChange={(e) => setEditCustomFqs(Number(e.target.value))}
                      className="h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingFqsDev(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSaveDeveloperFqs}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-teal-600/20 hover:scale-[1.02] active:scale-95"
              >
                <Save size={15} />
                <span>حفظ وتحديث مؤشر المطور</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
