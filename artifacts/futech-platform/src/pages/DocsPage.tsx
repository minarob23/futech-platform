import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  BookOpen, Search, CodeXml, Copy, Check, ShieldCheck, LifeBuoy,
  ChevronLeft, Clock, Tag, ExternalLink, ThumbsUp, ThumbsDown,
  Sparkles, Layers, ArrowLeft, Terminal, FileCode2, HeartHandshake, AlertCircle
} from 'lucide-react';
import { Store, Doc } from '../data/mockData';

interface DocsPageProps {
  store: Store;
  notify: (msg: string) => void;
}

export function DocsPage({ store, notify }: DocsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDocId, setActiveDocId] = useState<string>(store.docs[0]?.id || 'd-1');
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const categories = useMemo(() => {
    const set = new Set(store.docs.map((d) => d.category));
    return ['all', ...Array.from(set)];
  }, [store.docs]);

  const filteredDocs = useMemo(() => {
    return store.docs.filter((d) => {
      const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
      const matchesSearch =
        !search.trim() ||
        d.title.includes(search) ||
        d.content.includes(search) ||
        (d.tags && d.tags.some((t) => t.includes(search)));
      return matchesCat && matchesSearch;
    });
  }, [store.docs, selectedCategory, search]);

  const activeDoc = useMemo(() => {
    return store.docs.find((d) => d.id === activeDocId) || filteredDocs[0] || store.docs[0];
  }, [store.docs, activeDocId, filteredDocs]);

  const currentIndex = store.docs.findIndex((d) => d.id === activeDoc?.id);
  const prevDoc = currentIndex > 0 ? store.docs[currentIndex - 1] : null;
  const nextDoc = currentIndex < store.docs.length - 1 ? store.docs[currentIndex + 1] : null;

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      notify('تم نسخ الشيفرة البرمجية إلى الحافظة بنجاح');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      notify('تعذر النسخ التلقائي');
    }
  };

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    notify(type === 'helpful' ? 'شكرًا لتقييمك الإيجابي!' : 'شكرًا لملاحظتك، سنعمل على تحسين المقال');
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#13263b] via-[#1a3754] to-[#0e1d2e] p-6 text-white shadow-xl md:p-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#39c0c9]/15 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-[#1da0aa]/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#39c0c9]/30 bg-[#39c0c9]/10 px-3.5 py-1 text-xs font-bold text-[#67d9df]">
            <BookOpen size={14} />
            <span>مركز التوثيق والمعرفة الهندسية</span>
          </div>

          <h1 className="mt-4 text-2xl font-black md:text-4xl">
            التوثيق البرمجي وسياسات الدعم المستمر
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-slate-300 md:text-sm">
            دليلك الشامل لمعيار جودة الشيفرة (FQS)، إجراءات تسليم الكود المصدري والمستودعات،
            واتفاقيات الدعم الفني والصيانة المستمرة (SLA) لضمان نجاح واستدامة مشاريعك.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في وثائق FQS، تسليم المستودعات، عقود الصيانة، التذاكر..."
              className="w-full rounded-2xl border border-white/10 bg-white/10 pe-4 ps-12 py-3.5 text-xs text-white placeholder-slate-400 backdrop-blur-md outline-none transition focus:border-[#3ec4cb] focus:bg-white/15"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                مسح
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
                isSelected
                  ? 'bg-[#203d62] text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'جميع المقالات والوثائق' : cat}
            </button>
          );
        })}
      </div>

      {/* Main Documentation Layout (Articles Sidebar + Reader) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar: Articles List */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-center justify-between px-2 text-xs font-black text-slate-700">
              <span className="flex items-center gap-2">
                <FileCode2 size={16} className="text-[#259199]" />
                <span>المقالات والوثائق ({filteredDocs.length})</span>
              </span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-[11px] text-[#259199] hover:underline"
                >
                  إعادة ضبط
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pe-1">
              {filteredDocs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  لا توجد مقالات مطابقة لبحثك
                </div>
              ) : (
                filteredDocs.map((doc) => {
                  const isActive = activeDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setActiveDocId(doc.id);
                        setFeedback(null);
                      }}
                      className={`cursor-pointer rounded-2xl p-3.5 transition ${
                        isActive
                          ? 'border border-[#2ea4ac] bg-[#edf8f9] shadow-xs'
                          : 'border border-slate-100 bg-[#fafbfc] hover:border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`rounded-md px-2 py-0.5 font-bold ${
                            isActive ? 'bg-[#218d95] text-white' : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {doc.category}
                        </span>
                        {doc.readingTime && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock size={11} />
                            <span>{doc.readingTime}</span>
                          </span>
                        )}
                      </div>

                      <h4
                        className={`mt-2 text-xs font-black leading-snug ${
                          isActive ? 'text-[#163a45]' : 'text-slate-800'
                        }`}
                      >
                        {doc.title}
                      </h4>

                      {doc.summary && (
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">
                          {doc.summary}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick SLA Support Helper Card */}
          <div className="rounded-3xl border border-[#cbe6e8] bg-gradient-to-br from-[#f1f9f9] to-[#e8f6f7] p-5">
            <div className="flex items-center gap-2 text-xs font-black text-[#1c7880]">
              <LifeBuoy size={17} />
              <span>اتفاقية استجابة الدعم المستمر (SLA)</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
              جميع المشاريع المعتمدة في فوتيك تشمل ضمانًا مجانيًا لمدة 30 يومًا، مع إمكانية الترقية لعقود الصيانة الدورية.
            </p>
            <div className="mt-3 space-y-1.5 text-[11px] font-bold text-slate-700">
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-1.5">
                <span>المشاكل الحرجة (Critical):</span>
                <span className="text-rose-600 font-extrabold">خلال ساعتين</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-1.5">
                <span>المشاكل العالية (High):</span>
                <span className="text-amber-600 font-extrabold">خلال 6 ساعات</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-1.5">
                <span>الاستفسارات والصيانة:</span>
                <span className="text-[#1c7880] font-extrabold">خلال 24 ساعة</span>
              </div>
            </div>
            <Link
              href="/support"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#203d62] py-2.5 text-xs font-black text-white shadow-xs transition hover:bg-[#2b5182]"
            >
              <span>فتح تذكرة دعم فني أو صيانة</span>
              <ArrowLeft size={13} />
            </Link>
          </div>
        </div>

        {/* Reader: Detailed Active Document View */}
        <div className="space-y-6 lg:col-span-8">
          {activeDoc ? (
            <motion.div
              key={activeDoc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-10"
            >
              {/* Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-[#e5f5f6] px-3 py-1 text-xs font-black text-[#1e868e]">
                    {activeDoc.category}
                  </span>
                  {activeDoc.readingTime && (
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <Clock size={13} />
                      <span>زمن القراءة: {activeDoc.readingTime}</span>
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-400">
                  آخر تحديث للوثيقة: {activeDoc.updatedAt}
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-6 text-xl font-black leading-snug text-[#14293f] md:text-3xl">
                {activeDoc.title}
              </h2>

              {activeDoc.summary && (
                <div className="mt-4 rounded-2xl border border-slate-100 bg-[#f8fafc] p-4 text-xs font-bold leading-relaxed text-slate-600">
                  💡 {activeDoc.summary}
                </div>
              )}

              {/* Body Content */}
              <div className="mt-8 space-y-4 text-xs leading-loose text-slate-700 md:text-sm">
                {activeDoc.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={idx} className="my-3 space-y-2 pe-4">
                        {items.map((it, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2da6ae]" />
                            <span>{it.replace(/^[•\-]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  if (/^[0-9]+\.\s*/.test(paragraph)) {
                    const lines = paragraph.split('\n');
                    return (
                      <div key={idx} className="my-4 rounded-2xl border border-slate-100 bg-[#fafbfc] p-4">
                        {lines.map((line, lIdx) => (
                          <p key={lIdx} className={lIdx === 0 ? 'font-black text-[#152e46]' : 'mt-1 text-slate-600'}>
                            {line}
                          </p>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-slate-700">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Code Example (if available) */}
              {activeDoc.codeExample && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-[#0f1f2e] text-slate-200">
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#162a3c] px-4 py-2.5 text-xs font-mono">
                    <span className="flex items-center gap-2 text-slate-300">
                      <Terminal size={14} className="text-[#3fc9d1]" />
                      <span>مثال تطبيقي للشيفرة</span>
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeDoc.codeExample!)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:bg-white/20 active:scale-95"
                    >
                      {copiedCode ? (
                        <>
                          <Check size={13} className="text-[#4be0e9]" />
                          <span className="text-[#4be0e9]">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>نسخ الشيفرة</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-emerald-300">
                    <code>{activeDoc.codeExample}</code>
                  </pre>
                </div>
              )}

              {/* Tags Strip */}
              {activeDoc.tags && activeDoc.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                    <Tag size={13} />
                    <span>الوسوم:</span>
                  </span>
                  {activeDoc.tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => setSearch(t)}
                      className="cursor-pointer rounded-xl bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 transition hover:bg-[#e6f7f7] hover:text-[#1c848c]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Article Feedback */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-[#f8fafc] p-4">
                <span className="text-xs font-bold text-slate-600">
                  هل كانت هذه المقالة واضحة ومفيدة لك؟
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback('helpful')}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                      feedback === 'helpful'
                        ? 'border-[#2ea4ac] bg-[#edf8f9] text-[#1c8087]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>نعم، مفيدة</span>
                  </button>
                  <button
                    onClick={() => handleFeedback('not-helpful')}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                      feedback === 'not-helpful'
                        ? 'border-rose-400 bg-rose-50 text-rose-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsDown size={14} />
                    <span>بحاجة لتوضيح</span>
                  </button>
                </div>
              </div>

              {/* Next & Previous Navigation */}
              <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                {prevDoc ? (
                  <div
                    onClick={() => {
                      setActiveDocId(prevDoc.id);
                      setFeedback(null);
                    }}
                    className="cursor-pointer rounded-2xl border border-slate-200 p-4 transition hover:border-[#2ea4ac] hover:bg-[#f6fcfa]"
                  >
                    <span className="text-[10px] font-bold text-slate-400">← الوثيقة السابقة</span>
                    <h5 className="mt-1 text-xs font-black text-slate-800">{prevDoc.title}</h5>
                  </div>
                ) : <div />}

                {nextDoc ? (
                  <div
                    onClick={() => {
                      setActiveDocId(nextDoc.id);
                      setFeedback(null);
                    }}
                    className="cursor-pointer rounded-2xl border border-slate-200 p-4 text-left transition hover:border-[#2ea4ac] hover:bg-[#f6fcfa]"
                    dir="ltr"
                  >
                    <span className="text-[10px] font-bold text-slate-400">الوثيقة التالية →</span>
                    <h5 className="mt-1 text-xs font-black text-slate-800" dir="rtl">{nextDoc.title}</h5>
                  </div>
                ) : <div />}
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              يرجى اختيار مقال لعرض تفاصيله
            </div>
          )}

          {/* Ongoing Support Banner */}
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-[#17304a] to-[#204468] p-6 text-white shadow-md sm:flex-row sm:p-8">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#39c4cc] text-[#0d2130]">
                <LifeBuoy size={26} />
              </div>
              <div>
                <h4 className="text-base font-black">تحتاج إلى دعم تقني مستمر لمشروعك؟</h4>
                <p className="mt-1 text-xs text-slate-300">
                  افتح تذكرة صيانة برمجية وسيقوم المطور المختص بالرد عليك وتحديث الخادم وفق جدول SLA.
                </p>
              </div>
            </div>

            <Link
              href="/support"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs font-black text-[#14283e] shadow-md transition hover:bg-slate-100 active:scale-95"
            >
              <span>مركز التذاكر والدعم المستمر</span>
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
