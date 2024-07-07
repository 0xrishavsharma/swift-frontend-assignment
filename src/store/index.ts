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

export interface UserActivity {
  page: number;
  pageSize: number;
  sortType: "postId" | "name" | "email";
  sortMode: "ascending" | "descending" | "none";
  searchQuery?: string;
}

interface UserActivityState {
  userActivity: UserActivity;
  setUserActivity: (userActivity: UserActivity) => void;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  userActivity: UserActivity;
  setUserActivity: (userActivity: UserActivity) => void;
}
const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
const getUserActivityFromLocalStorage = (): UserActivity => {
  const userActivity = localStorage.getItem("userActivity");
  return userActivity
    ? JSON.parse(userActivity)
    : { page: 1, pageSize: 10, sortType: "postId", sortMode: "none" };
};
export const useAuthStore = create<AuthState & UserActivityState>()(
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
    userActivity: getUserActivityFromLocalStorage(),
    setUserActivity: (userActivity) => {
      localStorage.setItem("userActivity", JSON.stringify(userActivity));
      set({ userActivity });
    },
  })),
);
