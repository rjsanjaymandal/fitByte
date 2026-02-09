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
  return (
    <>
      {/* Mobile: Floating Filter Action Button */}
      <div className="md:hidden fixed bottom-24 right-5 z-40 group">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-16 w-16 rounded-full shadow-[0_20px_50px_rgba(255,222,0,0.4)] flex items-center justify-center p-0 transition-all duration-500 hover:scale-110 active:scale-90 bg-primary border-none text-black">
              <Filter className="h-6 w-6" />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/40 blur-xl rounded-full"
              />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] rounded-t-[3rem] border-zinc-100 bg-white overflow-y-auto px-8 pb-12 shadow-2xl"
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
                <FilterContent categories={categories} />
              </div>

              {/* Mobile Stick Apply */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/95 to-transparent pt-16 z-10">
                <SheetTrigger asChild>
                  <Button className="w-full h-16 rounded-2xl font-bold uppercase tracking-[0.2em] bg-primary shadow-[0_15px_40px_rgba(20,184,166,0.4)] border-none text-white text-base hover:bg-primary/90">
                    View Results
                  </Button>
                </SheetTrigger>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 animate-in sticky top-24 h-fit rounded-[2.5rem] border border-zinc-100 bg-white p-8 shadow-2xl shadow-black/5">
        <div className="flex flex-col gap-1 mb-10">
          <span className="text-secondary font-black tracking-[0.3em] uppercase text-[10px]">
            Personalize
          </span>
          <h3 className="font-black text-4xl tracking-tighter uppercase font-serif text-black leading-none">
            THE <span className="text-primary italic">LAB</span>
          </h3>
        </div>
        <FilterContent categories={categories} />
      </aside>
    </>
  );
}

function FilterContent({ categories }: { categories: Category[] }) {
  // State
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
  const [category, setCategory] = useQueryState("category", {
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
          className="w-full h-12 rounded-full font-black uppercase tracking-widest text-[10px] transition-all bg-zinc-50 text-black border-zinc-200 hover:bg-black hover:text-white hover:border-black shadow-sm"
        >
          Clear All
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
                  "text-left text-[11px] py-4 px-6 rounded-full transition-all font-black uppercase tracking-widest border",
                  !category
                    ? "bg-primary text-black shadow-xl shadow-primary/20 scale-[1.02] border-primary"
                    : "bg-zinc-50 border-transparent hover:border-zinc-200 text-zinc-400 hover:text-black",
                )}
              >
                Everything
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "text-left text-[11px] py-4 px-6 rounded-full transition-all font-black uppercase tracking-widest border",
                    category === (c.slug || c.id)
                      ? "bg-primary text-black shadow-xl shadow-primary/20 scale-[1.02] border-primary"
                      : "bg-zinc-50 border-transparent hover:border-zinc-200 text-zinc-400 hover:text-black",
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
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                  ₹{priceRange[0]}
                </span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
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
                    "h-12 w-full rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                    size === s
                      ? "bg-primary text-black shadow-xl shadow-primary/20 scale-105 border-primary"
                      : "border-zinc-200 hover:border-black hover:bg-zinc-50 text-zinc-400 hover:text-black",
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
