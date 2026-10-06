import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Loader2, ArrowLeft } from 'lucide-react';
import { PasswordInput } from '@/components/PasswordInput';
import { friendlyAuthError } from '@/lib/password';

export function LoginPage({ onSwitch, onBack }: { onSwitch: () => void; onBack: () => void }) {
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed text-center">Welcome back. Log in to track your symptoms.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p id="login-error" className="text-sm text-danger-600 dark:text-danger-400 font-medium" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in…' : 'Log in'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button type="button" onClick={onSwitch} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
