export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'youtube'
  | 'telegram'
  | 'discord'
  | 'facebook'
  | 'website';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  isPrimary?: boolean;
  isActive: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'futech_platform_social_links_v2';

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'soc-github',
    platform: 'github',
    label: 'مستودع GitHub الرسمي لمنصة فوتيك',
    url: 'https://github.com/minarob23/futech-platform',
    isPrimary: true,
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'soc-linkedin',
    platform: 'linkedin',
    label: 'LinkedIn • شبكة الكفاءات المهنية',
    url: 'https://linkedin.com/company/futech-platform',
    isPrimary: false,
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'soc-twitter',
    platform: 'twitter',
    label: 'منصة X (تويتر سابقاً)',
    url: 'https://x.com/futech_platform',
    isPrimary: false,
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'soc-discord',
    platform: 'discord',
    label: 'مجتمع Discord الهندسي للمطورين',
    url: 'https://discord.gg/futech-engineers',
    isPrimary: false,
    isActive: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'soc-telegram',
    platform: 'telegram',
    label: 'قناة Telegram الرسمية لأحدث التحديثات',
    url: 'https://t.me/futech_platform',
    isPrimary: false,
    isActive: true,
    createdAt: '2026-11-02',
  },
];

export function getPlatformSocialLinks(): SocialLinkItem[] {
  if (typeof window === 'undefined') return DEFAULT_SOCIAL_LINKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SOCIAL_LINKS));
      return DEFAULT_SOCIAL_LINKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Error loading social links:', err);
  }
  return DEFAULT_SOCIAL_LINKS;
}

export function savePlatformSocialLinks(links: SocialLinkItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    window.dispatchEvent(new CustomEvent('futech_social_links_updated', { detail: links }));
  } catch (err) {
    console.error('Error saving social links:', err);
  }
}

export function addSocialLink(
  item: Omit<SocialLinkItem, 'id' | 'createdAt'>
): SocialLinkItem[] {
  const current = getPlatformSocialLinks();
  const newLink: SocialLinkItem = {
    ...item,
    id: 'soc-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [...current, newLink];
  savePlatformSocialLinks(updated);
  return updated;
}

export function updateSocialLink(
  id: string,
  updates: Partial<Omit<SocialLinkItem, 'id' | 'createdAt'>>
): SocialLinkItem[] {
  const current = getPlatformSocialLinks();
  const updated = current.map((link) => (link.id === id ? { ...link, ...updates } : link));
  savePlatformSocialLinks(updated);
  return updated;
}

export function deleteSocialLink(id: string): SocialLinkItem[] {
  const current = getPlatformSocialLinks();
  const updated = current.filter((link) => link.id !== id);
  savePlatformSocialLinks(updated);
  return updated;
}

export const PLATFORM_INFO: Record<
  SocialPlatform,
  { name: string; iconKey: string; defaultPlaceholder: string; color: string; bgColor: string }
> = {
  github: {
    name: 'GitHub (مستودعات وأكواد)',
    iconKey: 'github',
    defaultPlaceholder: 'https://github.com/username-or-org/repo',
    color: '#24292e',
    bgColor: 'bg-slate-900 text-white',
  },
  linkedin: {
    name: 'LinkedIn (الشبكة المهنية)',
    iconKey: 'linkedin',
    defaultPlaceholder: 'https://linkedin.com/in/username',
    color: '#0077b5',
    bgColor: 'bg-[#0077b5] text-white',
  },
  twitter: {
    name: 'X / Twitter (التغريدات والبودكاست)',
    iconKey: 'twitter',
    defaultPlaceholder: 'https://x.com/username',
    color: '#000000',
    bgColor: 'bg-black text-white',
  },
  discord: {
    name: 'Discord (المجتمع الصوتي والتقني)',
    iconKey: 'discord',
    defaultPlaceholder: 'https://discord.gg/server-invite',
    color: '#5865F2',
    bgColor: 'bg-[#5865F2] text-white',
  },
  telegram: {
    name: 'Telegram (قناة البث والتنبيهات)',
    iconKey: 'telegram',
    defaultPlaceholder: 'https://t.me/channel_name',
    color: '#229ED9',
    bgColor: 'bg-[#229ED9] text-white',
  },
  youtube: {
    name: 'YouTube (الفيديوهات والشروحات)',
    iconKey: 'youtube',
    defaultPlaceholder: 'https://youtube.com/@channel',
    color: '#FF0000',
    bgColor: 'bg-[#FF0000] text-white',
  },
  facebook: {
    name: 'Facebook (الصفحة الرسمية)',
    iconKey: 'facebook',
    defaultPlaceholder: 'https://facebook.com/page_name',
    color: '#1877F2',
    bgColor: 'bg-[#1877F2] text-white',
  },
  website: {
    name: 'موقع إلكتروني أو مدونة تقنية',
    iconKey: 'website',
    defaultPlaceholder: 'https://example.com',
    color: '#0d9488',
    bgColor: 'bg-teal-600 text-white',
  },
};
