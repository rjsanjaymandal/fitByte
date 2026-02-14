"use client";

import { motion } from "framer-motion";
import FlashImage from "@/components/ui/flash-image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function ScienceBlock() {
  return (
    <section className="py-24 bg-[#fdfcf0] relative overflow-hidden border-t-2 border-[#1a2b47]">
      {/* Background Decorative Pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #1a2b47 0, #1a2b47 1px, transparent 0, transparent 40px)",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Content Side */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="flex flex-col gap-4">
              <span className="text-[#e31e24] font-black tracking-[0.3em] uppercase text-xs">
                The FitByte Standard
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2b47] tracking-tighter uppercase leading-[0.85]">
                Not All Protein <br />
                <span className="text-zinc-300">Is Created Equal.</span>
              </h2>
            </div>

            <p className="text-lg text-[#1a2b47] font-medium leading-relaxed max-w-xl">
              We engineered FitByte formulas with one goal: Bio-availability.
              Our precise blend ensures maximum absorption and minimal digestive
              stress. It&apos;s not just food—it&apos;s high-performance fuel.
            </p>

            <ul className="grid gap-5">
              {[
                "Micro-Filtered Whey Isolate",
                "Digestive Enzyme Complex",
                "Zero Artificial Fillers",
                "Lab-Tested Purity",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="flex-none p-1 bg-[#1a2b47] text-white">
                    <CheckCircle2 className="h-4 w-4 stroke-3" />
                  </div>
                  <span className="text-[#1a2b47] font-black uppercase tracking-widest text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link href="/about">
                <Button className="h-16 px-10 rounded-none bg-[#1a2b47] text-white hover:bg-[#e31e24] transition-all font-black uppercase tracking-[0.2em] text-xs shadow-[6px_6px_0px_0px_rgba(227,30,36,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                  Discover Our Science
                  <ArrowRight className="ml-2 h-4 w-4 stroke-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative order-1 lg:order-2 h-[450px] lg:h-[650px] w-full border-4 border-[#1a2b47] bg-white rounded-none overflow-hidden group shadow-[12px_12px_0px_0px_rgba(26,43,71,1)]">
            {/* Visual Elements */}
            <div className="absolute inset-0 bg-white flex items-center justify-center">
              {/* Decorative Grid */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(#1a2b47 1px, transparent 1px), linear-gradient(90deg, #1a2b47 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <span className="text-zinc-100 font-black text-[8rem] lg:text-[10rem] absolute -top-10 -right-10 pointer-events-none uppercase">
                LAB
              </span>

              <div className="relative z-10 text-center px-8">
                <div className="inline-block p-4 border-2 border-[#1a2b47] bg-[#fdfcf0] mb-6">
                  <Sparkles className="h-12 w-12 text-[#e31e24] stroke-[1.5]" />
                </div>
                <h3 className="text-3xl lg:text-5xl font-black text-[#1a2b47] uppercase tracking-tighter leading-none mb-4">
                  Engineered for <br />
                  <span className="text-[#e31e24]">Performance.</span>
                </h3>
              </div>
            </div>

            {/* Text Overlay Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-[#fdfcf0] p-8 border-4 border-[#1a2b47] shadow-[8px_8px_0px_0px_rgba(227,30,36,1)] z-20">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1a2b47]/60 mb-2">
                    Active Formula
                  </p>
                  <p className="text-2xl font-black text-[#1a2b47] uppercase leading-none">
                    Hydrolyzed Matrix
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black text-[#e31e24] leading-none mb-1">
                    98%
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2b47]/60">
                    Absorption Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
