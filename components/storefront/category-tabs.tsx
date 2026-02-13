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

const CATEGORY_COLORS: Record<string, string> = {
  protein: "#16a34a",
  supplements: "#0d9488",
  snacks: "#f59e0b",
  accessories: "#8b5cf6",
  bars: "#ec4899",
  shakes: "#3b82f6",
  default: "#16a34a",
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
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">
            Explore
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            The fitByte Range
          </h2>
        </motion.div>

        {/* Category Cards */}
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
                className="min-w-[180px] w-[42vw] md:w-[200px] lg:w-[220px] shrink-0 snap-center"
              >
                <Link href={`/shop/${cat.slug}`} className="block group">
                  <div className="aspect-3/4 relative overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300">
                    {/* Subtle color wash */}
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{ backgroundColor: color }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <span
                          className="text-2xl md:text-3xl font-extrabold"
                          style={{ color }}
                        >
                          {cat.name.charAt(0)}
                        </span>
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-slate-800 mb-1">
                        {cat.name}
                      </h3>

                      {productCount > 0 && (
                        <p className="text-[11px] font-medium text-slate-400">
                          {productCount} Products
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <span className="text-slate-400 group-hover:text-white text-sm transition-colors">
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
