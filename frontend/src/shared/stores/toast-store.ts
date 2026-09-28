import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: number) => void;
}

let toastId = 0;

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  dismissToast: (id) => set((state) => ({
    toasts: state.toasts.filter((toast) => toast.id !== id),
  })),
  showToast: (message, type = 'info') => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    window.setTimeout(() => get().dismissToast(id), 4_000);
  },
}));
