import { useEffect, useState, useMemo } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { getTagCategory } from '@/lib/ai';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';

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

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const lineColor = isDark ? '#b07aff' : '#9550f5';
  const barColor = isDark ? '#5eead4' : '#14b8a6';

  const tagCategoryColor: Record<string, string> = {
    physical: isDark ? '#60a5fa' : '#3b82f6',
    sleep: isDark ? '#facc15' : '#eab308',
    mood: isDark ? '#c084fc' : '#a855f7',
    other: isDark ? '#9ca3af' : '#6b7280',
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Trends and patterns across your {entries.length} logged {entries.length === 1 ? 'entry' : 'entries'}.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No data to analyze yet. Log some symptoms to see your trends here.
          </p>
        </div>
      ) : (
        <>
          <div className="card p-6 animate-fade-in">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Severity Over Time
            </h2>
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

          <div className="card p-6 animate-fade-in">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Entries Per Day
            </h2>
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

          <div className="card p-6 animate-fade-in">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Most Common Symptoms
            </h2>
            <div className="space-y-2.5">
              {tagRanking.map(([tag, count]) => {
                const category = getTagCategory(tag);
                const color = tagCategoryColor[category];
                const pct = (count / maxTagCount) * 100;
                return (
                  <div key={tag} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 dark:text-gray-200 w-32 truncate">{tag}</span>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700/40 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{count}x</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
