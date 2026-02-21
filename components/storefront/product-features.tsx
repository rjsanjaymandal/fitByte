"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import FlashImage from "@/components/ui/flash-image";

const features = [
  "High Protein",
  "Rich in Fiber",
  "Real Nuts / Fruits / Seeds",
  "No Added Preservatives",
  "Long Lasting Energy",
];

export function ProductFeatures() {
  return (
    <section className="relative py-12 md:py-24 overflow-hidden bg-[#faf7f2]">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-[280px] sm:max-w-md lg:max-w-lg aspect-square"
          >
            <div className="relative w-full h-full drop-shadow-[0_20px_40px_rgba(251,113,133,0.25)]">
              <FlashImage
                src="https://bgrombwbemkqtlqicngq.supabase.co/storage/v1/object/public/products/prod_1771071907006_0.781329250334975.jpeg"
                alt="Berry Burst Bomb Bar"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="w-full lg:max-w-2xl space-y-8 lg:space-y-12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#451a03] leading-[1.1] tracking-tight uppercase italic">
                Healthy Energy <br />
                <span className="text-rose-500">For Active Life</span>
              </h2>
            </motion.div>

            <div className="space-y-4 lg:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + index * 0.1,
                    ease: "easeOut",
                  }}
                  className="flex items-center gap-4 lg:gap-6 group justify-center lg:justify-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-4 border-[#451a03]/10 flex items-center justify-center bg-white shadow-lg shadow-rose-100 group-hover:border-rose-500 group-hover:bg-rose-50 transition-all duration-300">
                    <Check
                      className="w-6 h-6 text-[#451a03] group-hover:text-rose-600 transition-colors"
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-lg md:text-xl lg:text-2xl font-black text-[#451a03]/80 group-hover:text-[#451a03] transition-colors uppercase tracking-tight">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
