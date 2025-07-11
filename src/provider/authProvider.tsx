import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import api from "../api";

interface User {
  _attachments: string;
  _etag: string;
  _rid: string;
  _self: string;
  _ts: number;
  active: number;
  created_at: string;
  date_of_birth: string | null;
  email: string;
  first_name: string;
  id: string;
  last_login: string | null;
  last_name: string;
  organization_Id: string | null;
  organization_name: string | null;
  phone_number: string | null;
  updated_at: string | null;
  user_id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    // Check session on app load
    useEffect(() => {

      //ORIGINAL CODE:
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    }, []);
  


  const login = useCallback(  
    async (credentials: { username: string; password: string }) => {
      await api.post("/auth/login", credentials);
      const res = await api.get("/auth/me");
      setUser(res.data);
    },
    []
  );

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, login, logout, isLoading }),
    [user, login, logout, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
