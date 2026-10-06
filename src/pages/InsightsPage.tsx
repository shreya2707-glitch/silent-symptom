import { useEffect, useState, useMemo } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { getTagCategory } from '@/lib/ai';
import { StatCardSkeleton } from '@/components/Skeleton';
import { BodyMap } from '@/components/BodyMap';
import { WeeklyComparison } from '@/components/WeeklyComparison';
import { useTheme } from '@/context/ThemeContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { BarChart3, Activity, MapPin, Calendar, Hash } from 'lucide-react';

export function InsightsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setEntries(data as Entry[]);
    setLoading(false);
  };

  const chartData = useMemo(() => {
    const byDate = new Map<string, { date: string; severity: number; count: number }>();
    entries.forEach((e) => {
      const d = new Date(e.created_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = byDate.get(key);
      if (existing) {
        existing.severity = (existing.severity * existing.count + e.severity) / (existing.count + 1);
        existing.count += 1;
      } else {
        byDate.set(key, { date: key, severity: e.severity, count: 1 });
      }
    });
    return Array.from(byDate.values()).map((d) => ({
      date: d.date,
      severity: Math.round(d.severity * 10) / 10,
      count: d.count,
    }));
  }, [entries]);

  const tagRanking = useMemo(() => {
    const freq = new Map<string, number>();
    entries.forEach((e) => e.tags.forEach((t) => freq.set(t, (freq.get(t) || 0) + 1)));
    return Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [entries]);

  const maxTagCount = Math.max(...tagRanking.map((t) => t[1]), 1);

  const patterns = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = entries.filter((e) => new Date(e.created_at) >= monthStart);

    const tagFreq = new Map<string, number>();
    entries.forEach((e) => e.tags.forEach((t) => tagFreq.set(t, (tagFreq.get(t) || 0) + 1)));
    const topTag = Array.from(tagFreq.entries()).sort((a, b) => b[1] - a[1])[0];

    const areaFreq = new Map<string, number>();
    entries.forEach((e) => {
      if (e.body_area) areaFreq.set(e.body_area, (areaFreq.get(e.body_area) || 0) + 1);
    });
    const topArea = Array.from(areaFreq.entries()).sort((a, b) => b[1] - a[1])[0];

    const avgSeverity = entries.length > 0
      ? (entries.reduce((s, e) => s + e.severity, 0) / entries.length).toFixed(1)
      : '—';

    const last7 = entries.filter((e) => {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      return new Date(e.created_at) >= cutoff;
    });
    const prev7 = entries.filter((e) => {
      const d = new Date(e.created_at);
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      const prevCutoff = new Date(now);
      prevCutoff.setDate(prevCutoff.getDate() - 14);
      return d < cutoff && d >= prevCutoff;
    });

    const last7Avg = last7.length > 0 ? last7.reduce((s, e) => s + e.severity, 0) / last7.length : 0;
    const prev7Avg = prev7.length > 0 ? prev7.reduce((s, e) => s + e.severity, 0) / prev7.length : 0;
    const trendDiff = last7Avg - prev7Avg;
    const trend: 'up' | 'down' | 'stable' = Math.abs(trendDiff) < 0.3 ? 'stable' : trendDiff > 0 ? 'up' : 'down';

    return {
      monthCount: thisMonth.length,
      topTag: topTag ? { tag: topTag[0], count: topTag[1] } : null,
      topArea: topArea ? { area: topArea[0], count: topArea[1] } : null,
      avgSeverity,
      trend,
      trendDiff: Math.abs(trendDiff).toFixed(1),
      last7Avg: last7Avg > 0 ? last7Avg.toFixed(1) : '—',
    };
  }, [entries]);

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#27272A' : '#f3f4f6';
  const lineColor = isDark ? '#818cf8' : '#6366f1';
  const barColor = isDark ? '#818cf8' : '#6366f1';

  const tagCategoryColor: Record<string, string> = {
    physical: isDark ? '#60a5fa' : '#3b82f6',
    sleep: isDark ? '#facc15' : '#ca9a1e',
    mood: isDark ? '#a78bfa' : '#7c3aed',
    other: isDark ? '#9ca3af' : '#6b7280',
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 pb-24 md:pb-8">
        <div>
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-48" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 pb-24 md:pb-8">
      <div className="animate-fade-in">
        <h1 className="page-title">Patterns in your history</h1>
        <p className="page-desc">
          Factual observations from your <span className="font-semibold tabular-nums text-gray-600 dark:text-gray-300">{entries.length}</span> logged {entries.length === 1 ? 'entry' : 'entries'}.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="card p-12 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">No patterns to show yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
              Log a few symptoms and your patterns will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pattern observations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up">
            {patterns.topTag && (
              <PatternCard
                icon={Hash}
                label="Most frequent symptom"
                value={patterns.topTag.tag}
                detail={`Logged ${patterns.topTag.count} times`}
              />
            )}
            {patterns.topArea && (
              <PatternCard
                icon={MapPin}
                label="Most affected body area"
                value={patterns.topArea.area}
                detail={`${patterns.topArea.count} entries`}
              />
            )}
            <PatternCard
              icon={Activity}
              label="Average severity"
              value={`${patterns.avgSeverity}/5`}
              detail={
                patterns.trend === 'stable'
                  ? 'Stable over the past week'
                  : `${patterns.trend === 'up' ? 'Up' : 'Down'} ${patterns.trendDiff} vs last week`
              }
            />
            <PatternCard
              icon={Calendar}
              label="Entries this month"
              value={patterns.monthCount.toString()}
              detail={`7-day avg: ${patterns.last7Avg}/5`}
            />
          </div>

          {/* Weekly comparison */}
          <WeeklyComparison entries={entries} />

          {/* Body map */}
          <div className="card p-6">
            <h2 className="section-label mb-4">Body areas</h2>
            <BodyMap entries={entries} />
          </div>

          {/* Severity over time */}
          <div className="card p-6">
            <h2 className="section-label mb-4">Severity over time</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E1E22' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#e5e7eb' : '#374151',
                  }}
                  labelStyle={{ color: axisColor }}
                />
                <Line type="monotone" dataKey="severity" stroke={lineColor} strokeWidth={2} dot={{ fill: lineColor, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Entries per day */}
          <div className="card p-6">
            <h2 className="section-label mb-4">Entries per day</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E1E22' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: isDark ? '#e5e7eb' : '#374151',
                  }}
                  labelStyle={{ color: axisColor }}
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                />
                <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Most common symptoms */}
          {tagRanking.length > 0 && (
            <div className="card p-6">
              <h2 className="section-label mb-4">Most common symptoms</h2>
              <div className="space-y-2.5">
                {tagRanking.map(([tag, count]) => {
                  const category = getTagCategory(tag);
                  const color = tagCategoryColor[category];
                  const pct = (count / maxTagCount) * 100;
                  return (
                    <div key={tag} className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 dark:text-gray-200 w-28 truncate font-medium">{tag}</span>
                      <div className="flex-1 h-5 bg-gray-50 dark:bg-gray-800/50 rounded-md overflow-hidden">
                        <div
                          className="h-full rounded-md transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right font-semibold tabular-nums">{count}x</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PatternCard({ icon: Icon, label, value, detail }: { icon: typeof Activity; label: string; value: string; detail: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" style={{ width: 16, height: 16 }} />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-50 truncate">{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{detail}</p>
    </div>
  );
}
