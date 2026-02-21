import { create } from "zustand";

interface UserType {
  id: string;
  role: string;
  assigned_classes: string[];
}

interface UserStore {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  addAssignedClass: (className: string) => void;
  loginError: string;
  setLoginError: (loginError: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  addAssignedClass: (className) =>
    set((state) => {
      if (!state.user) return state;
      if (state.user.assigned_classes.includes(className)) return state;
      return {
        user: {
          ...state.user,
          assigned_classes: [...state.user.assigned_classes, className],
        },
      };
    }),
  loginError: "",
  setLoginError: (loginError) => set({ loginError }),
}));
