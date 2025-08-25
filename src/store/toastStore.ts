import { create } from "zustand";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  show: (msg: string, type?: ToastType) => void;
  hide: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (msg, type: ToastType = "success") => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message: msg, type }] }));
    setTimeout(
      () =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      3000
    );
  },
  hide: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
