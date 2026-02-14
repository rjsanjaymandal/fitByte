"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FoundersSection() {
  return (
    <section className="py-24 md:py-36 bg-[#faf7f2] overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-rose-400/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/[0.03] rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-4/5 bg-white rounded-3xl overflow-hidden border border-stone-100 relative shadow-md">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100"
                  >
                    <span className="text-4xl text-rose-500">🌸</span>
                  </motion.div>
                  <p className="text-stone-400 text-sm font-medium">
                    Founders Image Coming Soon
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md rounded-xl px-5 py-3 border border-stone-100 shadow-lg"
              >
                <p className="text-stone-900 text-sm font-black uppercase tracking-wider">
                  Est. 2024
                </p>
                <p className="text-rose-500 text-[10px] mt-0.5 font-bold">
                  Made in India 🇮🇳
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500">
              Our Story
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight uppercase">
              Built from a <span className="text-gradient">Real Need</span>
            </h2>

            <p className="text-stone-500 leading-relaxed text-base">
              We started fitByte because we were tired of choosing between taste
              and nutrition. Every product is lab-tested, transparently sourced,
              and designed for real athletes — not just marketing.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-stone-100">
              {[
                { value: "50K+", label: "Customers" },
                { value: "99%", label: "Purity" },
                { value: "4.9★", label: "Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl md:text-3xl font-black text-rose-500">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-stone-400 font-medium mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <Link href="/about">
              <Button className="h-14 px-10 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-lg transition-all active:scale-95 group uppercase tracking-wider">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
