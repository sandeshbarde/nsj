import { redirect } from "@tanstack/react-router";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AdminAccess =
  | { ok: true; session: Session; user: User }
  | { ok: false; session: null; user: null; message: string };

/** Confirms the real browser session and the database-backed admin grant. */
export async function getAdminAccess(): Promise<AdminAccess> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    return { ok: false, session: null, user: null, message: "Your admin session has expired. Please login again." };
  }

  // getUser() re-validates the JWT against Supabase Auth servers (more secure than getSession alone).
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, session: null, user: null, message: "Could not validate your session. Please login again." };
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError) {
    const isConnErr = /fetch|network|failed to fetch/i.test(adminError.message);
    const message = isConnErr
      ? "Could not reach Supabase. Check your internet connection and try again."
      : `Admin check failed (${adminError.code ?? adminError.message}). Please try again.`;
    console.error("Admin authorization lookup failed:", adminError);
    return { ok: false, session: null, user: null, message };
  }

  if (!adminUser) {
    return { ok: false, session: null, user: null, message: "This account does not have admin access." };
  }

  return { ok: true, session: sessionData.session, user: userData.user };
}

export async function isAdmin() {
  return (await getAdminAccess()).ok;
}

/**
 * TanStack route guard for every protected admin route.
 * NOTE: No SSR bypass — if the session check fails for any reason, the user
 * is redirected to login. This ensures no admin page is silently left unguarded.
 */
export async function requireAdmin() {
  if (!(await isAdmin())) throw redirect({ to: "/admin/login" });
}
