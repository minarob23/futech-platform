export type FqsBreakdown = {
  completionRate: number; // معدل إكمال المشاريع (Job Completion Rate)
  onTimeBudget: number;   // الالتزام بالوقت والميزانية (On Time & On Budget)
  clientRating: number;   // تقييم العملاء (Average Star Rating % equivalent)
  repeatHireRate: number; // معدل التوظيف المتكرر (Repeat Hire Rate)
  tests?: number;
  codeQuality?: number;
  deliveryRate?: number;
  security?: number;
};

export type Developer = {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'ai' | 'devops';
  location: string;
  country: string;
  hourlyRate: number;
  fqs: number;
  fqsBreakdown: FqsBreakdown;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  experienceYears: number;
  availability: 'متاح الآن' | 'متاح جزئياً' | 'متاح قريباً';
  level: 'خبير (Senior)' | 'متوسط (Mid-level)' | 'واعد (Junior)';
  skills: string[];
  bio: string;
  work: string;
  portfolio: {
    title: string;
    description: string;
    tech: string[];
    metrics?: string;
  }[];
  verified: boolean;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  budget: number;
  deadline: string;
  milestones: string[];
  owner: string;
  status: 'متاح' | 'قيد التنفيذ' | 'مكتمل';
  requiredFqs?: number;
  proposalsCount?: number;
  category?: string;
};

export type Application = {
  id: string;
  projectId: string;
  developerName: string;
  plan: string;
  proposedBudget?: number;
  proposedDuration?: string;
  status: 'قيد المراجعة' | 'مقبول' | 'مرفوض';
  submittedAt: string;
};

export type MessageItem = {
  id: string;
  body: string;
  sender: 'me' | 'other';
  time: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  projectId: string;
  otherUser: string;
  otherUserAvatar?: string;
  online: boolean;
  messages: MessageItem[];
};

export type TicketReply = {
  id: string;
  sender: string;
  senderRole: 'client' | 'developer' | 'support';
  message: string;
  createdAt: string;
  codeSnippet?: string;
};

export type Ticket = {
  id: string;
  subject: string;
  category: 'دعم مستمر بعد التسليم' | 'صيانة دورية' | 'خلل برمجي (Bug)' | 'طلب تعديل أو تحسين' | 'استفسار تقني';
  priority: 'حرج' | 'عالي' | 'متوسط' | 'منخفض';
  status: 'مفتوح' | 'قيد المعالجة' | 'تم الحل' | 'مغلق';
  owner: string;
  projectId?: string;
  projectTitle?: string;
  assignedDeveloper?: string;
  createdAt: string;
  slaResponseHours?: number;
  replies?: (string | TicketReply)[];
  messages?: TicketReply[];
  logsOrCode?: string;
};

export type Doc = {
  id: string;
  title: string;
  category: 'معيار FQS وجودة الشيفرة' | 'الدعم المستمر والضمان' | 'تسليم الكود والمستودعات' | 'دليل أصحاب المشاريع' | 'دليل المطورين' | 'الأمان وأدوات فوتيك';
  summary?: string;
  content: string;
  codeExample?: string;
  tags?: string[];
  readingTime?: string;
  updatedAt: string;
};

export type Delivery = {
  id: string;
  title: string;
  date: string;
  amount: number;
  client: string;
  status: 'تم التسليم' | 'قيد الفحص' | 'مكتمل';
};

export type Store = {
  developers: Developer[];
  projects: Project[];
  applications: Application[];
  conversations: Conversation[];
  tickets: Ticket[];
  docs: Doc[];
  deliveries: Delivery[];
};

