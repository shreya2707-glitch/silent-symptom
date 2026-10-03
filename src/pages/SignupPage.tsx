import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Loader2, Check, Circle } from 'lucide-react';
import { PulseWave } from '@/components/PulseWave';
import { PasswordInput } from '@/components/PasswordInput';
import {
  PASSWORD_CHECKS,
  isPasswordValid,
  getPasswordStrength,
  STRENGTH_CONFIG,
  friendlyAuthError,
} from '@/lib/password';

export function SignupPage({ onSwitch }: { onSwitch: () => void }) {
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
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1B23] flex items-center justify-center p-4 transition-colors duration-200 relative overflow-hidden">
      <PulseWave className="absolute top-1/4 left-0 w-full h-16 text-lavender-300 dark:text-lavender-700/30" />
      <PulseWave className="absolute bottom-1/4 left-0 w-full h-16 text-lavender-300 dark:text-lavender-700/30" />
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender-100 to-lavender-200 dark:from-lavender-900/40 dark:to-lavender-800/30 flex items-center justify-center mb-4 animate-pulse-slow">
            <Heart className="w-8 h-8 text-lavender-600 dark:text-lavender-400" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Silent Symptom</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">Create an account to start tracking your symptoms.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
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

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-2" id="password-strength" role="status" aria-live="polite">
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthCfg.barClass}`}
                    style={{ width: strengthCfg.width }}
                  />
                </div>
                <span className={`text-xs font-semibold ${strengthCfg.color}`}>{strengthCfg.label}</span>
              </div>
            )}

            {/* Requirements checklist */}
            <ul id="password-checks" className="mt-2.5 space-y-1" aria-label="Password requirements">
              {PASSWORD_CHECKS.map((check) => {
                const passed = check.test(password);
                return (
                  <li key={check.label} className="flex items-center gap-1.5 text-xs">
                    {passed ? (
                      <Check className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                    )}
                    <span className={passed ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}>
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
              <p id="confirm-error" className="text-xs text-red-500 dark:text-red-400 mt-1.5 font-medium" role="alert">
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
            <p className="text-sm text-red-500 dark:text-red-400 font-medium" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="btn-accent w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button type="button" onClick={onSwitch} className="text-lavender-600 dark:text-lavender-400 font-semibold hover:underline">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
