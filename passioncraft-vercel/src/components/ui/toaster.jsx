import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@radix-ui/react-toast"
import { useState, useCallback } from "react"

export function Toaster() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    setToasts((prev) => [...prev, { ...toast, id: Math.random().toString(36).slice(2) }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          className="bg-[var(--bg-card)] border border-[var(--border-dim)] rounded-lg p-4 shadow-lg"
          onOpenChange={(open) => !open && removeToast(toast.id)}
        >
          {toast.title && <ToastTitle className="text-[var(--text-primary)] font-medium">{toast.title}</ToastTitle>}
          {toast.description && <ToastDescription className="text-[var(--text-secondary)] text-sm mt-1">{toast.description}</ToastDescription>}
          <ToastClose className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            ×
          </ToastClose>
        </Toast>
      ))}
      <ToastViewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" />
    </ToastProvider>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, title, description, variant }])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return { toast, toasts }
}
