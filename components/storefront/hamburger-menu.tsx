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
  X,
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
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.06,
        duration: 0.6,
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
          className="lg:hidden -ml-2 text-stone-600 hover:text-rose-500 active:scale-90 transition-all rounded-full h-10 w-10 hover:bg-stone-100"
          suppressHydrationWarning
        >
          <Menu className="h-6 w-6 stroke-[1.5px]" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:w-[420px] p-0 border-r border-stone-100 bg-[#faf7f2] grain"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Browse fitByte products and more.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="px-8 pt-14 pb-8 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <span className="text-2xl font-black tracking-tighter text-stone-900 uppercase">
                fit<span className="text-rose-500">Byte</span>
              </span>
            </Link>
            <ModeToggle />
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-8 py-4 scrollbar-hide">
            <div className="space-y-1">
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
                    className="flex items-center justify-between py-5 group hover:pl-2 transition-all duration-300 border-b border-stone-900/5"
                  >
                    <span className="text-3xl font-black text-stone-800 group-hover:text-rose-500 transition-colors uppercase tracking-tighter">
                      {cat.name}
                    </span>
                    <ChevronRight className="h-6 w-6 text-stone-200 group-hover:text-rose-500 transition-all transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}

              <div className="my-8" />

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
                    <div className="flex items-center gap-3">
                      <link.icon className="h-4 w-4 text-stone-300 group-hover:text-rose-400 transition-colors" />
                      <span className="text-[13px] font-black text-stone-400 group-hover:text-stone-900 transition-colors uppercase tracking-[0.2em]">
                        {link.label}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 text-rose-400 transition-all transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User & Footer */}
          <div className="p-8 space-y-8 border-t border-stone-200/50 pb-safe bg-white/40 backdrop-blur-md">
            <div>
              {user ? (
                <div className="space-y-4">
                  <Link href="/account" onClick={() => setOpen(false)}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 group hover:border-rose-200 transition-all shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-rose-500 flex items-center justify-center text-base font-black text-white shadow-lg shadow-rose-200 relative">
                        {user.email?.[0].toUpperCase()}
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center">
                          <Zap className="h-2.5 w-2.5 text-white fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-black text-stone-800 truncate uppercase tracking-tight">
                          {profile?.name || "Member"}
                        </p>
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                          Premium Member
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-rose-400 transition-colors" />
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-3">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="col-span-2"
                      >
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-rose-200 font-black text-[10px] h-12 text-rose-600 hover:bg-rose-50 tracking-[0.2em] uppercase transition-all"
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
                      className="w-full rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 font-black text-[10px] h-12 tracking-[0.2em] uppercase transition-all"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="col-span-2"
                  >
                    <Button className="w-full rounded-full bg-stone-900 hover:bg-stone-800 text-white font-black text-[11px] h-14 tracking-[0.2em] uppercase transition-all shadow-xl shadow-stone-200">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="col-span-2"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-stone-200 text-stone-700 font-black text-[11px] h-14 tracking-[0.2em] uppercase hover:bg-stone-50 transition-all"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Socials */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-stone-300 hover:text-rose-500 transition-colors"
                  >
                    <Icon className="h-5 w-5 stroke-[1.5px]" />
                  </a>
                ))}
              </div>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.3em]">
                v0.1.0-beta
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
