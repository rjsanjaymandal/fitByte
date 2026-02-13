"use client";

import { motion } from "framer-motion";
import { CreditCard, Smartphone, Landmark, QrCode, Wallet } from "lucide-react";

const RETAILERS = [
  { name: "Amazon", initial: "A" },
  { name: "Flipkart", initial: "F" },
  { name: "BigBasket", initial: "B" },
  { name: "Swiggy Instamart", initial: "S" },
  { name: "Zepto", initial: "Z" },
  { name: "Blinkit", initial: "B" },
];

const PAYMENT_METHODS = [
  { name: "UPI", icon: QrCode },
  { name: "Cards", icon: CreditCard },
  { name: "Net Banking", icon: Landmark },
  { name: "Wallets", icon: Wallet },
  { name: "Google Pay", icon: Smartphone },
];

export function AvailableAt() {
  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">
            Shop Everywhere
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Also Available At
          </h2>
        </motion.div>

        {/* Retailer Logos Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-14">
          {RETAILERS.map((retailer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="w-28 h-28 md:w-32 md:h-32 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md hover:border-green-200 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-slate-700">
                  {retailer.initial}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500">
                {retailer.name}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Payment Methods Strip */}
        <div className="max-w-2xl mx-auto bg-slate-50 rounded-2xl p-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Secure Payment Options
          </p>
          <div className="flex justify-center flex-wrap gap-6">
            {PAYMENT_METHODS.map((method, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 text-slate-500"
              >
                <method.icon className="h-5 w-5 text-slate-400 stroke-[1.5]" />
                <span className="text-[10px] font-medium">{method.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
