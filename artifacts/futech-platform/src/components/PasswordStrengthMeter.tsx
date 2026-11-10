import React from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { validatePasswordStrength, PasswordValidationResult } from '../lib/passwordSecurity';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const result: PasswordValidationResult = validatePasswordStrength(password);

  const getBarColor = (score: number) => {
    if (score < 40) return 'bg-rose-500';
    if (score < 70) return 'bg-amber-500';
    if (score < 90) return 'bg-teal-500';
    return 'bg-emerald-500';
  };

  const getTextColor = (score: number) => {
    if (score < 40) return 'text-rose-600 dark:text-rose-400';
    if (score < 70) return 'text-amber-600 dark:text-amber-400';
    if (score < 90) return 'text-teal-600 dark:text-teal-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  return (
    <div className="mt-2 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 text-right dark:border-slate-800 dark:bg-slate-900/60" dir="rtl">
      {/* Progress Bar & Label */}
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <Shield size={12} />
          <span>قوة كلمة المرور:</span>
        </span>
        <span className={getTextColor(result.score)}>
          {result.strengthLabel} ({result.score}%)
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full transition-all duration-300 ${getBarColor(result.score)}`}
          style={{ width: `${Math.max(result.score, 10)}%` }}
        />
      </div>

      {/* Rules Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[10px]">
        {result.rules.map((rule) => (
          <div
            key={rule.id}
            className={`flex items-center gap-1.5 ${
              rule.passed
                ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {rule.passed ? (
              <Check size={11} className="shrink-0 text-emerald-500 stroke-[3]" />
            ) : (
              <X size={11} className="shrink-0 text-slate-300 dark:text-slate-600 stroke-[2.5]" />
            )}
            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
