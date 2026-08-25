import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ReviewSectionProps {
  productId: string;
  productName: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`size-6 transition-colors ${
              star <= (hovered || value)
                ? "fill-foreground text-foreground"
                : "fill-none text-border"
            }`}
            strokeWidth={1.25}
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === "sm" ? "size-3.5" : "size-4"} ${
            star <= Math.round(rating) ? "fill-foreground text-foreground" : "fill-none text-border"
          }`}
          strokeWidth={1.25}
        />
      ))}
    </div>
  );
}

export function ReviewSection({ productId, productName }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  interface FormErrors {
    name?: string | undefined;
    rating?: string | undefined;
    review_text?: string | undefined;
  }

  const [form, setForm] = useState({ name: "", rating: 0, review_text: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, name, rating, review_text, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  }, [productId]);

  useEffect(() => { void loadReviews(); }, [loadReviews]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Enter your name (min 2 characters)";
    if (form.rating === 0) errs.rating = "Please select a star rating";
    if (!form.review_text.trim() || form.review_text.trim().length < 5) errs.review_text = "Write at least 5 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      name: form.name.trim(),
      rating: form.rating,
      review_text: form.review_text.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit review. Please try again.");
      return;
    }
    toast.success("Review submitted! Thank you.");
    setForm({ name: "", rating: 0, review_text: "" });
    setErrors({});
    setShowForm(false);
    void loadReviews();
  };

  return (
    <section className="mt-20 border-t border-border pt-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-1 font-display text-2xl md:text-3xl">
            {reviews.length === 0
              ? "No reviews yet"
              : `${avgRating.toFixed(1)} out of 5`}
          </h2>
          {reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarDisplay rating={avgRating} size="md" />
              <span className="text-sm text-muted-foreground">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="border border-foreground px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          {showForm ? "Cancel" : "Write a review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 border border-border bg-secondary p-6"
        >
          <p className="font-display text-lg">Your review for {productName}</p>

          {/* Star picker */}
          <div>
            <p className="eyebrow mb-2">Your rating</p>
            <StarPicker
              value={form.rating}
              onChange={(v) => { setForm((f) => ({ ...f, rating: v })); setErrors((e) => ({ ...e, rating: undefined })); }}
            />
            {errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating}</p>}
          </div>

          {/* Name */}
          <label className="block">
            <span className="eyebrow">Your name</span>
            <input
              value={form.name}
              onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((ex) => ({ ...ex, name: undefined })); }}
              maxLength={80}
              placeholder="e.g. Priya S."
              className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </label>

          {/* Review text */}
          <label className="block">
            <span className="eyebrow">Your review</span>
            <textarea
              value={form.review_text}
              onChange={(e) => { setForm((f) => ({ ...f, review_text: e.target.value })); setErrors((ex) => ({ ...ex, review_text: undefined })); }}
              rows={4}
              maxLength={1000}
              placeholder="What did you love about this piece?"
              className="mt-1 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
            />
            {errors.review_text && <p className="mt-1 text-xs text-destructive">{errors.review_text}</p>}
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="bg-ink px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-ink-foreground disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse border-b border-border py-6">
              <div className="h-3 w-24 rounded bg-secondary" />
              <div className="mt-3 h-3 w-3/4 rounded bg-secondary" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Be the first to leave a review for this piece.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border">
          {reviews.map((review) => (
            <li key={review.id} className="py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{review.name}</p>
                  <StarDisplay rating={review.rating} />
                </div>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </time>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {review.review_text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
