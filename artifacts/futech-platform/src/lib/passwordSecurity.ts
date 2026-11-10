/**
 * ─────────────────────────────────────────────────────────────────────────────
 * منصة فوتيك - سياسة ومعايير كلمات المرور (Password Security Policy - OWASP)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface PasswordRuleResult {
  id: string;
  label: string;
  passed: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 - 100
  strengthLabel: 'ضعيفة جداً' | 'ضعيفة' | 'متوسطة' | 'قوية' | 'قوية جداً';
  rules: PasswordRuleResult[];
  errorMessage?: string;
}

const COMMON_WEAK_PASSWORDS = [
  '123456',
  '12345678',
  '123456789',
  'password',
  'futech2026',
  'admin123',
  'qwerty',
  'qwertyuiop',
];

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const pwd = password || '';

  const rules: PasswordRuleResult[] = [
    {
      id: 'length',
      label: '8 أحرف على الأقل',
      passed: pwd.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'حرف كبير إنجليزي واحد على الأقل (A-Z)',
      passed: /[A-Z]/.test(pwd),
    },
    {
      id: 'lowercase',
      label: 'حرف صغير إنجليزي واحد على الأقل (a-z)',
      passed: /[a-z]/.test(pwd),
    },
    {
      id: 'number',
      label: 'رقم واحد على الأقل (0-9)',
      passed: /[0-9]/.test(pwd),
    },
    {
      id: 'special',
      label: 'رمز خاص واحد على الأقل (@, #, $, %, ...)',
      passed: /[^A-Za-z0-9]/.test(pwd),
    },
  ];

  const passedCount = rules.filter(r => r.passed).length;
  const isCommon = COMMON_WEAK_PASSWORDS.includes(pwd.toLowerCase().trim());

  let score = Math.round((passedCount / rules.length) * 100);
  if (isCommon) score = Math.min(score, 20);

  let strengthLabel: PasswordValidationResult['strengthLabel'] = 'ضعيفة جداً';
  if (score >= 90) strengthLabel = 'قوية جداً';
  else if (score >= 70) strengthLabel = 'قوية';
  else if (score >= 50) strengthLabel = 'متوسطة';
  else if (score >= 30) strengthLabel = 'ضعيفة';

  const isValid = passedCount === rules.length && !isCommon;

  let errorMessage: string | undefined;
  if (isCommon) {
    errorMessage = 'كلمة المرور هذه شائعة جداً ويسهل تخمينها، يرجى اختيار كلمة مرور أكثر تعقيداً.';
  } else if (!rules.find(r => r.id === 'length')?.passed) {
    errorMessage = 'كلمة المرور يجب ألا تقل عن 8 أحرف.';
  } else if (!isValid) {
    const missing = rules.filter(r => !r.passed).map(r => r.label).join('، ');
    errorMessage = `كلمة المرور لا تستوفي المعايير الأمنية: (${missing})`;
  }

  return {
    isValid,
    score,
    strengthLabel,
    rules,
    errorMessage,
  };
}
