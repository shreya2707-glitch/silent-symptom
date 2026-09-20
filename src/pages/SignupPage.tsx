import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Loader2 } from 'lucide-react';

export function SignupPage({ onSwitch }: { onSwitch: () => void }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, name);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#1A1B23] flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-lavender-500 flex items-center justify-center mb-4 animate-pulse-slow">
            <Heart className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Silent Symptom</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create an account to start tracking your symptoms.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-[#1A1B23] px-4 py-2.5 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
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
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-[#1A1B23] px-4 py-2.5 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-[#1A1B23] px-4 py-2.5 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
              placeholder="At least 6 characters"
            />
          </div>
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-accent w-full flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button type="button" onClick={onSwitch} className="text-lavender-600 dark:text-lavender-400 font-medium hover:underline">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
