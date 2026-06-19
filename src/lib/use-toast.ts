"use client";

import { useState, useCallback } from "react";
import type { ToastData, ToastType } from "@/components/ui/Toast";

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (msg: string) => addToast(msg, "success"),
    [addToast]
  );
  const error = useCallback(
    (msg: string) => addToast(msg, "error"),
    [addToast]
  );
  const info = useCallback(
    (msg: string) => addToast(msg, "info"),
    [addToast]
  );

  return { toasts, dismissToast, success, error, info };
}
