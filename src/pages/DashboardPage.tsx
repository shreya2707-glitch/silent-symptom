import { useEffect, useState, useMemo } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { extractFromText } from '@/lib/ai';
import { EntryCard } from '@/components/EntryCard';
import { NudgeBanner } from '@/components/NudgeBanner';
import { WeeklyComparison } from '@/components/WeeklyComparison';
import { Skeleton, EntryCardSkeleton, StatCardSkeleton } from '@/components/Skeleton';
import { PenLine, Clock, MapPin, Flame, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import type { Page } from '@/lib/types';

export function DashboardPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { displayName } = useAuth();
  const { showToast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoursSinceLast, setHoursSinceLast] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      const typed = data as Entry[];
      setEntries(typed);
      if (typed.length > 0) {
        const latest = new Date(typed[0].created_at);
        setHoursSinceLast((Date.now() - latest.getTime()) / (1000 * 60 * 60));
      } else {
        setHoursSinceLast(null);
      }
    }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = entries.filter((e) => new Date(e.created_at) >= monthStart);

    const areaFreq = new Map<string, number>();
    entries.forEach((e) => {
      if (e.body_area) areaFreq.set(e.body_area, (areaFreq.get(e.body_area) || 0) + 1);
    });
    const topArea = Array.from(areaFreq.entries()).sort((a, b) => b[1] - a[1])[0];

    const streak = computeStreak(entries);

    return {
      total: entries.length,
      thisMonthCount: thisMonth.length,
      topArea: topArea ? topArea[0] : null,
      streak,
    };
  }, [entries]);

  const recentEntries = entries.slice(0, 3);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  async function handleFlagToggle(id: string, flagged: boolean) {
    const prev = entries;
    setEntries((cur) => cur.map((e) => (e.id === id ? { ...e, flagged } : e)));
    const { error } = await supabase.from('entries').update({ flagged }).eq('id', id);
    if (error) {
      setEntries(prev);
      showToast('Could not update flag — please try again.', 'error');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 pb-24 md:pb-8">
      {/* Greeting */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          {greeting}, {displayName ?? 'there'}.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
          Here's what your symptom history is telling you.
        </p>
      </div>

      <NudgeBanner hoursSinceLastEntry={hoursSinceLast} />

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in-up">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={PenLine}
              label="Symptoms logged"
              value={stats.total.toString()}
            />
            <StatCard
              icon={Clock}
              label="This month"
              value={stats.thisMonthCount.toString()}
            />
            <StatCard
              icon={MapPin}
              label="Most frequent area"
              value={stats.topArea ?? '—'}
            />
            <StatCard
              icon={Flame}
              label="Tracking streak"
              value={stats.streak > 0 ? `${stats.streak} days` : '—'}
            />
          </>
        )}
      </div>

      {/* Quick action */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-semibold text-base">Log a new symptom</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Describe what you're experiencing in your own words.
            </p>
          </div>
          <button onClick={() => onNavigate('quicklog')} className="btn-accent gap-2">
            <PenLine className="w-4 h-4" />
            Log symptom
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekly comparison */}
      {!loading && entries.length > 0 && <WeeklyComparison entries={entries} />}

      {/* Recent entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-label">Recent entries</h2>
          {entries.length > 3 && (
            <button onClick={() => onNavigate('timeline')} className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
              View all
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            <EntryCardSkeleton />
            <EntryCardSkeleton />
          </div>
        ) : recentEntries.length === 0 ? (
          <div className="card p-8 flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">No symptoms logged yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                Your recent entries will appear here as you start tracking.
              </p>
            </div>
            <button onClick={() => onNavigate('quicklog')} className="btn-primary mt-1">
              Log your first symptom
            </button>
          </div>
        ) : (
          <div className="space-y-3 stagger">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onFlagToggle={handleFlagToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof PenLine; label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" style={{ width: 16, height: 16 }} />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-xl font-bold tabular-nums text-gray-900 dark:text-gray-50 truncate">{value}</p>
    </div>
  );
}

function computeStreak(all: Entry[]): number {
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
}
