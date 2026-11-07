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

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  metrics?: string;
  liveUrl?: string;
  githubUrl?: string;
  previewType?: 'saas' | 'ecommerce' | 'mobile' | 'ai' | 'dashboard' | 'api' | 'devops' | 'cms';
  previewImage?: string;
  previewSummary?: string;
  features?: string[];
  stats?: { label: string; value: string }[];
  trailerVideoUrl?: string;
  hasTrailer?: boolean;
  trailerDuration?: string;
};

export type DeveloperExperience = {
  role: string;
  company: string;
  period: string;
  location?: string;
  achievements: string[];
};

export type DeveloperEducation = {
  degree: string;
  institution: string;
  year: string;
};

export type DeveloperCVFile = {
  name: string;
  size: string;
  url?: string;
  uploadedAt: string;
};

export type DeveloperCV = {
  headline?: string;
  summary: string;
  yearsOfExperience: number;
  education: DeveloperEducation[];
  experience: DeveloperExperience[];
  certifications: string[];
  languages: { name: string; level: string }[];
  file?: DeveloperCVFile;
};

export type ClientReview = {
  id: string;
  clientName: string;
  clientCompany: string;
  clientAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  projectTitle: string;
  developerId?: string;
  developerName?: string;
};

export type DeveloperAvailability =
  | 'متاح الآن'
  | 'مشغول (يتحدث مع عميل)'
  | 'مشغول'
  | 'غير متاح حالياً'
  | 'متاح جزئياً'
  | 'متاح قريباً'
  | 'غير متصل';

export type Developer = {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'ai' | 'devops' | 'cms';
  location: string;
  country: string;
  hourlyRate: number;
  fqs: number;
  fqsBreakdown: FqsBreakdown;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  experienceYears: number;
  availability: DeveloperAvailability | string;
  level: 'المالك ومطور معتمد 👑' | 'خبير (Senior)' | 'متوسط (Mid-level)' | 'واعد (Junior)' | string;
  skills: string[];
  bio: string;
  work: string;
  portfolio: PortfolioItem[];
  cv?: DeveloperCV;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  reviews?: ClientReview[];
  verified: boolean;
};

export type ProjectAttachment = {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'doc' | 'archive' | 'file';
  previewUrl?: string;
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
  attachments?: ProjectAttachment[];
  assignedDeveloperId?: string;
  developer?: string;
  client?: string;
  currency?: string;
};

export type Application = {
  id: string;
  projectId: string;
  developerName: string;
  developerId?: string;
  plan: string;
  proposedBudget?: number;
  proposedDuration?: string;
  status: 'قيد المراجعة' | 'مقبول' | 'مرفوض';
  submittedAt: string;
};

export type MessageAttachment = {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'doc' | 'archive' | 'file';
  url: string;
};

export type MessageItem = {
  id: string;
  body: string;
  sender: 'me' | 'other';
  time: string;
  read: boolean;
  attachments?: MessageAttachment[];
};

export type Conversation = {
  id: string;
  projectId: string;
  otherUser: string;
  otherUserAvatar?: string;
  online: boolean;
  messages: MessageItem[];
};

export type TicketAttachment = {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'file';
  url?: string;
  previewUrl?: string;
};

export type TicketReply = {
  id: string;
  sender: string;
  senderRole?: 'client' | 'developer' | 'support' | 'owner' | 'admin' | string;
  author?: string;
  role?: string;
  message: string;
  createdAt: string;
  timestamp?: string;
  codeSnippet?: string;
  attachments?: TicketAttachment[];
};

export type Ticket = {
  id: string;
  subject: string;
  category: 'دعم مستمر بعد التسليم' | 'صيانة دورية' | 'خلل برمجي (Bug)' | 'طلب تعديل أو تحسين' | 'استفسار تقني' | 'مراسلة مباشرة للمالك' | 'مراسلة خاصة للإدارة' | 'مراسلة للمالك والإدارة' | string;
  priority: 'حرج' | 'عالي' | 'متوسط' | 'منخفض';
  status: 'مفتوح' | 'قيد المعالجة' | 'تم الحل' | 'مغلق';
  owner: string;
  projectId?: string;
  projectTitle?: string;
  assignedDeveloper?: string;
  createdAt: string;
  created?: string;
  slaResponseHours?: number;
  message?: string;
  department?: string;
  replies?: (string | TicketReply)[];
  messages?: TicketReply[];
  logsOrCode?: string;
  attachments?: TicketAttachment[];
  targetAudience?: 'owner' | 'admin' | 'both';
  senderEmail?: string;
  senderPhone?: string;
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
  views?: number;
  helpfulVotes?: number;
};

export type Delivery = {
  id: string;
  title: string;
  date: string;
  amount: number;
  client: string;
  status: 'تم التسليم' | 'قيد الفحص' | 'مكتمل';
  developerId?: string;
  developerName?: string;
};

export type PlatformSuggestion = {
  id: string;
  category: 'ميزة برمجية' | 'تحسين واجهة' | 'معيار FQS' | 'أدوات المطورين' | 'أنظمة الضمان والأمان' | 'اقتراح عام';
  title: string;
  description: string;
  author: string;
  votes: number;
  status: 'قيد الدراسة والتقييم' | 'مقبول وقيد التطوير' | 'تم تنفيذه بنجاح';
  date: string;
  tags?: string[];
};

export type UserRole = 'developer' | 'client' | 'admin' | 'owner';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  company?: string;
  githubUrl?: string;
  gitlabUrl?: string;
  portfolioUrl?: string;
  hourlyRate?: number;
  fqs?: number;
  skills?: string[];
  bio?: string;
  country?: string;
  currency?: string;
  currencyCode?: string;
  phone?: string;
  verified?: boolean;
  createdAt?: string;
};

