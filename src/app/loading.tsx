export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-border flex items-center px-6">
        <div className="h-8 w-32 bg-parchment rounded-lg animate-pulse" />
        <div className="flex-1" />
        <div className="flex gap-3">
          <div className="h-8 w-20 bg-parchment rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-parchment rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-parchment py-20 flex flex-col items-center gap-4">
        <div className="h-6 w-40 bg-border/60 rounded-full animate-pulse" />
        <div className="h-10 w-96 bg-border/60 rounded-lg animate-pulse" />
        <div className="h-5 w-64 bg-border/40 rounded-lg animate-pulse" />
        <div className="h-12 w-2/3 max-w-xl bg-white border border-border rounded-xl animate-pulse mt-4" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-7 w-40 bg-parchment rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card space-y-3">
              <div className="h-44 bg-parchment rounded-lg animate-pulse" />
              <div className="h-4 w-20 bg-parchment rounded animate-pulse" />
              <div className="h-5 w-full bg-parchment rounded animate-pulse" />
              <div className="h-4 w-28 bg-parchment rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
