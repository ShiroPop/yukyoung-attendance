import { create } from "zustand";

interface Classes {
  id: string;
  semester_id?: string;
  name?: string;
}

interface ClassesStore {
  classes: Classes[] | null;
  setClasses: (classes: Classes[]) => void;
  classId: Classes;
  setClassId: (classId: Classes) => void;
}

export const useClassesStore = create<ClassesStore>((set) => ({
  classes: [],
  setClasses: (classes) => set({ classes }),
  classId: { id: "전체" },
  setClassId: (classId) => set({ classId }),
}));