export const DEFAULT_USERS: Record<UserRole, User> = {
  developer: {
    id: '',
    name: 'مهندس برمجيات',
    email: '',
    role: 'developer',
    avatar: '',
    country: 'السعودية',
  },
  client: {
    id: '',
    name: 'صاحب مشروع',
    email: '',
    role: 'client',
    avatar: '',
    country: 'السعودية',
  },
  admin: {
    id: '',
    name: 'مشرف العمليات',
    email: '',
    role: 'admin',
    avatar: '',
    country: 'السعودية',
  },
  owner: {
    id: '',
    name: 'مالك المنصة',
    email: '',
    role: 'owner',
    avatar: '',
    country: 'جمهورية مصر العربية',
  },
};

export type FqsWeights = {
  completionRate: number;
  onTimeBudget: number;
  clientRating: number;
  repeatHireRate: number;
};

export type WalletTransaction = {
  id: string;
  type: 'deposit' | 'escrow_lock' | 'escrow_release' | 'withdrawal' | 'refund';
  amount: number;
  currency: string;
  date: string;
  status: 'مكتمل' | 'معلق' | 'قيد المعالجة';
  projectTitle?: string;
  referenceId: string;
  description: string;
  method?: string;
};

export type UserWallet = {
  totalBalance: number;
  inEscrow: number;
  availableBalance: number;
  currency: string;
  transactions: WalletTransaction[];
};

export type AppNotification = {
  id: string;
  userId?: string;
  targetRole?: 'client' | 'developer' | 'all';
  type: 'escrow' | 'delivery' | 'proposal' | 'ticket' | 'chat' | 'system';
  title: string;
  message: string;
  timestamp: string;
  createdAt?: string;
  isRead: boolean;
  linkTab?: 'wallet' | 'projects' | 'proposals' | 'handovers' | 'tickets' | 'chat' | 'settings' | 'notifications';
  linkId?: string;
  meta?: {
    amount?: number;
    currency?: string;
    projectTitle?: string;
    developerName?: string;
    repoUrl?: string;
    ticketId?: string;
  };
};

export type Store = {
  developers: Developer[];
  projects: Project[];
  applications: Application[];
  conversations: Conversation[];
  tickets: Ticket[];
  docs: Doc[];
  deliveries: Delivery[];
  currentUser: User | null;
  users?: User[];
  fqsWeights?: FqsWeights;
  clientWallet?: UserWallet;
  developerWallet?: UserWallet;
  notifications?: AppNotification[];
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_CLIENT_WALLET: UserWallet = {
  totalBalance: 0,
  inEscrow: 0,
  availableBalance: 0,
  currency: 'ر.س',
  transactions: [],
};

export const INITIAL_DEVELOPER_WALLET: UserWallet = {
  totalBalance: 0,
  inEscrow: 0,
  availableBalance: 0,
  currency: 'ر.س',
  transactions: [],
};

export const INITIAL_DEVELOPERS: Developer[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_TICKETS: Ticket[] = [];
export const INITIAL_DELIVERIES: Delivery[] = [];
export const INITIAL_CONVERSATIONS: Conversation[] = [];

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
  },
  {
    id: 'd-7',
    title: 'ميثاق النزاهة وحظر الدفع والتعامل الخارجي (Platform Integrity & Escrow Protection)',
    category: 'الأمان وأدوات فوتيك',
    summary: 'سياسة حماية حقوق المطور وصاحب العمل، إلزامية المعاملات عبر المنصة، وضمان استمرار الضمان وعقود الصيانة SLA.',
    content: 'لحماية حقوق كل من المطور وصاحب العمل وضمان سريان كفالة الضمان الفني والتحكيم الهندسي، تلتزم كافة الأطراف بالبنود التالية:\n\n1. حظر التعامل المالي الخارجي:\nتُحظر تماماً أي محاولات للدفع أو تحويل المستحقات عبر حسابات بنكية أو محافظ خارجية بعيداً عن نظام الضمان المالي المعتمد في فوتيك.\n\n2. الحماية المالية والضمان الهندسي:\nتضمن المنصة بقاء المبالغ المالية بأمان في حساب الضمان حتى فحص الكود والتأكد من مطابقته لمعايير FQS، كما تضمن للمطور استلام أتعابه فور اكتمال المراحل دون تأخير أو اقتطاعات غير مبررة.\n\n3. فقدان الكفالة والتحكيم خارج المنصة:\nأي مشروع أو اتفاق يتم إبرامه أو تسديد مبالغه خارج المنصة يفقد فوراً تغطية الضمان المجاني (30 يوماً) وعقود الصيانة المستمرة (SLA)، ولا تتحمل المنصة أي مسؤولية قانونية أو هندسية عنه.\n\n4. الإبلاغ الفوري عن المخالفات:\nيُطلب من المبرمجين وأصحاب المشاريع الإبلاغ المباشر عبر تذاكر الدعم عند تلقي أي طلب للتحويل الخارجي لضمان حماية الحساب وتوثيق النزاهة المهنية.',
    codeExample: '// التحقق البرمجي من تفعيل حماية الضمان ومطابقة المشروع\nconst escrowAudit = await futech.verifyEscrow({\n  projectId: "p-101",\n  slaGuaranteed: true,\n  integrityCheck: "VERIFIED"\n});',
    tags: ['ميثاق النزاهة', 'الدفع الآمن', 'الضمان المالي', 'سياسات فوتيك'],
    readingTime: '٣ دقائق',
    updatedAt: 'اليوم'
  }
];

