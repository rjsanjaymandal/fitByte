"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "./product-card";
import { ArrowRight } from "lucide-react";

export function FeaturedGrid({
  products,
  title = "BESTSELLERS",
  subtitle = "Our most loved products, tried and tested by thousands.",
  badge = "Bestsellers",
}: {
  products: any[];
  title?: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e31e24] mb-3">
              {badge}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b47] uppercase tracking-tighter leading-none">
              {title}
            </h2>
            <p className="mt-3 text-sm text-[#1a2b47]/50 font-medium max-w-md">
              {subtitle}
            </p>
          </motion.div>

          <Link
            href="/shop"
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1a2b47] hover:text-[#e31e24] transition-colors pb-1 border-b-2 border-[#1a2b47]/10 hover:border-[#e31e24]"
          >
            View All Products
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Row - Horizontal Scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-6 pb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
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
