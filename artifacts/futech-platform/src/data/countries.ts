export interface CountryConfig {
  code: string;
  name: string;
  shortName: string;
  flag: string;
  currencyName: string;
  currencySymbol: string;
  currencyCode: string;
  defaultDevRate: number;       // Hourly rate default
  defaultProjectBudget: number; // Project budget default
  rateMin: number;
}

export const ARAB_AND_GLOBAL_COUNTRIES: CountryConfig[] = [
  {
    code: 'SA',
    name: 'المملكة العربية السعودية',
    shortName: 'السعودية',
    flag: '🇸🇦',
    currencyName: 'ريال سعودي',
    currencySymbol: 'ر.س',
    currencyCode: 'SAR',
    defaultDevRate: 150,
    defaultProjectBudget: 6500,
    rateMin: 50,
  },
  {
    code: 'EG',
    name: 'جمهورية مصر العربية',
    shortName: 'مصر',
    flag: '🇪🇬',
    currencyName: 'جنيه مصري',
    currencySymbol: 'ج.م',
    currencyCode: 'EGP',
    defaultDevRate: 1200,
    defaultProjectBudget: 45000,
    rateMin: 350,
  },
  {
    code: 'AE',
    name: 'الإمارات العربية المتحدة',
    shortName: 'الإمارات',
    flag: '🇦🇪',
    currencyName: 'درهم إماراتي',
    currencySymbol: 'د.إ',
    currencyCode: 'AED',
    defaultDevRate: 150,
    defaultProjectBudget: 6500,
    rateMin: 50,
  },
  {
    code: 'KW',
    name: 'دولة الكويت',
    shortName: 'الكويت',
    flag: '🇰🇼',
    currencyName: 'دينار كويتي',
    currencySymbol: 'د.ك',
    currencyCode: 'KWD',
    defaultDevRate: 12,
    defaultProjectBudget: 550,
    rateMin: 5,
  },
  {
    code: 'QA',
    name: 'دولة قطر',
    shortName: 'قطر',
    flag: '🇶🇦',
    currencyName: 'ريال قطري',
    currencySymbol: 'ر.ق',
    currencyCode: 'QAR',
    defaultDevRate: 150,
    defaultProjectBudget: 6500,
    rateMin: 50,
  },
  {
    code: 'OM',
    name: 'سلطنة عُمان',
    shortName: 'عُمان',
    flag: '🇴🇲',
    currencyName: 'ريال عُماني',
    currencySymbol: 'ر.ع',
    currencyCode: 'OMR',
    defaultDevRate: 15,
    defaultProjectBudget: 680,
    rateMin: 5,
  },
  {
    code: 'BH',
    name: 'مملكة البحرين',
    shortName: 'البحرين',
    flag: '🇧🇭',
    currencyName: 'دينار بحريني',
    currencySymbol: 'د.ب',
    currencyCode: 'BHD',
    defaultDevRate: 15,
    defaultProjectBudget: 650,
    rateMin: 5,
  },
  {
    code: 'JO',
    name: 'المملكة الأردنية الهاشمية',
    shortName: 'الأردن',
    flag: '🇯🇴',
    currencyName: 'دينار أردني',
    currencySymbol: 'د.أ',
    currencyCode: 'JOD',
    defaultDevRate: 28,
    defaultProjectBudget: 1200,
    rateMin: 10,
  },
  {
    code: 'MA',
    name: 'المملكة المغربية',
    shortName: 'المغرب',
    flag: '🇲🇦',
    currencyName: 'درهم مغربي',
    currencySymbol: 'د.م',
    currencyCode: 'MAD',
    defaultDevRate: 400,
    defaultProjectBudget: 18000,
    rateMin: 150,
  },
  {
    code: 'DZ',
    name: 'الجمهورية الجزائرية',
    shortName: 'الجزائر',
    flag: '🇩🇿',
    currencyName: 'دينار جزائري',
    currencySymbol: 'د.ج',
    currencyCode: 'DZD',
    defaultDevRate: 5500,
    defaultProjectBudget: 240000,
    rateMin: 2000,
  },
  {
    code: 'TN',
    name: 'الجمهورية التونسية',
    shortName: 'تونس',
    flag: '🇹🇳',
    currencyName: 'دينار تونسي',
    currencySymbol: 'د.ت',
    currencyCode: 'TND',
    defaultDevRate: 120,
    defaultProjectBudget: 5500,
    rateMin: 40,
  },
  {
    code: 'IQ',
    name: 'جمهورية العراق',
    shortName: 'العراق',
    flag: '🇮🇶',
    currencyName: 'دينار عراقي',
    currencySymbol: 'د.ع',
    currencyCode: 'IQD',
    defaultDevRate: 50000,
    defaultProjectBudget: 2200000,
    rateMin: 20000,
  },
  {
    code: 'LY',
    name: 'دولة ليبيا',
    shortName: 'ليبيا',
    flag: '🇱🇾',
    currencyName: 'دينار ليبي',
    currencySymbol: 'د.ل',
    currencyCode: 'LYD',
    defaultDevRate: 190,
    defaultProjectBudget: 8500,
    rateMin: 70,
  },
  {
    code: 'LB',
    name: 'الجمهورية اللبنانية',
    shortName: 'لبنان',
    flag: '🇱🇧',
    currencyName: 'دولار أمريكي',
    currencySymbol: '$',
    currencyCode: 'USD',
    defaultDevRate: 40,
    defaultProjectBudget: 1800,
    rateMin: 15,
  },
  {
    code: 'PS',
    name: 'دولة فلسطين',
    shortName: 'فلسطين',
    flag: '🇵🇸',
    currencyName: 'دينار أردني / شيكل',
    currencySymbol: 'د.أ',
    currencyCode: 'JOD',
    defaultDevRate: 28,
    defaultProjectBudget: 1200,
    rateMin: 10,
  },
  {
    code: 'YE',
    name: 'الجمهورية اليمنية',
    shortName: 'اليمن',
    flag: '🇾🇪',
    currencyName: 'ريال يمني',
    currencySymbol: 'ر.ي',
    currencyCode: 'YER',
    defaultDevRate: 10000,
    defaultProjectBudget: 450000,
    rateMin: 4000,
  },
  {
    code: 'SD',
    name: 'جمهورية السودان',
    shortName: 'السودان',
    flag: '🇸🇩',
    currencyName: 'جنيه سوداني',
    currencySymbol: 'ج.س',
    currencyCode: 'SDG',
    defaultDevRate: 24000,
    defaultProjectBudget: 1100000,
    rateMin: 8000,
  },
  {
    code: 'MR',
    name: 'الجمهورية الإسلامية الموريتانية',
    shortName: 'موريتانيا',
    flag: '🇲🇷',
    currencyName: 'أوقية موريتانية',
    currencySymbol: 'أ.م',
    currencyCode: 'MRU',
    defaultDevRate: 1600,
    defaultProjectBudget: 72000,
    rateMin: 500,
  },
  {
    code: 'US',
    name: 'الولايات المتحدة / دولي (USD)',
    shortName: 'دولي (USD)',
    flag: '🌐',
    currencyName: 'دولار أمريكي',
    currencySymbol: '$',
    currencyCode: 'USD',
    defaultDevRate: 40,
    defaultProjectBudget: 1800,
    rateMin: 15,
  },
  {
    code: 'EU',
    name: 'الاتحاد الأوروبي (EUR)',
    shortName: 'أوروبا (EUR)',
    flag: '🇪🇺',
    currencyName: 'يورو أوروبي',
    currencySymbol: '€',
    currencyCode: 'EUR',
    defaultDevRate: 38,
    defaultProjectBudget: 1700,
    rateMin: 15,
  },
  {
    code: 'GB',
    name: 'المملكة المتحدة (GBP)',
    shortName: 'بريطانيا (GBP)',
    flag: '🇬🇧',
    currencyName: 'جنيه إسترليني',
    currencySymbol: '£',
    currencyCode: 'GBP',
    defaultDevRate: 32,
    defaultProjectBudget: 1500,
    rateMin: 12,
  },
];

export function getCountryByCodeOrName(val?: string): CountryConfig {
  if (!val) return ARAB_AND_GLOBAL_COUNTRIES[0];
  const found = ARAB_AND_GLOBAL_COUNTRIES.find(
    (c) =>
      c.code.toLowerCase() === val.toLowerCase() ||
      c.name.toLowerCase() === val.toLowerCase() ||
      c.shortName.toLowerCase() === val.toLowerCase() ||
      c.name.includes(val) ||
      val.includes(c.shortName)
  );
  return found || ARAB_AND_GLOBAL_COUNTRIES[0];
}

export function formatPriceWithCurrency(
  amount: number,
  currencySymbol: string = 'ر.س'
): string {
  return `${amount.toLocaleString('ar-EG')} ${currencySymbol}`;
}

export function getDeveloperCurrency(dev?: { country?: string; location?: string }): string {
  if (!dev) return 'ر.س';
  const text = `${dev.country || ''} ${dev.location || ''}`.toLowerCase();
  if (text.includes('مصر') || text.includes('egypt') || text.includes('القاهرة')) {
    return 'ج.م';
  }
  const country = getCountryByCodeOrName(dev.country || dev.location);
  return country?.currencySymbol || 'ر.س';
}
