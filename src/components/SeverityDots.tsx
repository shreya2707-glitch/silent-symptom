import { SeverityIndicator } from '@/components/SeverityIndicator';

export function SeverityDots({ severity }: { severity: number }) {
  return <SeverityIndicator severity={severity} />;
}
