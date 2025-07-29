import { create } from "zustand";

type Student = {
  id: string;
  name: string;
  classId: string;
  state?: number;
};

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
