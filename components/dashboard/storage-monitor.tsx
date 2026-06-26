"use client";

import { motion } from "framer-motion";
import { FiHardDrive } from "react-icons/fi";

interface StorageMonitorProps {
  used: string;
  available: string;
  size: string;
  percent: number;
}

export default function StorageMonitor({ used, available, size, percent }: StorageMonitorProps) {
  const getColor = (value: number) => {
    if (value < 70) return "bg-accent";
    if (value < 90) return "bg-warning";
    return "bg-error";
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
            <FiHardDrive className="h-4 w-4 text-warning" />
          </div>
          <span className="text-sm font-medium text-primary">Storage</span>
        </div>
        <span className="text-lg font-semibold text-primary">{percent}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-card-hover overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${getColor(percent)}`}
        />
      </div>

      <div className="mt-2 flex justify-between">
        <span className="text-xs text-secondary">Free: {available}</span>
        <span className="text-xs text-secondary">Total: {size}</span>
      </div>
    </div>
  );
}
