import { useEffect, useState, useMemo } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { getTagCategory } from '@/lib/ai';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { BodyMap } from '@/components/BodyMap';
import { WeeklyComparison } from '@/components/WeeklyComparison';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function InsightsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setEntries(data as Entry[]);
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
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [entries]);

  const maxTagCount = Math.max(...tagRanking.map((t) => t[1]), 1);

  const heroStat = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = entries.filter((e) => new Date(e.created_at) >= monthStart);

    const last7 = entries.filter((e) => {
      const d = new Date(e.created_at);
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      return d >= cutoff;
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
      last7Avg: last7Avg > 0 ? last7Avg.toFixed(1) : '—',
      trend,
      trendDiff: Math.abs(trendDiff).toFixed(1),
    };
  }, [entries]);

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const lineColor = isDark ? '#a87fcd' : '#8b5db8';
  const barColor = isDark ? '#5eead4' : '#14b8a6';

  const tagCategoryColor: Record<string, string> = {
    physical: isDark ? '#60a5fa' : '#3b82f6',
    sleep: isDark ? '#facc15' : '#ca9a1e',
    mood: isDark ? '#c084fc' : '#9558c7',
    other: isDark ? '#9ca3af' : '#6b7280',
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="page-title">Insights</h1>
        <p className="page-desc">
          Trends and patterns across your <span className="font-semibold tabular-nums text-gray-600 dark:text-gray-300">{entries.length}</span> logged {entries.length === 1 ? 'entry' : 'entries'}.
        </p>
      </div>

      {entries.length > 0 && (
        <div className="card p-6 animate-fade-in flex items-center gap-6 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold tabular-nums text-lavender-600 dark:text-lavender-400 tracking-tight">
              {heroStat.monthCount}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {heroStat.monthCount === 1 ? 'entry' : 'entries'} this month
            </span>
          </div>
          <div className="h-10 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">7-day avg severity</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tabular-nums text-gray-800 dark:text-gray-100">
                {heroStat.last7Avg}
              </span>
              {heroStat.trend !== 'stable' && heroStat.last7Avg !== '—' && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  heroStat.trend === 'down'
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
                    : 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30'
                }`}>
                  {heroStat.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {heroStat.trendDiff}
                </span>
              )}
              {heroStat.trend === 'stable' && heroStat.last7Avg !== '—' && (
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/40">
                  <Minus className="w-3 h-3" />
                  stable
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-gray-300 dark:text-gray-500" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">No data to analyze yet.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Log some symptoms to see your trends here.</p>
        </div>
      ) : (
        <div className="space-y-6 stagger">
          <WeeklyComparison entries={entries} />

          <div className="card p-6">
            <h2 className="section-header mb-4">Body Map</h2>
            <BodyMap entries={entries} />
          </div>

          <div className="card p-6">
            <h2 className="section-header mb-4">Severity Over Time</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#242530' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#e5e7eb' : '#374151',
                  }}
                  labelStyle={{ color: axisColor }}
                />
                <Line
                  type="monotone"
                  dataKey="severity"
                  stroke={lineColor}
                  strokeWidth={2.5}
                  dot={{ fill: lineColor, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h2 className="section-header mb-4">Entries Per Day</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#242530' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: isDark ? '#e5e7eb' : '#374151',
                  }}
                  labelStyle={{ color: axisColor }}
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                />
                <Bar dataKey="count" fill={barColor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <h2 className="section-header mb-4">Most Common Symptoms</h2>
            <div className="space-y-2.5">
              {tagRanking.map(([tag, count]) => {
                const category = getTagCategory(tag);
                const color = tagCategoryColor[category];
                const pct = (count / maxTagCount) * 100;
                return (
                  <div key={tag} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-gray-200 w-32 truncate font-medium">{tag}</span>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700/40 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right font-semibold tabular-nums">{count}x</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
