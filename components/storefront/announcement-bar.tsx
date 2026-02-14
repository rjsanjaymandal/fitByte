"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-stone-900 text-stone-50 text-[11px] font-bold tracking-wider overflow-hidden relative">
      <div className="flex items-center justify-center gap-3 h-9">
        <motion.div
          className="flex items-center gap-6 whitespace-nowrap"
          animate={{ x: [0, -200, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            FREE SHIPPING ON ₹999+
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
            USE CODE FITBYTE10 FOR 10% OFF
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            LAB TESTED · FSSAI CERTIFIED
          </span>
        </motion.div>
      </div>
    </div>
  );
}
