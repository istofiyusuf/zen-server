"use client";

import PageLayout from "@/components/layout/page-layout";
import { useToastStore } from "@/lib/toast-store";
import { useEffect, useState } from "react";
import {
  FiClock,
  FiDownload,
  FiHardDrive,
  FiShield,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";

const API_URL = "http://localhost:3001/api/v1";

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("zen-token");
  }
  return null;
}

async function apiRequest(endpoint: string, options: any = {}) {
  const token = getToken();
  const headers: any = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  return res.json();
}

interface Backup {
  id?: string;
  name: string;
  type: string;
  path: string;
  size: number;
  status: string;
  createdAt: string;
}

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/backups");
      if (data.success) {
        setBackups(data.data.backups || []);
      }
    } catch (err) {
      console.error("Load backups error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (type: string) => {
    setCreating(true);
    try {
      const data = await apiRequest("/backup", {
        method: "POST",
        body: JSON.stringify({ type }),
      });

      if (data.success) {
        addToast("success", "Backup created", data.data.name);
        loadBackups();
      } else {
        addToast("error", "Backup failed", data.message);
      }
    } catch (err: any) {
      addToast("error", "Error", err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (name: string) => {
    if (!confirm(`Restore from "${name}"?`)) return;

    try {
      const data = await apiRequest("/restore", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      if (data.success) {
        addToast("success", "Restored successfully", name);
      } else {
        addToast("error", "Restore failed", data.message);
      }
    } catch (err: any) {
      addToast("error", "Error", err.message);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete backup "${name}"?`)) return;

    try {
      await apiRequest(`/backup/${name}`, { method: "DELETE" });
      addToast("success", "Backup deleted", name);
      loadBackups();
    } catch (err: any) {
      addToast("error", "Error", err.message);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PageLayout title="Backup & Restore">
      <div className="p-4 space-y-4">
        {/* Create Backup Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => createBackup("full")}
            disabled={creating}
            className="card flex flex-col items-center gap-2 py-6 border-accent/30 hover:border-accent/50 transition-all active:scale-95"
          >
            <FiShield className="h-8 w-8 text-accent" />
            <span className="text-sm font-medium text-primary">Full Backup</span>
            <span className="text-xs text-secondary">System + Data</span>
          </button>
          <button
            onClick={() => createBackup("config")}
            disabled={creating}
            className="card flex flex-col items-center gap-2 py-6 border-warning/30 hover:border-warning/50 transition-all active:scale-95"
          >
            <FiHardDrive className="h-8 w-8 text-warning" />
            <span className="text-sm font-medium text-primary">Config Only</span>
            <span className="text-xs text-secondary">Settings</span>
          </button>
        </div>

        {creating && (
          <div className="flex items-center justify-center gap-2 text-secondary py-4">
            <div className="h-4 w-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="text-sm">Creating backup...</span>
          </div>
        )}

        {/* Backup List */}
        <div>
          <h3 className="text-sm font-medium text-primary mb-3">
            Backup History ({backups.length})
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          ) : backups.length === 0 ? (
            <div className="card text-center py-12">
              <FiDownload className="h-12 w-12 text-secondary mx-auto mb-4" />
              <p className="text-sm text-secondary">No backups yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {backups.map((backup) => (
                <div key={backup.name} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                        <FiShield className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary truncate max-w-[180px]">
                          {backup.name}
                        </p>
                        <p className="text-xs text-secondary capitalize">
                          {backup.type} Backup
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-success">{backup.status}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-secondary flex items-center gap-1">
                      <FiHardDrive className="h-3 w-3" />
                      {formatSize(backup.size)}
                    </span>
                    <span className="text-xs text-secondary flex items-center gap-1">
                      <FiClock className="h-3 w-3" />
                      {formatDate(backup.createdAt)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => handleRestore(backup.name)}
                      className="btn btn-sm btn-primary flex-1"
                    >
                      <FiUpload className="h-3 w-3" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(backup.name)}
                      className="btn btn-sm btn-ghost text-error"
                    >
                      <FiTrash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
