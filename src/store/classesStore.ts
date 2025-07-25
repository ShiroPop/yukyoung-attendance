import { create } from "zustand";

interface Classes {
  id: string;
  semester_id: string;
  name: string;
}

interface ClassesStore {
  classes: Classes[] | null;
  setClasses: (classes: Classes[]) => void;
  classType: Classes[] | Classes | null;
  setClassType: (classType: Classes) => void;
}

export const useClassesStore = create<ClassesStore>((set) => ({
  classes: [],
  setClasses: (classes) => set({ classes }),
  classType: null,
  setClassType: (classType) => set({ classType }),
}));
