"use client";

import PageLayout from "@/components/layout/page-layout";
import { useToastStore } from "@/lib/toast-store";
import { useEffect, useState } from "react";
import { FiClock, FiHardDrive, FiShield, FiUpload } from "react-icons/fi";

const API_URL = "http://localhost:3001/api/v1";

function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("zen-token");
  return null;
}

async function apiRequest(endpoint: string, options: any = {}) {
  const token = getToken();
  const headers: any = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  return res.json();
}

export default function RestorePage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const { addToast } = useToastStore();

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const data = await apiRequest("/backups");
      if (data.success) setBackups(data.data.backups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (name: string) => {
    if (!confirm(`Restore from "${name}"? All current data will be replaced.`)) return;

    setRestoring(true);
    try {
      const data = await apiRequest("/restore", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      if (data.success) {
        addToast("success", "Restored!", "System restored successfully");
      } else {
        addToast("error", "Failed", data.message);
      }
    } catch (err: any) {
      addToast("error", "Error", err.message);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <PageLayout title="Restore">
      <div className="p-4 space-y-4">
        <div className="card text-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/10 mx-auto mb-4">
            <FiUpload className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">
            Restore from Backup
          </h2>
          <p className="text-sm text-secondary">
            Select a backup to restore
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : backups.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-sm text-secondary">No backups available</p>
          </div>
        ) : (
          backups.map((b) => (
            <div key={b.name} className="card">
              <div className="flex items-center gap-3 mb-3">
                <FiShield className="h-5 w-5 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">{b.name}</p>
                  <p className="text-xs text-secondary flex items-center gap-2">
                    <FiClock className="h-3 w-3" />
                    {new Date(b.createdAt).toLocaleDateString()}
                    <FiHardDrive className="h-3 w-3 ml-2" />
                    {b.size ? (b.size / 1024).toFixed(1) + " KB" : "N/A"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRestore(b.name)}
                disabled={restoring}
                className="btn btn-primary w-full"
              >
                <FiUpload className="h-4 w-4" />
                Restore This Backup
              </button>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
