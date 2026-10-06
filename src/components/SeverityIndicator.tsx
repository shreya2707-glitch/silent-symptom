type SeverityIndicatorProps = {
  severity: number;
  showNumber?: boolean;
  size?: 'sm' | 'md';
};

export function SeverityIndicator({ severity, showNumber = false, size = 'sm' }: SeverityIndicatorProps) {
  const bars = [1, 2, 3, 4, 5];
  const barWidth = size === 'sm' ? 'w-1' : 'w-1.5';
  const barHeight = size === 'sm' ? 'h-3' : 'h-4';
  const gap = size === 'sm' ? 'gap-0.5' : 'gap-1';

  function getColor(level: number) {
    if (level <= 2) return 'bg-success-400';
    if (level <= 3) return 'bg-amber-400';
    return 'bg-danger-400';
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`flex items-end ${gap}`} role="img" aria-label={`Severity ${severity} out of 5`}>
        {bars.map((level) => (
          <div
            key={level}
            className={`${barWidth} ${barHeight} rounded-full transition-colors duration-200 ${
              level <= severity ? getColor(level) : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
          {severity}/5
        </span>
      )}
    </div>
  );
}
