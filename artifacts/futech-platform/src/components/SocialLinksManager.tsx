import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Send,
  MessageSquare,
  Globe,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Check,
  X,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import {
  SocialLinkItem,
  SocialPlatform,
  PLATFORM_INFO,
  getPlatformSocialLinks,
  savePlatformSocialLinks,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  DEFAULT_SOCIAL_LINKS,
} from '../lib/socialLinks';

interface SocialLinksManagerProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  onNotify?: (msg: string) => void;
  isOwnerView?: boolean;
}

export function SocialLinksManager({
  title = 'قسم إدارة منصات التواصل الاجتماعي ومستودعات الكود',
  subtitle = 'إضافة وتعديل وحذف روابط السوشيال ميديا وقنوات المجتمع الرسمية لمنصة فوتيك',
  badge = 'إدارة حية 🌐 Live Links',
  onNotify,
  isOwnerView = true,
}: SocialLinksManagerProps) {
  const [links, setLinks] = useState<SocialLinkItem[]>(getPlatformSocialLinks);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [platform, setPlatform] = useState<SocialPlatform>('github');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Sync on external updates
  useEffect(() => {
    const handleSync = () => {
      setLinks(getPlatformSocialLinks());
    };
    window.addEventListener('futech_social_links_updated', handleSync);
    return () => window.removeEventListener('futech_social_links_updated', handleSync);
  }, []);

  const resetForm = () => {
    setPlatform('github');
    setLabel('');
    setUrl('');
    setIsPrimary(false);
    setIsActive(true);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (item: SocialLinkItem) => {
    setIsAdding(false);
    setEditingId(item.id);
    setPlatform(item.platform);
    setLabel(item.label);
    setUrl(item.url);
    setIsPrimary(Boolean(item.isPrimary));
    setIsActive(item.isActive);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      if (onNotify) onNotify('يرجى كتابة رابط صالح');
      return;
    }

    const cleanLabel = label.trim() || PLATFORM_INFO[platform].name;
    const cleanUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;

    if (editingId) {
      const updated = updateSocialLink(editingId, {
        platform,
        label: cleanLabel,
        url: cleanUrl,
        isPrimary,
        isActive,
      });
      setLinks(updated);
      if (onNotify) onNotify(`تم تحديث رابط ${PLATFORM_INFO[platform].name} بنجاح ✅`);
    } else {
      const updated = addSocialLink({
        platform,
        label: cleanLabel,
        url: cleanUrl,
        isPrimary,
        isActive,
      });
      setLinks(updated);
      if (onNotify) onNotify(`تمت إضافة منصة ${PLATFORM_INFO[platform].name} بنجاح 🚀`);
    }

    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    const updated = deleteSocialLink(id);
    setLinks(updated);
    if (onNotify) onNotify(`تم حذف رابط ${name} بنجاح 🗑️`);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    const updated = updateSocialLink(id, { isActive: !current });
    setLinks(updated);
    if (onNotify) onNotify(`تم ${!current ? 'تفعيل' : 'إخفاء'} الرابط بنجاح`);
  };

  const handleResetDefaults = () => {
    savePlatformSocialLinks(DEFAULT_SOCIAL_LINKS);
    setLinks(DEFAULT_SOCIAL_LINKS);
    resetForm();
    if (onNotify) onNotify('تمت استعادة الروابط الرسمية الافتراضية مع مستودع GitHub بنجاح 🔄');
  };

  const renderPlatformIcon = (plt: SocialPlatform, size = 18) => {
    switch (plt) {
      case 'github':
        return <Github size={size} />;
      case 'linkedin':
        return <Linkedin size={size} />;
      case 'twitter':
        return <Twitter size={size} />;
      case 'youtube':
        return <Youtube size={size} />;
      case 'telegram':
        return <Send size={size} />;
      case 'discord':
        return <MessageSquare size={size} />;
      case 'facebook':
        return <Globe size={size} />;
      default:
        return <Globe size={size} />;
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-colors dark:border-white/10 dark:bg-[#0c1524] sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-500/15 text-teal-700 ring-2 ring-teal-500/20 dark:bg-teal-950/70 dark:text-teal-300">
            <Share2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#14283d] dark:text-white sm:text-lg">
                {title}
              </h3>
              <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[10px] font-black text-teal-700 dark:text-teal-300">
                {badge}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            title="استعادة الروابط الافتراضية"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">استعادة الافتراضي</span>
          </button>

          {!isAdding && !editingId && (
            <button
              type="button"
              onClick={handleStartAdd}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-teal-500/20 transition hover:brightness-105 active:scale-95"
            >
              <Plus size={15} />
              <span>إضافة منصة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {/* GitHub Featured Banner Notice */}
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-900/10 bg-slate-900 p-4 text-white shadow-sm dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/20">
            <Github size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black">مستودع الكود البرمجي (GitHub Repository)</span>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                المصدر الأساسي 🌟
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-300">
              معتمد وموثق لجميع أصحاب المشاريع والمهندسين وفق معيار تسليم الكود Git Handover
            </p>
          </div>
        </div>

        <a
          href="https://github.com/minarob23/futech-platform"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/25 shrink-0"
        >
          <span>زيارة المستودع</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Add / Edit Form Drawer */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSave}
            className="mt-6 rounded-2xl border border-teal-500/30 bg-teal-50/40 p-5 dark:border-teal-500/20 dark:bg-teal-950/20"
          >
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 size={15} className="text-teal-600 dark:text-teal-400" />
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {editingId ? 'تعديل بيانات المنصة والرابط' : 'إضافة منصة تواصل أو مستودع كود جديد'}
                </h4>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X size={15} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {/* Platform Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  نوع المنصة أو الشبكة البرمجية *
                </label>
                <select
                  value={platform}
                  onChange={(e) => {
                    const nextPlat = e.target.value as SocialPlatform;
                    setPlatform(nextPlat);
                    if (!label || label === PLATFORM_INFO[platform].name) {
                      setLabel(PLATFORM_INFO[nextPlat].name);
                    }
                  }}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-800 outline-none focus:border-teal-500 dark:border-white/10 dark:bg-[#0c1524] dark:text-white"
                >
                  {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Label */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  الاسم المعروض أو وصف الرابط
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="مثال: GitHub المستودع الرسمي"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none focus:border-teal-500 dark:border-white/10 dark:bg-[#0c1524] dark:text-white"
                />
              </div>

              {/* URL */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  الرابط الكامل (URL) *
                </label>
                <div className="relative mt-1">
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={PLATFORM_INFO[platform].defaultPlaceholder}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pe-10 text-xs text-slate-800 outline-none focus:border-teal-500 dark:border-white/10 dark:bg-[#0c1524] dark:text-white"
                    dir="ltr"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-teal-600 dark:text-teal-400">
                    {renderPlatformIcon(platform, 16)}
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded accent-teal-600"
                  />
                  <span>تفعيل وعرض الرابط للزوار في الفوتر والصفحات</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  <span>تمييز كرابط رسمي رئيسي (Featured)</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-teal-500/20 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-black text-white hover:bg-teal-700 shadow-sm"
              >
                <Check size={14} />
                <span>{editingId ? 'حفظ التعديلات' : 'إضافة الرابط فوراً'}</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Social Links List */}
      <div className="mt-6 space-y-3">
        {links.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-white/10">
            <Share2 size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-bold text-slate-600 dark:text-slate-300">لا توجد روابط تواصل حالياً</p>
            <button
              onClick={handleResetDefaults}
              className="mt-2 text-xs font-bold text-teal-600 hover:underline"
            >
              استعادة الروابط الرسمية الافتراضية
            </button>
          </div>
        ) : (
          links.map((item) => {
            const info = PLATFORM_INFO[item.platform] || PLATFORM_INFO.website;
            const isEditingThis = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border p-4 transition ${
                  isEditingThis
                    ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/20'
                    : item.isActive
                    ? 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-white/5 dark:bg-[#08101d] dark:hover:border-white/10'
                    : 'border-slate-200 bg-slate-50/60 opacity-60 dark:border-white/5 dark:bg-white/[0.02]'
                }`}
              >
                {/* Platform Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-2xl shrink-0 shadow-xs ${info.bgColor}`}
                  >
                    {renderPlatformIcon(item.platform, 20)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-xs font-black text-slate-900 dark:text-white">
                        {item.label}
                      </h4>
                      {item.isPrimary && (
                        <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-black text-amber-700 dark:text-amber-300">
                          رسمي رئيسي 👑
                        </span>
                      )}
                      {item.isActive ? (
                        <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          نشط ✓
                        </span>
                      ) : (
                        <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                          معطل
                        </span>
                      )}
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-teal-600 transition truncate max-w-md"
                      dir="ltr"
                    >
                      <span className="truncate">{item.url}</span>
                      <ExternalLink size={11} className="shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Test Link Button */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    title="فتح الرابط للتجربة"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-teal-400 hover:text-teal-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    <ExternalLink size={13} />
                  </a>

                  {/* Toggle Active Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item.id, item.isActive)}
                    title={item.isActive ? 'إخفاء الرابط' : 'تفعيل الرابط'}
                    className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
                      item.isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5'
                    }`}
                  >
                    <Check size={14} className={item.isActive ? 'stroke-[2.5]' : 'opacity-40'} />
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    title="تعديل الرابط"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-teal-50 hover:text-teal-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-teal-950/50"
                  >
                    <Edit3 size={13} />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.label)}
                    title="حذف الرابط"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
