"use client";

import PageLayout from "@/components/layout/page-layout";
import { websiteApi } from "@/services/website-api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiGlobe,
  FiPlay,
  FiPlus,
  FiSquare,
  FiTrash2
} from "react-icons/fi";

interface Website {
  id: string;
  name: string;
  domain: string;
  port: number;
  type: string;
  status: string;
  path: string;
  phpVersion?: string;
  nodeVersion?: string;
  createdAt: string;
  logs?: any[];
}

export default function WebsitesPage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const data = await websiteApi.list();
      setWebsites(data.data.websites);
    } catch (error) {
      console.error("Failed to load websites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (id: string) => {
    try {
      await websiteApi.start(id);
      loadWebsites();
    } catch (error) {
      console.error("Failed to start:", error);
    }
  };

  const handleStop = async (id: string) => {
    try {
      await websiteApi.stop(id);
      loadWebsites();
    } catch (error) {
      console.error("Failed to stop:", error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await websiteApi.delete(id);
      loadWebsites();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "php":
        return <span className="badge badge-info">PHP</span>;
      case "nodejs":
        return <span className="badge badge-success">Node.js</span>;
      case "python":
        return <span className="badge badge-warning">Python</span>;
      default:
        return <span className="badge badge-info">Static</span>;
    }
  };

  return (
    <PageLayout
      title="Websites"
      headerRight={
        <button
          onClick={() => router.push("/websites/create")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent active:scale-95 transition-all"
        >
          <FiPlus className="h-5 w-5" />
        </button>
      }
    >
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : websites.length === 0 ? (
          <div className="card text-center py-12">
            <FiGlobe className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-base font-medium text-primary mb-2">No Websites Yet</h3>
            <p className="text-sm text-secondary mb-4">
              Create your first website to get started
            </p>
            <button
              onClick={() => router.push("/websites/create")}
              className="btn btn-primary"
            >
              <FiPlus className="h-4 w-4" />
              Create Website
            </button>
          </div>
        ) : (
          websites.map((website) => (
            <div key={website.id} className="card">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      website.status === "running"
                        ? "bg-success/10"
                        : "bg-error/10"
                    }`}
                  >
                    <FiGlobe
                      className={`h-5 w-5 ${
                        website.status === "running"
                          ? "text-success"
                          : "text-error"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-primary">
                        {website.name}
                      </p>
                      {getTypeBadge(website.type)}
                    </div>
                    <p className="text-xs text-secondary">
                      {website.domain} : {website.port}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span
                  className={`badge ${
                    website.status === "running"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {website.status === "running" ? "Running" : "Stopped"}
                </span>
                <div className="flex gap-2">
                  {website.status === "running" ? (
                    <button
                      onClick={() => handleStop(website.id)}
                      className="btn btn-sm btn-secondary"
                    >
                      <FiSquare className="h-3 w-3" />
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStart(website.id)}
                      className="btn btn-sm btn-primary"
                    >
                      <FiPlay className="h-3 w-3" />
                      Start
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(website.id, website.name)}
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
