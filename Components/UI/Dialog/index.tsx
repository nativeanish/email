import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import useLoading  from "../../../store/useLoading";

export default function Dialog() {
  const {
    isOpen,
    title,
    description,
    isDarkMode,
    size,
    close,
    showCloseButton,
  } = useLoading();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-xs",
    md: "max-w-sm",
    lg: "max-w-md",
  };

  const spinnerSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 ${
              isDarkMode
                ? "bg-black/80 backdrop-blur-sm"
                : "bg-black/50 backdrop-blur-sm"
            }`}
            onClick={showCloseButton ? close : undefined}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            className={`
              relative w-full ${sizeClasses[size]} mx-auto
              ${
                isDarkMode
                  ? "bg-gray-900 border border-gray-700"
                  : "bg-white border border-gray-200"
              }
              rounded-2xl shadow-2xl p-6 sm:p-8
            `}
          >
            {showCloseButton && (
              <button
                onClick={close}
                className={`
                  absolute top-4 right-4 p-1 rounded-full transition-colors
                  ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className={`
                    ${spinnerSizes[size]}
                    ${isDarkMode ? "text-blue-400" : "text-blue-600"}
                  `}
                >
                  <Loader2 className="w-full h-full" />
                </motion.div>

                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className={`
                    absolute inset-0 rounded-full border-2
                    ${isDarkMode ? "border-blue-400/30" : "border-blue-600/30"}
                  `}
                />
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`
                  text-lg sm:text-xl font-semibold
                  ${isDarkMode ? "text-white" : "text-gray-900"}
                `}
              >
                {title}
              </motion.h3>

              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`
                    text-sm sm:text-base leading-relaxed
                    ${isDarkMode ? "text-gray-300" : "text-gray-600"}
                  `}
                >
                  {description}
                </motion.p>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
