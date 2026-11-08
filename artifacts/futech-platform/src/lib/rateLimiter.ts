/**
 * ─────────────────────────────────────────────────────────────────────────────
 * منصة فوتيك - نظام الحماية من هجمات التخمين والقوة الغاشمة (Auth Rate Limiter)
 * ─────────────────────────────────────────────────────────────────────────────
 * معايير الأمان OWASP Authentication:
 * - حد أقصى 5 محاولات تسجيل دخول خاطئة متتالية
 * - حظر مؤقت لمدة 15 دقيقة عند تجاوز الحد الأقصى
 * - إعادة تصفير العداد عند نجاح تسجيل الدخول
 */

export interface RateLimitState {
  attempts: number;
  blockedUntil: number | null;
}

export interface RateLimitStatus {
  isBlocked: boolean;
  remainingSeconds: number;
  attempts: number;
  remainingAttempts: number;
}

const STORAGE_KEY_PREFIX = 'futech_auth_ratelimit_';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getStorageKey(email: string): string {
  const clean = (email || '').trim().toLowerCase();
  return `${STORAGE_KEY_PREFIX}${clean || 'anonymous'}`;
}

function getStoredState(email: string): RateLimitState {
  if (typeof window === 'undefined') return { attempts: 0, blockedUntil: null };
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return { attempts: 0, blockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { attempts: 0, blockedUntil: null };
  }
}

function saveStoredState(email: string, state: RateLimitState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(state));
  } catch {}
}

export function getRateLimitStatus(email: string): RateLimitStatus {
  const state = getStoredState(email);
  const now = Date.now();

  if (state.blockedUntil && state.blockedUntil > now) {
    const remainingSeconds = Math.ceil((state.blockedUntil - now) / 1000);
    return {
      isBlocked: true,
      remainingSeconds,
      attempts: state.attempts,
      remainingAttempts: 0,
    };
  }

  // If lockout expired, reset state
  if (state.blockedUntil && state.blockedUntil <= now) {
    recordSuccessfulAuth(email);
    return {
      isBlocked: false,
      remainingSeconds: 0,
      attempts: 0,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }

  return {
    isBlocked: false,
    remainingSeconds: 0,
    attempts: state.attempts,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - state.attempts),
  };
}

export function recordFailedAttempt(email: string): RateLimitStatus {
  const state = getStoredState(email);
  const now = Date.now();

  const nextAttempts = state.attempts + 1;
  let blockedUntil = state.blockedUntil;

  if (nextAttempts >= MAX_ATTEMPTS) {
    blockedUntil = now + LOCKOUT_DURATION_MS;
  }

  const nextState: RateLimitState = {
    attempts: nextAttempts,
    blockedUntil,
  };
  saveStoredState(email, nextState);

  const remainingSeconds = blockedUntil ? Math.ceil((blockedUntil - now) / 1000) : 0;
  return {
    isBlocked: nextAttempts >= MAX_ATTEMPTS,
    remainingSeconds,
    attempts: nextAttempts,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - nextAttempts),
  };
}

export function recordSuccessfulAuth(email: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getStorageKey(email));
  } catch {}
}

export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return '0 ثانية';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0 && secs > 0) {
    return `${mins} دقيقة و ${secs} ثانية`;
  }
  if (mins > 0) {
    return `${mins} دقيقة`;
  }
  return `${secs} ثانية`;
}
