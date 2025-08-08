import { create } from "zustand";

interface SelectedDateStore {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  resetSelectedDate: () => void;
}

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useSelectedDateStore = create<SelectedDateStore>((set) => ({
  selectedDate: getToday(),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  resetSelectedDate: () => set({ selectedDate: getToday() }),
}));
