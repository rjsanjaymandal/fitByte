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
import { useScrollDirection } from "@/hooks/use-scroll-direction";
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

  // ... (keep defined vars)

  // Fetch Categories logic ... (omitted for brevity in replacement if unchanged, but I need to include it or rely on existing)
  // Re-including fetch to be safe as I am replacing the whole function body essentially or need to be careful with chunks.
  // Actually, I'll just target the `return` block mostly, but need to insert the state hook.

  // Fetch Categories (Re-declaring to ensure context is safe)
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
      <header className="relative w-full bg-background pt-[env(safe-area-inset-top)] z-50">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Main Content - Fades out when search is open  */}
          <div
            className={cn(
              "w-full flex items-center justify-between transition-opacity duration-200",
              isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            {/* Mobile Menu & Logo */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 group"
                title="Home"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-xl border-2 border-primary/20 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <FlashImage
                    src="/flash-logo.jpg"
                    alt="Flash Logo"
                    width={60}
                    height={60}
                    unoptimized
                    className="bg-background"
                  />
                </div>
                <span className="hidden lg:flex text-2xl font-serif tracking-tight text-foreground font-extrabold items-center">
                  fit<span className="text-primary italic">Byte</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <div className="group relative">
                <Link
                  href="/shop"
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-tight text-muted-foreground hover:text-primary transition-all px-4 py-2 rounded-full hover:bg-primary/5"
                >
                  Shop
                  <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
                <CategoryDropdown categories={categories} />
              </div>
              <Link
                href="/lab"
                className={cn(
                  "text-xs font-semibold tracking-tight transition-all px-4 py-2 rounded-full",
                  pathname === "/lab"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                )}
              >
                Lab
              </Link>
              <Link
                href="/blog"
                className={cn(
                  "text-xs font-semibold tracking-tight transition-all px-4 py-2 rounded-full",
                  pathname?.startsWith("/blog")
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                )}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "text-xs font-semibold tracking-tight transition-all px-4 py-2 rounded-full",
                  pathname === "/contact"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                )}
              >
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Trigger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors h-11 w-11"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-secondary/10 text-muted-foreground hover:text-secondary transition-colors h-11 w-11"
                >
                  <Heart className="h-5 w-5" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

              {mounted && user ? (
                <NotificationBell />
              ) : (
                <Skeleton className="h-11 w-11 rounded-full bg-muted/50 hidden sm:block" />
              )}

              <div className="hidden sm:block">
                <ModeToggle />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors h-11 w-11"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Button>

              <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

              {mounted && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link href="/account" className="hidden sm:block">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full gap-2 px-3 font-semibold border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all"
                        >
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                            {user.email?.[0]?.toUpperCase()}
                          </div>
                          <span className="max-w-[100px] truncate text-xs">
                            {profile?.name || user.email?.split("@")[0]}
                          </span>
                        </Button>
                      </Link>

                      {isAdmin && (
                        <Link href="/admin" className="hidden md:block">
                          <Button
                            size="sm"
                            className="rounded-full bg-primary text-white shadow-lg hover:shadow-primary/20 transition-all text-[10px] font-bold uppercase tracking-wider h-8"
                          >
                            Admin
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Link href="/login" className="hidden sm:block">
                      <Button
                        size="sm"
                        className="rounded-full px-6 font-bold uppercase tracking-wider text-[10px] bg-primary text-white shadow-lg hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
                      >
                        Join fitByte
                      </Button>
                    </Link>
                  )}
                </>
              )}

              {/* Hamburger Menu - Moved to Right */}
              <div className="ml-1">
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
