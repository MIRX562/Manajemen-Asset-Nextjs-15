"use client";

import { getCurrentSession } from "@/lib/auth";
import { User } from "@prisma/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface UserContextValue {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const cachedUser = sessionStorage.getItem("user");
      return cachedUser ? JSON.parse(cachedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(!user);

  useEffect(() => {
    if (user) return; // If user is already cached, skip fetching

    async function fetchUser() {
      setLoading(true);
      try {
        const { user } = await getCurrentSession();
        setUser(user);
        sessionStorage.setItem("user", JSON.stringify(user)); // Cache in sessionStorage
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
