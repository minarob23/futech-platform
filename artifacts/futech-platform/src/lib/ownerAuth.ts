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
    hourlyRate: 1750,
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
    hourlyRate: 1750,
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
        id: 'port-dentalai',
        title: 'منصة DentalAI للذكاء الاصطناعي الطبي والعيادات (DentalAI — Algostep)',
        description: 'منصة طبية متقدمة لإدارة عيادات ومراكز الأسنان والفرز الطبي الذكي المدعوم بالذكاء الاصطناعي مع جدولة المواعيد المتزامنة عبر واتساب وحماية Webhooks.',
        tech: ['Next.js 16', 'TypeScript', 'PostgreSQL', 'Multimodal LLM', 'RAG', 'Docker'],
        previewType: 'ai',
        previewImage: '/images/ai-sentinel-preview.svg',
        metrics: 'Multimodal LLM • WhatsApp Synced • HMAC-SHA256',
        liveUrl: 'https://algoste.care/',
        features: [
          'منصة شاملة لإدارة العيادات والفرز الطبي التلقائي المدعوم بنماذج الذكاء الاصطناعي متعددة الوسائط وتقنية RAG',
          'جدولة ومزامنة لحظية للمواعيد مباشرة عبر WhatsApp مع إشعارات تنبيهية تلقائية',
          'حماية خطافات الويب (Webhooks) ضد هجمات إعادة الإرسال بتوقيع HMAC-SHA256 مع تنظيم معدل الطلبات عبر Token-Bucket Rate Limiting',
        ],
      },
      {
        id: 'port-ecs-customizer',
        title: 'مخصص الملابس الرياضية ثلاثي الأبعاد (ECS Customizer — Client)',
        description: 'منصة تجارة إلكترونية تفاعلية لتصميم وتخصيص الملابس والأزياء الرياضية مع محاكاة ثلاثية الأبعاد فورية بالمتصفح بجودة تصنيع 300-DPI.',
        tech: ['React (Vite)', 'Express', 'Three.js', 'PostgreSQL', 'Drizzle ORM'],
        previewType: 'ecommerce',
        previewImage: '/images/escrow.jpg',
        metrics: 'Real-time 3D Engine • 300-DPI Print Assets • Tiered Pricing',
        liveUrl: 'https://ecsdesign.ca/',
        features: [
          'منصة تجارة إلكترونية متخصصة في تخصيص الملابس الرياضية مع معاينة ثلاثية الأبعاد تفاعلية لحظية عبر Three.js',
          'محرك تسعير متدرج بـ 5 مستويات خصم ديناميكية حسب الكمية، ودعم 3 تقنيات طباعة مختلفة',
          'توليد وتصدير ملفات تصنيع وتصميم عالية الدقة والوضوح بدقة 300-DPI جاهزة مباشرة لخطوط الطباعة والإنتاج',
        ],
      },
      {
        id: 'port-egypttex',
        title: 'بوابة EgyptTex لتجارة المنسوجات وسلاسل الإمداد B2B (EgyptTex Gateway — Nile Tex)',
        description: 'سوق رقمي B2B للربط المباشر بين مصانع الغزل والنسيج والموردين عبر 8 قطاعات تصنيعية مع تسعير متدرج بالجنيه المصري وأمان RLS.',
        tech: ['Next.js 15', 'React 19', 'Supabase', 'Neon PostgreSQL', 'Tailwind CSS'],
        previewType: 'saas',
        previewImage: '/images/collab.jpg',
        metrics: 'B2B Marketplace • RBAC & RLS • Tiered EGP Pricing',
        liveUrl: 'https://egyptexgateway.com/',
        features: [
          'سوق رقمي B2B لتجارة وتوريد الأقمشة والمنسوجات يغطي 8 تصنيفات وقطاعات صناعية كبرى',
          'صلاحيات مستخدمين مشددة (RBAC) وأمان مستوى الصفوف (Row-Level Security) على قواعد بيانات PostgreSQL',
          'تسعير توريدات متدرج بالجنيه المصري (EGP) حسب كميات الطلب مع نظام متكامل لطلب وفحص عينات الأقمشة',
        ],
      },
      {
        id: 'port-father-yostos',
        title: 'نظام كاشير ومخازن مكتبة أبونا يسطس (Father Yostos Library POS — Client)',
        description: 'تطبيق ديسكتوب أوفلاين كامل (Offline-First) لنقاط البيع وإدارة مئات الأصناف والمخازن بدون إنترنت مع حزمة تثبيت رسمية لنظام Windows.',
        tech: ['Electron.js', 'React', 'TypeScript', 'Express', 'better-sqlite3'],
        previewType: 'dashboard',
        previewImage: '/images/hero-banner.jpg',
        metrics: 'Offline-First Desktop • Barcode Tracking • SQLite DB',
        features: [
          'تطبيق ديسكتوب كاشير ومخازن يعمل أوفلاين بالكامل بدون الحاجة لإنترنت مع قاعدة بيانات محلية مدمجة سريعة',
          'تتبع حركة المبيعات عبر قارئ الباركود اللحظي، وإدارة حسابات الموردين، وتوليد الفواتير التلقائية',
          'حزمة تثبيت رسمية معتمدة لنظام ويندوز (v2.0 Windows Installer) وتشغيل مستقر بنسبة 100%',
        ],
      },
      {
        id: 'port-puno-pos',
        title: 'نظام Puno POS - كاشير ديسكتوب أوفلاين (Puno POS — Client)',
        description: 'سيستم كاشير مطاعم ديسكتوب أوفلاين متغلف Portable فائق الخفة شغال عند عميل مع طباعة فواتير حرارية بدون إنترنت وبدون أي تعليق.',
        tech: ['Electron.js', 'React', 'Vite', 'Tailwind CSS'],
        previewType: 'dashboard',
        previewImage: '/images/ai-sentinel-preview.svg',
        metrics: 'Offline-First • Secure IPC Bridge • Thermal Print',
        features: [
          'نظام كاشير مطاعم ديسكتوب يعمل بدون إنترنت (Offline-First POS) بصيغة Portable خفيفة وسريعة',
          'اتصال بيني آمن ومحمي بين واجهات التطبيق والخادم الداخلي (Secure IPC عبر contextBridge)',
          'طباعة فواتير وإيصالات حرارية لحظية غير متزامنة (Non-blocking thermal receipt printing) لمنع أي تعليق في الذروة',
        ],
      },
      {
        id: 'port-gamevault',
        title: 'منصة GameVault لتحليلات التجارة والتنبؤ بالمبيعات (GameVault — Graduation Project)',
        description: 'مشروع تخرج معتمد: منصة تحليلات تجارة إلكترونية متقدمة للتنبؤ بحجم المبيعات باستخدام خوارزميات التعلم الآلي ومساعد ذكي بمعالجة اللغات الطبيعية.',
        tech: ['Python', 'FastAPI', 'React', 'XGBoost', 'LightGBM', 'PostgreSQL'],
        previewType: 'ai',
        previewImage: '/images/ai-sentinel-preview.svg',
        metrics: 'XGBoost Sales Forecast • NLP Intent AI • FastAPI',
        githubUrl: 'https://github.com/minarob23/gamevault',
        features: [
          'محرك تحليلات متقدم للتنبؤ بالمبيعات وسلوك المشترين باستخدام نماذج تعلم الآلة XGBoost و LightGBM',
          'مساعد ذكي للرد وفهم وتصنيف نوايا المستخدمين عبر تقنيات معالجة اللغات الطبيعية (NLP Intent Classification)',
          'واجهات برمجية عالية الأداء مبنية بإطار FastAPI وقواعد بيانات PostgreSQL مع لوحات تحليلية تفاعلية',
        ],
      },
      {
        id: 'port-futech-platform',
        title: 'منصة FuTech Platform الهندسية (FuTech Platform — Founder)',
        description: 'المنصة الهندسية المتكاملة لحوكمة المشاريع المستقلة وتوثيق كفاءة المهندسين العرب مع أنظمة الضمان المالي المشفرة (Escrow Vault).',
        tech: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Supabase'],
        previewType: 'saas',
        previewImage: '/images/futech-logo.jpg',
        metrics: '99.98% Uptime • Escrow Vault Active • FQS Standard',
        liveUrl: 'https://futech-platform.vercel.app',
        githubUrl: 'https://github.com/minarob23/futech-platform',
        features: [
          'نظام الضمان المالي المشفر وحجز المستحقات بالكامل لحماية حقوق الطرفين (Escrow Vault)',
          'مؤشر كفاءة هندسي FQS دقيق ومبني على اختبارات Git والفحوصات الأمنية الصارمة OWASP',
          'غرف محادثة مشفرة، نظام تذاكر دعم فني ذكي، ولوحات تحكم متقدمة لإدارة الحوكمة',
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
      summary: 'مهندس برمجيات وتطوير شامل (Full Stack Software Engineer) بخبرة تزيد عن 3 سنوات، قاد وأنجز بنجاح 5 منصات إنتاجية حية وموثقة في مجالات الرعاية الصحية (HealthTech SaaS)، التجارة الإلكترونية B2B، تطبيقات نقاط البيع والكاشير الميداني (POS)، مع معمارية سحابية موزعة وحماية مشددة للبيانات وهندسة الذكاء الاصطناعي.',
      yearsOfExperience: 3,
      education: [
        { degree: 'بكالوريوس هندسة الحاسبات ونظم البرمجيات', institution: 'جامعة حلوان / التعليم العالي', year: '2025' },
      ],
      experience: [
        {
          role: 'Full Stack Software Engineer (تعاقد مباشر وإنجاز إنتاجي)',
          company: 'Algostep, Nile Tex, ECS Canada, Puno POS',
          period: 'يوليو 2025 - الحاضر',
          achievements: [
            'تسليم 5 منصات وتطبيقات إنتاجية كاملة (DentalAI، ECS Customizer ثلاثي الأبعاد، EgyptTex Gateway للنسيج، كاشير مكتبة أبونا يسطس، وكاشير Puno POS)',
            'بناء واجهات أمامية متجاوبة بـ React و Next.js (App Router) و Three.js و TypeScript وتطوير خدمات خلفية بـ Node.js و Python (FastAPI)',
            'تصميم معماريات قواعد بيانات PostgreSQL مع عزل مستأجرين مشدد (Multi-Tenant RLS) وحماية Webhooks بتشفير HMAC-SHA256 مع معدلات استهلاك دقيقة',
          ],
        },
        {
          role: 'Full Stack Software Engineer & Platform Founder',
          company: 'FuTech Platform',
          period: '2024 - الحاضر',
          achievements: [
            'تأسيس وبناء المنصة الهندسية المتكاملة لحوكمة المشاريع المستقلة وتوثيق كفاءة المهندسين العرب',
            'تطوير نظام الضمان المالي المشفر وحجز المستحقات بالكامل (Escrow Vault) لحفظ حقوق الطرفين',
            'تصميم خوارزمية FQS المعتمدة المبنية على فحص واختبارات مستودعات Git وتطبيق معايير أمان OWASP',
          ],
        },
        {
          role: 'Software Systems Engineering Intern',
          company: 'ALX Africa',
          period: 'نوفمبر 2023 - ديسمبر 2024',
          achievements: [
            'تطوير أكثر من 15 أداة برمجية منخفضة المستوى لأنظمة UNIX و Linux باستخدام C و C++ و Python',
            'فحص تسريبات الذاكرة وضبط الأداء المعماري واختبار الشيفرة باستخدام Valgrind',
            'التعامل المباشر مع استدعاءات النواة (System Calls) وبرمجة الشبكات الموزعة وإدارة العمليات',
          ],
        },
        {
          role: 'Mathematics Assistant & Academic Tutor',
          company: 'التعليم الجامعي والمساعدات الأكاديمية',
          period: 'سبتمبر 2021 - يونيو 2025',
          achievements: [
            'تدريس وتدريب أكثر من 120 طالباً جامعياً في الرياضيات المتقدمة والهندسة التحليلية والجبر الخطي',
            'برمجة وتطوير سكربتات وحلول برمجية مؤتمتة وفرت أكثر من 180 ساعة عمل يدوي سنوياً',
          ],
        },
      ],
      certifications: [
        'OWASP Top 10 Web Security Engineering',
        'Advanced React, Next.js & Node.js Architecture',
        'PostgreSQL Multi-Tenant Security & RLS',
        'Multimodal LLM & RAG Engineering',
      ],
      languages: [
        { name: 'العربية', level: 'اللغة الأم (Native)' },
        { name: 'الإنجليزية', level: 'طلاقة مهنية وتقنية كاملة (Fluent)' },
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
