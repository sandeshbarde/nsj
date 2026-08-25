import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env["VITE_SUPABASE_URL"] || "https://gomaxddyqxlddxlldrzg.supabase.co";
// Support both the standard anon key name and the legacy publishable key name
const supabaseAnonKey =
  import.meta.env["VITE_SUPABASE_ANON_KEY"] ??
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvbWF4ZGR5cXhsZGR4bGxkcnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODIxNzAsImV4cCI6MjEwMjQ1ODE3MH0.bAr_GGDGa_2lxkVTBeMWPQwYuq1Xwil_fUyh5U4MWQg";

export const isSupabaseConfigured = Boolean(
  import.meta.env["VITE_SUPABASE_URL"] &&
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"])
);

if (!isSupabaseConfigured) {
  console.warn(
    "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set in environment variables. Falling back to default project configuration."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

