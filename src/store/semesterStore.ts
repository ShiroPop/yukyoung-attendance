import { create } from "zustand";

interface SemesterStore {
  semester: string;
  setSemester: (semester: string) => void;
}

export const useSemesterStore = create<SemesterStore>((set) => ({
  semester: "2025-08-25",
  setSemester: (semester) => set({ semester }),
}));
