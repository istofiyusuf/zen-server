"use client";

import PageLayout from "@/components/layout/page-layout";
import { useAuthStore } from "@/lib/auth-store";
import { useTheme } from "@/lib/theme-provider";
import { useToastStore } from "@/lib/toast-store";
import { settingsApi } from "@/services/settings-api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiBell,
  FiCheck,
  FiChevronRight,
  FiGlobe,
  FiInfo,
  FiLock,
  FiLogOut,
  FiMoon,
  FiRotateCw,
  FiSun
} from "react-icons/fi";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { addToast } = useToastStore();

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
  setPasswordMsg("");
  setPasswordError("");

  if (!currentPassword || !newPassword) {
    setPasswordError("All fields required");
    addToast("warning", "Validation", "All fields are required");
    return;
  }

  if (newPassword.length < 6) {
    setPasswordError("Minimum 6 characters");
    addToast("warning", "Validation", "Password must be at least 6 characters");
    return;
  }

  setSaving(true);
  try {
    await settingsApi.changePassword(currentPassword, newPassword);
    addToast("success", "Password updated", "Your password has been changed");
    setPasswordMsg("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setShowPassword(false);
  } catch (err: any) {
    setPasswordError(err.message);
    addToast("error", "Failed", err.message);
  } finally {
    setSaving(false);
  }
};

    const handleLogout = async () => {
    await logout();
    addToast("info", "Logged out", "See you next time!");
    router.push("/login");
};

  return (
    <PageLayout title="Settings">
      <div className="p-4 space-y-4">
        {/* Profile Section */}
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-primary">{user?.username || "User"}</h3>
              <p className="text-sm text-secondary">{user?.email || ""}</p>
              <span className="badge badge-info mt-1">{user?.role || "admin"}</span>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card overflow-hidden p-0">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-medium text-primary">Appearance</h3>
          </div>
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-card-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <FiMoon className="h-5 w-5 text-accent" />
              ) : (
                <FiSun className="h-5 w-5 text-accent" />
              )}
              <span className="text-sm text-secondary">Theme</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary">{theme === "dark" ? "Dark" : "Light"}</span>
              <FiChevronRight className="h-4 w-4 text-secondary" />
            </div>
          </button>
        </div>

        {/* System */}
        <div className="card overflow-hidden p-0">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-medium text-primary">System</h3>
          </div>
          <div className="flex w-full items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <FiGlobe className="h-5 w-5 text-secondary" />
              <span className="text-sm text-secondary">Language</span>
            </div>
            <span className="text-sm text-primary">English</span>
          </div>
          <div className="flex w-full items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-3">
              <FiBell className="h-5 w-5 text-secondary" />
              <span className="text-sm text-secondary">Notifications</span>
            </div>
            <span className="text-sm text-primary">Enabled</span>
          </div>
          <div className="flex w-full items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-3">
              <FiRotateCw className="h-5 w-5 text-secondary" />
              <span className="text-sm text-secondary">Auto Start</span>
            </div>
            <span className="text-sm text-primary">Disabled</span>
          </div>
        </div>

        {/* Security */}
        <div className="card overflow-hidden p-0">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-medium text-primary">Security</h3>
          </div>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-card-hover transition-colors"
          >
            <div className="flex items-center gap-3">
              <FiLock className="h-5 w-5 text-warning" />
              <span className="text-sm text-secondary">Change Password</span>
            </div>
            <FiChevronRight className="h-4 w-4 text-secondary" />
          </button>

          {showPassword && (
            <div className="px-4 py-3 border-t border-border space-y-3">
              {passwordMsg && (
                <div className="bg-success/10 border border-success/20 rounded-xl p-3">
                  <p className="text-sm text-success flex items-center gap-2">
                    <FiCheck className="h-4 w-4" />
                    {passwordMsg}
                  </p>
                </div>
              )}
              {passwordError && (
                <div className="bg-error/10 border border-error/20 rounded-xl p-3">
                  <p className="text-sm text-error">{passwordError}</p>
                </div>
              )}
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
                placeholder="Current password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                placeholder="New password (min 6 chars)"
              />
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="btn btn-primary w-full"
              >
                {saving ? "Saving..." : "Update Password"}
              </button>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="card overflow-hidden p-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between px-4 py-3 hover:bg-error/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FiLogOut className="h-5 w-5 text-error" />
              <span className="text-sm text-error">Logout</span>
            </div>
          </button>
        </div>

        {/* About */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <FiInfo className="h-5 w-5 text-accent" />
            <h3 className="text-sm font-medium text-primary">About</h3>
          </div>
          <p className="text-xs text-secondary">Zen Server v1.0.0</p>
          <p className="text-xs text-secondary mt-1">Android Web Server Dashboard</p>
          <p className="text-xs text-secondary mt-1">Built with Next.js + Express + Prisma</p>
        </div>
      </div>
    </PageLayout>
  );
}
