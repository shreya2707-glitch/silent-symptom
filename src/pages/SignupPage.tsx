import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Loader2, Check, Circle, ArrowLeft } from 'lucide-react';
import { PasswordInput } from '@/components/PasswordInput';
import {
  PASSWORD_CHECKS,
  isPasswordValid,
  getPasswordStrength,
  STRENGTH_CONFIG,
  friendlyAuthError,
} from '@/lib/password';

export function SignupPage({ onSwitch, onBack }: { onSwitch: () => void; onBack: () => void }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [condition, setCondition] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);
  const strengthCfg = STRENGTH_CONFIG[strength];
  const passwordsMatch = password === confirmPassword;
  const showConfirmError = confirmPassword.length > 0 && !passwordsMatch;
  const canSubmit = isPasswordValid(password) && passwordsMatch && name.trim().length > 0 && email.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, name, condition.trim() || undefined);
    if (error) setError(friendlyAuthError(error));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#18181B] flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-sm">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-white dark:text-gray-900" fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Silent Symptom</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed text-center">Create an account to start tracking your symptoms.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
              placeholder="Priya"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              ariaLabel="Password"
              describedBy="password-strength password-checks"
              autoComplete="new-password"
            />

            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-2" id="password-strength" role="status" aria-live="polite">
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthCfg.barClass}`}
                    style={{ width: strengthCfg.width }}
                  />
                </div>
                <span className={`text-xs font-semibold ${strengthCfg.color}`}>{strengthCfg.label}</span>
              </div>
            )}

            <ul id="password-checks" className="mt-2.5 space-y-1" aria-label="Password requirements">
              {PASSWORD_CHECKS.map((check) => {
                const passed = check.test(password);
                return (
                  <li key={check.label} className="flex items-center gap-1.5 text-xs">
                    {passed ? (
                      <Check className="w-3.5 h-3.5 text-success-500 dark:text-success-400 flex-shrink-0" style={{ width: 14, height: 14 }} />
                    ) : (
                      <Circle className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" style={{ width: 12, height: 12 }} />
                    )}
                    <span className={passed ? 'text-success-600 dark:text-success-400' : 'text-gray-400 dark:text-gray-500'}>
                      {check.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              ariaLabel="Confirm password"
              describedBy={showConfirmError ? 'confirm-error' : undefined}
              autoComplete="new-password"
            />
            {showConfirmError && (
              <p id="confirm-error" className="text-xs text-danger-600 dark:text-danger-400 mt-1.5 font-medium" role="alert">
                Passwords don't match
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Condition you're tracking <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="input-field"
              placeholder="e.g. possible endometriosis"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed">This helps personalize your experience — it's not a diagnosis.</p>
          </div>
          {error && (
            <p className="text-sm text-danger-600 dark:text-danger-400 font-medium" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="btn-primary w-full"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button type="button" onClick={onSwitch} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
