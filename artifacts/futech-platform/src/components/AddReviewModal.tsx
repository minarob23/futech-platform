import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Star, CheckCircle2, ShieldCheck, Sparkles, Building2,
  FileCode2, Clock, MessageSquare, ThumbsUp, Award
} from 'lucide-react';
import { Developer, ClientReview } from '../types';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer: Developer | null;
  currentUser?: { name: string; avatar?: string; role?: string } | null;
  onSubmitReview: (developerId: string, review: ClientReview) => void;
  notify?: (msg: string) => void;
}

export function AddReviewModal({
  isOpen,
  onClose,
  developer,
  currentUser,
  onSubmitReview,
  notify,
}: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [clientName, setClientName] = useState(
    currentUser?.name || 'سارة القحطاني (مدير منتج)'
  );
  const [clientCompany, setClientCompany] = useState('شركة مسار التقنية للاستثمار');
  const [projectTitle, setProjectTitle] = useState('تطوير وتكامل منصة سحابية وفق معايير FQS');
  const [comment, setComment] = useState(
    'تجربة عمل استثنائية! المهندس أظهر التزاماً صارماً بنظافة الكود، ووثّق جميع واجهات الـ API على GitHub مع اختبارات آلية واضحة. أنصح بالتعامل معه بشدة.'
  );

  // Sub-criteria ratings
  const [codeQualityRating, setCodeQualityRating] = useState<number>(5);
  const [timelineRating, setTimelineRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(5);
  const [recommend, setRecommend] = useState<'yes' | 'neutral' | 'no'>('yes');

  if (!isOpen || !developer) return null;

  const ratingLabels: Record<number, string> = {
    5: 'ممتاز ومتقن (5.0 / 5.0) - فاق التوقعات بكود عالي الجودة',
    4: 'جيد جداً (4.0 / 5.0) - تسليم ممتاز وتجاوب سريع ومريح',
    3: 'جيد (3.0 / 5.0) - أداء مناسب ومتوافق مع المتطلبات الأساسية',
    2: 'أقل من المتوقع (2.0 / 5.0) - يحتاج لمزيد من الدقة والالتزام',
    1: 'غير مُرضٍ (1.0 / 5.0) - واجهنا صعوبات ملحوظة في التسليم',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      notify?.('يرجى كتابة نص التعليق وملاحظاتك حول أداء المطور');
      return;
    }

    const newReview: ClientReview = {
      id: 'rev-' + Date.now(),
      clientName: clientName.trim() || 'صاحب مشروع معتمد',
      clientCompany: clientCompany.trim() || 'مؤسسة تقنية',
      clientAvatar: currentUser?.avatar || '',
      rating: rating,
      date: 'اليوم (مُعتمد)',
      projectTitle: projectTitle.trim() || 'مشروع هندسي مكتمل',
      comment: comment.trim(),
    };

    onSubmitReview(developer.id, newReview);
    notify?.(`تم نشر تقييمك ورأيك في ملف المهندس (${developer.name}) بنجاح! شكراً لمشاركتك ⭐`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-5 backdrop-blur-xs"
        dir="rtl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col w-full max-w-xl max-h-[92vh] overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#0c1626] dark:text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shadow-xs">
                <Star size={20} className="fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    ✓ تقييم عميل موثق
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    مؤشر رضا العملاء FQS
                  </span>
                </div>
                <h3 className="mt-0.5 text-sm sm:text-base font-black text-[#152e46] dark:text-white">
                  تقييم أداء المهندس: {developer.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
            {/* 1. Overall Rating with 5 interactive Stars */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-center dark:border-amber-500/30 dark:bg-amber-500/10">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                التقييم الإجمالي العام للمشروع *
              </label>

              <div className="mt-2.5 flex items-center justify-center gap-2" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          active
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                {ratingLabels[hoverRating || rating]}
              </div>
            </div>

            {/* 2. Client & Project Details */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  اسمك الكامل أو صفتك كعميل *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: م. فهد الراشد"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] focus:bg-white dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                />
              </div>

              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300">
                  اسم الشركة / المنشأة
                </label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="مثال: شركة التطوير المتقدم"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] focus:bg-white dark:border-white/10 dark:bg-[#070d18] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300">
                عنوان أو اسم المشروع المنجز *
              </label>
              <input
                type="text"
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="مثال: بناء منصة إدارة المخزون متعددة الفروع"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-bold text-slate-800 outline-none focus:border-[#2ba6ae] focus:bg-white dark:border-white/10 dark:bg-[#070d18] dark:text-white"
              />
            </div>

            {/* 3. Sub-Criteria (جودة الكود، المواعيد، التواصل) */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 space-y-2.5 dark:border-white/10 dark:bg-white/[0.02]">
              <span className="block font-black text-slate-700 dark:text-slate-300">
                تقييم المعايير التفصيلية:
              </span>

              <div className="grid gap-2 sm:grid-cols-3">
                {/* Code Quality */}
                <div className="rounded-xl bg-white p-2.5 shadow-2xs dark:bg-[#081220] border border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    <FileCode2 size={13} className="text-teal-500" />
                    <span>جودة الكود</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <select
                      value={codeQualityRating}
                      onChange={(e) => setCodeQualityRating(Number(e.target.value))}
                      className="w-full rounded-lg bg-slate-50 py-1 px-1.5 font-bold text-amber-500 dark:bg-white/5 outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5/5</option>
                      <option value={4}>⭐⭐⭐⭐ 4/5</option>
                      <option value={3}>⭐⭐⭐ 3/5</option>
                    </select>
                  </div>
                </div>

                {/* On-Time Timeline */}
                <div className="rounded-xl bg-white p-2.5 shadow-2xs dark:bg-[#081220] border border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    <Clock size={13} className="text-blue-500" />
                    <span>الالتزام بالموعد</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <select
                      value={timelineRating}
                      onChange={(e) => setTimelineRating(Number(e.target.value))}
                      className="w-full rounded-lg bg-slate-50 py-1 px-1.5 font-bold text-amber-500 dark:bg-white/5 outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5/5</option>
                      <option value={4}>⭐⭐⭐⭐ 4/5</option>
                      <option value={3}>⭐⭐⭐ 3/5</option>
                    </select>
                  </div>
                </div>

                {/* Communication */}
                <div className="rounded-xl bg-white p-2.5 shadow-2xs dark:bg-[#081220] border border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    <MessageSquare size={13} className="text-emerald-500" />
                    <span>سلاسة التواصل</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <select
                      value={communicationRating}
                      onChange={(e) => setCommunicationRating(Number(e.target.value))}
                      className="w-full rounded-lg bg-slate-50 py-1 px-1.5 font-bold text-amber-500 dark:bg-white/5 outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5/5</option>
                      <option value={4}>⭐⭐⭐⭐ 4/5</option>
                      <option value={3}>⭐⭐⭐ 3/5</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Textarea for Review Comment */}
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300">
                نص التعليق والملاحظات المهنية (Public Testimonial) *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="صف تجربتك مع المطور، جودة المخرجات، التزامه بالمواعيد، ومدى استعداده لحل أي عقبات تقنية..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed font-bold text-slate-800 outline-none focus:border-[#2ba6ae] focus:bg-white dark:border-white/10 dark:bg-[#070d18] dark:text-white"
              />
            </div>

            {/* 5. Recommendation prompt */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white p-3 dark:border-white/10 dark:bg-white/[0.02]">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                هل تنصح أصحاب المشاريع الآخرين بالتعاقد مع هذا المهندس؟
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRecommend('yes')}
                  className={`rounded-lg px-2.5 py-1 font-black transition ${
                    recommend === 'yes'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400'
                  }`}
                >
                  نعم بكل تأكيد 👍
                </button>
                <button
                  type="button"
                  onClick={() => setRecommend('neutral')}
                  className={`rounded-lg px-2.5 py-1 font-black transition ${
                    recommend === 'neutral'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400'
                  }`}
                >
                  نعم، مع ملاحظات
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-500 hover:bg-slate-50 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-teal-600 px-6 py-2 font-black text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 active:scale-95 transition"
              >
                نشر واعتماد التقييم رسمياً 🌟
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
