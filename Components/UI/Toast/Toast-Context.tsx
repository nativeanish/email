class GlobalToastManager {
  private listeners: ((toast: Omit<Toast, "id">) => void)[] = []

  subscribe(listener: (toast: Omit<Toast, "id">) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  emit(toast: Omit<Toast, "id">) {
    this.listeners.forEach((listener) => listener(toast))
  }
}

const globalToastManager = new GlobalToastManager()
export const showToast = (toast: Omit<Toast, "id">) => {
  globalToastManager.emit(toast)
}

export const showSuccess = (title: string, message?: string, duration?: number) => {
  showToast({ type: "success", title, message, duration })
}

export const showWarning = (title: string, message?: string, duration?: number) => {
  showToast({ type: "warning", title, message, duration })
}

export const showDanger = (title: string, message?: string, duration?: number) => {
  showToast({ type: "danger", title, message, duration })
}

export const showAlert = (title: string, message?: string, duration?: number) => {
  showToast({ type: "alert", title, message, duration })
}

export const showDisclaimer = (title: string, message?: string, duration?: number) => {
  showToast({ type: "disclaimer", title, message, duration })
}

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export type ToastType = "success" | "warning" | "danger" | "alert" | "disclaimer"

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    setToasts((prev) => [newToast, ...prev])

    const duration = toast.duration || 5000
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    const unsubscribe = globalToastManager.subscribe(addToast)
    return unsubscribe
  }, [addToast])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
