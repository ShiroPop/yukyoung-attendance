import { create } from "zustand";

interface CalendarDateStore {
  year: number;
  setYear: (year: number) => void;
  month: number;
  setMonth: (month: number) => void;
}

const getYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  return year;
};

const getMonth = () => {
  const today = new Date();
  const month = today.getMonth();
  return month;
};

export const useCalendarDateStore = create<CalendarDateStore>((set) => ({
  year: getYear(),
  setYear: (year) => set({ year }),
  month: getMonth(),
  setMonth: (month) => set({ month }),
}));
