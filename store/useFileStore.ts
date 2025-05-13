import { create } from "zustand"

export interface UploadFile {
  id: string
  file: File
  selected: boolean
}

interface FileStore {
  files: UploadFile[]
  addFiles: (newFiles: File[], maxFileSize: number) => void
  removeFile: (id: string) => void
  toggleFileSelection: (id: string) => void
  getSelectedFiles: () => File[]
  clearFiles: () => void
  clearSelectedFiles: () => void
}

const useFileStore = create<FileStore>((set, get) => ({
  files: [],

  addFiles: (newFiles: File[], maxFileSize: number) => {
    const validFiles = newFiles.filter((file) => file.size <= maxFileSize * 1024 * 1024)

    const newUploadFiles: UploadFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      selected: true,
    }))

    set((state) => ({
      files: [...state.files, ...newUploadFiles],
    }))
  },

  removeFile: (id: string) => {
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    }))
  },

  toggleFileSelection: (id: string) => {
    set((state) => ({
      files: state.files.map((file) => (file.id === id ? { ...file, selected: !file.selected } : file)),
    }))
  },

  getSelectedFiles: () => {
    const state = get()
    return state.files.filter((file) => file.selected).map((file) => file.file)
  },

  clearFiles: () => {
    set({ files: [] })
  },

  clearSelectedFiles: () => {
    set((state) => ({
      files: state.files.map((file) => ({ ...file, selected: false })),
    }))
  }
}))
export default useFileStore;
