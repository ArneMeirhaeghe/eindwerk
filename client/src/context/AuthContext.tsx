// src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from 'react';

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
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Bij opstart: token uit storage, decoderen en expiry-check
  useEffect(() => {
    const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
    const storedToken = storage.getItem('token');
    const storedRole = storage.getItem('role');

    if (storedToken) {
      const payload = decodeToken(storedToken);
      const now = Date.now().valueOf() / 1000;

      if (payload?.exp && payload.exp < now) {
        // verlopen of ongeldig
        storage.clear();
      } else {
        setToken(storedToken);
        setRole(payload?.role || storedRole || null);
      }
    }

    setLoading(false);
  }, []);

  const login = (jwt: string, remember: boolean = true) => {
    const payload = decodeToken(jwt);
    if (!payload) return console.error('Invalid JWT');

    setToken(jwt);
    setRole(payload.role || null);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', jwt);
    if (payload.role) storage.setItem('role', payload.role);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
