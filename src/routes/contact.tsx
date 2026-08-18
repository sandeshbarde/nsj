import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Argent — Silver Jewellery Support" },
      { name: "description", content: "Reach the Argent team by form, WhatsApp, phone or email, or visit our Jaipur studio." },
      { property: "og:title", content: "Contact Argent" },
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
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
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
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    toast.success("Message sent — we'll reply within one business day");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 text-4xl md:text-5xl">We're here to help</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-2">
        <form onSubmit={submit} className="space-y-5" noValidate>
          {(
            [
              ["name", "Full name"],
              ["email", "Email"],
              ["phone", "Mobile number"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="eyebrow">{label}</span>
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
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
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              maxLength={1000}
              className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
            />
            {errors['message'] && <span className="mt-1 block text-xs text-destructive">{errors['message']}</span>}
          </label>
          <button type="submit" className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground">
            Send message
          </button>
          {sent && <p className="text-sm text-muted-foreground">Thank you — your message is with our team.</p>}
        </form>

        <aside className="space-y-6 text-sm">
          <div>
            <h2 className="eyebrow">Studio</h2>
            <p className="mt-2 text-muted-foreground">
              14 Amrapali Marg, C-Scheme
              <br />
              Jaipur, Rajasthan 302001
            </p>
          </div>
          <div>
            <h2 className="eyebrow">Reach us</h2>
            <p className="mt-2 space-x-2 text-muted-foreground">
              <a className="underline underline-offset-4" href="tel:+919000000000">+91 90000 00000</a>
            </p>
            <p className="text-muted-foreground">
              <a className="underline underline-offset-4" href="mailto:care@argentsilver.in">care@argentsilver.in</a>
            </p>
            <p className="text-muted-foreground">
              <a className="underline underline-offset-4" href="https://wa.me/919000000000" target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
            </p>
          </div>
          <div>
            <h2 className="eyebrow">Hours</h2>
            <p className="mt-2 text-muted-foreground">Mon–Sat, 10am – 7pm IST</p>
          </div>
          <iframe
            title="Argent studio location"
            src="https://www.google.com/maps?q=C-Scheme,Jaipur&output=embed"
            className="h-64 w-full border border-border"
            loading="lazy"
          />
        </aside>
      </div>
    </div>
  );
}
