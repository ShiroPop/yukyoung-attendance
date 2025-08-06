import { create } from "zustand";

interface DateStore {
  date: string;
  setDate: (date: string) => void;
  resetDate: () => void;
}

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useDateStore = create<DateStore>((set) => ({
  date: getToday(),
  setDate: (date) => set({ date }),
  resetDate: () => set({ date: getToday() }),
}));
