import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings2, Users, Briefcase, TicketCheck, BookOpen, Plus,
  Search, CheckCircle2, X, Pencil, Trash2, Send, ShieldCheck,
  BadgeCheck, Star, Filter, Eye, AlertCircle
} from 'lucide-react';
import { Store, Project, Developer, Ticket, Doc } from '../data/mockData';

interface AdminDashboardProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  setModal: (modal: any) => void;
}

export function AdminDashboard({ store, update, notify, setModal }: AdminDashboardProps) {
  const [tab, setTab] = useState<'overview' | 'developers' | 'projects' | 'tickets' | 'docs'>('overview');
  const [ticketStatus, setTicketStatus] = useState<string>('all');
  const [ticketSearch, setTicketSearch] = useState<string>('');
  const [devSearch, setDevSearch] = useState<string>('');
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [ticketReply, setTicketReply] = useState<string>('');

  // Computed stats
  const totalProjects = store.projects.length;
  const totalDevelopers = store.developers.length;
  const openTickets = store.tickets.filter((t) => t.status !== 'مغلق').length;

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

  return (
    <div className="space-y-8" dir="rtl">
      {/* Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="text-[10px] font-black tracking-wider text-[#249fa6]">
            مركز التحكم الرئيسي
          </div>
          <h1 className="mt-1 text-2xl font-black text-[#152a40]">لوحة إدارة المنصة</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            متابعة المشرفين على المشاريع، المطورين المعتمدين، وخدمة الدعم الفني
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbebec] bg-[#eef8f8] px-3 py-1 text-xs font-bold text-[#1a7f87]">
            <ShieldCheck size={14} />
            <span>صلاحيات المدير الكاملة</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-1">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: Settings2 },
          { id: 'developers', label: `المطورون (${store.developers.length})`, icon: Users },
          { id: 'projects', label: `المشاريع (${store.projects.length})`, icon: Briefcase },
          { id: 'tickets', label: `تذاكر الدعم (${openTickets})`, icon: TicketCheck },
          { id: 'docs', label: `الوثائق (${store.docs.length})`, icon: BookOpen },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                tab === t.id
                  ? 'bg-[#203d62] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={15} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold text-slate-500">إجمالي المشاريع المنشورة</div>
              <div className="mt-2 text-2xl font-black text-[#172c43]">{totalProjects}</div>
              <div className="mt-1 text-[11px] text-slate-400">
                {store.projects.filter((p) => p.status === 'متاح').length} مشاريع متاحة حالياً
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold text-slate-500">المطورون المعتمدون</div>
              <div className="mt-2 text-2xl font-black text-[#172c43]">{totalDevelopers}</div>
              <div className="mt-1 text-[11px] text-slate-400">متوسط مؤشر FQS العام: 91/100</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold text-slate-500">التذاكر بانتظار المعالجة</div>
              <div className="mt-2 text-2xl font-black text-[#e08f24]">{openTickets}</div>
              <div className="mt-1 text-[11px] text-slate-400">متوسط زمن الاستجابة: 24 دقيقة</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="text-xs font-bold text-slate-500">نسبة رضا العملاء</div>
              <div className="mt-2 text-2xl font-black text-[#2e9259]">98.8%</div>
              <div className="mt-1 text-[11px] text-slate-400">بناءً على 120 تقييم تسليم</div>
            </div>
          </div>

          {/* Quick Management Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#152a3f]">آخر المشاريع المضافة</h3>
                <button
                  onClick={() => setTab('projects')}
                  className="text-xs font-bold text-[#208f97] hover:underline"
                >
                  عرض الكل
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {store.projects.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                  >
                    <div>
                      <div className="text-xs font-black text-[#162b40]">{p.title}</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {p.owner} · ميزانية {p.budget} ر.س
                      </div>
                    </div>
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-xs">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#152a3f]">طلبات الدعم العاجلة</h3>
                <button
                  onClick={() => setTab('tickets')}
                  className="text-xs font-bold text-[#208f97] hover:underline"
                >
                  عرض الكل
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {store.tickets.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                  >
                    <div>
                      <div className="text-xs font-black text-[#162b40]">{t.subject}</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        من: {t.owner} · أولوية: {t.priority}
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        t.status === 'مفتوح'
                          ? 'bg-[#feecec] text-[#c93b3b]'
                          : t.status === 'قيد المعالجة'
                          ? 'bg-[#fef6e7] text-[#be7b19]'
                          : 'bg-[#eaf6ef] text-[#2c8d57]'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developers Management Tab */}
      {tab === 'developers' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={devSearch}
                onChange={(e) => setDevSearch(e.target.value)}
                placeholder="ابحث بالاسم أو التخصص..."
                className="w-full rounded-xl border border-slate-200 pe-3 ps-9 py-2 text-xs outline-none focus:border-[#2ba3ac]"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white shadow-xs">
            {filteredDevs.map((dev) => (
              <div
                key={dev.id}
                className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-[#172d44]">{dev.name}</h4>
                      {dev.verified && <BadgeCheck size={15} className="text-[#2faab3]" />}
                    </div>
                    <p className="text-[11px] text-slate-500">{dev.specialty}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{dev.location}</span>
                      <span>·</span>
                      <span className="font-bold text-[#1f878f]">FQS: {dev.fqs}</span>
                      <span>·</span>
                      <span>سعر: {dev.hourlyRate} ر.س/س</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleDevVerify(dev)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      dev.verified
                        ? 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        : 'bg-[#203d62] text-white hover:bg-[#2b5182]'
                    }`}
                  >
                    {dev.verified ? 'إلغاء التوثيق' : 'توثيق المطور'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Management Tab */}
      {tab === 'projects' && (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white shadow-xs">
            {store.projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {project.status}
                    </span>
                    <h4 className="text-xs font-black text-[#162c42]">{project.title}</h4>
                  </div>
                  <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
                    {project.description}
                  </p>
                  <div className="mt-2 text-[10px] text-slate-400">
                    صاحب المشروع: {project.owner} · الميزانية: {project.budget} ر.س · الموعد:{' '}
                    {project.deadline}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={13} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tickets Support Tab */}
      {tab === 'tickets' && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Tickets List */}
          <div className="space-y-3 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <input
                type="text"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                placeholder="ابحث في التذاكر..."
                className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none"
              />
            </div>

            <div className="space-y-2">
              {filteredTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    activeTicket?.id === t.id
                      ? 'border-[#2da8b1] bg-[#eef8f8]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#162a3f]">{t.subject}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${
                        t.status === 'مفتوح'
                          ? 'bg-red-100 text-red-700'
                          : t.status === 'قيد المعالجة'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {t.owner} · {t.createdAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Ticket Chat / Management */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-7">
            {activeTicket ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-[#162a40]">{activeTicket.subject}</h3>
                    <p className="text-[11px] text-slate-400">
                      مقدم الطلب: {activeTicket.owner} · تصنيف: {activeTicket.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={activeTicket.status}
                      onChange={(e) => handleToggleTicketStatus(activeTicket, e.target.value as any)}
                      className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 outline-none"
                    >
                      <option value="مفتوح">مفتوح</option>
                      <option value="قيد المعالجة">قيد المعالجة</option>
                      <option value="مغلق">مغلق</option>
                    </select>
                  </div>
                </div>

                {/* Conversation History */}
                <div className="max-h-72 space-y-3 overflow-y-auto rounded-2xl bg-[#fafbfc] p-4 text-xs">
                  {(activeTicket.replies || []).map((reply, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-3 leading-relaxed ${
                        index === 0
                          ? 'bg-white border border-slate-200 text-slate-700'
                          : 'bg-[#e5f5f6] text-[#136168]'
                      }`}
                    >
                      <div className="mb-1 text-[10px] font-bold text-slate-400">
                        {index === 0 ? `رسالة العميل (${activeTicket.owner}):` : 'رد فريق الدعم:'}
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
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-[#2ba3ac]"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendTicketReply()}
                  />
                  <button
                    onClick={handleSendTicketReply}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#203d62] px-5 py-2 text-xs font-bold text-white hover:bg-[#2b5182]"
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

      {/* Docs Management Tab */}
      {tab === 'docs' && (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white shadow-xs">
            {store.docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {doc.category}
                    </span>
                    <h4 className="text-xs font-black text-[#162a40]">{doc.title}</h4>
                  </div>
                  <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500">
                    {doc.content}
                  </p>
                </div>
                <div className="text-[10px] text-slate-400">آخر تحديث: {doc.updatedAt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
