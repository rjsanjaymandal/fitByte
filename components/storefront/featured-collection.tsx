"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedCollectionProps {
  title: string;
  subtitle: string;
  collectionSlug: string;
  products: any[];
  accentColor?: string;
  reversed?: boolean;
}

export function FeaturedCollection({
  title,
  subtitle,
  collectionSlug,
  products,
  accentColor = "#e31e24",
  reversed = false,
}: FeaturedCollectionProps) {
  return (
    <section className="py-16 md:py-24 bg-[#fdfcf0] border-y border-[#1a2b47]/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 ${reversed ? "md:flex-row-reverse" : ""}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <p
              className="text-xs font-black uppercase tracking-[0.3em] mb-3"
              style={{ color: accentColor }}
            >
              Featured Collection
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b47] uppercase tracking-tighter leading-[0.9]">
              {title}
            </h2>
            <p className="mt-4 text-sm text-[#1a2b47]/60 font-bold uppercase tracking-widest max-w-md">
              {subtitle}
            </p>
          </motion.div>

          <Link
            href={`/shop/${collectionSlug}`}
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#1a2b47] bg-white border-2 border-[#1a2b47] px-8 py-4 shadow-[4px_4px_0px_0px_rgba(26,43,71,1)] hover:shadow-[6px_6px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Row - Horizontal Scroll */}
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-6 pb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {products.slice(0, 8).map((product, index) => (
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
