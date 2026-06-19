export default function AdminLoading() {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="h-8 w-48 bg-parchment rounded-lg animate-pulse" />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className="w-12 h-12 bg-parchment rounded-xl animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 bg-parchment rounded animate-pulse" />
              <div className="h-6 w-16 bg-parchment rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card space-y-3">
        <div className="h-5 w-36 bg-parchment rounded animate-pulse mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
            <div className="h-4 w-28 bg-parchment rounded animate-pulse" />
            <div className="h-4 w-20 bg-parchment rounded animate-pulse" />
            <div className="flex-1" />
            <div className="h-6 w-16 bg-parchment rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
