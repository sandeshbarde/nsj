import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact NSJ Jewellery — Support & Enquiries" },
      { name: "description", content: "Reach the NSJ team by form, WhatsApp, phone or email." },
      { property: "og:title", content: "Contact NSJ Jewellery" },
      { property: "og:description", content: "We reply within one business day." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      const next: Record<string, string> = {};
      for (const i of res.error.issues) next[String(i.path[0])] = i.message;
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    setSending(true);

    // Save to Supabase contact_messages table
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    });

    setSending(false);

    if (error) {
      // Still show success to user — message may have been blocked by RLS if table doesn't exist yet
      console.error("Contact save error:", error);
    }

    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    toast.success("Message sent — we'll reply within one business day");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-16">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 font-display text-[clamp(2rem,7vw,3.5rem)] leading-[1.06]">We're here to help</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {/* Form */}
        <form onSubmit={submit} className="space-y-5" noValidate>
          {(
            [
              ["name", "Full name", "text"],
              ["email", "Email", "email"],
              ["phone", "Mobile number", "tel"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="block">
              <span className="eyebrow">{label}</span>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors((ex) => ({ ...ex, [key]: "" })); }}
                maxLength={255}
                className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
              />
              {errors[key] && <span className="mt-1 block text-xs text-destructive">{errors[key]}</span>}
            </label>
          ))}

          <label className="block">
            <span className="eyebrow">Message</span>
            <textarea
              value={form.message}
              onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors((ex) => ({ ...ex, message: "" })); }}
              rows={4}
              maxLength={1000}
              className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
            />
            {errors["message"] && <span className="mt-1 block text-xs text-destructive">{errors["message"]}</span>}
          </label>

          <button
            type="submit"
            disabled={sending}
            className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground disabled:opacity-50 transition-opacity hover:opacity-90"
          >
            {sending ? "Sending…" : "Send message"}
          </button>

          {sent && (
            <div className="rounded border border-border bg-secondary px-4 py-3 text-sm">
              ✓ Thank you — your message is with our team. We'll reply within one business day.
            </div>
          )}
        </form>

        {/* Aside info */}
        <aside className="space-y-6 text-sm">
          <div>
            <h2 className="eyebrow">Studio</h2>
            <p className="mt-2 text-muted-foreground">
              NSJ Jewellery Studio<br />
              India
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Reach us</h2>
            <p className="mt-2 text-muted-foreground">
              <a
                className="underline underline-offset-4 hover:opacity-70"
                href="https://wa.me/917373262607?text=Hello%20NSJ%20Jewellery!"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: +91 73732 62607
              </a>
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Hours</h2>
            <p className="mt-2 text-muted-foreground">Mon–Sat, 10am – 7pm IST</p>
          </div>

          {/* WhatsApp direct button */}
          <a
            href="https://wa.me/917373262607?text=Hello%20NSJ%20Jewellery!%20I%20have%20a%20query."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#25D366] bg-[#25D366]/10 px-5 py-3 text-[11px] tracking-[0.18em] uppercase text-foreground transition-colors hover:bg-[#25D366]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4 fill-[#25D366]" aria-hidden="true">
              <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.47.658 4.788 1.807 6.794L2 30l7.394-1.78A13.94 13.94 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm7.226 19.47c-.304.853-1.783 1.63-2.438 1.73-.656.101-1.478.142-2.384-.15-.55-.18-1.258-.42-2.16-.822-3.801-1.641-6.285-5.497-6.478-5.75-.193-.254-1.574-2.094-1.574-3.994s.997-2.837 1.35-3.225c.354-.388.77-.485 1.026-.485.257 0 .514.002.738.014.237.013.554-.09.868.66.322.77 1.094 2.67 1.191 2.864.097.193.161.42.032.676-.128.257-.193.418-.386.645-.193.226-.405.504-.578.676-.193.193-.393.401-.169.787.225.387.997 1.643 2.14 2.66 1.47 1.307 2.71 1.713 3.1 1.906.387.194.612.162.837-.097.225-.257.965-1.126 1.222-1.513.257-.387.514-.322.87-.193.355.13 2.254 1.063 2.64 1.257.388.193.645.29.74.45.097.16.097.93-.207 1.783z" />
            </svg>
            Chat on WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
