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

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, session: null, user: null, message: "Your admin session has expired. Please login again." };
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Admin authorization lookup failed:", adminError);
    return { ok: false, session: null, user: null, message: "Could not verify admin access. Please try again." };
  }
  if (!adminUser) {
    return { ok: false, session: null, user: null, message: "Your account is authenticated but is not an admin." };
  }

  return { ok: true, session: sessionData.session, user: userData.user };
}

export async function isAdmin() {
  return (await getAdminAccess()).ok;
}

/** TanStack route guard for every protected admin route. */
export async function requireAdmin() {
  if (typeof window === "undefined") return;
  if (!(await isAdmin())) throw redirect({ to: "/admin/login" });
}
