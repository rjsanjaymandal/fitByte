"use client";

import { useState } from "react";
import { Star, MessageSquare, BadgeCheck, Reply, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { submitReview } from "@/app/actions/review-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import FlashImage from "@/components/ui/flash-image";

type Review = {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  is_featured: boolean;
  reply_text: string | null;
  media_urls?: string[];
  is_verified?: boolean;
};

export function ReviewSection({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate Average
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "0.0";

  // Calculate Rating Distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<
    number,
    number
  >;
  reviews.forEach((r) => {
    const rating = Math.round(r.rating);
    if (rating >= 1 && rating <= 5) ratingCounts[rating]++;
  });
  const totalReviews = reviews.length;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  return (
    <div className="py-20 lg:py-24 border-t border-slate-100 bg-slate-50/30 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-16">
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Community Feedback
              </h2>
              <p className="text-slate-500 font-medium max-w-lg">
                Verified nutrition insights from fitByte members.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-10 items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center sm:items-start min-w-[140px]">
                <span className="text-6xl font-black text-slate-900 leading-none">
                  {averageRating}
                </span>
                <div className="flex items-center gap-1 mt-4 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-5 w-5",
                        s <= Math.round(Number(averageRating))
                          ? "fill-current"
                          : "text-slate-200 fill-slate-200",
                      )}
                    />
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-400 mt-3 border-t border-slate-50 pt-3 w-full text-center sm:text-left">
                  {totalReviews} VERIFIED REVIEWS
                </p>
              </div>

              {/* Rating Bars */}
              <div className="flex-1 w-full space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const percentage =
                    totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-4 text-xs">
                      <span className="font-bold text-slate-900 w-3">
                        {star}
                      </span>
                      <Star className="h-4 w-4 text-slate-300" />
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-right text-slate-400 font-bold">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:pt-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="rounded-2xl px-10 h-14 bg-green-600 text-white font-bold hover:bg-green-700 shadow-xl shadow-green-100 transition-all hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
                >
                  Post a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 bg-white">
                <DialogHeader>
                  <DialogTitle className="font-extrabold text-2xl text-slate-900">
                    Review Product
                  </DialogTitle>
                  <p className="text-sm text-slate-500 font-medium">
                    Your feedback helps the community grow.
                  </p>
                </DialogHeader>
                <ReviewForm
                  productId={productId}
                  onSuccess={() => setIsOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <MessageSquare className="h-14 w-14 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold text-sm">
                No reviews yet. Be the first to share your flavor experience!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className={cn(
                  "rounded-3xl border bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 relative",
                  review.is_featured
                    ? "border-amber-200 bg-amber-50/20"
                    : "border-slate-100",
                )}
              >
                {review.is_featured && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-white text-[9px] font-bold px-3 py-1.5 rounded-bl-2xl rounded-tr-3xl flex items-center gap-1 shadow-sm uppercase tracking-wider">
                    <ThumbsUp className="h-3 w-3 fill-current" /> Best Review
                  </div>
                )}

                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center font-bold text-green-700 text-lg">
                    {review.user_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 text-sm">
                        {review.user_name}
                      </p>
                      {review.is_verified && (
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-green-100">
                          <BadgeCheck className="h-3 w-3" /> VERIFIED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-4 w-4",
                        s <= review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-100 fill-slate-100",
                      )}
                    />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed text-[15px] font-medium italic">
                  &quot;{review.comment}&quot;
                </p>

                {review.media_urls && review.media_urls.length > 0 && (
                  <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {review.media_urls.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setLightboxImage(url);
                          setLightboxOpen(true);
                        }}
                        className="relative shrink-0 h-20 w-20 rounded-2xl overflow-hidden border border-slate-100 hover:opacity-90 transition-opacity active:scale-95"
                      >
                        <FlashImage
                          src={url}
                          alt={`Review photo ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {review.reply_text && (
                  <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-green-600 p-1.5 rounded-lg text-white">
                        <Reply className="h-3 w-3" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 uppercase">
                        fitByte Response
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {review.reply_text}
                    </p>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-6 backdrop-blur-md transition-all duration-300"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
            <FlashImage
              src={lightboxImage}
              alt="Review Media"
              fill
              className="object-contain"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-8 right-8 text-white hover:bg-white/10 rounded-full h-12 w-12"
            onClick={() => setLightboxOpen(false)}
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}

function ReviewForm({
  productId,
  onSuccess,
}: {
  productId: string;
  onSuccess: () => void;
}) {
  const [rating, setRating] = useState(5);

  async function action(formData: FormData) {
    formData.append("productId", productId);
    formData.append("rating", rating.toString());

    const res = await submitReview(formData);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success(res?.message || "Review submitted for approval!");
      onSuccess();
    }
  }

  return (
    <form action={action} className="space-y-6 pt-6">
      <div className="space-y-4">
        <Label
          id="rating-label"
          className="text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          YOUR RATING
        </Label>
        <div
          className="flex gap-2 text-amber-400"
          role="group"
          aria-labelledby="rating-label"
        >
          <input type="hidden" name="rating" value={rating} />
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              onClick={() => setRating(s)}
              className={cn(
                "h-9 w-9 cursor-pointer transition-all hover:scale-110",
                s <= rating ? "fill-current" : "text-slate-100 fill-slate-100",
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="comment"
          className="text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          YOUR EXPERIENCE
        </Label>
        <Textarea
          name="comment"
          id="comment"
          placeholder="How was the flavor and texture?"
          required
          className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 focus:border-green-600 focus:ring-green-600/10 transition-all font-medium"
        />
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="images"
          className="text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          PHOTOS (OPTIONAL)
        </Label>
        <div className="relative">
          <Input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            className="cursor-pointer file:bg-green-50 file:text-green-600 file:border-0 file:rounded-xl file:px-4 file:py-2 file:mr-4 rounded-2xl border-slate-100 h-14 items-center flex"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-14 bg-green-600 text-white rounded-2xl font-bold text-base hover:bg-green-700 shadow-lg shadow-green-100 active:scale-[0.98] transition-all"
      >
        Submit Review
      </Button>
    </form>
  );
}
