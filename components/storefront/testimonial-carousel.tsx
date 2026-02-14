"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useRef } from "react";

const REVIEWS = [
  {
    author: "Raj P.",
    role: "Fitness Coach",
    text: "Best protein bars I've tried in India. Clean macros, amazing taste. My clients love them too!",
    rating: 5,
  },
  {
    author: "Sneha M.",
    role: "Marathon Runner",
    text: "fitByte shakes are my go-to post-run recovery. The chocolate flavor is genuinely delicious.",
    rating: 5,
  },
  {
    author: "Arjun K.",
    role: "Gym Enthusiast",
    text: "Finally a brand that doesn't compromise on taste OR quality. The peanut butter bar is insane.",
    rating: 5,
  },
  {
    author: "Priya S.",
    role: "Yoga Instructor",
    text: "Love that everything is lab-tested and transparently sourced. Rare to find in this space.",
    rating: 4,
  },
  {
    author: "Vikram D.",
    role: "CrossFit Athlete",
    text: "The pre-workout gave me the cleanest energy boost without any crash. Highly recommend!",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 md:py-28 bg-[#faf7f2] overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-rose-400/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-400/[0.03] rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-3">
            Reviews
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight uppercase">
            Don&apos;t Take Our Word,{" "}
            <span className="text-gradient">Take Theirs</span>
          </h2>
        </motion.div>

        <div
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 scrollbar-hide -mx-4 px-4 lg:justify-center lg:flex-wrap lg:mx-0 lg:px-0"
        >
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="min-w-[300px] w-[80vw] md:w-[350px] lg:w-[320px] shrink-0 snap-center"
            >
              <div className="h-full p-6 rounded-2xl bg-white border border-stone-100 hover:border-rose-200 transition-all duration-300 relative group shadow-sm hover:shadow-md">
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 h-8 w-8 text-stone-100 group-hover:text-rose-100 transition-colors" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star
                      key={si}
                      className={`h-4 w-4 ${si < review.rating ? "text-yellow-400 fill-current" : "text-stone-100"}`}
                    />
                  ))}
                </div>

                <p className="text-sm text-stone-600 leading-relaxed mb-6 line-clamp-4">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="mt-auto pt-5 border-t border-stone-50 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">
                      {review.author}
                    </p>
                    <p className="text-[11px] text-stone-400">{review.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
