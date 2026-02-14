"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="py-24 md:py-36 bg-[#faf7f2] relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-400/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/[0.03] rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full border border-rose-100">
                <Mail className="h-4 w-4 text-rose-500" />
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                  Newsletter
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-[1.1] uppercase">
                Join the <br />
                <span className="text-gradient">fitByte Fam</span>
              </h2>

              <p className="text-stone-500 text-base md:text-lg leading-relaxed max-w-sm font-medium">
                Get first access to new drops, training tips, and exclusive
                offers. No spam, just gains.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-4">
                {[
                  { icon: Zap, text: "Early Access" },
                  { icon: Heart, text: "10% Welcome" },
                  { icon: ShieldCheck, text: "Zero Spam" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-rose-400" />
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-3xl bg-white border border-stone-100 shadow-xl relative"
            >
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ml-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="sanjay@example.com"
                    className="h-14 bg-stone-50 border-stone-100 rounded-2xl px-6 text-stone-900 placeholder:text-stone-300 focus:ring-2 focus:ring-rose-200 transition-all"
                  />
                </div>

                <Button className="w-full h-14 bg-stone-900 hover:bg-stone-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all active:scale-[0.98] group uppercase tracking-widest">
                  Subscribe Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-center text-[10px] text-stone-300 mt-4 leading-relaxed">
                  By subscribing, you agree to our Privacy Policy. You can
                  unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
