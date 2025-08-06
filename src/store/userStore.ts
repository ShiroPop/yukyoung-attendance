import { create } from "zustand";

interface UserType {
  id: string;
  role: string;
  assigned_classes: string[];
}

interface UserStore {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  loginError: string;
  setLoginError: (loginError: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  loginError: "",
  setLoginError: (loginError) => set({ loginError }),
}));
