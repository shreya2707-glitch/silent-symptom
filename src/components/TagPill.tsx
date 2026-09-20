import { getTagCategory } from '@/lib/ai';

export function TagPill({ tag }: { tag: string }) {
  const category = getTagCategory(tag);
  const cls = `pill pill-${category}`;
  return <span className={cls}>{tag}</span>;
}
