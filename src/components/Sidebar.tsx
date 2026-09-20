import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import type { Page } from '@/lib/types';
import { Heart, PenLine, Clock, FileText, BarChart3, LogOut, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type SidebarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { displayName, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    fetchCount();
  }, [currentPage]);

  const fetchCount = async () => {
    const { count } = await supabase.from('entries').select('*', { count: 'exact', head: true });
    setEntryCount(count ?? 0);
  };

  const navItems: { id: Page; label: string; icon: typeof PenLine }[] = [
    { id: 'quicklog', label: 'Quick Log', icon: PenLine },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'summary', label: 'Doctor Summary', icon: FileText },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-screen flex flex-col bg-white dark:bg-[#242530] border-r border-gray-100 dark:border-gray-700/50 transition-colors duration-200 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-lavender-500 flex items-center justify-center animate-pulse-slow">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 dark:text-gray-100 leading-tight">Silent Symptom</h1>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Symptom Tracker</p>
          </div>
        </div>
      </div>

      <div className="px-6 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hey, {displayName ?? 'there'} <span className="inline-block animate-fade-in">👋</span>
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-lavender-50 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-300'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/30'
              }`}
            >
              <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'timeline' && entryCount > 0 && (
                <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                  {entryCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700/50">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
        >
          {theme === 'light' ? <Moon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} /> : <Sun className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />}
          <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
        >
          <LogOut className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
