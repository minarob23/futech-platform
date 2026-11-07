import { User, UserRole } from '../types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * منصة فوتيك - معايير وهوية المالك الوحيد للمنصة (Mina Robir Magdy Fawzy)
 * ─────────────────────────────────────────────────────────────────────────────
 * المالك الوحيد المعتمد للمنصة بكافة الصلاحيات التنفيذية وحوكمة النظام:
 * الاسم: مينا روبير مجدى فوزى
 * العناوين الرسمية المعتمدة:
 * 1. menarobir246rm@gmail.com
 * 2. minarobir246rm@gmail.com
 * 3. minarobir@gmail.com
 */

export const OWNER_EMAILS = [
  'menarobir246rm@gmail.com',
  'minarobir246rm@gmail.com',
  'minarobir@gmail.com',
] as const;

export const OWNER_FULL_NAME = 'مينا روبير مجدى فوزى';
export const OWNER_USER_ID = 'usr-owner-mina';
export const OWNER_DEFAULT_EMAIL = 'menarobir246rm@gmail.com';
export const OWNER_GOOGLE_AVATAR_URL = 'https://lh3.googleusercontent.com/a/ACg8ocL551jnG3_Ko99OLnO-FISv31XIL2U2VITiBzTcd5Z93UB_y2o=s384-c';
export const OWNER_LOCAL_AVATAR_PATH = '/images/owner-google-avatar.png';

const OWNER_AVATAR_STORAGE_KEY = 'futech_owner_synced_avatar';

/**
 * فحص ما إذا كان البريد الإلكتروني ينتمي لمالك المنصة
 */
export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return (
    clean === 'menarobir246rm@gmail.com' ||
    clean === 'minarobir246rm@gmail.com' ||
    clean === 'minarobir@gmail.com' ||
    clean.startsWith('menarobir246rm') ||
    clean.startsWith('minarobir246rm') ||
    clean === 'minarobir' ||
    clean === 'menarobir' ||
    clean.includes('menarobir246rm') ||
    clean.includes('minarobir246rm')
  );
}

/**
 * فحص ما إذا كان المستخدم أو الملف الشخصي يمثل مالك المنصة
 */
export function isOwnerIdentity(userOrProfile?: {
  id?: string;
  email?: string;
  name?: string;
  full_name?: string;
  role?: string;
} | null): boolean {
  if (!userOrProfile) return false;
  if (userOrProfile.role === 'owner') return true;
  if (isOwnerEmail(userOrProfile.email)) return true;
  if (userOrProfile.id === OWNER_USER_ID || userOrProfile.id === 'e75a3a4f-b00b-458d-98a5-16d53922e54b') return true;

  const candidateName = (userOrProfile.name || userOrProfile.full_name || '').trim();
  if (
    candidateName.includes('مينا روبير') ||
    (candidateName.includes('مينا') && candidateName.includes('فوزى')) ||
    (candidateName.includes('مينا') && candidateName.includes('مجدى'))
  ) {
    return true;
  }

  return false;
}

/**
 * جلب الصورة المشتركة لمالك المنصة المحفوظة سحابياً ومحلياً
 * تضمن ظهور نفس الصورة الشخصية حتى وإن سجل المالك الدخول من بريد مختلف
 */
export function getOwnerSyncedAvatar(): string {
  if (typeof window === 'undefined') return OWNER_LOCAL_AVATAR_PATH;
  try {
    const saved = localStorage.getItem(OWNER_AVATAR_STORAGE_KEY);
    if (saved && saved.trim() !== '') return saved;

    // استخراج الصورة من سجل الحسابات المعتمدة لأي من إيميلات المالك إن وجدت
    const regStr = localStorage.getItem('futech_registered_accounts');
    if (regStr) {
      const accounts = JSON.parse(regStr);
      for (const acc of accounts) {
        if (isOwnerEmail(acc.email) && acc.profile?.avatar_url) {
          localStorage.setItem(OWNER_AVATAR_STORAGE_KEY, acc.profile.avatar_url);
          return acc.profile.avatar_url;
        }
      }
    }
  } catch {}
  return OWNER_GOOGLE_AVATAR_URL;
}

/**
 * حفظ وتوحيد صورة حساب مالك المنصة عبر كافة إيميلاته
 */
export function setOwnerSyncedAvatar(avatar?: string | null): void {
  if (typeof window === 'undefined') return;
  if (!avatar || avatar.trim() === '') return;
  try {
    localStorage.setItem(OWNER_AVATAR_STORAGE_KEY, avatar);

    // مزامنة الصورة في سجل الحسابات المحلية لكافة إيميلات المالك الثلاثة
    const regStr = localStorage.getItem('futech_registered_accounts');
    if (regStr) {
      const accounts = JSON.parse(regStr);
      let changed = false;
      const updated = accounts.map((acc: any) => {
        if (isOwnerEmail(acc.email)) {
          changed = true;
          return {
            ...acc,
            profile: {
              ...acc.profile,
              avatar_url: avatar,
              full_name: OWNER_FULL_NAME,
              role: 'owner',
            },
          };
        }
        return acc;
      });
      if (changed) {
        localStorage.setItem('futech_registered_accounts', JSON.stringify(updated));
      }
    }
  } catch {}
}

/**
 * إنشاء أو مزامنة كائن مستخدم المالك المعتمد بكافة الصلاحيات التنفيذية
 */
export function buildOwnerUser(activeEmail?: string, currentAvatar?: string): User {
  const chosenEmail = (activeEmail && isOwnerEmail(activeEmail)) ? activeEmail.trim().toLowerCase() : OWNER_DEFAULT_EMAIL;
  const syncedAvatar = currentAvatar || getOwnerSyncedAvatar() || OWNER_GOOGLE_AVATAR_URL;
  if (syncedAvatar) {
    setOwnerSyncedAvatar(syncedAvatar);
  }

  return {
    id: OWNER_USER_ID,
    name: OWNER_FULL_NAME,
    email: chosenEmail,
    role: 'owner',
    avatar: syncedAvatar,
    country: 'جمهورية مصر العربية',
    currency: 'ج.م',
    currencyCode: 'EGP',
    company: 'المالك والمطور الأوحد لمنصة فوتيك',
    title: 'المالك التنفيذي ومطور المنصة الأوحد',
    bio: 'المطور والمالك الأوحد لمنصة فوتيك، مهندس برمجيات وتطوير شامل (Full-Stack Engineer) ومتحكم بصلاحيات الإدارة وحوكمة المنصة.',
    skills: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'OWASP Security', 'Cloud Architecture'],
    fqs: 100,
    hourlyRate: 200,
    verified: true,
    createdAt: '2024-01-01',
  };
}
