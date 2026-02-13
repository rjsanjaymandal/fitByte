"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* TOP SECTION: BRAND & NEWSLETTER */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          <div className="space-y-5 max-w-md">
            <Link href="/" className="inline-block group">
              <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-none">
                fitByte<span className="text-green-500">.</span>
              </h3>
              <p className="text-xs font-medium text-green-400 mt-1">
                Premium Nutrition Labs
              </p>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join the movement. Premium nutrition for the modern human.
              Lab-tested, taste-refined, and backed by science.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/fitbyte/",
                },
                { Icon: Twitter, href: "#" },
                {
                  Icon: Facebook,
                  href: "#",
                },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 text-slate-400 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <Icon className="h-4 w-4 stroke-2" />
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-green-400" />
              <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                Newsletter
              </span>
            </div>
            <h4 className="font-bold text-xl text-white mb-2">
              Stay in the Loop
            </h4>
            <p className="text-sm text-slate-400 mb-5">
              Get 10% off your first order + exclusive drops.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/10 h-11 focus-visible:ring-green-500/30 rounded-full px-5 text-sm text-white placeholder:text-slate-500 flex-1"
              />
              <Button className="h-11 px-6 rounded-full bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 border-t border-white/10 pt-12 mb-12">
          <FooterSection title="Shop">
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-green-400 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/protein"
                  className="hover:text-green-400 transition-colors"
                >
                  Supplements
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/snacks"
                  className="hover:text-green-400 transition-colors"
                >
                  Health Snacks
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/accessories"
                  className="hover:text-green-400 transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Company">
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-green-400 transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-green-400 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="hover:text-green-400 transition-colors"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Support">
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-green-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-green-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-green-400 transition-colors"
                >
                  Shipping
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Legal">
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-green-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-green-400 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2026 fitByte Labs. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>India</span>
            <span className="text-slate-700">·</span>
            <span>EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 md:border-none pb-4 md:pb-0">
      {/* Mobile Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:hidden py-2"
      >
        <h4 className="font-semibold text-base text-white">{title}</h4>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Desktop Header */}
      <h4 className="font-semibold text-sm text-white mb-5 hidden md:block">
        {title}
      </h4>

      {/* Mobile Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="pt-2 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Content */}
      <div className="hidden md:block">{children}</div>
    </div>
  );
}
