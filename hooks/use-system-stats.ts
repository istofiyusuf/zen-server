"use client";

import { useCallback, useEffect, useState } from "react";

interface SystemStats {
  timestamp: number;
  cpu: { usage: number; cores: number; model: string };
  ram: { total: string; used: string; free: string; percent: number };
  storage: { size: string; used: string; available: string; percent: number };
  battery: { percentage: number; status: string; temperature: number };
  network: { ip: string; active: string };
  temperature: number;
  system: { hostname: string; platform: string; arch: string; uptime: any };
}

const defaultStats: SystemStats = {
  timestamp: Date.now(),
  cpu: { usage: 0, cores: 0, model: "Loading..." },
  ram: { total: "0 GB", used: "0 GB", free: "0 GB", percent: 0 },
  storage: { size: "0 GB", used: "0 GB", available: "0 GB", percent: 0 },
  battery: { percentage: 0, status: "UNKNOWN", temperature: 0 },
  network: { ip: "0.0.0.0", active: "" },
  temperature: 0,
  system: { hostname: "Loading...", platform: "", arch: "", uptime: { formatted: "" } },
};

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats>(defaultStats);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/api/v1/system/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
          setIsConnected(true);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, isConnected, isLoading, connectionError: null };
}
