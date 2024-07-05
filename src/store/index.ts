import { router } from "@/router";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  address: {
    street: string;
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
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: getUserFromLocalStorage(),
    setUser: (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    },
    logout: () => {
      localStorage.removeItem("user");
      set({ user: null });
      router.navigate("/auth/login");
    },
  })),
);
