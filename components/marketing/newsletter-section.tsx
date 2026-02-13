"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Welcome to the fitByte fam! 🎉");
    setEmail("");
  }

  return (
    <section className="py-16 md:py-24 bg-green-600 overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-7 w-7 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Join the fitByte Fam
          </h2>
          <p className="text-sm text-white/80 font-medium mb-8 max-w-md mx-auto">
            Get exclusive deals, new launches, nutrition tips & 10% off your
            first order — straight to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white/95 border-0 rounded-full px-5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-white/50 flex-1"
            />
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-[11px] text-white/50 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
