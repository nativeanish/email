import { create } from "zustand";

export interface Notification {
  id: string;
  date: number; // Unix timestamp
  log: string;
  seen: boolean;
}

interface NotificationState {
  notifications: Notification[];
  isDrawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  addNotification: (notification: Notification[]) => void;
}

const useNotification = create<NotificationState>((set) => ({
  notifications: [
  ],
  isDrawerOpen: false,
  setDrawerOpen: (isOpen: boolean) => set({ isDrawerOpen: isOpen }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        seen: true,
      })),
    })),
  markAsRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, seen: true } : notification
      ),
    })),
  addNotification: (notification) =>
    set(() => ({
      notifications: notification,
    })),
}));

export default useNotification;
