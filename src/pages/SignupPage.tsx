import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Loader2 } from 'lucide-react';

export function SignupPage({ onSwitch }: { onSwitch: () => void }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [condition, setCondition] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signUp(email, password, name, condition.trim() || undefined);
    if (error) setError(error);
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field"
              placeholder="At least 6 characters"
            />
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
          {error && <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>}
          <button type="submit" disabled={loading} className="btn-accent w-full flex items-center justify-center gap-2">
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