export const INITIAL_DEVELOPERS: Developer[] = [
  {
    id: 'dev-layan',
    name: 'ليان العتيبي',
    avatar: '/images/dev-female.jpg',
    specialty: 'تطوير شامل (Full-Stack)',
    category: 'fullstack',
    location: 'الرياض، المملكة العربية السعودية',
    country: 'السعودية',
    hourlyRate: 180,
    fqs: 96,
    fqsBreakdown: {
      completionRate: 99,
      onTimeBudget: 98,
      clientRating: 100,
      repeatHireRate: 92,
      tests: 96,
      codeQuality: 95,
      deliveryRate: 98,
      security: 92
    },
    rating: 4.98,
    reviewsCount: 42,
    completedProjects: 36,
    experienceYears: 6,
    availability: 'متاح الآن',
    level: 'خبير (Senior)',
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'GraphQL'],
    bio: 'مهندسة برمجيات متخصصة في بناء المنتجات والمنصات المتكاملة من الصفر حتى الإطلاق، مع التركيز العالي على تجربة المستخدم والأمان وقابلية التوسع.',
    work: 'لوحة إدارة متكاملة للمتاجر الإلكترونية مع نظام تتبع المخزون اللحظي',
    portfolio: [
      {
        title: 'منصة إدارة المخزون متعددة الفروع',
        description: 'بناء واجهات تفاعلية وسيرفرات Node.js مع إشعارات فورية عبر WebSockets.',
        tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Tailwind'],
        metrics: 'تقليل زمن المزامنة بنسبة 45%'
      },
      {
        title: 'محرك اشتراكات SaaS وإدارة التراخيص',
        description: 'بناء نظام متكامل لإدارة التراخيص وصلاحيات الاستخدام والتحقق السحابي.',
        tech: ['React', 'TypeScript', 'Prisma', 'JWT'],
        metrics: 'خدمة أكثر من 10,000 مستخدم نشط'
      }
    ],
    verified: true
  },
  {
    id: 'dev-marwan',
    name: 'مروان صالح',
    avatar: '/images/dev-male.jpg',
    specialty: 'واجهات أمامية وأداء الويب (Frontend & Web Perf)',
    category: 'frontend',
    location: 'جدة، المملكة العربية السعودية',
    country: 'السعودية',
    hourlyRate: 150,
    fqs: 91,
    fqsBreakdown: {
      completionRate: 94,
      onTimeBudget: 95,
      clientRating: 98,
      repeatHireRate: 86,
      tests: 90,
      codeQuality: 92,
      deliveryRate: 94,
      security: 85
    },
    rating: 4.92,
    reviewsCount: 29,
    completedProjects: 25,
    experienceYears: 5,
    availability: 'متاح الآن',
    level: 'خبير (Senior)',
    skills: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'TypeScript', 'Web Vitals'],
    bio: 'مطور واجهات ومختص في تسريع تجربة الويب. أركز على رفع نقاط Core Web Vitals وتقديم واجهات سلسة متوافقة كلياً مع معايير الوصول واللغة العربية.',
    work: 'إعادة بناء واجهات متجر تجزئة ورفع درجات Lighthouse إلى 98/100',
    portfolio: [
      {
        title: 'تسريع متجر إلكتروني ضخم',
        description: 'تقسيم الحزم، تحسين أصول الصور، وتخزين الذاكرة التخريبية على السيرفر.',
        tech: ['Next.js', 'Lighthouse', 'Cloudflare Workers'],
        metrics: 'تسريع التحميل من 4.2 ثوان إلى 0.8 ثانية'
      }
    ],
    verified: true
  },
  {
    id: 'dev-badr',
    name: 'بدر فهد الحازمي',
    avatar: '/images/dev-male.jpg',
    specialty: 'واجهات خلفية وهندسة الأنظمة (Backend & Cloud)',
    category: 'backend',
    location: 'الدمام، المملكة العربية السعودية',
    country: 'السعودية',
    hourlyRate: 165,
    fqs: 94,
    fqsBreakdown: {
      completionRate: 96,
      onTimeBudget: 97,
      clientRating: 99,
      repeatHireRate: 91,
      tests: 94,
      codeQuality: 90,
      deliveryRate: 96,
      security: 95
    },
    rating: 4.95,
    reviewsCount: 37,
    completedProjects: 31,
    experienceYears: 7,
    availability: 'متاح جزئياً',
    level: 'خبير (Senior)',
    skills: ['Go', 'Node.js', 'Laravel', 'Docker', 'PostgreSQL', 'Redis', 'Kafka'],
    bio: 'مهندس أنظمة خلفية خبير في تصميم قواعد البيانات الموزعة وبناء واجهات برمجة التطبيقات عالية الأداء مع معالجة آلاف الطلبات بالثانية.',
    work: 'محرك معالجة التراخيص السحابية والمزامنة اللحظية الفائقة',
    portfolio: [
      {
        title: 'محرك مزامنة وتراخيص سحابي سريع وموثوق',
        description: 'نظام معالجة وتدقيق برمجي متوافق مع معايير الأمان السحابية العالمية.',
        tech: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
        metrics: 'أداء 99.99% بدون انقطاع'
      }
    ],
    verified: true
  },
  {
    id: 'dev-sara',
    name: 'سارة منصور القحطاني',
    avatar: '/images/dev-female.jpg',
    specialty: 'تطبيقات الجوال والحلول الهجينة (Mobile Apps)',
    category: 'mobile',
    location: 'الرياض، المملكة العربية السعودية',
    country: 'السعودية',
    hourlyRate: 140,
    fqs: 89,
    fqsBreakdown: {
      completionRate: 92,
      onTimeBudget: 93,
      clientRating: 98,
      repeatHireRate: 85,
      tests: 88,
      codeQuality: 89,
      deliveryRate: 91,
      security: 84
    },
    rating: 4.89,
    reviewsCount: 24,
    completedProjects: 20,
    experienceYears: 4,
    availability: 'متاح قريباً',
    level: 'متوسط (Mid-level)',
    skills: ['Flutter', 'React Native', 'Dart', 'Firebase', 'iOS & Android', 'State Management'],
    bio: 'مطورة تطبيقات جوال شغوفة بإنشاء تجارب تطبيقات استثنائية ونظيفة بنمط Native للأندرويد وiOS مع أداء عالي وسلاسة فائقة.',
    work: 'تطبيق حجز عيادات واستشارات طبية متكامل مع إشعارات وتأكيد فوري',
    portfolio: [
      {
        title: 'تطبيق حجز مواعيد العيادات',
        description: 'تطبيق موحد للهواتف الذكية مع تقويم تفاعلي وإدارة مواعيد الحجز المجدولة.',
        tech: ['Flutter', 'Firebase', 'Node.js'],
        metrics: '+50,000 تحميل على متجري التطبيقات'
      }
    ],
    verified: true
  },
  {
    id: 'dev-nawaf',
    name: 'نواف الحربي',
    avatar: '/images/dev-male.jpg',
    specialty: 'مهندس ذكاء اصطناعي وتكاملات النماذج (AI & LLM Solutions)',
    category: 'ai',
    location: 'المدينة المنورة، المملكة العربية السعودية',
    country: 'السعودية',
    hourlyRate: 200,
    fqs: 97,
    fqsBreakdown: {
      completionRate: 98,
      onTimeBudget: 99,
      clientRating: 100,
      repeatHireRate: 95,
      tests: 97,
      codeQuality: 96,
      deliveryRate: 97,
      security: 94
    },
    rating: 5.0,
    reviewsCount: 19,
    completedProjects: 17,
    experienceYears: 6,
    availability: 'متاح الآن',
    level: 'خبير (Senior)',
    skills: ['Python', 'LangChain', 'FastAPI', 'OpenAI / Claude APIs', 'Vector DB', 'RAG'],
    bio: 'مهندس ذكاء اصطناعي متخصص في بناء وتكامل روبوتات المحادثة المعرفية وأنظمة RAG الذكية المتخصصة في البيانات والوثائق العربية القانونية والتجارية.',
    work: 'مساعد ذكي للبحث الدلالي في الوثائق والأنظمة التجارية للشركات',
    portfolio: [
      {
        title: 'نظام RAG ذكي لاستخراج وتحليل العقود',
        description: 'خط أنابيب متكامل لمعالجة الوثائق باللغة العربية مع إجابات دقيقة واقتباس المصادر.',
        tech: ['FastAPI', 'Qdrant', 'LangChain', 'Python'],
        metrics: 'دقة استرجاع دلالي 96%'
      }
    ],
    verified: true
  },
  {
    id: 'dev-reem',
    name: 'ريم الشهري',
    avatar: '/images/dev-female.jpg',
    specialty: 'تطوير سحابي وبنية تحتية (DevOps & Cloud)',
    category: 'devops',
    location: 'أبها، المملكة العربية السعودية',
    country: 'السعودية',
    hourlyRate: 175,
    fqs: 93,
    fqsBreakdown: {
      completionRate: 95,
      onTimeBudget: 96,
      clientRating: 99,
      repeatHireRate: 89,
      tests: 92,
      codeQuality: 91,
      deliveryRate: 95,
      security: 96
    },
    rating: 4.94,
    reviewsCount: 22,
    completedProjects: 19,
    experienceYears: 5,
    availability: 'متاح الآن',
    level: 'خبير (Senior)',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'GitHub Actions', 'Monitoring'],
    bio: 'مهندسة حلول سحابية متخصصة في أتمتة النشر والبنية التحتية كشيفرة برمجية (IaC) وحماية ومراقبة السيرفرات لضمان عدم توقف الخدمات.',
    work: 'إنشاء خطوط نشر آلية متعددة البيئات مع مراقبة حية لسلامة النظام عبر Grafana',
    portfolio: [
      {
        title: 'بنية تحتية مرنة لشركة ناشئة',
        description: 'هندسة بنية Kubernetes متطورة ذاتية التوسع على سحابة AWS مع تحصين أمني كامل.',
        tech: ['Terraform', 'EKS', 'ArgoCD', 'Prometheus'],
        metrics: 'تخفيض تكاليف السحابة بنسبة 35%'
      }
    ],
    verified: true
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-101',
    title: 'لوحة متابعة المخزون والطلبات لمتجر إلكتروني متكامل',
    description: 'نحتاج إلى لوحة عربية عصرية لمتابعة حركة المنتجات والمخزون في مستودعات متعددة والتنبيه التلقائي عند انخفاض الكميات مع تقارير وإحصائيات لحظية.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    difficulty: 'متوسط',
    budget: 6800,
    deadline: '2025-06-18',
    milestones: ['تصميم تدفق الشاشات وهيكلة قواعد البيانات', 'بناء الواجهات ولوحة التحكم وتكامل API', 'اختبار سيناريوهات الضغط وتسليم التوثيق'],
    owner: 'شركة رفوف للتجارة',
    status: 'متاح',
    requiredFqs: 85,
    proposalsCount: 5,
    category: 'تطوير ويب'
  },
  {
    id: 'p-102',
    title: 'تحسين سرعة ومؤشرات أداء منصة قائمة (Web Vitals Optimization)',
    description: 'تحليل نقاط الاختناق في صفحات التصنيفات والمنتجات، وتقليل حجم الحزم، وتحسين أداء السيرفر للوصول لدرجة 90+ على فحص Lighthouse.',
    stack: ['Next.js', 'Lighthouse', 'TypeScript', 'CDN'],
    difficulty: 'متقدم',
    budget: 4500,
    deadline: '2025-06-09',
    milestones: ['قياس وتوثيق خط الأساس وتحديد المشاكل', 'تحسين تحميل الصور وتقسيم الحزم البرمجية', 'تقرير القياس النهائي وضمان الاستقرار'],
    owner: 'نواة للتجارة الحديثة',
    status: 'متاح',
    requiredFqs: 80,
    proposalsCount: 3,
    category: 'أداء الويب'
  },
  {
    id: 'p-103',
    title: 'تطبيق حجز مواعيد وتذكير ذكي لشبكة عيادات طبية',
    description: 'واجهة عصرية لحجز المواعيد على الهواتف الذكية مع إمكانية اختيار الطبيب والفرع، وتأكيد الحجز وتكامل مع خدمة الرسائل التذكيرية.',
    stack: ['Flutter', 'Firebase', 'REST API', 'Figma'],
    difficulty: 'متوسط',
    budget: 8200,
    deadline: '2025-06-25',
    milestones: ['تصميم واجهات المستخدم UX/UI', 'بناء تدفق الحجز وإدارة المواعيد', 'اختبار تجربة المستخدم على الأجهزة ونشر التطبيق'],
    owner: 'عيادات سنابل الطبية',
    status: 'متاح',
    requiredFqs: 82,
    proposalsCount: 7,
    category: 'تطبيقات جوال'
  },
  {
    id: 'p-104',
    title: 'تطوير محرك مصادقة أمنية وتكامل خدمات سحابية متقدمة',
    description: 'تنفيذ نظام إدارة جلسات آمن مع OAuth2 وربط خدمات التخزين السحابي وحماية واجهات برمجة التطبيقات ضد هجمات DDoS مع توثيق تقني شامل.',
    stack: ['Laravel', 'REST API', 'Redis', 'OAuth2'],
    difficulty: 'متقدم',
    budget: 7400,
    deadline: '2025-07-02',
    milestones: ['مراجعة وتأمين بروتوكول المصادقة', 'تنفيذ تكامل التخزين السحابي ومزامنة البيانات', 'اختبار سيناريوهات الضغط والأمان وتسليم التوثيق'],
    owner: 'منصة مدار الرقمية',
    status: 'قيد التنفيذ',
    requiredFqs: 88,
    proposalsCount: 6,
    category: 'واجهات خلفية'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tk-101',
    subject: 'طلب صيانة دورية: تحديث شهادات SSL وضبط الخادم السحابي',
    category: 'صيانة دورية',
    priority: 'عالي',
    status: 'قيد المعالجة',
    owner: 'شركة رفوف للتجارة',
    projectId: 'p-101',
    projectTitle: 'نظام إدارة المستودعات والطلبات',
    assignedDeveloper: 'ليان العتيبي',
    createdAt: 'اليوم، ٠٩:٣٠ ص',
    slaResponseHours: 4,
    replies: [
      'تم استلام طلب الصيانة ضمن عقد الدعم المستمر (SLA). جاري مراجعة إعدادات Nginx وتجديد شهادة Let\'s Encrypt بنجاح.',
      'تم اختبار الخادم وإعادة تشغيل الخدمات دون أي انقطاع.'
    ],
    messages: [
      {
        id: 'msg-1',
        sender: 'شركة رفوف للتجارة',
        senderRole: 'client',
        message: 'السلام عليكم، تظهر لنا رسالة تحذيرية باقتراب انتهاء صلاحية شهادة الأمان SSL على الدومين الفرعي api.rofof.sa، نرجو التحديث والمتابعة ضمن عقد الصيانة.',
        createdAt: 'اليوم، ٠٩:٣٠ ص'
      },
      {
        id: 'msg-2',
        sender: 'ليان العتيبي',
        senderRole: 'developer',
        message: 'وعليكم السلام، تم استلام الطلب والبدء الفوري بالتنفيذ. قمت بأتمتة التجديد الدوري عبر Certbot واختبار نقاط النهاية بنجاح.',
        createdAt: 'اليوم، ١٠:١٥ ص',
        codeSnippet: 'certbot renew --nginx --dry-run\nsystemctl reload nginx'
      }
    ]
  },
  {
    id: 'tk-102',
    subject: 'خلل برمجي: تكرار إشعارات المواعيد على نظام iOS 18',
    category: 'خلل برمجي (Bug)',
    priority: 'حرج',
    status: 'قيد المعالجة',
    owner: 'عيادات سنابل الطبية',
    projectId: 'p-103',
    projectTitle: 'تطبيق حجز مواعيد وتذكير ذكي',
    assignedDeveloper: 'سارة منصور',
    createdAt: 'أمس، ٠٣:٤٥ م',
    slaResponseHours: 2,
    replies: [
      'تم تشخيص المشكلة في مكتبة FCM مع معالجة أحداث الخلفية في iOS 18. جاري اختبار التصحيح البرمجي.'
    ],
    logsOrCode: 'APNs payload duplicate delivery: message_id received twice on background notification handler',
    messages: [
      {
        id: 'msg-3',
        sender: 'عيادات سنابل الطبية',
        senderRole: 'client',
        message: 'بعض المراجعين اشتكوا من وصول إشعار التذكير مرتين متتاليتين على أجهزة آيفون بعد التحديث الأخير لنظام التشغيل.',
        createdAt: 'أمس، ٠٣:٤٥ م'
      },
      {
        id: 'msg-4',
        sender: 'سارة منصور',
        senderRole: 'developer',
        message: 'تم رصد الخلل في آلية إلغاء تكرار المفاتيح (Deduplication Key). تم إعداد Patch برمجي واختباره على محاكي TestFlight وسنقوم بنشره اليوم.',
        createdAt: 'أمس، ٠٥:٠٠ م'
      }
    ]
  },
  {
    id: 'tk-103',
    subject: 'دعم مستمر بعد التسليم: تفعيل التخزين المؤقت Redis لتقليل زمن الاستجابة',
    category: 'دعم مستمر بعد التسليم',
    priority: 'متوسط',
    status: 'مفتوح',
    owner: 'نواة للتجارة الحديثة',
    projectId: 'p-102',
    projectTitle: 'تحسين سرعة ومؤشرات أداء منصة قائمة',
    assignedDeveloper: 'مروان صالح',
    createdAt: 'قبل يومين',
    slaResponseHours: 12,
    replies: [
      'التذكرة مفتوحة في انتظار موافقة العميل على موعد تحديث الذاكرة المؤقتة فجر الغد.'
    ],
    messages: [
      {
        id: 'msg-5',
        sender: 'نواة للتجارة الحديثة',
        senderRole: 'client',
        message: 'نريد تفعيل التخزين المؤقت لقائمة المنتجات الأكثر مبيعًا للاستفادة القصوى من موارد الخادم في أوقات الذروة.',
        createdAt: 'قبل يومين'
      }
    ]
  },
  {
    id: 'tk-104',
    subject: 'طلب تحسين: إضافة تقرير تصدير العمليات بصيغة CSV و PDF',
    category: 'طلب تعديل أو تحسين',
    priority: 'منخفض',
    status: 'تم الحل',
    owner: 'منصة مدار الرقمية',
    projectId: 'p-104',
    projectTitle: 'تطوير محرك مصادقة أمنية وتكامل خدمات سحابية',
    assignedDeveloper: 'بدر فهد الحازمي',
    createdAt: 'منذ ٤ أيام',
    slaResponseHours: 24,
    replies: [
      'تم بناء وتدقيق ميزة التصدير بنجاح واعتمادها من قبل صاحب المشروع.'
    ]
  }
];

