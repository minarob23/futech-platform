import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Lightbulb, Sparkles, ThumbsUp, Send, Filter, CheckCircle2,
  Clock, ArrowLeft, ArrowUpRight, ShieldCheck, Code2, Layers,
  Check, Flame, Compass, GitMerge, Award, ChevronDown, Plus,
  MessageSquare, UserCheck, Terminal, AlertCircle
} from 'lucide-react';
import { PlatformSuggestion } from '../types';

interface SuggestionsPageProps {
  notify: (msg: string) => void;
  go?: (path: string) => void;
}

const STORAGE_KEY = 'futech_suggestions_v1';
const VOTED_KEY = 'futech_suggestions_voted';

// Initial suggestions start empty (real data only)
const DEFAULT_PROPOSALS: PlatformSuggestion[] = [];

export function SuggestionsPage({ notify, go }: SuggestionsPageProps) {
  // Load suggestions from localStorage or defaults
  const [suggestions, setSuggestions] = useState<PlatformSuggestion[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (s) => !['sug-1', 'sug-2', 'sug-3', 'sug-4', 'sug-5'].includes(s.id)
          );
        }
      }
    } catch {}
    return [];
  });

  // Track upvoted IDs
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(VOTED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Filters & Sorting State
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'votes' | 'recent'>('votes');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Proposal Form State
  const [category, setCategory] = useState<PlatformSuggestion['category']>('ميزة برمجية');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Persist suggestions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
    } catch {}
  }, [suggestions]);

  // Persist upvotes
  useEffect(() => {
    try {
      localStorage.setItem(VOTED_KEY, JSON.stringify(upvotedIds));
    } catch {}
  }, [upvotedIds]);

  // Handle Vote
  const handleVote = (id: string) => {
    if (upvotedIds.includes(id)) {
      // Toggle off vote
      setUpvotedIds((prev) => prev.filter((i) => i !== id));
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, votes: Math.max(0, s.votes - 1) } : s))
      );
      notify('تم إلغاء تصويتك للمقترح');
    } else {
      // Add vote
      setUpvotedIds((prev) => [...prev, id]);
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s))
      );
      notify('🔥 شكرًا لتصويتك! تم تسجيل رأيك في أولويات التطوير');
    }
  };

  // Submit New Suggestion
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      notify('يرجى كتابة عنوان وتفاصيل المقترح');
      return;
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newSuggestion: PlatformSuggestion = {
      id: 'sug-' + Date.now(),
      category,
      title: title.trim(),
      description: description.trim(),
      author: author.trim() || 'عضو في مجتمع فوتيك',
      votes: 1,
      status: 'قيد الدراسة والتقييم',
      date: 'الآن',
      tags: tags.length > 0 ? tags : undefined,
    };

    setSuggestions((prev) => [newSuggestion, ...prev]);
    setUpvotedIds((prev) => [...prev, newSuggestion.id]);
    setTitle('');
    setDescription('');
    setAuthor('');
    setTagInput('');
    setShowSubmitModal(false);
    notify('✨ تم إرسال مقترحك بنجاح وسيتلقى تصويتات مجتمع المطورين والمهندسين!');
  };

  // Filtered & Sorted Suggestions
  const filteredSuggestions = useMemo(() => {
    let result = suggestions.filter((s) => {
      const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchCat && matchStatus;
    });

    if (sortBy === 'votes') {
      result.sort((a, b) => b.votes - a.votes);
    } else {
      // by recent (id or default order)
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [suggestions, categoryFilter, statusFilter, sortBy]);

  const categories = [
    { id: 'all', label: 'كافة المجالات' },
    { id: 'ميزة برمجية', label: 'ميزة برمجية' },
    { id: 'معيار FQS', label: 'معيار FQS وجودة الكود' },
    { id: 'أدوات المطورين', label: 'أدوات المطورين' },
    { id: 'أنظمة الضمان والأمان', label: 'الأمان ومحفظة Escrow' },
    { id: 'تحسين واجهة', label: 'تحسين الواجهة والتجربة' },
    { id: 'اقتراح عام', label: 'اقتراح عام' },
  ];

  const totalVotes = useMemo(() => {
    return suggestions.reduce((sum, s) => sum + s.votes, 0);
  }, [suggestions]);

  const acceptedCount = useMemo(() => {
    return suggestions.filter((s) => s.status === 'تم تنفيذه بنجاح' || s.status === 'مقبول وقيد التطوير').length;
  }, [suggestions]);

  return (
    <div className="space-y-10" dir="rtl">
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. Hero Innovation Header                               */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 via-[#102238] to-[#0a182a] p-7 text-white shadow-xl md:p-10 dark:border-white/10">
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-35"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-300 border border-amber-500/20 backdrop-blur-md">
              <Lightbulb size={13} className="text-amber-400" />
              <span>مقترحات وتطوير المنصة • FuTech Innovation Hub</span>
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">
              شاركنا أفكارك الهندسية وصوّت لمستقبل منصة فوتيك
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
              نظام مفتوح وشفاف يتيح للمطورين المعتمدين وأصحاب المشاريع اقتراح ميزات برمجية جديدة،
              تحسينات لمعيار جودة الشيفرة (FQS)، والتصويت التفاعلي المباشر لتحديد أولويات خارطة الطريق.
            </p>

            {/* Quick Metrics */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 border border-white/10 backdrop-blur-xs">
                <Flame size={15} className="text-amber-400" />
                <span>إجمالي الأصوات: <b className="text-white">{totalVotes} صوت</b></span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 border border-white/10 backdrop-blur-xs">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>مقترحات معتمدة ومنفذة: <b className="text-white">{acceptedCount} ميزة</b></span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 px-6 py-3.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:scale-102 hover:shadow-xl active:scale-98"
            >
              <Plus size={16} className="stroke-[3]" />
              <span>أضف مقترح تطوير جديد</span>
            </button>

            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-black text-white backdrop-blur-md transition hover:bg-white/10"
            >
              <span>مركز التوثيق ومعايير FQS</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. Filter & Sort Bar                                    */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-white/10 dark:bg-[#0c1524]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-[280px]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                categoryFilter === cat.id
                  ? 'bg-amber-500/15 text-amber-700 border border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status & Sort Controls */}
        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
          >
            <option value="all">كل الحالات</option>
            <option value="قيد الدراسة والتقييم">قيد الدراسة والتقييم</option>
            <option value="مقبول وقيد التطوير">مقبول وقيد التطوير</option>
            <option value="تم تنفيذه بنجاح">تم تنفيذه بنجاح</option>
          </select>

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
            <button
              onClick={() => setSortBy('votes')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-black transition ${
                sortBy === 'votes'
                  ? 'bg-white text-amber-600 shadow-2xs dark:bg-[#152338] dark:text-amber-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Flame size={13} />
              <span>الأكثر تصويتاً</span>
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-black transition ${
                sortBy === 'recent'
                  ? 'bg-white text-slate-900 shadow-2xs dark:bg-[#152338] dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Clock size={13} />
              <span>الأحدث</span>
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. Suggestions Grid                                     */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-white/10">
            <Lightbulb size={36} className="mx-auto text-amber-500/50" />
            <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-white">
              لا توجد مقترحات في هذا التصنيف حالياً
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              كن أول من يطرح فكرة هندسية لتطوير المنصة في هذا القسم!
            </p>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-amber-400 transition"
            >
              <Plus size={14} />
              <span>إضافة مقترح جديد</span>
            </button>
          </div>
        ) : (
          filteredSuggestions.map((sug) => {
            const hasVoted = upvotedIds.includes(sug.id);

            const statusColors = {
              'قيد الدراسة والتقييم': 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300',
              'مقبول وقيد التطوير': 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:text-cyan-300',
              'تم تنفيذه بنجاح': 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300',
            };

            return (
              <motion.div
                key={sug.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex flex-col justify-between gap-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition hover:border-amber-400/60 hover:shadow-md sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#0c1524] dark:hover:border-amber-400/40"
              >
                {/* Content */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-700 dark:bg-white/[0.05] dark:text-slate-300">
                      {sug.category}
                    </span>

                    <span
                      className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-black ${
                        statusColors[sug.status as keyof typeof statusColors] || statusColors['قيد الدراسة والتقييم']
                      }`}
                    >
                      {sug.status}
                    </span>

                    <span className="text-[11px] font-medium text-slate-400">
                      {sug.date}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition dark:text-white dark:group-hover:text-amber-400">
                    {sug.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {sug.description}
                  </p>

                  {/* Tags & Author */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="text-slate-400">
                      مقدم المقترح: <b className="text-slate-700 dark:text-slate-200">{sug.author}</b>
                    </span>

                    {sug.tags && sug.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 ms-2">
                        {sug.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Voting Button */}
                <div className="flex shrink-0 items-center justify-end sm:flex-col sm:justify-center">
                  <button
                    onClick={() => handleVote(sug.id)}
                    className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black transition-all active:scale-95 ${
                      hasVoted
                        ? 'border-amber-500 bg-amber-500/15 text-amber-700 shadow-sm dark:bg-amber-500/20 dark:text-amber-300'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    <ThumbsUp
                      size={16}
                      className={`transition ${hasVoted ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`}
                    />
                    <div className="flex flex-col text-center">
                      <span className="text-sm font-black leading-tight">{sug.votes}</span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {hasVoted ? 'مصوّت' : 'تصويت'}
                      </span>
                    </div>
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. Engineering Roadmap Highlights                       */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-amber-50/20 p-8 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#091524] dark:to-[#0d1c2e]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              خارطة طريق التطوير الهندسية • FuTech Q3/Q4 Roadmap
            </span>
            <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
              ميزات في طور الإطلاق بناءً على تصويت المجتمع
            </h3>
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 text-xs font-black text-amber-600 hover:underline dark:text-amber-400"
          >
            <span>هل لديك فكرة لم تُذكر هنا؟ اقترحها الآن</span>
            <ArrowLeft size={13} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Terminal size={18} />
            </div>
            <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
              محرك FuTech CLI لسطر الأوامر
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              أداة طرفية لفحص الشيفرة وتجهيز مستودع Git قبل رفعه للمنصة بنقرة واحدة عبر الـ Terminal.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <ShieldCheck size={18} />
            </div>
            <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
              محفظة الضمان متعددة العملات
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              دعم سحب وإيداع الدفعات المالية مباشرة بـ (SAR, AED, QAR, EGP, USD) بصفر عمولات تحويل خفية.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <GitMerge size={18} />
            </div>
            <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
              نظام الوساطة الهندسية الذاتي
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              استعراض تلقائي لاختلافات الشيفرة (Git Diff) في حال وجود خلاف بين الطرفين لحسم النزاع تقنياً.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Award size={18} />
            </div>
            <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
              تحديات الأكواد الشهرية
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              مسابقات معمارية برمجية مفتوحة لرفع نقاط FQS للمطورين والتنافس على جوائز مالية ورعاية مشاريع.
            </p>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 5. MODAL: Submit Suggestion                             */}
      {/* ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSubmitModal && (
          <div
            onClick={() => setShowSubmitModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1524] dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      أضف مقترح تطوير لمنصة فوتيك
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      سيتم نشر مقترحك للتصويت المفتوح من قبل المطورين وأصحاب الأعمال
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    مجال المقترح <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-amber-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  >
                    <option value="ميزة برمجية">ميزة برمجية جديدة</option>
                    <option value="معيار FQS">تطوير معيار FQS وجودة الكود</option>
                    <option value="أدوات المطورين">أدوات ومكتبات للمطورين</option>
                    <option value="أنظمة الضمان والأمان">الأمان ومحفظة الضمان (Escrow Vault)</option>
                    <option value="تحسين واجهة">تحسين واجهة وتجربة المستخدم (UI/UX)</option>
                    <option value="اقتراح عام">اقتراح عام لتطوير المنصة</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    عنوان المقترح <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: إضافة تكامل مع مستودعات GitLab و Bitbucket"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-amber-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    تفاصيل المقترح والأثر المتوقع <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اشرح الفكرة وكيف ستفيد المطورين أو أصحاب المشاريع..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs leading-relaxed outline-none focus:border-amber-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      اسمك أو صفتك
                    </label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="مثال: م. فهد العتيبي"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-amber-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300">
                      وسوم تقنية (مفصولة بفاصلة)
                    </label>
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="مثال: API, Security, Git"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-amber-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-400 transition"
                  >
                    <Send size={14} />
                    <span>نشر المقترح للمجتمع</span>
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

