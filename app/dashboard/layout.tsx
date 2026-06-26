"use client";

import BottomNav from "@/components/navigation/bottom-nav";
import DrawerMenu from "@/components/navigation/drawer-menu";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-card hover:bg-card-hover active:scale-95 transition-all"
          >
            <FiMenu className="h-5 w-5 text-secondary" />
          </button>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">Z</span>
            </div>
            <h1 className="text-base font-semibold text-primary">Zen Server</h1>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Drawer Menu */}
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
