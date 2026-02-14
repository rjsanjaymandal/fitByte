"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "./product-card";
import { ArrowRight } from "lucide-react";

export function FeaturedGrid({
  products,
  title = "Bestsellers",
  subtitle = "Our most loved products, tried and tested by thousands.",
  badge = "Bestsellers",
}: {
  products: any[];
  title?: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <section className="py-20 md:py-28 bg-[#faf7f2] overflow-hidden relative">
      {/* Subtle dots */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-3">
              {badge}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight uppercase">
              {title}
            </h2>
            <p className="mt-3 text-sm text-stone-500 font-medium max-w-md">
              {subtitle}
            </p>
          </motion.div>

          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-wider"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Row */}
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-5 pb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="min-w-[260px] w-[72vw] sm:w-[280px] lg:w-auto shrink-0 snap-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
            >
              <ProductCard product={product} priority={index < 2} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
