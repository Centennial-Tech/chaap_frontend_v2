import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

// Define the User type (customize this to match your actual user object)
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  user: User | null;
  login: () => void;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken_] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
    axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;
    localStorage.setItem("token", newToken as any);
  };

  const login = useCallback((token: string) => {
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const contextValue: AuthContextType = useMemo(
    () => ({
      token,
      setToken,
      logout,
      setUser,
      user,
      login,
    }),
    [token, logout, user, login]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use the AuthContext safely
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
