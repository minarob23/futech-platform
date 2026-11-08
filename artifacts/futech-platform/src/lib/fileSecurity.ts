/**
 * ─────────────────────────────────────────────────────────────────────────────
 * منصة فوتيك - نظام حماية وأمان فحص ورفع الملفات (File Upload Security Engine)
 * ─────────────────────────────────────────────────────────────────────────────
 * يمنع رفع أي ملفات خبيثة أو تنفيذية، مع حظر صارم لملفات HTML و Web Scripts
 * طبقاً لمعايير الأمان العالمية OWASP File Upload Security Cheat Sheet.
 */

export type FileUploadContext = 'chat' | 'project' | 'ticket' | 'cv' | 'avatar' | 'general';

/**
 * الامتدادات الخطرة والمحظورة قطعياً من أي رفع داخل المنصة
 */
export const DANGEROUS_EXTENSIONS = new Set([
  // HTML / Web Execution / XSS vectors
  'html',
  'htm',
  'xhtml',
  'shtml',
  'phtml',
  'hta',
  'mht',
  'mhtml',
  // Executable Scripts & Server Execution
  'php',
  'php3',
  'php4',
  'php5',
  'php7',
  'php8',
  'phps',
  'asp',
  'aspx',
  'ashx',
  'asmx',
  'axd',
  'jsp',
  'jspx',
  'cgi',
  'pl',
  'sh',
  'bash',
  'zsh',
  // System Executables & Binaries
  'exe',
  'dll',
  'so',
  'dylib',
  'bat',
  'cmd',
  'com',
  'vbs',
  'vbe',
  'wsf',
  'wsh',
  'msi',
  'msp',
  'scr',
  'jar',
  'apk',
  'bin',
  'command',
  'ps1',
  'psm1',
  'reg',
  // Direct Script files
  'js',
  'mjs',
  'cjs',
  'vbe',
]);

/**
 * أنواع MIME الخطرة والمحظورة قطعياً
 */
export const DANGEROUS_MIME_TYPES = new Set([
  'text/html',
  'application/xhtml+xml',
  'application/x-httpd-php',
  'application/x-sh',
  'application/x-csh',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'text/javascript',
  'application/javascript',
  'application/x-javascript',
]);

/**
 * الصيغ المسموح بها بحسب سياق الرفع (Whitelist)
 */
export const ALLOWED_EXTENSIONS_BY_CONTEXT: Record<FileUploadContext, string[]> = {
  // مرفقات المحادثات المباشرة بين المطور وصاحب العمل
  chat: [
    'png', 'jpg', 'jpeg', 'webp', 'gif',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf',
    'zip', 'rar', '7z', 'tar', 'gz',
    'fig', 'xd', 'psd', 'ai', 'sketch',
    'mp4', 'mov', 'webm'
  ],
  // مرفقات تفاصيل ومتطلبات المشاريع
  project: [
    'png', 'jpg', 'jpeg', 'webp', 'gif',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf',
    'zip', 'rar', '7z', 'tar', 'gz',
    'fig', 'xd', 'psd', 'ai', 'sketch'
  ],
  // مرفقات تذاكر الدعم الفني وسجلات التشخيص
  ticket: [
    'png', 'jpg', 'jpeg', 'webp', 'gif',
    'mp4', 'mov', 'webm',
    'pdf', 'doc', 'docx',
    'zip', 'rar', '7z',
    'log', 'txt', 'json', 'sql'
  ],
  // ملفات السيرة الذاتية للمطورين
  cv: [
    'pdf', 'docx', 'doc'
  ],
  // الصور الشخصية للأعضاء والشعار
  avatar: [
    'png', 'jpg', 'jpeg', 'webp'
  ],
  // الاستخدام العام
  general: [
    'png', 'jpg', 'jpeg', 'webp', 'gif',
    'pdf', 'doc', 'docx', 'txt', 'zip', 'rar'
  ],
};

/**
 * الحدود القصوى للأحجام بالبايت
 */
export const MAX_FILE_SIZES: Record<FileUploadContext, number> = {
  chat: 25 * 1024 * 1024,     // 25 MB
  project: 25 * 1024 * 1024,  // 25 MB
  ticket: 30 * 1024 * 1024,   // 30 MB
  cv: 10 * 1024 * 1024,       // 10 MB
  avatar: 5 * 1024 * 1024,    // 5 MB
  general: 20 * 1024 * 1024,  // 20 MB
};

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName: string;
  extension: string;
}

export interface FileValidationOptions {
  context?: FileUploadContext;
  allowedExtensions?: string[];
  maxSizeInBytes?: number;
}

