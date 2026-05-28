interface Props {
  className?: string;
}

export default function LoadingSkeleton({ className = 'h-4 w-full' }: Props) {
  return (
    <div className={`rounded bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`} />
  );
}

export function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
