import { create } from "zustand";

interface AttendanceDate {
  id: string;
}

interface AttendanceDatesState {
  dates: AttendanceDate[];
  setDates: (dates: AttendanceDate[]) => void;
  clearDates: () => void;
}

export const useAttendanceDatesStore = create<AttendanceDatesState>((set) => ({
  dates: [],
  setDates: (dates) => set({ dates }),
  clearDates: () => set({ dates: [] }),
}));
