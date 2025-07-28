import { create } from "zustand";

interface DateStore {
  date: string;
  setDate: (date: string) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  date: "",
  setDate: (date) => set({ date }),
}));
