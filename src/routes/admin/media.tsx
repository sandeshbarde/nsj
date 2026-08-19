import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, RotateCcw, Upload } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { AdminGate } from "@/components/AdminGate";
import { useCatalog, type SiteMedia } from "@/lib/catalog";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/media")({ beforeLoad: requireAdmin, component: () => <AdminGate><AdminMedia /></AdminGate> });

const labels: Record<keyof SiteMedia, string> = {
  hero: "Hero image", craft: "Craft image", rings: "Rings image", earrings: "Earrings image", necklaces: "Necklaces image", bracelets: "Bracelets image",
};

function AdminMedia() {
  const { media } = useCatalog();
  const [images, setImages] = useState(media);
  const [busy, setBusy] = useState<keyof SiteMedia | null>(null);
  useEffect(() => setImages(media), [media]);

  const upload = async (key: keyof SiteMedia, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please choose an image file.");
    setBusy(key);
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${key}/${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, { upsert: false });
    if (uploadError) { setBusy(null); return alert(`Upload failed.\n\n${uploadError.message}`); }
    const { data } = supabase.storage.from("site-media").getPublicUrl(path);
    const { error } = await supabase.from("site_media").upsert({ key, image_url: data.publicUrl, updated_at: new Date().toISOString() });
    setBusy(null);
    if (error) return alert(`Could not save image.\n\n${error.message}`);
    setImages((current) => ({ ...current, [key]: data.publicUrl }));
  };

  const reset = async (key: keyof SiteMedia) => {
    setBusy(key);
    const { error } = await supabase.from("site_media").delete().eq("key", key);
    setBusy(null);
    if (error) return alert(`Could not reset image.\n\n${error.message}`);
    window.location.reload();
  };

  return <main className="min-h-screen bg-[#f7f4ef] p-5 text-[#171513] sm:p-8">
    <div className="mx-auto max-w-6xl">
      <Link to="/admin/dashboard" className="text-sm underline">← Dashboard</Link>
      <p className="mt-8 text-xs uppercase tracking-[.25em] text-[#b08a43]">Storefront</p>
      <h1 className="mt-2 font-serif text-4xl">Photos &amp; Media</h1>
      <p className="mt-2 text-sm text-black/55">Uploads are saved to Supabase Storage; the homepage updates automatically.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(labels) as Array<keyof SiteMedia>).map((key) => <article key={key} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <img src={images[key]} alt={labels[key]} className="aspect-video w-full object-cover" />
          <div className="p-4"><h2 className="font-medium">{labels[key]}</h2><div className="mt-4 flex gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#171513] px-3 py-2 text-xs text-white"><Upload size={14} /> {busy === key ? "Uploading…" : "Upload"}<input className="hidden" type="file" accept="image/*" disabled={busy === key} onChange={(e) => void upload(key, e.target.files?.[0])} /></label>
            <button type="button" onClick={() => void reset(key)} disabled={busy === key} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"><RotateCcw size={14} /> Reset</button>
          </div></div>
        </article>)}
      </div>
      <p className="mt-8 flex items-center gap-2 text-xs text-black/45"><ImagePlus size={14} /> Default images remain in use whenever Supabase has no saved media.</p>
    </div>
  </main>;
}
