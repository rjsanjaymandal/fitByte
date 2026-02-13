"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";

const REVIEWS = [
  {
    text: "This is the best protein bar here in the market! After trying almost all protein bars, I found that this bar tasted the least artificial and actually feels like a real snack.",
    author: "Akshay G.",
    rating: 5,
  },
  {
    text: "The cleanest protein I've ever tasted. No bloating, mixes instantly, and the chocolate fudge flavor is insane. My daily go-to post-workout fuel.",
    author: "Sarah J.",
    rating: 5,
  },
  {
    text: "I'm on my third order of these shakes. I like the assorted pack for its variety but strawberry is my favourite flavour. They're great for on-the-go nutrition.",
    author: "Mansi R.",
    rating: 5,
  },
  {
    text: "These bars are the best I've ever had. The texture is just right, not too chewy or dry, and the chocolate flavour is delicious. Will keep ordering!",
    author: "Vikas S.",
    rating: 5,
  },
  {
    text: "Packaging is premium, delivery was fast, and the product quality matches the hype. My recovery times have noticeably improved since switching.",
    author: "Emily W.",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">
            Real Reviews
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Don&apos;t Take Our Word,{" "}
            <span className="text-green-600">Take Theirs</span>
          </h2>
        </motion.div>
      </div>

      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-5 px-4 md:px-6 pb-8 snap-x snap-mandatory scrollbar-hide"
      >
        <div className="shrink-0 w-4 lg:w-32" />
        {REVIEWS.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="snap-center shrink-0 w-[80vw] md:w-[380px] bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-100 hover:shadow-md flex flex-col justify-between min-h-[260px] transition-all duration-300"
          >
            <div>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200">
              <p className="font-bold text-slate-800 text-sm">
                {review.author}
              </p>
            </div>
          </motion.div>
        ))}
        <div className="shrink-0 w-4 lg:w-32" />
      </div>
    </section>
  );
}
