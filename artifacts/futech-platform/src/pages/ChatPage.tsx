import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Paperclip,
  Eye,
  FileText,
  Archive,
  Download,
  Check,
  X,
  Send,
} from 'lucide-react';
import { Store, Project, Conversation, MessageItem, MessageAttachment } from '../types';
import { sendMessageInSupabase, subscribeToLiveMessages } from '../lib/supabaseData';
import { sendBrowserNotification } from '../lib/webPushNotifications';

interface ChatPageProps {
  store: Store;
  update: (key: keyof Store, value: any) => void;
  notify: (msg: string) => void;
  requestedId?: string;
}

export function ChatPage({ store, update, notify, requestedId }: ChatPageProps) {
  const [selectedId, setSelectedId] = useState<string>(
    requestedId || store.conversations[0]?.id || ''
  );
  const [message, setMessage] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const conv = store.conversations.find((c: Conversation) => c.id === selectedId);

  // Supabase Realtime Live Messages Subscription
  useEffect(() => {
    if (!conv?.id) return;
    const unsubscribe = subscribeToLiveMessages(conv.id, (incomingMsg: any) => {
      if (incomingMsg.sender_id !== store.currentUser?.id) {
        sendBrowserNotification('رسالة برمجية جديدة في فوتيك 💬', {
          body: incomingMsg.content ? incomingMsg.content.substring(0, 90) : 'تم إرسال ملف مرفق جديد',
          tag: 'futech-chat-' + conv.id,
          url: '/chat',
        });
        const receivedItem: MessageItem = {
          id: incomingMsg.id,
          body: incomingMsg.content,
          sender: 'other',
          time: new Date(incomingMsg.created_at).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
          read: true,
          attachments: incomingMsg.file_url ? [{
            id: 'att-' + incomingMsg.id,
            name: 'ملف مرفق',
            size: '',
            type: 'file',
            url: incomingMsg.file_url,
          }] : undefined,
        };
        update(
          'conversations',
          store.conversations.map((c: Conversation) =>
            c.id === conv.id ? { ...c, messages: [...c.messages, receivedItem] } : c
          )
        );
      }
    });
    return () => unsubscribe();
  }, [conv?.id, store.currentUser?.id]);

  // Associated Project if available
  const associatedProject = conv
    ? store.projects.find((p: Project) => p.id === conv.projectId)
    : null;

  // File Attachment Handler
  const handleAttachFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAtts: MessageAttachment[] = [];
    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isDoc = file.name.endsWith('.doc') || file.name.endsWith('.docx');
      const isArchive = file.name.endsWith('.zip') || file.name.endsWith('.rar');

      const type: MessageAttachment['type'] = isImg
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

      newAtts.push({
        id: 'att-chat-' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: sizeStr,
        type,
        url: isImg ? URL.createObjectURL(file) : '#',
      });
    });

    setPendingAttachments((prev) => [...prev, ...newAtts]);
    notify(`تم إرفاق ${newAtts.length} ملف/صورة للمحادثة`);
    if (chatFileInputRef.current) chatFileInputRef.current.value = '';
  };

  const handleRemovePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = () => {
    if ((!message.trim() && pendingAttachments.length === 0) || !conv) return;

    const newMsg: MessageItem = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      body: message.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
      read: true,
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
    };

    if (store.currentUser?.id && conv.id) {
      sendMessageInSupabase(conv.id, store.currentUser.id, newMsg.body);
    }

    update(
      'conversations',
      store.conversations.map((c: Conversation) =>
        c.id === conv.id ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );
    setMessage('');
    setPendingAttachments([]);

    // Context-aware simulated reply
    setTimeout(() => {
      const hadAttachment = newMsg.attachments && newMsg.attachments.length > 0;
      const replyText = hadAttachment
        ? 'أهلاً بك! تم استلام الملفات المرفقة بنجاح، سأقوم بفحصها ومراجعة التفاصيل معك فوراً.'
        : 'أهلاً بك! تم استلام رسالتك وسأراجع التفاصيل معك فوراً للاتفاق على خطة العمل.';

      const replyMsg: MessageItem = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        body: replyText,
        sender: 'other',
        time: new Date().toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' }),
        read: true,
      };

      update(
        'conversations',
        store.conversations.map((c: Conversation) =>
          c.id === conv.id ? { ...c, messages: [...c.messages, replyMsg] } : c
        )
      );
    }, 1500);
  };

  return (
    <div className="grid min-h-[640px] overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-sm md:grid-cols-12 dark:border-slate-800 dark:bg-[#0c1524]" dir="rtl">
      {/* Hidden File Input for Chat Attachments */}
      <input
        ref={chatFileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.zip,.rar,.fig,.xd,.txt"
        className="hidden"
        onChange={handleAttachFiles}
      />

      {/* Conversations Sidebar List */}
      <div className="border-l border-slate-200/80 md:col-span-4 dark:border-slate-800 flex flex-col">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#152a40] dark:text-white">المحادثات المفتوحة</h3>
            <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-[10px] font-black text-teal-700 dark:text-teal-300">
              {store.conversations.length} جهات اتصال
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            تواصل مباشر وفوري بين أصحاب المشاريع والمهندسين المعتمدين
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-y-auto flex-1">
          {store.conversations.map((c: Conversation) => (
            <div
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex cursor-pointer items-center gap-3 p-4 transition ${
                c.id === selectedId
                  ? 'bg-teal-50/70 border-r-4 border-r-teal-500 dark:bg-teal-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <div className="relative shrink-0">
                {c.otherUserAvatar && c.otherUserAvatar.trim() !== '' ? (
                  <img
                    src={c.otherUserAvatar}
                    alt={c.otherUser}
                    className="h-11 w-11 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                ) : (
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-sm font-black text-amber-400 ring-2 ring-slate-100 shadow-sm dark:ring-slate-800">
                    {c.otherUser ? c.otherUser.charAt(0) : 'م'}
                  </div>
                )}
                {c.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c1524]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#152a40] dark:text-white">{c.otherUser}</h4>
                  <span className="text-[10px] text-slate-400">
                    {c.messages.at(-1)?.time || ''}
                  </span>
                </div>
                <div className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {(() => {
                    const lastMsg = c.messages.at(-1);
                    if (lastMsg && lastMsg.attachments && lastMsg.attachments.length > 0) {
                      return (
                        <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold">
                          <Paperclip size={11} />
                          <span>[مرفق: {lastMsg.attachments[0].name}]</span>
                        </span>
                      );
                    }
                    return lastMsg?.body || 'بدء المحادثة';
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Chat View */}
      <div className="flex flex-col md:col-span-8 bg-[#fafbfc] dark:bg-[#080e1a]">
        {conv ? (
          <>
            {/* Chat Top Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-3.5 dark:border-slate-800 dark:bg-[#0c1524]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {conv.otherUserAvatar && conv.otherUserAvatar.trim() !== '' ? (
                    <img
                      src={conv.otherUserAvatar}
                      alt={conv.otherUser}
                      className="h-11 w-11 rounded-2xl object-cover ring-2 ring-teal-500/20"
                    />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#152a40] via-[#1f3f61] to-[#2d5a8a] text-sm font-black text-amber-400 ring-2 ring-teal-500/20 shadow-sm">
                      {conv.otherUser ? conv.otherUser.charAt(0) : 'م'}
                    </div>
                  )}
                  {conv.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0c1524] animate-pulse" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-[#152a40] dark:text-white">{conv.otherUser}</h4>
                    <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                      متصل الآن
                    </span>
                  </div>
                  {associatedProject && (
                    <p className="mt-0.5 text-[10px] text-slate-400 truncate max-w-xs">
                      المشروع: <span className="text-teal-600 dark:text-teal-400 font-bold">{associatedProject.title}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Header Action Button for Attachments */}
              <button
                type="button"
                onClick={() => chatFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-50/70 px-3 py-1.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-950/40 dark:text-teal-300"
                title="إرفاق صور أو وثائق للمشروع"
              >
                <Paperclip size={13} />
                <span className="hidden sm:inline">إرفاق ملف</span>
              </button>
            </div>

            {/* Messages Scroll Thread */}
            <div className="flex-1 space-y-3.5 overflow-y-auto p-5 sm:p-6 text-xs">
              {conv.messages.map((m: MessageItem) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'me' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 leading-relaxed shadow-2xs ${
                      m.sender === 'me'
                        ? 'rounded-tl-xs bg-gradient-to-r from-[#14293f] via-[#1b3957] to-[#1e4368] text-white dark:from-teal-700 dark:via-teal-600 dark:to-cyan-600 dark:text-slate-950 font-medium'
                        : 'rounded-tr-xs border border-slate-200/80 bg-white text-slate-800 dark:border-slate-800 dark:bg-[#0c1524] dark:text-slate-100'
                    }`}
                  >
                    {/* Render Attachments in message bubble if any */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="space-y-2 mb-2.5">
                        {m.attachments.map((att) => (
                          <div key={att.id}>
                            {att.type === 'image' && att.url && att.url !== '#' ? (
                              <div
                                onClick={() => setLightboxImage(att.url)}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
                              >
                                <img
                                  src={att.url}
                                  alt={att.name}
                                  className="max-h-56 w-full object-cover transition duration-300 group-hover:scale-102"
                                />
                                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                                  <Eye size={16} />
                                  <span>معاينة الصورة بالحجم الكامل</span>
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex items-center justify-between gap-3 rounded-2xl border p-2.5 text-xs ${
                                  m.sender === 'me'
                                    ? 'border-white/20 bg-white/10 text-white'
                                    : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                                      att.type === 'pdf'
                                        ? 'bg-rose-500/20 text-rose-300'
                                        : att.type === 'doc'
                                        ? 'bg-blue-500/20 text-blue-300'
                                        : att.type === 'archive'
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : 'bg-teal-500/20 text-teal-300'
                                    }`}
                                  >
                                    {att.type === 'pdf' ? (
                                      <FileText size={18} className="text-rose-500" />
                                    ) : att.type === 'archive' ? (
                                      <Archive size={18} className="text-amber-500" />
                                    ) : (
                                      <Paperclip size={18} />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="truncate text-xs font-black max-w-[170px]">{att.name}</div>
                                    <div className="text-[10px] opacity-75">{att.size}</div>
                                  </div>
                                </div>

                                <a
                                  href={att.url}
                                  download={att.name}
                                  onClick={(e) => {
                                    if (att.url === '#') {
                                      e.preventDefault();
                                      notify(`جاري تحميل ملف: ${att.name}`);
                                    }
                                  }}
                                  className={`grid h-8 w-8 place-items-center rounded-xl transition ${
                                    m.sender === 'me'
                                      ? 'hover:bg-white/20 text-white'
                                      : 'hover:bg-slate-200 text-slate-600 dark:hover:bg-slate-800 dark:text-slate-300'
                                  }`}
                                  title="تحميل الملف المرفق"
                                >
                                  <Download size={14} />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Text Body */}
                    {m.body && <div className="whitespace-pre-line leading-relaxed">{m.body}</div>}

                    {/* Message Time Stamp */}
                    <div
                      className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] ${
                        m.sender === 'me'
                          ? 'text-slate-300 dark:text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      <span>{m.time}</span>
                      {m.sender === 'me' && <Check size={11} className="stroke-[2.5]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Attachments Tray (Shows before sending) */}
            <AnimatePresence>
              {pendingAttachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 border-t border-slate-200/80 bg-slate-100/70 p-3 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  {pendingAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pe-3 text-xs shadow-2xs dark:border-slate-700 dark:bg-[#0c1524]"
                    >
                      {att.type === 'image' && att.url ? (
                        <img
                          src={att.url}
                          alt={att.name}
                          className="h-8 w-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                          {att.type === 'pdf' ? <FileText size={16} className="text-rose-500" /> : <Paperclip size={16} />}
                        </div>
                      )}

                      <div className="min-w-0 max-w-[140px]">
                        <div className="truncate text-[11px] font-black text-slate-800 dark:text-white">
                          {att.name}
                        </div>
                        <div className="text-[9px] text-slate-400">{att.size}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePendingAttachment(att.id)}
                        className="grid h-6 w-6 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        title="إزالة المرفق"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input & Attachments Action Bar */}
            <div className="flex items-center gap-2 border-t border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-[#0c1524]">
              {/* Attachment Button for Images & Files */}
              <button
                type="button"
                onClick={() => chatFileInputRef.current?.click()}
                title="إرفاق صور أو ملفات"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
              >
                <Paperclip size={18} />
              </button>

              {/* Text Input */}
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={
                  pendingAttachments.length > 0
                    ? "أضف تعليقاً على المرفقات، أو اضغط إرسال..."
                    : "اكتب رسالتك للمطور أو العميل هنا..."
                }
                className="h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-white"
              />

              {/* Send Message Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() && pendingAttachments.length === 0}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 text-xs font-black text-white shadow-md shadow-teal-600/20 transition hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send size={15} />
                <span className="hidden sm:inline">إرسال</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-xs text-slate-400">
            <MessageCircle size={36} className="text-slate-300 dark:text-slate-700 mb-2" />
            <span className="font-bold">اختر محادثة من القائمة للبدء</span>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full Image Preview */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-2 shadow-2xl"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80"
              >
                <X size={18} />
              </button>

              <img
                src={lightboxImage}
                alt="معاينة الصورة بالحجم الكامل"
                className="max-h-[82vh] w-auto rounded-2xl object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
