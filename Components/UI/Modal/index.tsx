import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../../utils/cn"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  theme: "light" | "dark"
  showclose?: boolean
}

export default function Modal({ isOpen, onClose, children, title, theme, showclose = false }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle escape key press
  useEffect(() => {
    setIsMounted(true)

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4",
            theme === "dark" ? "bg-black/50" : "bg-black/25",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={contentRef}
            className={cn(
              "relative w-full max-w-lg rounded-lg shadow-xl",
              theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900",
            )}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b p-4">
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {showclose && (
                <button
                  onClick={onClose}
                  className={cn(
                    "ml-auto rounded-full p-1.5 transition-colors",
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                  )}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

