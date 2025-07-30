import { create } from "zustand";

interface CalendarHeightStore {
  calendarHeight: number;
  setCalendarHeight: (calendarHeight: number) => void;
}

export const useCalendarHeightStore = create<CalendarHeightStore>((set) => ({
  calendarHeight: 0,
  setCalendarHeight: (calendarHeight) => set({ calendarHeight }),
}));
