import { useState } from 'react';
import { Bell, X } from 'lucide-react';

export function NudgeBanner({ hoursSinceLastEntry }: { hoursSinceLastEntry: number | null }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || hoursSinceLastEntry === null || hoursSinceLastEntry < 24) return null;

  const days = Math.floor(hoursSinceLastEntry / 24);
  const hours = Math.round(hoursSinceLastEntry % 24);
  const timeStr = days > 0 ? `${days} day${days > 1 ? 's' : ''}${hours > 0 ? ` and ${hours} hour${hours > 1 ? 's' : ''}` : ''}` : `${hours} hour${hours > 1 ? 's' : ''}`;

  return (
    <div className="card p-4 flex items-center gap-3 animate-fade-in-up border-l-2 border-l-brand-400 dark:border-l-brand-500">
      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0">
        <Bell className="text-brand-500 dark:text-brand-400 flex-shrink-0" style={{ width: 16, height: 16 }} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 leading-relaxed">
        It's been {timeStr} since your last entry — even a quick note helps build the pattern.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        aria-label="Dismiss reminder"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
