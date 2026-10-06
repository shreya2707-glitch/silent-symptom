export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function EntryCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-14 rounded-md" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
