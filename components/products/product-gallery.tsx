"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import FlashImage from "@/components/ui/flash-image";
import { AdaptiveImageContainer } from "@/components/ui/adaptive-image-container";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  mainImage: string;
}

export function ProductGallery({
  images,
  name,
  mainImage,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const allImages = Array.from(new Set([mainImage, ...images])).filter(Boolean);

  const scrollThumbnails = (dir: "up" | "down") => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({
        top: dir === "up" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* ═══ DESKTOP ═══ */}
      <div className="hidden lg:flex gap-3 h-[82vh] p-3">
        {/* Vertical Thumbnail Strip */}
        <div className="flex flex-col items-center gap-2 w-20 shrink-0">
          {allImages.length > 4 && (
            <button
              onClick={() => scrollThumbnails("up")}
              className="w-full flex justify-center py-1 text-stone-300 hover:text-stone-600 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
          <div
            ref={thumbnailRef}
            className="flex flex-col gap-2 overflow-y-auto scrollbar-hide flex-1"
          >
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0",
                  i === activeIndex
                    ? "border-rose-400 ring-2 ring-rose-100 shadow-md"
                    : "border-stone-100 hover:border-rose-200 opacity-50 hover:opacity-100",
                )}
              >
                <FlashImage
                  src={img}
                  alt={`${name} thumb ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
          {allImages.length > 4 && (
            <button
              onClick={() => scrollThumbnails("down")}
              className="w-full flex justify-center py-1 text-stone-300 hover:text-stone-600 transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Image */}
        <AdaptiveImageContainer
          imageUrl={allImages[activeIndex]}
          className="flex-1 rounded-3xl overflow-hidden bg-rose-50/30 border border-rose-100/50 flex items-center justify-center"
        >
          <div className="relative w-full h-full p-10">
            <FlashImage
              src={allImages[activeIndex]}
              alt={`${name} view ${activeIndex + 1}`}
              fill
              className="object-contain transition-opacity duration-300"
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
        </AdaptiveImageContainer>
      </div>

      {/* ═══ MOBILE ═══ */}
      <div className="lg:hidden w-full aspect-square relative bg-rose-50/30">
        <div
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          onScroll={(e) => {
            const sl = e.currentTarget.scrollLeft;
            const w = e.currentTarget.clientWidth;
            setActiveIndex(Math.round(sl / w));
          }}
        >
          {allImages.map((img, i) => (
            <AdaptiveImageContainer
              key={i}
              imageUrl={img}
              className="snap-center shrink-0 w-full h-full flex items-center justify-center p-6"
            >
              <div className="relative w-full h-full">
                <FlashImage
                  src={img}
                  alt={`${name} view ${i + 1}`}
                  fill
                  className="object-contain"
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
            </AdaptiveImageContainer>
          ))}
        </div>
        {/* Pill Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/80 backdrop-blur-lg px-3 py-1.5 rounded-full shadow-sm border border-rose-100/50">
          {allImages.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-5 bg-rose-400" : "w-1.5 bg-stone-300",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
