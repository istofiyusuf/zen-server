"use client";

import PageLayout from "@/components/layout/page-layout";
import { useToastStore } from "@/lib/toast-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiAlertTriangle, FiRotateCw, FiServer } from "react-icons/fi";

export default function RestartPage() {
  const [restarting, setRestarting] = useState(false);
  const { addToast } = useToastStore();
  const router = useRouter();

  const handleRestart = async (type: string) => {
    if (!confirm(`Are you sure you want to ${type}?`)) return;

    setRestarting(true);
    addToast("info", "Restarting...", `${type} in progress`);

    setTimeout(() => {
      setRestarting(false);
      addToast("success", "Completed", `${type} completed`);
      if (type === "Restart Server") {
        router.push("/dashboard");
      }
    }, 2000);
  };

  return (
    <PageLayout title="Restart">
      <div className="p-4 space-y-4">
        <div className="card text-center py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-warning/10 mx-auto mb-4">
            <FiAlertTriangle className="h-8 w-8 text-warning" />
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">
            Restart Options
          </h2>
          <p className="text-sm text-secondary mb-6">
            Choose what you want to restart
          </p>

          <div className="space-y-3">
            <button
              onClick={() => handleRestart("Restart Server")}
              disabled={restarting}
              className="btn btn-warning w-full"
            >
              <FiRotateCw className={`h-4 w-4 ${restarting ? "animate-spin" : ""}`} />
              Restart All Services
            </button>
            <button
              onClick={() => handleRestart("Restart Web Server")}
              disabled={restarting}
              className="btn btn-secondary w-full"
            >
              <FiServer className="h-4 w-4" />
              Restart Web Server
            </button>
            <button
              onClick={() => handleRestart("Restart Database")}
              disabled={restarting}
              className="btn btn-secondary w-full"
            >
              <FiServer className="h-4 w-4" />
              Restart Database
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
