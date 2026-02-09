"use client";

import { motion } from "framer-motion";

export function ShopHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-0 mb-4 max-w-5xl mx-auto py-0 relative w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-1"
      >
        <h1 className="text-5xl md:text-8xl font-serif text-black font-black tracking-tighter flex items-center gap-3 uppercase">
          THE <span className="text-primary italic">LAB</span>
        </h1>
        <p className="text-zinc-400 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase">
          Engineered for Human Performance
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
