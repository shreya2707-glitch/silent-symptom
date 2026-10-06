import { useMemo } from 'react';
import type { Entry } from '@/lib/supabase';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function WeeklyComparison({ entries }: { entries: Entry[] }) {
  const comparison = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - 6);
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);

    const thisWeek = entries.filter((e) => {
      const d = new Date(e.created_at);
      return d >= thisWeekStart && d <= now;
    });
    const lastWeek = entries.filter((e) => {
      const d = new Date(e.created_at);
      return d >= lastWeekStart && d <= lastWeekEnd;
    });

    const avgSeverity = (arr: Entry[]) =>
      arr.length > 0 ? arr.reduce((s, e) => s + e.severity, 0) / arr.length : 0;

    const thisAvg = avgSeverity(thisWeek);
    const lastAvg = avgSeverity(lastWeek);

    const severityDiff = thisAvg - lastAvg;
    const severityTrend: 'up' | 'down' | 'stable' =
      Math.abs(severityDiff) < 0.3 ? 'stable' : severityDiff > 0 ? 'up' : 'down';

    const countDiff = thisWeek.length - lastWeek.length;
    const countTrend: 'up' | 'down' | 'stable' =
      countDiff === 0 ? 'stable' : countDiff > 0 ? 'up' : 'down';

    return {
      thisAvg: thisAvg > 0 ? thisAvg.toFixed(1) : '—',
      lastAvg: lastAvg > 0 ? lastAvg.toFixed(1) : '—',
      thisCount: thisWeek.length,
      lastCount: lastWeek.length,
      severityTrend,
      countTrend,
      severityDiff: Math.abs(severityDiff).toFixed(1),
      countDiff: Math.abs(countDiff),
    };
  }, [entries]);

  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', label: 'worsening' },
    down: { icon: TrendingDown, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-50 dark:bg-success-950/30', label: 'improving' },
    stable: { icon: Minus, color: 'text-gray-400 dark:text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800/50', label: 'stable' },
  };

  const sevCfg = trendConfig[comparison.severityTrend];
  const cntCfg = trendConfig[comparison.countTrend];
  const SevIcon = sevCfg.icon;
  const CntIcon = cntCfg.icon;

  return (
    <div className="card p-5 animate-fade-in">
      <h2 className="section-label mb-4">This week vs last week</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Avg severity</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tabular-nums text-gray-900 dark:text-gray-50">
              {comparison.thisAvg}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">/ 5</span>
          </div>
          <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${sevCfg.bg} ${sevCfg.color}`}>
            <SevIcon className="w-3 h-3" style={{ width: 12, height: 12 }} />
            {comparison.severityTrend === 'stable' ? 'stable' : `${comparison.severityDiff} ${sevCfg.label}`}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
            Last week: {comparison.lastAvg}/5
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Entries logged</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tabular-nums text-gray-900 dark:text-gray-50">
              {comparison.thisCount}
            </span>
          </div>
          <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${cntCfg.bg} ${cntCfg.color}`}>
            <CntIcon className="w-3 h-3" style={{ width: 12, height: 12 }} />
            {comparison.countTrend === 'stable' ? 'stable' : `${comparison.countDiff} ${comparison.countTrend === 'up' ? 'more' : 'fewer'}`}
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
            Last week: {comparison.lastCount}
          </p>
        </div>
      </div>
    </div>
  );
}
