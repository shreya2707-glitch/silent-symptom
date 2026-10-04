import { useEffect, useState, useMemo } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { EntryCard } from '@/components/EntryCard';
import { Filter, Search, Clock } from 'lucide-react';

export function TimelinePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filtered = useMemo(() => {
    let result = entries;
    if (filterTag !== 'all') {
      result = result.filter((e) => e.tags.includes(filterTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.raw_text.toLowerCase().includes(q));
    }
    return result;
  }, [entries, filterTag, searchQuery]);

  const handleFlagToggle = async (id: string, flagged: boolean) => {
    const prev = entries;
    setEntries((cur) => cur.map((e) => (e.id === id ? { ...e, flagged } : e)));
    const { error } = await supabase.from('entries').update({ flagged }).eq('id', id);
    if (error) {
      setEntries(prev);
      console.error('Failed to update flag:', error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="page-title">Timeline</h1>
        <p className="page-desc">
          <span className="font-semibold tabular-nums text-gray-600 dark:text-gray-300">{entries.length}</span> {entries.length === 1 ? 'entry' : 'entries'} logged
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by keyword…"
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="all">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-300 dark:text-gray-500 animate-pulse" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading entries…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-300 dark:text-gray-500" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {searchQuery.trim()
              ? `No entries matching "${searchQuery}".`
              : filterTag !== 'all'
                ? `No entries with tag "${filterTag}".`
                : 'No entries yet. Log your first symptom on Quick Log.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onFlagToggle={handleFlagToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
