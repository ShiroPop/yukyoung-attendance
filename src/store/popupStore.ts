import { create } from "zustand";

interface PopupState {
  isPopup: boolean;
  openPopup: () => void;
  closePopup: () => void;
  resetPopup: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  isPopup: false,
  openPopup: () => set({ isPopup: true }),
  closePopup: () => set({ isPopup: false }),
  resetPopup: () => set({ isPopup: false }),
}));
