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
    <footer className="border-t-4 border-[#1a2b47] bg-[#fdfcf0] pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #1a2b47 0, #1a2b47 1px, transparent 0, transparent 20px)",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* TOP SECTION: BRAND & NEWSLETTER */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          <div className="space-y-6 max-w-md">
            <Link href="/" className="inline-block group">
              <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#1a2b47] uppercase leading-none">
                FITBYTE<span className="text-[#e31e24]">.</span>
              </h3>
              <p className="text-[10px] font-black text-[#e31e24] uppercase tracking-[0.4em] mt-1">
                Advanced Performance Labs
              </p>
            </Link>
            <p className="text-[#1a2b47] text-xs leading-relaxed font-bold uppercase tracking-widest">
              Join the movement. Premium nutrition for the modern human.
              Bio-engineered, taste-refined, and lab-tested for peak
              performance.
            </p>
            <div className="flex gap-3 pt-4">
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
                  className="h-12 w-12 rounded-none border-2 border-[#1a2b47] flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(26,43,71,1)] hover:bg-[#1a2b47] hover:text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(227,30,36,1)] transition-all duration-300 cursor-pointer group"
                >
                  <Icon className="h-5 w-5 stroke-2 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-lg bg-white p-12 rounded-none border-4 border-[#1a2b47] relative overflow-hidden group shadow-[16px_16px_0px_0px_rgba(26,43,71,1)]">
            <div className="absolute top-0 right-0 p-2 bg-[#e31e24] text-white font-black text-[9px] uppercase tracking-widest">
              PRIORITY ACCESS
            </div>
            <h4 className="font-black text-3xl mb-4 flex items-center gap-2 text-[#1a2b47] uppercase tracking-tighter leading-none">
              DROP ALERT<span className="animate-pulse text-[#e31e24]">_</span>
            </h4>
            <p className="text-[11px] text-[#1a2b47]/60 mb-8 font-black uppercase tracking-widest">
              Be the first to fuel up.{" "}
              <span className="text-[#e31e24] font-black">10% OFF</span> your
              first lab order.
            </p>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                placeholder="ENTER EMAIL ADDRESS"
                className="bg-[#fdfcf0] border-2 border-[#1a2b47] h-16 focus-visible:ring-0 rounded-none px-6 font-black text-xs placeholder:text-zinc-300 transition-all focus:shadow-[4px_4px_0px_0px_rgba(26,43,71,1)]"
              />
              <Button className="h-16 w-full rounded-none bg-[#1a2b47] hover:bg-[#e31e24] text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:translate-y-[2px] active:shadow-none">
                JOIN THE LAB
              </Button>
            </form>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS (Grid on Desktop, Accordion on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 border-t-2 border-[#1a2b47]/10 pt-16 mb-16">
          <FooterSection title="Shop">
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-[#1a2b47]/60">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/protein"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Supplements
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/snacks"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Health Snacks
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/accessories"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Accessories
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Labs">
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-[#1a2b47]/60">
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  The Science
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Environment
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Support">
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-[#1a2b47]/60">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Shipping
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Legal">
            <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-[#1a2b47]/60">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#e31e24] transition-colors flex items-center gap-2 group"
                >
                  <div className="h-1 w-1 bg-[#1a2b47] group-hover:bg-[#e31e24]" />
                  Terms
                </Link>
              </li>
            </ul>
          </FooterSection>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t-2 border-[#1a2b47] pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-[#1a2b47] font-black uppercase tracking-[0.45em]">
          <p>&copy; 2026 FITBYTE LABS. ALL SYSTEMS OPERATIONAL.</p>
          <div className="flex items-center gap-8 bg-[#1a2b47] text-white px-6 py-2">
            <span>India</span>
            <div className="w-1 h-1 bg-[#e31e24]" />
            <span>EN-US</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Component for Mobile Accordion / Desktop Column
function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50 md:border-none pb-4 md:pb-0">
      {/* Mobile Header (Clickable) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:hidden py-2"
      >
        <h4 className="font-bold text-lg">{title}</h4>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Desktop Header (Static) */}
      <h4 className="font-black text-[13px] uppercase tracking-[0.3em] text-[#1a2b47] mb-8 hidden md:block">
        {title}
      </h4>

      {/* Mobile Content (Collapsible) */}
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

      {/* Desktop Content (Always Visible) */}
      <div className="hidden md:block">{children}</div>
    </div>
  );
}
