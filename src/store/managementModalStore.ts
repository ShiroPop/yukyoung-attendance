import { create } from "zustand";

type ManagementTab = "semester" | "class" | "student" | "teacher";

interface ManagementModalStore {
  isOpen: boolean;
  activeTab: ManagementTab;
  openModal: () => void;
  closeModal: () => void;
  setActiveTab: (tab: ManagementTab) => void;
}

export const useManagementModalStore = create<ManagementModalStore>((set) => ({
  isOpen: false,
  activeTab: "semester",
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, activeTab: "semester" }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));
