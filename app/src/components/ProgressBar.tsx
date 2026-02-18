'use client';

export function ProgressBar({
  completed,
  total,
  className = '',
}: {
  completed: number;
  total: number;
  className?: string;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct === 100 ? 'var(--color-success)' : 'var(--color-accent)',
          }}
        />
      </div>
      <span className="text-xs text-text-dim whitespace-nowrap">
        {completed}/{total}
      </span>
    </div>
  );
}
