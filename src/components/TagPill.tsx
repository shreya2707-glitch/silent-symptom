import { getTagCategory } from '@/lib/ai';
import { Activity, Moon, Cloud, Tag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  physical: Activity,
  sleep: Moon,
  mood: Cloud,
  other: Tag,
};

export function TagPill({ tag }: { tag: string }) {
  const category = getTagCategory(tag);
  const cls = `pill pill-${category}`;
  const Icon = CATEGORY_ICONS[category] ?? Tag;
  return (
    <span className={cls}>
      <Icon className="w-3 h-3 mr-1 flex-shrink-0" style={{ width: 12, height: 12 }} />
      {tag}
    </span>
  );
}
