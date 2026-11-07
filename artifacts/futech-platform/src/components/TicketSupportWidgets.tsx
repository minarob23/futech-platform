import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Image as ImageIcon, Video, FileText, UploadCloud,
  X, Copy, Check, Trash2, Eye, Play, Sparkles, Download,
  AlertCircle, ShieldCheck, FileCode, CheckCircle2, Maximize2
} from 'lucide-react';
import { TicketAttachment } from '../types';

// =========================================================================
// 1. TERMINAL PRESETS
// =========================================================================
export const ERROR_LOG_PRESETS = [
  {
    label: 'خطأ 500 API',
    tag: 'Database Connection Timeout',
    content: `[2026-11-04T11:42:01.320Z] ERROR (Backend-Gateway): PostgreSQL Pool Exhausted
  Error: Connection terminated unexpectedly (500 Internal Server Error)
    at Connection.parseE (/app/node_modules/pg/lib/connection.js:614:13)
    at Query.handleError (/app/node_modules/pg/lib/query.js:145:19)
    at Client._handleError (/app/node_modules/pg/lib/client.js:351:19)
  endpoint: POST /api/v1/orders/checkout
  latency: 5042ms (Timeout limit: 5000ms)`,
  },
  {
    label: 'Nginx & SSL',
    tag: 'Handshake & Let\'s Encrypt',
    content: `[root@cluster-srv ~]# nginx -t
nginx: [warn] "ssl_stapling" ignored, issuer cert not found
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
[root@cluster-srv ~]# certbot renew --dry-run
Simulating renewal of an existing certificate for api.rofof.sa
Attempting to renew cert (api.rofof.sa) from /etc/letsencrypt/renewal/api.rofof.sa.conf
Failed to renew certificate: The server could not connect to client token`,
  },
  {
    label: 'React / Next Crash',
    tag: 'Hydration Failed',
    content: `Unhandled Runtime Error: Hydration failed because the initial UI does not match what was rendered on the server.
Warning: Expected server HTML to contain a matching <div> in <section>.
  at CheckoutSummary (components/CheckoutSummary.tsx:42:11)
  at main
  at AppLayout (components/AppLayout.tsx:18:5)
Call Stack:
  throwOnHydrationMismatch (react-dom.development.js:12507:9)
  tryToClaimMatchedChildren (react-dom.development.js:12520:7)`,
  },
  {
    label: 'Docker OOMKilled',
    tag: 'Container Crash',
    content: `2026-11-04 10:15:22 [Docker Engine] Container futech-worker-ai exited with code 137
Status: OOMKilled (Out of Memory)
Memory limit: 2048MB | Consumed at crash: 2047.8MB
Active threads: 14 Python worker threads in worker_rag_engine.py
Action required: Increase memory allocation or optimize chunk batching size.`,
  },
  {
    label: 'iOS APNs / FCM',
    tag: 'Duplicate Delivery',
    content: `[iOS 18.1 APNs Handler] Received push notification payload:
{
  "aps": { "alert": { "title": "تذكير بموعدك", "body": "موعدك غداً الساعة 4:00 م" } },
  "message_id": "sanabel-notif-98214"
}
WARN: FCM deduplication token empty -> re-triggering didFinishLaunchingWithOptions
FATAL EXCEPTION: Duplicate delivery acknowledged 2x in 140ms
    at NotificationCenter.userNotificationCenter(_:didReceive:withCompletionHandler:)`,
  },
];

// =========================================================================
// 2. TERMINAL CONSOLE (EDITOR & VIEWER)
// =========================================================================
interface TerminalConsoleProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  title?: string;
  maxHeight?: string;
}

