"use client";

import { motion } from "framer-motion";

const retailers = [
  { name: "Amazon", logo: "A" },
  { name: "Flipkart", logo: "F" },
  { name: "Reliance", logo: "R" },
  { name: "Apollo", logo: "A" },
  { name: "HealthKart", logo: "H" },
  { name: "Swiggy", logo: "S" },
];

export function AvailableAt() {
  return (
    <section className="py-20 md:py-28 bg-[#faf7f2] overflow-hidden relative">
      {/* Top divider */}
      <div className="absolute top-0 inset-x-0 h-px section-divider" />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-3">
            Shop Everywhere
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight uppercase">
            Available Online & In-Store
          </h2>
        </motion.div>

        {/* Retailer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {retailers.map((retailer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-default"
            >
              <div className="h-24 flex flex-col items-center justify-center p-4 bg-white border border-stone-100 rounded-2xl group-hover:border-rose-200 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="text-2xl font-black text-rose-500 mb-1">
                  {retailer.logo}
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {retailer.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Bar */}
        <div className="mt-20 py-8 border-y border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/50 rounded-2xl px-8">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
            100% Secure Payments
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60">
            {["VISA", "MASTERCARD", "UPI", "AMEX", "GPAY"].map((method, i) => (
              <span
                key={i}
                className="text-xs font-black text-stone-900 tracking-[0.2em] hover:text-rose-500 transition-colors"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
