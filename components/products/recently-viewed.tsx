"use client";

import { useEffect, useState, useRef } from "react";
import { useRecentStore } from "@/lib/store/use-recent-store";
import { ProductCard } from "@/components/storefront/product-card";
import { Button } from "@/components/ui/button";
import { Trash2, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function RecentlyViewed({ currentProduct }: { currentProduct?: any }) {
  const [validatedItems, setValidatedItems] = useState<any[]>([]);
  const { items, addItem, setItems, clear } = useRecentStore();
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentProduct) {
      addItem({
        ...currentProduct,
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.main_image_url,
        slug: currentProduct.slug || currentProduct.id,
      });
    }
  }, [currentProduct, addItem]);

  useEffect(() => {
    if (!mounted || items.length === 0) return;
    const validate = async () => {
      const CACHE_DURATION = 15 * 60 * 1000;
      const now = Date.now();
      const { lastValidated, setLastValidated } = useRecentStore.getState();
      if (lastValidated && now - lastValidated < CACHE_DURATION) {
        setValidatedItems(items);
        return;
      }
      try {
        const { getValidProducts } =
          await import("@/lib/services/product-service");
        const ids = items.map((i) => i.id);
        const validProducts = await getValidProducts(ids);
        const validMap = new Map(validProducts.map((p) => [p.id, p]));
        const orderedValidItems = items
          .filter((i) => validMap.has(i.id))
          .map((i) => ({ ...i, ...validMap.get(i.id) }));
        setValidatedItems(orderedValidItems);
        setLastValidated(now);
        if (orderedValidItems.length !== items.length)
          setItems(orderedValidItems);
      } catch (err) {
        console.error("Failed to validate recently viewed:", err);
        setValidatedItems(items);
      }
    };
    validate();
  }, [mounted, items.length, setItems]);

  if (!mounted || items.length === 0) return null;
  const displayItems = validatedItems.filter(
    (i) => i.id !== currentProduct?.id,
  );
  if (displayItems.length === 0) return null;

  return (
    <section className="py-20 md:py-24 border-t border-rose-100/50 relative overflow-hidden bg-stone-50/50">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                <History className="w-5 h-5" />
              </div>
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-2xl md:text-3xl font-black tracking-tight text-stone-900"
              >
                Continue Exploring
              </motion.h2>
            </div>
            <p className="text-sm text-stone-500 font-medium pl-13">
              Pick up right where you left off.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            className="text-stone-400 hover:text-red-600 border-rose-200 rounded-full h-10 px-4 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Clear
          </Button>
        </div>

        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap rounded-3xl pb-6">
            <div className="flex gap-6 pb-4" ref={scrollContainerRef}>
              <AnimatePresence mode="popLayout">
                {displayItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: index * 0.05,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="w-[280px] md:w-[320px] shrink-0"
                  >
                    <ProductCard
                      product={
                        {
                          ...item,
                          main_image_url:
                            item.image || (item as any).main_image_url,
                        } as any
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>

          <div className="absolute top-0 left-0 bottom-0 w-12 md:w-24 bg-linear-to-r from-stone-50/50 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-12 md:w-24 bg-linear-to-l from-stone-50/50 to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
