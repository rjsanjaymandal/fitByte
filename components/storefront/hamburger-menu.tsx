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
          className="lg:hidden -ml-2 text-slate-800 active:scale-90 transition-transform rounded-full h-10 w-10 hover:bg-slate-100"
          suppressHydrationWarning
        >
          <Menu className="h-6 w-6 stroke-[1.5px]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:w-[420px] p-0 border-r border-slate-100 bg-white"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Browse fitByte products and more.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 pt-14 pb-8 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 group"
            >
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                fitByte<span className="text-green-600 ml-0.5">.</span>
              </span>
            </Link>
            <ModeToggle />
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-hide">
            <div className="space-y-1">
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
                    className="flex items-center justify-between py-3.5 group hover:pl-1 transition-all duration-300"
                  >
                    <span className="text-base font-semibold text-slate-800 group-hover:text-green-600 transition-colors">
                      {cat.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-green-600 transition-all transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}

              <div className="my-6 border-t border-slate-100" />

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
                    className="flex items-center justify-between py-3.5 group hover:pl-1 transition-all duration-300"
                  >
                    <span className="text-base font-medium text-slate-500 group-hover:text-slate-800 transition-colors">
                      {link.label}
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 text-slate-400 transition-all transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User & Footer (Fixed Bottom) */}
          <div className="p-8 space-y-6 border-t border-slate-100 pb-safe bg-slate-50/80">
            {/* Account Info */}
            <div>
              {user ? (
                <div className="space-y-4">
                  <Link href="/account" onClick={() => setOpen(false)}>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:shadow-sm transition-all group">
                      <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold text-white">
                        {user.email?.[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {profile?.name || "Member"}
                        </p>
                        <p className="text-xs text-slate-400">View Profile</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-green-600 transition-colors" />
                    </div>
                  </Link>
                  <div className="grid grid-cols-1 gap-2">
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full rounded-lg border-slate-200 font-semibold text-xs h-11 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
                        >
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setOpen(false);
                      }}
                      className="w-full rounded-lg text-red-500 hover:bg-red-50 font-semibold text-xs h-11 transition-all"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm h-12 transition-all">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-slate-200 text-slate-700 font-semibold text-sm h-12 hover:bg-slate-50 transition-all"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center gap-6">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-slate-400 hover:text-green-600 transition-colors p-1"
                >
                  <Icon className="h-5 w-5 stroke-[1.5px]" />
                </a>
              ))}
            </div>

            <p className="text-center text-[10px] text-slate-400">
              © 2026 fitByte Labs
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