/**
 * تنظيف وتأمين اسم الملف من أي مسارات أو أحرف خبيثة
 */
export function sanitizeFileName(name: string): string {
  if (!name) return 'unnamed_file';
  return name
    .replace(/[\0\x00-\x1f\x7f]/g, '') // remove null bytes & control chars
    .replace(/[\/\\]/g, '_')           // prevent directory traversal
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * استخراج امتداد الملف بدقة مع فحص الامتدادات المزدوجة
 */
export function extractFileExtension(fileName: string): string {
  const clean = sanitizeFileName(fileName).toLowerCase();
  const parts = clean.split('.');
  if (parts.length <= 1) return '';
  return parts[parts.length - 1];
}

/**
 * التحقق من خلو الملف من أي امتدادات خبيثة أو مزدوجة (مثل payload.html.png)
 */
export function hasDangerousExtensionInName(fileName: string): boolean {
  const clean = sanitizeFileName(fileName).toLowerCase();
  const parts = clean.split('.');
  if (parts.length <= 1) return false;

  // فحص كل أجزاء الامتداد
  for (let i = 1; i < parts.length; i++) {
    const ext = parts[i].trim();
    if (DANGEROUS_EXTENSIONS.has(ext)) {
      return true;
    }
  }
  return false;
}

/**
 * الدالة المركزية لفحص وتدقيق أي ملف يتم رفعه في منصة فوتيك
 */
export function validateUploadedFile(
  file: File | null | undefined,
  options?: FileValidationOptions
): FileValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: 'لم يتم اختيار أي ملف للرفع.',
      sanitizedName: '',
      extension: '',
    };
  }

  const sanitizedName = sanitizeFileName(file.name);
  const ext = extractFileExtension(sanitizedName);
  const context: FileUploadContext = options?.context || 'general';
  const maxSize = options?.maxSizeInBytes || MAX_FILE_SIZES[context] || (25 * 1024 * 1024);

  // 1. فحص صارم: حظر ملفات HTML والامتدادات الخطرة
  if (
    ext === 'html' ||
    ext === 'htm' ||
    ext === 'xhtml' ||
    sanitizedName.toLowerCase().includes('.html') ||
    sanitizedName.toLowerCase().includes('.htm') ||
    hasDangerousExtensionInName(sanitizedName)
  ) {
    return {
      isValid: false,
      error: 'عذراً، محظور تماماً رفع ملفات HTML أو ملفات صفحات الويب (.html, .htm) لدواعي الأمان والحماية البرمجية.',
      sanitizedName,
      extension: ext,
    };
  }

  // 2. فحص نوع MIME المحظور
  if (file.type && DANGEROUS_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      isValid: false,
      error: 'عذراً، نوع الملف المرفوع محظور لدواعي الأمان ومكافحة الهجمات البرمجية.',
      sanitizedName,
      extension: ext,
    };
  }

  // 3. فحص الامتدادات الخطرة العامة
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      error: `عذراً، الامتداد (.${ext}) غير مسموح به لدواعي الأمان ومكافحة البرمجيات الخبيثة.`,
      sanitizedName,
      extension: ext,
    };
  }

  // 4. مطابقة الامتداد مع القائمة البيضاء (Whitelist)
  const allowed = options?.allowedExtensions || ALLOWED_EXTENSIONS_BY_CONTEXT[context] || ALLOWED_EXTENSIONS_BY_CONTEXT.general;
  if (!allowed.includes(ext)) {
    const readableAllowed = allowed.slice(0, 8).map(e => `.${e}`).join('، ');
    return {
      isValid: false,
      error: `عذراً، الصيغة (.${ext}) غير مدعومة في هذا القسم. الصيغ المسموحة تشمل: ${readableAllowed}...`,
      sanitizedName,
      extension: ext,
    };
  }

  // 5. فحص الحد الأقصى لحجم الملف
  if (file.size > maxSize) {
    const maxMb = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `حجم الملف (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت) يتجاوز الحد الأقصى المسموح به (${maxMb} ميجابايت).`,
      sanitizedName,
      extension: ext,
    };
  }

  // 6. ملف سليم 100%
  return {
    isValid: true,
    sanitizedName,
    extension: ext,
  };
}

/**
 * توليد سلسلة خاصية `accept` لعناصر input بناءً على السياق
 */
export function getAcceptStringForContext(context: FileUploadContext): string {
  const exts = ALLOWED_EXTENSIONS_BY_CONTEXT[context] || ALLOWED_EXTENSIONS_BY_CONTEXT.general;
  return exts.map(e => `.${e}`).join(',');
}
