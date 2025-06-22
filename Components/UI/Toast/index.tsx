import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, FileText } from "lucide-react"
import { type Toast as ToastType, useToast } from "./Toast-Context"

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
    closeColor: "text-green-500 hover:text-green-700",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    titleColor: "text-amber-800",
    messageColor: "text-amber-700",
    closeColor: "text-amber-500 hover:text-amber-700",
  },
  danger: {
    icon: AlertCircle,
    bgColor: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
    closeColor: "text-red-500 hover:text-red-700",
  },
  alert: {
    icon: Info,
    bgColor: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
    closeColor: "text-blue-500 hover:text-blue-700",
  },
  disclaimer: {
    icon: FileText,
    bgColor: "bg-gray-50 border-gray-200",
    iconColor: "text-gray-600",
    titleColor: "text-gray-800",
    messageColor: "text-gray-700",
    closeColor: "text-gray-500 hover:text-gray-700",
  },
}

interface ToastItemProps {
  toast: ToastType
}

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast()
  const config = toastConfig[toast.type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ x: 400, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 400, opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      }}
      className={`
    ${config.bgColor} 
    border rounded-lg shadow-lg p-4
    w-full backdrop-blur-sm
    transform-gpu
  `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${config.titleColor} mb-1`}>{toast.title}</h4>
          {toast.message && <p className={`text-sm ${config.messageColor} leading-relaxed`}>{toast.message}</p>}
        </div>

        <button
          onClick={() => removeToast(toast.id)}
          className={`
            flex-shrink-0 p-1 rounded-full transition-colors duration-200
            ${config.closeColor}
            hover:bg-white/50
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none max-w-sm w-full">
      <div className="pointer-events-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
