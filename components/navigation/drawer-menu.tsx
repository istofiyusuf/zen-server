"use client";

import { useTheme } from "@/lib/theme-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FiBook,
  FiCode,
  FiCpu,
  FiDownload,
  FiHardDrive,
  FiLogOut,
  FiMoon,
  FiRotateCw,
  FiSun,
  FiTerminal,
  FiUpload,
  FiUser,
  FiX
} from "react-icons/fi";

const menuItems = [
  { icon: FiUser, label: "Profile", path: "/profile" },
  { icon: FiHardDrive, label: "Storage", path: "/storage" },
  { icon: FiCpu, label: "System Info", path: "/system" },
  { icon: FiTerminal, label: "Terminal", path: "/terminal" },
  { icon: FiRotateCw, label: "Restart", path: "/restart" },
  { icon: FiDownload, label: "Backup", path: "/backup" },
  { icon: FiUpload, label: "Restore", path: "/restore" },
  { icon: FiCode, label: "GitHub", path: "/github" },
  { icon: FiBook, label: "Documentation", path: "/docs" },
];

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isOpen, onClose }: DrawerMenuProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      />
      <div className="fixed left-0 top-0 z-[70] h-full w-[300px] max-w-[85vw] bg-background border-r border-border overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">Z</span>
            </div>
            <div>
              <h2 className="font-semibold text-primary">Zen Server</h2>
              <p className="text-xs text-secondary">v1.0.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-card hover:bg-card-hover active:scale-95 transition-all"
          >
            <FiX className="h-5 w-5 text-secondary" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl bg-card p-3 hover:bg-card-hover active:scale-[0.98] transition-all"
          >
            <span className="text-sm text-primary">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            {theme === "dark" ? (
              <FiMoon className="h-5 w-5 text-accent" />
            ) : (
              <FiSun className="h-5 w-5 text-accent" />
            )}
          </button>
        </div>

        <div className="flex-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.path)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-secondary hover:bg-card hover:text-primary active:scale-[0.98] transition-all"
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-border p-3">
          <button
            onClick={() => handleNavigate("/logout")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-error hover:bg-error/10 active:scale-[0.98] transition-all"
          >
            <FiLogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
