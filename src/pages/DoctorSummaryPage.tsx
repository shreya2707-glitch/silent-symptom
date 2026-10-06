import { useEffect, useState } from 'react';
import { supabase, type Entry } from '@/lib/supabase';
import { generateDoctorSummary } from '@/lib/ai';
import { ClinicalDocument } from '@/components/ClinicalDocument';
import { useToast } from '@/components/Toast';
import { Loader2, Copy, Check, FileDown, FileText, ClipboardList, Eye } from 'lucide-react';

export function DoctorSummaryPage() {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    setShowPreview(true);
    showToast('Report generated successfully.', 'success');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    showToast('Report copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6 pb-24 md:pb-8">
      <div className="no-print animate-fade-in">
        <h1 className="page-title">Your health history, summarized.</h1>
        <p className="page-desc">Generate a professional report of your symptoms for your next doctor visit.</p>
      </div>

      {/* Action bar */}
      <div className="no-print card p-5 flex items-center gap-3 flex-wrap">
        <button
          onClick={handleGenerate}
          disabled={generating || entries.length === 0}
          className="btn-primary gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Compiling report…
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              {hasGenerated ? 'Regenerate report' : 'Generate report'}
            </>
          )}
        </button>
        {hasGenerated && !generating && (
          <>
            <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary gap-2">
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide preview' : 'Preview'}
            </button>
            <button onClick={handleCopy} className="btn-secondary gap-2">
              {copied ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy text'}
            </button>
            <button onClick={handleExportPDF} className="btn-secondary gap-2">
              <FileDown className="w-4 h-4" />
              Export as PDF
            </button>
          </>
        )}
      </div>

      {/* Empty state */}
      {entries.length === 0 && !generating && (
        <div className="no-print card p-12 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">No symptoms logged yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
              Log some symptoms first, then generate a report here for your doctor visit.
            </p>
          </div>
        </div>
      )}

      {/* Generating state */}
      {generating && (
        <div className="no-print card p-12 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Compiling your report…</p>
        </div>
      )}

      {/* Clinical document */}
      {showPreview && hasGenerated && !generating && (
        <ClinicalDocument summary={summary} entries={entries} />
      )}
    </div>
  );
}
