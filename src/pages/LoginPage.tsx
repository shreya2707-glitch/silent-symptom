import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/PasswordInput';
import { friendlyAuthError } from '@/lib/password';

export function LoginPage({ onSwitch }: { onSwitch: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(friendlyAuthError(error));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1B23] flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender-100 to-lavender-200 dark:from-lavender-900/40 dark:to-lavender-800/30 flex items-center justify-center mb-4 animate-pulse-slow">
            <Heart className="w-8 h-8 text-lavender-600 dark:text-lavender-400" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Silent Symptom</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">Welcome back. Log in to track your symptoms.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
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
              describedBy={error ? 'login-error' : undefined}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <p id="login-error" className="text-sm text-red-500 dark:text-red-400 font-medium" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn-accent w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in…' : 'Log in'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button type="button" onClick={onSwitch} className="text-lavender-600 dark:text-lavender-400 font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
