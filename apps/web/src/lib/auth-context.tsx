"use client";
import { API_URL } from "./config";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  customer: Customer | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "asteria-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
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
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Invalid session");
      const data = await res.json();
      setCustomer(data);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
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
    setCustomer(data.customer);
  }

  async function register(formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || "Registration failed.");
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    setToken(data.accessToken);
    setCustomer(data.customer);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCustomer(null);
  }

  return (
    <AuthContext.Provider
      value={{ customer, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}