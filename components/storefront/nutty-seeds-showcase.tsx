"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import FlashImage from "@/components/ui/flash-image";

const benefits = [
  "High Protein",
  "Rich in Fiber",
  "Made with Real Nuts & Seeds",
  "No Added Preservatives",
  "Sustained Energy",
];

export function NuttySeedsShowcase() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#faf7f2]">
      {/* Decorative Background Elements (Simple and Clean) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-black text-[#451a03] tracking-tight italic uppercase leading-tight">
            Nutty Seeds Bomb Bar – <br className="hidden md:block" />
            <span className="text-stone-800">Power in Every Bite</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-12 lg:gap-20">
          {/* Left Side: Product Shot + Ingredients Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex items-center justify-center min-h-[300px] md:min-h-[450px]"
          >
            {/* 
              MAIN PRODUCT IMAGE 
              Using the provided URL for Berry Burst for now, 
              or a placeholder if we want to be safe.
            */}
            <div className="relative w-full max-w-[500px] aspect-square drop-shadow-[0_20px_40px_rgba(69,26,3,0.15)] z-20">
              <FlashImage
                src="https://bgrombwbemkqtlqicngq.supabase.co/storage/v1/object/public/products/prod_1771071907006_0.781329250334975.jpeg" // Temporary placeholder (Berry Burst)
                alt="Nutty Seeds Bomb Bar"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Background "Ingredient" Decorations (Abstract Representation) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 blur-sm">
              <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-100 rounded-full mix-blend-multiply" />
              <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-stone-200 rounded-full mix-blend-multiply" />
              <div className="absolute top-1/3 left-10 w-16 h-16 bg-rose-50 rounded-full mix-blend-multiply" />
            </div>
          </motion.div>

          {/* Right Side: Benefits / Checklist */}
          <div className="space-y-8 md:space-y-10">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md border border-stone-100 flex items-center justify-center text-rose-500 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                    <CheckCircle2
                      className="w-5 h-5 md:w-6 md:h-6"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="text-xl md:text-2xl font-black text-[#451a03] tracking-tight uppercase group-hover:translate-x-2 transition-transform duration-300">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Call to Action or Secondary Messaging */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-8 border-t border-stone-200"
            >
              <div className="space-y-2">
                <p className="text-xl md:text-2xl font-black text-rose-500 tracking-tighter uppercase italic">
                  Perfect Pre & Post Workout Snack
                </p>
                <p className="text-2xl md:text-3xl font-black text-[#451a03] tracking-tighter uppercase">
                  Healthy On-the-Go Energy
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
