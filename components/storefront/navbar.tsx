"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { HamburgerMenu } from "./hamburger-menu";
import { CategoryDropdown } from "./category-dropdown";
import { useCartStore } from "@/store/use-cart-store";
import { useSearchStore } from "@/store/use-search-store";
import { useAuth } from "@/context/auth-context";

interface NavbarProps {
  categories?: { id: string; name: string; slug: string }[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { isAdmin } = useAuth();

  const cartItems = useCartStore((s) => s.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);
  const toggleSearch = useSearchStore((s) => s.toggle);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "w-full z-50 transition-all duration-500 ease-out",
        scrolled
          ? "bg-[#faf7f2]/90 backdrop-blur-xl border-b border-stone-200/50 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-full">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <HamburgerMenu categories={categories} />

            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl md:text-2xl font-black tracking-tighter text-stone-900 uppercase">
                fit<span className="text-rose-500">Byte</span>
              </span>
            </Link>
          </div>

          {/* CENTER: Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className={cn(
                  "h-full flex items-center relative group",
                  link.label === "Shop" && "cursor-default",
                )}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-[13px] font-semibold uppercase tracking-wider transition-colors hover:text-rose-500 py-4",
                    pathname === link.href
                      ? "text-stone-900"
                      : "text-stone-500",
                  )}
                >
                  {link.label}
                </Link>

                {/* Mega Menu for Shop */}
                {link.label === "Shop" && (
                  <CategoryDropdown categories={categories} />
                )}

                {/* Underline for active/hover */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 transition-all duration-300 scale-x-0 group-hover:scale-x-100",
                    pathname === link.href && "scale-x-100",
                  )}
                />
              </div>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="rounded-full h-10 w-10 text-stone-600 hover:text-rose-500 hover:bg-stone-100/50"
            >
              <Search className="h-[18px] w-[18px] stroke-[1.5px]" />
            </Button>

            {/* Account */}
            <Link href="/account" className="hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-stone-600 hover:text-rose-500 hover:bg-stone-100/50"
              >
                <User className="h-[18px] w-[18px] stroke-[1.5px]" />
              </Button>
            </Link>

            {/* Admin */}
            {isAdmin && (
              <Link href="/admin" className="hidden md:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full h-9 px-3 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 mr-1" />
                  Admin
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full h-10 w-10 text-stone-600 hover:text-rose-500 hover:bg-stone-100/50"
            >
              <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5px]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold ring-2 ring-[#faf7f2]">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
