"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, Banknote } from "lucide-react";

const RETAILERS = [
  { name: "Amazon", initial: "A" },
  { name: "Flipkart", initial: "F" },
  { name: "BigBasket", initial: "B" },
  { name: "Blinkit", initial: "Bl" },
  { name: "Zepto", initial: "Z" },
  { name: "Swiggy Instamart", initial: "SI" },
];

const PAYMENT_METHODS = [
  { name: "UPI", icon: CreditCard },
  { name: "Cards", icon: CreditCard },
  { name: "Net Banking", icon: Banknote },
  { name: "COD", icon: Truck },
];

export function AvailableAt() {
  return (
    <section className="py-16 md:py-20 bg-white border-y border-[#1a2b47]/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2b47] uppercase tracking-tighter">
            ALSO AVAILABLE AT
          </h2>
          <div className="w-16 h-1 bg-[#e31e24] mx-auto mt-4" />
        </motion.div>

        {/* Retailer Logos Grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16">
          {RETAILERS.map((retailer, index) => (
            <motion.div
              key={retailer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="w-28 h-20 md:w-36 md:h-24 border-2 border-[#1a2b47]/10 bg-[#fdfcf0] flex items-center justify-center hover:border-[#1a2b47] hover:shadow-[4px_4px_0px_0px_rgba(26,43,71,1)] transition-all cursor-default group"
            >
              <span className="text-lg md:text-xl font-black text-[#1a2b47]/40 uppercase tracking-tight group-hover:text-[#1a2b47] transition-colors">
                {retailer.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Payment & Security Strip */}
        <div className="border-t border-[#1a2b47]/10 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#1a2b47]/50">
              <ShieldCheck className="h-5 w-5 text-[#e31e24]" />
              Securely Pay Using
            </div>
            <div className="flex items-center gap-6">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#1a2b47]/40"
                >
                  <method.icon className="h-4 w-4" />
                  {method.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
