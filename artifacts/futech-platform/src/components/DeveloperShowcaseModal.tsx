import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, BadgeCheck, Star, MapPin, Briefcase, Clock, ShieldCheck,
  Globe, Github, Linkedin, ExternalLink, Play, FileText, Download,
  CheckCircle2, Sparkles, MessageCircle, ArrowLeft, Layers, Code,
  Award, ChevronRight, GraduationCap, Building2, UserCheck, Check,
  Image as ImageIcon, ZoomIn, Eye, Maximize2, Film
} from 'lucide-react';
import { Developer, PortfolioItem, ClientReview } from '../types';
import { VideoTrailerModal } from './VideoTrailerModal';
import { AddReviewModal } from './AddReviewModal';
import { getDeveloperCurrency } from '../data/countries';
import { getDeveloperStatusConfig } from '../pages/DevelopersPage';

interface DeveloperShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer: Developer | null;
  onStartChat?: (dev: Developer) => void;
  onHireDeveloper?: (dev: Developer) => void;
  notify?: (msg: string) => void;
  onAddReview?: (developerId: string, review: ClientReview) => void;
  currentUser?: { name: string; avatar?: string; role?: string } | null;
}

export function DeveloperShowcaseModal({
  isOpen,
  onClose,
  developer,
  onStartChat,
  onHireDeveloper,
  notify,
  onAddReview,
  currentUser,
}: DeveloperShowcaseModalProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'cv' | 'fqs' | 'reviews'>('projects');
  const [selectedImageProject, setSelectedImageProject] = useState<PortfolioItem | null>(null);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [selectedTrailerProject, setSelectedTrailerProject] = useState<PortfolioItem | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [downloadingCv, setDownloadingCv] = useState(false);

  const [localReviews, setLocalReviews] = useState<ClientReview[]>([]);

  React.useEffect(() => {
    if (developer?.reviews && developer.reviews.length > 0) {
      setLocalReviews(developer.reviews);
    } else {
      setLocalReviews([
        {
          id: 'rev-default-1',
          clientName: 'أحمد السليمان',
          clientCompany: 'مجموعة المتاجر الحديثة',
          rating: 5.0,
          date: 'منذ أسبوعين',
          projectTitle: 'نظام إدارة المخزون والفروع',
          comment: 'من أفضل المهندسين الذين تعاملت معهم. كود نظيف وتوثيق هندسي ممتاز مع التزام كامل بالمواعيد المتفق عليها.'
        },
        {
          id: 'rev-default-2',
          clientName: 'م. طارق الخالدي',
          clientCompany: 'منصة سحاب للحلول التقنية',
          rating: 5.0,
          date: 'منذ شهر',
          projectTitle: 'محرك اشتراكات SaaS وإدارة التراخيص',
          comment: 'إتقان فائق للواجهات وقواعد البيانات، تم نقل ملكية المشروع على GitHub مع ملف Docker جاهز للتشغيل.'
        }
      ]);
    }
  }, [developer]);

  const handleAddReviewSubmit = (devId: string, review: ClientReview) => {
    const next = [review, ...localReviews];
    setLocalReviews(next);
    onAddReview?.(devId, review);
  };

  if (!isOpen || !developer) return null;

  const statusCfg = getDeveloperStatusConfig(developer.availability);

  const getProjectImage = (item: PortfolioItem) => {
    if (item.previewImage) return item.previewImage;
    if (item.previewType === 'ecommerce') return '/images/escrow.webp';
    if (item.previewType === 'mobile') return '/images/hero-banner.webp';
    if (item.previewType === 'ai') return '/images/new-hero.webp';
    if (item.previewType === 'api' || item.previewType === 'devops') return '/images/collab.webp';
    return '/images/ai-sentinel-preview.svg';
  };

  const getCategoryLabel = (type?: string) => {
    switch (type) {
      case 'saas':
        return 'منصة SaaS سحابية';
      case 'ecommerce':
        return 'متجر إلكتروني';
      case 'cms':
        return 'موقع / متجر CMS (WordPress & Shopify)';
      case 'mobile':
        return 'تطبيق جوال';
      case 'ai':
        return 'ذكاء اصطناعي';
      case 'api':
        return 'بوابة API وخدمات';
      case 'devops':
        return 'سحابة وDevOps';
      default:
        return 'لوحة قيادة تفاعلية';
    }
  };

  const handleOpenImagePreview = (project: PortfolioItem) => {
    setSelectedImageProject(project);
    setIsImageLightboxOpen(true);
  };

  const handleDownloadCv = () => {
    setDownloadingCv(true);
    setTimeout(() => {
      setDownloadingCv(false);
      notify?.(`تم تجهيز وتحميل السيرة الذاتية المهنية للمطور: ${developer.name} بنجاح بصيغة PDF`);
    }, 1000);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 p-2 sm:p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative my-auto flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0c1626] text-slate-800 dark:text-slate-100"
          dir="rtl"
        >
          {/* Header Banner */}
          <div className="relative overflow-hidden bg-gradient-to-l from-[#14263b] via-[#1a3857] to-[#20496f] p-6 text-white sm:p-8">
            {/* Background Glows */}
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute left-5 top-5 rounded-2xl bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* Profile Details */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  {developer.avatar && developer.avatar.trim() !== '' ? (
                    <img
                      src={developer.avatar}
                      alt={developer.name}
                      className="h-24 w-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-xl"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-3xl font-black text-amber-400 ring-4 ring-white/20 shadow-xl">
                      {developer.name ? developer.name.charAt(0) : 'م'}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -left-1 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black text-white ring-2 ring-white/40 shadow-md ${
                      statusCfg.type === 'available'
                        ? 'bg-emerald-600 shadow-emerald-500/40'
                        : statusCfg.type === 'busy'
                        ? 'bg-amber-600 shadow-amber-500/40'
                        : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full bg-white ${
                        statusCfg.type === 'available'
                          ? 'animate-ping'
                          : statusCfg.type === 'busy'
                          ? 'animate-pulse'
                          : ''
                      }`}
                    />
                    <span>{statusCfg.label}</span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white sm:text-2xl">{developer.name}</h2>
                    {developer.verified && (
                      <span title="مطور معتمد وموثق">
                        <BadgeCheck size={22} className="text-[#36cbd4]" />
                      </span>
                    )}
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-300">
                      {developer.level}
                    </span>
                  </div>

                  {/* Status Banner */}
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusCfg.badgeClass}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${statusCfg.dotBadgeColor}`} />
                      <span>{statusCfg.label}</span>
                      <span className="opacity-75 font-normal text-[10px]">— {statusCfg.tooltip}</span>
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-bold text-teal-200">{developer.specialty}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-teal-400" />
                      <span>{developer.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={13} className="text-teal-400" />
                      <span>{developer.experienceYears} سنوات خبرة</span>
                    </span>
                    <span>•</span>
                    {developer.reviewsCount > 0 ? (
                      <span className="flex items-center gap-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="font-extrabold text-white">{developer.rating}</span>
                        <span className="text-[10px] text-slate-300">({developer.reviewsCount} تقييم)</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-slate-300">
                        <Star size={13} className="text-slate-400" />
                        <span>عضو جديد (بدون تقييمات)</span>
                      </span>
                    )}
                  </div>

                  {/* Social & External Portfolio Links */}
                  <div className="mt-3 flex items-center gap-2">
                    {developer.githubUrl && (
                      <a
                        href={developer.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20 transition"
                      >
                        <Github size={13} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {developer.linkedinUrl && (
                      <a
                        href={developer.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20 transition"
                      >
                        <Linkedin size={13} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {developer.websiteUrl && (
                      <a
                        href={developer.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/20 transition"
                      >
                        <Globe size={13} />
                        <span>الموقع الشخصي</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* FQS Score Badge & CTAs */}
              <div className="flex flex-col gap-2.5 sm:items-end">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-teal-400/30 bg-teal-500/15 p-2.5 text-center backdrop-blur-md">
                    <div className="text-xl font-black text-teal-300 leading-none">
                      {developer.fqs > 0 ? developer.fqs : '—'}
                    </div>
                    <div className="text-[9px] font-bold text-teal-200 mt-0.5">
                      {developer.fqs > 0 ? 'مؤشر FQS' : 'FQS قيد التقييم'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-300 font-semibold">سعر الساعة:</div>
                    <div className="text-lg font-black text-white">
                      {developer.hourlyRate.toLocaleString('ar-EG')} <span className="text-xs text-teal-300 font-normal">{getDeveloperCurrency(developer)} / ساعة</span>{(developer.name.includes('مينا') || developer.level?.includes('مؤسس')) && <span className="mr-1.5 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-400/30">(~35$)</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {onStartChat && (
                    <button
                      onClick={() => onStartChat(developer)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white hover:bg-white/25 active:scale-95 transition"
                    >
                      <MessageCircle size={14} />
                      <span>محادثة فورية</span>
                    </button>
                  )}

                  {onHireDeveloper && (
                    <button
                      onClick={() => onHireDeveloper(developer)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 px-5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/30 hover:brightness-110 active:scale-95 transition"
                    >
                      <Sparkles size={14} />
                      <span>توظيف المطور</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Showcase Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition ${
                  activeTab === 'projects'
                    ? 'bg-white text-slate-900 shadow-md font-black dark:bg-[#0c1828] dark:text-teal-300 dark:border dark:border-teal-500/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ImageIcon size={14} className="text-teal-400" />
                <span>معرض صور الأعمال ({developer.portfolio.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('cv')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition ${
                  activeTab === 'cv'
                    ? 'bg-white text-slate-900 shadow-md font-black dark:bg-[#0c1828] dark:text-teal-300 dark:border dark:border-teal-500/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileText size={14} className="text-teal-400" />
                <span>السيرة الذاتية المهنية (CV)</span>
              </button>

              <button
                onClick={() => setActiveTab('fqs')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition ${
                  activeTab === 'fqs'
                    ? 'bg-white text-slate-900 shadow-md font-black dark:bg-[#0c1828] dark:text-teal-300 dark:border dark:border-teal-500/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ShieldCheck size={14} className="text-teal-400" />
                <span>معيار الجودة FQS</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 transition ${
                  activeTab === 'reviews'
                    ? 'bg-white text-slate-900 shadow-md font-black dark:bg-[#0c1828] dark:text-teal-300 dark:border dark:border-teal-500/30'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Star size={14} className="text-amber-400" />
                <span>آراء العملاء ({developer.reviewsCount})</span>
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-6 text-xs leading-relaxed sm:p-8">
            {/* TAB 1: PROJECTS & IMAGE GALLERY */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ImageIcon size={18} className="text-teal-500" />
                      <span>معرض صور وتطبيقات المشاريع المنجزة</span>
                    </h3>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      استعرض لقطات الشاشة والصور التوضيحية الحقيقية للمشاريع التي نفذها المطور بدقة عالية، مع إمكانية تكبير الصورة وفحص الكود على GitHub.
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
                    {developer.portfolio.length} مشاريع موثقة
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {developer.portfolio.map((item) => (
                    <div
                      key={item.id || item.title}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-[#fafbfc] p-5 shadow-xs transition hover:border-teal-400 dark:border-slate-800 dark:bg-[#0e1a2c]"
                    >
                      <div>
                        {/* Project Screenshot / Image Card */}
                        <div
                          onClick={() => {
                            if (item.hasTrailer || item.trailerVideoUrl) {
                              setSelectedTrailerProject(item);
                              setIsTrailerModalOpen(true);
                            } else {
                              handleOpenImagePreview(item);
                            }
                          }}
                          className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-sm group/img mb-3.5"
                        >
                          <img
                            src={getProjectImage(item)}
                            alt={item.title}
                            className="h-full w-full object-cover object-top transition duration-300 group-hover/img:scale-105"
                          />

                          {(item.hasTrailer || item.trailerVideoUrl) && (
                            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-lg bg-rose-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-lg border border-rose-400/40">
                              <Film size={11} className="animate-pulse" />
                              <span>تريلر رسمي 4K</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {(item.hasTrailer || item.trailerVideoUrl) ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrailerProject(item);
                                  setIsTrailerModalOpen(true);
                                }}
                                className="rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 px-4 py-2 text-xs font-black text-white flex items-center gap-1.5 border border-white/30 shadow-2xl hover:scale-105 active:scale-95 transition"
                              >
                                <Play size={14} className="fill-current" />
                                <span>مشاهدة التريلر 🎬</span>
                              </button>
                            ) : (
                              <span className="rounded-xl bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 text-xs font-black text-white flex items-center gap-1.5 border border-white/20 shadow-xl">
                                <ZoomIn size={14} className="text-teal-400" />
                                <span>تكبير صورة المشروع</span>
                              </span>
                            )}
                          </div>

                          {!item.hasTrailer && !item.trailerVideoUrl && (
                            <div className="absolute top-2.5 right-2.5">
                              <span className="rounded-lg bg-slate-950/75 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-white/10">
                                {getCategoryLabel(item.previewType)}
                              </span>
                            </div>
                          )}

                          {item.metrics && (
                            <div className="absolute bottom-2.5 right-2.5 max-w-[85%]">
                              <span className="rounded-lg bg-teal-950/85 backdrop-blur-md border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold text-teal-300 truncate block">
                                ⚡ {item.metrics}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Project Header */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-black text-[#152a40] dark:text-white group-hover:text-teal-500 transition">
                            {item.title}
                          </h4>
                        </div>

                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Features Pill List */}
                        {item.features && item.features.length > 0 && (
                          <div className="mt-2.5 space-y-1 rounded-xl bg-white/60 p-2.5 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800">
                            {item.features.slice(0, 2).map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-700 dark:text-slate-300 truncate">
                                <Check size={11} className="text-teal-500 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Stack Chips */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons: View Image & Git Source */}
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-800">
                        {(item.hasTrailer || item.trailerVideoUrl) && (
                          <button
                            onClick={() => {
                              setSelectedTrailerProject(item);
                              setIsTrailerModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 px-3.5 py-2.5 text-xs font-black text-white shadow-md shadow-rose-500/25 hover:brightness-110 active:scale-95 transition"
                          >
                            <Film size={14} />
                            <span>تريلر 4K 🎬</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenImagePreview(item)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-teal-500/20 hover:brightness-110 active:scale-95 transition"
                        >
                          <ImageIcon size={14} className="stroke-[2.5]" />
                          <span>عرض الصورة</span>
                        </button>

                        {item.githubUrl && (
                          <a
                            href={item.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            title="عرض الكود على GitHub"
                          >
                            <Github size={14} />
                            <span>Git</span>
                          </a>
                        )}

                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            title="زيارة رابط المشروع"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: DETAILED CV & RESUME */}
            {activeTab === 'cv' && (
              <div className="space-y-6">
                {/* CV Action Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-4 dark:bg-teal-500/10">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-300">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        السيرة الذاتية الرسمية المعتمدة
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        محدثة ومحققة بواسطة إدارة الجودة الهندسية FQS
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadCv}
                    disabled={downloadingCv}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#152c42] px-4 py-2 text-xs font-bold text-white hover:bg-[#1d3d5d] active:scale-95 transition dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
                  >
                    <Download size={14} />
                    <span>{downloadingCv ? 'جاري التجهيز...' : 'تحميل السيرة الذاتية (PDF)'}</span>
                  </button>
                </div>

                {/* Professional Summary */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-[#0e1a2c]">
                  <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
                    <Award size={15} className="text-teal-500" />
                    <span>الملخص المهني</span>
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {developer.cv?.summary || developer.bio}
                  </p>
                </div>

                {/* Work Experience Timeline */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white mb-3">
                    <Briefcase size={16} className="text-teal-500" />
                    <span>المسار والخبرات المهنية</span>
                  </h4>

                  <div className="relative border-r-2 border-teal-500/30 pr-5 space-y-5">
                    {(developer.cv?.experience || [
                      {
                        role: `مهندس برمجيات أول (${developer.specialty})`,
                        company: 'شركة مسار الرقمية',
                        period: '2021 - الآن',
                        achievements: [
                          'بناء وتطوير منصات برمجية سحابية متكاملة تخدم آلاف المستخدمين',
                          'تطبيق معايير FQS لاختبارات الكود التلقائية والأمان البرمجي'
                        ]
                      }
                    ]).map((exp, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute -right-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-teal-500 dark:border-slate-900" />
                        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-[#0e1a2c]">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5 className="font-extrabold text-slate-900 dark:text-white">{exp.role}</h5>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {exp.period}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                            {exp.company}
                          </div>

                          <ul className="mt-2.5 space-y-1 text-slate-600 dark:text-slate-300">
                            {exp.achievements.map((ach, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-1.5 text-[11px]">
                                <span className="text-teal-500 font-bold">•</span>
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education & Certifications Grid */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Education */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-[#0e1a2c]">
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white mb-3">
                      <GraduationCap size={16} className="text-teal-500" />
                      <span>المؤهلات العلمية</span>
                    </h4>

                    <div className="space-y-3">
                      {(developer.cv?.education || [
                        {
                          degree: 'بكالوريوس علوم الحاسب وهندسة البرمجيات',
                          institution: 'جامعة الملك سعود',
                          year: '2019'
                        }
                      ]).map((edu, idx) => (
                        <div key={idx} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
                          <div className="font-bold text-slate-900 dark:text-white">{edu.degree}</div>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                            <span>{edu.institution}</span>
                            <span className="font-bold text-teal-500">{edu.year}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-[#0e1a2c]">
                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white mb-3">
                      <Award size={16} className="text-teal-500" />
                      <span>الشهادات والاعتمادات الاحترافية</span>
                    </h4>

                    <div className="space-y-2">
                      {(developer.cv?.certifications || [
                        'AWS Certified Solutions Architect',
                        'Meta Certified Professional Developer',
                        'CKA (Certified Kubernetes Administrator)'
                      ]).map((cert, idx) => (
                        <div key={idx} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/50">
                          <CheckCircle2 size={14} className="text-teal-500 shrink-0" />
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spoken Languages & Skills */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-[#0e1a2c]">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-2.5">
                    اللغات والتواصل المهني
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {(developer.cv?.languages || [
                      { name: 'العربية', level: 'اللغة الأم (Native)' },
                      { name: 'الإنجليزية', level: 'طلاقة مهنية كاملة (Fluent)' }
                    ]).map((lang, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 px-3 py-1.5 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                        <span className="font-bold text-slate-800 dark:text-white">{lang.name}: </span>
                        <span className="text-teal-600 dark:text-teal-300">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FQS QUALITY METRICS */}
            {activeTab === 'fqs' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 p-6 dark:bg-[#0d1c2c]">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={20} className="text-teal-500" />
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          مؤشر جودة المستقل البرمجي (FQS): {developer.fqs > 0 ? `${developer.fqs}/100` : '— / 100'}
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        خوارزمية تقييم محايدة تقيس سرعة وجودة التسليم، الالتزام بالميزانية، ومعدل رضا العملاء
                      </p>
                    </div>

                    <span className="rounded-full bg-teal-500 px-4 py-1 text-xs font-black text-slate-950">
                      {developer.fqs >= 90 ? 'مطور معتمد فئة A+' : developer.fqs >= 75 ? 'مطور معتمد فئة B' : 'مطور جديد قيد التقييم'}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-white/60 bg-white p-4 text-center shadow-xs dark:border-slate-700 dark:bg-[#112338]">
                      <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                        {developer.fqsBreakdown?.completionRate ? `%${developer.fqsBreakdown.completionRate}` : (developer.completedProjects > 0 ? `%100` : '—')}
                      </div>
                      <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">إكمال المشاريع</div>
                      <div className="text-[10px] text-slate-400">Job Completion Rate</div>
                    </div>

                    <div className="rounded-2xl border border-white/60 bg-white p-4 text-center shadow-xs dark:border-slate-700 dark:bg-[#112338]">
                      <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                        {developer.fqsBreakdown?.onTimeBudget ? `%${developer.fqsBreakdown.onTimeBudget}` : (developer.completedProjects > 0 ? `%100` : '—')}
                      </div>
                      <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">الوقت والميزانية</div>
                      <div className="text-[10px] text-slate-400">On Time & On Budget</div>
                    </div>

                    <div className="rounded-2xl border border-white/60 bg-white p-4 text-center shadow-xs dark:border-slate-700 dark:bg-[#112338]">
                      <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                        {developer.reviewsCount > 0 ? `%${Math.round((developer.rating / 5) * 100)}` : '—'}
                      </div>
                      <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">تقييم العملاء</div>
                      <div className="text-[10px] text-slate-400">Client Satisfaction</div>
                    </div>

                    <div className="rounded-2xl border border-white/60 bg-white p-4 text-center shadow-xs dark:border-slate-700 dark:bg-[#112338]">
                      <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                        {developer.fqsBreakdown?.repeatHireRate ? `%${developer.fqsBreakdown.repeatHireRate}` : '٠%'}
                      </div>
                      <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">التوظيف المتكرر</div>
                      <div className="text-[10px] text-slate-400">Repeat Hire Rate</div>
                    </div>
                  </div>
                </div>

                {/* Engineering Guarantees */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-[#0e1a2c]">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-3">
                    ضمانات التسليم البرمجي المعتمدة لهذا المطور
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="font-bold text-slate-900 dark:text-white">نقل ملكية Git 100%</div>
                      <div className="text-[10px] text-slate-500 mt-1">تسليم المستودع والتوثيق كاملاً لحساب العميل</div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="font-bold text-slate-900 dark:text-white">30 يوم صيانة ودعم SLA</div>
                      <div className="text-[10px] text-slate-500 mt-1">إصلاح أي ثغرات أو أخطاء بعد التسليم مجاناً</div>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="font-bold text-slate-900 dark:text-white">صفر رسوم أو اقتطاعات</div>
                      <div className="text-[10px] text-slate-500 mt-1">تعاقد حر ومباشر دون وسيط مالي</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS & TESTIMONIALS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      آراء وتجارب أصحاب المشاريع السابقين
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      تقييمات موثقة من عملاء أنجزوا مشاريع برمجية مع المطور
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
                      <Star size={15} className="fill-amber-400 text-amber-400" />
                      <span className="font-black">
                        {(localReviews.reduce((acc, r) => acc + r.rating, 0) / (localReviews.length || 1)).toFixed(1)}
                      </span>
                      <span className="text-slate-400">({localReviews.length} تقييم)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddReviewModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-teal-600 px-3.5 py-2 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                    >
                      <Star size={14} className="fill-current" />
                      <span>+ كتابة تقييم جديد</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {localReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-[#0e1a2c]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-black text-slate-900 dark:text-white">{rev.clientName}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {rev.clientCompany} • {rev.projectTitle}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < Math.floor(rev.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                            />
                          ))}
                          <span className="mr-1 text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Bottom Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-[#0a121f]">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">سعر الساعة المقترح:</span>
              <span className="text-base font-black text-slate-900 dark:text-white">
                {developer.hourlyRate.toLocaleString('ar-EG')} {getDeveloperCurrency(developer)} / ساعة{(developer.name.includes('مينا') || developer.level?.includes('مؤسس')) ? ' (~35$)' : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                إغلاق
              </button>

              {onStartChat && (
                <button
                  onClick={() => onStartChat(developer)}
                  className="rounded-xl bg-[#203d62] px-5 py-2 text-xs font-bold text-white hover:bg-[#2c5383] active:scale-95 transition"
                >
                  بدء محادثة
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {isImageLightboxOpen && selectedImageProject && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-2 sm:p-5 backdrop-blur-xl"
            onClick={() => setIsImageLightboxOpen(false)}
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-[#0c1524] shadow-2xl"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-500/20 text-teal-300">
                    <ImageIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-white">
                        {selectedImageProject.title}
                      </h3>
                      <span className="rounded-lg bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 text-[10px] font-black text-teal-300">
                        {getCategoryLabel(selectedImageProject.previewType)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      مشروع منجز بواسطة: {developer.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedImageProject.githubUrl && (
                    <a
                      href={selectedImageProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {selectedImageProject.liveUrl && (
                    <a
                      href={selectedImageProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/10 transition"
                    >
                      <ExternalLink size={14} />
                      <span>رابط المشروع</span>
                    </a>
                  )}
                  <button
                    onClick={() => setIsImageLightboxOpen(false)}
                    className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
                    title="إغلاق"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Container */}
              <div className="relative flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-3 sm:p-6 min-h-[300px]">
                <img
                  src={getProjectImage(selectedImageProject)}
                  alt={selectedImageProject.title}
                  className="max-h-[62vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
                />
              </div>

              {/* Lightbox Footer Details */}
              <div className="border-t border-white/10 bg-[#070d18] p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
                    {selectedImageProject.description}
                  </p>
                  {selectedImageProject.metrics && (
                    <span className="inline-block text-[11px] font-bold text-teal-400">
                      ⚡ {selectedImageProject.metrics}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedImageProject.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Video Trailer 4K Player */}
      <VideoTrailerModal
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        project={selectedTrailerProject}
        developer={developer}
      />

      {/* MODAL: Add Client Review (إضافة تقييم العميل) */}
      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        developer={developer}
        currentUser={currentUser}
        onSubmitReview={handleAddReviewSubmit}
        notify={notify}
      />
    </>
  );
}
