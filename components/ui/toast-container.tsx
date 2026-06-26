"use client";

import { useToastStore } from "@/lib/toast-store";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertTriangle, FiCheck, FiInfo, FiX } from "react-icons/fi";

const iconMap = {
  success: FiCheck,
  error: FiX,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const colorMap = {
  success: { border: "border-success/20", bg: "bg-success/5", icon: "text-success" },
  error: { border: "border-error/20", bg: "bg-error/5", icon: "text-error" },
  warning: { border: "border-warning/20", bg: "bg-warning/5", icon: "text-warning" },
  info: { border: "border-accent/20", bg: "bg-accent/5", icon: "text-accent" },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          const colors = colorMap[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`pointer-events-auto rounded-2xl border p-4 backdrop-blur-xl ${colors.border} bg-card/95 shadow-lg shadow-black/10`}
              onClick={() => removeToast(toast.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card">
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">{toast.title}</p>
                  {toast.message && (
                    <p className="text-xs text-secondary mt-0.5 line-clamp-2">
                      {toast.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(toast.id);
                  }}
                  className="shrink-0 p-1 text-secondary hover:text-primary transition-colors rounded-lg hover:bg-card-hover"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
