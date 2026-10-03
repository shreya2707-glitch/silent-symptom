export function PulseWave({ className = '', color }: { className?: string; color?: string }) {
  const stroke = color ?? 'currentColor';
  return (
    <svg
      className={className}
      viewBox="0 0 600 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,50 Q50,50 60,50 L80,50 Q90,20 100,50 Q110,80 120,50 L150,50 Q160,50 170,50 L190,50 Q200,10 210,50 Q220,90 230,50 L260,50 Q270,50 280,50 L300,50 Q310,30 320,50 Q330,70 340,50 L370,50 Q380,50 390,50 L410,50 Q420,15 430,50 Q440,85 450,50 L480,50 Q490,50 500,50 L520,50 Q530,35 540,50 Q550,65 560,50 L600,50"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.15"
      />
    </svg>
  );
}
