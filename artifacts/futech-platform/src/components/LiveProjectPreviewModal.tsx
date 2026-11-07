import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, Monitor, Smartphone, RefreshCw, Lock,
  ShieldCheck, CheckCircle2, Github, Star, ChevronRight,
  Sparkles, Layers, ArrowUpRight, BarChart3, Database,
  Cpu, FileText, Send, AlertTriangle, Play, Check
} from 'lucide-react';
import { PortfolioItem, Developer } from '../types';

interface LiveProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortfolioItem | null;
  developer?: Developer | null;
  onHireDeveloper?: (dev: Developer) => void;
}

export function LiveProjectPreviewModal({
  isOpen,
  onClose,
  project,
  developer,
  onHireDeveloper,
}: LiveProjectPreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'stack'>('preview');

  // Interactive Live Demo states
  const [inventorySearch, setInventorySearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('الفرع الرئيسي - الرياض');
  const [aiPrompt, setAiPrompt] = useState('هل يتضمن العقد شرط جزائي عند تأخر التسليم؟');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(
    'نعم، ينص البند 8.2 على فرض غرامة تأخير قدرها 1,500 ريال عن كل يوم عمل بحد أقصى 10% من القيمة الإجمالية للعقد.'
  );

  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [selectedSlot, setSelectedSlot] = useState('10:30 صباحاً');

  if (!isOpen || !project) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleRunAiAnalysis = () => {
    if (!aiPrompt.trim()) return;
    setAiAnalyzing(true);
    setTimeout(() => {
      setAiAnalyzing(false);
      setAiAnswer(`تم فحص المستند البرمجي: الإجابة الدقيقة وفق المادة التعاقدية تشير إلى استيفاء الشروط بنسبة 98.4% مع توثيق المصدر.`);
    }, 700);
  };

  const previewType = project.previewType || 'dashboard';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-2 sm:p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-700/60 bg-[#0d1624] text-slate-100 shadow-2xl shadow-black/80"
        dir="rtl"
      >
        {/* Top Control Bar: Browser Window Chrome */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0a111c] px-4">
          {/* Left: Window Dots & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" dir="ltr">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 hover:opacity-100 cursor-pointer" onClick={onClose} />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 hover:opacity-100 cursor-pointer" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 hover:opacity-100 cursor-pointer" />
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-4 w-px bg-slate-700" />
              <span className="text-xs font-black text-white truncate max-w-[220px]">
                {project.title}
              </span>
              <span className="rounded-md bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                Live Preview
              </span>
            </div>
          </div>

          {/* Center: Simulated SSL Address Bar */}
          <div className="flex flex-1 max-w-md items-center justify-between rounded-xl border border-slate-700/80 bg-[#121e30] px-3 py-1.5 text-xs text-slate-300 mx-3 shadow-inner" dir="ltr">
            <div className="flex items-center gap-2 truncate">
              <Lock size={12} className="text-emerald-400 shrink-0" />
              <span className="text-emerald-400 font-mono text-[11px]">https://</span>
              <span className="font-mono text-slate-200 text-[11px] truncate">
                {project.liveUrl ? project.liveUrl.replace('https://', '') : `demo.futech.dev/live/${project.id}`}
              </span>
            </div>

            <button
              onClick={handleRefresh}
              title="إعادة تحميل المعاينة"
              className="text-slate-400 hover:text-white transition p-1"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Right: Device Mode Switcher & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-700/80 bg-[#121e30] p-1" dir="ltr">
              <button
                onClick={() => setDeviceMode('desktop')}
                title="عرض على شاشة الكمبيوتر"
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                  deviceMode === 'desktop'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                title="عرض على شاشة الجوال"
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                  deviceMode === 'mobile'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone size={14} />
              </button>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-1.5 rounded-xl border border-slate-700 bg-[#14233a] px-3 py-1.5 text-xs font-bold text-teal-300 hover:bg-teal-500/20 hover:border-teal-400 md:inline-flex"
              >
                <ExternalLink size={13} />
                <span>زيارة الموقع</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-[#152338] p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Sub-header: Project & Developer Info Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-[#0e1726] px-6 py-2.5 text-xs">
          <div className="flex items-center gap-3">
            {developer && (
              <div className="flex items-center gap-2">
                {developer.avatar && developer.avatar.trim() !== '' ? (
                  <img
                    src={developer.avatar}
                    alt={developer.name}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-teal-400/30"
                  />
                ) : (
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-teal-500/20 text-xs font-black text-teal-300 ring-1 ring-teal-400/30">
                    {developer.name ? developer.name.charAt(0) : 'م'}
                  </div>
                )}
                <div>
                  <span className="font-extrabold text-white">{developer.name}</span>
                  <span className="text-[10px] text-slate-400 mr-1.5">({developer.specialty})</span>
                </div>
              </div>
            )}

            {project.metrics && (
              <span className="rounded-lg bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 text-[11px] font-bold text-teal-300">
                ⚡ {project.metrics}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <Github size={13} />
                <span>مستودع الكود Git</span>
              </a>
            )}

            {developer && onHireDeveloper && (
              <button
                onClick={() => onHireDeveloper(developer)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-1.5 text-[11px] font-black text-slate-950 shadow-md shadow-teal-500/30 hover:brightness-110 active:scale-95"
              >
                <Sparkles size={13} />
                <span>توظيف المطور لهذا المشروع</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Interactive Preview Screen Container */}
        <div className="relative flex-1 overflow-y-auto bg-[#070d17] p-4 md:p-6">
          <div
            className={`mx-auto transition-all duration-300 ${
              deviceMode === 'mobile'
                ? 'max-w-sm rounded-[40px] border-4 border-slate-700/80 shadow-2xl overflow-hidden bg-slate-900 p-2'
                : 'w-full'
            }`}
          >
            {/* 1. DASHBOARD PREVIEW SIMULATION (e.g. Inventory Pro & Multi-Branch SaaS) */}
            {(previewType === 'dashboard' || previewType === 'saas') && (
              <div className="rounded-2xl border border-slate-800 bg-[#0f1b2d] p-5 shadow-xl text-slate-100">
                {/* Live System Topbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500/20 text-teal-300 font-black">
                        PRO
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-white">{project.title}</h4>
                        <p className="text-[10px] text-slate-400">لوحة تحكم تشغيلية مباشرة • FQS Certified</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 outline-none"
                    >
                      <option>الفرع الرئيسي - الرياض</option>
                      <option>فرع جدة - الكورنيش</option>
                      <option>فرع الدمام - الخليج</option>
                    </select>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>متصل لحظياً</span>
                    </span>
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-slate-800 bg-[#132238] p-3.5">
                    <span className="text-[10px] font-bold text-slate-400">المبيعات اليومية</span>
                    <div className="mt-1 text-lg font-black text-teal-400">42,850 ر.س</div>
                    <span className="text-[9px] text-emerald-400 font-bold">▲ +14.2% مقارنة بأمس</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#132238] p-3.5">
                    <span className="text-[10px] font-bold text-slate-400">الطلبات المكتملة</span>
                    <div className="mt-1 text-lg font-black text-white">318 طلب</div>
                    <span className="text-[9px] text-teal-300 font-bold">متوسط التحضير: 12 دقيقة</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#132238] p-3.5">
                    <span className="text-[10px] font-bold text-slate-400">تنبيهات انخفاض المخزون</span>
                    <div className="mt-1 text-lg font-black text-amber-400">3 أصناف</div>
                    <span className="text-[9px] text-amber-300 font-bold">إعادة طلب تلقائي مفعّلة</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#132238] p-3.5">
                    <span className="text-[10px] font-bold text-slate-400">سرعة استجابة السيرفر</span>
                    <div className="mt-1 text-lg font-black text-cyan-300">120ms</div>
                    <span className="text-[9px] text-slate-400 font-bold">كود مُحسن وفق معايير FQS</span>
                  </div>
                </div>

                {/* Live Search and Items Table */} 
                <div className="mt-5 rounded-xl border border-slate-800 bg-[#0c1624] p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="ابحث في سجل المخزون والعمليات اللحظية..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full max-w-sm rounded-xl border border-slate-700 bg-[#132238] px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-teal-400"
                    />
                    <span className="text-[10px] text-slate-400">عرض 4 من أصل 1,840 عنصر</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-400">
                          <th className="pb-2">الرمز (SKU)</th>
                          <th className="pb-2">اسم الصنف</th>
                          <th className="pb-2">الكمية المتوفرة</th>
                          <th className="pb-2">الحالة</th>
                          <th className="pb-2 text-left">الإجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                        <tr>
                          <td className="py-2.5 font-mono text-teal-400">SKU-9402</td>
                          <td className="py-2.5 font-bold">سيرفر معالجة الحوسبة السحابية</td>
                          <td className="py-2.5">48 وحدة</td>
                          <td className="py-2.5">
                            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300">
                              متوفر
                            </span>
                          </td>
                          <td className="py-2.5 text-left">
                            <button className="rounded-lg bg-teal-500/20 px-2 py-1 text-[10px] text-teal-300 hover:bg-teal-500/30">
                              تفاصيل
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-400">SKU-7711</td>
                          <td className="py-2.5 font-bold">حزمة تراخيص قاعدة البيانات الموزعة</td>
                          <td className="py-2.5">120 ترخيص</td>
                          <td className="py-2.5">
                            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[9px] text-emerald-300">
                              متوفر
                            </span>
                          </td>
                          <td className="py-2.5 text-left">
                            <button className="rounded-lg bg-teal-500/20 px-2 py-1 text-[10px] text-teal-300 hover:bg-teal-500/30">
                              تفاصيل
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-teal-400">SKU-4409</td>
                          <td className="py-2.5 font-bold">أجهزة نقاط البيع اللمسية الذكية</td>
                          <td className="py-2.5 text-amber-400 font-bold">4 قطع</td>
                          <td className="py-2.5">
                            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[9px] text-amber-300">
                              كمية منخفضة
                            </span>
                          </td>
                          <td className="py-2.5 text-left">
                            <button className="rounded-lg bg-amber-500/20 px-2 py-1 text-[10px] text-amber-300 hover:bg-amber-500/30">
                              طلب توريد
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. AI / RAG SIMULATION (e.g. Legal AI & Smart Document Search) */}
            {previewType === 'ai' && (
              <div className="rounded-2xl border border-slate-800 bg-[#0e1929] p-5 shadow-xl text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 font-black">
                      AI
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-white">{project.title}</h4>
                      <p className="text-[10px] text-cyan-300">نظام استرجاع دلالي RAG بالعربية • دقة 96%</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] font-black text-cyan-300">
                    Vector DB Active
                  </span>
                </div>

                {/* Prompt Box */}
                <div className="mt-4">
                  <label className="text-[11px] font-bold text-slate-300">اطرح سؤالاً ذكياً على العقد البرمجي المرفق:</label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="اسأل أي استفسار قانوني أو تقني..."
                      className="flex-1 rounded-xl border border-slate-700 bg-[#122238] px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={handleRunAiAnalysis}
                      disabled={aiAnalyzing}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-xs font-black text-slate-950 hover:brightness-110 active:scale-95 disabled:opacity-50"
                    >
                      {aiAnalyzing ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                      <span>تحليل</span>
                    </button>
                  </div>
                </div>

                {/* AI Answer Card */}
                {aiAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border border-cyan-500/30 bg-[#10243d] p-4 text-xs"
                  >
                    <div className="flex items-center gap-2 font-black text-cyan-300 mb-2">
                      <Sparkles size={14} />
                      <span>إجابة المساعد الذكي المستندة إلى الوثيقة:</span>
                    </div>
                    <p className="leading-relaxed text-slate-200">{aiAnswer}</p>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-700/60 pt-2.5 text-[10px] text-slate-400">
                      <span>المصدر: وثيقة العقد الموحد (البند 8، الصفحة 4)</span>
                      <span className="text-emerald-400 font-bold">درجة الثقة: 98.7%</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* 3. MOBILE APP SIMULATION (e.g. Medical Clinic Booking) */}
            {previewType === 'mobile' && (
              <div className="rounded-2xl border border-slate-800 bg-[#0f1b2d] p-5 shadow-xl text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="text-xs font-black text-white">{project.title}</div>
                  <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                    Flutter Native
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="rounded-xl bg-[#142338] p-3">
                    <span className="text-[10px] font-bold text-slate-400">الاستشارة الطبية المختارة:</span>
                    <div className="text-xs font-black text-white mt-0.5">عيادة الاستشارات الهندسية والطبية</div>
                    <div className="text-[10px] text-teal-300">د. عبد الرحمن السالم • استشاري أول</div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400">اختر موعد الحجز المتاح اليوم:</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {['09:00 صباحاً', '10:30 صباحاً', '01:00 ظهراً'].map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg py-1.5 text-center text-[10px] font-bold transition ${
                            selectedSlot === slot
                              ? 'bg-teal-500 text-slate-950 font-black'
                              : 'bg-[#142338] text-slate-300 hover:bg-[#1a2d48]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingStep(bookingStep === 1 ? 2 : 1)}
                    className="w-full rounded-xl bg-teal-500 py-2.5 text-center text-xs font-black text-slate-950 shadow-md hover:brightness-110 active:scale-95"
                  >
                    {bookingStep === 1 ? `تأكيد الموعد (${selectedSlot})` : '✓ تم تأكيد الحجز بنجاح!'}
                  </button>
                </div>
              </div>
            )}

            {/* 4. FRONTEND / ECOMMERCE / CMS / WEB VITALS SIMULATION */}
            {(previewType === 'ecommerce' || previewType === 'cms') && (
              <div className="rounded-2xl border border-slate-800 bg-[#0f1b2d] p-5 shadow-xl text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-white">{project.title}</h4>
                    <span className="text-[10px] text-teal-300">Core Web Vitals 98/100 • تحميل فوري 0.8s</span>
                  </div>
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Lighthouse 98
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { name: 'حزمة برمجة الحوسبة السحابية', price: '450 ر.س', rating: '4.9' },
                    { name: 'قالب المتجر الإلكتروني السريع', price: '320 ر.س', rating: '5.0' },
                    { name: 'أداة الفحص الأمني التلقائي', price: '680 ر.س', rating: '4.8' },
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-[#132238] p-3">
                      <div className="h-20 w-full rounded-lg bg-gradient-to-tr from-slate-800 to-teal-900/40 flex items-center justify-center text-xs font-bold text-teal-200">
                        صورة المنتج الفوري
                      </div>
                      <div className="mt-2 font-bold text-white text-xs">{item.name}</div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-teal-400 font-black">{item.price}</span>
                        <button className="rounded-lg bg-teal-500 px-2.5 py-1 text-[10px] font-bold text-slate-950 hover:brightness-110">
                          إضافة للسلة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. BACKEND / CLOUD / DEVOPS SIMULATION */}
            {(previewType === 'api' || previewType === 'devops') && (
              <div className="rounded-2xl border border-slate-800 bg-[#0a121d] p-5 shadow-xl text-slate-100 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-white">Kubernetes / Go Microservices Cluster</span>
                  </div>
                  <span className="text-teal-400 text-[11px]">Uptime 99.99%</span>
                </div>

                <div className="mt-4 space-y-2 bg-[#060b12] p-3 rounded-xl border border-slate-800/80">
                  <div className="text-emerald-400">[INFO] Cluster nodes initialized (3/3 healthy)</div>
                  <div className="text-slate-300">[API] GET /v1/auth/tokens - 200 OK (8ms)</div>
                  <div className="text-slate-300">[API] POST /v1/sync/orders - 201 Created (14ms)</div>
                  <div className="text-teal-300">[METRICS] Memory usage: 34% | CPU: 12% | Network: 42MB/s</div>
                  <div className="text-emerald-400">[SECURITY] OWASP Zero Vulnerabilities detected</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Specs and Features Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-[#0a111c] px-6 py-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-bold ml-1">التقنيات المستخدمة:</span>
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-200"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-teal-400" />
              <span>تسليم مستودع Git كامل بنسبة 100%</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
