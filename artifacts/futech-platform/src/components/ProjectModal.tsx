import React, { useState } from 'react';
import { X, Paperclip, FileText } from 'lucide-react';
import { Store, Application } from '../types';
import { saveProposalToSupabase } from '../lib/supabaseData';
import { sendBrowserNotification } from '../lib/webPushNotifications';

interface ProjectModalProps {
  modal: { type: string; data?: any };
  close: () => void;
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
}

export function ProjectModal({ modal, close, store, update, notify }: ProjectModalProps) {
  const { type, data } = modal;
  const [plan, setPlan] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan.trim() || plan.trim().length < 15) {
      notify('يرجى كتابة خطة عمل واضحة من 15 حرفًا على الأقل');
      return;
    }

    const newApp: Application = {
      id: 'app-' + Math.random().toString(36).substring(2, 9),
      projectId: data.id,
      developerName: store.currentUser?.name || 'مهندس برمجيات',
      developerId: store.currentUser?.id,
      plan: plan.trim(),
      status: 'قيد المراجعة',
      submittedAt: 'الآن',
    };

    saveProposalToSupabase(newApp, store.currentUser?.id);
    update('applications', [newApp, ...store.applications]);
    sendBrowserNotification('تم إرسال عرضك بنجاح! 🚀', {
      body: `تم تقديم خطتك لمشروع "${data.title}"`,
      tag: 'futech-proposal-' + newApp.id,
      url: '/client-dashboard?tab=proposals',
    });
    notify('تم إرسال خطة التقديم وحفظها في سحابة المنصة بنجاح 📨');
    close();
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#0c1524] dark:border dark:border-slate-800"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h3 className="text-sm font-black text-[#152a40] dark:text-white">
            {type === 'apply' ? 'تقديم عرض وخطة عمل' : data?.title}
          </h3>
          <button onClick={close} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={17} />
          </button>
        </div>

        {type === 'apply' ? (
          <form onSubmit={handleApply} className="mt-4 space-y-4 text-xs">
            <div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">المشروع المطلوب:</div>
              <div className="text-sm font-black text-[#172e47] dark:text-white">{data?.title}</div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300">خطة العمل والتنفيذ المقترحة *</label>
              <textarea
                required
                rows={5}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="وضح كيف ستبدأ بالمشروع، وما هي المخرجات التي ستسلمها في كل مرحلة..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 leading-relaxed outline-none focus:border-[#2ea5ad] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={close}
                className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#203d62] px-5 py-2 font-black text-white hover:bg-[#2b5182] dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                إرسال الخطة
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4 space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed">{data?.description}</p>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
              <div className="font-black text-slate-800 dark:text-white">مراحل التسليم المقترحة:</div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
                {data?.milestones?.map((m: string, idx: number) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>

            {data?.attachments && data.attachments.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="font-black text-slate-800 dark:text-white flex items-center gap-1.5 mb-2.5">
                  <Paperclip size={14} className="text-teal-600 dark:text-teal-400" />
                  <span>المرفقات والملفات الداعمة ({data.attachments.length}):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.attachments.map((att: any) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-[#0c1524]"
                    >
                      {att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          <FileText size={15} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold text-slate-800 dark:text-white">{att.name}</div>
                        <div className="text-[10px] text-slate-400">{att.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={close}
                className="rounded-xl bg-[#203d62] px-5 py-2 font-bold text-white dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
