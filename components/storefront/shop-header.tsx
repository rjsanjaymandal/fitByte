"use client";

import { motion } from "framer-motion";

export function ShopHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-0 mb-4 max-w-5xl mx-auto py-0 relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2"
      >
        <h1 className="text-4xl md:text-6xl font-serif text-foreground font-black tracking-tight flex items-center gap-3">
          The <span className="text-primary italic">Lab</span>
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm font-medium tracking-[0.3em] uppercase opacity-70">
          Precision Nutrition & Bio-Essentials
        </p>
      </motion.div>

      {/* Dynamic Background Element - Very subtle glow at the extreme top */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/10 rounded-full blur-[80px] -z-10"
      />
    </div>
  );
}
