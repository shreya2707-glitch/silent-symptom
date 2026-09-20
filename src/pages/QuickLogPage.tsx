import { useEffect, useState } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { extractFromText } from '@/lib/ai';
import { EntryCard } from '@/components/EntryCard';
import { Loader2, Flame, Sparkles } from 'lucide-react';

export function QuickLogPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [streak, setStreak] = useState(0);
  const [sparkline, setSparkline] = useState<number[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchData();
    if (!localStorage.getItem('silent-symptom-onboarded')) {
      setShowTooltip(true);
    }
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setEntries(data as Entry[]);

    const { data: allData } = await supabase
      .from('entries')
      .select('created_at, severity')
      .order('created_at', { ascending: true });

    if (allData) {
      const last7 = computeLast7Days(allData as Pick<Entry, 'created_at' | 'severity'>[]);
      setSparkline(last7);
      setStreak(computeStreak(allData as Pick<Entry, 'created_at'>[]));
    }
  };

  const computeLast7Days = (all: Pick<Entry, 'created_at' | 'severity'>[]): number[] => {
    const days: number[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const dayEntries = all.filter((e) => {
        const d = new Date(e.created_at);
        return d >= day && d < next;
      });
      if (dayEntries.length === 0) days.push(0);
      else days.push(Math.round(dayEntries.reduce((s, e) => s + e.severity, 0) / dayEntries.length));
    }
    return days;
  };

  const computeStreak = (all: Pick<Entry, 'created_at'>[]): number => {
    const days = new Set(
      all.map((e) => {
        const d = new Date(e.created_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );
    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (days.has(cursor.getTime())) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  };

  const handleLog = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const { tags, severity, bodyArea } = extractFromText(text);
    const { data, error } = await supabase
      .from('entries')
      .insert({
        raw_text: text.trim(),
        tags,
        severity,
        body_area: bodyArea,
        flagged: false,
      })
      .select()
      .single();
    setLoading(false);
    if (error) return;
    setText('');
    await fetchData();
  };

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('silent-symptom-onboarded', 'true');
  };

  const maxSpark = Math.max(...sparkline, 1);

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">How are you feeling today?</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Write freely — we'll organize the details.</p>
        </div>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full text-sm font-medium animate-fade-in">
              <Flame className="w-4 h-4" />
              <span>{streak}-day streak</span>
            </div>
          )}
          <div className="flex items-end gap-1 h-8" title="7-day severity trend">
            {sparkline.map((val, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-lavender-300 dark:bg-lavender-400 transition-all duration-300"
                style={{ height: `${Math.max((val / maxSpark) * 100, 8)}%`, minHeight: '4px' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6 relative">
        {showTooltip && (
          <div className="absolute -top-2 left-6 -translate-y-full z-10 animate-slide-in">
            <div className="bg-gray-800 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg">
              <p className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                Just write naturally — we'll organize the details for you.
              </p>
              <div className="absolute -bottom-1 left-6 w-2 h-2 bg-gray-800 dark:bg-gray-700 rotate-45" />
            </div>
            <button
              onClick={dismissTooltip}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-gray-500"
            >
              ×
            </button>
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="My lower back has been aching since I woke up. Felt a sharp pinch when bending over..."
          className="w-full h-32 resize-none rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-[#1A1B23] px-4 py-3 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-lavender-400 transition-all text-sm leading-relaxed"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {text.trim() ? `${text.trim().length} characters` : 'Start typing above'}
          </span>
          <button
            onClick={handleLog}
            disabled={!text.trim() || loading}
            className="btn-accent flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing your entry…
              </>
            ) : (
              'Log it'
            )}
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Recent entries</h2>
        {entries.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">No entries yet. Log your first symptom above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onFlagToggle={handleFlagToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  async function handleFlagToggle(id: string, flagged: boolean) {
    await supabase.from('entries').update({ flagged }).eq('id', id);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, flagged } : e)));
  }
}