export const INITIAL_DOCS: Doc[] = [
  {
    id: 'd-1',
    title: 'سياسة معيار FQS (Freelancer Quality Score) لمطوري البرمجيات',
    category: 'معيار FQS وجودة الشيفرة',
    summary: 'الدليل المعتمد لخوارزمية مؤشر جودة المستقل وكيفية قياس كفاءة والتزام المبرمجين العرب وفرص تصدر المشاريع.',
    content: 'مؤشر FQS (Freelancer Quality Score) أو "مؤشر جودة المستقل" هو نظام تقييم متطور تستخدمه منصة فوتيك وكبرى منصات العمل الحر العالمية لقياس مدى كفاءة، والتزام، واحترافية المبرمجين والمستقلين. في مجال البرمجة، يحدد هذا المؤشر مدى ظهور ملفك الشخصي للعملاء وفرص فوزك بالمشاريع البرمجية المطروحة.\n\nتعتمد خوارزمية FQS على 4 عوامل أساسية تجمع بين الجوانب التقنية والسلوكية:\n\n1. معدل إكمال المشاريع (Job Completion Rate):\nمن أهم العوامل في البرمجة؛ يقيس نسبة المشاريع المسلّمة بنجاح، وهل تسلّم الأكواد كاملة ومستقرة أم يضطر العميل لإلغاء المشروع بسبب ثغرات أو عدم القدرة على التنفيذ.\n\n2. الالتزام بالوقت والميزانية (On Time & On Budget):\nتسليم برمجيات خالية من المشاكل في الموعد المحدد ودون المطالبة بتكاليف إضافية غير متفق عليها مسبقًا.\n\n3. تقييم العملاء (Average Star Rating):\nالنجوم (من 1 إلى 5) والتعليقات التي يتركها أصحاب المشاريع بعد فحص الكود وتجربة البرنامج في بيئة الإنتاج.\n\n4. معدل التوظيف المتكرر (Repeat Hire Rate):\nعودة العميل القديم للعمل معك مجدداً في مشاريع برمجية أخرى، وهو أقوى مؤشر على تميز جودة عملك واعتماديتك.',
    tags: ['FQS', 'تقييم المطور', 'خوارزمية الجودة', 'العمل الحر'],
    readingTime: '٤ دقائق',
    updatedAt: 'اليوم'
  },
  {
    id: 'd-2',
    title: 'اتفاقية الدعم المستمر وعقود الصيانة بعد التسليم (Ongoing Support & Maintenance SLA)',
    category: 'الدعم المستمر والضمان',
    summary: 'إطار العمل المنظم لخدمات ما بعد التسليم، فترات الضمان المجاني، وحزم الصيانة الشهرية مع اتفاقيات مستوى الخدمة (SLA).',
    content: 'لضمان استقرار المشاريع البرمجية بعد تدشينها، توفر فوتيك إطاراً شاملاً للدعم المستمر (Ongoing Support):\n\nأولاً: فترة الضمان المجاني الإلزامي (30 يوماً):\nيلتزم المطور بتقديم دعم فني مجاني لمدة 30 يوماً تبدأ فور استلام الكود المصدري، تشمل إصلاح أي خلل برمجي (Bug Fixing) أو ثغرة أمنية ظهرت نتيجة عدم مطابقة المواصفات المتفق عليها دون أي رسوم إضافية.\n\nثانياً: عقود الصيانة المستمرة (Ongoing Maintenance Contracts):\nيمكن لصاحب المشروع والمطور الاتفاق على باقة دعم شهري أو سنوي لتغطية:\n• التحديثات الدورية لحزم المكتبات وإصدارات الأمان (Dependency Security Patches).\n• المراقبة الحية للأداء وسجلات الأخطاء (Logging & Monitoring).\n• إدارة النسخ الاحتياطية وتوسيع الموارد السحابية.\n\nثالثاً: اتفاقية مستوى الخدمة وزمن الاستجابة (SLA Response Times):\n• المشاكل الحرجة (Critical): استجابة خلال ساعتين كحد أقصى.\n• المشاكل العالية (High): استجابة خلال 6 ساعات.\n• التحسينات والاستفسارات (Normal): استجابة خلال 24 ساعة.',
    codeExample: '// فحص صحة الخادم ضمن مراقبة الدعم المستمر\nexport async function healthCheck() {\n  const dbPing = await prisma.$queryRaw`SELECT 1`;\n  const redisPing = await redis.ping();\n  return { status: "healthy", timestamp: new Date().toISOString() };\n}',
    tags: ['دعم مستمر', 'صيانة', 'SLA', 'ضمان برمجي'],
    readingTime: '٥ دقائق',
    updatedAt: 'اليوم'
  },
  {
    id: 'd-3',
    title: 'إجراءات تسليم الكود المصدري والمستودعات البرمجية (Repository Handover)',
    category: 'تسليم الكود والمستودعات',
    summary: 'الخطوات الهندسية لنقل ملكية المستودعات من المطور إلى العميل وضمان شمولية ملفات التوثيق والتشغيل.',
    content: 'لضمان حقوق كلا الطرفين وتسهيل تشغيل المشروع من قبل أي فريق مستقبلي، يتبع تسليم الكود المعايير الآتية:\n\n1. نقل الملكية عبر منصات Git (GitHub / GitLab):\nيقوم المطور بنقل ملكية المستودع (Transfer Ownership) إلى حساب المؤسسة أو العميل مع منحه صلاحيات الإدارة الكاملة (Admin Access).\n\n2. ملفات التوثيق الإلزامية داخل المشروع:\n• README.md: يشمل متطلبات النظام، خطوات التثبيت والتشغيل المحلي.\n• .env.example: نموذج كامل لكافة متغيرات البيئة والمفاتيح دون أسرار حقيقية.\n• Dockerfile & docker-compose.yml: لضمان إمكانية بناء وتشغيل المشروع في بيئة حاويات معزولة بنقرة واحدة.\n\n3. نقل التراخيص والملكية الفكرية:\nبمجرد تأكيد تسليم المرحلة النهائية، تنتقل كامل حقوق الملكية الفكرية والشيفرة المصدرية حصرًا إلى صاحب المشروع.',
    codeExample: '# تشغيل المشروع في بيئة الإنتاج بعد استلام المستودع\ngit clone git@github.com:client-org/project-repo.git\ncd project-repo\ncp .env.example .env\ndocker compose up -d --build',
    tags: ['تسليم الكود', 'Git', 'GitHub', 'الملكية الفكرية'],
    readingTime: '٣ دقائق',
    updatedAt: 'أمس'
  },
  {
    id: 'd-4',
    title: 'دليل تذاكر الدعم الفني وحل المشكلات البرمجية (Issue Tracking & Bug Reports)',
    category: 'الدعم المستمر والضمان',
    summary: 'كيفية استخدام نظام التذاكر المدمج للإبلاغ عن المشكلات ومتابعة حلها بالتنسيق مع المطور المختص.',
    content: 'يوفر نظام الدعم المستمر في فوتيك منصة مركزية لتتبع التذاكر الهندسية:\n\n1. فتح التذكرة:\nيقوم العميل باختيار المشروع وتحديد مستوى الأولوية (حرج، عالي، متوسط، منخفض) وإرفاق سجلات الأخطاء أو صور الشاشة.\n\n2. مسار المعالجة (Ticket Lifecycle):\n• مفتوح (Open): تم استلام التذكرة وإشعار المطور المسؤول.\n• قيد المعالجة (In Progress): المطور يعمل على تشخيص وحل المشكلة.\n• تم الحل (Resolved): تم رفع التعديل واختباره.\n• مغلق (Closed): تأكيد صاحب المشروع لإغلاق التذكرة.\n\n3. التواصل والردود المباشرة:\nيحتوي كل طلب على مساحة محادثة مشفرة تتيح تبادل الأكواد البرمجية وسجلات الخطأ لتسريع المعالجة.',
    tags: ['تذاكر الدعم', 'Bug Tracking', 'حل المشاكل', 'فوتيك'],
    readingTime: '٣ دقائق',
    updatedAt: 'أمس'
  },
  {
    id: 'd-5',
    title: 'دليل أصحاب المشاريع: صياغة المواصفات واختيار المطور الأنسب',
    category: 'دليل أصحاب المشاريع',
    summary: 'خطوات عملية لتحويل الفكرة إلى نطاق عمل برمجي محدد المعالم واختيار أفضل الكفاءات بناءً على نقاط FQS.',
    content: 'النجاح في توظيف مطور محترف يبدأ من وضوح نطاق المشروع:\n\n1. ركز على المخرجات الوظيفية:\nحدد بدقة ما يجب أن يراه المستخدم ويفعله النظام (User Stories)، وتجنب الاكتفاء بذكر أسماء التقنيات مجردة.\n\n2. تقسيم المشروع إلى مراحل واضحة (Milestones):\nقسّم المشروع إلى 3 أو 4 مراحل مع مخرجات واضحة لكل مرحلة وموعد زمني محدد لاختبارها.\n\n3. الاعتماد على مؤشر FQS:\nتحقق من تفكيك مؤشر FQS الخاص بالمطور؛ فالمطور الحاصل على 90+ يضمن لك معدل إكمال عالي والتزاماً صارماً بالميزانية والوقت.',
    tags: ['أصحاب المشاريع', 'نطاق العمل', 'توظيف مطور'],
    readingTime: '٤ دقائق',
    updatedAt: 'قبل يومين'
  },
  {
    id: 'd-6',
    title: 'معايير الأمان وحماية البيانات في مشاريع فوتيك (OWASP Top 10 Guidelines)',
    category: 'الأمان وأدوات فوتيك',
    summary: 'قائمة التدقيق الأمني الإلزامية لحماية التطبيقات والواجهات البرمجية ضد الاختراقات وتسريب البيانات.',
    content: 'تفرض فوتيك معايير أمان هندسية مشددة يجب التحقق منها قبل اعتماد تسليم أي مشروع:\n\n• تشفير كلمات المرور باستخدام خوارزميات حديثة (Argon2id أو Bcrypt).\n• حماية ضد هجمات الحقن (SQL Injection) عبر استخدام ORM موثوق أو الاستعلامات المعلمة (Parameterized Queries).\n• تطبيق سياسات CORS صارمة وحماية من XSS و CSRF.\n• حظر تخزين مفاتيح API أو كلمات المرور داخل مستودع الكود (استخدام متغيرات البيئة حصراً).\n• إدارة الجلسات عبر JWTs موقعة بمفاتيح سرية دورية التبديل مع ضبط مدة انتهاء قصيرة.',
    codeExample: '// منع استرجاع البيانات الحساسة عبر الـ API\nconst user = await prisma.user.findUnique({\n  where: { id },\n  select: { id: true, name: true, email: true, createdAt: true }\n});',
    tags: ['أمان', 'OWASP', 'حماية البيانات', 'تشفير'],
    readingTime: '٥ دقائق',
    updatedAt: 'قبل ٣ أيام'
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'dl-1',
    title: 'واجهة لوحة متابعة المخزون والطلبات',
    date: '١٢ مايو ٢٠٢٥',
    amount: 3200,
    client: 'شركة رفوف',
    status: 'تم التسليم'
  },
  {
    id: 'dl-2',
    title: 'حزمة تحسين الأداء وتقارير Lighthouse 98%',
    date: '٢٢ أبريل ٢٠٢٥',
    amount: 4500,
    client: 'نواة للتجارة',
    status: 'مكتمل'
  },
  {
    id: 'dl-3',
    title: 'نظام المصادقة السحابية واختبارات Webhooks',
    date: '٠٥ أبريل ٢٠٢٥',
    amount: 5100,
    client: 'منصة مدار',
    status: 'تم التسليم'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c-1',
    projectId: 'p-101',
    otherUser: 'ليان العتيبي',
    otherUserAvatar: '/images/dev-female.jpg',
    online: true,
    messages: [
      { id: 'm1', body: 'أهلًا بك! اطلعت على نطاق مشروع لوحة المخزون، ولدي تصور جاهز لتقسيم المراحل وهيكلة قواعد البيانات.', sender: 'other', time: '١١:٢٤ ص', read: true },
      { id: 'm2', body: 'مرحبًا ليان، ممتاز جدًا! هل تدعم الواجهة التنبيه الفوري عبر متصفحات الجوال عند وصول صنف معين لحد الأمان؟', sender: 'me', time: '١١:٣١ ص', read: true },
      { id: 'm3', body: 'نعم بالتأكيد، سنستخدم WebSockets مع Service Worker للتنبيهات الفورية حتى لو كانت الصفحة مغلقة.', sender: 'other', time: '١١:٣٤ ص', read: true }
    ]
  },
  {
    id: 'c-2',
    projectId: 'p-102',
    otherUser: 'مروان صالح',
    otherUserAvatar: '/images/dev-male.jpg',
    online: false,
    messages: [
      { id: 'm4', body: 'مرحبًا، أعددت تقرير فحص أولي لمتجركم، والفرصة الأكبر لتسريع المتجر تكمن في ضبط أولويات تحميل الصور وتقسيم الحزم.', sender: 'other', time: 'أمس', read: true }
    ]
  }
];
