"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Staff = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
};

type AdminAuthContextType = {
  staff: Staff | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);
const TOKEN_KEY = "asteria-admin-token";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      fetchMe(saved);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchMe(authToken: string) {
    try {
      const res = await fetch("http://localhost:3001admin/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Invalid session");
      const data = await res.json();
      setStaff(data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setStaff(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch("http://localhost:3001admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Login failed.");
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setToken(data.accessToken);
    setStaff(data.staff);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setStaff(null);
  }

  function hasPermission(permission: string) {
    return staff?.permissions.includes(permission) ?? false;
  }

  return (
    <AdminAuthContext.Provider
      value={{ staff, token, loading, login, logout, hasPermission }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}