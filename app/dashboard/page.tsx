"use client";

import CpuMonitor from "@/components/dashboard/cpu-monitor";
import RamMonitor from "@/components/dashboard/ram-monitor";
import StorageMonitor from "@/components/dashboard/storage-monitor";
import SystemStats from "@/components/dashboard/system-stats";
import { useSystemStats } from "@/hooks/use-system-stats";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FiDatabase,
  FiFolder,
  FiGlobe,
  FiPackage,
  FiServer,
  FiSettings,
  FiTerminal,
} from "react-icons/fi";

export default function DashboardPage() {
  const { stats, isConnected } = useSystemStats();

  return (
    <div className="p-4 space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            isConnected ? "bg-success animate-pulse" : "bg-error"
          }`}
        />
        <span className="text-xs text-secondary">
          {isConnected ? "Realtime Connected" : "Connecting..."}
        </span>
      </div>

      {/* System Overview */}
      <div className="card-glass">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-secondary">System Overview</h2>
            <p className="mt-1 text-lg font-semibold text-primary">
              {stats.system.hostname || "Zen Server"}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
            <FiServer className="h-6 w-6 text-accent" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-xs text-secondary">Platform:</span>
            <span className="text-xs text-primary capitalize">
              {stats.system.platform}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-secondary">Arch:</span>
            <span className="text-xs text-primary">{stats.system.arch}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-secondary">Uptime:</span>
            <span className="text-xs text-primary">
              {stats.system.uptime?.formatted || "0m"}
            </span>
          </div>
        </div>
      </div>

      {/* CPU Monitor */}
      <CpuMonitor
        usage={stats.cpu.usage}
        cores={stats.cpu.cores}
        model={stats.cpu.model}
      />

      {/* RAM Monitor */}
      <RamMonitor
        used={stats.ram.used}
        total={stats.ram.total}
        percent={stats.ram.percent}
      />

      {/* Storage Monitor */}
      <StorageMonitor
        used={stats.storage.used}
        available={stats.storage.available}
        size={stats.storage.size}
        percent={stats.storage.percent}
      />

      {/* System Stats Grid */}
      <SystemStats
        battery={{
          percentage: stats.battery.percentage,
          status: stats.battery.status,
          temperature: stats.battery.temperature,
        }}
        temperature={stats.temperature}
        network={{
          ip: stats.network.ip,
          active: stats.network.active,
        }}
        uptime={stats.system.uptime.formatted}
      />

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-primary mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <QuickAction
            icon={FiTerminal}
            label="Terminal"
            path="/terminal"
            color="text-accent"
            bg="bg-accent/10"
          />
          <QuickAction
            icon={FiFolder}
            label="Files"
            path="/files"
            color="text-warning"
            bg="bg-warning/10"
          />
          <QuickAction
            icon={FiGlobe}
            label="Websites"
            path="/websites"
            color="text-success"
            bg="bg-success/10"
          />
          <QuickAction
            icon={FiPackage}
            label="Packages"
            path="/packages"
            color="text-accent"
            bg="bg-accent/10"
          />
          <QuickAction
            icon={FiDatabase}
            label="Databases"
            path="/databases"
            color="text-warning"
            bg="bg-warning/10"
          />
          <QuickAction
            icon={FiSettings}
            label="Settings"
            path="/settings"
            color="text-secondary"
            bg="bg-card-hover"
          />
        </div>
      </div>
    </div>
  );
}

// Quick Action Component
function QuickAction({
  icon: Icon,
  label,
  path,
  color,
  bg,
}: {
  icon: any;
  label: string;
  path: string;
  color: string;
  bg: string;
}) {
  const router = useRouter();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(path)}
      className={`flex flex-col items-center gap-2 rounded-2xl ${bg} p-4 border border-border hover:border-accent/30 transition-all cursor-pointer active:scale-95`}
    >
      <Icon className={`h-6 w-6 ${color}`} />
      <span className="text-xs text-secondary font-medium">{label}</span>
    </motion.button>
  );
}
