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
  accentColor = "#16a34a",
  reversed = false,
}: FeaturedCollectionProps) {
  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
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
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: accentColor }}
            >
              Featured Collection
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm text-slate-500 font-medium max-w-md">
              {subtitle}
            </p>
          </motion.div>

          <Link
            href={`/shop/${collectionSlug}`}
            className="group flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Row */}
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-5 pb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
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
