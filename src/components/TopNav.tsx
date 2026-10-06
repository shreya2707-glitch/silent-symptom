import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import type { Page } from '@/lib/types';
import { Heart, LayoutGrid, PenLine, Clock, BarChart3, FileText, LogOut, Sun, Moon, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type NavProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

const NAV_ITEMS: { id: Page; label: string; icon: typeof PenLine; mobileLabel: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, mobileLabel: 'Home' },
  { id: 'quicklog', label: 'Log Symptom', icon: PenLine, mobileLabel: 'Log' },
  { id: 'timeline', label: 'Timeline', icon: Clock, mobileLabel: 'Timeline' },
  { id: 'insights', label: 'Patterns', icon: BarChart3, mobileLabel: 'Patterns' },
  { id: 'reports', label: 'Reports', icon: FileText, mobileLabel: 'Reports' },
];

export function TopNav({ currentPage, onNavigate }: NavProps) {
  const { displayName, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    fetchCount();
  }, [currentPage]);

  const fetchCount = async () => {
    const { count } = await supabase.from('entries').select('*', { count: 'exact', head: true });
    setEntryCount(count ?? 0);
  };

  return (
    <>
      {/* Desktop top nav */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white dark:text-gray-900" fill="currentColor" />
            </div>
            <span className="font-bold text-base tracking-tight hidden sm:block">Silent Symptom</span>
          </button>

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                    active
                      ? 'text-gray-900 dark:text-gray-50 bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" style={{ width: 16, height: 16 }} />
                  {item.label}
                  {item.id === 'timeline' && entryCount > 0 && (
                    <span className="text-[10px] font-semibold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full tabular-nums">
                      {entryCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Condition settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-gray-100 dark:border-gray-800">
              <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300">
                {(displayName ?? '?')[0]?.toUpperCase()}
              </div>
              <button
                onClick={signOut}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#18181B] border-t border-gray-100 dark:border-gray-800/60 safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 transition-colors ${
                  active ? 'text-gray-900 dark:text-gray-50' : 'text-gray-400 dark:text-gray-500'
                }`}
                aria-current={active ? 'page' : undefined}
                aria-label={item.mobileLabel}
              >
                <Icon className="w-5 h-5" style={{ width: 20, height: 20 }} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.mobileLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { condition, updateCondition } = useAuth();
  const [conditionInput, setConditionInput] = useState(condition ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateCondition(conditionInput.trim());
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in p-4"
      onClick={onClose}
    >
      <div className="card p-6 w-full max-w-sm animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Condition Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Condition you're tracking <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={conditionInput}
          onChange={(e) => setConditionInput(e.target.value)}
          className="input-field"
          placeholder="e.g. possible endometriosis"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-relaxed">
          This personalizes your experience — it's not a diagnosis.
        </p>
        <button onClick={handleSave} disabled={saving} className="btn-primary w-full mt-4">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
