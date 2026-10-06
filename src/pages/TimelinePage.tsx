import { useEffect, useState, useMemo } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { EntryCard } from '@/components/EntryCard';
import { EntryCardSkeleton } from '@/components/Skeleton';
import { useToast } from '@/components/Toast';
import { Filter, Search, Clock, X } from 'lucide-react';

type DateRange = 'all' | '7d' | '30d' | '90d';
type SeverityFilter = 'all' | 'low' | 'medium' | 'high';

export function TimelinePage() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [bodyAreaFilter, setBodyAreaFilter] = useState<string>('all');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setEntries(data as Entry[]);
    setLoading(false);
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((e) => e.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [entries]);

  const allBodyAreas = useMemo(() => {
    const areaSet = new Set<string>();
    entries.forEach((e) => { if (e.body_area) areaSet.add(e.body_area); });
    return Array.from(areaSet).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let result = entries;

    if (dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date(now);
      if (dateRange === '7d') cutoff.setDate(cutoff.getDate() - 7);
      else if (dateRange === '30d') cutoff.setDate(cutoff.getDate() - 30);
      else if (dateRange === '90d') cutoff.setDate(cutoff.getDate() - 90);
      result = result.filter((e) => new Date(e.created_at) >= cutoff);
    }

    if (severityFilter !== 'all') {
      result = result.filter((e) => {
        if (severityFilter === 'low') return e.severity <= 2;
        if (severityFilter === 'medium') return e.severity === 3;
        return e.severity >= 4;
      });
    }

    if (bodyAreaFilter !== 'all') {
      result = result.filter((e) => e.body_area === bodyAreaFilter);
    }

    if (filterTag !== 'all') {
      result = result.filter((e) => e.tags.includes(filterTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.raw_text.toLowerCase().includes(q));
    }

    return result;
  }, [entries, filterTag, searchQuery, dateRange, severityFilter, bodyAreaFilter]);

  // Group by week
  const grouped = useMemo(() => {
    const groups: { label: string; items: Entry[] }[] = [];
    const labelMap = new Map<string, Entry[]>();

    filtered.forEach((entry) => {
      const d = new Date(entry.created_at);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!labelMap.has(key)) labelMap.set(key, []);
      labelMap.get(key)!.push(entry);
    });

    labelMap.forEach((items, label) => {
      groups.push({ label, items });
    });

    return groups;
  }, [filtered]);

  const hasActiveFilters = filterTag !== 'all' || searchQuery.trim() || dateRange !== 'all' || severityFilter !== 'all' || bodyAreaFilter !== 'all';

  const clearFilters = () => {
    setFilterTag('all');
    setSearchQuery('');
    setDateRange('all');
    setSeverityFilter('all');
    setBodyAreaFilter('all');
  };

  const handleFlagToggle = async (id: string, flagged: boolean) => {
    const prev = entries;
    setEntries((cur) => cur.map((e) => (e.id === id ? { ...e, flagged } : e)));
    const { error } = await supabase.from('entries').update({ flagged }).eq('id', id);
    if (error) {
      setEntries(prev);
      showToast('Could not update flag — please try again.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6 pb-24 md:pb-8">
      <div className="animate-fade-in">
        <h1 className="page-title">Timeline</h1>
        <p className="page-desc">
          <span className="font-semibold tabular-nums text-gray-600 dark:text-gray-300">{entries.length}</span> {entries.length === 1 ? 'entry' : 'entries'} logged
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" style={{ width: 16, height: 16 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries by keyword…"
              className="input-field pl-9"
              aria-label="Search entries"
            />
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-ghost gap-1.5 text-xs">
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <FilterSelect
            icon={Clock}
            value={dateRange}
            onChange={(v) => setDateRange(v as DateRange)}
            options={[
              { value: 'all', label: 'All time' },
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
            ]}
            ariaLabel="Filter by date range"
          />
          <FilterSelect
            value={severityFilter}
            onChange={(v) => setSeverityFilter(v as SeverityFilter)}
            options={[
              { value: 'all', label: 'All severity' },
              { value: 'low', label: 'Low (1-2)' },
              { value: 'medium', label: 'Medium (3)' },
              { value: 'high', label: 'High (4-5)' },
            ]}
            ariaLabel="Filter by severity"
          />
          <FilterSelect
            value={bodyAreaFilter}
            onChange={setBodyAreaFilter}
            options={[
              { value: 'all', label: 'All body areas' },
              ...allBodyAreas.map((a) => ({ value: a, label: a })),
            ]}
            ariaLabel="Filter by body area"
          />
          <FilterSelect
            value={filterTag}
            onChange={setFilterTag}
            options={[
              { value: 'all', label: 'All tags' },
              ...allTags.map((t) => ({ value: t, label: t })),
            ]}
            ariaLabel="Filter by tag"
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          <EntryCardSkeleton />
          <EntryCardSkeleton />
          <EntryCardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {entries.length === 0 ? 'No symptoms logged yet' : 'No entries match your filters'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
              {entries.length === 0
                ? 'Your timeline will appear here as you record how you\'re feeling.'
                : 'Try adjusting or clearing your filters.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider tabular-nums">
                  Week of {group.label}
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">{group.items.length}</span>
              </div>
              <div className="space-y-3 stagger">
                {group.items.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} onFlagToggle={handleFlagToggle} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  icon?: typeof Filter;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ width: 14, height: 14 }} />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-field cursor-pointer text-xs py-2 pr-8 ${Icon ? 'pl-8' : 'pl-3'}`}
        aria-label={ariaLabel}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
