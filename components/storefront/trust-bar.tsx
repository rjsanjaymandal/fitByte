"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Leaf,
  FlaskConical,
  Award,
  Truck,
  RefreshCcw,
} from "lucide-react";

const badges = [
  { icon: Shield, label: "100% Safe" },
  { icon: Leaf, label: "Natural" },
  { icon: FlaskConical, label: "Lab Tested" },
  { icon: Award, label: "FSSAI" },
  { icon: Truck, label: "Free Shipping" },
  { icon: RefreshCcw, label: "Easy Returns" },
];

export function TrustBar() {
  return (
    <section className="py-14 md:py-18 bg-white overflow-hidden relative border-y border-stone-100">
      <div className="container mx-auto px-4 md:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-8"
        >
          Why 50,000+ Athletes Trust Us
        </motion.p>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-6 gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-3 group cursor-default p-5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-rose-200 transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-rose-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <badge.icon className="h-5 w-5 text-rose-500 stroke-[1.5]" />
              </div>
              <span className="text-[11px] font-semibold text-stone-600 text-center leading-tight whitespace-nowrap">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Mobile Marquee */}
        <div className="md:hidden overflow-hidden">
          <div
            className="flex animate-marquee"
            style={{ "--duration": "20s" } as React.CSSProperties}
          >
            {[...badges, ...badges].map((badge, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 mx-4 p-4 rounded-xl bg-stone-50 border border-stone-100"
              >
                <div className="w-11 h-11 flex items-center justify-center bg-rose-50 rounded-xl">
                  <badge.icon className="h-5 w-5 text-rose-500 stroke-[1.5]" />
                </div>
                <span className="text-[11px] font-semibold text-stone-600 text-center whitespace-nowrap">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
