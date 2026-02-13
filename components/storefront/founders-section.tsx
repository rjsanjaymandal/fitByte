"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FoundersSection() {
  return (
    <section className="py-20 md:py-32 bg-[#1a2b47] text-white overflow-hidden relative">
      {/* Subtle diagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 20px)",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-white/10 border-2 border-white/20 shadow-[12px_12px_0px_0px_rgba(227,30,36,1)] overflow-hidden">
              {/* Placeholder for founders image */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 border-4 border-[#e31e24] mb-6 flex items-center justify-center">
                  <span className="text-3xl font-black">fB</span>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50">
                  Our Team Photo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-8"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#e31e24] mb-4">
                The Story
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                OUR
                <br />
                STORY
              </h2>
            </div>

            <div className="space-y-5 text-white/70 text-sm leading-relaxed font-medium">
              <p>
                At fitByte, we believe you shouldn&apos;t have to choose between
                tasty and healthy. Our nutritionist-approved supplements and
                snacks prove you can have the best of both worlds.
              </p>
              <p>
                After spending months in the lab with scientists, chefs, and
                fitness experts, we created fitByte for people who want premium
                nutrition without compromising on flavor. For people with busy
                lives who want to prioritize their health and performance.
              </p>
              <p>
                Every product is bio-engineered, taste-refined, and lab-tested
                for peak performance — because you deserve nothing less.
              </p>
            </div>

            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-[#1a2b47] bg-white px-10 py-5 shadow-[6px_6px_0px_0px_rgba(227,30,36,1)] hover:shadow-[8px_8px_0px_0px] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              Know Our Story
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
