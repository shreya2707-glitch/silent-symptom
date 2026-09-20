import type { Entry } from './supabase';

type AIExtractResult = {
  tags: string[];
  severity: number;
  bodyArea: string;
};

const FALLBACK_KEYWORDS: Record<string, string[]> = {
  pain: ['pain', 'ache', 'sore', 'tender', 'cramp', 'cramping', 'throbbing', 'stabbing', 'burning', 'sharp', 'dull'],
  sleep: ['sleep', 'tired', 'fatigue', 'exhausted', 'insomnia', 'restless', 'woke up', 'drowsy', 'nap', 'energy'],
  mood: ['anxious', 'anxiety', 'depressed', 'sad', 'mood', 'irritable', 'stress', 'stressed', 'overwhelmed', 'brain fog', 'foggy', 'cry', 'tearful', 'hopeless', 'worried', 'panic'],
  gi: ['nausea', 'nauseous', 'bloating', 'bloated', 'constipation', 'diarrhea', 'stomach', 'cramp', 'digestive', 'bowel', 'gas', 'indigestion'],
  head: ['headache', 'migraine', 'dizzy', 'dizziness', 'lightheaded', 'head', 'vision', 'blurry'],
  body: ['joint', 'muscle', 'back', 'neck', 'shoulder', 'leg', 'arm', 'hip', 'pelvic', 'pelvis', 'abdomen', 'abdominal', 'chest'],
};

const BODY_AREAS: Record<string, string> = {
  head: 'Head & Neck',
  headache: 'Head & Neck',
  migraine: 'Head & Neck',
  dizzy: 'Head & Neck',
  dizziness: 'Head & Neck',
  lightheaded: 'Head & Neck',
  vision: 'Head & Neck',
  blurry: 'Head & Neck',
  neck: 'Neck & Shoulders',
  shoulder: 'Neck & Shoulders',
  back: 'Back',
  chest: 'Chest',
  stomach: 'Abdomen',
  abdomen: 'Abdomen',
  abdominal: 'Abdomen',
  pelvic: 'Pelvic Area',
  pelvis: 'Pelvic Area',
  hip: 'Pelvic Area',
  joint: 'Joints',
  muscle: 'Muscles',
  leg: 'Legs',
  arm: 'Arms',
  bowel: 'Abdomen',
  gas: 'Abdomen',
};

function classifyTag(tag: string): 'physical' | 'sleep' | 'mood' | 'other' {
  const lower = tag.toLowerCase();
  for (const kw of FALLBACK_KEYWORDS.sleep) {
    if (lower.includes(kw)) return 'sleep';
  }
  for (const kw of FALLBACK_KEYWORDS.mood) {
    if (lower.includes(kw)) return 'mood';
  }
  for (const kw of [...FALLBACK_KEYWORDS.pain, ...FALLBACK_KEYWORDS.gi, ...FALLBACK_KEYWORDS.head, ...FALLBACK_KEYWORDS.body]) {
    if (lower.includes(kw)) return 'physical';
  }
  return 'other';
}

export function getTagCategory(tag: string): 'physical' | 'sleep' | 'mood' | 'other' {
  return classifyTag(tag);
}

export function extractFromText(text: string): AIExtractResult {
  const lower = text.toLowerCase();
  const tagSet = new Set<string>();

  for (const [category, keywords] of Object.entries(FALLBACK_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        tagSet.add(category === 'head' ? 'headache' : kw);
      }
    }
  }

  const tags = Array.from(tagSet).slice(0, 8);

  let maxSeverity = 3;
  if (/\b(severe|excruciating|unbearable|10\/10|9\/10|extreme|agonizing)\b/.test(lower)) maxSeverity = 5;
  else if (/\b(moderate|bothersome|4\/10|5\/10|6\/10|7\/10|significant)\b/.test(lower)) maxSeverity = 4;
  else if (/\b(mild|slight|2\/10|3\/10|minor)\b/.test(lower)) maxSeverity = 2;
  else if (/\b(barely|noticeable|1\/10|barely noticeable)\b/.test(lower)) maxSeverity = 1;

  let bodyArea = 'General';
  for (const [kw, area] of Object.entries(BODY_AREAS)) {
    if (lower.includes(kw)) {
      bodyArea = area;
      break;
    }
  }

  return { tags, severity: maxSeverity, bodyArea };
}

export async function generateDoctorSummary(entries: Entry[]): Promise<string> {
  if (entries.length === 0) {
    return 'No symptom entries logged yet. Start logging your daily symptoms on the Quick Log page, then generate a summary for your doctor visit.';
  }

  const flagged = entries.filter((e) => e.flagged);
  const unflagged = entries.filter((e) => !e.flagged);
  const ordered = [...flagged, ...unflagged];

  const entryLines = ordered
    .map((e) => {
      const date = new Date(e.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const tagStr = e.tags.length > 0 ? ` [Tags: ${e.tags.join(', ')}]` : '';
      const flagStr = e.flagged ? ' ⚑ FLAGGED' : '';
      return `${date} (Severity ${e.severity}/5)${flagStr}${tagStr}: ${e.raw_text}`;
    })
    .join('\n');

  const tagFrequency = new Map<string, number>();
  for (const e of entries) {
    for (const t of e.tags) {
      tagFrequency.set(t, (tagFrequency.get(t) || 0) + 1);
    }
  }
  const topTags = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => `${tag} (${count}x)`)
    .join(', ');

  const avgSeverity =
    entries.length > 0
      ? (entries.reduce((s, e) => s + e.severity, 0) / entries.length).toFixed(1)
      : 'N/A';

  const flaggedCount = flagged.length;

  const dateRange = (() => {
    if (entries.length === 0) return 'N/A';
    const dates = entries.map((e) => new Date(e.created_at).getTime());
    const min = new Date(Math.min(...dates)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const max = new Date(Math.max(...dates)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${min} – ${max}`;
  })();

  return `CLINICAL SYMPTOM SUMMARY
Prepared for doctor visit | Silent Symptom app

═══════════════════════════════════════════

OVERVIEW
• Logging period: ${dateRange}
• Total entries: ${entries.length}
• Average severity: ${avgSeverity}/5
• Flagged entries (patient-prioritized): ${flaggedCount}

FLAGGED / HIGH-PRIORITY SYMPTOMS
${flagged.length > 0
      ? flagged
          .map((e) => `• ${new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${e.raw_text.slice(0, 120)}${e.raw_text.length > 120 ? '…' : ''}`)
          .join('\n')
      : '• None flagged by patient'}

RECURRING SYMPTOMS (by frequency)
${topTags ? `• ${topTags}` : '• No tags extracted'}

SEVERITY TRENDS
• Average severity across all entries: ${avgSeverity}/5
• Highest severity reported: ${Math.max(...entries.map((e) => e.severity))}/5
• Lowest severity reported: ${Math.min(...entries.map((e) => e.severity))}/5

FULL SYMPTOM LOG
${entryLines}

═══════════════════════════════════════════
Note: This summary is generated from patient-reported symptom logs. It does not constitute a diagnosis. Please review the full log for clinical context.`;
}
