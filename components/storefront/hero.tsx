"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FlashImage from "@/components/ui/flash-image";
import { BrandBadge } from "./brand-badge";
import { BrandGlow } from "./brand-glow";

export function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-screen flex items-center justify-center bg-[#e31e24] overflow-hidden py-16 lg:py-24 px-4 sm:px-6">
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* IMAGE SECTION - Floating Products */}
        <div className="relative order-2 lg:order-1 flex justify-center items-center h-[320px] sm:h-[450px] lg:h-[650px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex justify-center items-center"
          >
            <div className="relative w-[280px] h-[350px] sm:w-[380px] sm:h-[480px] lg:w-[480px] lg:h-[600px]">
              <FlashImage
                src="https://images.unsplash.com/photo-1622484210800-208208706bae?q=80&w=2070&auto=format&fit=crop"
                alt="fitByte Protein Milkshake"
                fill
                priority
                className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
              />
            </div>
          </motion.div>

          {/* Scalloped Badge - Mobile Adjusted */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="absolute top-4 left-2 sm:top-10 sm:left-0 lg:-left-20 w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-white shadow-3xl flex items-center justify-center text-center p-4 border-[3px] border-zinc-100"
            style={{ borderRadius: "50% 50% 50% 50% / 15% 15% 15% 15%" }}
          >
            <div className="flex flex-col gap-0.5 pointer-events-none">
              <span className="text-[8px] sm:text-[10px] lg:text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Buy 3 Packs
              </span>
              <span className="text-lg sm:text-2xl lg:text-4xl font-black text-[#1a2b47]">
                ₹1,499/-
              </span>
              <span className="text-[8px] sm:text-[10px] lg:text-[12px] font-black uppercase tracking-[0.2em] text-[#e31e24]">
                Special Deal
              </span>
            </div>
          </motion.div>
        </div>

        {/* TEXT SECTION */}
        <div className="relative z-20 order-1 lg:order-2 text-center lg:text-left pt-8 lg:pt-0">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 lg:space-y-12"
          >
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-[0.95] text-white uppercase italic">
                Love makes
                <br />
                <span className="text-white/60">you strong.</span>
                <br />
                <span className="text-[#fdfcf0]">
                  Protein makes
                  <br />
                  you stronger.
                </span>
              </h1>

              {/* Taglines - Flowing Flex */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 pt-4">
                {["High Protein", "No added sugar", "No preservatives"].map(
                  (tag) => (
                    <div
                      key={tag}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 border border-white/25 text-white text-[9px] sm:text-[11px] lg:text-[13px] font-black uppercase tracking-[0.15em] bg-white/5 backdrop-blur-sm rounded-none"
                    >
                      {tag}
                    </div>
                  ),
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 rounded-none text-[13px] sm:text-[15px] font-black uppercase tracking-[0.2em] bg-white text-[#e31e24] hover:bg-[#fdfcf0] transition-all shadow-2xl"
                asChild
              >
                <Link href="/shop">Shop the Collection</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Decor - Refined for mobile visibility */}
      <div className="absolute top-0 right-0 w-full lg:w-1/3 h-full bg-linear-to-l from-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute -top-10 -right-10 lg:p-10 opacity-5 sm:opacity-10 pointer-events-none select-none">
        <span className="text-[120px] sm:text-[180px] lg:text-[250px] font-black text-white leading-none">
          FITBYTES.
        </span>
      </div>
    </section>
  );
}
