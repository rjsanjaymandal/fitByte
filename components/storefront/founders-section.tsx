"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FoundersSection() {
  return (
    <section className="py-20 md:py-32 bg-slate-50 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-4/5 bg-slate-200 rounded-3xl overflow-hidden shadow-lg">
              {/* Placeholder for founders image */}
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Our Story
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
              About Us
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Built from a Real Need
            </h2>

            <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
              <p>
                We started fitByte because we were tired of protein bars that
                tasted like cardboard and supplements with ingredient lists
                longer than a grocery receipt.
              </p>
              <p>
                Every product is lab-tested, taste-refined, and made with
                ingredients you can actually pronounce. No compromises — just
                clean, effective nutrition that fits into your real life.
              </p>
            </div>

            <Link href="/about">
              <Button className="mt-4 h-12 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm shadow-md transition-all">
                Read Our Story
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
