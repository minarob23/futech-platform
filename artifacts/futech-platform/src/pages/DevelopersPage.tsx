import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users, BadgeCheck, Star, MapPin, Clock, DollarSign,
  Briefcase, CheckCircle2, ChevronDown, Filter, Sparkles, MessageCircle,
  ArrowLeft, X, Layers, ShieldCheck, Code, Globe, UserPlus, SlidersHorizontal,
  LayoutGrid, List
} from 'lucide-react';
import { Developer, Project, Conversation, Store } from '../data/mockData';

interface DevelopersPageProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
}

export function DevelopersPage({ store, update, notify, go }: DevelopersPageProps) {
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [minFqs, setMinFqs] = useState<number>(0);
  const [maxRate, setMaxRate] = useState<number>(300);
  const [sortBy, setSortBy] = useState<'fqs' | 'rating' | 'projects' | 'rate'>('fqs');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteModalDev, setInviteModalDev] = useState<Developer | null>(null);

  // New developer form state for "Join as Developer"
  const [newName, setNewName] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCategory, setNewCategory] = useState<'fullstack' | 'frontend' | 'backend' | 'mobile' | 'ai' | 'devops'>('fullstack');
  const [newLocation, setNewLocation] = useState('الرياض، المملكة العربية السعودية');
  const [newHourlyRate, setNewHourlyRate] = useState(150);
  const [newBio, setNewBio] = useState('');
  const [newSkills, setNewSkills] = useState('React, TypeScript, Node.js');
  const [newWork, setNewWork] = useState('بناء منصات متجاوبة وأنظمة ويب حديثة');

  // Filter categories
  const categories = [
    { id: 'all', label: 'جميع التخصصات' },
    { id: 'fullstack', label: 'تطوير شامل' },
    { id: 'frontend', label: 'واجهات أمامية' },
    { id: 'backend', label: 'أنظمة خلفية' },
    { id: 'mobile', label: 'تطبيقات الجوال' },
    { id: 'ai', label: 'ذكاء اصطناعي' },
    { id: 'devops', label: 'سحابة وDevOps' },
  ];

  // Quick skill pills
  const popularSkills = ['React', 'Next.js', 'Node.js', 'Flutter', 'FastAPI', 'PostgreSQL', 'Laravel', 'Docker'];

  // Filtered & Sorted developers
  const filteredDevelopers = useMemo(() => {
    return store.developers
      .filter((dev) => {
        // Search term
        const matchesSearch =
          !search.trim() ||
          dev.name.toLowerCase().includes(search.toLowerCase()) ||
          dev.specialty.toLowerCase().includes(search.toLowerCase()) ||
          dev.bio.toLowerCase().includes(search.toLowerCase()) ||
          dev.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

        // Category
        const matchesCategory = selectedCategory === 'all' || dev.category === selectedCategory;

        // Availability
        const matchesAvailability =
          selectedAvailability === 'all' || dev.availability === selectedAvailability;

        // Level
        const matchesLevel = selectedLevel === 'all' || dev.level === selectedLevel;

        // Min FQS
        const matchesFqs = dev.fqs >= minFqs;

        // Max Rate
        const matchesRate = dev.hourlyRate <= maxRate;

        return matchesSearch && matchesCategory && matchesAvailability && matchesLevel && matchesFqs && matchesRate;
      })
      .sort((a, b) => {
        if (sortBy === 'fqs') return b.fqs - a.fqs;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'projects') return b.completedProjects - a.completedProjects;
        if (sortBy === 'rate') return a.hourlyRate - b.hourlyRate;
        return 0;
      });
  }, [store.developers, search, selectedCategory, selectedAvailability, selectedLevel, minFqs, maxRate, sortBy]);

  // Start chat helper
  const handleStartChat = (dev: Developer) => {
    const existing = store.conversations.find(
      (c) => c.otherUser === dev.name
    );
    if (existing) {
      go(`/chat?conversation=${existing.id}`);
      return;
    }
    const newConv: Conversation = {
      id: 'conv-' + Math.random().toString(36).substring(2, 9),
      projectId: '',
      otherUser: dev.name,
      otherUserAvatar: dev.avatar,
      online: true,
      messages: [
        {
          id: 'msg-' + Math.random().toString(36).substring(2, 9),
          body: `مرحبًا يا ${dev.name.split(' ')[0]}، اطلعت على ملفك المهني المتميز في فوتيك وأرغب في مناقشة تفاصيل مشروع برمجي معك.`,
          sender: 'me',
          time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
          read: true,
        },
      ],
    };
    update('conversations', [newConv, ...store.conversations]);
    notify(`تم فتح محادثة جديدة مع ${dev.name}`);
    go(`/chat?conversation=${newConv.id}`);
  };

  // Add new developer
  const handleCreateDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSpecialty.trim() || !newBio.trim()) {
      notify('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newDev: Developer = {
      id: 'dev-' + Math.random().toString(36).substring(2, 9),
      name: newName.trim(),
      avatar: '/images/dev-male.jpg',
      specialty: newSpecialty.trim(),
      category: newCategory,
      location: newLocation.trim(),
      country: 'السعودية',
      hourlyRate: Number(newHourlyRate),
      fqs: 88,
      fqsBreakdown: {
        completionRate: 95,
        onTimeBudget: 94,
        clientRating: 98,
        repeatHireRate: 88,
        tests: 90,
        codeQuality: 88,
        deliveryRate: 92,
        security: 84
      },
      rating: 5.0,
      reviewsCount: 1,
      completedProjects: 0,
      experienceYears: 4,
      availability: 'متاح الآن',
      level: 'متوسط (Mid-level)',
      skills: newSkills.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
      bio: newBio.trim(),
      work: newWork.trim(),
      portfolio: [
        {
          title: newWork.trim(),
          description: 'مشروع رئيسي يوضح الجاهزية والالتزام بأفضل ممارسات البرمجة.',
          tech: newSkills.split(/[,،]/).map((s) => s.trim()).slice(0, 3),
        },
      ],
      verified: true,
    };

    update('developers', [newDev, ...store.developers]);
    notify('مرحبًا بك! تمت إضافة ملفك الشخصي كمطور معتمد بنجاح');
    setShowJoinModal(false);
    setSelectedDev(newDev);
  };

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedAvailability('all');
    setSelectedLevel('all');
    setMinFqs(0);
    setMaxRate(300);
    setSortBy('fqs');
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Hero Search Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#122438] via-[#1a334e] to-[#0d1d2e] p-6 text-white shadow-xl md:p-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#39c0c9]/10 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-[#1da0aa]/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#39c0c9]/30 bg-[#39c0c9]/10 px-3.5 py-1 text-xs font-bold text-[#67d9df]">
            <Sparkles size={14} />
            <span>نخبة المطورين والمهندسين البرمجيين</span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight md:text-4xl">
            ابحث عن المطور الأنسب لمشروعك البرمجي
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
            تصفّح ملفات المطورين المعتمدين والموثقين وفق مؤشر جودة المستقل (FQS)،
            قارن المهارات والخبرات السابقة وتواصل معهم مباشرة لبدء تنفيذ مشروعك.
          </p>

          {/* Main Search Bar */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم، المهارة (مثل: React, Python)، أو التخصص..."
                className="w-full rounded-2xl border border-white/10 bg-white/10 py-3.5 pe-4 ps-11 text-sm text-white placeholder-slate-400 backdrop-blur-md outline-none transition focus:border-[#42c5cc] focus:bg-white/15 focus:ring-2 focus:ring-[#42c5cc]/20"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowJoinModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2bb2bb] to-[#1e97a0] px-6 py-3.5 text-xs font-extrabold text-[#09202f] shadow-lg shadow-[#2bb2bb]/20 transition hover:brightness-110 active:scale-95"
            >
              <UserPlus size={16} />
              <span>انضم كمطور معتمد</span>
            </button>
          </div>

          {/* Quick Skill Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">المهارات الشائعة:</span>
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => setSearch(skill)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                  search.toLowerCase() === skill.toLowerCase()
                    ? 'border-[#3ec1c8] bg-[#3ec1c8] text-[#0d2232]'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Specialization Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              selectedCategory === cat.id
                ? 'bg-[#203d62] text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter & Sort Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Detailed Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Availability */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">الحالة:</span>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#38b5bd]"
              >
                <option value="all">الكل</option>
                <option value="متاح الآن">متاح الآن فوراً</option>
                <option value="متاح جزئياً">متاح جزئياً</option>
                <option value="متاح قريباً">متاح قريباً</option>
              </select>
            </div>

            {/* Level */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">المستوى:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#38b5bd]"
              >
                <option value="all">كل المستويات</option>
                <option value="خبير (Senior)">خبير (Senior)</option>
                <option value="متوسط (Mid-level)">متوسط (Mid-level)</option>
                <option value="واعد (Junior)">واعد (Junior)</option>
              </select>
            </div>

            {/* FQS Rating Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">معيار FQS:</span>
              <select
                value={minFqs}
                onChange={(e) => setMinFqs(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#38b5bd]"
              >
                <option value={0}>الكل</option>
                <option value={90}>+90 (خبير متميز)</option>
                <option value={85}>+85 (متقدم جداً)</option>
                <option value={80}>+80 (كفاءة عالية)</option>
              </select>
            </div>

            {/* Max Hourly Rate */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">أقصى سعر للساعة:</span>
              <span className="font-bold text-[#203d62]">{maxRate} ر.س</span>
              <input
                type="range"
                min={80}
                max={300}
                step={10}
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="h-1.5 w-24 accent-[#29aab3]"
              />
            </div>
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">ترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#38b5bd]"
              >
                <option value="fqs">الأعلى معيار FQS</option>
                <option value="rating">الأعلى تقييماً من العملاء</option>
                <option value="projects">الأكثر مشاريع منجزة</option>
                <option value="rate">الأقل سعرًا للساعة</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-white text-[#203d62] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="عرض شبكي"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-1.5 transition ${viewMode === 'list' ? 'bg-white text-[#203d62] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                title="عرض قائمة"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter & Active Filters Tag */}
        <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#203d62]">{filteredDevelopers.length}</span>
            <span>مطور مطابق لمعايير البحث</span>
          </div>

          {(search || selectedCategory !== 'all' || selectedAvailability !== 'all' || minFqs > 0 || maxRate < 300) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-bold text-[#2798a0] hover:underline"
            >
              <X size={13} />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* Developers Results Listing */}
      {filteredDevelopers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#ebf7f7] text-[#2ba3ac]">
            <Search size={28} />
          </div>
          <h3 className="mt-4 text-base font-extrabold text-[#1f3650]">لا توجد نتائج مطابقة لبحثك</h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-500">
            لم نجد مطورين يطابقون جميع الفلاتر المحددة حالياً. جرّب إزالة بعض الفلاتر أو توسيع مجال السعر ونقاط FQS.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={resetFilters}
              className="rounded-xl bg-[#203d62] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#284c78]"
            >
              عرض جميع المطورين
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              انضم كمطور جديد
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevelopers.map((dev) => (
            <motion.div
              key={dev.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition hover:border-[#68c9cf] hover:shadow-lg hover:shadow-slate-200/50"
            >
              <div className="p-5">
                {/* Header: Avatar, Name, FQS Badge */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <span
                      className={`absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        dev.availability === 'متاح الآن'
                          ? 'bg-[#3bb87c]'
                          : dev.availability === 'متاح جزئياً'
                          ? 'bg-[#dfa637]'
                          : 'bg-slate-400'
                      }`}
                      title={dev.availability}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-extrabold text-[#1a2d42]">
                        {dev.name}
                      </h3>
                      {dev.verified && (
                        <BadgeCheck size={16} className="shrink-0 text-[#29aab3]" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                      {dev.specialty}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{dev.location}</span>
                    </div>
                  </div>

                  {/* FQS Rating Badge */}
                  <div className="flex shrink-0 flex-col items-center rounded-2xl border border-[#daf2f3] bg-[#edf8f9] px-2.5 py-1.5 text-center">
                    <span className="text-xs font-black text-[#1e8992]">{dev.fqs}</span>
                    <span className="text-[9px] font-bold text-[#35979f]">FQS</span>
                  </div>
                </div>

                {/* Rating & Completed Projects Stats */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Star size={13} className="fill-[#e5a93b] text-[#e5a93b]" />
                    <span className="font-extrabold text-slate-800">{dev.rating}</span>
                    <span className="text-[10px] text-slate-400">({dev.reviewsCount})</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600">
                    <Briefcase size={12} className="text-slate-400" />
                    <span>{dev.completedProjects} مشروع منجز</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="text-[11px] font-bold text-[#1f3854]">
                    {dev.hourlyRate} <span className="text-[9px] text-slate-500">ر.س/س</span>
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {dev.bio}
                </p>

                {/* Skills tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dev.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                  {dev.skills.length > 4 && (
                    <span className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                      +{dev.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-2 border-t border-slate-100 bg-[#fafbfc] p-3.5">
                <button
                  onClick={() => setSelectedDev(dev)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-700 transition hover:border-[#33a3ab] hover:bg-[#f6fcfa] hover:text-[#187e85]"
                >
                  عرض الملف
                </button>
                <button
                  onClick={() => handleStartChat(dev)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2b5180] active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>محادثة</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredDevelopers.map((dev) => (
            <div
              key={dev.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-[#68c9cf] md:flex-row md:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <span
                    className={`absolute -bottom-1 -left-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                      dev.availability === 'متاح الآن'
                        ? 'bg-[#3bb87c]'
                        : dev.availability === 'متاح جزئياً'
                        ? 'bg-[#dfa637]'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#1a2d42]">{dev.name}</h3>
                    {dev.verified && <BadgeCheck size={16} className="text-[#29aab3]" />}
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {dev.specialty}
                    </span>
                    <span
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        dev.availability === 'متاح الآن'
                          ? 'bg-[#e8f7ee] text-[#2b905f]'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {dev.availability}
                    </span>
                  </div>

                  <p className="max-w-xl text-xs leading-relaxed text-slate-600">{dev.bio}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dev.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Stats & Actions */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3 md:flex-col md:items-end md:border-none md:pt-0">
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="font-extrabold text-[#203d62]">
                      {dev.hourlyRate} <span className="text-[10px] text-slate-500">ر.س/س</span>
                    </div>
                    <div className="text-[10px] text-slate-400">سعر الساعة</div>
                  </div>

                  <div className="flex items-center gap-1 rounded-xl bg-[#eef9fa] px-3 py-1.5">
                    <ShieldCheck size={14} className="text-[#21959e]" />
                    <span className="font-black text-[#1e8b94]">{dev.fqs}</span>
                    <span className="text-[10px] font-bold text-[#3298a0]">FQS</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDev(dev)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    الملف الشامل
                  </button>
                  <button
                    onClick={() => handleStartChat(dev)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-4 py-2 text-xs font-bold text-white hover:bg-[#2b5180]"
                  >
                    <MessageCircle size={14} />
                    <span>محادثة</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Developer Profile Modal */}
      <AnimatePresence>
        {selectedDev && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedDev(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-[#172c44] to-[#203d62] p-6 text-white">
                <button
                  onClick={() => setSelectedDev(null)}
                  className="absolute left-5 top-5 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <img
                    src={selectedDev.avatar}
                    alt={selectedDev.name}
                    className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold">{selectedDev.name}</h2>
                      {selectedDev.verified && (
                        <BadgeCheck size={20} className="text-[#41c3ca]" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-[#82d7db]">
                      {selectedDev.specialty}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {selectedDev.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Briefcase size={13} />
                        {selectedDev.experienceYears} سنوات خبرة
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Star size={13} className="fill-[#f2b343] text-[#f2b343]" />
                        {selectedDev.rating} ({selectedDev.reviewsCount} تقييم)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Body */}
              <div className="max-h-[65vh] space-y-6 overflow-y-auto p-6 text-xs text-slate-700">
                {/* FQS Quality Standard Breakdown */}
                <div className="rounded-2xl border border-[#cbebec] bg-[#f2f9f9] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-[#1c7880]">
                      <ShieldCheck size={18} />
                      <span>مؤشر جودة المستقل (FQS): {selectedDev.fqs}/100</span>
                    </div>
                    <span className="rounded-full bg-[#1c7880] px-3 py-0.5 text-[11px] font-bold text-white">
                      مطور معتمد
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500">
                    نظام تقييم خوارزمي لكفاءة والتزام المطور يحدد أولوية ظهوره وفرص فوزه بالمشاريع البرمجية
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-white p-2.5 text-center shadow-xs">
                      <div className="text-sm font-extrabold text-[#1c7880]">
                        %{selectedDev.fqsBreakdown.completionRate ?? selectedDev.fqsBreakdown.tests ?? 95}
                      </div>
                      <div className="mt-0.5 text-[10px] font-bold text-slate-700">معدل إكمال المشاريع</div>
                      <div className="text-[9px] text-slate-400">Completion Rate</div>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 text-center shadow-xs">
                      <div className="text-sm font-extrabold text-[#1c7880]">
                        %{selectedDev.fqsBreakdown.onTimeBudget ?? selectedDev.fqsBreakdown.codeQuality ?? 96}
                      </div>
                      <div className="mt-0.5 text-[10px] font-bold text-slate-700">الوقت والميزانية</div>
                      <div className="text-[9px] text-slate-400">On Time & Budget</div>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 text-center shadow-xs">
                      <div className="text-sm font-extrabold text-[#1c7880]">
                        %{selectedDev.fqsBreakdown.clientRating ?? selectedDev.fqsBreakdown.deliveryRate ?? 98}
                      </div>
                      <div className="mt-0.5 text-[10px] font-bold text-slate-700">تقييم العملاء</div>
                      <div className="text-[9px] text-slate-400">Client Rating</div>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 text-center shadow-xs">
                      <div className="text-sm font-extrabold text-[#1c7880]">
                        %{selectedDev.fqsBreakdown.repeatHireRate ?? selectedDev.fqsBreakdown.security ?? 90}
                      </div>
                      <div className="mt-0.5 text-[10px] font-bold text-slate-700">التوظيف المتكرر</div>
                      <div className="text-[9px] text-slate-400">Repeat Hire Rate</div>
                    </div>
                  </div>
                </div>

                {/* About Bio */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#1f3750]">نبذة مهنية</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{selectedDev.bio}</p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#1f3750]">المهارات والتقنيات</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDev.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-xl bg-slate-100 px-3 py-1 font-bold text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio / Featured Works */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#1f3750]">أبرز المشاريع السابقة</h4>
                  <div className="mt-2.5 space-y-3">
                    {selectedDev.portfolio.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-100 bg-[#f9fafc] p-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-extrabold text-[#1b2f44]">{item.title}</h5>
                          {item.metrics && (
                            <span className="shrink-0 rounded-md bg-[#e4f6f5] px-2 py-0.5 text-[10px] font-bold text-[#1f878f]">
                              {item.metrics}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-xs text-slate-600">{item.description}</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile Modal Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                <div>
                  <span className="text-xs text-slate-500">سعر الساعة المقترح:</span>
                  <div className="text-base font-black text-[#1b344e]">
                    {selectedDev.hourlyRate} ر.س / ساعة
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDev(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    إغلاق
                  </button>
                  <button
                    onClick={() => {
                      const dev = selectedDev;
                      setSelectedDev(null);
                      handleStartChat(dev);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#203d62] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#284f80]"
                  >
                    <MessageCircle size={15} />
                    <span>بدء محادثة مباشرة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join as Developer Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="my-auto w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-[#f8fafc] px-6 py-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#1a2e44]">
                    انضم كمطور معتمد في فوتيك
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    أنشئ ملفك البرمجي وابدأ في تلقي عروض المشاريع
                  </p>
                </div>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleCreateDeveloper} className="space-y-4 p-6 text-xs">
                <div>
                  <label className="block font-bold text-slate-700">الاسم الكامل *</label>
                  <input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: أحمد عبد الله الغامدي"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#33b1b9]"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-700">المسمى والتخصص *</label>
                    <input
                      required
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="مثال: مطور Full-Stack React & Node"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#33b1b9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">التصنيف الرئيسي *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-[#33b1b9]"
                    >
                      <option value="fullstack">تطوير شامل (Full-Stack)</option>
                      <option value="frontend">واجهات أمامية (Frontend)</option>
                      <option value="backend">أنظمة خلفية (Backend)</option>
                      <option value="mobile">تطبيقات الجوال (Mobile)</option>
                      <option value="ai">ذكاء اصطناعي (AI)</option>
                      <option value="devops">حلول سحابية (DevOps)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-700">المدينة والدولة</label>
                    <input
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#33b1b9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700">سعر الساعة التقريبي (ر.س)</label>
                    <input
                      type="number"
                      min={50}
                      max={500}
                      value={newHourlyRate}
                      onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#33b1b9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">المهارات التقنية (مفصولة بفاصلة) *</label>
                  <input
                    required
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="React, Next.js, Node.js, PostgreSQL"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#33b1b9]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">النبذة المهنية *</label>
                  <textarea
                    required
                    rows={3}
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    placeholder="اكتب نبذة مختصرة عن خبراتك وطريقة عملك وأبرز الأنظمة التي بنتها..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-relaxed outline-none focus:border-[#33b1b9]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">عينة عمل أو مشروع مميز</label>
                  <input
                    value={newWork}
                    onChange={(e) => setNewWork(e.target.value)}
                    placeholder="لوحة إدارة متجر مع نظام تقارير لحظي"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#33b1b9]"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#203d62] px-6 py-2.5 font-bold text-white shadow-md hover:bg-[#284e7d]"
                  >
                    <CheckCircle2 size={15} />
                    <span>تأكيد التسجيل ونشر الملف</span>
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
