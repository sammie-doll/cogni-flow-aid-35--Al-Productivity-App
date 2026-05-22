import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "cogniflow.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const value: AuthCtx = {
    user,
    isAuthenticated: !!user,
    ready,
    async login(email) {
      await new Promise((r) => setTimeout(r, 400));
      persist({ id: crypto.randomUUID(), name: email.split("@")[0] || "User", email });
    },
    async signup(name, email) {
      await new Promise((r) => setTimeout(r, 400));
      persist({ id: crypto.randomUUID(), name, email });
    },
    async loginGoogle() {
      await new Promise((r) => setTimeout(r, 400));
      persist({ id: crypto.randomUUID(), name: "Google User", email: "google.user@gmail.com" });
    },
    async loginDemo() {
      await new Promise((r) => setTimeout(r, 200));
      persist({ id: "demo", name: "Demo User", email: "demo@cogniflow.ai" });
    },
    logout() {
      persist(null);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
