import { create } from "zustand";

interface SemesterStore {
  semester: string;
  setSemester: (semester: string) => void;
}

export const useSemesterStore = create<SemesterStore>((set) => ({
  semester: "2025-03-03",
  setSemester: (semester) => set({ semester }),
}));
