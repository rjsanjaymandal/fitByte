"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight, ArrowUpRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryDropdownProps {
  categories: {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
    children?: {
      id: string;
      name: string;
      slug: string;
    }[];
  }[];
}

export function CategoryDropdown({ categories }: CategoryDropdownProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[850px] pt-4 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 cubic-bezier(0.23, 1, 0.32, 1) z-100">
      <motion.div
        className="bg-white/95 backdrop-blur-2xl border border-stone-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-4xl overflow-hidden p-10 ring-1 ring-black/3"
        initial={{ opacity: 0, scale: 0.98 }}
        whileHover={{ scale: 1 }}
      >
        <div className="grid grid-cols-12 gap-10">
          {/* Dynamic Categories Grid */}
          <div className="col-span-8 grid grid-cols-2 gap-x-10 gap-y-12">
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                className="space-y-4 group/cat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/shop?category=${category.id}`}
                  className="flex items-center gap-2 group/header w-fit"
                >
                  <h4 className="font-black text-[11px] uppercase tracking-[0.25em] text-stone-900 group-hover/header:text-rose-500 transition-colors">
                    {category.name}
                  </h4>
                  <div className="h-px w-0 group-hover/header:w-4 bg-rose-500 transition-all duration-300" />
                </Link>

                {/* If children exist, list them. If not, show description/CTA */}
                {category.children && category.children.length > 0 ? (
                  <div className="flex flex-col gap-2.5 border-l border-stone-100 pl-4 ml-0.5">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/shop?category=${child.id}`}
                        className="text-[13px] font-medium text-stone-500 hover:text-rose-500 transition-colors flex items-center group/item"
                      >
                        <span className="w-0 group-hover/item:w-1.5 h-px bg-rose-400 mr-0 group-hover/item:mr-2 transition-all opacity-0 group-hover/item:opacity-100" />
                        {child.name}
                      </Link>
                    ))}
                    <Link
                      href={`/shop?category=${category.id}`}
                      className="text-[10px] font-black uppercase tracking-widest text-rose-500 mt-2 flex items-center gap-1.5 hover:gap-2.5 transition-all"
                    >
                      Explore Range <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="border-l border-stone-100 pl-4 ml-0.5">
                    <p className="text-[12px] text-stone-400 mb-4 line-clamp-2 leading-relaxed">
                      Experience the pinnacle of nutrition with our{" "}
                      {category.name.toLowerCase()} range.
                    </p>
                    <Link
                      href={`/shop?category=${category.id}`}
                      className="text-[10px] font-bold text-white bg-stone-900 hover:bg-rose-500 px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      Shop Collection
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Featured showcase Column */}
          <div className="col-span-4 space-y-6 border-l border-stone-100 pl-10 flex flex-col">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-stone-400">
                  Featured Drop
                </h4>
                <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500 animate-pulse" />
              </div>

              <Link
                href="/shop"
                className="block relative group/card overflow-hidden rounded-2xl aspect-4/5 bg-stone-100"
              >
                <div className="absolute inset-0 bg-linear-to-t from-stone-900/90 via-stone-900/20 to-transparent z-10" />

                {/* Simulated Glassmorphism Badge */}
                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full glass-dark text-[10px] font-bold text-white uppercase tracking-widest ring-1 ring-white/20">
                  New
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <span className="text-rose-400 font-black uppercase tracking-[0.2em] text-[10px] mb-1">
                    Essentials
                  </span>
                  <h3 className="text-white font-black uppercase text-xl leading-tight mb-3">
                    The Pulse <br /> Collection
                  </h3>
                  <div className="flex items-center gap-2 text-white/60 group-hover/card:text-white transition-colors">
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      Shop Now
                    </span>
                    <ArrowUpRight className="h-4 w-4 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-stone-200 group-hover/card:scale-110 transition-transform duration-700" />
              </Link>

              <div className="mt-6 p-4 rounded-xl bg-rose-50/50 border border-rose-100/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                    Flash Sale
                  </p>
                  <p className="text-[12px] font-medium text-stone-600">
                    Up to 40% Off
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-rose-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { ArrowRight } from "lucide-react";
