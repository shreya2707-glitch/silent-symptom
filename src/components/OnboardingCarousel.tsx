import { useState } from 'react';
import { PenLine, Sparkles, FileText, ArrowRight, X, Heart } from 'lucide-react';

const SLIDES = [
  {
    icon: PenLine,
    title: 'Log how you feel',
    desc: 'Write freely in your own words. No forms, no checkboxes — just type what you\'re experiencing.',
    accent: 'text-brand-500 dark:text-brand-400',
    bg: 'bg-brand-50 dark:bg-brand-950/40',
  },
  {
    icon: Sparkles,
    title: 'We organize it',
    desc: 'Your entries are automatically tagged, categorized by body area, and rated for severity — ready to spot patterns.',
    accent: 'text-accent-500 dark:text-accent-400',
    bg: 'bg-accent-50 dark:bg-accent-950/40',
  },
  {
    icon: FileText,
    title: 'Bring it to your doctor',
    desc: 'Generate a clean clinical summary in one click. Flag what matters most so nothing gets missed at your visit.',
    accent: 'text-success-600 dark:text-success-400',
    bg: 'bg-success-50 dark:bg-success-950/40',
  },
];

export function OnboardingCarousel({ onDismiss }: { onDismiss: () => void }) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const Icon = current.icon;
  const isLast = slide === SLIDES.length - 1;

  const next = () => {
    if (isLast) {
      onDismiss();
    } else {
      setSlide((s) => s + 1);
    }
  };

  const skip = () => onDismiss();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in p-4">
      <div className="card w-full max-w-md p-8 animate-scale-in relative">
        <button
          onClick={skip}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Skip onboarding"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-xl ${current.bg} flex items-center justify-center`}>
            <Icon className={`w-7 h-7 ${current.accent}`} strokeWidth={1.8} style={{ width: 28, height: 28 }} />
          </div>
        </div>

        <h2 className="text-lg font-bold text-center mb-2 tracking-tight">
          {current.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-6 px-2">
          {current.desc}
        </p>

        <div className="flex items-center justify-center gap-1.5 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide
                  ? 'w-5 bg-gray-900 dark:bg-gray-100'
                  : 'w-1.5 bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={skip}
            className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={next}
            className="btn-primary"
          >
            {isLast ? 'Get started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <Heart className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" fill="currentColor" style={{ width: 14, height: 14 }} />
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Silent Symptom</span>
        </div>
      </div>
    </div>
  );
}
