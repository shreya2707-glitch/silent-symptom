import { useState } from 'react';
import { PenLine, Sparkles, FileText, ArrowRight, X } from 'lucide-react';
import { PulseWave } from '@/components/PulseWave';

const SLIDES = [
  {
    icon: PenLine,
    title: 'Log how you feel',
    desc: 'Write freely in your own words. No forms, no checkboxes — just type what you\'re experiencing.',
    accent: 'text-lavender-500 dark:text-lavender-400',
    bg: 'bg-lavender-50 dark:bg-lavender-900/20',
  },
  {
    icon: Sparkles,
    title: 'We organize it',
    desc: 'Your entries are automatically tagged, categorized by body area, and rated for severity — ready to spot patterns.',
    accent: 'text-teal-500 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  {
    icon: FileText,
    title: 'Bring it to your doctor',
    desc: 'Generate a clean clinical summary in one click. Flag what matters most so nothing gets missed at your visit.',
    accent: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in p-4">
      <div className="card w-full max-w-md p-8 animate-fade-in-up relative overflow-hidden">
        <button
          onClick={skip}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
          aria-label="Skip"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center mb-6 relative">
          <div className={`w-20 h-20 rounded-2xl ${current.bg} flex items-center justify-center`}>
            <Icon className={`w-9 h-9 ${current.accent}`} strokeWidth={1.8} />
          </div>
          <PulseWave
            className="absolute -bottom-1 left-0 w-full h-6 text-lavender-400 dark:text-lavender-500"
          />
        </div>

        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-2 tracking-tight">
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
                  ? 'w-6 bg-lavender-500 dark:bg-lavender-400'
                  : 'w-1.5 bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={skip}
            className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150"
          >
            Skip
          </button>
          <button
            onClick={next}
            className="btn-accent flex items-center gap-2"
          >
            {isLast ? 'Get started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
