import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  isLoading: boolean;
  notifications: Notification[];
  openModals: {
    [key: string]: boolean;
  };

  // Actions
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  toggleModal: (modalName: string, open?: boolean) => void;
  clearNotifications: () => void;
}

const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  notifications: [],
  openModals: {},

  setLoading: (isLoading) => set({ isLoading }),

  addNotification: (notification) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    if (notification.duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  toggleModal: (modalName, open) =>
    set((state) => ({
      openModals: {
        ...state.openModals,
        [modalName]: open !== undefined ? open : !state.openModals[modalName],
      },
    })),

  clearNotifications: () => set({ notifications: [] }),
}));

export default useUIStore;
