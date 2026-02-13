"use client";

import { ProductCard } from "@/components/storefront/product-card";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";

interface ProductCarouselProps {
  title?: string;
  products: any[];
}

export function ProductCarousel({
  title = "You Might Also Like",
  products,
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-white">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col gap-2 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900"
            >
              {title}
            </motion.h2>
          </div>
          <p className="text-sm text-slate-500 font-medium pl-13">
            Carefully selected for your nutrition goals.
          </p>
        </div>

        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap rounded-3xl pb-6">
            <div className="flex gap-6 pb-4" ref={scrollContainerRef}>
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="w-[280px] md:w-[320px] shrink-0"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>

          {/* Modern Fade Edges */}
          <div className="absolute top-0 left-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
