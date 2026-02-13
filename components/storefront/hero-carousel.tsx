"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FlashImage from "@/components/ui/flash-image"; // Optimized image component
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { toast } from "sonner";
import { QuickAddDialog } from "@/components/products/quick-add-dialog";

export interface HeroProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price?: number | null;
  main_image_url: string | null;
  slug: string;
  product_stock?: any[];
  color_options?: string[] | null;
  size_options?: string[] | null;
}

interface HeroCarouselProps {
  products: HeroProduct[];
}

function DashIndicators({
  count,
  current,
  onChange,
  duration,
  isActive,
}: {
  count: number;
  current: number;
  onChange: (i: number) => void;
  duration: number;
  isActive: boolean;
}) {
  return (
    <div className="flex gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="relative h-[2px] w-8 lg:w-12 bg-white/20 overflow-hidden transition-all duration-300"
        >
          {i === current && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: isActive ? "0%" : "-100%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute inset-0 bg-white"
            />
          )}
          {i < current && <div className="absolute inset-0 bg-white" />}
        </button>
      ))}
    </div>
  );
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  const router = useRouter();
  const isDraggingRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const DURATION = 6000;

  // Quick Add State
  const [quickAddProduct, setQuickAddProduct] = useState<HeroProduct | null>(
    null,
  );
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const getTagline = (product: HeroProduct) => {
    const hash = (str: string) => {
      let h = 0;
      for (let i = 0; i < str.length; i++)
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
      return Math.abs(h);
    };

    const name = product.name.toLowerCase();

    // Logic-driven taglines
    if (name.includes("hoodie")) {
      const hoodieTaglines = [
        "430 GSM Heavyweight Quality",
        "430 GSM Hoodie Season",
        "Engineered for Performance",
        "Level Up Your Aesthetic",
      ];
      return hoodieTaglines[hash(product.id) % hoodieTaglines.length];
    }

    if (name.includes("t-shirt") || name.includes("tee")) {
      const shirtTaglines = [
        "Premium Combed Cotton",
        "Breathable Luxury Fabric",
        "The Future of Streetwear",
        "Bold. Unfiltered. Authentic.",
      ];
      return shirtTaglines[hash(product.id) % shirtTaglines.length];
    }

    const defaultTaglines = [
      "Protein Reimagined. Taste Refined.",
      "Fuel for Your Ambition.",
      "The Lab's Cleanest Energy.",
      "Zero Compromise. Peak Performance.",
      "Bio-Engineered for the Bold.",
    ];

    return defaultTaglines[hash(product.id) % defaultTaglines.length];
  };

  const handleNext = React.useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const handlePrev = React.useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (isPaused || isQuickAddOpen) return;
    const timer = setTimeout(() => {
      handleNext();
    }, DURATION);
    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, isQuickAddOpen, handleNext]);

  // Swipe Handling
  const SWIPE_THRESHOLD = 50;
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      handleNext();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      handlePrev();
    }
  };

  const handleSlideClick = () => {
    if (!isDraggingRef.current && currentProduct) {
      router.push(`/product/${currentProduct.slug}`);
    }
  };

  if (!products || products.length === 0) {
    return (
      <section className="relative w-full h-[85vh] lg:h-[90vh] bg-background overflow-hidden animate-pulse">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-zinc-100 lg:w-[55%] lg:right-0 lg:left-auto" />
      </section>
    );
  }

  const currentProduct = products[currentIndex];
  if (!currentProduct) return null;

  const addItem = useCartStore((state) => state.addItem);

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentProduct) return;

    // Check for variations in stock data
    const stockItems = currentProduct.product_stock || [];
    const hasMultipleOptions = stockItems.length > 1;

    if (hasMultipleOptions) {
      setQuickAddProduct(currentProduct);
      setIsQuickAddOpen(true);
      setIsPaused(true);
      return;
    }

    // Direct Buy logic for products without variations
    const firstStock =
      stockItems.find((s: any) => s.quantity > 0) || stockItems[0];

    addItem(
      {
        productId: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.main_image_url || "",
        size: firstStock?.size || "Standard",
        color: firstStock?.color || "Standard",
        quantity: 1,
        maxQuantity: firstStock?.quantity || 99,
        slug: currentProduct.slug || "",
        categoryId: "",
      },
      { openCart: false, showToast: false },
    );

    router.push("/checkout");
  };

  const cleanDescription = (html: string) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>?/gm, "")
      .replace(/&amp;/g, "&")
      .trim();
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] bg-slate-50 overflow-hidden"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDragEnd={(e, info) => {
            handleDragEnd(e, info);
            setTimeout(() => {
              isDraggingRef.current = false;
            }, 50);
          }}
          onClick={handleSlideClick}
          className="absolute inset-0 w-full h-full cursor-pointer active:cursor-grabbing"
        >
          {/* IMAGE LAYER */}
          <div className="absolute inset-0 w-full h-full">
            {currentProduct.main_image_url && (
              <FlashImage
                src={currentProduct.main_image_url}
                alt={currentProduct.name}
                fill
                className="object-contain lg:object-contain"
                priority={true}
                resizeMode="contain"
                sizes="100vw"
              />
            )}

            {/* Gradient Overlay for Text Readability - subtle for premium feel */}
            <div className="absolute inset-0 bg-slate-900/15 z-10" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent z-10" />
          </div>

          {/* CONTENT LAYER */}
          <div className="relative z-20 h-full w-full container mx-auto px-6 lg:px-12 flex flex-col justify-end lg:justify-center items-center lg:items-start text-center lg:text-left pb-24 lg:pb-0">
            <div className="max-w-5xl text-white flex flex-col items-center lg:items-start">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <span className="inline-block bg-green-600 text-white px-5 py-2 rounded-full text-xs font-semibold tracking-wide shadow-lg">
                  New Launch
                </span>
              </motion.div>

              <div className="min-h-[80px] sm:min-h-[120px] lg:min-h-[220px] flex flex-col justify-center mb-4 sm:mb-8">
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] xl:text-[140px] font-extrabold text-white leading-[0.85] tracking-tight"
                >
                  {currentProduct.name}
                </motion.h1>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-4 mb-8 sm:mb-12"
              >
                <div className="h-[2px] w-6 sm:w-12 bg-white" />
                <span className="text-xs sm:text-sm text-white/80 font-medium tracking-wide whitespace-nowrap">
                  {getTagline(currentProduct)}
                </span>
                <div className="h-[2px] w-6 sm:w-12 bg-white block lg:hidden" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center lg:items-end justify-center lg:justify-start gap-6 sm:gap-10"
              >
                <div className="flex flex-col items-center lg:items-start order-2 sm:order-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-5xl lg:text-7xl font-extrabold">
                      {formatCurrency(currentProduct.price)}
                    </span>
                    {currentProduct.original_price &&
                      currentProduct.original_price > currentProduct.price && (
                        <span className="text-white/40 line-through text-xl lg:text-2xl font-bold">
                          {formatCurrency(currentProduct.original_price)}
                        </span>
                      )}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="h-14 sm:h-16 lg:h-18 px-10 sm:px-14 lg:px-16 rounded-full text-sm font-semibold bg-white text-slate-900 hover:bg-green-600 hover:text-white active:scale-95 transition-all shadow-xl mt-4 sm:mt-0 group border-none order-1 sm:order-2"
                  onClick={handleBuyNow}
                >
                  Buy Now
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* NAVIGATION CONTROLS */}
      <div className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-4">
        <DashIndicators
          count={products.length}
          current={currentIndex}
          onChange={(i) => {
            setDirection(i > currentIndex ? 1 : -1);
            setCurrentIndex(i);
          }}
          duration={DURATION}
          isActive={!isPaused}
        />
      </div>

      {/* DESKTOP ARROWS */}
      <div className="hidden lg:flex absolute inset-y-0 inset-x-4 items-center justify-between z-30 pointer-events-none">
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePrev}
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white pointer-events-auto border border-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleNext}
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white pointer-events-auto border border-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Add Dialog */}
      {quickAddProduct && (
        <QuickAddDialog
          product={quickAddProduct}
          open={isQuickAddOpen}
          onOpenChange={(open) => {
            setIsQuickAddOpen(open);
            if (!open) setIsPaused(false);
          }}
          buyNowMode={true}
        />
      )}
    </section>
  );
}
