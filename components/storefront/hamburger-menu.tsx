"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  ChevronRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  User,
  LogOut,
  LayoutGrid,
  Zap,
  Phone,
  BookOpen,
  ArrowRight,
  Tag,
} from "lucide-react";
import Link from "next/link";
import FlashImage from "@/components/ui/flash-image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface NavCategory {
  id: string;
  name: string;
  slug: string;
  children?: NavCategory[];
}

interface HamburgerMenuProps {
  categories: NavCategory[];
}

export function HamburgerMenu({ categories }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();

  const menuVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    }),
  };

  const mainLinks = [
    { href: "/shop", label: "Collections", icon: LayoutGrid },
    { href: "/blog", label: "Journal", icon: BookOpen },
    { href: "/contact", label: "Support", icon: Phone },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden -ml-2 text-foreground active:scale-90 transition-transform rounded-full h-10 w-10 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          suppressHydrationWarning
        >
          <Menu className="h-6 w-6 stroke-[1.5px]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:w-[450px] p-0 border-r border-border/10 bg-[#fdfcf0]/80 backdrop-blur-[40px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Premium navigation experience for FitBytes.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-10 pt-16 pb-10 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 group"
            >
              <span className="text-3xl font-black tracking-tighter text-[#1a2b47] uppercase font-sans">
                FITBYTES<span className="text-[#e31e24] ml-0.5">.</span>
              </span>
            </Link>
            <ModeToggle />
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-10 py-6 scrollbar-hide">
            <div className="space-y-2">
              {/* Categories */}
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  custom={i}
                  initial="hidden"
                  animate={open ? "visible" : "hidden"}
                  variants={menuVariants}
                >
                  <Link
                    href={`/shop?category=${cat.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 group hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-xl font-black text-[#1a2b47] uppercase tracking-widest group-hover:text-[#e31e24] transition-colors">
                      {cat.name}
                    </span>
                    <ChevronRight className="h-5 w-5 text-[#1a2b47]/20 group-hover:text-[#e31e24] transition-all transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}

              <div className="my-8 border-t border-[#1a2b47]/5" />

              {/* Main Links */}
              {mainLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i + categories.length}
                  initial="hidden"
                  animate={open ? "visible" : "hidden"}
                  variants={menuVariants}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 group hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-xl font-black text-[#1a2b47]/60 uppercase tracking-widest group-hover:text-[#1a2b47] transition-colors">
                      {link.label}
                    </span>
                    <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User & Footer (Fixed Bottom) */}
          <div className="p-10 space-y-10 border-t border-[#1a2b47]/5 pb-safe bg-white/40 backdrop-blur-md">
            {/* Account Info */}
            <div>
              {user ? (
                <div className="space-y-6">
                  <Link href="/account" onClick={() => setOpen(false)}>
                    <div className="flex items-center gap-5 p-5 rounded-none bg-white border border-[#1a2b47]/10 hover:border-[#1a2b47] transition-all shadow-sm group">
                      <div className="h-12 w-12 rounded-none bg-[#1a2b47] flex items-center justify-center text-sm font-black text-white group-hover:scale-105 transition-transform">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-black text-[#1a2b47] uppercase tracking-tight truncate">
                          {profile?.name || "Member"}
                        </p>
                        <p className="text-[10px] text-[#1a2b47]/40 font-black uppercase tracking-[0.2em]">
                          Profile Secure
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#1a2b47]/30 group-hover:text-[#1a2b47] transition-colors" />
                    </div>
                  </Link>
                  <div className="grid grid-cols-1 gap-3">
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full rounded-none border-[#1a2b47]/20 font-black uppercase tracking-[0.2em] text-[10px] h-14 hover:bg-[#1a2b47] hover:text-white transition-all"
                        >
                          Admin Access
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="w-full rounded-none text-[#e31e24] hover:bg-red-50 font-black uppercase tracking-[0.2em] text-[10px] h-14 transition-all"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-none bg-[#1a2b47] hover:bg-black text-white border-0 font-black uppercase tracking-[0.2em] text-[11px] h-14 transition-all">
                      Member Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-none bg-[#e31e24] text-white border-0 font-black uppercase tracking-[0.2em] text-[11px] h-14 shadow-xl shadow-red-500/10 hover:bg-black transition-all">
                      Join FitBytes
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center gap-10">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-[#1a2b47]/40 hover:text-[#1a2b47] transition-colors p-1"
                >
                  <Icon className="h-5 w-5 stroke-[2px]" />
                </a>
              ))}
            </div>

            <p className="text-center text-[9px] text-[#1a2b47]/30 font-black uppercase tracking-[0.5em]">
              All Systems Operational © 2026
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
