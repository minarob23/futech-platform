import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  Cookie, ShieldCheck, Lock, CheckCircle2, AlertTriangle, RefreshCw,
  ExternalLink, Layers, ArrowLeft, Database, Eye, Settings, FileText,
  Sparkles, Check, HelpCircle, HardDrive, Smartphone, Globe2,
  Zap, KeyRound, GitBranch, Fingerprint
} from 'lucide-react';
import { Store } from '../types';

interface CookiesPolicyPageProps {
  store?: Store;
  notify?: (msg: string) => void;
  go?: (path: string) => void;
}

const COOKIE_STORAGE_KEY = 'futech_cookie_consent';

export function CookiesPolicyPage({ store, notify, go }: CookiesPolicyPageProps) {
  const [consentStatus, setConsentStatus] = useState<string | null>(null);

  // Sync consent status
  useEffect(() => {
    const updateStatus = () => {
      try {
        const val = localStorage.getItem(COOKIE_STORAGE_KEY);
        setConsentStatus(val);
      } catch {
        setConsentStatus(null);
      }
    };

    updateStatus();

    window.addEventListener('futech_cookie_updated', updateStatus);
    window.addEventListener('futech_cookie_reset', updateStatus);
    return () => {
      window.removeEventListener('futech_cookie_updated', updateStatus);
      window.removeEventListener('futech_cookie_reset', updateStatus);
    };
  }, []);

  const handleResetConsent = () => {
    try {
      localStorage.removeItem(COOKIE_STORAGE_KEY);
      setConsentStatus(null);
      window.dispatchEvent(new Event('futech_cookie_reset'));
      if (notify) notify('تمت إعادة تعيين تفضيلاتك بنجاح! سيظهر إشعار ملفات الارتباط مجدداً.');
    } catch {}
  };

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted');
      setConsentStatus('accepted');
      window.dispatchEvent(new Event('futech_cookie_updated'));
      if (notify) notify('تم حفظ وتأكيد موافقتك على سياسة ملفات تعريف الارتباط ✅');
    } catch {}
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100" dir="rtl">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-400">
        <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition">الرئيسية</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300">سياسة ملفات تعريف الارتباط</span>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/70 to-teal-50/30 p-8 shadow-sm transition-all sm:p-12 dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0d1726] dark:via-[#09111c] dark:to-[#06242c]/20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-50/80 px-4 py-1 text-xs font-black text-teal-800 dark:border-teal-500/30 dark:bg-teal-950/60 dark:text-teal-300">
            <Cookie size={14} className="text-teal-600 dark:text-teal-400" />
            <span>وثيقة الأمان والخصوصية الرقمية • Cookies Policy</span>
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-[#14283d] sm:text-4xl dark:text-white">
            سياسة ملفات تعريف الارتباط وتخزين البيانات
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            تلتزم منصة فوتيك (FuTech) بأعلى معايير الشفافية والأمان السيبراني. توضح هذه السياسة كيف ولماذا نستخدم ملفات تعريف الارتباط (Cookies) والتقنيات المماثلة مثل التخزين المحلي (LocalStorage & SessionStorage) لتقديم تجربة هندسية فائقة السرعة، مصادقة الجلسات المشفرة، وضمان مطابقة الجودة FQS دون أي تتبع إعلاني أو بيع للبيانات.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-500" />
              <span>متوافقة مع معايير حماية البيانات وسرية الأكواد البرمجية</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock size={15} className="text-teal-500" />
              <span>خالية من أي أدوات تتبع إعلانية لأطراف ثالثة (Zero Third-Party Ads)</span>
            </span>
            <span>• آخر تحديث: نوفمبر 2026</span>
          </div>
        </div>
      </div>

      {/* Interactive Status & Live Preference Widget */}
      <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all sm:p-7 dark:border-slate-800 dark:bg-[#0c1626]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
              consentStatus === 'accepted'
                ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/70 dark:text-teal-400'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400'
            }`}>
              <Cookie size={24} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#14283d] dark:text-white">حالة موافقتك الحالية:</h3>
                {consentStatus === 'accepted' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-0.5 text-xs font-black text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                    <CheckCircle2 size={13} />
                    <span>مُعتمدة ومقبولة</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-black text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                    <AlertTriangle size={13} />
                    <span>معلقة / قيد المراجعة</span>
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {consentStatus === 'accepted'
                  ? 'تم حفظ موافقتك على استخدام ملفات الارتباط التشغيلية والأمنية لتعزيز تجربتك على منصة فوتيك.'
                  : 'يمكنك اعتماد السياسة أدناه أو إعادة إظهار إشعار الموافقة في أي وقت.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {consentStatus !== 'accepted' && (
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 text-xs font-black text-white shadow-md shadow-teal-600/20 hover:brightness-105 active:scale-95 transition"
              >
                <Check size={15} />
                <span>قبول كافة ملفات الارتباط</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetConsent}
              className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-black text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              title="إعادة إظهار الإشعار أسفل الشاشة"
            >
              <RefreshCw size={14} />
              <span>إعادة تعيين تفضيلاتي (إظهار الإشعار)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Cookie Categories */}
      <div className="mt-10">
        <h2 className="text-xl font-black text-[#14283d] dark:text-white">
          تصنيف ملفات الارتباط المستخدمة في فوتيك
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          نصنف تقنيات التخزين إلى أربع فئات رئيسية، جميعها تخدم استقرار النظام وأمان الحسابات وجودة المشروعات البرمجية:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          
          {/* Category 1 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c1626]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#14283d] dark:text-white">
                    1. ملفات ضرورية وأمنية (Strictly Necessary)
                  </h3>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">إلزامية لتشغيل المنصة</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                مفعلة دائماً
              </span>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              هذه الملفات مطلوبة ولا غنى عنها لتشغيل المنصة بالشكل الصحيح. تشمل مصادقة الدخول الآمنة مع خوادم فوتيك السحابية المشفرة، وتوليد رموز JWT المشفرة، والتحقق من صلاحيات الأدوار (RBAC) لتمييز المهندسين، أصحاب المشاريع، الإدارة، والمالك، إضافة للحماية من هجمات تزوير الطلبات (CSRF).
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">أمثلة تقنية:</span> sb-access-token, sb-refresh-token, auth_session_id
            </div>
          </div>

          {/* Category 2 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c1626]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Settings size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#14283d] dark:text-white">
                    2. ملفات التفضيلات والواجهة (Functional & UX)
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">لتخصيص تجربتك</span>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-black text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                تفضيلية
              </span>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              تسمح للمنصة بتذكر خياراتك المفضلة بين الجلسات لتجنب إعادة ضبطها في كل زيارة. مثل: تفعيل الوضع الليلي أو النهاري، وحفظ دولة الإقامة والعملة المختارة (ر.س، ج.م، د.إ، إلخ)، وحفظ موافقتك على سياسة الخصوصية وملفات الارتباط حتى لا يزعجك الإشعار مجدداً.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">أمثلة تقنية:</span> futech_theme, futech_cookie_consent, preferred_currency
            </div>
          </div>

          {/* Category 3 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c1626]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#14283d] dark:text-white">
                    3. التخزين المؤقت للبيانات السحابية (Local Data Sync)
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">لسرعة الاستجابة اللحظية</span>
                </div>
              </div>
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-black text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                تسريع الأداء
              </span>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              تقوم فوتيك بتخزين مؤقت للبيانات العامة مثل قوائم المطورين، والمشاريع البرمجية، والمحادثات الجارية في ذاكرة المتصفح السريعة (LocalStorage). يساعد هذا في تقليل زمن تحميل الصفحات إلى أقل من 20 ملي ثانية وحفظ استهلاك باقة الإنترنت لديك عند التنقل.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">أمثلة تقنية:</span> futech_platform_v8_live, futech_auth_profile
            </div>
          </div>

          {/* Category 4 */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0c1626]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#14283d] dark:text-white">
                    4. معايير الجودة ومطابقة FQS (Quality & Integrity)
                  </h3>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">توثيق ومطابقة الأكواد</span>
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                جودة هندسية
              </span>
            </div>

            <p className="mt-3.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              تُستخدم لقياس استقرار الجلسات البرمجية، وتأكيد هوية المطور عند تسليم الشفرة المصدرية ومستودعات Git Handover، ومطابقة مؤشر الجودة Freelancer Quality Score (FQS) لضمان عدم وجود تلاعب في نسب التقييم أو مواعيد تسليم مراحل المشروع.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">أمثلة تقنية:</span> fqs_integrity_token, delivery_session_handshake
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Privacy Architecture & Security Pillars (Replaces the raw table) */}
      <div className="mt-12 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#0c1626]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-black text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 mb-2">
              <Sparkles size={13} className="text-teal-600 dark:text-teal-400" />
              <span>البنية الهندسية لحفظ البيانات والأمان</span>
            </div>
            <h2 className="text-lg font-black text-[#14283d] sm:text-xl dark:text-white">
              كيف نحمي بياناتك ونضمن استقرار وسرعة تجربتك؟
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              بدلاً من التتبع التسويقي، نكرّس تقنيات التخزين المحلي لثلاث ركائز هندسية تخدم أمان مشروعاتك:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-2xl border border-teal-500/30 bg-teal-50/70 px-3.5 py-2 text-xs font-black text-teal-800 dark:border-teal-500/30 dark:bg-teal-950/40 dark:text-teal-300">
              <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400" />
              <span>نظام حماية موثق</span>
            </span>
          </div>
        </div>

        {/* 3 Modern Architecture Pillar Cards */}
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          
          {/* Pillar 1 */}
          <div className="group rounded-3xl border border-slate-200/70 bg-gradient-to-b from-slate-50/80 to-white p-5 transition-all hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/5 dark:border-slate-800 dark:from-[#0d1828] dark:to-[#09111c]">
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/80 dark:text-teal-300 ring-1 ring-teal-500/20">
                <KeyRound size={22} />
              </div>
              <span className="rounded-full bg-teal-100/70 px-2.5 py-0.5 text-[10px] font-black text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
                أمان وتشفير الجلسة
              </span>
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900 dark:text-white">
              مصادقة الدخول المشفرة (RBAC)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              حماية جلسة دخولك بتشفير TLS 1.3 مع رموز JWT آمنة تنتهي تلقائياً وتمنع أي محاولة لانتحال الشخصية أو اعتراض البيانات.
            </p>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>حماية كاملة من هجمات CSRF و XSS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
                <span>عزل وتشفير صلاحيات الحسابات الحساسة</span>
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="group rounded-3xl border border-slate-200/70 bg-gradient-to-b from-slate-50/80 to-white p-5 transition-all hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5 dark:border-slate-800 dark:from-[#0d1828] dark:to-[#09111c]">
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-300 ring-1 ring-cyan-500/20">
                <Zap size={22} />
              </div>
              <span className="rounded-full bg-cyan-100/70 px-2.5 py-0.5 text-[10px] font-black text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
                تحميل فائق السرعة
              </span>
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900 dark:text-white">
              محرك الذاكرة اللحظية (Zero Lag)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              تخزين مؤقت ذكي لقوائم المطورين والمشاريع في متصفحك يقلل زمن الاستجابة إلى 20ms ويوفر أكثر من 80% من باقة الإنترنت.
            </p>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>تصفح فوري للمشاريع دون انتظار الخادم</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>حفظ محلي فوري لتفضيلات المظهر والعملة</span>
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="group rounded-3xl border border-slate-200/70 bg-gradient-to-b from-slate-50/80 to-white p-5 transition-all hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-slate-800 dark:from-[#0d1828] dark:to-[#09111c]">
            <div className="flex items-center justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300 ring-1 ring-indigo-500/20">
                <GitBranch size={22} />
              </div>
              <span className="rounded-full bg-indigo-100/70 px-2.5 py-0.5 text-[10px] font-black text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                سرية الشيفرات 100%
              </span>
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-900 dark:text-white">
              نزاهة تسليم مستودعات Git Handover
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              حماية تامة لروابط الكود المصدري وعقود SLA ومؤشر FQS، دون مشاركة أي أجزاء برمجية مع جهات أو معلنين خارجيين.
            </p>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/80 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>حظر كامل لمتتبعات الإعلانات (Zero Trackers)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>اتفاقيات سرية وحماية الملكية الفكرية NDA</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Interactive Browser Health Bar */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
              <Fingerprint size={17} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <span>فحص المتصفح اللحظي:</span>
              <span className="font-normal text-slate-500 dark:text-slate-400">متصفحك متصل باتصال مشفر آمن ولا يحتوي على أي ملفات تتبع إعلانية من منصة فوتيك.</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (notify) notify('تم فحص وتحديث الذاكرة المؤقتة لمتصفحك بنجاح ✅ الاتصال آمن 100%');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition active:scale-95 shrink-0"
            >
              <RefreshCw size={12} />
              <span>إعادة فحص الذاكرة المؤقتة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zero Ads & Privacy Commitment Callout */}
      <div className="mt-10 rounded-3xl border border-teal-500/20 bg-teal-50/60 p-6 dark:border-teal-500/30 dark:bg-teal-950/30">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="text-sm font-black text-teal-900 dark:text-teal-200">
              التزام صارم: خلو المنصة من متتبعات الإعلانات الخارجية بنسبة 100%
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-teal-800/90 dark:text-teal-300/80">
              على عكس المواقع الاستهلاكية، فإن فوتيك منصة هندسية احترافية مخصصة لأصحاب المشاريع والمهندسين. نحن <b className="font-black">لا نضع أي ملفات تتبع إعلانية تجارية (مثل Google AdSense أو Meta Pixel)</b>، ولا نقوم إطلاقاً ببيع أو تأجير أي سجلات أو بيانات تعريفية لأي شبكات تسويقية خارجية.
            </p>
          </div>
        </div>
      </div>

      {/* How to Manage Cookies in Browsers */}
      <div className="mt-10 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#0c1626]">
        <h2 className="text-lg font-black text-[#14283d] sm:text-xl dark:text-white">
          كيفية إدارة أو حظر ملفات تعريف الارتباط عبر متصفحك
        </h2>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          تمنحك جميع متصفحات الويب الحديثة القدرة الكاملة على فحص أو حظر أو مسح ملفات تعريف الارتباط من إعدادات الخصوصية والأمان:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="font-black text-slate-800 dark:text-white">Google Chrome</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              الإعدادات &gt; الخصوصية والأمان &gt; ملفات تعريف الارتباط وبيانات المواقع الأخرى.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="font-black text-slate-800 dark:text-white">Mozilla Firefox</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              الإعدادات &gt; الخصوصية والأمان &gt; الكعكات وبيانات المواقع (Cookies and Site Data).
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="font-black text-slate-800 dark:text-white">Apple Safari</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              التفضيلات (Preferences) &gt; الخصوصية &gt; حظر جميع ملفات تعريف الارتباط أو إدارتها.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="font-black text-slate-800 dark:text-white">Microsoft Edge</div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              الإعدادات &gt; ملفات تعريف الارتباط وأذونات الموقع &gt; إدارة وحذف ملفات الارتباط.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
          <AlertTriangle size={15} className="shrink-0" />
          <span>ملاحظة: حظر ملفات الارتباط الأساسية قد يمنع تسجيل الدخول أو حفظ الجلسات المشفرة في المنصة.</span>
        </div>
      </div>

      {/* Support & Queries */}
      <div className="mt-10 mb-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white p-6 sm:flex-row sm:p-8 dark:border-slate-800 dark:bg-gradient-to-r dark:from-[#0c1626] dark:to-[#08101d]">
        <div>
          <h3 className="text-sm font-black text-[#14283d] sm:text-base dark:text-white">
            هل لديك أي استفسار حول سياسة ملفات الارتباط والأمان؟
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            فريق حوكمة المنصة ومسؤولو الأمان السيبراني جاهزون للرد على استفساراتك الهندسية والمؤسسية.
          </p>
        </div>

        <Link
          href="/support?tab=channels"
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#14283d] px-6 text-xs font-black text-white shadow-md hover:bg-[#1c3856] dark:bg-teal-600 dark:hover:bg-teal-700 transition"
        >
          <span>تواصل مع الإدارة والدعم</span>
          <ArrowLeft size={14} />
        </Link>
      </div>

    </div>
  );
}
