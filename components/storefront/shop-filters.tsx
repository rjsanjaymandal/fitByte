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
    name: "Chocolate",
    value: "chocolate",
    class: "bg-amber-900 border border-white/10",
  },
  {
    name: "Vanilla",
    value: "vanilla",
    class: "bg-yellow-50 border border-border",
  },
  { name: "Berry", value: "berry", class: "bg-rose-500 border-none" },
  { name: "Citrus", value: "citrus", class: "bg-lime-500 border-none" },
  {
    name: "Unflavored",
    value: "natural",
    class: "bg-slate-200 border border-border",
  },
];

export function ShopFilters({ categories }: { categories: Category[] }) {
  return (
    <>
      {/* Mobile: Floating Filter Action Button */}
      <div className="md:hidden fixed bottom-24 right-5 z-40 group">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-14 w-14 rounded-2xl shadow-[0_20px_40px_rgba(20,184,166,0.4)] flex items-center justify-center p-0 transition-all duration-500 hover:scale-110 active:scale-90 bg-primary border-none">
              <Filter className="h-6 w-6 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 blur-lg rounded-2xl"
              />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] rounded-t-[3.5rem] border-white/5 bg-background/90 backdrop-blur-3xl overflow-y-auto px-8 pb-12 shadow-[0_-20px_80px_rgba(0,0,0,0.5)]"
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
      <aside className="hidden md:block w-72 shrink-0 animate-in sticky top-24 h-fit rounded-3xl border border-primary/10 bg-white/80 p-6 backdrop-blur-md shadow-xl shadow-primary/5">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px]">
            Filter By
          </span>
          <h3 className="font-extrabold text-3xl tracking-tighter uppercase font-serif">
            The <span className="text-primary italic">Lab</span>
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
          className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all bg-transparent text-primary border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 shadow-sm"
        >
          Reset Selections
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
                  "text-left text-[11px] py-3.5 px-6 rounded-2xl transition-all font-bold uppercase tracking-wider border",
                  !category
                    ? "bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(20,184,166,0.25)] scale-[1.02] border-primary"
                    : "bg-muted/30 border-transparent hover:border-primary/20 text-muted-foreground hover:text-foreground",
                )}
              >
                All Picks
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.slug)}
                  className={cn(
                    "text-left text-[11px] py-3.5 px-6 rounded-2xl transition-all font-bold uppercase tracking-wider border",
                    category === (c.slug || c.id)
                      ? "bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(20,184,166,0.25)] scale-[1.02] border-primary"
                      : "bg-muted/30 border-transparent hover:border-primary/20 text-muted-foreground hover:text-foreground",
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
            <div className="grid grid-cols-3 gap-3 pt-2">
              {SIZES.map((s) => (
                <Button
                  key={s}
                  variant={size === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSize(size === s ? null : s)}
                  className={cn(
                    "h-12 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                    size === s
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105 border-primary"
                      : cn(
                          "border-border hover:border-primary/50 hover:bg-muted text-muted-foreground hover:text-foreground",
                          mutedClass,
                        ),
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
