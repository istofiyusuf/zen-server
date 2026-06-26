"use client";

import { useAuthStore } from "@/lib/auth-store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cek autentikasi
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 25;
      });
    }, 500);

    // Redirect setelah loading
    const redirectTimer = setTimeout(() => {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 2800);

    // Status change
    const statusTimer = setTimeout(() => {
      setStatus("ready");
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(redirectTimer);
      clearTimeout(statusTimer);
    };
  }, [router, isAuthenticated]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <div className="relative">
          <motion.div
            animate={status === "loading" ? { rotate: 360 } : { scale: [1, 1.05, 1] }}
            transition={
              status === "loading"
                ? { duration: 2, repeat: Infinity, ease: "linear" }
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
            className="h-24 w-24 rounded-3xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20"
          >
            <span className="text-4xl font-bold text-white">Z</span>
          </motion.div>

          {/* Status indicator */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-background"
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-primary"
          >
            Zen Server
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-1 text-sm text-secondary"
          >
            Android Web Server Dashboard
          </motion.p>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-48"
        >
          <div className="h-1 w-full rounded-full bg-card overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-blue-600"
            />
          </div>
        </motion.div>

        {/* Status text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-accent"
          />
          <span className="text-xs text-secondary">
            {status === "loading" ? "Initializing system..." : "Ready"}
          </span>
        </motion.div>
      </motion.div>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-xs text-secondary"
      >
        v1.0.0
      </motion.p>
    </main>
  );
}
