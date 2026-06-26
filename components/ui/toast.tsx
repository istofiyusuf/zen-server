"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { FiAlertTriangle, FiCheck, FiInfo, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  addToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <FiCheck className="h-5 w-5 text-success" />;
      case "error":
        return <FiX className="h-5 w-5 text-error" />;
      case "warning":
        return <FiAlertTriangle className="h-5 w-5 text-warning" />;
      case "info":
        return <FiInfo className="h-5 w-5 text-accent" />;
    }
  };

  const getColors = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-success/20 bg-success/5";
      case "error":
        return "border-error/20 bg-error/5";
      case "warning":
        return "border-warning/20 bg-warning/5";
      case "info":
        return "border-accent/20 bg-accent/5";
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`pointer-events-auto rounded-2xl border p-4 backdrop-blur-xl ${getColors(
                toast.type
              )} bg-card/95 shadow-lg`}
              onClick={() => removeToast(toast.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card">
                  {getIcon(toast.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary">{toast.title}</p>
                  {toast.message && (
                    <p className="text-xs text-secondary mt-0.5">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToast(toast.id);
                  }}
                  className="shrink-0 text-secondary hover:text-primary transition-colors"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
