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
    <footer className="border-t border-zinc-200 bg-[#fdfcf0] pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* TOP SECTION: BRAND & NEWSLETTER */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          <div className="space-y-4 max-w-sm">
            <Link href="/" className="inline-block">
              <h3 className="text-3xl font-black tracking-tighter text-[#1a2b47] uppercase font-sans">
                FITBYTES<span className="text-[#e31e24] ml-0.5">.</span>
              </h3>
            </Link>
            <p className="text-[#1a2b47]/70 text-[11px] leading-relaxed font-black uppercase tracking-[0.2em]">
              Join the movement. Premium nutrition for the modern human.
              Bio-engineered, taste-refined, and lab-tested for peak
              performance.
            </p>
            <div className="flex gap-2 pt-2">
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
                  className="h-10 w-10 rounded-none border border-[#1a2b47]/10 flex items-center justify-center hover:bg-[#1a2b47] hover:text-white hover:border-[#1a2b47] transition-all duration-300 cursor-pointer group"
                >
                  <Icon className="h-4 w-4 stroke-[2px] group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md bg-[#1a2b47] p-10 rounded-none border-none relative overflow-hidden group shadow-2xl shadow-black/20">
            <h4 className="font-black text-2xl mb-2 flex items-center gap-2 text-white uppercase tracking-tighter">
              DROP ALERT
            </h4>
            <p className="text-xs text-white/70 mb-6 font-bold uppercase tracking-widest">
              Be the first to fuel up.{" "}
              <span className="text-white font-black underline">10% OFF</span>{" "}
              your first lab order.
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                placeholder="EMAIL ADDRESS"
                className="bg-white/90 border-none h-14 focus-visible:ring-white rounded-none px-6 font-bold text-xs placeholder:text-zinc-400"
              />
              <Button className="h-14 w-full rounded-none bg-white hover:bg-zinc-100 text-[#1a2b47] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-black/20">
                JOIN THE LAB
              </Button>
            </form>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS (Grid on Desktop, Accordion on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 border-t border-border/50 pt-12 mb-12">
          <FooterSection title="Shop">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-primary transition-colors block py-1"
                >
                  {/* All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?sort=newest"
                  className="hover:text-primary transition-colors block py-1"
                > */}
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/clothing"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Clothing Collectons
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/accessories"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Company">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/flashh-fashion"
                  className="hover:text-primary transition-colors block py-1"
                >
                  About FlashhFashion
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Sustainability
                </Link>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title="Support">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors block py-1"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Shipping & Returns
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/size-guide"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Size Guide
                </Link>
              </li> */}
            </ul>
          </FooterSection>

          <FooterSection title="Legal">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Cookie Policy
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/accessibility"
                  className="hover:text-primary transition-colors block py-1"
                >
                  Accessibility
                </Link>
              </li> */}
            </ul>
          </FooterSection>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-[#1a2b47]/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-[#1a2b47]/30 font-black uppercase tracking-[0.5em]">
          <p>&copy; 2026 FITBYTE LABS. ALL SYSTEMS OPERATIONAL.</p>
          <div className="flex items-center gap-6">
            <span>India</span>
            <span className="hidden md:inline-block w-1 h-1 bg-border rounded-full" />
            <span>English (US)</span>
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
