import { useEffect, useState } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { TagPill } from '@/components/TagPill';
import { Flag } from 'lucide-react';

export function EntryCard({ entry, onFlagToggle }: { entry: Entry; onFlagToggle?: (id: string, flagged: boolean) => void }) {
  const [showFull, setShowFull] = useState(false);
  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const severityColor = (s: number) => {
    if (s >= 5) return 'bg-red-400';
    if (s >= 4) return 'bg-orange-400';
    if (s >= 3) return 'bg-yellow-400';
    if (s >= 2) return 'bg-lime-400';
    return 'bg-green-400';
  };

  return (
    <div
      className={`card p-5 animate-fade-in-up ${
        entry.flagged ? 'ring-2 ring-lavender-400 dark:ring-lavender-500' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">{dateStr}</span>
          <span>·</span>
          <span>{timeStr}</span>
          {entry.body_area && (
            <>
              <span>·</span>
              <span className="text-gray-400 dark:text-gray-500">{entry.body_area}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1" title={`Severity: ${entry.severity}/5`}>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`w-1.5 h-3 rounded-sm ${n <= entry.severity ? severityColor(entry.severity) : 'bg-gray-200 dark:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
          {onFlagToggle && (
            <button
              onClick={() => onFlagToggle(entry.id, !entry.flagged)}
              className={`p-1 rounded-lg transition-colors duration-200 ${
                entry.flagged
                  ? 'text-lavender-500 dark:text-lavender-400'
                  : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-400'
              }`}
              title={entry.flagged ? 'Unflag' : 'Flag as important'}
            >
              <Flag className="w-4 h-4" fill={entry.flagged ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      <p className={`text-sm text-gray-700 dark:text-gray-200 leading-relaxed ${showFull ? '' : 'line-clamp-3'}`}>
        {entry.raw_text}
      </p>
      {entry.raw_text.length > 150 && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-xs text-lavender-600 dark:text-lavender-400 mt-1 hover:underline"
        >
          {showFull ? 'Show less' : 'Show more'}
        </button>
      )}

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}
