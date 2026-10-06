import { useMemo } from 'react';
import type { Entry } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';

const AREA_TO_REGION: Record<string, string> = {
  'Head & Neck': 'head',
  'Neck & Shoulders': 'shoulders',
  'Back': 'back',
  'Chest': 'chest',
  'Abdomen': 'abdomen',
  'Pelvic Area': 'pelvis',
  'Joints': 'joints',
  'Muscles': 'muscles',
  'Legs': 'legs',
  'Arms': 'arms',
  'General': 'general',
};

export function BodyMap({ entries }: { entries: Entry[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const regionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((e) => {
      if (!e.body_area) return;
      const region = AREA_TO_REGION[e.body_area] ?? 'general';
      counts.set(region, (counts.get(region) || 0) + 1);
    });
    return counts;
  }, [entries]);

  const maxCount = Math.max(...Array.from(regionCounts.values()), 1);

  const getIntensity = (region: string): number => {
    const count = regionCounts.get(region) ?? 0;
    return count / maxCount;
  };

  const regionColor = (region: string): string => {
    const intensity = getIntensity(region);
    if (intensity === 0) return isDark ? '#374151' : '#e5e7eb';
    const alpha = 0.2 + intensity * 0.8;
    return `rgba(99, 102, 241, ${alpha})`;
  };

  const regionCount = (region: string): number => regionCounts.get(region) ?? 0;

  const silhouetteStroke = isDark ? '#4b5563' : '#d1d5db';

  const regionLabels: { region: string; label: string }[] = [
    { region: 'head', label: 'Head & Neck' },
    { region: 'shoulders', label: 'Neck & Shoulders' },
    { region: 'back', label: 'Back' },
    { region: 'chest', label: 'Chest' },
    { region: 'abdomen', label: 'Abdomen' },
    { region: 'pelvis', label: 'Pelvic Area' },
    { region: 'joints', label: 'Joints' },
    { region: 'legs', label: 'Legs' },
    { region: 'arms', label: 'Arms' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center">
      <div className="relative flex-shrink-0">
        <svg viewBox="0 0 200 420" className="w-40 h-auto" style={{ maxWidth: '180px' }}>
          {/* Head */}
          <ellipse
            cx="100" cy="35" rx="24" ry="28"
            fill={regionColor('head')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Neck */}
          <rect
            x="92" y="60" width="16" height="14"
            fill={regionColor('head')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Shoulders */}
          <path
            d="M 60 78 Q 100 72 140 78 L 150 88 Q 100 82 50 88 Z"
            fill={regionColor('shoulders')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Arms */}
          <rect
            x="46" y="88" width="14" height="90" rx="7"
            fill={regionColor('arms')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          <rect
            x="140" y="88" width="14" height="90" rx="7"
            fill={regionColor('arms')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Chest */}
          <rect
            x="62" y="80" width="76" height="55" rx="8"
            fill={regionColor('chest')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Abdomen */}
          <rect
            x="64" y="135" width="72" height="55" rx="8"
            fill={regionColor('abdomen')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Pelvis */}
          <path
            d="M 62 190 Q 100 195 138 190 L 142 215 Q 100 210 58 215 Z"
            fill={regionColor('pelvis')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Back indicator (small line behind) */}
          <line
            x1="100" y1="80" x2="100" y2="190"
            stroke={regionColor('back')}
            strokeWidth="3"
            opacity={getIntensity('back') > 0 ? 0.8 : 0.15}
            className="transition-all duration-500"
          />
          {/* Left leg */}
          <rect
            x="72" y="215" width="22" height="120" rx="10"
            fill={regionColor('legs')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Right leg */}
          <rect
            x="106" y="215" width="22" height="120" rx="10"
            fill={regionColor('legs')}
            stroke={silhouetteStroke}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
          {/* Joint dots - knees */}
          <circle
            cx="83" cy="285" r="5"
            fill={regionColor('joints')}
            stroke={silhouetteStroke}
            strokeWidth="1"
            className="transition-all duration-500"
          />
          <circle
            cx="117" cy="285" r="5"
            fill={regionColor('joints')}
            stroke={silhouetteStroke}
            strokeWidth="1"
            className="transition-all duration-500"
          />
          {/* Joint dots - shoulders */}
          <circle
            cx="60" cy="85" r="4"
            fill={regionColor('joints')}
            stroke={silhouetteStroke}
            strokeWidth="1"
            className="transition-all duration-500"
          />
          <circle
            cx="140" cy="85" r="4"
            fill={regionColor('joints')}
            stroke={silhouetteStroke}
            strokeWidth="1"
            className="transition-all duration-500"
          />
        </svg>
      </div>

      <div className="flex-1 w-full">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Areas highlighted by frequency — darker = more entries logged
        </p>
        <div className="space-y-1.5">
          {regionLabels.map(({ region, label }) => {
            const count = regionCount(region);
            const intensity = getIntensity(region);
            if (count === 0) return null;
            return (
              <div key={region} className="flex items-center gap-2.5 animate-fade-in">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 transition-all duration-500"
                  style={{ backgroundColor: regionColor(region) }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-200 flex-1">{label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{count} {count === 1 ? 'entry' : 'entries'}</span>
                <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-700/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${intensity * 100}%`, backgroundColor: regionColor(region) }}
                  />
                </div>
              </div>
            );
          })}
          {Array.from(regionCounts.values()).every((v) => v === 0) && (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No body area data yet. Body areas are extracted automatically when you log entries.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
