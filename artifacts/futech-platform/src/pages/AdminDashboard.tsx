import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings2, Users, Briefcase, TicketCheck, BookOpen, Plus,
  Search, CheckCircle2, X, Pencil, Trash2, Send, ShieldCheck,
  BadgeCheck, Star, Filter, Eye, AlertCircle, Sparkles, Crown,
  Clock, Tag, Copy, Check, FileText, Code2, ExternalLink, ArrowLeft,
  ChevronDown, Layers, Terminal, CheckCircle, RefreshCw, ThumbsUp,
  TrendingUp, Activity, BarChart3, Sliders
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
import { Store, Project, Developer, Ticket, Doc, TicketAttachment } from '../types';
import { TerminalConsole, TicketAttachmentViewer } from '../components/TicketSupportWidgets';
import { getDeveloperCurrency } from '../data/countries';
import { getVisitorAnalytics, VisitorAnalytics } from '../lib/visitorTracking';
import { SocialLinksManager } from '../components/SocialLinksManager';

interface AdminDashboardProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  setModal?: (modal: any) => void;
  go?: (path: string) => void;
  currentUser?: any;
}

export function AdminDashboard({
  store,
  update,
  notify,
  setModal,
  go,
  currentUser,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<'overview' | 'developers' | 'projects' | 'tickets' | 'docs'>('docs');
  
  // Real Platform Traffic & Visitor Tracking (Exclusive to Admin & Owner)
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalytics>(() => getVisitorAnalytics());

  useEffect(() => {
    setVisitorAnalytics(getVisitorAnalytics());
    const interval = setInterval(() => {
      setVisitorAnalytics(getVisitorAnalytics());
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Tickets State
  const [ticketStatus, setTicketStatus] = useState<string>('all');
  const [ticketSearch, setTicketSearch] = useState<string>('');
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [ticketReply, setTicketReply] = useState<string>('');

  // Developers State
  const [devSearch, setDevSearch] = useState<string>('');

  // Projects State
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');

  // Documentation Management State
  const [docSearch, setDocSearch] = useState<string>('');
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('all');
  const [selectedDocForReader, setSelectedDocForReader] = useState<Doc | null>(null);
  const [editingDoc, setEditingDoc] = useState<Doc | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Editor Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Doc['category']>('معيار FQS وجودة الشيفرة');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formReadingTime, setFormReadingTime] = useState('4 دقائق');
  const [formCodeExample, setFormCodeExample] = useState('');

  // Computed real platform stats from live store
  const totalProjects = store.projects.length;
  const totalDevelopers = store.developers.length;
  const openTickets = store.tickets.filter((t) => t.status !== 'مغلق').length;

  // Real Documentation Stats (Dynamic, not mock)
  const totalDocViews = useMemo(() => {
    return store.docs.reduce((sum, d) => sum + (d.views || 0), 0);
  }, [store.docs]);

  const totalDocVotes = useMemo(() => {
    return store.docs.reduce((sum, d) => sum + (d.helpfulVotes || 0), 0);
  }, [store.docs]);

  const avgReadingTimeMinutes = useMemo(() => {
    if (store.docs.length === 0) return 0;
    const total = store.docs.reduce((acc, d) => {
      const raw = d.readingTime || '';
      const normalized = raw.replace(/[٠-٩]/g, (char) => '٠١٢٣٤٥٦٧٨٩'.indexOf(char).toString());
      const match = normalized.match(/\d+(\.\d+)?/);
      return acc + (match ? parseFloat(match[0]) : 4);
    }, 0);
    return Number((total / store.docs.length).toFixed(1));
  }, [store.docs]);

  // Real Platform Overview Stats (Calculated from actual developers & reviews)
  const activeDevsWithFqs = useMemo(() => {
    return store.developers.filter((d) => (d.fqs || 0) > 0);
  }, [store.developers]);

  const avgFqs = useMemo(() => {
    if (activeDevsWithFqs.length === 0) return 0;
    const sum = activeDevsWithFqs.reduce((acc, d) => acc + (d.fqs || 0), 0);
    return Math.round(sum / activeDevsWithFqs.length);
  }, [activeDevsWithFqs]);

  const allReviews = useMemo(() => {
    return store.developers.flatMap((d) => d.reviews || []);
  }, [store.developers]);

  const clientSatisfaction = useMemo(() => {
    if (allReviews.length === 0) return null;
    const sum = allReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = sum / allReviews.length;
    return {
      percent: Math.round((avg / 5) * 100),
      count: allReviews.length,
      avgRating: avg.toFixed(1),
    };
  }, [allReviews]);

  // Visual Analytics Chart Data for Admin Overview (100% Real from live store)
  const platformGrowthData = useMemo(() => {
    const currentProjects = store.projects.length;
    const currentDevs = store.developers.length;
    return [
      {
        month: 'الوضع الفعلي الحالي',
        newProjects: currentProjects,
        newDevs: currentDevs,
        totalEngagements: currentProjects + currentDevs,
      },
    ];
  }, [store.projects, store.developers]);

  const ticketsCategoryChartData = useMemo(() => {
    const cats: Record<string, { resolved: number; inProgress: number }> = {
      'خلل برمجي وصيانة': { resolved: 0, inProgress: 0 },
      'فحص أمان OWASP': { resolved: 0, inProgress: 0 },
      'تسليم Git ومستودعات': { resolved: 0, inProgress: 0 },
      'استفسارات مالية وضمان': { resolved: 0, inProgress: 0 },
    };

    store.tickets.forEach((t) => {
      let key = 'خلل برمجي وصيانة';
      const c = (t.category || '') + ' ' + (t.subject || '');
      if (c.includes('أمان') || c.includes('OWASP') || c.includes('security')) key = 'فحص أمان OWASP';
      else if (c.includes('Git') || c.includes('كود') || c.includes('تسليم')) key = 'تسليم Git ومستودعات';
      else if (c.includes('مالي') || c.includes('ضمان') || c.includes('escrow')) key = 'استفسارات مالية وضمان';

      if (t.status === 'مغلق' || t.status === 'تم الحل') {
        cats[key].resolved++;
      } else {
        cats[key].inProgress++;
      }
    });

    return Object.entries(cats).map(([category, counts]) => ({
      category,
      resolved: counts.resolved, // Strictly real count!
      inProgress: counts.inProgress, // Strictly real count!
    }));
  }, [store.tickets]);

  const docsEngagementChartData = useMemo(() => {
    const cats: Record<string, { views: number; votes: number }> = {
      'معيار FQS': { views: 0, votes: 0 },
      'تسليم Git': { views: 0, votes: 0 },
      'ضمان SLA': { views: 0, votes: 0 },
      'دليل المشاريع': { views: 0, votes: 0 },
      'أمان وحماية': { views: 0, votes: 0 },
    };

    store.docs.forEach((d) => {
      let key = 'معيار FQS';
      const c = d.category || '';
      if (c.includes('FQS')) key = 'معيار FQS';
      else if (c.includes('تسليم') || c.includes('مستودعات')) key = 'تسليم Git';
      else if (c.includes('الدعم') || c.includes('الضمان')) key = 'ضمان SLA';
      else if (c.includes('دليل')) key = 'دليل المشاريع';
      else if (c.includes('الأمان')) key = 'أمان وحماية';

      cats[key].views += d.views || 0;
      cats[key].votes += d.helpfulVotes || 0;
    });

    return Object.entries(cats).map(([name, data]) => ({
      name,
      views: data.views,
      votes: data.votes,
    }));
  }, [store.docs]);

  const projectsLifecycleChartData = useMemo(() => {
    const available = store.projects.filter((p) => p.status === 'متاح').length;
    const inProgress = store.projects.filter((p) => p.status === 'قيد التنفيذ').length;
    const completed = store.projects.filter((p) => p.status === 'مكتمل').length;
    const pendingHandovers = store.projects.filter((p) => p.assignedDeveloperId).length;

    return [
      { name: 'متاح للتقديم', value: available, color: '#0d9488' },
      { name: 'قيد التنفيذ بالضمان', value: inProgress, color: '#3b82f6' },
      { name: 'تسليم ومراجعة Git', value: pendingHandovers, color: '#8b5cf6' },
      { name: 'مكتمل ومعتمد SLA', value: completed, color: '#10b981' },
    ];
  }, [store.projects]);

  // Filtered tickets
  const filteredTickets = store.tickets.filter((t) => {
    const matchesStatus = ticketStatus === 'all' || t.status === ticketStatus;
    const matchesSearch =
      !ticketSearch.trim() ||
      t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.owner.toLowerCase().includes(ticketSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered developers
  const filteredDevs = store.developers.filter((d) => {
    return (
      !devSearch.trim() ||
      d.name.toLowerCase().includes(devSearch.toLowerCase()) ||
      d.specialty.toLowerCase().includes(devSearch.toLowerCase())
    );
  });

  // Filtered Documentation
  const filteredDocs = useMemo(() => {
    return store.docs.filter((doc) => {
      const matchesCategory = docCategoryFilter === 'all' || doc.category === docCategoryFilter;
      const searchLower = docSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        doc.title.toLowerCase().includes(searchLower) ||
        (doc.summary && doc.summary.toLowerCase().includes(searchLower)) ||
        doc.content.toLowerCase().includes(searchLower) ||
        (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchLower)));
      return matchesCategory && matchesSearch;
    });
  }, [store.docs, docCategoryFilter, docSearch]);

  // Categories list with counts
  const categoriesList = [
    { id: 'all', label: 'الكل', count: store.docs.length },
    { id: 'معيار FQS وجودة الشيفرة', label: 'معيار FQS', count: store.docs.filter((d) => d.category === 'معيار FQS وجودة الشيفرة').length },
    { id: 'تسليم الكود والمستودعات', label: 'تسليم الكود Git', count: store.docs.filter((d) => d.category === 'تسليم الكود والمستودعات').length },
    { id: 'الدعم المستمر والضمان', label: 'الدعم والضمان SLA', count: store.docs.filter((d) => d.category === 'الدعم المستمر والضمان').length },
    { id: 'دليل أصحاب المشاريع', label: 'دليل أصحاب المشاريع', count: store.docs.filter((d) => d.category === 'دليل أصحاب المشاريع').length },
    { id: 'الأمان وأدوات فوتيك', label: 'الأمان والحماية', count: store.docs.filter((d) => d.category === 'الأمان وأدوات فوتيك').length },
  ];

  // Open Doc Editor for Creating New Doc
  const handleOpenCreateDoc = () => {
    setEditingDoc(null);
    setFormTitle('');
    setFormCategory('معيار FQS وجودة الشيفرة');
    setFormSummary('');
    setFormContent('');
    setFormTags('FQS, معايير, كود_نظيف');
    setFormReadingTime('4 دقائق');
    setFormCodeExample('');
    setIsEditorOpen(true);
  };

  // Open Doc Editor for Modifying Existing Doc
  const handleOpenEditDoc = (doc: Doc) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormSummary(doc.summary || '');
    setFormContent(doc.content);
    setFormTags((doc.tags || []).join(', '));
    setFormReadingTime(doc.readingTime || '4 دقائق');
    setFormCodeExample(doc.codeExample || '');
    setIsEditorOpen(true);
  };

  // Save Doc (Create or Edit)
  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      notify('يرجى كتابة عنوان الوثيقة ومحتواها على الأقل');
      return;
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingDoc) {
      // Update existing
      const updatedDocs = store.docs.map((d) =>
        d.id === editingDoc.id
          ? {
              ...d,
              title: formTitle.trim(),
              category: formCategory,
              summary: formSummary.trim() || formContent.slice(0, 140) + '...',
              content: formContent.trim(),
              tags: tagsArray,
              readingTime: formReadingTime.trim(),
              codeExample: formCodeExample.trim() || undefined,
              updatedAt: 'اليوم',
            }
          : d
      );
      update('docs', updatedDocs);
      notify(`تم تحديث وثيقة "${formTitle}" بنجاح!`);
    } else {
      // Create new
      const newDoc: Doc = {
        id: 'doc-' + Math.random().toString(36).substring(2, 9),
        title: formTitle.trim(),
        category: formCategory,
        summary: formSummary.trim() || formContent.slice(0, 140) + '...',
        content: formContent.trim(),
        tags: tagsArray,
        readingTime: formReadingTime.trim(),
        codeExample: formCodeExample.trim() || undefined,
        updatedAt: 'الآن',
      };
      update('docs', [newDoc, ...store.docs]);
      notify(`تمت إضافة وثيقة جديدة: "${newDoc.title}"`);
    }

    setIsEditorOpen(false);
  };

  // Open Doc Reader & Increment Real View Count
  const handleOpenDocReader = (doc: Doc) => {
    setSelectedDocForReader(doc);
    const updatedDocs = store.docs.map((d) =>
      d.id === doc.id ? { ...d, views: (d.views || 0) + 1 } : d
    );
    update('docs', updatedDocs);
  };

  // Vote on Doc Helpful status
  const handleVoteDoc = (docId: string, isHelpful: boolean) => {
    const updatedDocs = store.docs.map((d) => {
      if (d.id === docId) {
        return {
          ...d,
          helpfulVotes: (d.helpfulVotes || 0) + (isHelpful ? 1 : 0),
        };
      }
      return d;
    });
    update('docs', updatedDocs);
    if (selectedDocForReader?.id === docId) {
      setSelectedDocForReader((prev) =>
        prev ? { ...prev, helpfulVotes: (prev.helpfulVotes || 0) + (isHelpful ? 1 : 0) } : null
      );
    }
    notify(isHelpful ? 'تم تسجيل تصويتك الإيجابي بنجاح! 👍' : 'شكراً لملاحظتك، سيتم العمل على تحسين الوثيقة.');
  };

  // Delete Doc
  const handleDeleteDoc = (docId: string, title: string) => {
    if (confirm(`هل أنت متأكد من حذف الوثيقة: "${title}"؟`)) {
      update(
        'docs',
        store.docs.filter((d) => d.id !== docId)
      );
      notify(`تم حذف الوثيقة بنجاح`);
    }
  };

  // Handle ticket reply
  const handleSendTicketReply = () => {
    if (!ticketReply.trim() || !activeTicket) return;
    const updated = store.tickets.map((t) =>
      t.id === activeTicket.id
        ? {
            ...t,
            status: 'قيد المعالجة' as const,
            replies: [...(t.replies || []), ticketReply.trim()],
          }
        : t
    );
    update('tickets', updated);
    setActiveTicket((prev) =>
      prev ? { ...prev, status: 'قيد المعالجة', replies: [...(prev.replies || []), ticketReply.trim()] } : null
    );
    setTicketReply('');
    notify('تم إرسال الرد وتحديث حالة التذكرة');
  };

  // Toggle ticket status
  const handleToggleTicketStatus = (t: Ticket, newStatus: 'مفتوح' | 'قيد المعالجة' | 'مغلق') => {
    const updated = store.tickets.map((item) =>
      item.id === t.id ? { ...item, status: newStatus } : item
    );
    update('tickets', updated);
    if (activeTicket?.id === t.id) {
      setActiveTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    notify(`تم تغيير حالة التذكرة إلى: ${newStatus}`);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع نهائيًا؟')) {
      update('projects', store.projects.filter((p) => p.id !== id));
      notify('تم حذف المشروع بنجاح');
    }
  };

  // Toggle developer verification
  const handleToggleDevVerify = (dev: Developer) => {
    const updated = store.developers.map((d) =>
      d.id === dev.id ? { ...d, verified: !d.verified } : d
    );
    update('developers', updated);
    notify(dev.verified ? `تم إلغاء توثيق ${dev.name}` : `تم توثيق ${dev.name} كـ مطور معتمد`);
  };

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'معيار FQS وجودة الشيفرة':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'تسليم الكود والمستودعات':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800';
      case 'الدعم المستمر والضمان':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'دليل أصحاب المشاريع':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'الأمان وأدوات فوتيك':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Executive Hero Banner & Header */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-[#eef6f8] p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0c1524] dark:via-[#09111e] dark:to-[#070e1b]">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-black text-teal-700 dark:text-teal-300">
                <ShieldCheck size={14} className="text-teal-500" />
                <span>مركز الإدارة والرقابة الهندسية</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>الخادم السحابي: متصل ومستقر (خوادم فوتيك السحابية المشفرة)</span>
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-black text-[#14283d] sm:text-3xl dark:text-white">
              لوحة إدارة المنصة ومطابقة الجودة (FQS)
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              الإشراف على المشاريع البرمجية، اعتماد الكفاءات، مراجعة الوثائق المرجعية، وضمان معايير التسليم والنزاعات.
            </p>
          </div>

          {/* Quick Executive Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            {go && (
              <button
                type="button"
                onClick={() => go('/owner-dashboard')}
                className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-yellow-500/10 px-4 py-2.5 text-xs font-black text-amber-800 transition hover:bg-amber-500/20 active:scale-95 dark:text-amber-300 dark:border-amber-500/30"
              >
                <Crown size={15} className="text-amber-500 stroke-[2.5]" />
                <span>بوابة المالك التنفيذية 👑</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenCreateDoc}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] px-4 py-2.5 text-xs font-black text-white shadow-md shadow-[#14293f]/20 transition hover:opacity-95 active:scale-95 dark:from-teal-600 dark:via-teal-500 dark:to-cyan-500 dark:text-slate-950"
            >
              <Plus size={15} />
              <span>إضافة وثيقة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-800">
        {[
          { id: 'docs', label: `الوثائق التوثيقية (${store.docs.length})`, icon: BookOpen },
          { id: 'overview', label: 'نظرة عامة', icon: Settings2 },
          { id: 'developers', label: `المطورون (${store.developers.length})`, icon: Users },
          { id: 'projects', label: `المشاريع (${store.projects.length})`, icon: Briefcase },
          { id: 'tickets', label: `تذاكر الدعم (${openTickets})`, icon: TicketCheck },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition-all duration-200 ${
                isActive
                  ? 'bg-[#18314e] text-white shadow-md shadow-[#18314e]/20 dark:bg-teal-600 dark:text-slate-950'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          1. DOCS MANAGEMENT TAB (الوثائق الرسمية والمراجع)
      ======================================================== */}
      {tab === 'docs' && (
        <div className="space-y-6">
          {/* Top 4 Visual KPI Cards for Documentation */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الوثائق المنشورة</span>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <BookOpen size={16} />
                </span>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                {store.docs.length} <span className="text-xs font-bold text-slate-400">وثائق معتمدة</span>
              </div>
              <div className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {store.docs.length > 0 ? '100% محدثة وفق آخر إصدار' : 'لا توجد وثائق منشورة بعد'}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي القراءات والمشاهدات</span>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Eye size={16} />
                </span>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                {totalDocViews.toLocaleString('ar-EG')} <span className="text-xs font-bold text-slate-400">قراءة</span>
              </div>
              <div className="mt-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                {totalDocViews > 0 ? 'إجمالي القراءات الموثقة للوثائق' : 'بانتظار قراءات واطلاع الأعضاء'}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">تقييم الفائدة والوضوح</span>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Star size={16} />
                </span>
              </div>
              <div className="mt-3 text-2xl font-black text-amber-500">
                {totalDocVotes > 0 ? '100%' : 'قيد التقييم'}{' '}
                <span className="text-xs font-bold text-slate-400">رضا المطورين</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {totalDocVotes > 0
                  ? `بناءً على ${totalDocVotes} تصويت مفيد من الأعضاء`
                  : '0 تصويت (بانتظار تقييم الأعضاء)'}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">متوسط زمن الاستيعاب</span>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Clock size={16} />
                </span>
              </div>
              <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
                {avgReadingTimeMinutes > 0 ? avgReadingTimeMinutes : '—'}{' '}
                <span className="text-xs font-bold text-slate-400">دقيقة</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {avgReadingTimeMinutes > 0
                  ? `متوسط زمن القراءة لـ ${store.docs.length} وثائق معتمدة`
                  : 'لا توجد وثائق لحساب الزمن'}
              </div>
            </div>
          </div>

          {/* Search, Filter Pills & Add Button Bar */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs sm:p-5 dark:border-slate-800 dark:bg-[#0c1524]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Box */}
              <div className="relative min-w-[280px] flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="ابحث في عناوين ومحتوى الوثائق، أو الكلمات المفتاحية..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 pe-4 ps-10 text-xs font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                />
                {docSearch && (
                  <button
                    onClick={() => setDocSearch('')}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Action: Add New Document */}
              <button
                type="button"
                onClick={handleOpenCreateDoc}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 text-xs font-black text-white shadow-md shadow-teal-600/20 transition hover:opacity-95 active:scale-95"
              >
                <Plus size={16} />
                <span>إضافة وثيقة جديدة</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800/80">
              {categoriesList.map((cat) => {
                const isSelected = docCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDocCategoryFilter(cat.id)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                      isSelected
                        ? 'border-teal-500/40 bg-teal-50 text-teal-800 shadow-2xs dark:border-teal-400/40 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.2 text-[10px] font-black ${
                        isSelected
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Documents Grid */}
          {filteredDocs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5 dark:border-slate-800 dark:bg-[#0c1524] dark:hover:border-teal-500/30"
                >
                  <div>
                    {/* Top Meta Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-[10px] font-black ${getCategoryBadgeClass(
                          doc.category
                        )}`}
                      >
                        {doc.category}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <Clock size={12} />
                        <span>{doc.readingTime || '4 دقائق'}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3.5 text-sm font-black text-slate-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 transition-colors leading-snug">
                      {doc.title}
                    </h3>

                    {/* Excerpt / Summary */}
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                      {doc.summary || doc.content}
                    </p>

                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {doc.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Metadata and Action Buttons */}
                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                      <span>آخر تحديث: {doc.updatedAt}</span>
                      <div className="flex items-center gap-2">
                        {(doc.views || 0) > 0 && (
                          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
                            <Eye size={12} />
                            <span>{doc.views}</span>
                          </span>
                        )}
                        {doc.codeExample && (
                          <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold">
                            <Code2 size={13} />
                            <span>كود متاح</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Read Full Modal Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenDocReader(doc)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-xs font-black text-slate-800 transition hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                      >
                        <Eye size={14} />
                        <span>معاينة كاملة</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditDoc(doc)}
                        className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        title="تعديل الوثيقة"
                      >
                        <Pencil size={13} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteDoc(doc.id, doc.title)}
                        className="grid h-8 w-8 place-items-center rounded-xl border border-rose-200/60 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/40 dark:hover:bg-rose-950/40"
                        title="حذف الوثيقة"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-[#0c1524]">
              <BookOpen size={36} className="mx-auto text-slate-400" />
              <h4 className="mt-3 text-sm font-black text-slate-800 dark:text-white">
                لم يتم العثور على وثائق مطابقة
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                جرّب تعديل كلمات البحث أو اختيار تصنيف آخر.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDocSearch('');
                  setDocCategoryFilter('all');
                }}
                className="mt-4 rounded-xl bg-teal-500/10 px-4 py-2 text-xs font-bold text-teal-600 hover:bg-teal-500/20"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          2. OVERVIEW TAB
      ======================================================== */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">إجمالي المشاريع المنشورة</div>
              <div className="mt-2 text-2xl font-black text-[#172c43] dark:text-white">{totalProjects}</div>
              <div className="mt-1 text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                {totalProjects > 0
                  ? `${store.projects.filter((p) => p.status === 'متاح').length} مشاريع متاحة حالياً`
                  : 'لا توجد مشاريع مضافة بعد'}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">المطورون المعتمدون</div>
              <div className="mt-2 text-2xl font-black text-[#172c43] dark:text-white">{totalDevelopers}</div>
              <div className="mt-1 text-[11px] text-slate-400">
                {avgFqs > 0
                  ? `متوسط مؤشر FQS العام: ${avgFqs}/100`
                  : 'متوسط مؤشر FQS: قيد التقييم (جديد)'}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">التذاكر بانتظار المعالجة</div>
              <div className="mt-2 text-2xl font-black text-amber-500">{openTickets}</div>
              <div className="mt-1 text-[11px] text-slate-400">
                {openTickets === 0
                  ? 'جميع التذاكر مستوفاة ولا يوجد انتظار'
                  : `${openTickets} تذاكر قيد المتابعة والمعالجة`}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">نسبة رضا العملاء</div>
              <div className="mt-2 text-2xl font-black text-emerald-500">
                {clientSatisfaction ? `${clientSatisfaction.percent}%` : '—'}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {clientSatisfaction
                  ? `بناءً على ${clientSatisfaction.count} تقييم تسليم معتمد`
                  : 'لا توجد تقييمات تسليم بعد'}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Real Platform Traffic & Visitor Intelligence (Admin Only) */}
          {/* ======================================================== */}
          <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-white via-indigo-50/20 to-teal-50/10 p-6 shadow-xs dark:border-indigo-500/10 dark:bg-[#0c1626]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/15 pb-4 dark:border-indigo-500/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-600 ring-2 ring-indigo-500/20 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Eye size={20} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#14283d] dark:text-white">
                      إحصائيات المشاهدات وحركة الزوار المباشرة (Platform Traffic & Engagement)
                    </h3>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                      مباشر 🟢 Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    تتبع حركة الزيارات الحقيقية، الأجهزة المتصلة، وتوزيع التصفح عبر بوابات فوتيك
                  </p>
                </div>
              </div>
              <span className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-black text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-500" />
                <span>خاص بالإدارة والتشغيل والرقابة فقط</span>
              </span>
            </div>

            {/* 4 Traffic KPI Cards */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="text-xs font-bold text-slate-400">إجمالي مشاهدات المنصة</div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.totalViews.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  مشاهدات موثقة عبر كافة المسارات
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="text-xs font-bold text-slate-400">الزوار الفريدون والنشطون</div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.uniqueVisitors.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  متصفحون وأجهزة معتمدة
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="text-xs font-bold text-slate-400">مشاهدات وزيارات اليوم</div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.todayViews.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {visitorAnalytics.todayVisitors} زائر متفاعل خلال 24 ساعة
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
                <div className="text-xs font-bold text-slate-400">متوسط وقت الجلسة</div>
                <div className="mt-2 text-2xl font-black text-[#14293f] dark:text-white">
                  {visitorAnalytics.avgSessionDuration}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  معدل التفاعل والاستقرار: {100 - parseInt(visitorAnalytics.bounceRate)}%
                </div>
              </div>
            </div>

            {/* Top Visited Pages in Admin Dashboard */}
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/5 dark:bg-[#08101d]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <h4 className="text-xs font-black text-[#14283d] dark:text-white">
                  أكثر البوابات والمسارات تصفحاً من الزوار
                </h4>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Live Routes</span>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {visitorAnalytics.topPages.slice(0, 4).map((p: any) => (
                  <div key={p.path} className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 text-xs dark:border-white/5 dark:bg-[#0c1626]">
                    <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{p.name || p.title || p.path}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span className="truncate">{p.path}</span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400">{p.views.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Executive Visual Analytics Suite for Admin (4 Rich Charts) */}
          {/* ======================================================== */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Chart 1: Platform Growth & Intake (AreaChart) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <TrendingUp size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      مسار نمو المنصة: تدفق المشاريع والمطورين الجدد
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      معدل التسجيل الشهري للمشاريع البرمجية والكفاءات المعتمدة
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-[10px] font-black text-teal-600 dark:text-teal-400">
                  {totalProjects + totalDevelopers > 0 ? `${totalProjects + totalDevelopers} إجمالي المسجلين` : 'رصد لحظي مباشر'}
                </span>
              </div>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={platformGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminProjectsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="adminDevsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      name="المشاريع الجديدة"
                      dataKey="newProjects"
                      stroke="#0d9488"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#adminProjectsGrad)"
                    />
                    <Area
                      type="monotone"
                      name="المطورون المعتمدون"
                      dataKey="newDevs"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#adminDevsGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: SLA Support Tickets by Category (BarChart) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Activity size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      توزيع تذاكر الصيانة والدعم حسب التصنيف والحالة
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      مقارنة التذاكر التي تم حلها مقابل التي قيد المعالجة
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                  {store.tickets.length > 0
                    ? `${Math.round((store.tickets.filter((t) => t.status === 'مغلق' || t.status === 'تم الحل').length / store.tickets.length) * 100)}% نسبة الإغلاق`
                    : '✓ 0 بلاغات معلقة'}
                </span>
              </div>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticketsCategoryChartData} margin={{ top: 15, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
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
                      formatter={(val: any, name: any) => [`${val} تذكرة`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="resolved" name="تم الحل والاعتماد" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="inProgress" name="قيد المعالجة الفنية" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Documentation Hub Engagement (BarChart) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <BookOpen size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      تفاعل المطورين والعملاء مع مركز المعرفة
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      إجمالي المشاهدات والتصويتات المفيدة لأقسام التوثيق
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-black text-blue-600 dark:text-blue-400">
                  {totalDocViews.toLocaleString('ar-EG')} قراءة موثقة
                </span>
              </div>

              <div className="mt-5 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={docsEngagementChartData} margin={{ top: 15, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '16px',
                        color: '#f8fafc',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: any, name: any) => [name === 'المشاهدات' ? `${val} قراءة` : `${val} تصويت مفيد`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="views" name="المشاهدات" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="votes" name="تصويتات مفيدة" fill="#249ea7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Project Lifecycle Distribution (Donut PieChart) */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Briefcase size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-[#152a40] dark:text-white">
                      دورة حياة المشاريع البرمجية وحالات التسليم
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      توزيع المشاريع التقنية حسب مرحلة العمل والتسليم
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400">
                  {totalProjects} مشروع مسجل
                </span>
              </div>

              <div className="mt-5 flex flex-col items-center justify-center sm:flex-row gap-4 h-72">
                {totalProjects === 0 ? (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-900/40">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Briefcase size={24} />
                    </div>
                    <span className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">
                      البيانات الفعلية: 0 مشاريع منشورة حالياً
                    </span>
                    <p className="mt-1 text-[11px] text-slate-400 max-w-[320px]">
                      سيتم تصنيف دورة حياة المشاريع تلقائياً فور طرح المشاريع في سوق المشاريع البرمجية.
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
                            formatter={(val: any) => [`${val} مشروع`, 'العدد']}
                          />
                          <Pie
                            data={projectsLifecycleChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                          >
                            {projectsLifecycleChartData.map((entry, index) => (
                              <Cell key={`admin-cell-proj-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="w-full sm:w-1/2 space-y-2 text-xs">
                      {projectsLifecycleChartData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-slate-900/60">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[140px]">{item.name}</span>
                          </div>
                          <span className="font-black text-slate-900 dark:text-white text-[11px]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-[#152a3f] dark:text-white">آخر المشاريع المضافة</h3>
                <button
                  onClick={() => setTab('projects')}
                  className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400"
                >
                  عرض الكل
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {store.projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400 dark:border-slate-800">
                    لا توجد مشاريع مضافة حالياً.
                  </div>
                ) : (
                  store.projects.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-900/60"
                    >
                      <div>
                        <div className="text-xs font-black text-[#162b40] dark:text-white">{p.title}</div>
                        <div className="mt-0.5 text-[10px] text-slate-400">
                          {p.owner} · ميزانية {p.budget?.toLocaleString('ar-EG')} {p.currency || 'ر.س'}
                        </div>
                      </div>
                      <span className="rounded-lg bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-xs dark:bg-slate-800 dark:text-slate-300">
                        {p.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-sm font-black text-[#152a3f] dark:text-white">طلبات الدعم العاجلة</h3>
                <button
                  onClick={() => setTab('tickets')}
                  className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400"
                >
                  عرض الكل
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {store.tickets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400 dark:border-slate-800">
                    لا توجد تذاكر دعم فني حالياً.
                  </div>
                ) : (
                  store.tickets.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-900/60"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#162b40] dark:text-white">{t.subject}</span>
                          {t.targetAudience === 'owner' && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-2 py-0.2 text-[9px] font-black text-amber-700 dark:text-amber-300">
                              <Crown size={10} /> موجهة للمالك
                            </span>
                          )}
                          {t.targetAudience === 'admin' && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-500/15 px-2 py-0.2 text-[9px] font-black text-indigo-700 dark:text-indigo-300">
                              <ShieldCheck size={10} /> موجهة للإدارة
                            </span>
                          )}
                          {t.targetAudience === 'both' && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-500/15 px-2 py-0.2 text-[9px] font-black text-teal-700 dark:text-teal-300">
                              المالك والإدارة
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[10px] text-slate-400">
                          من: {t.owner} · أولوية: {t.priority}
                        </div>
                      </div>
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                          t.status === 'مفتوح'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                            : t.status === 'قيد المعالجة'
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Social Media & GitHub Channels Manager (إضافة، تعديل، حذف) */}
          <SocialLinksManager onNotify={notify} isOwnerView={false} />
        </div>
      )}

      {/* ========================================================
          3. DEVELOPERS TAB
      ======================================================== */}
      {tab === 'developers' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-[#0c1524]">
            <div className="relative min-w-[260px] flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={devSearch}
                onChange={(e) => setDevSearch(e.target.value)}
                placeholder="ابحث بالاسم أو التخصص التقني..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pe-4 ps-10 py-2.5 text-xs outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              />
            </div>
          </div>

          {filteredDevs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-[#0c1524]">
              <Users size={36} className="mx-auto text-slate-400" />
              <h4 className="mt-3 text-sm font-black text-slate-800 dark:text-white">
                لم يتم العثور على مطورين مطابقين للبحث
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                جرّب تعديل كلمات البحث لإظهار النتائج.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-[#0c1524]">
              {filteredDevs.map((dev) => (
                <div
                  key={dev.id}
                  className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3.5">
                    {dev.avatar && dev.avatar.trim() !== '' ? (
                      <img
                        src={dev.avatar}
                        alt={dev.name}
                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                      />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-sm font-black text-amber-400 ring-2 ring-slate-100 shadow-sm dark:ring-slate-800">
                        {dev.name ? dev.name.charAt(0) : 'م'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">{dev.name}</h4>
                        {dev.verified && <BadgeCheck size={16} className="text-teal-500" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{dev.specialty}</p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{dev.location}</span>
                        <span>·</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">
                          FQS: {dev.fqs > 0 ? dev.fqs : 'قيد التقييم'}
                        </span>
                        <span>·</span>
                        <span>سعر: {dev.hourlyRate} {getDeveloperCurrency(dev)}/س</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleDevVerify(dev)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                        dev.verified
                          ? 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : 'bg-teal-600 text-white hover:bg-teal-700'
                      }`}
                    >
                      {dev.verified ? 'إلغاء التوثيق' : 'توثيق المطور'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          4. PROJECTS TAB
      ======================================================== */}
      {tab === 'projects' && (
        <div className="space-y-4">
          {store.projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-[#0c1524]">
              <Briefcase size={36} className="mx-auto text-slate-400" />
              <h4 className="mt-3 text-sm font-black text-slate-800 dark:text-white">
                لا توجد مشاريع منشورة حالياً
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                عند قيام أصحاب المشاريع بنشر مشاريع جديدة، ستظهر هنا للإشراف عليها ومطابقتها.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-[#0c1524]">
              {store.projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                        {project.status}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">{project.title}</h4>
                    </div>
                    <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {project.description}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400">
                      صاحب المشروع: {project.owner} · الميزانية: {project.budget?.toLocaleString('ar-EG')} {project.currency || 'ر.س'} · الموعد:{' '}
                      {project.deadline}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400"
                    >
                      <Trash2 size={13} />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          5. TICKETS TAB
      ======================================================== */}
      {tab === 'tickets' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Tickets List */}
          <div className="space-y-3 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-[#0c1524]">
              <input
                type="text"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder="ابحث في التذاكر..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              />
            </div>

            {filteredTickets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-[#0c1524]">
                <TicketCheck size={32} className="mx-auto text-slate-400" />
                <h4 className="mt-2 text-xs font-black text-slate-800 dark:text-white">لا توجد تذاكر دعم</h4>
                <p className="mt-0.5 text-[11px] text-slate-400">صندوق تذاكر الدعم الفني فارغ حالياً.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicket(t)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      activeTicket?.id === t.id
                        ? 'border-teal-500/40 bg-teal-50/50 dark:border-teal-500/40 dark:bg-teal-950/20'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-[#0c1524] dark:hover:bg-slate-900/60'
                    }`}
                  >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-black text-slate-900 dark:text-white">{t.subject}</span>
                      {t.targetAudience === 'owner' && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-2 py-0.2 text-[9px] font-black text-amber-700 dark:text-amber-300">
                          <Crown size={10} /> موجهة للمالك
                        </span>
                      )}
                      {t.targetAudience === 'admin' && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-500/15 px-2 py-0.2 text-[9px] font-black text-indigo-700 dark:text-indigo-300">
                          <ShieldCheck size={10} /> موجهة للإدارة
                        </span>
                      )}
                      {t.targetAudience === 'both' && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-500/15 px-2 py-0.2 text-[9px] font-black text-teal-700 dark:text-teal-300">
                          المالك والإدارة
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${
                        t.status === 'مفتوح'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : t.status === 'قيد المعالجة'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                    <span>{t.owner} · {t.createdAt}</span>
                    {t.senderEmail && (
                      <span className="text-teal-600 dark:text-teal-400 font-medium">✉️ {t.senderEmail}</span>
                    )}
                    {t.logsOrCode && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-slate-900 px-1.5 py-0.2 font-mono text-[9px] text-emerald-400">
                        <Terminal size={9} /> Log
                      </span>
                    )}
                    {t.attachments && t.attachments.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-teal-50 px-1.5 py-0.2 font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                        📎 {t.attachments.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Active Ticket Chat */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-7 dark:border-slate-800 dark:bg-[#0c1524]">
            {activeTicket ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">{activeTicket.subject}</h3>
                      {activeTicket.targetAudience === 'owner' && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-black text-amber-700 dark:text-amber-300">
                          👑 موجهة للمالك التنفيذي
                        </span>
                      )}
                      {activeTicket.targetAudience === 'admin' && (
                        <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[9px] font-black text-indigo-700 dark:text-indigo-300">
                          🛡️ موجهة للإدارة
                        </span>
                      )}
                      {activeTicket.targetAudience === 'both' && (
                        <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[9px] font-black text-teal-700 dark:text-teal-300">
                          🌐 المالك والإدارة
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span>مقدم الطلب: <b className="text-slate-700 dark:text-slate-200">{activeTicket.owner}</b></span>
                      {activeTicket.senderEmail && (
                        <>
                          <span>·</span>
                          <a href={`mailto:${activeTicket.senderEmail}`} className="text-teal-600 hover:underline">
                            {activeTicket.senderEmail}
                          </a>
                        </>
                      )}
                      {activeTicket.senderPhone && (
                        <>
                          <span>·</span>
                          <span dir="ltr" className="font-mono text-slate-600 dark:text-slate-300">{activeTicket.senderPhone}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>تصنيف: {activeTicket.category}</span>
                    </div>
                  </div>

                  <select
                    value={activeTicket.status}
                    onChange={(e) => handleToggleTicketStatus(activeTicket, e.target.value as any)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    <option value="مفتوح">مفتوح</option>
                    <option value="قيد المعالجة">قيد المعالجة</option>
                    <option value="مغلق">مغلق</option>
                  </select>
                </div>

                {/* Terminal Console for Error Logs / Codes */}
                {activeTicket.logsOrCode && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Terminal size={14} className="text-teal-500" />
                      <span>سجل الخطأ والشيفرة المرفقة (محاكي الـ Terminal):</span>
                    </div>
                    <TerminalConsole
                      value={activeTicket.logsOrCode}
                      readOnly
                      title={`stderr.log • ${activeTicket.subject}`}
                    />
                  </div>
                )}

                {/* Attachments Viewer (Images, Videos, Files) */}
                {activeTicket.attachments && activeTicket.attachments.length > 0 && (
                  <TicketAttachmentViewer attachments={activeTicket.attachments} />
                )}

                {/* Conversation History */}
                <div className="max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-900/60">
                  {(activeTicket.replies || []).map((reply, index) => (
                    <div
                      key={index}
                      className={`rounded-2xl p-3.5 leading-relaxed ${
                        index === 0
                          ? 'border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#0c1524] dark:text-slate-200'
                          : 'bg-teal-500/10 text-teal-900 dark:text-teal-200 border border-teal-500/20'
                      }`}
                    >
                      <div className="mb-1 text-[10px] font-bold text-slate-400">
                        {index === 0 ? `رسالة العميل (${activeTicket.owner}):` : 'رد فريق الدعم الإداري:'}
                      </div>
                      {typeof reply === 'string' ? reply : reply.message}
                    </div>
                  ))}
                </div>

                {/* Reply box */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ticketReply}
                    onChange={(e) => setTicketReply(e.target.value)}
                    placeholder="اكتب ردك على التذكرة..."
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendTicketReply()}
                  />
                  <button
                    onClick={handleSendTicketReply}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
                  >
                    <Send size={14} />
                    <span>إرسال</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-slate-400">
                اختر تذكرة من القائمة لعرض تفاصيلها والرد عليها
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 1: DOCUMENT READER MODAL
      ======================================================== */}
      <AnimatePresence>
        {selectedDocForReader && (
          <div
            onClick={() => setSelectedDocForReader(null)}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-8 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-[#0c1524]"
            >
              <button
                type="button"
                onClick={() => setSelectedDocForReader(null)}
                className="absolute left-6 top-6 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X size={18} />
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-lg border px-2.5 py-1 text-xs font-black ${getCategoryBadgeClass(selectedDocForReader.category)}`}>
                  {selectedDocForReader.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={13} />
                  <span>{selectedDocForReader.readingTime || '4 دقائق قراءة'}</span>
                </span>
                <span className="text-xs text-slate-400">· آخر تحديث: {selectedDocForReader.updatedAt}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400">
                  <Eye size={13} />
                  <span>{selectedDocForReader.views || 1} مشاهدة</span>
                </span>
              </div>

              <h2 className="mt-3 text-xl font-black text-slate-900 dark:text-white leading-tight">
                {selectedDocForReader.title}
              </h2>

              {selectedDocForReader.summary && (
                <div className="mt-4 rounded-2xl border border-teal-500/20 bg-teal-50/60 p-4 text-xs font-medium leading-relaxed text-teal-900 dark:border-teal-500/20 dark:bg-teal-950/30 dark:text-teal-200">
                  <div className="flex items-center gap-1.5 font-black mb-1">
                    <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
                    <span>موجز الوثيقة:</span>
                  </div>
                  {selectedDocForReader.summary}
                </div>
              )}

              {/* Document Full Content */}
              <div className="mt-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {selectedDocForReader.content}
              </div>

              {/* Code Example block if present */}
              {selectedDocForReader.codeExample && (
                <div className="mt-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#070e17] text-slate-200" dir="ltr">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2 text-xs">
                    <span className="text-[11px] font-mono text-teal-400">Example Code Snippet</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedDocForReader.codeExample!)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                    >
                      {copiedCode ? <Check size={13} className="text-teal-400" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                    {selectedDocForReader.codeExample}
                  </pre>
                </div>
              )}

              {/* Tags footer */}
              {selectedDocForReader.tags && selectedDocForReader.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {selectedDocForReader.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Helpful feedback bar */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle size={15} className="text-teal-500" />
                  <span>هل كانت هذه الوثيقة مفيدة لك؟</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleVoteDoc(selectedDocForReader.id, true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500/10 px-3.5 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-500/20 active:scale-95 transition dark:text-teal-300"
                  >
                    <ThumbsUp size={13} />
                    <span>نعم، مفيدة ({selectedDocForReader.helpfulVotes || 0})</span>
                  </button>
                </div>
              </div>

              {/* Reader Action Footer */}
              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditDoc(selectedDocForReader);
                    setSelectedDocForReader(null);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  تعديل الوثيقة
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDocForReader(null)}
                  className="rounded-xl bg-[#14293f] px-5 py-2 text-xs font-bold text-white hover:bg-[#1c3857] dark:bg-teal-600 dark:hover:bg-teal-500 dark:text-slate-950"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MODAL 2: ADD / EDIT DOCUMENT MODAL
      ======================================================== */}
      <AnimatePresence>
        {isEditorOpen && (
          <div
            onClick={() => setIsEditorOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md"
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-[#0c1524]"
            >
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="absolute left-6 top-6 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingDoc ? 'تعديل الوثيقة الرسمية' : 'إضافة وثيقة توثيقية جديدة'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    نشر وتحديث معايير الجودة، أدلة العملاء، ومواصفات تسليم الكود FQS
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveDoc} className="mt-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    عنوان الوثيقة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثال: دليل معايير جودة الشفرة FQS للشركات الناشئة"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                      التصنيف الرسمي
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                    >
                      <option value="معيار FQS وجودة الشيفرة">معيار FQS وجودة الشيفرة</option>
                      <option value="تسليم الكود والمستودعات">تسليم الكود والمستودعات</option>
                      <option value="الدعم المستمر والضمان">الدعم المستمر والضمان</option>
                      <option value="دليل أصحاب المشاريع">دليل أصحاب المشاريع</option>
                      <option value="دليل المطورين">دليل المطورين</option>
                      <option value="الأمان وأدوات فوتيك">الأمان وأدوات فوتيك</option>
                    </select>
                  </div>

                  {/* Reading Time */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                      وقت القراءة المقدر
                    </label>
                    <input
                      type="text"
                      value={formReadingTime}
                      onChange={(e) => setFormReadingTime(e.target.value)}
                      placeholder="مثال: 4 دقائق"
                      className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    موجز الوثيقة (يظهر في البطاقة)
                  </label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="موجز سريع يلخص أهم نقاط الوثيقة..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    المحتوى الكامل للوثيقة <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="اكتب المحتوى الكامل هنا... يمكنك استخدام فواصل وأرقام ونقاط لتنسيق المحتوى."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white font-sans leading-relaxed"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    الوسوم والكلمات المفتاحية (مفصولة بفاصلة)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="FQS, معايير, كود_نظيف, أمان"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                  />
                </div>

                {/* Optional Code Example */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    كود برمجي توضيحي (اختياري)
                  </label>
                  <textarea
                    rows={3}
                    value={formCodeExample}
                    onChange={(e) => setFormCodeExample(e.target.value)}
                    placeholder="// كود JavaScript أو Docker أو إعدادات Git..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 font-mono text-xs text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-black text-white hover:bg-teal-700"
                  >
                    <Check size={14} />
                    <span>{editingDoc ? 'حفظ التعديلات' : 'نشر الوثيقة فوراً'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
