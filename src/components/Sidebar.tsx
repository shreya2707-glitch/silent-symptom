import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import type { Page } from '@/lib/types';
import { Heart, PenLine, Clock, FileText, BarChart3, LogOut, Sun, Moon, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type SidebarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { displayName, condition, signOut, updateCondition } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [entryCount, setEntryCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [conditionInput, setConditionInput] = useState(condition ?? '');
  const [savingCondition, setSavingCondition] = useState(false);

  useEffect(() => {
    fetchCount();
  }, [currentPage]);

  useEffect(() => {
    setConditionInput(condition ?? '');
  }, [condition]);

  const fetchCount = async () => {
    const { count } = await supabase.from('entries').select('*', { count: 'exact', head: true });
    setEntryCount(count ?? 0);
  };

  const handleSaveCondition = async () => {
    setSavingCondition(true);
    await updateCondition(conditionInput.trim());
    setSavingCondition(false);
    setShowSettings(false);
  };

  const navItems: { id: Page; label: string; icon: typeof PenLine }[] = [
    { id: 'quicklog', label: 'Quick Log', icon: PenLine },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'summary', label: 'Doctor Summary', icon: FileText },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  const footerBtn = "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150";

  return (
    <>
      <aside className="w-64 h-screen flex flex-col bg-white dark:bg-[#242530] border-r border-gray-100 dark:border-gray-700/50 shadow-sm transition-colors duration-200 flex-shrink-0">
        <div className="p-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-100 to-lavender-200 dark:from-lavender-900/40 dark:to-lavender-800/30 flex items-center justify-center animate-pulse-slow">
              <Heart className="w-5 h-5 text-lavender-600 dark:text-lavender-400" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-gray-800 dark:text-gray-100 leading-tight tracking-tight">Silent Symptom</h1>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Symptom Tracker</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-5">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Hey, {displayName ?? 'there'} <span className="inline-block animate-fade-in">👋</span>
          </p>
          {condition && (
            <p className="text-[11px] text-lavender-600 dark:text-lavender-400 mt-1.5 font-semibold truncate" title={condition}>
              Tracking: {condition}
            </p>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? 'bg-lavender-50 dark:bg-lavender-900/25 font-bold text-lavender-700 dark:text-lavender-300 shadow-sm'
                    : 'font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/30'
                }`}
              >
                <Icon
                  className="flex-shrink-0 transition-colors duration-150"
                  style={{ width: 18, height: 18 }}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'timeline' && entryCount > 0 && (
                  <span className="text-[11px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-1.5 py-0.5 rounded-full tabular-nums">
                    {entryCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-700/50 space-y-0.5">
          <button onClick={toggleTheme} className={footerBtn}>
            {theme === 'light'
              ? <Moon className="flex-shrink-0" style={{ width: 18, height: 18 }} />
              : <Sun className="flex-shrink-0" style={{ width: 18, height: 18 }} />}
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <button onClick={() => setShowSettings(true)} className={footerBtn}>
            <Settings className="flex-shrink-0" style={{ width: 18, height: 18 }} />
            <span>Condition settings</span>
          </button>
          <button onClick={signOut} className={footerBtn}>
            <LogOut className="flex-shrink-0" style={{ width: 18, height: 18 }} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in p-4"
          onClick={() => setShowSettings(false)}
        >
          <div className="card p-6 w-full max-w-sm animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Condition Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Condition you're tracking <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
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
            <button onClick={handleSaveCondition} disabled={savingCondition} className="btn-accent w-full mt-4 flex items-center justify-center gap-2">
              {savingCondition ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
