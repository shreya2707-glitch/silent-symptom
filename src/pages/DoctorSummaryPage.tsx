import { useEffect, useState } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { generateDoctorSummary } from '@/lib/ai';
import { ClinicalDocument } from '@/components/ClinicalDocument';
import { Loader2, Copy, Check, FileDown, FileText, ClipboardList } from 'lucide-react';

export function DoctorSummaryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setEntries(data as Entry[]);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const result = await generateDoctorSummary(entries);
    setSummary(result);
    setGenerating(false);
    setHasGenerated(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div className="no-print">
        <h1 className="page-title">Doctor Summary</h1>
        <p className="page-desc">Generate a clinical-style summary of your symptoms for your next doctor visit.</p>
      </div>

      <div className="no-print flex items-center gap-3 flex-wrap">
        <button
          onClick={handleGenerate}
          disabled={generating || entries.length === 0}
          className="btn-accent flex items-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Compiling your summary…
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              {hasGenerated ? 'Regenerate Summary' : 'Generate Doctor Summary'}
            </>
          )}
        </button>
        {hasGenerated && !generating && (
          <>
            <button onClick={handleCopy} className="btn-secondary flex items-center gap-2">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
            <button onClick={handleExportPDF} className="btn-secondary flex items-center gap-2">
              <FileDown className="w-4 h-4" />
              Export as PDF
            </button>
          </>
        )}
      </div>

      {entries.length === 0 && !generating && (
        <div className="empty-state no-print">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-gray-300 dark:text-gray-500" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">No symptom entries yet.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Log some symptoms first, then generate a summary here.</p>
        </div>
      )}

      {generating && (
        <div className="empty-state no-print animate-fade-in">
          <Loader2 className="w-6 h-6 animate-spin text-lavender-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Compiling your summary…</p>
        </div>
      )}

      {hasGenerated && !generating && (
        <ClinicalDocument summary={summary} entries={entries} />
      )}
    </div>
  );
}
