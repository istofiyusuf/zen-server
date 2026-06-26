"use client";

import { useEffect, useState } from "react";

// Socket.IO dinonaktifkan sementara
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Cek koneksi dengan health check
    const checkConnection = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/health");
        if (response.ok) {
          setIsConnected(true);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return { socket: null, isConnected };
}
