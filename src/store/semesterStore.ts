import { create } from "zustand";

interface SemesterStore {
  semester: string;
  setSemester: (semester: string) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSemesterStore = create<SemesterStore>((set) => ({
  semester: "2025-08-25",
  setSemester: (semester) => set({ semester }),
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
