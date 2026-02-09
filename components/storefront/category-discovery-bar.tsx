"use client";

import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/store-types";

interface CategoryDiscoveryBarProps {
  categories: Category[];
}

export function CategoryDiscoveryBar({
  categories,
}: CategoryDiscoveryBarProps) {
  const [activeCategory, setActiveCategory] = useQueryState("category", {
    shallow: false,
    history: "push",
  });

  return (
    <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar mask-gradient-right">
      <button
        onClick={() => setActiveCategory(null)}
        className={cn(
          "shrink-0 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] transition-all border outline-none",
          !activeCategory
            ? "bg-primary text-black shadow-xl shadow-primary/20 border-primary scale-105"
            : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 border-transparent hover:border-zinc-200",
        )}
      >
        Everything
      </button>
      {categories?.map((c) => (
        <button
          key={c.id}
          onClick={() => setActiveCategory(c.slug)}
          className={cn(
            "shrink-0 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[11px] transition-all border outline-none",
            activeCategory === (c.slug || c.id)
              ? "bg-primary text-black shadow-xl shadow-primary/20 border-primary scale-105"
              : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 border-transparent hover:border-zinc-200",
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
