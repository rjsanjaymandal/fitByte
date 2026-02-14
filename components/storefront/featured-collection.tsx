"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "./product-card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  accentColor = "#fb7185",
  reversed = false,
}: FeaturedCollectionProps) {
  return (
    <section className="py-20 md:py-32 bg-[#faf7f2] overflow-hidden relative">
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px section-divider" />

      {/* Decorative Brand Sphere */}
      <div
        className={cn(
          "absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20",
          reversed ? "-left-24 right-auto bg-yellow-400" : "bg-rose-400",
        )}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: reversed ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn("max-w-2xl", reversed ? "md:order-2" : "")}
          >
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 mb-4 ml-1">
              {collectionSlug}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 tracking-tighter leading-[0.9] uppercase">
              {title}
            </h2>
            <p className="mt-6 text-[15px] sm:text-[17px] text-stone-500 font-medium max-w-md leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          <Link
            href={`/shop?collection=${collectionSlug}`}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-stone-100 hover:border-rose-400 text-stone-900 text-[13px] font-black uppercase tracking-widest transition-all hover:bg-stone-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(251,113,133,0.1)] active:scale-95"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform text-rose-500" />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-6 pb-8 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="min-w-[280px] w-[80vw] sm:w-[320px] lg:w-auto shrink-0 snap-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
