import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/auth";

/** Keeps protected UI hidden while the real Supabase session is verified. */
export function AdminGate({ children }: { children: ReactNode }) {
  const { loading, isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) void navigate({ to: "/admin/login", replace: true });
  }, [isAdmin, loading, navigate]);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking secure admin session…</div>;
  if (!isAdmin) return null;
  return <>{children}</>;
}
