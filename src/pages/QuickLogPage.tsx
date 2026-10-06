import { useEffect, useState } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { extractFromText } from '@/lib/ai';
import { EntryCard } from '@/components/EntryCard';
import { NudgeBanner } from '@/components/NudgeBanner';
import { useToast } from '@/components/Toast';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { TagPill } from '@/components/TagPill';
import { Loader2, PenLine, Sparkles, Check, Edit3, MapPin, AlertCircle } from 'lucide-react';

const MAX_TEXT_LENGTH = 5000;
const BODY_AREAS = ['General', 'Head & Neck', 'Neck & Shoulders', 'Back', 'Chest', 'Abdomen', 'Pelvic Area', 'Joints', 'Muscles', 'Legs', 'Arms'];

type AIResult = {
  tags: string[];
  severity: number;
  bodyArea: string;
};

export function QuickLogPage() {
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hoursSinceLast, setHoursSinceLast] = useState<number | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editSeverity, setEditSeverity] = useState(3);
  const [editBodyArea, setEditBodyArea] = useState('General');
  const [editTags, setEditTags] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
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
      .select('*')
      .order('created_at', { ascending: true });

    if (allData) {
      const typed = allData as Entry[];
      if (typed.length > 0) {
        const latest = new Date(typed[typed.length - 1].created_at);
        setHoursSinceLast((Date.now() - latest.getTime()) / (1000 * 60 * 60));
      } else {
        setHoursSinceLast(null);
      }
    }
  };

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    // Simulate brief processing for UX
    setTimeout(() => {
      const { tags, severity, bodyArea } = extractFromText(text);
      const result = { tags, severity, bodyArea };
      setAiResult(result);
      setEditSeverity(severity);
      setEditBodyArea(bodyArea);
      setEditTags(tags);
      setShowPreview(true);
      setLoading(false);
    }, 500);
  };

  const handleSave = async () => {
    if (!text.trim() || !aiResult) return;
    setLoading(true);
    const { error } = await supabase.from('entries').insert({
      raw_text: text.trim(),
      tags: editTags,
      severity: editSeverity,
      body_area: editBodyArea,
      flagged: false,
    });
    setLoading(false);
    if (error) {
      showToast('Could not save your entry — please try again.', 'error');
      return;
    }
    showToast('Symptom logged successfully.', 'success');
    setText('');
    setAiResult(null);
    setShowPreview(false);
    setEditing(false);
    await fetchData();
  };

  const handleReset = () => {
    setShowPreview(false);
    setAiResult(null);
    setEditing(false);
  };

  const removeTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8 pb-24 md:pb-8">
      <NudgeBanner hoursSinceLastEntry={hoursSinceLast} />

      {/* Entry input */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight mb-1.5">How are you feeling?</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Describe what you're experiencing in your own words.
        </p>
      </div>

      <div className="card p-5">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value.slice(0, MAX_TEXT_LENGTH)); if (showPreview) handleReset(); }}
          placeholder="Describe what you're experiencing in your own words..."
          className="w-full h-36 resize-none rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#1E1E22] px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all text-sm leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500"
          maxLength={MAX_TEXT_LENGTH}
          aria-label="Symptom description"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {text.trim() ? `${text.trim().length} characters` : 'Start typing above'}
          </span>
          {!showPreview && (
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || loading}
              className="btn-primary gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze symptom
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Preview */}
      {showPreview && aiResult && (
        <div className="card p-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="font-semibold text-sm">Organized from your entry</h2>
          </div>

          {!editing ? (
            <div className="space-y-3">
              <PreviewRow label="Severity">
                <SeverityIndicator severity={aiResult.severity} showNumber size="md" />
              </PreviewRow>
              <PreviewRow label="Body area">
                <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" style={{ width: 14, height: 14 }} />
                  {aiResult.bodyArea}
                </span>
              </PreviewRow>
              <PreviewRow label="Relevant tags">
                <div className="flex flex-wrap gap-1.5">
                  {aiResult.tags.length > 0 ? (
                    aiResult.tags.map((tag) => <TagPill key={tag} tag={tag} />)
                  ) : (
                    <span className="text-sm text-gray-400">No tags detected</span>
                  )}
                </div>
              </PreviewRow>

              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed flex items-start gap-1.5 pt-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ width: 14, height: 14 }} />
                AI-generated organization may be imperfect. Review before saving.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => setEditing(true)} className="btn-secondary gap-2">
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button onClick={handleSave} disabled={loading} className="btn-primary gap-2 flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {loading ? 'Saving…' : 'Save entry'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Edit severity */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Severity</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={editSeverity}
                    onChange={(e) => setEditSeverity(Number(e.target.value))}
                    className="flex-1 accent-brand-500"
                    aria-label="Severity level"
                  />
                  <span className="text-sm font-semibold tabular-nums w-10 text-right">{editSeverity}/5</span>
                </div>
              </div>

              {/* Edit body area */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Body area</label>
                <select
                  value={editBodyArea}
                  onChange={(e) => setEditBodyArea(e.target.value)}
                  className="input-field cursor-pointer"
                  aria-label="Body area"
                >
                  {BODY_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              {/* Edit tags */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {editTags.length > 0 ? (
                    editTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => removeTag(tag)}
                        className="pill pill-other hover:opacity-70 transition-opacity"
                      >
                        {tag}
                        <span className="ml-1 text-gray-400">×</span>
                      </button>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No tags</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => setEditing(false)} className="btn-secondary">
                  Done editing
                </button>
                <button onClick={handleSave} disabled={loading} className="btn-primary gap-2 flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {loading ? 'Saving…' : 'Save entry'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent entries */}
      <div className="space-y-4">
        <h2 className="section-label">Recent entries</h2>
        {entries.length === 0 ? (
          <div className="card p-8 flex flex-col items-center text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">No symptoms logged yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                Your recent entries will appear here as you record how you're feeling.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 stagger">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onFlagToggle={handleFlagToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  async function handleFlagToggle(id: string, flagged: boolean) {
    const prev = entries;
    setEntries((cur) => cur.map((e) => (e.id === id ? { ...e, flagged } : e)));
    const { error } = await supabase.from('entries').update({ flagged }).eq('id', id);
    if (error) {
      setEntries(prev);
      showToast('Could not update flag — please try again.', 'error');
    }
  }
}

function PreviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0 w-24 pt-1">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
