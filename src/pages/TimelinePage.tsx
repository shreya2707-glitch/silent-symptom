import { useEffect, useState, useMemo } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { EntryCard } from '@/components/EntryCard';
import { Filter, Search } from 'lucide-react';

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
    await supabase.from('entries').update({ flagged }).eq('id', id);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, flagged } : e)));
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Timeline</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} logged
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by keyword…"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-[#1A1B23] pl-9 pr-4 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-[#1A1B23] px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-lavender-400 transition-all"
          >
            <option value="all">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading entries…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {searchQuery.trim()
              ? `No entries matching "${searchQuery}".`
              : filterTag !== 'all'
                ? `No entries with tag "${filterTag}".`
                : 'No entries yet. Log your first symptom on Quick Log.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onFlagToggle={handleFlagToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
