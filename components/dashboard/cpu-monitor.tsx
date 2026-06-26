"use client";

import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";

interface CpuMonitorProps {
  usage: number;
  cores: number;
  model: string;
}

export default function CpuMonitor({ usage, cores, model }: CpuMonitorProps) {
  const getColor = (value: number) => {
    if (value < 50) return "bg-success";
    if (value < 80) return "bg-warning";
    return "bg-error";
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
            <FiCpu className="h-4 w-4 text-accent" />
          </div>
          <span className="text-sm font-medium text-primary">CPU</span>
        </div>
        <span className="text-lg font-semibold text-primary">{usage}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-card-hover overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${usage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${getColor(usage)}`}
        />
      </div>

      <div className="mt-2 flex justify-between">
        <span className="text-xs text-secondary">{cores} Cores</span>
        <span className="text-xs text-secondary truncate ml-2 max-w-[200px]">{model}</span>
      </div>
    </div>
  );
}
