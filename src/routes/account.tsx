import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — NSJ Jewellery" },
      { name: "description", content: "Sign in to view your NSJ orders, wishlist and profile." },
      { property: "og:title", content: "My Account — NSJ Jewellery" },
      { property: "og:description", content: "Orders, addresses and wishlist in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

type Mode = "login" | "register" | "forgot" | "loggedin";

function Account() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Check current session
  const [session, setSession] = useState<{ email?: string | undefined } | null>(null);
  useState(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setSession({ email: data.session.user.email });
    });
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { toast.error("Enter your email and password"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) { setSession({ email: data.session.user.email }); setMode("loggedin"); }
    toast.success("Signed in successfully!");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) { toast.error("Enter your full name"); return; }
    if (!email.trim()) { toast.error("Enter your email"); return; }
    if (!password || password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setEmailSent(true);
    toast.success("Check your email to confirm your account!");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Enter your email address"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/account`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setEmailSent(true);
    toast.success("Password reset link sent to your email");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setMode("login");
    setEmail(""); setPassword(""); setName("");
    toast("Signed out");
  };

  // ── Logged In ──────────────────────────────────────────────
  if (session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <p className="eyebrow">Account</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">{session.email}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            { title: "Wishlist", text: "Your saved pieces", to: "/wishlist" as const },
            { title: "Track an order", text: "Status by order number", to: "/track-order" as const },
            { title: "Shopping bag", text: "Review and check out", to: "/cart" as const },
            { title: "Help & FAQ", text: "Common questions answered", to: "/faq" as const },
          ].map((c) => (
            <Link key={c.title} to={c.to} className="border border-border p-6 transition-colors hover:bg-secondary">
              <h2 className="font-display text-xl">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-10 border border-border px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-secondary"
        >
          Sign out
        </button>
      </div>
    );
  }

  // ── Email sent confirmation ───────────────────────────────
  if (emailSent) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center md:px-8">
        <div className="mx-auto grid size-14 place-items-center rounded-full border border-foreground">
          <span className="text-xl">✉</span>
        </div>
        <h1 className="mt-6 font-display text-2xl">Check your inbox</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {mode === "forgot"
            ? "We've sent a password reset link to your email."
            : "We've sent a confirmation link to your email. Click it to activate your account."}
        </p>
        <button
          type="button"
          onClick={() => { setEmailSent(false); setMode("login"); }}
          className="mt-8 border border-foreground px-6 py-3 text-[11px] tracking-[0.2em] uppercase"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  // ── Auth form ─────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-sm px-4 py-16 md:px-8">
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 font-display text-3xl">
        {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Reset password"}
      </h1>

      <form
        onSubmit={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleForgot}
        className="mt-8 space-y-5"
        noValidate
      >
        {mode === "register" && (
          <label className="block">
            <span className="eyebrow">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="Your name"
              className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
            />
          </label>
        )}

        <label className="block">
          <span className="eyebrow">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            placeholder="you@email.com"
            className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
          />
        </label>

        {mode !== "forgot" && (
          <label className="block">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              placeholder={mode === "register" ? "Min 6 characters" : "Your password"}
              className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground disabled:opacity-50 transition-opacity hover:opacity-90"
        >
          {loading
            ? "Please wait…"
            : mode === "login"
            ? "Sign in"
            : mode === "register"
            ? "Create account"
            : "Send reset link"}
        </button>
      </form>

      {/* Mode switchers */}
      <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
        {mode === "login" && (
          <>
            <p>
              <button type="button" onClick={() => setMode("forgot")} className="underline underline-offset-4">
                Forgot password?
              </button>
            </p>
            <p>
              New here?{" "}
              <button type="button" onClick={() => setMode("register")} className="underline underline-offset-4">
                Create an account
              </button>
            </p>
          </>
        )}
        {mode === "register" && (
          <p>
            Already have an account?{" "}
            <button type="button" onClick={() => setMode("login")} className="underline underline-offset-4">
              Sign in
            </button>
          </p>
        )}
        {mode === "forgot" && (
          <p>
            <button type="button" onClick={() => setMode("login")} className="underline underline-offset-4">
              ← Back to sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
