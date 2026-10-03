import { useState } from 'react';
import { Bell, X } from 'lucide-react';

export function NudgeBanner({ hoursSinceLastEntry }: { hoursSinceLastEntry: number | null }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || hoursSinceLastEntry === null || hoursSinceLastEntry < 24) return null;

  const days = Math.floor(hoursSinceLastEntry / 24);
  const hours = Math.round(hoursSinceLastEntry % 24);
  const timeStr = days > 0 ? `${days} day${days > 1 ? 's' : ''}${hours > 0 ? ` and ${hours} hour${hours > 1 ? 's' : ''}` : ''}` : `${hours} hour${hours > 1 ? 's' : ''}`;

  return (
    <div className="card p-4 flex items-center gap-3 animate-fade-in-up border-l-4 border-l-lavender-400">
      <div className="w-9 h-9 rounded-full bg-lavender-50 dark:bg-lavender-900/30 flex items-center justify-center flex-shrink-0">
        <Bell className="w-4.5 h-4.5 text-lavender-500 dark:text-lavender-400" style={{ width: 18, height: 18 }} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
        It's been {timeStr} since your last entry — even a quick note helps build the pattern.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
