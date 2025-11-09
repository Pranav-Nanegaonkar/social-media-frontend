import { createContext, useEffect, useState, type ReactNode } from "react";
import { makeRequest } from "../utils/axios";

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  profilePic?: string;
  coverPic?: string;
  city?: string;
  website?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  setCurrentUser: () => {},
  isLoading: true,
  checkAuth: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  

  const checkAuth = async () => {
    try {
      const res = await makeRequest.get("/auth/me");
      if (res.data?.user) {
        setCurrentUser(res.data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.log("User not authenticated");
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await makeRequest.post("/auth/logout");
    } finally {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isLoading, checkAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
