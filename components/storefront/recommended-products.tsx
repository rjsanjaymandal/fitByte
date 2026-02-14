"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/services/product-service";
import { getUpsellProducts } from "@/app/actions/cart-upsell";
import { ProductCard } from "@/components/storefront/product-card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendedProductsProps {
  categoryId: string;
  currentProductId: string;
  title?: string;
}

export function RecommendedProducts({
  categoryId,
  currentProductId,
  title = "Pairs Well With",
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      try {
        const results = await getUpsellProducts(
          [categoryId],
          [currentProductId],
        );
        setProducts(results.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    }
    if (categoryId) fetchRecommendations();
  }, [categoryId, currentProductId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-[0.25em] text-rose-500 uppercase mb-3"
          >
            Complete Your Stack
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight"
          >
            {title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-3/4 w-full rounded-3xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-full" />
                    <Skeleton className="h-3 w-1/2 rounded-full" />
                  </div>
                </div>
              ))
            : products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product as any} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
