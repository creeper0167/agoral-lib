// ─── Base skeleton pulse ──────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-parchment rounded-lg ${className}`} />
  );
}

// ─── Book card skeleton ───────────────────────────────────────────────────────

export function BookCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3">
      <Skeleton className="h-44 w-full rounded-lg" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="mt-auto flex items-center justify-between pt-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

// ─── Book grid skeleton ───────────────────────────────────────────────────────

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Book detail skeleton ─────────────────────────────────────────────────────

export function BookDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cover */}
        <div className="md:col-span-1">
          <Skeleton className="w-full aspect-[3/4] rounded-xl" />
        </div>

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-48" />

          <div className="grid grid-cols-2 gap-4 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>

          <Skeleton className="h-10 w-40 rounded-lg" />

          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 card space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// ─── Category card skeleton ───────────────────────────────────────────────────

export function CategoryCardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      </div>
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// ─── Reservation row skeleton ─────────────────────────────────────────────────

export function ReservationRowSkeleton() {
  return (
    <div className="card flex items-center gap-5">
      <Skeleton className="w-14 h-20 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
    </div>
  );
}

// ─── Admin stat card skeleton ─────────────────────────────────────────────────

export function StatCardSkeleton() {
  return (
    <div className="card flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  );
}

// ─── Admin table row skeleton ─────────────────────────────────────────────────

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  const widths = ["w-40", "w-28", "w-20", "w-16", "w-16"];
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className={`h-4 ${widths[i % widths.length]}`} />
        </td>
      ))}
    </tr>
  );
}

// ─── Admin table skeleton (header + rows) ─────────────────────────────────────

export function AdminTableSkeleton({ cols = 5, rows = 6 }: { cols?: number; rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-parchment border-b border-border">
            <tr>
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-5 py-3.5">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <TableRowSkeleton key={i} cols={cols} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin dashboard skeleton ─────────────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent reservations table */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20 mr-auto" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-14 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
