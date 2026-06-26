"use client";

import BottomNav from "@/components/navigation/bottom-nav";
import DrawerMenu from "@/components/navigation/drawer-menu";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  headerRight?: React.ReactNode;
  showDrawer?: boolean;
}

export default function PageLayout({
  children,
  title,
  headerRight,
  showDrawer = true,
}: PageLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4">
          {showDrawer ? (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-card hover:bg-card-hover active:scale-95 transition-all"
              aria-label="Open menu"
            >
              <FiMenu className="h-5 w-5 text-secondary" />
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}

          <h1 className="text-base font-semibold text-primary">{title}</h1>

          {headerRight ? (
            headerRight
          ) : (
            <div className="h-10 w-10" />
          )}
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Drawer Menu */}
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
