import { BookGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="h-16 bg-white border-b border-border flex items-center px-6 sticky top-0 z-40">
        <div className="h-9 w-9 bg-parchment rounded-lg animate-pulse" />
        <div className="h-5 w-20 bg-parchment rounded-lg animate-pulse mr-2.5" />
        <div className="flex-1" />
        <div className="hidden md:flex gap-3">
          <div className="h-8 w-24 bg-parchment rounded-lg animate-pulse" />
          <div className="h-8 w-24 bg-parchment rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-parchment rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-parchment rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-parchment py-20 border-b border-border flex flex-col items-center gap-4 px-4">
        <div className="h-6 w-36 bg-border/50 rounded-full animate-pulse" />
        <div className="h-10 w-80 bg-border/50 rounded-lg animate-pulse" />
        <div className="h-10 w-96 bg-border/50 rounded-lg animate-pulse" />
        <div className="h-5 w-64 bg-border/30 rounded-lg animate-pulse mt-1" />
        <div className="h-14 w-full max-w-2xl bg-white border border-border rounded-xl animate-pulse mt-4" />
        {/* Stats */}
        <div className="flex items-center gap-10 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="h-6 w-16 bg-border/40 rounded animate-pulse" />
              <div className="h-3 w-20 bg-border/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories row */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-32 bg-parchment rounded-lg animate-pulse" />
          <div className="h-4 w-20 bg-parchment rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card flex flex-col items-center gap-2 py-4">
              <div className="w-6 h-6 bg-parchment rounded animate-pulse" />
              <div className="h-4 w-20 bg-parchment rounded animate-pulse" />
              <div className="h-3 w-14 bg-parchment rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Book grid */}
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-40 bg-parchment rounded-lg animate-pulse" />
          <div className="h-4 w-20 bg-parchment rounded animate-pulse" />
        </div>
        <BookGridSkeleton count={12} />
      </div>
    </div>
  );
}
