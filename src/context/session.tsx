"use client";

import { getCurrentUser } from "@/actions/get-current-user";
import { getCurrentSession } from "@/lib/auth";
import { User } from "@prisma/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Define the user type based on your server action's return type

// Define the context value type
interface UserContextValue {
  user: User | null;
  loading: boolean;
}

// Create the context
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Props for the provider
interface UserProviderProps {
  children: ReactNode;
}

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const { user } = await getCurrentSession();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
