import React, { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, FileText, ImageIcon, Check } from "lucide-react"
import useFileStore from "../../store/useFileStore.ts"

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  maxFileSize?: number
  isDarkMode?: boolean
}
export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  maxFileSize = 25,
  isDarkMode = false,
}) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const theme = isDarkMode ? "dark" : "light"
  // Use Zustand store
  const { files, addFiles, removeFile, toggleFileSelection } = useFileStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files), maxFileSize)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files), maxFileSize)
    }
  }

  const handleAttachFiles = () => {
    onClose()
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "img"].includes(extension || "")) {
      return <ImageIcon className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} size={20} />
    }

    return <FileText className={`${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} size={20} />
  }

  if (!isOpen) return null

  // Theme-based styles
  const styles = {
    backdrop: {
      light: "fixed inset-0 bg-black/30 backdrop-blur-sm z-50",
      dark: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50",
    },
    modal: {
      light: "bg-white rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden",
      dark: "bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-auto overflow-hidden text-white",
    },
    header: {
      light: "border-b border-gray-100",
      dark: "border-b border-gray-800",
    },
    dropzone: {
      light: "border-2 border-dashed border-gray-200 bg-gray-50",
      dark: "border-2 border-dashed border-gray-700 bg-gray-800",
    },
    dropzoneActive: {
      light: "border-blue-400 bg-blue-50",
      dark: "border-blue-500 bg-gray-700",
    },
    button: {
      primary: {
        light: "bg-blue-500 hover:bg-blue-600 text-white",
        dark: "bg-blue-600 hover:bg-blue-700 text-white",
      },
      secondary: {
        light: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        dark: "bg-gray-800 hover:bg-gray-700 text-gray-200",
      },
    },
    fileItem: {
      light: "border border-gray-100 bg-white",
      dark: "border border-gray-800 bg-gray-900",
    },
    checkbox: {
      unchecked: {
        light: "border-2 border-gray-300 bg-white",
        dark: "border-2 border-gray-600 bg-gray-800",
      },
      checked: {
        light: "border-2 border-blue-500 bg-blue-500",
        dark: "border-2 border-blue-600 bg-blue-600",
      },
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop[theme]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="flex items-center justify-center min-h-screen p-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <motion.div className={styles.modal[theme]} onClick={(e) => e.stopPropagation()} layoutId="upload-modal">
            {/* Header */}
            <div className={`p-4 ${styles.header[theme]}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Upload and attach files</h2>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    Attachments will be a part of this project.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-1 rounded-full ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Drop zone */}
            <div className="p-4">
              <div
                className={`${styles.dropzone[theme]} ${isDragging ? styles.dropzoneActive[theme] : ""
                  } rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  className={`p-4 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-blue-100"} mb-4`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload size={24} className={theme === "dark" ? "text-blue-400" : "text-blue-500"} />
                </motion.div>
                <p className="font-medium mb-1">
                  <span className="text-blue-500">Click to Upload</span> or drag and drop
                </p>
                <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" multiple />
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="px-4 pb-2">
                <p className="text-sm font-medium mb-2">
                  {files.length} {files.length === 1 ? "file" : "files"} added
                </p>
                <div
                  className="space-y-3 max-h-60 overflow-y-auto pr-1 file-list-scrollbar"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      theme === "dark"
                        ? "rgba(59, 130, 246, 0.5) rgba(31, 41, 55, 0.5)"
                        : "rgba(59, 130, 246, 0.5) rgba(243, 244, 246, 0.5)",
                  }}
                >
                  <style>{`
                    .file-list-scrollbar::-webkit-scrollbar {
                      width: 6px;
                      height: 6px;
                    }
                    .file-list-scrollbar::-webkit-scrollbar-track {
                      background: ${theme === "dark" ? "rgba(31, 41, 55, 0.5)" : "rgba(243, 244, 246, 0.5)"};
                      border-radius: 10px;
                    }
                    .file-list-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(59, 130, 246, 0.5);
                      border-radius: 10px;
                    }
                    .file-list-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: rgba(59, 130, 246, 0.7);
                    }
                  `}</style>
                  <AnimatePresence>
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        className={`${styles.fileItem[theme]} p-3 rounded-lg`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        layout
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer ${file.selected ? styles.checkbox.checked[theme] : styles.checkbox.unchecked[theme]
                              }`}
                            onClick={() => toggleFileSelection(file.id)}
                          >
                            {file.selected && <Check size={12} className="text-white" />}
                          </div>
                          {getFileIcon(file.file.name)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.file.name}</p>
                            <div className="flex items-center text-xs">
                              <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                                {(file.file.size / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className={`p-1 rounded-full ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                              }`}
                          >
                            <X size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 flex justify-between items-center mt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="text-sm">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                  {(() => {
                    const selectedCount = files.filter((f) => f.selected).length
                    return selectedCount > 0
                      ? `${selectedCount} file${selectedCount !== 1 ? "s" : ""} selected`
                      : "No files selected"
                  })()}
                </span>
              </div>
              <div className="flex gap-3">
                <motion.button
                  className={`py-2 px-4 rounded-lg font-medium ${styles.button.secondary[theme]}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={`py-2 px-4 rounded-lg font-medium ${styles.button.primary[theme]}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAttachFiles}
                >
                  Attach files
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

