"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const config: Record<
  ToastType,
  { icon: typeof CheckCircle; classes: string }
> = {
  success: {
    icon: CheckCircle,
    classes: "bg-emerald-50 border-emerald-200 text-emerald-800",
  },
  error: {
    icon: XCircle,
    classes: "bg-red-50 border-red-200 text-red-700",
  },
  info: {
    icon: AlertCircle,
    classes: "bg-blue-50 border-blue-200 text-blue-700",
  },
};

export function Toast({ toast, onDismiss }: ToastProps) {
  const { icon: Icon, classes } = config[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 border rounded-xl px-4 py-3 shadow-lg text-sm font-medium min-w-[260px] ${classes}`}
    >
      <Icon size={18} className="shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={15} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 left-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
