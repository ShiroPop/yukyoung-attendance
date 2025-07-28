import { create } from "zustand";
import { Student } from "../utils/getClassStudentsAttendance";

interface StudentsState {
  students: Student[];
  setStudents: (students: Student[]) => void;
  clearStudents: () => void;
}

export const useStudentsStore = create<StudentsState>((set) => ({
  students: [],
  setStudents: (students) => set({ students }),
  clearStudents: () => set({ students: [] }),
}));
