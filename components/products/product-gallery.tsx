"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import FlashImage from "@/components/ui/flash-image";
import { AdaptiveImageContainer } from "@/components/ui/adaptive-image-container";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const allImages = Array.from(new Set([mainImage, ...images])).filter(Boolean);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / (width / 2));
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollContainer = (direction: "left" | "right") => {
    const container = document.getElementById("gallery-container");
    if (container) {
      const width = container.clientWidth;
      const scrollAmount = width / 2;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Desktop: Dual-Pane Hero (Two-Up) with Soft Controls */}
      <div className="hidden lg:flex w-full h-[80vh] relative group">
        <div
          id="gallery-container"
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-slate-50/50"
          onScroll={handleScroll}
        >
          {allImages.map((img, i) => (
            <AdaptiveImageContainer
              key={i}
              imageUrl={img}
              className="snap-start shrink-0 w-1/2 h-full flex items-center justify-center p-12 border-r border-slate-100 last:border-0"
            >
              <div className="relative w-full h-full max-h-[70vh]">
                <FlashImage
                  src={img}
                  alt={`${name} view ${i + 1}`}
                  fill
                  className="object-contain"
                  priority={i < 2}
                  sizes="50vw"
                />
              </div>
            </AdaptiveImageContainer>
          ))}
        </div>

        {/* Floating Controls (Modern & Rounded) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {/* Thumbnail Strip */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-white shadow-xl shadow-slate-200/50">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  const container =
                    document.getElementById("gallery-container");
                  if (container) {
                    const width = container.clientWidth;
                    container.scrollTo({
                      left: i * (width / 2),
                      behavior: "smooth",
                    });
                  }
                }}
                className={cn(
                  "relative w-10 h-12 overflow-hidden transition-all duration-300 border-2 rounded-xl",
                  i === activeIndex || i === activeIndex + 1
                    ? "border-green-600 ring-2 ring-green-100"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <FlashImage
                  src={img}
                  alt={`Thumb ${i}`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white shadow-xl shadow-slate-200/50 h-[68px]">
            <button
              onClick={() => scrollContainer("left")}
              className="w-10 h-full flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-[1px] h-8 bg-slate-100 mx-1" />
            <button
              onClick={() => scrollContainer("right")}
              className="w-10 h-full flex items-center justify-center hover:bg-slate-100 rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Swipeable Carousel */}
      <div className="lg:hidden w-full h-[55vh] relative group bg-white">
        <div
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center"
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const width = e.currentTarget.clientWidth;
            const newIndex = Math.round(scrollLeft / width);
            setActiveIndex(newIndex);
          }}
        >
          {allImages.map((img, i) => (
            <AdaptiveImageContainer
              key={i}
              imageUrl={img}
              className="snap-center shrink-0 w-full h-full flex items-center justify-center p-8"
            >
              <div className="relative w-full h-full max-h-[50vh]">
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

        {/* Modern Indicator Dot Strip */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {allImages.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-green-600" : "w-1.5 bg-slate-200",
              )}
            />
          ))}
        </div>

        {/* Count Badge */}
        <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md text-slate-900 text-[10px] px-3 py-1.5 rounded-full font-bold shadow-sm border border-slate-100">
          {activeIndex + 1} / {allImages.length}
        </div>
      </div>
    </div>
  );
}
