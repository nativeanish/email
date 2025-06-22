import { create } from "zustand";

type DialogSize = "sm" | "md" | "lg";

interface LoadingDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  isDarkMode: boolean;
  size: DialogSize;
  showCloseButton: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;
  setDarkMode: (val: boolean) => void;
  setSize: (size: DialogSize) => void;
  setShowCloseButton: (val: boolean) => void;
  setAll: (props: Partial<Omit<LoadingDialogState, "open" | "close" | "toggle" | "setTitle" | "setDescription" | "setDarkMode" | "setSize" | "setShowCloseButton" | "setAll">>) => void;
}

const useLoading = create<LoadingDialogState>((set) => ({
  isOpen: false,
  title: "Loading...",
  description: "Please wait while we process your request",
  isDarkMode: false,
  size: "md",
  showCloseButton: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setDarkMode: (isDarkMode) => set({ isDarkMode }),
  setSize: (size) => set({ size }),
  setShowCloseButton: (showCloseButton) => set({ showCloseButton }),
  setAll: (props) => set((state) => ({ ...state, ...props })),
}));

export default useLoading;