import { useState } from 'react';
import type { Entry } from '@/lib/supabase';
import { TagPill } from '@/components/TagPill';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { Flag, MapPin } from 'lucide-react';

export function EntryCard({ entry, onFlagToggle }: { entry: Entry; onFlagToggle?: (id: string, flagged: boolean) => void }) {
  const [showFull, setShowFull] = useState(false);
  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="group relative pl-5">
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1E1E22] bg-gray-300 dark:bg-gray-600 transition-colors duration-200 group-hover:bg-brand-400 dark:group-hover:bg-brand-500" />

      <div className={`card p-4 transition-all duration-200 ${entry.flagged ? 'ring-1 ring-brand-300 dark:ring-brand-700' : ''}`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-200 tabular-nums">{dateStr}</span>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="tabular-nums">{timeStr}</span>
          </div>
          <div className="flex items-center gap-3">
            <SeverityIndicator severity={entry.severity} showNumber size="sm" />
            {onFlagToggle && (
              <button
                onClick={() => onFlagToggle(entry.id, !entry.flagged)}
                className={`p-1 rounded-md transition-all duration-150 ${
                  entry.flagged
                    ? 'text-brand-500 dark:text-brand-400'
                    : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100'
                }`}
                title={entry.flagged ? 'Unflag' : 'Flag as important'}
                aria-label={entry.flagged ? 'Unflag this entry' : 'Flag this entry as important'}
                aria-pressed={entry.flagged}
              >
                <Flag className="w-3.5 h-3.5" fill={entry.flagged ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>

        <p className={`text-sm text-gray-700 dark:text-gray-200 leading-relaxed ${showFull ? '' : 'line-clamp-3'}`}>
          {entry.raw_text}
        </p>
        {entry.raw_text.length > 200 && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-xs text-brand-600 dark:text-brand-400 mt-1.5 font-medium hover:underline"
          >
            {showFull ? 'Show less' : 'Show more'}
          </button>
        )}

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {entry.body_area && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3" style={{ width: 12, height: 12 }} />
              {entry.body_area}
            </span>
          )}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
