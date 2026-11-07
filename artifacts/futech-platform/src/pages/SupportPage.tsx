import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearch } from 'wouter';
import {
  LifeBuoy, Lightbulb, Send, CheckCircle2, ThumbsUp, Sparkles,
  HelpCircle, ShieldCheck, HeartHandshake, Filter,
  ArrowLeft, Tag, Layers, Star, Clock, AlertTriangle, AlertCircle,
  FileCode2, MessageSquare, Plus, ChevronRight, X, ExternalLink,
  CodeXml, Check, Briefcase, RefreshCw, Terminal, PhoneCall,
  BookOpen, Search, UploadCloud, Paperclip, Crown, Phone, UserCheck, MessageCircle
} from 'lucide-react';
import { Store, Ticket, TicketReply, TicketAttachment } from '../types';
import {
  TerminalConsole,
  TicketAttachmentManager,
  TicketAttachmentViewer
} from '../components/TicketSupportWidgets';

interface SupportPageProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
}

export type PlatformSuggestion = {
  id: string;
  category: 'ميزة برمجية' | 'تحسين واجهة' | 'معيار FQS' | 'أدوات المطورين' | 'اقتراح عام';
  title: string;
  description: string;
  author: string;
  votes: number;
  status: 'قيد الدراسة' | 'مقبول وقيد التطوير' | 'تم تنفيذه بنجاح';
  date: string;
};

const INITIAL_SUGGESTIONS: PlatformSuggestion[] = [];

