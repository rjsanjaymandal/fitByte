"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  Heart,
  ChevronDown,
  Search,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FlashImage from "@/components/ui/flash-image";
import { useWishlistStore } from "@/store/use-wishlist-store";
import { useCartStore, selectCartCount } from "@/store/use-cart-store";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useSearchStore } from "@/store/use-search-store";
import { CategoryDropdown } from "./category-dropdown";
const HamburgerMenu = dynamic(
  () => import("./hamburger-menu").then((mod) => mod.HamburgerMenu),
  { ssr: false },
);
import { SearchOverlay } from "@/components/storefront/search-overlay";
import { NotificationBell } from "./notification-bell";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface NavCategory {
  id: string;
  name: string;
  slug: string;
  children?: NavCategory[];
}

interface NavLink {
  href: string;
  label: string;
  children?: NavCategory[];
  category: NavCategory;
}

export function StorefrontNavbar() {
  const cartCount = useCartStore(selectCartCount);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { user, profile, isAdmin, signOut } = useAuth();

  const [mounted, setMounted] = useState(false);
  // Local Search State for Overlay
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const supabase = createClient();

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["nav-categories-v2"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*, children:categories(id, name, slug)")
        .eq("is_active", true)
        .is("parent_id", null)
        .order("name");
      return data || [];
    },
  });

  // Dynamic Nav Links
  const navLinks: NavLink[] = categories.map((cat: NavCategory) => ({
    href: `/shop?category=${cat.id}`,
    label: cat.name,
    children: cat.children,
    category: cat,
  }));

  return (
    <>
      <header className="relative w-full bg-[#fdfcf0] border-b border-zinc-200/50 pt-[env(safe-area-inset-top)] z-50">
        <div className="relative mx-auto flex h-16 lg:h-20 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Fades out when search is open */}
          <div
            className={cn(
              "w-full grid grid-cols-3 items-center transition-opacity duration-200",
              isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            {/* Left: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
              <Link
                href="/shop"
                className="text-[13px] font-black uppercase tracking-[0.15em] text-[#1a2b47] hover:opacity-70 transition-all"
              >
                Shop fitByte
              </Link>
              <Link
                href="/about"
                className="text-[13px] font-black uppercase tracking-[0.15em] text-[#1a2b47] hover:opacity-70 transition-all"
              >
                Our Story
              </Link>
              <Link
                href="/bulk-gifting"
                className="text-[13px] font-black uppercase tracking-[0.15em] text-[#1a2b47] hover:opacity-70 transition-all"
              >
                Bulk Gifting
              </Link>
            </nav>

            {/* Middle: Centered Logo */}
            <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-[20px] sm:text-[28px] lg:text-[34px] xl:text-[40px] font-black tracking-tighter text-[#1a2b47] uppercase font-sans leading-none">
                  FITBYTES<span className="text-[#e31e24] ml-0.5">.</span>
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-[#1a2b47] hover:opacity-70 transition-all"
              >
                <ShoppingBag className="h-6 w-6" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e31e24] text-[10px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              <Link
                href="/account"
                className="text-[#1a2b47] hover:opacity-70 transition-all"
              >
                <div className="h-6 w-6 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </Link>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-[#1a2b47] hover:opacity-70 transition-all"
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Admin Access Button (Desktop) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:flex items-center gap-2 px-4 py-2 border border-[#1a2b47]/20 rounded-none text-[10px] font-black uppercase tracking-widest text-[#1a2b47] hover:bg-[#1a2b47] hover:text-white transition-all ml-2"
                >
                  Admin
                </Link>
              )}

              <div className="lg:hidden ml-2">
                <HamburgerMenu categories={categories} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
