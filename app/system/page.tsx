"use client";

import PageLayout from "@/components/layout/page-layout";
import { useEffect, useState } from "react";
import { FiClock, FiCpu, FiServer } from "react-icons/fi";

export default function SystemPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/system/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.data))
      .catch(console.error);
  }, []);

  return (
    <PageLayout title="System Info">
      <div className="p-4 space-y-4">
        {stats ? (
          <>
            <div className="card space-y-3">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                <FiServer className="h-4 w-4 text-accent" />
                System
              </h3>
              <InfoRow label="Hostname" value={stats.system.hostname} />
              <InfoRow label="Platform" value={stats.system.platform} />
              <InfoRow label="Architecture" value={stats.system.arch} />
              <InfoRow label="Node.js" value={stats.system.nodeVersion} />
              <InfoRow label="Termux" value={stats.system.termux ? "Yes" : "No"} />
            </div>

            <div className="card space-y-3">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                <FiCpu className="h-4 w-4 text-accent" />
                CPU
              </h3>
              <InfoRow label="Model" value={stats.cpu.model} />
              <InfoRow label="Cores" value={String(stats.cpu.cores)} />
              <InfoRow label="Usage" value={`${stats.cpu.usage}%`} />
            </div>

            <div className="card space-y-3">
              <h3 className="text-sm font-medium text-primary flex items-center gap-2">
                <FiClock className="h-4 w-4 text-accent" />
                Uptime
              </h3>
              <InfoRow label="Running" value={stats.system.uptime.formatted} />
              <InfoRow label="Battery" value={`${stats.battery.percentage}% (${stats.battery.status})`} />
              <InfoRow label="Temperature" value={`${stats.temperature}C`} />
              <InfoRow label="Network" value={stats.network.ip} />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border last:border-b-0">
      <span className="text-sm text-secondary">{label}</span>
      <span className="text-sm font-medium text-primary text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}
