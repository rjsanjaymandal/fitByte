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

  if (!products || products.length === 0) {
    return (
      <section className="relative w-full h-[85vh] lg:h-[90vh] bg-[#faf7f2] overflow-hidden animate-pulse">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-stone-100 lg:w-[55%] lg:right-0 lg:left-auto" />
      </section>
    );
  }

  const currentProduct = products[currentIndex];
  if (!currentProduct) return null;

  const addItem = useCartStore((state) => state.addItem);

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

  const getProductColor = (product: HeroProduct) => {
    if (product.color_options && product.color_options.length > 0) {
      const color = product.color_options[0].toLowerCase();
      const colorMap: Record<string, string> = {
        rose: "#fb7185",
        pink: "#fb7185",
        yellow: "#facc15",
        lime: "#84cc16",
        chocolate: "#451a03",
        brown: "#451a03",
        cream: "#faf7f2",
        stone: "#78716c",
        black: "#1c1917",
        blue: "#3b82f6",
      };

      for (const [key, val] of Object.entries(colorMap)) {
        if (color.includes(key)) return val;
      }
    }
    return "#1c1917"; // Default stone-950/black
  };

  const backgroundColor = getProductColor(currentProduct);

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[45vh] sm:h-[55vh] lg:h-screen overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor }}
    >
      {/* Dynamic Background Pulse/Grain */}
      <div className="absolute inset-0 opacity-20 grain pointer-events-none" />
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 w-full h-full flex items-center"
        >
          {/* PRODUCT IMAGE LAYER - Centered Cinematic Presence */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                y: [0, -20, 0],
              }}
              transition={{
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                rotate: { duration: 0.8 },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="relative w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] lg:w-[650px] lg:h-[650px] drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)] lg:drop-shadow-[0_45px_45px_rgba(0,0,0,0.4)]"
            >
              {currentProduct.main_image_url && (
                <FlashImage
                  src={currentProduct.main_image_url}
                  alt={currentProduct.name}
                  fill
                  className="object-contain"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </motion.div>
          </div>

          {/* Cinematic Gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />

          {/* CONTENT LAYER - Centered & Impactful */}
          <div className="relative z-20 h-full w-full container mx-auto px-6 flex flex-col justify-center items-center text-center">
            <div className="max-w-4xl w-full">
              <div className="space-y-4 mb-12 overflow-hidden">
                <motion.h1
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.5,
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[1.8rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] xl:text-[8rem] font-black text-white leading-[0.9] tracking-tighter uppercase"
                >
                  {currentProduct.name}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="flex items-center justify-center mt-2 lg:mt-4"
                >
                  <span className="text-[8px] sm:text-xs text-white/70 font-bold uppercase tracking-[0.3em] lg:tracking-[0.4em]">
                    {getTagline(currentProduct)}
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex items-center justify-center"
              >
                <Link href={`/product/${currentProduct.slug}`}>
                  <button className="px-8 lg:px-12 h-10 lg:h-14 bg-white text-black font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-[8px] lg:text-[10px] hover:bg-black hover:text-white transition-all duration-500 shadow-2xl flex items-center gap-3 lg:gap-4 group">
                    Explore
                    <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* NAVIGATION CONTROLS - Floating Glass Indicators */}
      <div className="absolute inset-x-0 bottom-12 z-40 flex flex-col items-center gap-6">
        <DashIndicators
          count={products.length}
          current={currentIndex}
          onChange={(i) => {
            setDirection(i > currentIndex ? 1 : -1);
            setCurrentIndex(i);
          }}
          duration={DURATION}
          isActive={!isPaused && !isQuickAddOpen}
        />
      </div>

      {/* DESKTOP ARROWS - Minimalist Cinematic Style */}
      <div className="hidden lg:flex absolute inset-y-0 inset-x-8 items-center justify-between z-40 pointer-events-none">
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePrev}
          className="h-16 w-16 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white pointer-events-auto border border-white/10 shadow-3xl transition-all hover:scale-110 active:scale-95 group"
        >
          <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleNext}
          className="h-16 w-16 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white pointer-events-auto border border-white/10 shadow-3xl transition-all hover:scale-110 active:scale-95 group"
        >
          <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
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
