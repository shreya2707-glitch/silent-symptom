import { Heart, PenLine, Sparkles, FileText, ArrowRight, Activity, Moon, Cloud } from 'lucide-react';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { TagPill } from '@/components/TagPill';

type LandingPageProps = {
  onGetStarted: () => void;
  onLearnMore: () => void;
  hasSession: boolean;
};

export function LandingPage({ onGetStarted, onLearnMore, hasSession }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#18181B] text-gray-900 dark:text-gray-50">
      {/* Nav bar */}
      <nav className="border-b border-gray-100 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white dark:text-gray-900" fill="currentColor" />
            </div>
            <span className="font-bold text-base tracking-tight">Silent Symptom</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLearnMore} className="btn-ghost hidden sm:inline-flex">
              How it works
            </button>
            <button onClick={onGetStarted} className="btn-primary">
              {hasSession ? 'Go to dashboard' : 'Start tracking'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-gray-900 dark:text-gray-50">
              Your symptoms tell a story.
              <br />
              <span className="text-gray-400 dark:text-gray-500">Make it easier to see.</span>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
              Describe how you're feeling naturally. Silent Symptom organizes your symptoms, tracks patterns over time, and turns your history into a concise summary you can take to your doctor.
            </p>
            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <button onClick={onGetStarted} className="btn-primary gap-2 text-base px-6 py-3">
                Start tracking
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onLearnMore} className="btn-secondary text-base px-6 py-3">
                See how it works
              </button>
            </div>
            <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-md">
              Designed to organize your health history — not diagnose or replace medical advice.
            </p>
          </div>

          {/* Product preview */}
          <div className="animate-fade-in-up animation-delay-100">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-100 dark:border-gray-800/60 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureStep
              icon={PenLine}
              step="01"
              title="Describe how you feel"
              desc="Write in your own words — no forms or checkboxes. Just type what you're experiencing."
            />
            <FeatureStep
              icon={Sparkles}
              step="02"
              title="We organize it"
              desc="Your entries are automatically tagged, categorized by body area, and rated for severity."
            />
            <FeatureStep
              icon={FileText}
              step="03"
              title="Share with your doctor"
              desc="Generate a clean clinical summary in one click. Flag what matters most for your visit."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 dark:border-gray-800/60 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">Start tracking your symptoms today</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            It takes less than a minute to create an account. Your data stays private and secure.
          </p>
          <button onClick={onGetStarted} className="btn-primary text-base px-8 py-3 gap-2">
            {hasSession ? 'Go to dashboard' : 'Get started — it’s free'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-gray-400" fill="currentColor" />
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Silent Symptom</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Not a medical device. Does not provide medical advice or diagnosis.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      <div className="card p-5 shadow-sm">
        {/* Preview header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white dark:text-gray-900" fill="currentColor" />
            </div>
            <span className="font-semibold text-sm">Silent Symptom</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">Oct 2026</span>
        </div>

        {/* Entry preview */}
        <div className="space-y-3">
          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">OCT 04</span>
              <SeverityIndicator severity={4} showNumber size="sm" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              "Sharp pain in my pelvic area during my morning walk. Had to stop and sit down. Lasted about 20 minutes."
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Activity className="w-3 h-3" style={{ width: 12, height: 12 }} />
                Pelvic Area
              </span>
              <span className="text-gray-200 dark:text-gray-700">·</span>
              <TagPill tag="pain" />
              <TagPill tag="pelvic" />
              <TagPill tag="sharp" />
            </div>
          </div>

          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">OCT 01</span>
              <SeverityIndicator severity={3} showNumber size="sm" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              "Could not fall asleep until 2am. Kept waking up. Feel exhausted today."
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Cloud className="w-3 h-3" style={{ width: 12, height: 12 }} />
                General
              </span>
              <span className="text-gray-200 dark:text-gray-700">·</span>
              <TagPill tag="insomnia" />
              <TagPill tag="fatigue" />
              <TagPill tag="brain fog" />
            </div>
          </div>

          <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tabular-nums">SEP 28</span>
              <SeverityIndicator severity={3} showNumber size="sm" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              "Feeling anxious and irritable today. Mild headache in the afternoon."
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Moon className="w-3 h-3" style={{ width: 12, height: 12 }} />
                Head & Neck
              </span>
              <span className="text-gray-200 dark:text-gray-700">·</span>
              <TagPill tag="anxiety" />
              <TagPill tag="headache" />
            </div>
          </div>
        </div>

        {/* Mini stats bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-6">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Entries</p>
            <p className="text-lg font-bold tabular-nums">12</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Avg severity</p>
            <p className="text-lg font-bold tabular-nums">3.4</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Streak</p>
            <p className="text-lg font-bold tabular-nums">4 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureStep({ icon: Icon, step, title, desc }: { icon: typeof PenLine; step: string; title: string; desc: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </div>
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1 tabular-nums">{step}</p>
      <h3 className="font-semibold text-base mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
