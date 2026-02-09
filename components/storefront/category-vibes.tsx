"use client";

import Link from "next/link";
import FlashImage from "@/components/ui/flash-image";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandBadge } from "./brand-badge";
import Marquee from "@/components/ui/marquee";

interface Category {
  id: string;
  name: string;
  image_url: string | null;
  slug: string;
}

interface CategoryVibesProps {
  categories: Category[];
}

export function CategoryVibes({ categories }: CategoryVibesProps) {
  if (!categories?.length) return null;

  // Bento Grid Layout Patterns (Desktop)
  const getGridClass = (index: number) => {
    // Pattern: Big Large (2x2) -> Tall (1x2) -> Wide (2x1) -> Small (1x1)
    const pattern = [
      "md:col-span-2 md:row-span-2", // Hero
      "md:col-span-1 md:row-span-2", // Tall
      "md:col-span-2 md:row-span-1", // Wide
      "md:col-span-1 md:row-span-1", // Standard
    ];
    return pattern[index % pattern.length];
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* BACKGROUND MARQUEE */}
      <div className="absolute top-20 left-0 right-0 opacity-[0.05] pointer-events-none select-none z-0">
        <Marquee className="[--duration:40s] [--gap:1.5rem]" reverse>
          <span className="text-[5rem] sm:text-[10rem] font-serif font-black tracking-tight mx-8">
            the energy
          </span>
          <span className="text-[5rem] sm:text-[10rem] font-serif font-black tracking-tight mx-8 opacity-50">
            pure nutrition
          </span>
          <span className="text-[5rem] sm:text-[10rem] font-serif font-black tracking-tight mx-8">
            daily fuel
          </span>
        </Marquee>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col items-start gap-4 mb-12">
          <BrandBadge
            variant="primary"
            className="mb-2 bg-primary text-black rounded-full px-6 py-2 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse" /> DISCOVER THE
            VIBES
          </BrandBadge>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-serif tracking-tighter text-black leading-none font-black uppercase"
          >
            PICK YOUR <span className="opacity-30 italic">CATEGORY</span>
          </motion.h2>
        </div>

        {/* DYNAMIC BENTO GRID / CAROUSEL */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:grid md:grid-cols-12 md:gap-6 md:pb-0 md:mx-0 md:px-0 md:auto-rows-[300px] scrollbar-hide">
          {/* If we have exactly 3 categories, use a 6-3-3 split or 8-4 split structure */}
          {/* Current Logic: Just map and let CSS Grid flow, but with specific spans */}

          {categories.map((cat, i) => {
            // Dynamic Spanning Logic
            let spanClass = "md:col-span-3 md:row-span-1"; // Default small

            if (categories.length === 3) {
              // Layout for 3 items: Large Left (6), Stacked Right (6 split -> 6 top, 6 bottom? No. 6, 6, 6 doesn't fit 12 grid if 3 items)
              // Row 1: Item 1 (8 cols) | Item 2 (4 cols)
              // Row 2: Item 3 (4 cols) | View All (8 cols)

              if (i === 0) spanClass = "md:col-span-8 md:row-span-2";
              else if (i === 1) spanClass = "md:col-span-4 md:row-span-1";
              else if (i === 2) spanClass = "md:col-span-4 md:row-span-1";
            } else {
              // Fallback pattern
              const pattern = [
                "md:col-span-6 md:row-span-2", // Large
                "md:col-span-3 md:row-span-1",
                "md:col-span-3 md:row-span-1",
              ];
              spanClass =
                pattern[i % pattern.length] || "md:col-span-3 md:row-span-1";
            }

            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={cn(
                  "group relative overflow-hidden rounded-[2.5rem] bg-zinc-100 border border-zinc-200 transition-all duration-700 hover:border-primary hover:shadow-2xl hover:shadow-black/10",
                  "flex-none w-[85vw] sm:w-[50vw] md:w-auto", // Mobile: Fixed width carousel items
                  "h-[400px] md:h-auto", // Mobile: Fixed height
                  "snap-center", // Mobile: Snapping
                  spanClass, // Desktop: Grid spans
                )}
              >
                {/* IMAGE */}
                {cat.image_url ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <FlashImage
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      resizeMode="cover"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                    <span className="text-8xl opacity-10 font-black grayscale">
                      ⚡
                    </span>
                  </div>
                )}

                {/* CONTENT */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-xl md:text-4xl font-serif text-white leading-tight mb-2 drop-shadow-lg">
                      {cat.name}
                    </h3>

                    <div className="flex items-center gap-3 text-white group-hover:text-white transition-colors duration-300">
                      <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline-block">
                        Shop Collection
                      </span>
                      <div className="p-3 bg-primary text-black rounded-full group-hover:scale-110 group-hover:bg-primary/90 transition-all duration-500 shadow-xl shadow-primary/30">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* "VIEW ALL" TILE REMOVED */}
        </div>
      </div>
    </section>
  );
}
