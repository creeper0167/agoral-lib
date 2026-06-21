import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <>
      {/* AdminHeader skeleton */}
      <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-parchment rounded animate-pulse" />
          <div className="h-3 w-48 bg-parchment rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block h-9 w-44 bg-parchment rounded-lg animate-pulse" />
          <div className="w-8 h-8 bg-parchment rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Dashboard content skeleton */}
      <DashboardSkeleton />
    </>
  );
}
