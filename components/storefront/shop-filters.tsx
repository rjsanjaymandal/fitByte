"use client";

import { useQueryState, parseAsInteger } from "nuqs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { Database } from "@/types/supabase";

type Category = Database["public"]["Tables"]["categories"]["Row"];

// Constants
const SIZES = ["500G", "1KG", "2KG", "B-12", "B-24"];
const COLORS = [
  {
    name: "Classic Chocolate",
    value: "chocolate",
    class: "bg-[#4B2C20] border-none",
  },
  {
    name: "Velvet Vanilla",
    value: "vanilla",
    class: "bg-[#FFF8E1] border border-zinc-200",
  },
  { name: "Wild Berry", value: "berry", class: "bg-[#D32F2F] border-none" },
  { name: "Tangy Citrus", value: "citrus", class: "bg-[#FFEB3B] border-none" },
  {
    name: "Natural Unflavored",
    value: "natural",
    class: "bg-zinc-100 border border-zinc-200",
  },
];

export function ShopFilters({ categories }: { categories: Category[] }) {
  const [category, setCategory] = useQueryState("category", {
    shallow: false,
    history: "push",
  });

  return (
    <>
      {/* Mobile: Floating Filter Action Button */}
      <div className="md:hidden fixed bottom-24 right-5 z-40 group">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-14 w-14 rounded-none shadow-2xl flex items-center justify-center p-0 transition-all duration-300 hover:scale-110 active:scale-90 bg-[#1a2b47] border-none text-white">
              <Filter className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[80vh] rounded-none border-[#1a2b47]/10 bg-white overflow-y-auto px-8 pb-12 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <SheetHeader className="mb-8 pt-6">
                <div className="flex flex-col gap-2">
                  <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px]">
                    Filter Nutrition
                  </span>
                  <SheetTitle className="text-4xl font-black tracking-tighter uppercase text-foreground leading-none">
                    THE <span className="text-primary italic">LAB</span>
                  </SheetTitle>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto pr-2 pb-24 scrollbar-hide">
                <FilterContent
                  categories={categories}
                  category={category}
                  setCategory={setCategory}
                />
              </div>

              {/* Mobile Stick Apply */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-white via-white/95 to-transparent pt-12 z-10">
                <SheetTrigger asChild>
                  <Button className="w-full h-14 rounded-none font-black uppercase tracking-[0.3em] bg-[#1a2b47] border-none text-white text-[11px] hover:bg-black transition-all">
                    Apply Filters
                  </Button>
                </SheetTrigger>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar Filters */}
      <aside className="hidden md:block w-72 shrink-0 self-start sticky top-24">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px]">
            Precision Search
          </span>
          <h2 className="text-4xl font-black tracking-tighter uppercase text-foreground leading-none">
            THE <span className="text-primary italic">LAB</span>
          </h2>
        </div>
        <FilterContent
          categories={categories}
          category={category}
          setCategory={setCategory}
        />
      </aside>

      {/* Categories Toolbar (Mobile/Tablet Pills - Hidden on Wide for Sidebar) */}
      <div className="w-full md:hidden flex flex-col gap-6 mb-12">
        <div className="flex overflow-x-auto snap-x snap-mandatory items-center gap-3 pb-4 scrollbar-hide px-4 md:px-0 md:justify-center md:flex-wrap md:pb-0">
          <button
            onClick={() => setCategory(null)}
            className={cn(
              "px-10 py-4 rounded-none text-[11px] font-black uppercase tracking-[0.2em] transition-all border-none whitespace-nowrap snap-center",
              !category
                ? "bg-[#1a2b47] text-white shadow-xl"
                : "bg-white text-[#1a2b47] border border-[#1a2b47]/10 hover:border-[#1a2b47]",
            )}
          >
            Everything
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={cn(
                "px-10 py-4 rounded-none text-[11px] font-black uppercase tracking-[0.2em] transition-all border-none whitespace-nowrap snap-center",
                category === (c.slug || c.id)
                  ? "bg-[#1a2b47] text-white shadow-xl"
                  : "bg-white text-[#1a2b47] border border-[#1a2b47]/10 hover:border-[#1a2b47]",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function FilterContent({
  categories,
  category,
  setCategory,
}: {
  categories: Category[];
  category: string | null;
  setCategory: (value: string | null) => void;
}) {
  // State (Set shallow: false to trigger server-side re-render on URL change)
  const [minPrice, setMinPrice] = useQueryState(
    "min_price",
    parseAsInteger.withOptions({ shallow: false, history: "push" }),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "max_price",
    parseAsInteger.withOptions({ shallow: false, history: "push" }),
  );
  const [size, setSize] = useQueryState("size", {
    shallow: false,
    history: "push",
  });
  const [color, setColor] = useQueryState("color", {
    shallow: false,
    history: "push",
  });

  // Local state for slider performance
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [mounted, setMounted] = useState(false);

  // Sync local slider with URL on mount/update
  useEffect(() => {
    setPriceRange([minPrice || 0, maxPrice || 20000]);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = (value: number[]) => {
    setMinPrice(value[0] || null);
    setMaxPrice(value[1] || null);
  };

  const clearFilters = () => {
    setMinPrice(null);
    setMaxPrice(null);
    setSize(null);
    setColor(null);
    setCategory(null);
  };

  const hasFilters = minPrice || maxPrice || size || color || category;

  const textClass = "text-foreground";
  const mutedClass = "text-muted-foreground";

  return (
    <div className="space-y-8 pb-12">
      {hasFilters && mounted && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full h-12 rounded-none font-black uppercase tracking-[0.2em] text-[10px] transition-all bg-white text-[#1a2b47] border-[#1a2b47]/10 hover:bg-[#1a2b47] hover:text-white hover:border-[#1a2b47] shadow-sm"
        >
          Clear Selection
        </Button>
      )}

      <Accordion
        type="multiple"
        defaultValue={["categories", "price", "size", "color"]}
        className="w-full space-y-4"
      >
        {/* Categories */}
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger
            className={cn(
              "py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:no-underline",
              textClass,
            )}
          >
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => setCategory(null)}
                className={cn(
                  "text-left text-[11px] py-4 px-6 rounded-none transition-all font-black uppercase tracking-[0.2em] border",
                  !category
                    ? "bg-[#1a2b47] text-white shadow-xl scale-[1.02] border-[#1a2b47]"
                    : "bg-white border-[#1a2b47]/5 text-[#1a2b47]/40 hover:border-[#1a2b47] hover:text-[#1a2b47]",
                )}
              >
                Everything
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "text-left text-[11px] py-4 px-6 rounded-none transition-all font-black uppercase tracking-[0.2em] border",
                    category === (c.slug || c.id)
                      ? "bg-[#1a2b47] text-white shadow-xl scale-[1.02] border-[#1a2b47]"
                      : "bg-white border-[#1a2b47]/5 text-[#1a2b47]/40 hover:border-[#1a2b47] hover:text-[#1a2b47]",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger
            className={cn(
              "py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:no-underline",
              textClass,
            )}
          >
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-6 px-2 space-y-6">
              <Slider
                defaultValue={[0, 20000]}
                max={20000}
                step={500}
                value={priceRange}
                onValueChange={handlePriceChange}
                onValueCommit={handlePriceCommit}
                className="my-4"
              />
              <div
                className={cn(
                  "flex items-center justify-between text-[10px] font-bold uppercase tracking-widest",
                  mutedClass,
                )}
              >
                <span className="bg-[#1a2b47]/5 text-[#1a2b47] px-4 py-1.5 rounded-none border border-[#1a2b47]/10">
                  ₹{priceRange[0]}
                </span>
                <span className="bg-[#1a2b47]/5 text-[#1a2b47] px-4 py-1.5 rounded-none border border-[#1a2b47]/10">
                  ₹{priceRange[1]}+
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size" className="border-none">
          <AccordionTrigger
            className={cn(
              "py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:no-underline",
              textClass,
            )}
          >
            Select Weight
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {SIZES.map((s) => (
                <Button
                  key={s}
                  variant={size === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(size === s ? null : s)}
                  className={cn(
                    "h-12 w-full rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                    size === s
                      ? "bg-[#1a2b47] text-white shadow-xl scale-105 border-[#1a2b47]"
                      : "border-[#1a2b47]/10 hover:border-[#1a2b47] bg-white text-[#1a2b47]/40 hover:text-[#1a2b47]",
                  )}
                >
                  {s}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        <AccordionItem value="color" className="border-none">
          <AccordionTrigger
            className={cn(
              "py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:no-underline",
              textClass,
            )}
          >
            Select Flavor
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-4 pt-4">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(color === c.value ? null : c.value)}
                  className={cn(
                    "h-10 w-10 rounded-2xl transition-all ring-offset-2 ring-offset-background relative overflow-hidden",
                    c.class,
                    color === c.value
                      ? "ring-2 ring-primary scale-125 shadow-2xl z-10"
                      : "hover:scale-110 border-white/5 shadow-lg",
                  )}
                  title={c.name}
                >
                  {color === c.value && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="h-1 w-1 rounded-full bg-white shadow-[0_0_10px_white]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
