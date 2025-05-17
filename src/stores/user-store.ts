import { create } from "zustand";
import { getCurrentSession } from "@/lib/auth";

interface SessionUser {
  id: number;
  email: string;
  username: string;
  role: string;
}

interface UserState {
  user: SessionUser | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user:
    typeof window !== "undefined" && sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string)
      : null,
  loading: true,
  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  },
  fetchUser: async () => {
    set({ loading: true });
    try {
      const { user } = await getCurrentSession();
      set({ user });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));