export function SupportPage({ store, update, notify }: SupportPageProps) {
  const [activeTab, setActiveTab] = useState<'tickets' | 'suggestions' | 'channels'>('tickets');

  // Ticket filters
  const [ticketSearch, setTicketSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Selected ticket for modal / timeline view
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newReplyMessage, setNewReplyMessage] = useState('');
  const [newReplyCode, setNewReplyCode] = useState('');
  const [showReplyCodeInput, setShowReplyCodeInput] = useState(false);
  const [newReplyAttachments, setNewReplyAttachments] = useState<TicketAttachment[]>([]);
  const [showReplyAttachmentManager, setShowReplyAttachmentManager] = useState(false);

  // New Ticket Form Modal State
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState<Ticket['category']>('دعم مستمر بعد التسليم');
  const [newTicketPriority, setNewTicketPriority] = useState<Ticket['priority']>('عالي');
  const [newTicketProject, setNewTicketProject] = useState(store.projects[0]?.title || '');
  const [newTicketDetails, setNewTicketDetails] = useState('');
  const [newTicketLogs, setNewTicketLogs] = useState('');
  const [newTicketSender, setNewTicketSender] = useState('');
  const [newTicketAttachments, setNewTicketAttachments] = useState<TicketAttachment[]>([]);

  // Direct Communication to Owner & Admin Form State
  const [directTarget, setDirectTarget] = useState<'owner' | 'admin' | 'both'>('owner');
  const [directCategory, setDirectCategory] = useState<string>('استفسار هندسي وشراكات مؤسسية');
  const [directSender, setDirectSender] = useState(store.currentUser?.name || '');
  const [directEmail, setDirectEmail] = useState(store.currentUser?.email || '');
  const [directPhone, setDirectPhone] = useState(store.currentUser?.phone || '');
  const [directSubject, setDirectSubject] = useState('');
  const [directMessage, setDirectMessage] = useState('');
  const [directPriority, setDirectPriority] = useState<Ticket['priority']>('عالي');
  const [directAttachments, setDirectAttachments] = useState<TicketAttachment[]>([]);
  const [directSending, setDirectSending] = useState(false);
  const [directSuccess, setDirectSuccess] = useState(false);

  // Sync sender info when currentUser changes
  useEffect(() => {
    if (store.currentUser) {
      if (!directSender) setDirectSender(store.currentUser.name);
      if (!directEmail) setDirectEmail(store.currentUser.email);
      if (!directPhone && store.currentUser.phone) setDirectPhone(store.currentUser.phone);
    }
  }, [store.currentUser]);

  const searchStr = useSearch();

  // Handle URL query parameters (e.g. ?template=sla or ?tab=tickets)
  useEffect(() => {
    try {
      const params = new URLSearchParams(searchStr);
      const tab = params.get('tab');
      if (tab === 'tickets' || tab === 'suggestions' || tab === 'channels') {
        setActiveTab(tab);
      }
      const template = params.get('template');
      if (template === 'sla') {
        setActiveTab('tickets');
        setCategoryFilter('دعم مستمر بعد التسليم');
        setShowNewTicketModal(true);
        setNewTicketCategory('دعم مستمر بعد التسليم');
        setNewTicketPriority('عالي');
        setNewTicketSubject('طلب صيانة مستمرة ودعم فني وفق اتفاقية مستوى الخدمة (SLA)');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {}
  }, [searchStr]);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<PlatformSuggestion[]>(() => {
    try {
      const stored = localStorage.getItem('futech_suggestions_v1');
      return stored ? JSON.parse(stored) : INITIAL_SUGGESTIONS;
    } catch {
      return INITIAL_SUGGESTIONS;
    }
  });

  const [sugCategory, setSugCategory] = useState<PlatformSuggestion['category']>('ميزة برمجية');
  const [sugTitle, setSugTitle] = useState('');
  const [sugDesc, setSugDesc] = useState('');
  const [sugAuthor, setSugAuthor] = useState('');
  const [sugFilterCategory, setSugFilterCategory] = useState<string>('all');
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return store.tickets.filter((t) => {
      const matchesSearch =
        !ticketSearch ||
        t.subject.includes(ticketSearch) ||
        t.owner.includes(ticketSearch) ||
        (t.projectTitle && t.projectTitle.includes(ticketSearch));
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCat;
    });
  }, [store.tickets, ticketSearch, statusFilter, priorityFilter, categoryFilter]);

  // Handle New Ticket Submit
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketDetails.trim()) {
      notify('يرجى ملء جميع الحقول المطلوبة للتذكرة');
      return;
    }

    const slaMap = {
      'حرج': 2,
      'عالي': 6,
      'متوسط': 12,
      'منخفض': 24,
    };

    const newTicket: Ticket = {
      id: 'tk-' + Math.random().toString(36).substring(2, 8),
      subject: newTicketSubject.trim(),
      category: newTicketCategory,
      priority: newTicketPriority,
      status: 'مفتوح',
      owner: newTicketSender.trim() || 'صاحب المشروع',
      projectTitle: newTicketProject,
      createdAt: 'الآن',
      slaResponseHours: slaMap[newTicketPriority] || 12,
      replies: [newTicketDetails.trim()],
      logsOrCode: newTicketLogs.trim() || undefined,
      attachments: newTicketAttachments.length > 0 ? newTicketAttachments : undefined,
      messages: [
        {
          id: 'msg-' + Date.now(),
          sender: newTicketSender.trim() || 'صاحب المشروع',
          senderRole: 'client',
          message: newTicketDetails.trim(),
          createdAt: 'الآن',
          codeSnippet: newTicketLogs.trim() || undefined,
        },
      ],
    };

    const updatedTickets = [newTicket, ...store.tickets];
    update('tickets', updatedTickets);

    setNewTicketSubject('');
    setNewTicketDetails('');
    setNewTicketLogs('');
    setNewTicketAttachments([]);
    setShowNewTicketModal(false);
    notify('تم فتح تذكرة الدعم بنجاح وإرسال إشعار للمطور المسؤول');
  };

  // Handle Direct Message to Owner & Admin Submit
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directSubject.trim() || !directMessage.trim() || !directSender.trim() || !directEmail.trim()) {
      notify('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، عنوان الرسالة، والمحتوى)');
      return;
    }

    setDirectSending(true);

    const targetLabel = directTarget === 'owner'
      ? 'مالك المنصة التنفيذي (مينا روبير)'
      : directTarget === 'admin'
      ? 'الإدارة والرقابة الهندسية'
      : 'المالك والإدارة معاً';

    const newTicket: Ticket = {
      id: 'dir-' + Math.random().toString(36).substring(2, 8),
      subject: directSubject.trim(),
      category: `مراسلة مباشرة (${targetLabel})`,
      priority: directPriority,
      status: 'مفتوح',
      owner: directSender.trim(),
      senderEmail: directEmail.trim(),
      senderPhone: directPhone.trim() || undefined,
      targetAudience: directTarget,
      projectTitle: directCategory,
      createdAt: 'الآن',
      slaResponseHours: 4,
      replies: [directMessage.trim()],
      messages: [
        {
          id: 'rep-' + Date.now(),
          sender: directSender.trim(),
          senderRole: 'client',
          message: directMessage.trim(),
          createdAt: 'الآن',
        }
      ],
      attachments: directAttachments.length > 0 ? directAttachments : undefined,
    };

    update('tickets', [newTicket, ...store.tickets]);

    setTimeout(() => {
      setDirectSending(false);
      setDirectSuccess(true);
      setDirectSubject('');
      setDirectMessage('');
      setDirectAttachments([]);
      notify(`تم إرسال رسالتك بنجاح إلى ${targetLabel}! ستظهر في لوحة تحكم الإدارة والمالك فوراً.`);
    }, 300);
  };

  // Add reply to ticket
  const handleAddReply = (ticketId: string) => {
    if (!newReplyMessage.trim() && newReplyAttachments.length === 0 && !newReplyCode.trim()) return;

    const newReplyItem: TicketReply = {
      id: 'rep-' + Date.now(),
      sender: store.currentUser?.name || 'فريق الدعم الفني',
      senderRole: store.currentUser?.role === 'developer' ? 'developer' : store.currentUser?.role === 'client' ? 'client' : 'support',
      message: newReplyMessage.trim() || 'تم إرفاق ملفات وتحديثات تقنية على التذكرة.',
      createdAt: 'الآن',
      codeSnippet: newReplyCode.trim() || undefined,
      attachments: newReplyAttachments.length > 0 ? newReplyAttachments : undefined,
    };

    const updated = store.tickets.map((t) => {
      if (t.id === ticketId) {
        const msgs = t.messages ? [...t.messages, newReplyItem] : [newReplyItem];
        const combinedAttachments = [...(t.attachments || []), ...newReplyAttachments];
        return {
          ...t,
          status: t.status === 'مفتوح' ? 'قيد المعالجة' : t.status,
          replies: [...(t.replies || []), newReplyMessage.trim() || 'إرفاق ملفات'],
          messages: msgs,
          attachments: combinedAttachments.length > 0 ? combinedAttachments : undefined,
        };
      }
      return t;
    });

    update('tickets', updated);
    setSelectedTicket((prev) => {
      if (!prev) return null;
      const combinedAttachments = [...(prev.attachments || []), ...newReplyAttachments];
      return {
        ...prev,
        status: prev.status === 'مفتوح' ? 'قيد المعالجة' : prev.status,
        messages: [...(prev.messages || []), newReplyItem],
        attachments: combinedAttachments.length > 0 ? combinedAttachments : undefined,
      };
    });

    setNewReplyMessage('');
    setNewReplyCode('');
    setNewReplyAttachments([]);
    setShowReplyCodeInput(false);
    setShowReplyAttachmentManager(false);
    notify('تم إرسال الرد والمرفقات وتحديث التذكرة بنجاح');
  };

  // Update ticket status
  const handleUpdateStatus = (ticketId: string, newStatus: Ticket['status']) => {
    const updated = store.tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t));
    update('tickets', updated);
    setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    notify(`تم تحديث حالة التذكرة إلى: ${newStatus}`);
  };

  // Suggestion Submit
  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugTitle.trim() || sugDesc.trim().length < 15) {
      notify('يرجى كتابة عنوان واضح وتفاصيل للاقتراح لا تقل عن 15 حرفًا');
      return;
    }

    const newSug: PlatformSuggestion = {
      id: 'sug-' + Math.random().toString(36).substring(2, 9),
      category: sugCategory,
      title: sugTitle.trim(),
      description: sugDesc.trim(),
      author: sugAuthor.trim() || 'مبرمج عربي مبدع',
      votes: 1,
      status: 'قيد الدراسة',
      date: 'الآن',
    };

    const updated = [newSug, ...suggestions];
    setSuggestions(updated);
    try {
      localStorage.setItem('futech_suggestions_v1', JSON.stringify(updated));
    } catch {}

    setSugTitle('');
    setSugDesc('');
    notify('شكرًا لمساهمتك! تم إرسال مقترحك إلى فريق تطوير فوتيك بنجاح');
  };

  // Upvote Suggestion
  const handleVote = (id: string) => {
    if (upvotedIds.includes(id)) {
      notify('لقد قمت بالتصويت لهذا المقترح مسبقًا');
      return;
    }

    const updated = suggestions.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s));
    setSuggestions(updated);
    setUpvotedIds([...upvotedIds, id]);
    try {
      localStorage.setItem('futech_suggestions_v1', JSON.stringify(updated));
    } catch {}
    notify('تم تسجيل صوتك لتأييد الاقتراح!');
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122438] via-[#1a3450] to-[#0d1d2e] p-6 text-white shadow-xl md:p-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#39c0c9]/15 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-[#1da0aa]/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#39c0c9]/30 bg-[#39c0c9]/10 px-3.5 py-1 text-xs font-bold text-[#67d9df]">
            <HeartHandshake size={14} />
            <span>نظام الدعم المستمر وخدمات ما بعد التسليم</span>
          </div>

          <h1 className="mt-4 text-2xl font-black md:text-4xl">
            الدعم الفني، التذاكر البرمجية، وتطوير المنصة
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
            نحن نبني <b>حاضنة الكفاءات البرمجية العربية</b> لتوفير بيئة عمل مستدامة وموثوقة.
            سواء كنت بحاجة إلى دعم تقني مستمر بعد تسليم المشروع (SLA)، الإبلاغ عن خلل برمجي،
            أو مشاركتنا مقترحاتك لتطوير أدوات المنصة؛ فريقنا الهندسي متواجد لخدمتك.
          </p>

          {/* Navigation Switcher Tabs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition ${
                activeTab === 'tickets'
                  ? 'bg-gradient-to-r from-[#2bb2bb] to-[#1e97a0] text-[#09202f] shadow-lg shadow-[#2bb2bb]/20'
                  : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <LifeBuoy size={16} />
              <span>نظام التذاكر والدعم المستمر (SLA)</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                {store.tickets.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition ${
                activeTab === 'suggestions'
                  ? 'bg-gradient-to-r from-[#2bb2bb] to-[#1e97a0] text-[#09202f] shadow-lg shadow-[#2bb2bb]/20'
                  : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <Lightbulb size={16} />
              <span>مقترحات تطوير المنصة</span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition ${
                activeTab === 'channels'
                  ? 'bg-gradient-to-r from-[#2bb2bb] to-[#1e97a0] text-[#09202f] shadow-lg shadow-[#2bb2bb]/20'
                  : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              <PhoneCall size={16} />
              <span>قنوات التواصل المباشر</span>
            </button>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-black text-slate-200 transition hover:bg-white/10"
            >
              <BookOpen size={16} className="text-[#3fc7cf]" />
              <span>مركز التوثيق</span>
            </Link>
          </div>
        </div>
      </div>

      {/* TAB 1: ONGOING SUPPORT & TICKETING SYSTEM */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Ongoing Support SLA Banner */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#c6e6e8] bg-gradient-to-br from-[#f2f9f9] to-[#e6f6f7] p-4 text-slate-800">
              <div className="flex items-center gap-2 text-xs font-black text-[#1c7b83]">
                <ShieldCheck size={17} />
                <span>ضمان الاستقرار الإلزامي</span>
              </div>
              <div className="mt-1 text-sm font-black text-[#152e46]">30 يوماً دعم مجاني</div>
              <p className="mt-1 text-[11px] text-slate-600">
                إصلاح أي خلل أو عيوب برمجية غير متطابقة مع المواصفات مجانًا بعد استلام الكود.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 p-4 text-slate-800">
              <div className="flex items-center gap-2 text-xs font-black text-blue-700">
                <Clock size={17} />
                <span>عقد الصيانة الدورية Pro</span>
              </div>
              <div className="mt-1 text-sm font-black text-[#152e46]">استجابة خلال 4-6 ساعات</div>
              <p className="mt-1 text-[11px] text-slate-600">
                تحديثات أمنية دورية، مراقبة الخوادم، ودعم برمجي مستمر بعقد شهري أو سنوي مرن.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/70 to-fuchsia-50/70 p-4 text-slate-800">
              <div className="flex items-center gap-2 text-xs font-black text-purple-700">
                <Sparkles size={17} />
                <span>الدعم الحرج Enterprise</span>
              </div>
              <div className="mt-1 text-sm font-black text-[#152e46]">استجابة خلال ساعتين 24/7</div>
              <p className="mt-1 text-[11px] text-slate-600">
                مخصص للأنظمة والمتاجر عالية الحركة مع خط ساخن وتدخل هندسي فوري عند الطوارئ.
              </p>
            </div>
          </div>

          {/* Action Header & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  placeholder="ابحث برقم التذكرة أو الموضوع أو اسم المشروع..."
                  className="w-full rounded-xl border border-slate-200 pe-4 ps-10 py-2.5 text-xs outline-none focus:border-[#2ba6ae]"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="all">كل الحالات</option>
                <option value="مفتوح">مفتوح</option>
                <option value="قيد المعالجة">قيد المعالجة</option>
                <option value="تم الحل">تم الحل</option>
                <option value="مغلق">مغلق</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="all">كل الأولويات</option>
                <option value="حرج">حرج (SLA 2h)</option>
                <option value="عالي">عالي (SLA 6h)</option>
                <option value="متوسط">متوسط (SLA 12h)</option>
                <option value="منخفض">منخفض (SLA 24h)</option>
              </select>
            </div>

            <button
              onClick={() => setShowNewTicketModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#203d62] px-5 py-3 text-xs font-black text-white shadow-md transition hover:bg-[#2c5383] active:scale-95"
            >
              <Plus size={16} />
              <span>فتح تذكرة دعم أو صيانة جديدة</span>
            </button>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
                لا توجد تذاكر تطابق الفلاتر المحددة حالياً.
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const priorityStyles = {
                  'حرج': 'bg-rose-100 text-rose-700 border-rose-200',
                  'عالي': 'bg-amber-100 text-amber-700 border-amber-200',
                  'متوسط': 'bg-blue-100 text-blue-700 border-blue-200',
                  'منخفض': 'bg-slate-100 text-slate-600 border-slate-200',
                }[ticket.priority] || 'bg-slate-100 text-slate-600';

                const statusStyles = {
                  'مفتوح': 'bg-emerald-100 text-emerald-700 border-emerald-200',
                  'قيد المعالجة': 'bg-sky-100 text-sky-700 border-sky-200',
                  'تم الحل': 'bg-purple-100 text-purple-700 border-purple-200',
                  'مغلق': 'bg-slate-100 text-slate-500 border-slate-200',
                }[ticket.status] || 'bg-slate-100 text-slate-600';

                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-[#38b5bd] md:flex-row md:items-center"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-black text-slate-400">
                          #{ticket.id}
                        </span>
                        <span className={`rounded-xl border px-2.5 py-0.5 text-[10px] font-black ${priorityStyles}`}>
                          أولوية: {ticket.priority} {ticket.slaResponseHours ? `(SLA ${ticket.slaResponseHours}h)` : ''}
                        </span>
                        <span className={`rounded-xl border px-2.5 py-0.5 text-[10px] font-black ${statusStyles}`}>
                          {ticket.status}
                        </span>
                        <span className="rounded-xl bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {ticket.category}
                        </span>
                        {ticket.logsOrCode && (
                          <span className="inline-flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-900 px-2.5 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
                            <Terminal size={10} className="text-cyan-400" />
                            <span>Terminal Log</span>
                          </span>
                        )}
                        {ticket.attachments && ticket.attachments.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-xl border border-teal-500/30 bg-teal-50/80 px-2.5 py-0.5 text-[9px] font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                            <span>📎 {ticket.attachments.length} مرفقات</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-black text-[#152e46]">
                        {ticket.subject}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        {ticket.projectTitle && (
                          <span className="flex items-center gap-1.5 font-bold text-[#1f4268]">
                            <Briefcase size={13} className="text-[#259199]" />
                            <span>المشروع: {ticket.projectTitle}</span>
                          </span>
                        )}
                        <span>صاحب الطلب: <b>{ticket.owner}</b></span>
                        {ticket.assignedDeveloper && (
                          <span>المطور المسؤول: <b className="text-[#1c848c]">{ticket.assignedDeveloper}</b></span>
                        )}
                        <span className="text-slate-400">{ticket.createdAt}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-[#fafbfc] px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#2ba6ae] hover:bg-[#edf8f9] hover:text-[#19757c]"
                    >
                      <MessageSquare size={14} />
                      <span>عرض تفاصيل التذكرة والردود</span>
                      <ArrowLeft size={13} />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM SUGGESTIONS */}
      {activeTab === 'suggestions' && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Submission Form */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs md:p-8">
              <div className="flex items-center gap-2 text-sm font-black text-[#172c44]">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#e6f7f7] text-[#1c848c]">
                  <Lightbulb size={18} />
                </div>
                <span>شاركنا اقتراحك لتطوير المنصة</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                نأخذ مقترحات المطورين ورواد الأعمال على محمل الجد لترقية فوتيك باستمرار
              </p>

              <form onSubmit={handleSuggestionSubmit} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700">مجال المقترح *</label>
                  <select
                    value={sugCategory}
                    onChange={(e) => setSugCategory(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2ba8b0]"
                  >
                    <option value="ميزة برمجية">ميزة برمجية جديدة</option>
                    <option value="أدوات المطورين">أدوات ومكتبات للمطورين</option>
                    <option value="معيار FQS">تطوير مؤشر جودة المستقل FQS</option>
                    <option value="تحسين واجهة">تحسين واجهة وتجربة المستخدم</option>
                    <option value="اقتراح عام">اقتراح عام للمنصة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">عنوان المقترح *</label>
                  <input
                    required
                    value={sugTitle}
                    onChange={(e) => setSugTitle(e.target.value)}
                    placeholder="مثال: إضافة تكامل مع مستودعات GitLab و Bitbucket"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#2ba8b0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">تفاصيل وشرح الاقتراح *</label>
                  <textarea
                    required
                    rows={4}
                    value={sugDesc}
                    onChange={(e) => setSugDesc(e.target.value)}
                    placeholder="اشرح كيف ستفيد هذه الميزة المبرمجين أو أصحاب المشاريع..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs leading-relaxed outline-none focus:border-[#2ba8b0]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">اسمك أو اسم مستعار</label>
                  <input
                    value={sugAuthor}
                    onChange={(e) => setSugAuthor(e.target.value)}
                    placeholder="مثال: طارق الشمري"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-[#2ba8b0]"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#203d62] py-3 text-xs font-black text-white shadow-md transition hover:bg-[#2c5383] active:scale-95"
                >
                  <Send size={15} />
                  <span>إرسال الاقتراح للمراجعة والتصويت</span>
                </button>
              </form>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-black text-slate-700">
                مقترحات المجتمع والمطورين ({suggestions.length})
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select
                  value={sugFilterCategory}
                  onChange={(e) => setSugFilterCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="all">كل المجالات</option>
                  <option value="ميزة برمجية">ميزة برمجية</option>
                  <option value="أدوات المطورين">أدوات المطورين</option>
                  <option value="معيار FQS">معيار FQS</option>
                  <option value="تحسين واجهة">تحسين واجهة</option>
                  <option value="اقتراح عام">اقتراح عام</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {suggestions
                .filter((s) => sugFilterCategory === 'all' || s.category === sugFilterCategory)
                .map((sug) => {
                  const hasVoted = upvotedIds.includes(sug.id);
                  return (
                    <motion.div
                      key={sug.id}
                      className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-[#eaf6f7] px-2.5 py-0.5 text-[10px] font-bold text-[#1f878f]">
                            {sug.category}
                          </span>
                          <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                            {sug.status}
                          </span>
                          <span className="text-[10px] text-slate-400">{sug.date}</span>
                        </div>
                        <h4 className="text-sm font-black text-[#172c43]">{sug.title}</h4>
                        <p className="text-xs leading-relaxed text-slate-600">{sug.description}</p>
                        <div className="text-[10px] text-slate-400">
                          بواسطة: <span className="font-bold text-slate-600">{sug.author}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleVote(sug.id)}
                        className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-black transition active:scale-95 ${
                          hasVoted
                            ? 'border-[#2ea7af] bg-[#edf8f9] text-[#1e838b]'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#2ea7af]'
                        }`}
                      >
                        <ThumbsUp size={14} className={hasVoted ? 'fill-[#1e838b]' : ''} />
                        <span>{sug.votes}</span>
                      </button>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIRECT CONTACT CHANNELS */}
      {activeTab === 'channels' && (
        <div className="space-y-8">
          {/* Form: Direct Communication with Owner & Administration */}
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200/90 bg-white p-6 shadow-xl sm:p-8 dark:border-slate-800 dark:bg-[#0c1524]">
            {/* Ambient Background Accent */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-black text-teal-700 dark:text-teal-300">
                    <Sparkles size={13} className="text-teal-500" />
                    <span>قناة الاتصال المباشر الفوري</span>
                  </div>
                  <h3 className="mt-2 text-lg font-black text-slate-900 sm:text-xl dark:text-white">
                    نموذج المراسلة المباشرة مع المالك أو الإدارة
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    أرسل رسالتك، استفسارك، شراكتك، أو ملاحظاتك مباشرة لتصل فوراً إلى لوحة تحكم المالك ولوحة الإدارة والرقابة.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock size={14} className="text-teal-500" />
                  <span>زمن الرد المتوقع: أقل من ساعتين</span>
                </div>
              </div>

              {directSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      تم استلام رسالتك وإرسالها فورياً إلى لوحة التحكم! شكراً لتواصلك معنا وسيتواصل معك الفريق في أقرب وقت.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDirectSuccess(false)}
                    className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                  >
                    <X size={15} />
                  </button>
                </motion.div>
              )}

              <form onSubmit={handleSendDirectMessage} className="mt-6 space-y-6">
                {/* 1. Target Selector (الجهة المستلمة) */}
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                    توجيه الرسالة إلى: <span className="text-rose-500">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setDirectTarget('owner')}
                      className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-black transition-all ${
                        directTarget === 'owner'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-sm ring-2 ring-amber-500/20 dark:border-amber-500/50 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400'
                      }`}
                    >
                      <Crown size={16} className={directTarget === 'owner' ? 'text-amber-500' : 'text-slate-400'} />
                      <span>مالك المنصة التنفيذي (مينا روبير)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDirectTarget('admin')}
                      className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-black transition-all ${
                        directTarget === 'admin'
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-sm ring-2 ring-indigo-500/20 dark:border-indigo-500/50 dark:bg-indigo-950/40 dark:text-indigo-300'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400'
                      }`}
                    >
                      <ShieldCheck size={16} className={directTarget === 'admin' ? 'text-indigo-500' : 'text-slate-400'} />
                      <span>الإدارة والرقابة الهندسية</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDirectTarget('both')}
                      className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-black transition-all ${
                        directTarget === 'both'
                          ? 'border-teal-500 bg-teal-50/70 text-teal-900 shadow-sm ring-2 ring-teal-500/20 dark:border-teal-500/50 dark:bg-teal-950/40 dark:text-teal-300'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400'
                      }`}
                    >
                      <Sparkles size={16} className={directTarget === 'both' ? 'text-teal-500' : 'text-slate-400'} />
                      <span>المالك والإدارة معاً</span>
                    </button>
                  </div>
                </div>

                {/* 2. Category & Priority */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      تصنيف وموضوع المراسلة
                    </label>
                    <select
                      value={directCategory}
                      onChange={(e) => setDirectCategory(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                    >
                      <option value="استفسار هندسي وشراكات مؤسسية">استفسار هندسي وشراكات مؤسسية</option>
                      <option value="عقود مشاريع خاصة واستثمار">عقود مشاريع خاصة واستثمار</option>
                      <option value="فحص معيار FQS والاعتماد">فحص معيار FQS والاعتماد</option>
                      <option value="طلب تدخل إداري أو حل نزاع">طلب تدخل إداري أو حل نزاع</option>
                      <option value="مقترح لتطوير المنصة">مقترح لتطوير المنصة</option>
                      <option value="رسالة خاصة ومباشرة للمالك">رسالة خاصة ومباشرة للمالك</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      مستوى الأهمية والاستعجال
                    </label>
                    <div className="mt-1.5 flex gap-2">
                      {[
                        { id: 'حرج', label: 'حرج وعاجل', color: 'text-rose-600 border-rose-300 bg-rose-50/60 dark:bg-rose-950/40' },
                        { id: 'عالي', label: 'أولوية عالية', color: 'text-amber-600 border-amber-300 bg-amber-50/60 dark:bg-amber-950/40' },
                        { id: 'متوسط', label: 'عادي / متوسط', color: 'text-teal-600 border-teal-300 bg-teal-50/60 dark:bg-teal-950/40' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setDirectPriority(p.id as any)}
                          className={`flex-1 rounded-xl border py-2.5 text-xs font-black transition ${
                            directPriority === p.id
                              ? `${p.color} ring-2 ring-teal-500/20 shadow-xs font-black`
                              : 'border-slate-200 bg-slate-50/60 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Sender Info: Name, Email, Phone */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      اسم المرسل أو الجهة <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={directSender}
                      onChange={(e) => setDirectSender(e.target.value)}
                      placeholder="مثال: م. أحمد عبد العزيز / شركة التقنية"
                      className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      البريد الإلكتروني للرد <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={directEmail}
                      onChange={(e) => setDirectEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      رقم الهاتف / الواتساب (اختياري)
                    </label>
                    <input
                      type="tel"
                      value={directPhone}
                      onChange={(e) => setDirectPhone(e.target.value)}
                      placeholder="+966 5x xxx xxxx / +20 1x xxx xxxx"
                      className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* 4. Subject */}
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                    عنوان الرسالة أو المراسلة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={directSubject}
                    onChange={(e) => setDirectSubject(e.target.value)}
                    placeholder="مثال: طلب شراكة تقنية لتنفيذ منصة سحابية كبرى أو اعتماد فحص FQS"
                    className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                  />
                </div>

                {/* 5. Detailed Message */}
                <div>
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                    تفاصيل الرسالة أو الاستفسار بالتفصيل <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={directMessage}
                    onChange={(e) => setDirectMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا بكل حرية، اذكر كافة المتطلبات الهندسية، تفاصيل المشروع، أو أي استفسار ترغب بتوجيهه للمالك أو الإدارة..."
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs font-medium leading-relaxed text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
                  />
                </div>

                {/* 6. Media & File Attachments */}
                <div>
                  <label className="mb-2 block text-xs font-black text-slate-800 dark:text-slate-200">
                    مرفقات ومستندات داعمة (صور، ملفات PDF، وثائق هندسية - اختياري)
                  </label>
                  <TicketAttachmentManager
                    attachments={directAttachments}
                    onChange={setDirectAttachments}
                  />
                </div>

                {/* Submit Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck size={14} className="text-teal-500" />
                    <span>مراسلة آمنة ومشفرة، وتظهر مباشرة في لوحة القيادة التنفيذية</span>
                  </div>

                  <button
                    type="submit"
                    disabled={directSending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] px-8 py-3 text-xs font-black text-white shadow-lg shadow-[#14293f]/20 transition hover:brightness-105 active:scale-95 disabled:opacity-50 dark:from-teal-600 dark:via-teal-500 dark:to-cyan-500 dark:text-slate-950"
                  >
                    <Send size={15} />
                    <span>{directSending ? 'جاري الإرسال الفوري...' : 'إرسال الرسالة إلى لوحة التحكم فوراً'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW TICKET TIMELINE & REPLIES */}
      <AnimatePresence>
        {selectedTicket && (
          <div
            onClick={() => setSelectedTicket(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl max-h-[92vh] flex flex-col dark:border-slate-800 dark:bg-[#0c1524] dark:text-slate-100"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{selectedTicket.id}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {selectedTicket.category}
                    </span>
                    <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                      أولوية: {selectedTicket.priority}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-black text-[#152e46] dark:text-white">{selectedTicket.subject}</h3>
                  {selectedTicket.projectTitle && (
                    <div className="mt-1 text-xs font-bold text-[#1f456e] dark:text-teal-300">
                      المشروع: {selectedTicket.projectTitle}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Status Update Quick Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 py-3 text-xs dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">حالة التذكرة الحالية:</span>
                <div className="flex items-center gap-1.5">
                  {(['مفتوح', 'قيد المعالجة', 'تم الحل', 'مغلق'] as Ticket['status'][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedTicket.id, st)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        selectedTicket.status === st
                          ? 'bg-[#203d62] text-white shadow-xs dark:bg-teal-600 dark:text-slate-950'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages & Timeline Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {/* Terminal Console View for Error Logs */}
                {selectedTicket.logsOrCode && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Terminal size={14} className="text-teal-500" />
                      <span>سجل الخطأ والشيفرة المرفقة (محاكي الـ Terminal):</span>
                    </div>
                    <TerminalConsole
                      value={selectedTicket.logsOrCode}
                      readOnly
                      title={`stderr.log • ${selectedTicket.subject}`}
                    />
                  </div>
                )}

                {/* Attachments Viewer (Images, Videos, Files) */}
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <TicketAttachmentViewer attachments={selectedTicket.attachments} />
                )}

                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((msg) => {
                    const isClient = msg.senderRole === 'client';
                    return (
                      <div
                        key={msg.id}
                        className={`rounded-2xl p-4 text-xs leading-relaxed ${
                          isClient
                            ? 'bg-[#f4f7fb] border border-slate-200/80 mr-4 dark:bg-slate-900/60 dark:border-slate-800'
                            : 'bg-[#eaf6f7] border border-[#c3e7e9] ml-4 dark:bg-teal-950/25 dark:border-teal-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-600 mb-1.5 dark:text-slate-300">
                          <span className={isClient ? 'text-slate-800 dark:text-white' : 'text-[#19777f] dark:text-teal-300'}>
                            {msg.sender} {isClient ? '(صاحب الطلب)' : '(المطور / الدعم)'}
                          </span>
                          <span className="text-[10px] text-slate-400">{msg.createdAt}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        {msg.codeSnippet && (
                          <div className="mt-2.5">
                            <TerminalConsole value={msg.codeSnippet} readOnly title={`snippet • ${msg.sender}`} maxHeight="200px" />
                          </div>
                        )}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2.5">
                            <TicketAttachmentViewer attachments={msg.attachments} />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="space-y-2">
                    {selectedTicket.replies?.map((r, i) => (
                      <div key={i} className="rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-700 dark:bg-slate-900/60 dark:text-slate-200 border border-slate-100 dark:border-slate-800">
                        {typeof r === 'string' ? r : r.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Input Box */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 dark:border-slate-800">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <textarea
                      rows={2}
                      value={newReplyMessage}
                      onChange={(e) => setNewReplyMessage(e.target.value)}
                      placeholder="اكتب ردك أو تقرير الصيانة والمتابعة هنا..."
                      className="w-full resize-none rounded-2xl border border-slate-200 p-3 pe-16 text-xs outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:focus:border-teal-400"
                    />
                    {/* Quick action buttons inside textarea */}
                    <div className="absolute left-2.5 bottom-2.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowReplyAttachmentManager(!showReplyAttachmentManager)}
                        className={`rounded-lg p-1.5 transition ${
                          newReplyAttachments.length > 0 || showReplyAttachmentManager
                            ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800'
                        }`}
                        title="إرفاق صور أو فيديوهات أو ملفات"
                      >
                        <UploadCloud size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReplyCodeInput(!showReplyCodeInput)}
                        className={`rounded-lg p-1.5 transition ${
                          newReplyCode || showReplyCodeInput
                            ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800'
                        }`}
                        title="إرفاق شيفرة برمجية عبر الـ Terminal"
                      >
                        <Terminal size={15} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddReply(selectedTicket.id)}
                    className="flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 text-xs font-black text-white shadow-md shadow-teal-600/20 hover:opacity-95 active:scale-95 transition"
                    title="إرسال الرد والمرفقات"
                  >
                    <Send size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReplyAttachmentManager(!showReplyAttachmentManager)}
                      className="flex items-center gap-1.5 font-bold text-teal-700 hover:underline dark:text-teal-400"
                    >
                      <UploadCloud size={14} />
                      <span>
                        {showReplyAttachmentManager
                          ? 'إخفاء مدير المرفقات'
                          : `إرفاق صور وفيديوهات وملفات ${newReplyAttachments.length > 0 ? `(${newReplyAttachments.length})` : ''}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReplyCodeInput(!showReplyCodeInput)}
                      className="flex items-center gap-1.5 font-bold text-[#1f6d7a] hover:underline dark:text-cyan-400"
                    >
                      <Terminal size={14} />
                      <span>{showReplyCodeInput ? 'إخفاء محاكي الـ Terminal' : 'إرفاق شيفرة عبر Terminal'}</span>
                    </button>
                  </div>

                  <span className="text-slate-400">
                    زمن الاستجابة وفق عقد الدعم: {selectedTicket.slaResponseHours || 12} ساعة
                  </span>
                </div>

                {/* Collapsible Attachment Manager */}
                {showReplyAttachmentManager && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <TicketAttachmentManager
                      attachments={newReplyAttachments}
                      onChange={setNewReplyAttachments}
                    />
                  </motion.div>
                )}

                {/* Collapsible Terminal Console */}
                {showReplyCodeInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <TerminalConsole
                      value={newReplyCode}
                      onChange={setNewReplyCode}
                      title="futech@reply-trace: ~ / patch-code.ts"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: CREATE NEW SUPPORT / ONGOING MAINTENANCE TICKET */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div
            onClick={() => setShowNewTicketModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto dark:border-slate-800 dark:bg-[#0c1524] dark:text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <LifeBuoy size={18} className="text-[#259199]" />
                  <h3 className="text-base font-black text-[#152e46] dark:text-white">فتح تذكرة دعم أو صيانة مستمرة</h3>
                </div>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200">المشروع المرتبط بالتذكرة *</label>
                  <select
                    value={newTicketProject}
                    onChange={(e) => setNewTicketProject(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-teal-400"
                  >
                    {store.projects.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.owner})
                      </option>
                    ))}
                    <option value="مشروع مخصص آخر">مشروع مخصص آخر خارج القائمة</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200">نوع الطلب *</label>
                    <select
                      value={newTicketCategory}
                      onChange={(e) => setNewTicketCategory(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-teal-400"
                    >
                      <option value="دعم مستمر بعد التسليم">دعم مستمر بعد التسليم</option>
                      <option value="صيانة دورية">صيانة دورية</option>
                      <option value="خلل برمجي (Bug)">خلل برمجي (Bug)</option>
                      <option value="طلب تعديل أو تحسين">طلب تعديل أو تحسين</option>
                      <option value="استفسار تقني">استفسار تقني</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200">الأولوية ومستوى الخدمة (SLA) *</label>
                    <select
                      value={newTicketPriority}
                      onChange={(e) => setNewTicketPriority(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-teal-400"
                    >
                      <option value="حرج">حرج (استجابة خلال ساعتين)</option>
                      <option value="عالي">عالي (استجابة خلال 6 ساعات)</option>
                      <option value="متوسط">متوسط (استجابة خلال 12 ساعة)</option>
                      <option value="منخفض">منخفض (استجابة خلال 24 ساعة)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200">عنوان التذكرة *</label>
                  <input
                    required
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    placeholder="مثال: تعطل مزامنة البيانات عبر الـ Webhook فجر اليوم"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200">تفاصيل المشكلة والخطوات لإعادة إنتاجها *</label>
                  <textarea
                    required
                    rows={3}
                    value={newTicketDetails}
                    onChange={(e) => setNewTicketDetails(e.target.value)}
                    placeholder="اشرح المشكلة التقنية بالتفصيل وما الذي تم تجربته..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 p-2.5 text-xs leading-relaxed outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-teal-400"
                  />
                </div>

                {/* Terminal Console for Error Logs / Code */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 font-black text-slate-800 dark:text-white">
                      <Terminal size={15} className="text-teal-600 dark:text-teal-400" />
                      <span>سجل الخطأ أو الأكواد المرفقة (محاكي الـ Terminal)</span>
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">اختياري • Shell Console</span>
                  </div>
                  <TerminalConsole
                    value={newTicketLogs}
                    onChange={setNewTicketLogs}
                    title="futech@support-terminal: ~ / error-trace.log"
                  />
                </div>

                {/* Media & File Attachments (Images, Videos, Files) */}
                <div>
                  <label className="mb-2 block font-black text-slate-800 dark:text-white">
                    مرفقات الوسائط والملفات (صور، فيديوهات، وسجلات)
                  </label>
                  <TicketAttachmentManager
                    attachments={newTicketAttachments}
                    onChange={setNewTicketAttachments}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200">اسم صاحب الطلب / الشركة *</label>
                  <input
                    required
                    value={newTicketSender}
                    onChange={(e) => setNewTicketSender(e.target.value)}
                    placeholder="مثال: شركة رفوف للتجارة"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#2ba6ae] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-teal-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-teal-600/20 hover:opacity-95 active:scale-95 transition"
                  >
                    فتح التذكرة الآن
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
