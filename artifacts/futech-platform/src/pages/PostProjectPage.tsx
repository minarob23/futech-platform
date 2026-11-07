import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from 'wouter';
import {
  Plus,
  Trash2,
  Paperclip,
  UploadCloud,
  X,
  FileText,
  Archive,
  ArrowLeft,
} from 'lucide-react';
import { Store, Project, ProjectAttachment } from '../types';
import { saveProjectToSupabase } from '../lib/supabaseData';

interface PostProjectPageProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  go: (path: string) => void;
}

export function PostProjectPage({ store, update, notify, go }: PostProjectPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('');
  const [milestones, setMilestones] = useState<string[]>([
    'تحديد النطاق وهيكلة قواعد البيانات ونماذج المستخدم',
    'بناء الواجهات وتكامل واجهات API الرئيسية',
    'فحص الاختبارات وتأمين الشفرة وتسليم التوثيق النهائي',
  ]);
  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
  const [deadline, setDeadline] = useState('2025-07-20');
  const [budget, setBudget] = useState(5500);
  const [difficulty, setDifficulty] = useState<'مبتدئ' | 'متوسط' | 'متقدم'>('متوسط');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchStr = useSearch();

  // Pre-fill when navigating from blueprint template
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('futech_selected_blueprint');
      if (raw) {
        const bp = JSON.parse(raw);
        if (bp.title) setTitle(bp.title);
        if (bp.description) setDescription(bp.description);
        if (bp.stack && Array.isArray(bp.stack)) setStack(bp.stack.join(', '));
        if (bp.budget) setBudget(bp.budget);
        if (bp.difficulty) setDifficulty(bp.difficulty);
        if (bp.milestones && Array.isArray(bp.milestones)) setMilestones(bp.milestones);
        sessionStorage.removeItem('futech_selected_blueprint');
        notify(`✨ تم تعبئة نموذج: ${bp.title}`);
      }
    } catch {}
  }, [searchStr]);

  // Add Milestone Handler
  const handleAddMilestone = () => {
    setMilestones((prev) => [...prev, '']);
  };

  // Remove Milestone Handler
  const handleRemoveMilestone = (index: number) => {
    if (milestones.length <= 1) {
      notify('يجب الإبقاء على مرحلة تسليم واحدة على الأقل');
      return;
    }
    setMilestones((prev) => prev.filter((_, idx) => idx !== index));
  };

  // File Upload Handler (Images & Files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: ProjectAttachment[] = [];
    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isDoc = file.name.endsWith('.doc') || file.name.endsWith('.docx');
      const isArchive = file.name.endsWith('.zip') || file.name.endsWith('.rar');

      const type: ProjectAttachment['type'] = isImg
        ? 'image'
        : isPdf
        ? 'pdf'
        : isDoc
        ? 'doc'
        : isArchive
        ? 'archive'
        : 'file';

      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = file.size < 1024 * 1024
        ? `${Math.round(file.size / 1024)} KB`
        : `${sizeInMb} MB`;

      newAttachments.push({
        id: 'att-' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: sizeStr,
        type,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      });
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    notify(`تم إرفاق ${newAttachments.length} ملف/صورة بنجاح`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || description.trim().length < 20) {
      notify('يرجى ملء جميع الحقول المطلوبة وكتابة وصف واضح من 20 حرفًا على الأقل');
      return;
    }

    const validMilestones = milestones.filter((m) => m.trim().length > 0);
    if (validMilestones.length === 0) {
      notify('يرجى كتابة مرحلة تسليم واحدة على الأقل');
      return;
    }

    const newProject: Project = {
      id: 'p-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      description: description.trim(),
      stack: stack.split(/[,،]/).map((s) => s.trim()).filter(Boolean),
      difficulty,
      budget: Number(budget),
      deadline,
      milestones: validMilestones,
      attachments,
      owner: store.currentUser?.name || 'صاحب مشروع (أنت)',
      status: 'متاح',
      requiredFqs: 82,
    };

    saveProjectToSupabase(newProject, store.currentUser?.id).then((res) => {
      if (res.success && res.projectId) {
        newProject.id = res.projectId;
      }
    });

    update('projects', [newProject, ...store.projects]);
    notify('تم نشر مشروعك بنجاح وحفظه في سحابة المنصة 🚀');
    go('/projects');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6" dir="rtl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#152a40] dark:text-white">نشر مشروع برمجي جديد</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          حوّل فكرتك إلى مراحل واضحة المعالم وأرفق ملفات المتطلبات لجذب أفضل المهندسين المعتمدين
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#0c1524]">
        {/* Project Title */}
        <div>
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
            عنوان المشروع <span className="text-rose-500">*</span>
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تطوير منصة SaaS لإدارة المخزون والتوصيل اللوجستي"
            className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
          />
        </div>

        {/* Detailed Requirements & Scope */}
        <div>
          <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
            النطاق والمتطلبات الهندسية بالتفصيل <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ما المطلوب تنفيذه بالتحديد؟ ما هي السيناريوهات والشاشات الرئيسية؟ اذكر القيود التقنية وقواعد البيانات المطلوبة..."
            className="mt-1.5 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs leading-relaxed text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
          />
        </div>

        {/* Tech Stack & Difficulty */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
              التقنيات المطلوبة (مفصولة بفاصلة)
            </label>
            <input
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              placeholder="React, Next.js, WordPress, Shopify, WooCommerce, Flutter, Node.js..."
              className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">مستوى الصعوبة</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-bold text-slate-700 outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>
        </div>

        {/* Budget & Deadline */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
              الميزانية المرصودة ({store.currentUser?.currency || 'ر.س'}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type="number"
                min={100}
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 pl-16 text-xs font-bold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-teal-500/15 px-2.5 py-1 text-[10px] font-black text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                {store.currentUser?.currency || 'ر.س'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
              الموعد النهائي للتسليم <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs font-bold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
            />
          </div>
        </div>

        {/* ========================================================
            1. PROPOSED DELIVERY MILESTONES (مراحل التسليم المقترحة مع زر +)
        ======================================================== */}
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/40 p-5 dark:border-slate-800 dark:bg-slate-900/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-black text-slate-800 dark:text-white">
                  مراحل التسليم المقترحة (Milestones)
                </label>
                <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-[10px] font-black text-teal-700 dark:text-teal-300">
                  {milestones.length} مراحل
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-400">
                قسّم مشروعك إلى محطات تسليم واضحة ليتم إيداع وصرف الدفعات تدريجياً فور مراجعة كل مرحلة.
              </p>
            </div>

            {/* Quick Header + Button */}
            <button
              type="button"
              onClick={handleAddMilestone}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700 shadow-2xs transition hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-950/40 dark:text-teal-300"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>إضافة مرحلة جديدة</span>
            </button>
          </div>

          {/* Dynamic Milestones Rows */}
          <div className="mt-4 space-y-2.5">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-xs font-black text-teal-700 shadow-2xs border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-teal-300">
                  {i + 1}
                </span>

                <input
                  value={m}
                  onChange={(e) =>
                    setMilestones(milestones.map((item, idx) => (idx === i ? e.target.value : item)))
                  }
                  placeholder={`اكتب مخرجات المرحلة ${i + 1} (مثال: تصميم النماذج الأولية وربط API)...`}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(i)}
                  disabled={milestones.length <= 1}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                  title="حذف هذه المرحلة"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Add Stage Button */}
          <button
            type="button"
            onClick={handleAddMilestone}
            className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-teal-500/40 bg-teal-500/5 py-2.5 text-xs font-bold text-teal-700 transition hover:bg-teal-500/10 active:scale-99 dark:text-teal-300"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>إضافة مرحلة تسليم إضافية (المرحلة {milestones.length + 1})</span>
          </button>
        </div>

        {/* ========================================================
            2. ATTACHMENT UPLOADER (زر مرفق للصور والملفات)
        ======================================================== */}
        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/40 p-5 dark:border-slate-800 dark:bg-slate-900/30">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.zip,.rar,.fig,.xd,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Paperclip size={15} className="text-teal-600 dark:text-teal-400" />
                <label className="text-xs font-black text-slate-800 dark:text-white">
                  المرفقات والمستندات الداعمة (صور، تصاميم، وثائق متطلبات)
                </label>
                {attachments.length > 0 && (
                  <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-[10px] font-black text-teal-700 dark:text-teal-300">
                    {attachments.length} ملفات مرفقة
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-slate-400">
                أرفق ملفات PDF، نماذج Figma، لقطات الشاشات، أو المستندات لمساعدة المطورين على فهم نطاق العمل بدقة.
              </p>
            </div>

            {/* Direct Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700 shadow-2xs transition hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-950/40 dark:text-teal-300"
            >
              <Paperclip size={14} />
              <span>إرفاق ملفات أو صور</span>
            </button>
          </div>

          {/* Upload Drop Zone / Button */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center transition hover:border-teal-500/50 hover:bg-teal-50/20 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-teal-500/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <UploadCloud size={24} />
            </div>
            <div className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">
              انقر هنا لرفع الصور أو الملفات (أو اسحبها وأفلتها هنا)
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              يدعم الصور (PNG, JPG)، ملفات PDF، مستندات Word، ملفات مضغوطة ZIP، وتصاميم Figma (حتى 25 ميجابايت)
            </p>
          </div>

          {/* Attached Files List */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-[11px] font-black text-slate-500 dark:text-slate-400">
                الملفات والصور المرفقة حالياً:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          {att.type === 'pdf' ? (
                            <FileText size={18} className="text-rose-500" />
                          ) : att.type === 'doc' ? (
                            <FileText size={18} className="text-blue-500" />
                          ) : att.type === 'archive' ? (
                            <Archive size={18} className="text-amber-500" />
                          ) : (
                            <Paperclip size={18} />
                          )}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-black text-slate-800 dark:text-white">
                          {att.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{att.size}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                      title="حذف هذا المرفق"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit & Cancel Actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={() => go('/projects')}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] px-7 py-2.5 text-xs font-black text-white shadow-md shadow-[#14293f]/20 transition hover:opacity-95 active:scale-98 dark:from-teal-600 dark:via-teal-500 dark:to-cyan-500 dark:text-slate-950"
          >
            <span>نشر المشروع في سوق المشاريع</span>
            <ArrowLeft size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
