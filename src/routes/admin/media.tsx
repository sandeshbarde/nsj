import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Archive,
  ChevronLeft,
  Gem,
  Image,
  ImagePlus,
  Menu,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { AdminGate } from "@/components/AdminGate";
import { useCatalog, type SiteMedia } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/media")({
  beforeLoad: requireAdmin,
  component: () => <AdminGate><AdminMedia /></AdminGate>,
});

const MEDIA_SLOTS: { key: keyof SiteMedia; label: string; description: string }[] = [
  { key: "hero",      label: "Hero Image",      description: "Main homepage background (full-width banner)" },
  { key: "craft",     label: "Craft Image",      description: "Our craft / story section image" },
  { key: "rings",     label: "Rings Category",   description: "Rings category thumbnail" },
  { key: "earrings",  label: "Earrings Category",description: "Earrings category thumbnail" },
  { key: "necklaces", label: "Necklaces Category",description: "Necklaces category thumbnail" },
  { key: "bracelets", label: "Bracelets Category",description: "Bracelets category thumbnail" },
];

function AdminMedia() {
  const { media } = useCatalog();
  const [images, setImages] = useState<SiteMedia>(media);
  const [busy, setBusy] = useState<keyof SiteMedia | null>(null);
  const [success, setSuccess] = useState<keyof SiteMedia | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => setImages(media), [media]);

  const upload = async (key: keyof SiteMedia, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(`Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please use a file under 5 MB.`);
      return;
    }

    setBusy(key);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${key}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("site-media")
      .upload(path, file, { upsert: false });

    if (uploadError) {
      setBusy(null);
      alert(`Upload failed.\n\n${uploadError.message}`);
      return;
    }

    const { data } = supabase.storage.from("site-media").getPublicUrl(path);

    const { error: saveError } = await supabase
      .from("site_media")
      .upsert({ key, image_url: data.publicUrl, updated_at: new Date().toISOString() });

    setBusy(null);

    if (saveError) {
      alert(`Could not save image.\n\n${saveError.message}`);
      return;
    }

    setImages((prev) => ({ ...prev, [key]: data.publicUrl }));
    setSuccess(key);
    setTimeout(() => setSuccess(null), 3000);
  };

  const reset = async (key: keyof SiteMedia) => {
    if (!confirm("Reset this image to the default? This removes the custom image from Supabase.")) return;
    setBusy(key);
    await supabase.from("site_media").delete().eq("key", key);
    setBusy(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#171513]">

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-[#f7f4ef]/95 px-5 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenu(true)}
          className="rounded-xl border border-black/10 bg-white p-2.5"
        >
          <Menu size={20} />
        </button>
        <p className="font-serif text-xl tracking-[0.15em]">NSJ</p>
        <Link to="/admin/dashboard" className="text-sm">Dashboard</Link>
      </header>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col bg-[#171513] text-white lg:flex">
        <div className="flex h-20 items-center border-b border-white/10 px-7">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a96b]/60">
              <span className="font-serif text-sm text-[#d8b875]">NSJ</span>
            </div>
            <div>
              <p className="font-serif text-lg tracking-[0.18em]">NSJ</p>
              <p className="text-[8px] uppercase tracking-[0.32em] text-[#c8a96b]">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <SidebarLink to="/admin/dashboard" icon={<Gem size={18} />} label="Dashboard" />
          <SidebarLink to="/admin/products"  icon={<Gem size={18} />} label="Products" />
          <SidebarLink to="/admin/orders"    icon={<Archive size={18} />} label="Orders" />
          <SidebarLink to="/admin/inventory" icon={<Archive size={18} />} label="Inventory" />
          <SidebarLink to="/admin/media"     icon={<Image size={18} />} label="Photos & Media" active />
        </nav>

        <div className="border-t border-white/10 p-5">
          <Link to="/" className="text-sm text-white/50 transition hover:text-white">
            ← View Store
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenu && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-[#171513] p-5 text-white lg:hidden">
            <div className="mb-8 flex items-center justify-between">
              <p className="font-serif text-2xl tracking-[0.15em]">NSJ</p>
              <button type="button" onClick={() => setMobileMenu(false)} className="rounded-lg p-2 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              <MobileLink to="/admin/dashboard" label="Dashboard" onClick={() => setMobileMenu(false)} />
              <MobileLink to="/admin/products"  label="Products"  onClick={() => setMobileMenu(false)} />
              <MobileLink to="/admin/orders"    label="Orders"    onClick={() => setMobileMenu(false)} />
              <MobileLink to="/admin/inventory" label="Inventory" onClick={() => setMobileMenu(false)} />
              <MobileLink to="/admin/media"     label="Photos & Media" onClick={() => setMobileMenu(false)} active />
            </nav>
          </aside>
        </>
      )}

      {/* Main */}
      <main className="lg:pl-72">
        <div className="p-5 sm:p-8">

          {/* Page Header */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#b08a43]">Storefront</p>
            <h1 className="mt-1 font-serif text-3xl sm:text-4xl">Photos & Media</h1>
            <p className="mt-2 text-sm text-black/45">
              Upload images to update your storefront. Changes go live instantly.
            </p>
          </div>

          {/* Hero highlight card */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-[#d8b875]/40 bg-[#fdf9f0]">
            <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-7">
              <div className="h-36 w-full overflow-hidden rounded-xl sm:h-32 sm:w-56 shrink-0">
                <img
                  src={images.hero}
                  alt="Hero background"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#b08a43]">Most Important</p>
                <h2 className="mt-1 font-serif text-2xl">Hero Background</h2>
                <p className="mt-1 text-sm text-black/50">
                  This is the large full-width image on your homepage. Use a high-quality portrait photo (min. 1600px wide).
                </p>
                <label className={`mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white transition ${busy === "hero" ? "bg-black/40 cursor-not-allowed" : "bg-[#171513] hover:bg-[#2a2724]"}`}>
                  {busy === "hero" ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Uploading…
                    </>
                  ) : success === "hero" ? (
                    <>✓ Hero Updated!</>
                  ) : (
                    <>
                      <Upload size={16} />
                      Change Hero Image
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={busy === "hero"}
                    onChange={(e) => void upload("hero", e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Other media grid */}
          <h2 className="mb-4 font-serif text-xl">Other Images</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {MEDIA_SLOTS.filter((s) => s.key !== "hero").map(({ key, label, description }) => (
              <article
                key={key}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                <div className="relative aspect-video overflow-hidden bg-[#f3eee5]">
                  <img
                    src={images[key]}
                    alt={label}
                    className="h-full w-full object-cover"
                  />
                  {success === key && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
                      ✓ Updated!
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="font-medium">{label}</p>
                  <p className="mt-0.5 text-xs text-black/40">{description}</p>

                  <div className="mt-4 flex gap-2">
                    <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-white transition ${busy === key ? "bg-black/30 cursor-not-allowed" : "bg-[#171513] hover:bg-[#2a2724]"}`}>
                      {busy === key ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <ImagePlus size={13} />
                      )}
                      {busy === key ? "Uploading…" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={busy !== null}
                        onChange={(e) => void upload(key, e.target.files?.[0])}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => void reset(key)}
                      disabled={busy !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs text-black/50 transition hover:border-black/20 hover:text-black disabled:opacity-40"
                    >
                      <RotateCcw size={13} />
                      Reset
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 flex items-center justify-between text-xs text-black/35">
            <Link to="/admin/dashboard" className="inline-flex items-center gap-1 transition hover:text-black">
              <ChevronLeft size={14} />
              Dashboard
            </Link>
            <span>Images are stored in Supabase Storage · Max 5 MB</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, active = false }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${active ? "bg-[#c8a96b]/15 text-[#e4c98d]" : "text-white/55 hover:bg-white/10 hover:text-white"}`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileLink({ to, label, active = false, onClick }: { to: string; label: string; active?: boolean; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block rounded-xl px-4 py-3 text-sm ${active ? "bg-[#c8a96b]/15 text-[#e4c98d]" : "text-white/55 hover:bg-white/10 hover:text-white"}`}
    >
      {label}
    </Link>
  );
}
