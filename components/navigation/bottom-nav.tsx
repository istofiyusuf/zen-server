"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { FiBox, FiFolder, FiGlobe, FiHome, FiSettings } from "react-icons/fi";

const navItems = [
  { path: "/dashboard", icon: FiHome, label: "Home" },
  { path: "/files", icon: FiFolder, label: "Files" },
  { path: "/websites", icon: FiGlobe, label: "Sites" },
  { path: "/packages", icon: FiBox, label: "Pkgs" },
  { path: "/settings", icon: FiSettings, label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card/90 backdrop-blur-xl p-1">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-[60px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-0 rounded-xl bg-accent/10"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
                <Icon
                  className={`relative z-10 h-5 w-5 transition-colors ${
                    isActive ? "text-accent" : "text-secondary"
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-medium transition-colors ${
                    isActive ? "text-accent" : "text-secondary"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