export function TerminalConsole({
  value,
  onChange,
  readOnly = false,
  title = 'futech@cloud-monitor: ~ / stderr.log',
  maxHeight = '280px',
}: TerminalConsoleProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'presets'>('console');

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = value ? value.split('\n').length : 0;
  const charCount = value ? value.length : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-[#090f1d] text-slate-200 shadow-xl" dir="ltr">
      {/* Terminal Top Chrome Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-[#060a14] px-3.5 py-2">
        {/* Left: Window Dots & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ef4444]/90 shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-[#f59e0b]/90 shadow-2xs" />
            <span className="h-3 w-3 rounded-full bg-[#10b981]/90 shadow-2xs" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-400">
            <Terminal size={13} className="text-[#38d9df]" />
            <span className="truncate max-w-[220px] sm:max-w-[340px] text-[11px] text-slate-300">
              {title}
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {!readOnly && (
            <div className="flex items-center gap-1">
              {ERROR_LOG_PRESETS.slice(0, 3).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange?.(p.content)}
                  className="hidden md:inline-flex rounded-lg border border-slate-700/60 bg-slate-800/60 px-2 py-0.5 text-[10px] font-mono text-cyan-300 transition hover:bg-slate-700 hover:text-white"
                  title={p.tag}
                >
                  ⚡ {p.label}
                </button>
              ))}
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700/70 bg-slate-800/80 px-2.5 py-1 text-[11px] font-mono font-bold text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>نسخ</span>
                </>
              )}
            </button>
          )}

          {!readOnly && value && (
            <button
              type="button"
              onClick={() => onChange?.('')}
              className="inline-flex items-center gap-1 rounded-lg border border-rose-950/60 bg-rose-950/30 px-2 py-1 text-[11px] font-mono font-bold text-rose-300 transition hover:bg-rose-900/50"
              title="مسح السجل"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Editor / Viewer Body */}
      <div className="relative font-mono text-xs">
        {/* Terminal Prompt Prefix */}
        <div className="flex items-center gap-2 border-b border-slate-800/60 bg-[#080d19] px-4 py-1.5 text-[11px] text-slate-400 select-none">
          <span className="text-emerald-400 font-bold">$</span>
          <span className="text-cyan-300">futech-trace</span>
          <span className="text-slate-500">--tail=stderr --level=all</span>
          <span className="text-[10px] text-slate-600 ml-auto">UNIX (LF)</span>
        </div>

        {readOnly ? (
          <div
            className="overflow-x-auto p-4 leading-relaxed text-emerald-300 selection:bg-teal-500/30 whitespace-pre"
            style={{ maxHeight }}
          >
            {value.split('\n').map((line, idx) => {
              const isError = line.includes('ERROR') || line.includes('Error:') || line.includes('FATAL') || line.includes('OOMKilled');
              const isWarn = line.includes('WARN') || line.includes('Warning:');
              const isStack = line.trim().startsWith('at ');
              return (
                <div key={idx} className="flex gap-3 leading-relaxed">
                  <span className="w-8 shrink-0 select-none text-right text-[11px] text-slate-600">
                    {idx + 1}
                  </span>
                  <span
                    className={
                      isError
                        ? 'text-rose-400 font-semibold'
                        : isWarn
                        ? 'text-amber-400'
                        : isStack
                        ? 'text-slate-400'
                        : 'text-emerald-300'
                    }
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative">
            <textarea
              rows={4}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={`# الصق هنا رسائل الخطأ من الـ Console أو سجلات السيرفر أو تقارير الاستثناءات...\nFATAL [2026-11-04] Error: ECONNREFUSED 127.0.0.1:5432\n    at TCPConnectWrap.afterConnect (node:net:1607)`}
              className="w-full resize-y bg-[#090f1d] p-4 text-xs font-mono text-emerald-300 placeholder:text-slate-600 outline-none leading-relaxed transition"
              style={{ minHeight: '120px', maxHeight }}
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Terminal Status Footer */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-800/80 bg-[#060a14] px-3.5 py-1.5 text-[10px] font-mono text-slate-500 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            Shell: bash / stderr
          </span>
          <span>UTF-8</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{lineCount} سطور</span>
          <span>·</span>
          <span>{charCount} حرف</span>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 3. TICKET ATTACHMENT UPLOADER & MANAGER
// =========================================================================
interface TicketAttachmentManagerProps {
  attachments: TicketAttachment[];
  onChange: (items: TicketAttachment[]) => void;
  disabled?: boolean;
}

export function TicketAttachmentManager({
  attachments,
  onChange,
  disabled = false,
}: TicketAttachmentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  // Real file upload processor
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: TicketAttachment[] = [];

    Array.from(files).forEach((file) => {
      let type: TicketAttachment['type'] = 'file';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';

      const formattedSize = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : (file.size / 1024).toFixed(0) + ' KB';

      const item: TicketAttachment = {
        id: 'att-' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: formattedSize,
        type,
        previewUrl: type === 'image' ? URL.createObjectURL(file) : undefined,
      };

      newItems.push(item);
    });

    onChange([...attachments, ...newItems]);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  // Attach diagnostic sample logs
  const handleAddSamplePresets = () => {
    const presets: TicketAttachment[] = [
      {
        id: 'sample-img-' + Date.now(),
        name: 'error_screenshot_500.png',
        size: '1.4 MB',
        type: 'image',
        previewUrl: '/images/futech-logo.jpg',
      },
      {
        id: 'sample-vid-' + Date.now(),
        name: 'reproduction_walkthrough.mp4',
        size: '6.8 MB',
        type: 'video',
      },
      {
        id: 'sample-file-' + Date.now(),
        name: 'nginx_server_access.log',
        size: '420 KB',
        type: 'file',
      },
    ];

    onChange([...attachments, ...presets]);
  };

  return (
    <div className="space-y-3" dir="rtl">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.pdf,.zip,.log,.txt,.json,.sql,.ts,.js,.docx"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Zone Card */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition cursor-pointer ${
          disabled
            ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50'
            : 'border-slate-300/80 bg-slate-50/70 hover:border-teal-500 hover:bg-teal-50/20 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-teal-400'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 transition group-hover:scale-110">
            <UploadCloud size={20} />
          </span>
          <div className="text-right">
            <div className="text-xs font-black text-slate-800 dark:text-white">
              انقر أو اسحب لرفع المرفقات (صور، فيديوهات، ملفات)
            </div>
            <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              يدعم الصور (PNG, JPG)، الفيديوهات (MP4, WebM)، وسجلات الأخطاء (LOG, PDF, ZIP)
            </div>
          </div>
        </div>

        {/* Quick Sample Presets Button */}
        <div className="mt-2.5 flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddSamplePresets();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-50 px-3 py-1 text-[10px] font-black text-teal-700 transition hover:bg-teal-100 dark:border-teal-500/30 dark:bg-teal-950/40 dark:text-teal-300"
          >
            <Sparkles size={11} className="text-teal-500" />
            <span>+ تجربة إضافة عينات مرفقة سريعة (صورة + فيديو + سجل Log)</span>
          </button>
        </div>
      </div>

      {/* Attachments List / Grid */}
      {attachments.length > 0 && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {attachments.map((att) => {
            const isImage = att.type === 'image';
            const isVideo = att.type === 'video';

            return (
              <div
                key={att.id}
                className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs transition hover:border-teal-500/40 dark:border-slate-800 dark:bg-[#0c1524]"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Thumbnail / Icon Badge */}
                  <div className="relative shrink-0">
                    {isImage ? (
                      <div
                        onClick={() => att.previewUrl && setSelectedPreviewImage(att.previewUrl)}
                        className="h-10 w-10 cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ring-1 ring-teal-500/20 transition hover:opacity-90 dark:border-slate-700"
                      >
                        <img
                          src={att.previewUrl || '/images/futech-logo.jpg'}
                          alt={att.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : isVideo ? (
                      <div className="grid h-10 w-10 place-items-center rounded-lg border border-indigo-500/30 bg-indigo-50/70 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <Video size={18} />
                      </div>
                    ) : (
                      <div className="grid h-10 w-10 place-items-center rounded-lg border border-amber-500/30 bg-amber-50/70 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        <FileCode size={18} />
                      </div>
                    )}
                  </div>

                  {/* Name & Size */}
                  <div className="min-w-0 flex-1 text-right">
                    <div className="truncate text-xs font-black text-slate-800 dark:text-white" title={att.name}>
                      {att.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-teal-600 dark:text-teal-400">{att.size}</span>
                      <span>·</span>
                      <span>{isImage ? 'صورة شاشة' : isVideo ? 'فيديو توضيحي' : 'ملف تقني'}</span>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(att.id)}
                    className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    title="حذف المرفق"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Modal for Image Preview */}
      <AnimatePresence>
        {selectedPreviewImage && (
          <div
            onClick={() => setSelectedPreviewImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-2xl"
            >
              <img
                src={selectedPreviewImage}
                alt="معاينة الصورة"
                className="max-h-[80vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedPreviewImage(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/90"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================================
// 4. ATTACHMENT VIEW-ONLY LIST (FOR TICKET DETAILS)
// =========================================================================
export function TicketAttachmentViewer({ attachments }: { attachments?: TicketAttachment[] }) {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-900/40" dir="rtl">
      <div className="flex items-center gap-2 text-xs font-black text-slate-800 dark:text-white">
        <UploadCloud size={15} className="text-teal-500" />
        <span>المرفقات التقنية ({attachments.length}):</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {attachments.map((att) => {
          const isImage = att.type === 'image';
          const isVideo = att.type === 'video';

          return (
            <div
              key={att.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-700/80 dark:bg-[#0c1524]"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {isImage ? (
                  <div
                    onClick={() => att.previewUrl && setSelectedPreview(att.previewUrl)}
                    className="h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <img
                      src={att.previewUrl || '/images/futech-logo.jpg'}
                      alt={att.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : isVideo ? (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Video size={16} />
                  </div>
                ) : (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    <FileText size={16} />
                  </div>
                )}

                <div className="min-w-0 flex-1 text-right">
                  <div className="truncate text-xs font-bold text-slate-900 dark:text-white" title={att.name}>
                    {att.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {att.size} · {isImage ? 'صورة' : isVideo ? 'فيديو' : 'مستند/Log'}
                  </div>
                </div>
              </div>

              {isImage && att.previewUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedPreview(att.previewUrl || null)}
                  className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  title="تكبير الصورة"
                >
                  <Eye size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox for preview */}
      <AnimatePresence>
        {selectedPreview && (
          <div
            onClick={() => setSelectedPreview(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-2xl"
            >
              <img
                src={selectedPreview}
                alt="معاينة الصورة"
                className="max-h-[80vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/90"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
