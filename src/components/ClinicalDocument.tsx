import type { Entry } from '@/lib/supabase';
import { getTagCategory } from '@/lib/ai';
import { useAuth } from '@/context/AuthContext';
import { Heart } from 'lucide-react';
import { SeverityDots } from '@/components/SeverityDots';

type Section = {
  heading: string;
  items: { date: string; text: string; severity: number; tags: string[]; flagged: boolean }[];
};

export function ClinicalDocument({ summary, entries }: { summary: string; entries: Entry[] }) {
  const { displayName, condition } = useAuth();

  const now = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const avgSeverity =
    entries.length > 0
      ? (entries.reduce((s, e) => s + e.severity, 0) / entries.length).toFixed(1)
      : 'N/A';

  const flaggedCount = entries.filter((e) => e.flagged).length;

  const dateRange = (() => {
    if (entries.length === 0) return 'N/A';
    const dates = entries.map((e) => new Date(e.created_at).getTime());
    const min = new Date(Math.min(...dates)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const max = new Date(Math.max(...dates)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${min} – ${max}`;
  })();

  const sections: Section[] = (() => {
    const grouped = new Map<string, Entry[]>();
    for (const e of entries) {
      const cat = e.tags.length > 0 ? getTagCategory(e.tags[0]) : 'other';
      const label = cat === 'physical' ? 'Physical Symptoms' : cat === 'sleep' ? 'Sleep & Energy' : cat === 'mood' ? 'Mood & Mental' : 'Other Notes';
      if (!grouped.has(label)) grouped.set(label, []);
      grouped.get(label)!.push(e);
    }
    return Array.from(grouped.entries()).map(([heading, ents]) => ({
      heading,
      items: ents.map((e) => ({
        date: new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        text: e.raw_text,
        severity: e.severity,
        tags: e.tags,
        flagged: e.flagged,
      })),
    }));
  })();

  return (
    <div className="bg-white dark:bg-[#242530] rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden animate-fade-in-up printable">
      {/* Letterhead */}
      <div className="border-b-2 border-lavender-200 dark:border-lavender-800/50 px-8 py-6 flex items-center justify-between bg-lavender-50/30 dark:bg-lavender-900/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-100 to-lavender-200 dark:from-lavender-900/40 dark:to-lavender-800/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-lavender-600 dark:text-lavender-400" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Silent Symptom</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Clinical Symptom Summary</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500">Generated</p>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 tabular-nums">{now}</p>
        </div>
      </div>

      {/* Patient context */}
      <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-700/40 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Patient</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{displayName ?? '—'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Tracking</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{condition ?? 'General symptoms'}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Period</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 tabular-nums">{dateRange}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">Avg Severity</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 tabular-nums">{avgSeverity}/5</p>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="px-8 py-4 flex items-center gap-6 border-b border-gray-100 dark:border-gray-700/40 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="font-bold tabular-nums text-gray-700 dark:text-gray-200">{entries.length}</span>
          <span className="text-gray-400 dark:text-gray-500">total entries</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold tabular-nums text-lavender-600 dark:text-lavender-400">{flaggedCount}</span>
          <span className="text-gray-400 dark:text-gray-500">flagged</span>
        </div>
      </div>

      {/* Symptom sections */}
      <div className="px-8 py-6 space-y-6">
        {sections.map((section) => (
          <div key={section.heading}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-lavender-600 dark:text-lavender-400 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/40">
              {section.heading}
            </h3>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-16 pt-0.5">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">{item.date}</p>
                  </div>
                  <div className="flex-shrink-0 pt-1">
                    <SeverityDots severity={item.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                      {item.flagged && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-lavender-600 dark:text-lavender-400 bg-lavender-50 dark:bg-lavender-900/20 px-1.5 py-0.5 rounded mr-1.5">
                          FLAGGED
                        </span>
                      )}
                      {item.text}
                    </p>
                    {item.tags.length > 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {item.tags.join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/20">
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          This summary is generated from patient-reported symptom logs. It does not constitute a diagnosis.
          Please review the full log for clinical context.
        </p>
      </div>
    </div>
  );
}
