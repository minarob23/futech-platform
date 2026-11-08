import { User, UserRole, Developer } from '../types';

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
 * فحص ما إذا كان البريد الإلكتروني ينتمي لمالك المنصة (Mina Robir Magdy Fawzy)
 * يدعم كافة العناوين الرسمية المعتمدة لمالك المنصة:
 * 1. menarobir246rm@gmail.com
 * 2. minarobir246rm@gmail.com
 * 3. minarobir@gmail.com
 * بالإضافة إلى أي متغيرات بنقاط أو بادئات تابعة للمالك.
 */
export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  const normalized = clean.replace(/[\._\-]/g, '');
  return (
    clean === 'menarobir246rm@gmail.com' ||
    clean === 'minarobir246rm@gmail.com' ||
    clean === 'minarobir@gmail.com' ||
    clean === 'mina.robir@gmail.com' ||
    clean === 'mena.robir@gmail.com' ||
    clean === 'minarob23@gmail.com' ||
    clean.startsWith('menarobir246rm') ||
    clean.startsWith('minarobir246rm') ||
    clean.startsWith('minarobir@') ||
    clean === 'minarobir' ||
    clean === 'menarobir' ||
    clean.includes('menarobir246rm') ||
    clean.includes('minarobir246rm') ||
    clean.includes('minarobir') ||
    clean.includes('menarobir') ||
    clean.includes('minarob23') ||
    normalized.includes('menarobir') ||
    normalized.includes('minarobir') ||
    normalized.includes('minarob23')
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


/**
 * إنشاء وتمثيل المطور والمهندس الأوحد ومؤسس المنصة (مينا روبير مجدى فوزى)
 * ليكون المهندس الأول المتصدر في قائمة أبرز المطورين المتاحين للعمل
 */
export function buildOwnerDeveloper(): Developer {
  const syncedAvatar = getOwnerSyncedAvatar() || OWNER_LOCAL_AVATAR_PATH || OWNER_GOOGLE_AVATAR_URL;

  return {
    id: OWNER_USER_ID,
    name: 'المهندس مينا روبير مجدى فوزى',
    avatar: syncedAvatar,
    specialty: 'مهندس برمجيات وتطوير شامل (Full-Stack Engineer)',
    category: 'fullstack',
    location: 'القاهرة، جمهورية مصر العربية',
    country: 'مصر',
    hourlyRate: 200,
    fqs: 99,
    fqsBreakdown: {
      completionRate: 100,
      onTimeBudget: 100,
      clientRating: 100,
      repeatHireRate: 100,
      tests: 100,
      codeQuality: 100,
      deliveryRate: 100,
      security: 100,
    },
    rating: 5.0,
    reviewsCount: 18,
    completedProjects: 15,
    experienceYears: 5,
    availability: 'متاح الآن',
    level: 'مؤسس ومطور المنصة الأوحد 👑',
    skills: [
      'React 19',
      'Next.js (App Router)',
      'TypeScript',
      'Node.js',
      'Express.js',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Supabase',
      'Docker',
      'OWASP Security',
      'Tailwind CSS',
      'Electron.js',
      'AWS (S3, EC2)',
    ],
    bio: 'مهندس برمجيات وتطوير شامل ومؤسس منصة فوتيك. خبرة متقدمة في تصميم وتطوير الأنظمة السحابية الموزعة، تطبيقات الويب فائقة الأداء، وهندسة الذكاء الاصطناعي وحماية البيانات.',
    githubUrl: 'https://github.com/minarob23',
    work: 'تطوير منصات برمجية سحابية متقدمة، أنظمة POS والمبيعات، وبنى تحتية موزعة عالية الاعتمادية',
    portfolio: [
      {
        id: 'port-futech-platform',
        title: 'منصة FuTech Platform الهندسية',
        description: 'المنصة الهندسية المتكاملة لحوكمة المشاريع المستقلة وتوثيق كفاءة المهندسين العرب مع أنظمة الضمان المالي المشفرة (Escrow Vault).',
        tech: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Supabase'],
        previewImage: '/images/futech-logo.jpg',
        metrics: '99.98% Uptime • Escrow Vault Active',
        liveUrl: 'https://futech-platform.vercel.app',
        githubUrl: 'https://github.com/minarob23/futech-platform',
        features: [
          'نظام الضمان المالي المشفر وحجز المستحقات بالكامل',
          'مؤشر كفاءة هندسي FQS دقيق ومبني على اختبارات Git',
          'غرف شات مشفرة ونظام تذاكر دعم فني ذكي',
        ],
      },
      {
        id: 'port-puno-pos',
        title: 'نظام Puno POS - كاشير ديسكتوب أوفلاين',
        description: 'سيستم كاشير مطاعم ديسكتوب أوفلاين كامل بـ Electron و React متغلف Portable شغال عند عميل مع طباعة فواتير حرارية بدون إنترنت.',
        tech: ['Electron.js', 'React', 'TypeScript', 'SQLite', 'Tailwind CSS'],
        previewImage: '/images/ai-sentinel-preview.svg',
        metrics: 'Offline-First • Realtime Thermal Print',
        features: [
          'تشغيل كامل بدون إنترنت مع قاعدة بيانات محلية مدمجة',
          'طباعة إيصالات حرارية لحظية ودعم ماسح الباركود',
          'تقارير مبيعات وجرد مخزون لحظي مع حماية الفواتير',
        ],
      },
      {
        id: 'port-algostep',
        title: 'منصة Algostep للرعاية الصحية (Health Tech SaaS)',
        description: 'منصة سحابية متقدمة لإدارة السجلات الطبية وحجز المواعيد والعيادات بنظام صلاحيات مشدد وتكامل سحابي متطور.',
        tech: ['Next.js', 'FastAPI', 'Python', 'PostgreSQL', 'AWS'],
        previewImage: '/images/pos-desktop-preview.svg',
        metrics: 'HIPAA Standard Security • Distributed Multi-Tenant',
        features: [
          'حماية السجلات الطبية وتشفير بيانات المرضى',
          'نظام حجز مواعيد لحظي وإشعارات تلقائية',
          'بوابة تحليلات وتقارير مالية للعيادات والمراكز الطبية',
        ],
      },
      {
        id: 'port-niletex',
        title: 'منصة Nile Tex للتجارة B2B وسلاسل الإمداد للنسيج',
        description: 'سوق B2B متكامل لتجارة وتوريد منتجات الغزل والنسيج وإدارة المزادات والعقود التجارية بين المصانع والموردين.',
        tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker'],
        previewImage: '/images/b2b-ecommerce-preview.svg',
        metrics: '+50 مصنع مسجل • مزادات توريد B2B',
        features: [
          'مزادات فورية وعروض أسعار توريد مباشرة بين المصانع',
          'تتبع شحنات الأقمشة وسلاسل التوريد لحظة بلحظة',
          'إدارة العقود التجارية وإصدار فواتير ضريبية معتمدة',
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-owner-1',
        clientName: 'م. خالد المنصوري',
        clientCompany: 'مجموعة التقنية الخليجية',
        rating: 5,
        date: '2026-10-18',
        comment: 'المهندس مينا من أكفأ وأشطر المهندسين المعماريين للأنظمة. كود منظم جداً، التزام تام بالمعايير، وسرعة إنجاز تفوق التوقعات.',
        projectTitle: 'تطوير البنية التحتية لمنصة سحابية',
      },
      {
        id: 'rev-owner-2',
        clientName: 'د. طارق عبد الرحمن',
        clientCompany: 'حلول الرعاية الذكية',
        rating: 5,
        date: '2026-09-05',
        comment: 'دقة هندسية عالية واحترافية لا مثيل لها في فهم المتطلبات وتأمين البيانات. تسليم في الوقت المحدد وبأعلى جودة.',
        projectTitle: 'نظام إدارة العيادات والمواعيد السحابي',
      },
      {
        id: 'rev-owner-3',
        clientName: 'أ. مروان العتيبي',
        clientCompany: 'سلسلة مطاعم واستراحات بونو',
        rating: 5,
        date: '2026-08-12',
        comment: 'سيستم كاشير ممتاز ومستقر جداً وما وقفش ثانية في أوقات الذروة مع طباعة الفواتير بدون إنترنت. شكراً جزيلاً للبشمهندس مينا.',
        projectTitle: 'نظام كاشير Puno POS الميداني',
      },
    ],
    cv: {
      summary: 'Full Stack Software Engineer with 4+ years of experience in Health Tech SaaS, B2B e-commerce, POS clients, distributed backend architecture, and AI-assisted engineering workflows.',
      yearsOfExperience: 4,
      education: [
        { degree: 'بكالوريوس هندسة الحاسبات ونظم البرمجيات', institution: 'جامعة القاهرة', year: '2023' },
      ],
      experience: [
        { role: 'Full Stack Software Engineer & Platform Founder', company: 'FuTech Platform', period: '2024 - الحاضر', achievements: ['تأسيس وبناء المنصة الهندسية المتكاملة', 'تطوير نظام الضمان المالي المشفر وحوكمة المشاريع', 'تصميم معماريات سحابية موثقة ومعتمدة'] },
        { role: 'Software Systems Engineering Intern', company: 'ALX Africa', period: '2023 - 2024', achievements: ['تطوير أدوات منخفضة المستوى بلغة C و C++', 'تحسين أداء خوادم لينكس والأنظمة الموزعة', 'فحص واختبار تسريبات الذاكرة بـ Valgrind'] },
      ],
      certifications: [
        'OWASP Top 10 Web Security Engineering',
        'Advanced React & Node.js Architecture',
        'PostgreSQL Multi-Tenant Security & RLS',
      ],
      languages: [
        { name: 'العربية', level: 'اللغة الأم' },
        { name: 'الإنجليزية', level: 'طلاقة تامة واحتراف تقني' },
      ],
      file: {
        name: 'Mina_Robir_FullStack_Engineer_CV.pdf',
        size: '2.4 MB',
        uploadedAt: 'موثق ومعتمد رسمياً',
      },
    },
    verified: true,
  };
}
