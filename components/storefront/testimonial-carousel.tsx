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
    <section className="py-16 md:py-24 bg-[#fdfcf0] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#1a2b47] uppercase tracking-tighter leading-none">
            Don&apos;t Take Our Word,
            <br />
            <span className="text-[#e31e24]">Take Theirs</span>
          </h2>
        </motion.div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-6 px-4 md:px-6 pb-8 snap-x snap-mandatory scrollbar-hide"
      >
        <div className="shrink-0 w-4 lg:w-32" />
        {REVIEWS.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="snap-center shrink-0 w-[80vw] md:w-[400px] bg-white p-8 md:p-10 border-2 border-[#1a2b47]/10 hover:border-[#1a2b47] flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(26,43,71,1)] hover:translate-x-[-3px] hover:translate-y-[-3px]"
          >
            <div>
              <div className="flex gap-1 mb-6">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]"
                  />
                ))}
              </div>

              <p className="text-sm md:text-base text-[#1a2b47] leading-relaxed font-medium">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-[#1a2b47]/10">
              <p className="font-black text-[#1a2b47] uppercase tracking-widest text-xs">
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
