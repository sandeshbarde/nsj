import { redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

/** Returns true only for users explicitly granted an administrator role in Supabase. */
export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return !error && Boolean(data);
}

/** Route guard for every protected admin route. Skips SSR; the browser rechecks it. */
export async function requireAdmin() {
  if (typeof window === "undefined") return;
  if (!(await isAdmin())) {
    throw redirect({ to: "/admin/login" });
  }
}
