"use client";

import { motion } from "framer-motion";
import { FiBattery, FiClock, FiThermometer, FiWifi } from "react-icons/fi";

interface SystemStatsProps {
  battery: { percentage: number; status: string; temperature: number };
  temperature: number;
  network: { ip: string; active: string };
  uptime: string;
}

export default function SystemStats({ battery, temperature, network, uptime }: SystemStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Battery */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
          <FiBattery className="h-5 w-5 text-success" />
        </div>
        <div>
          <p className="text-xs text-secondary">Battery</p>
          <p className="text-sm font-semibold text-primary">{battery.percentage}%</p>
          <p className="text-xs text-secondary">{battery.status}</p>
        </div>
      </motion.div>

      {/* Temperature */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
          <FiThermometer className="h-5 w-5 text-warning" />
        </div>
        <div>
          <p className="text-xs text-secondary">Temp</p>
          <p className="text-sm font-semibold text-primary">{temperature}C</p>
        </div>
      </motion.div>

      {/* Network */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <FiWifi className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-xs text-secondary">Network</p>
          <p className="text-sm font-semibold text-primary">{network.ip}</p>
        </div>
      </motion.div>

      {/* Uptime */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card flex items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <FiClock className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-xs text-secondary">Uptime</p>
          <p className="text-sm font-semibold text-primary">{uptime}</p>
        </div>
      </motion.div>
    </div>
  );
}
