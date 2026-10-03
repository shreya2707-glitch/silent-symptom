import { useState } from 'react';
import type { Entry } from '@/lib/supabase';
import { TagPill } from '@/components/TagPill';
import { SeverityDots } from '@/components/SeverityDots';
import { Flag } from 'lucide-react';

export function EntryCard({ entry, onFlagToggle }: { entry: Entry; onFlagToggle?: (id: string, flagged: boolean) => void }) {
  const [showFull, setShowFull] = useState(false);
  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div
      className={`card-interactive p-5 ${
        entry.flagged ? 'ring-2 ring-lavender-400 dark:ring-lavender-500' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">{dateStr}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="tabular-nums">{timeStr}</span>
          {entry.body_area && (
            <>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-gray-400 dark:text-gray-500">{entry.body_area}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <SeverityDots severity={entry.severity} />
          {onFlagToggle && (
            <button
              onClick={() => onFlagToggle(entry.id, !entry.flagged)}
              className={`p-1 rounded-lg transition-all duration-150 ${
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
          className="text-xs text-lavender-600 dark:text-lavender-400 mt-1.5 font-medium hover:underline"
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
