export function SeverityDots({ severity }: { severity: number }) {
  const color = (s: number) => {
    if (s >= 5) return 'bg-red-400';
    if (s >= 4) return 'bg-orange-400';
    if (s >= 3) return 'bg-yellow-400';
    if (s >= 2) return 'bg-lime-400';
    return 'bg-green-400';
  };

  return (
    <div className="flex items-center gap-1" title={`Severity: ${severity}/5`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`rounded-full transition-colors duration-200 ${
              n <= severity ? color(severity) : 'bg-gray-200 dark:bg-gray-600'
            }`}
            style={{ width: 8, height: 8 }}
          />
        ))}
      </div>
    </div>
  );
}
