"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Product } from "@/lib/services/product-service";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
}

interface CategoryTabsProps {
  categories: Category[];
  productsMap: Record<string, Product[]>;
}

// Map category names to colors for visual variety
const CATEGORY_COLORS: Record<string, string> = {
  protein: "#e31e24",
  supplements: "#1a2b47",
  snacks: "#f59e0b",
  accessories: "#10b981",
  bars: "#8b5cf6",
  shakes: "#ec4899",
  default: "#1a2b47",
};

function getCategoryColor(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return CATEGORY_COLORS.default;
}

export function CategoryTabs({ categories, productsMap }: CategoryTabsProps) {
  if (!categories.length) return null;

  return (
    <section className="py-16 md:py-24 bg-[#fdfcf0] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e31e24] mb-3">
            Explore
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b47] uppercase tracking-tighter">
            THE FITBYTE RANGE
          </h2>
        </motion.div>

        {/* Category Cards - Horizontal Scroll */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-4 scrollbar-hide -mx-4 px-4 lg:justify-center lg:flex-wrap lg:mx-0 lg:px-0">
          {categories.map((cat, index) => {
            const color = getCategoryColor(cat.name);
            const productCount = (productsMap[cat.id] || []).length;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[200px] w-[45vw] md:w-[220px] lg:w-[240px] shrink-0 snap-center"
              >
                <Link href={`/shop/${cat.slug}`} className="block group">
                  {/* Card */}
                  <div
                    className="aspect-[3/4] relative overflow-hidden border-2 border-[#1a2b47]/10 bg-white hover:border-[#1a2b47] transition-all duration-300 group-hover:shadow-[6px_6px_0px_0px] group-hover:translate-x-[-3px] group-hover:translate-y-[-3px]"
                    style={
                      {
                        // @ts-ignore
                        "--tw-shadow-color": color,
                      } as React.CSSProperties
                    }
                  >
                    {/* Category Image or Colored Block */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{ backgroundColor: color }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div
                        className="w-16 h-16 md:w-20 md:h-20 border-2 flex items-center justify-center mb-4"
                        style={{ borderColor: color }}
                      >
                        <span
                          className="text-2xl md:text-3xl font-black"
                          style={{ color }}
                        >
                          {cat.name.charAt(0)}
                        </span>
                      </div>

                      <h3 className="text-sm md:text-base font-black uppercase tracking-widest text-[#1a2b47] mb-2">
                        {cat.name}
                      </h3>

                      {productCount > 0 && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a2b47]/40">
                          {productCount} Products
                        </p>
                      )}
                    </div>

                    {/* Arrow indicator */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-[#1a2b47]/10 flex items-center justify-center group-hover:border-[#1a2b47] group-hover:bg-[#1a2b47] transition-all">
                      <span className="text-[#1a2b47]/30 group-hover:text-white text-sm transition-colors">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
