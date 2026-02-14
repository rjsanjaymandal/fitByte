"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  shop: [
    { label: "New Drops", href: "/shop" },
    { label: "Protein Bars", href: "/shop/bars" },
    { label: "Supplements", href: "/shop/supplements" },
    { label: "Accessories", href: "/shop/accessories" },
  ],
  support: [
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Track Order", href: "/track" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  company: [
    { label: "About Our Story", href: "/about" },
    { label: "Lab Reports", href: "/lab-reports" },
    { label: "Contact Us", href: "/contact" },
    { label: "Affiliates", href: "/affiliates" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-50 overflow-hidden pt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
              <span className="text-3xl font-black tracking-tighter uppercase">
                fit<span className="text-rose-400">Byte</span>
              </span>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              We&apos;re on a mission to bring high-quality, transparent, and
              delicious nutrition to every athlete in India. No BS, just real
              macros.
            </p>

            <div className="flex items-center gap-5">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-stone-300 hover:text-rose-400 transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                  <Icon className="h-5 w-5 stroke-[1.5]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-6">
                Shop
              </h4>
              <ul className="space-y-4">
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-400 hover:text-rose-400 text-[13px] flex items-center group transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-6">
                Support
              </h4>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-stone-400 hover:text-rose-400 text-[13px] flex items-center group transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Col */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
              Join the Fam
            </h4>
            <p className="text-sm text-stone-400">
              Get 10% off your first order when you join our inner circle.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Email Address"
                className="bg-white/10 border-white/10 text-white placeholder:text-stone-500 rounded-xl h-12 focus:ring-rose-500/20"
              />
              <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-rose-900/20">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            © 2026 fitByte Labs India. All rights reserved.
          </p>
          <div className="flex gap-8">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              L40000MH2024PLC123456
            </p>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
              FSSAI: 12345678901234
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
