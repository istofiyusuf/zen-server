"use client";

import PageLayout from "@/components/layout/page-layout";
import { useToastStore } from "@/lib/toast-store";
import { useEffect, useState } from "react";
import {
  FiDatabase,
  FiDownload,
  FiHardDrive,
  FiPlus,
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
  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  return res.json();
}

interface Database {
  id: string;
  name: string;
  type: string;
  status: string;
  path?: string;
  size?: number;
  createdAt: string;
}

export default function DatabasesPage() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newDbName, setNewDbName] = useState("");
  const [newDbType, setNewDbType] = useState("sqlite");
  const { addToast } = useToastStore();

  useEffect(() => {
    loadDatabases();
  }, []);

  const loadDatabases = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/databases");
      if (data.success) {
        setDatabases(data.data.databases || []);
      }
    } catch (err) {
      console.error("Load databases error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newDbName.trim()) return;

    try {
      const data = await apiRequest("/databases", {
        method: "POST",
        body: JSON.stringify({ name: newDbName.trim(), type: newDbType }),
      });

      if (data.success) {
        addToast("success", "Database created", newDbName);
        setNewDbName("");
        setShowCreate(false);
        loadDatabases();
      } else {
        addToast("error", "Failed", data.message);
      }
    } catch (err: any) {
      addToast("error", "Error", err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete database "${name}"?`)) return;

    try {
      await apiRequest(`/databases/${id}`, { method: "DELETE" });
      addToast("success", "Database deleted", name);
      loadDatabases();
    } catch (err: any) {
      addToast("error", "Error", err.message);
    }
  };

  const handleBackup = (name: string) => {
    addToast("info", "Backup", `Backing up ${name}... (simulated)`);
  };

  const handleRestore = (name: string) => {
    addToast("info", "Restore", `Restoring ${name}... (simulated)`);
  };

  const getDbIcon = (type: string) => {
    switch (type) {
      case "mariadb":
        return "bg-accent/10 text-accent";
      case "postgresql":
        return "bg-accent/10 text-accent";
      case "sqlite":
      default:
        return "bg-success/10 text-success";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return "badge badge-success";
      case "stopped":
        return "badge badge-error";
      default:
        return "badge badge-info";
    }
  };

  return (
    <PageLayout
      title="Databases"
      headerRight={
        <button
          onClick={() => setShowCreate(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent active:scale-95 transition-all"
        >
          <FiPlus className="h-5 w-5" />
        </button>
      }
    >
      <div className="p-4 space-y-3">
        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm card">
              <h3 className="text-sm font-medium text-primary mb-3">
                Create Database
              </h3>
              <input
                type="text"
                value={newDbName}
                onChange={(e) => setNewDbName(e.target.value)}
                className="input mb-3"
                placeholder="Database name"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
              <select
                value={newDbType}
                onChange={(e) => setNewDbType(e.target.value)}
                className="input mb-3"
              >
                <option value="sqlite">SQLite</option>
                <option value="mariadb">MariaDB</option>
                <option value="postgresql">PostgreSQL</option>
              </select>
              <div className="flex gap-2">
                <button onClick={handleCreate} className="btn btn-primary flex-1">
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setNewDbName("");
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Database List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : databases.length === 0 ? (
          <div className="card text-center py-12">
            <FiDatabase className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-base font-medium text-primary mb-2">
              No Databases
            </h3>
            <p className="text-sm text-secondary mb-4">
              Create your first database
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn btn-primary"
            >
              <FiPlus className="h-4 w-4" />
              Create Database
            </button>
          </div>
        ) : (
          databases.map((db) => (
            <div key={db.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${getDbIcon(db.type)}`}
                  >
                    <FiDatabase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">
                      {db.name}
                    </p>
                    <p className="text-xs text-secondary capitalize">
                      {db.type}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(db.status)}>
                  {db.status || "unknown"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <FiHardDrive className="h-3 w-3" />
                  <span>{db.size ? `${db.size} MB` : "N/A"}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBackup(db.name)}
                    className="btn btn-sm btn-secondary"
                  >
                    <FiDownload className="h-3 w-3" />
                    Backup
                  </button>
                  <button
                    onClick={() => handleRestore(db.name)}
                    className="btn btn-sm btn-secondary"
                  >
                    <FiUpload className="h-3 w-3" />
                    Restore
                  </button>
                  <button
                    onClick={() => handleDelete(db.id, db.name)}
                    className="btn btn-sm btn-ghost text-error"
                  >
                    <FiTrash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}
