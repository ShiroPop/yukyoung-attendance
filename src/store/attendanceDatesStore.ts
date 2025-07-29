import { create } from "zustand";

interface AttendanceDate {
  id: string;
}

interface AttendanceDatesState {
  attendanceDates: AttendanceDate[];
  setAttendanceDates: (dates: AttendanceDate[]) => void;
  clearAttendanceDates: () => void;
}

export const useAttendanceDatesStore = create<AttendanceDatesState>((set) => ({
  attendanceDates: [],
  setAttendanceDates: (attendanceDates) => set({ attendanceDates }),
  clearAttendanceDates: () => set({ attendanceDates: [] }),
}));
