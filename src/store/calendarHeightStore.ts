import { create } from "zustand";

interface CalendarHeightStore {
  calendarHeight: number;
  setCalendarHeight: (calendarHeight: number) => void;
  isChildListShrunk: boolean;
  openChildList: () => void;
  closeChildList: () => void;
  resetChildList: () => void;
}

export const useCalendarHeightStore = create<CalendarHeightStore>((set) => ({
  calendarHeight: 0,
  setCalendarHeight: (calendarHeight) => set({ calendarHeight }),
  isChildListShrunk: false,
  openChildList: () => set({ isChildListShrunk: true }),
  closeChildList: () => set({ isChildListShrunk: false }),
  resetChildList: () => set({ isChildListShrunk: false }),
}));
