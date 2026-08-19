import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getAdminAccess } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const access = await getAdminAccess();
    setSession(access.ok ? access.session : null);
    setUser(access.ok ? access.user : null);
    setIsAdmin(access.ok);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      void refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  const value = useMemo(() => ({ loading, session, user, isAdmin, refresh }), [loading, session, user, isAdmin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAdminAuth must be used within AuthProvider");
  return auth;
}
