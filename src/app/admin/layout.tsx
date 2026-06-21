"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/admin/dashboard");
      return;
    }
    if (!isAdmin) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // Show skeleton while auth state is being resolved
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-parchment">
        {/* Sidebar skeleton */}
        <div className="w-60 bg-navy min-h-screen shrink-0 animate-pulse" />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-16 bg-white border-b border-border animate-pulse" />
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Prevent flash of admin content before redirect fires
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-parchment">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
