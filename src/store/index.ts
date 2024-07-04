import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  address: {
    city: string;
    geo: {
      lat: string;
      lng: string;
    };
    suite: string;
    zipcode: string;
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  phone: string;
  username: string;
  website: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  })),
);
