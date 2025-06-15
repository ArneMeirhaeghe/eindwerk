// File: src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";

interface JwtPayload {
  exp?: number;
  role?: string;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeToken(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split(".")[1];
    const decoded = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Bij opstart: kijk of er al een token in storage staat
  useEffect(() => {
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    const storedToken = storage.getItem("token");
    if (storedToken) {
      const payload = decodeToken(storedToken);
      const now = Date.now().valueOf() / 1000;
if (payload) {
      if (payload?.exp && payload.exp < now) {
        // Token verlopen → leegmaken
        storage.removeItem("token");
        storage.removeItem("role");
      } else {
        setToken(storedToken);
        setRole(payload.role || storage.getItem("role") || null);
      }
    }
  }
    setLoading(false);
  }, []);

  const login = (jwt: string, remember: boolean = true) => {
    const payload = decodeToken(jwt);
    if (!payload) return console.error("Invalid JWT");

    setToken(jwt);
    setRole(payload.role || null);

    // Kies opslag: localStorage of sessionStorage
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", jwt);
    if (payload.role) storage.setItem("role", payload.role);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    // Optioneel: redirect naar login
    window.location.href = "/#/login";
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
