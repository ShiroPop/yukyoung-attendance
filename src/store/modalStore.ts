import { create } from "zustand";

interface ModalState {
  isModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  resetModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isModal: false,
  openModal: () => set({ isModal: true }),
  closeModal: () => set({ isModal: false }),
  resetModal: () => set({ isModal: false }),
}));
