"use client";

import PageLayout from "@/components/layout/page-layout";
import { useEffect, useState } from "react";
import { FiHardDrive } from "react-icons/fi";

export default function StoragePage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/system/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .catch(console.error);
  }, []);

  return (
    <PageLayout title="Storage">
      <div className="p-4 space-y-4">
        {stats ? (
          <>
            <div className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                  <FiHardDrive className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-secondary">Total Storage</p>
                  <p className="text-lg font-semibold text-primary">{stats.storage.size}</p>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-card-hover overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${stats.storage.percent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-secondary">Used: {stats.storage.used}</span>
                <span className="text-xs text-secondary">Free: {stats.storage.available}</span>
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-medium text-primary mb-3">RAM Usage</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <FiHardDrive className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-secondary">Memory</p>
                  <p className="text-lg font-semibold text-primary">{stats.ram.total}</p>
                </div>
              </div>
              <div className="h-3 w-full rounded-full bg-card-hover overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${stats.ram.percent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-secondary">Used: {stats.ram.used}</span>
                <span className="text-xs text-secondary">Free: {stats.ram.free}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
