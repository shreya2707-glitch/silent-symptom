export type PasswordCheck = {
  label: string;
  test: (pw: string) => boolean;
};

export const PASSWORD_CHECKS: PasswordCheck[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'An uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'A lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'A number', test: (pw) => /\d/.test(pw) },
];

export function isPasswordValid(pw: string): boolean {
  return PASSWORD_CHECKS.every((c) => c.test(pw));
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export function getPasswordStrength(pw: string): PasswordStrength {
  if (pw.length === 0) return 'weak';
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  return 'strong';
}

export const STRENGTH_CONFIG: Record<PasswordStrength, { label: string; color: string; barClass: string; width: string }> = {
  weak: { label: 'Weak', color: 'text-danger-600 dark:text-danger-400', barClass: 'bg-danger-400', width: '33%' },
  medium: { label: 'Medium', color: 'text-amber-600 dark:text-amber-400', barClass: 'bg-amber-400', width: '66%' },
  strong: { label: 'Strong', color: 'text-success-600 dark:text-success-400', barClass: 'bg-success-500', width: '100%' },
};

export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('password') && (lower.includes('weak') || lower.includes('length') || lower.includes('characters') || lower.includes('at least'))) {
    return 'Password must be at least 8 characters and include a number and a letter';
  }
  if (lower.includes('already') && lower.includes('registered')) {
    return 'An account with this email already exists — try logging in instead';
  }
  if (lower.includes('already') && lower.includes('exist')) {
    return 'An account with this email already exists — try logging in instead';
  }
  if (lower.includes('invalid') && lower.includes('credentials')) {
    return 'Incorrect email or password';
  }
  if (lower.includes('invalid') && (lower.includes('login') || lower.includes('password'))) {
    return 'Incorrect email or password';
  }
  if (lower.includes('email not confirmed')) {
    return 'Incorrect email or password';
  }
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('timeout')) {
    return 'Something went wrong — please try again';
  }
  return 'Something went wrong — please try again';
}
