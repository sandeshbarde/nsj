import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { isAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (signInError) {
        setError("Invalid admin email or password.");
        return;
      }

      if (!(await isAdmin())) {
        await supabase.auth.signOut();
        setError("This account is not authorised for admin access.");
        return;
      }

      await navigate({ to: "/admin/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#171513]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand Panel */}
        <section className="relative hidden overflow-hidden bg-[#171513] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(210,170,90,0.25),transparent_40%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-20">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a96b]/60">
                  <span className="font-serif text-lg text-[#d8b875]">
                    NSJ
                  </span>
                </div>

                <div>
                  <p className="font-serif text-xl tracking-[0.18em]">
                    NSJ
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#c8a96b]">
                    Jewellery
                  </p>
                </div>
              </Link>
            </div>

            <div className="max-w-xl">
              <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#c8a96b]">
                Administration
              </p>

              <h1 className="font-serif text-5xl leading-tight text-white xl:text-6xl">
                Manage your
                <span className="block text-[#d8b875]">
                  jewellery store.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-white/60">
                Manage products, inventory, orders and your NSJ
                jewellery collection from one elegant dashboard.
              </p>
            </div>

            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} NSJ Jewellery. Admin
              Portal.
            </p>
          </div>
        </section>

        {/* Login Panel */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 text-center lg:hidden">
              <Link
                to="/"
                className="inline-flex flex-col items-center"
              >
                <span className="font-serif text-3xl tracking-[0.2em]">
                  NSJ
                </span>

                <span className="mt-1 text-[9px] uppercase tracking-[0.35em] text-[#b08a43]">
                  Jewellery
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#171513] text-[#d8b875]">
                <ShieldCheck
                  size={22}
                  strokeWidth={1.7}
                />
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#b08a43]">
                Secure Access
              </p>

              <h2 className="font-serif text-4xl text-[#171513]">
                Admin Login
              </h2>

              <p className="mt-3 text-sm leading-6 text-black/50">
                Sign in to manage your NSJ jewellery store.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-medium"
                >
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                  />

                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="admin@nsj.com"
                    autoComplete="username"
                    maxLength={255}
                    required
                    className="h-13 w-full rounded-xl border border-black/10 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#b08a43] focus:ring-2 focus:ring-[#b08a43]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                  />

                  <input
                    id="admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    maxLength={128}
                    required
                    className="h-13 w-full rounded-xl border border-black/10 bg-white pl-12 pr-12 text-sm outline-none transition focus:border-[#b08a43] focus:ring-2 focus:ring-[#b08a43]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-black/40 transition hover:bg-black/5 hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center rounded-xl bg-[#171513] px-5 text-sm font-medium tracking-wide text-white transition hover:bg-[#292623] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in to Admin"}
              </button>
            </form>

            {/* Back */}
            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-sm text-black/45 transition hover:text-[#8b6b32]"
              >
                ← Back to NSJ Jewellery
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
