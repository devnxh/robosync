import React, { useEffect } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import type { ToastType } from '../../store/useAppStore'

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-success shrink-0" />,
  error: <XCircle size={16} className="text-error shrink-0" />,
  info: <Info size={16} className="text-accent shrink-0" />,
  warning: <AlertTriangle size={16} className="text-warning shrink-0" />,
}

const borderMap: Record<ToastType, string> = {
  success: 'border-success/30',
  error: 'border-error/30',
  info: 'border-accent/30',
  warning: 'border-warning/30',
}

export const ToastContainer: React.FC = () => {
  const toasts = useAppStore((s) => s.toasts)
  const removeToast = useAppStore((s) => s.removeToast)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onDismiss={removeToast}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  id: string
  type: ToastType
  title?: string
  message: string
  onDismiss: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ id, type, title, message, onDismiss }) => {
  useEffect(() => {
    // Auto-dismiss is handled by the store setTimeout, but add a safety net
    const timer = setTimeout(() => onDismiss(id), 10000)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 w-80 px-4 py-3 bg-surface border
        ${borderMap[type]} rounded-xl shadow-2xl shadow-black/40
        animate-in slide-in-from-right`}
      role="alert"
    >
      {iconMap[type]}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold text-text-primary leading-tight">{title}</p>
        )}
        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="p-0.5 rounded hover:bg-bg-hover text-text-subtle hover:text-text-muted transition-colors shrink-0"
      >
        <X size={12} />
      </button>
    </div>
  )
}
