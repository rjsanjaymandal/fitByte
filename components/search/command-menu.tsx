"use client";

import { useState, useEffect, useTransition } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ShoppingBag, Package, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchProducts, getSearchIndex } from "@/app/actions/search-actions";
import { useSearchStore } from "@/store/use-search-store";
import { formatCurrency } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import FlashImage from "@/components/ui/flash-image";

export function CommandMenu() {
  const { isOpen, setOpen, toggle } = useSearchStore();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [items, setItems] = useState<any[]>([]);
  const [initialIndex, setInitialIndex] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Pre-warm the search index on open
  useEffect(() => {
    if (isOpen && initialIndex.length === 0) {
      getSearchIndex().then(setInitialIndex);
    }
  }, [isOpen, initialIndex.length]);

  // Instant Local Search Effect
  useEffect(() => {
    if (query.length === 0) {
      setItems([]);
      return;
    }

    // Phase 1: Local Search (Instant)
    if (initialIndex.length > 0) {
      const local = initialIndex
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5);

      if (local.length > 0) {
        setItems(local);
      }
    }
  }, [query, initialIndex]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  // Server-side Search Effect
  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setItems([]);
      return;
    }

    startTransition(async () => {
      const results = await searchProducts(debouncedQuery);
      setItems(results);
    });
  }, [debouncedQuery]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen} shouldFilter={false}>
      <div className="bg-stone-50/80 backdrop-blur-xl">
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
          className="h-16 text-lg font-bold placeholder:text-stone-300 border-none focus:ring-0 bg-transparent px-6 text-stone-900"
        />
      </div>
      <CommandList className="scrollbar-hide bg-white/90 backdrop-blur-2xl border-t border-stone-100 p-2">
        <CommandEmpty className="py-12 text-center">
          {isPending ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                Searching...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {!query ? (
                <p className="text-sm font-bold text-stone-300 uppercase tracking-widest">
                  Start Typing
                </p>
              ) : (
                <>
                  <Package className="h-10 w-10 text-stone-200" />
                  <p className="text-sm font-medium text-stone-400">
                    No products found.
                  </p>
                </>
              )}
            </div>
          )}
        </CommandEmpty>

        {items.length > 0 && (
          <CommandGroup
            heading={
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 ml-2 mb-2 block">
                Results
              </span>
            }
          >
            {items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() =>
                  runCommand(() =>
                    router.push(`/product/${item.slug || item.id}`),
                  )
                }
                className="group rounded-2xl mx-1 mb-2 cursor-pointer py-3 hover:bg-stone-50 aria-selected:bg-rose-50 transition-colors"
              >
                <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-stone-100 group-hover:border-rose-200 transition-colors mr-4 shrink-0 bg-[#faf7f2]">
                  {item.main_image_url && (
                    <FlashImage
                      src={item.main_image_url}
                      className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                      alt={item.name}
                      fill
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                  <span className="font-bold uppercase tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors truncate text-sm md:text-base">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.price && (
                      <span className="text-xs font-bold text-stone-400 font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded border border-rose-100 bg-rose-50 text-rose-500 uppercase font-bold tracking-wider">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-aria-selected:opacity-100 group-aria-selected:translate-x-0 group-hover:opacity-100 group-hover:translate-x-0 ml-auto mr-2 text-rose-500" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
