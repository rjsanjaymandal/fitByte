"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, calculateDiscount } from "@/lib/utils";
import { Heart, Star, ShoppingBag } from "lucide-react";
import {
  useWishlistStore,
  selectIsInWishlist,
} from "@/store/use-wishlist-store";
import { useCartStore } from "@/store/use-cart-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
import FlashImage from "@/components/ui/flash-image";

const QuickView = dynamic(
  () => import("@/components/products/quick-view").then((mod) => mod.QuickView),
  { ssr: false },
);
const QuickAddDialog = dynamic(
  () =>
    import("@/components/products/quick-add-dialog").then(
      (mod) => mod.QuickAddDialog,
    ),
  { ssr: false },
);
const WaitlistDialog = dynamic(
  () =>
    import("@/components/products/waitlist-dialog").then(
      (mod) => mod.WaitlistDialog,
    ),
  { ssr: false },
);

import type { Product } from "@/lib/services/product-service";
import { checkPreorderStatus, togglePreorder } from "@/app/actions/preorder";
import { prefetchProductAction } from "@/app/actions/prefetch-product";
import { useRealTimeHype } from "@/hooks/use-real-time-stock";

interface ProductCardProps {
  product: Product;
  showRating?: boolean;
  priority?: boolean;
  onWaitlistChange?: (isJoined: boolean) => void;
}
// Force rebuild for waitlist logic update

export function ProductCard({
  product,
  showRating = true,
  priority = false,
  onWaitlistChange,
}: ProductCardProps) {
  // Use optimized images if available, starting with thumbnail for grid, or mobile for slightly larger cards
  // Fallback to main_image_url
  const [isNew, setIsNew] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Real-time Stock
  // Type sanitation: DB types map product_id as string | null, but we need string for strict state
  const initialStock = (product.product_stock || [])
    .filter((item): item is typeof item & { product_id: string } =>
      Boolean(item.product_id),
    )
    .map((item) => ({
      ...item,
      product_id: item.product_id,
      quantity: item.quantity ?? 0, // Ensure number
    }));

  const { stock: realTimeStock } = useRealTimeHype(product.id, initialStock);

  // Pre-order state
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [isLoadingWaitlist, setIsLoadingWaitlist] = useState(false);
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);

  const router = useRouter();

  const addToCart = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isWishlisted = useWishlistStore((state) =>
    selectIsInWishlist(state, product.id),
  );

  // Dynamic stock calculation
  const stock = realTimeStock || [];

  // Determine if product has multiple options.
  // We check metadata AND actual stock variations to be safe.
  const hasMultipleOptions =
    (product.size_options && product.size_options.length > 0) ||
    (product.color_options && product.color_options.length > 0) ||
    stock.length > 1 ||
    (stock.length === 1 &&
      stock[0].size !== "Standard" &&
      stock[0].size !== "One Size");

  // Calculate total stock
  const totalStock = stock.reduce(
    (acc: number, item: { quantity: number }) => acc + (item.quantity || 0),
    0,
  );
  const isOutOfStock = totalStock === 0;

  // Optional: Get rating from product if passed (e.g. from a joined aggregate)
  const rating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;

  // Check waitlist status on mount if OOS
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image_url || "",
        slug: product.slug || "",
      });
      toast.success("Added to Wishlist");
    }
  };

  const { user } = useAuth();
  const [savedGuestEmail, setSavedGuestEmail] = useState("");
  const [isUnjoinDialogOpen, setIsUnjoinDialogOpen] = useState(false);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Swipeable Gallery State
  const allImages = [
    product.main_image_url || "/placeholder.svg",
    ...(product.gallery_image_urls || []),
  ].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      // Swiped Left -> Next Image
      setImgIndex((prev) => (prev + 1) % allImages.length);
    } else if (info.offset.x > swipeThreshold) {
      // Swiped Right -> Prev Image
      setImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasMultipleOptions) {
      setIsBuyNowMode(true);
      setIsQuickAddOpen(true);
      return;
    }

    // Pick first available variant
    const firstStock = realTimeStock.find((s) => s.quantity > 0);
    if (!firstStock) {
      toast.error("No stock available");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.main_image_url || "",
          size: firstStock.size || "Standard",
          color: firstStock.color || "Standard",
          quantity: 1,
          maxQuantity: firstStock.quantity,
          slug: product.slug || "",
          categoryId: product.category_id || "",
        },
        { openCart: false, showToast: false },
      );

      router.push("/checkout");
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasMultipleOptions) {
      setIsBuyNowMode(false);
      setIsQuickAddOpen(true);
      return;
    }

    // Pick first available variant
    const firstStock = realTimeStock.find((s) => s.quantity > 0);
    if (!firstStock) {
      togglePreorder(product.id); // If no stock, offer preorder
      return;
    }

    // Prevent double clicks
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.main_image_url || "",
        size: firstStock.size || "Standard",
        color: firstStock.color || "Standard",
        quantity: 1,
        maxQuantity: firstStock.quantity,
        slug: product.slug || "",
        categoryId: product.category_id || "",
      });
      toast.success("Added to Cart");
      setIsCartOpen(true);
    } catch (error) {
      // Error handled by store
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Helper to get or create guest ID
  const getGuestId = () => {
    if (typeof window === "undefined") return undefined;
    let id = localStorage.getItem("guest_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guest_id", id);
    }
    return id;
  };

  // Check waitlist status on mount if OOS
  // Check localStorage for guest status & email preference
  useEffect(() => {
    // 1. Load Email Preference
    const savedEmail = localStorage.getItem("user_email_preference");
    if (savedEmail) setSavedGuestEmail(savedEmail);

    // 2. Determine Waitlist Status (Server > Local)
    if (isOutOfStock) {
      setIsLoadingWaitlist(true);
      const guestId = getGuestId();
      // Pass savedEmail and guestId to check if this specific guest is on the list
      checkPreorderStatus(product.id, savedEmail || undefined, guestId).then(
        (serverStatus) => {
          if (serverStatus) {
            // Confirmed by server (User OR Guest with matching email OR GuestID)
            setIsOnWaitlist(true);
            // ensure local storage is in sync
            localStorage.setItem(`waitlist_${product.id}`, "true");
          } else {
            // Server says 'not joined'
            setIsOnWaitlist(false);
            localStorage.removeItem(`waitlist_${product.id}`);
          }
          setIsLoadingWaitlist(false);
        },
      );
    }
  }, [isOutOfStock, product.id]);

  const handlePreOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // OPTIMISTIC UI: If we think we are joined...
    if (isOnWaitlist) {
      // GUEST HANDLING: No optimistic toggle. Just remind them.
      if (!user) {
        toast.info("You are already on the waitlist! (Guest)");
        return;
      }

      // AUTH USER HANDLING: Optimistic Remove
      const previousState = true;
      setIsOnWaitlist(false); // Optimistically remove
      toast.success("Removed from waitlist."); // Optimistic success

      try {
        const result = await togglePreorder(product.id);

        if (result.error) {
          // Error -> Revert
          setIsOnWaitlist(previousState);
          toast.dismiss();
          toast.error(result.error);
        } else {
          // Success confirmed
          localStorage.removeItem(`waitlist_${product.id}`);
        }
      } catch (error) {
        setIsOnWaitlist(previousState);
        toast.dismiss();
        toast.error("Something went wrong.");
      }
      return;
    }

    // If NOT joined...

    setIsLoadingWaitlist(true);
    try {
      // Attempt 1: Try as logged in / existing session
      const result = await togglePreorder(product.id);

      // Updated Error Check for Guest (check if it asks for identifying info)
      if (
        result.error &&
        (result.error.includes("sign in") ||
          result.error.includes("identifying"))
      ) {
        // Not logged in -> Open Dialog
        setIsWaitlistDialogOpen(true);
      } else if (result.error) {
        toast.error(result.error);
      } else {
        // Logged in success
        setIsOnWaitlist(true);
        onWaitlistChange?.(true);
        toast.success("Added to waitlist!");
        if (result.status === "added")
          localStorage.setItem(`waitlist_${product.id}`, "true");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoadingWaitlist(false);
    }
  };

  const handleWaitlistSubmit = async (email: string) => {
    setIsLoadingWaitlist(true);
    try {
      const guestId = getGuestId();
      const result = await togglePreorder(product.id, email, guestId);
      if (result.error) {
        toast.error(result.error);
      } else if (result.status === "already_joined") {
        setIsOnWaitlist(true);
        toast.info(result.message);
        localStorage.setItem(`waitlist_${product.id}`, "true");
        if (email) localStorage.setItem("user_email_preference", email);
      } else {
        setIsOnWaitlist(true);
        toast.success("You've been added to the waitlist!");
        localStorage.setItem(`waitlist_${product.id}`, "true");
        if (email) localStorage.setItem("user_email_preference", email);
      }
    } catch (error) {
      toast.error("Failed to join waitlist.");
    } finally {
      setIsLoadingWaitlist(false);
    }
  };

  const handleConfirmUnjoin = async () => {
    // Optimistic Remove
    const previousState = true;
    setIsOnWaitlist(false);
    toast.success("Removed from waitlist.");
    setIsUnjoinDialogOpen(false);

    try {
      const guestId = getGuestId();
      const savedEmail = localStorage.getItem("user_email_preference");

      const result = await togglePreorder(
        product.id,
        savedEmail || undefined,
        guestId,
      );

      if (result.error) {
        // Error -> Revert
        setIsOnWaitlist(previousState);
        toast.dismiss();
        toast.error(result.error);
      } else {
        // Success confirmed
        localStorage.removeItem(`waitlist_${product.id}`);
      }
    } catch (error) {
      setIsOnWaitlist(previousState);
      toast.dismiss();
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    if (product.created_at) {
      const isProductNew =
        new Date(product.created_at) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      setIsNew(isProductNew);
    }
  }, [product.created_at]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.slug) {
      // Predictively warm the cache
      prefetchProductAction(product.slug);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative flex flex-col h-full bg-white border border-slate-100 rounded-2xl hover:shadow-lg transition-all duration-300 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <Link
          href={`/product/${product.slug || product.id}`}
          className="block relative aspect-[1/1] overflow-hidden bg-slate-50 rounded-t-2xl"
        >
          {/* Static Badges - Top Left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
            {isOutOfStock ? (
              <Badge className="bg-slate-900 text-white text-[10px] font-semibold px-3 py-1 rounded-full border-none">
                Sold Out
              </Badge>
            ) : (
              <>
                {isNew && (
                  <Badge className="bg-green-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full border-none shadow-sm">
                    New
                  </Badge>
                )}
                {calculateDiscount(product.price, product.original_price) && (
                  <Badge className="bg-red-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full border-none shadow-sm">
                    Sale
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Wishlist Button - Top Right */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 z-20 h-9 w-9 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white rounded-full transition-all text-slate-500 hover:text-red-500 shadow-sm"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isWishlisted && "fill-current text-red-500",
              )}
            />
          </button>

          {/* Gallery Layer */}
          <div className="relative h-full w-full">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 flex touch-none"
              animate={{ x: `-${imgIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {allImages.map((src, idx) => (
                <div key={idx} className="relative h-full w-full shrink-0 p-4">
                  <FlashImage
                    src={src}
                    alt={`${product.name} - ${idx + 1}`}
                    fill
                    resizeMode="contain"
                    className="object-contain hover:scale-105 transition-transform duration-500 ease-out"
                    priority={priority && idx === 0}
                  />
                </div>
              ))}
            </motion.div>

            {/* Pagination Dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-all duration-300 shadow-sm",
                      idx === imgIndex
                        ? "bg-green-600 scale-125"
                        : "bg-slate-300",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Card Content */}
        <div className="flex flex-col flex-1 p-5 gap-4">
          {/* Title & Rating */}
          <div className="flex flex-col gap-1">
            <Link
              href={`/product/${product.slug || product.id}`}
              className="group-hover:text-green-600 transition-colors"
            >
              <h3 className="font-semibold text-[15px] leading-snug text-slate-800 line-clamp-2 min-h-[2.2em]">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < Math.floor(rating)
                        ? "fill-current"
                        : "text-slate-200 fill-slate-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {reviewCount} Reviews
              </span>
            </div>
          </div>

          {/* Attributes / Macro Badge (Simulated) */}
          <div className="flex flex-wrap gap-1.5">
            <div className="bg-green-50 text-green-700 px-2.5 py-0.5 text-[10px] font-semibold rounded-full">
              20g Protein
            </div>
            <div className="bg-green-50 text-green-700 px-2.5 py-0.5 text-[10px] font-semibold rounded-full">
              No Sugar
            </div>
          </div>

          <div className="mt-auto pt-2 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium">
                From
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </span>
                {product.original_price &&
                  product.original_price > product.price && (
                    <span className="text-xs text-slate-400 line-through font-medium">
                      {formatCurrency(product.original_price)}
                    </span>
                  )}
              </div>
            </div>

            {/* Action Button - Always Visible & Bold */}
            {!isOutOfStock ? (
              <Button
                size="icon"
                className="h-11 w-11 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-md transition-all active:scale-95"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <span className="text-xs">↻</span>
                  </motion.div>
                ) : (
                  <span className="text-xl font-black">+</span>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-10 px-4 rounded-full bg-slate-100 text-slate-500 font-semibold text-xs hover:bg-slate-200"
                onClick={handlePreOrder}
                disabled={isLoadingWaitlist}
              >
                {isOnWaitlist ? "Joined" : "Notify"}
              </Button>
            )}
          </div>
        </div>

        <div
          onClick={(e) => e.preventDefault()}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none"
        >
          {/* Optional: Floating "Quick View" text or icon if needed, but keeping it clean for now */}
        </div>
      </motion.div>

      <WaitlistDialog
        open={isWaitlistDialogOpen}
        onOpenChange={(open) => {
          // Prevent interaction if submitting
          if (!isLoadingWaitlist) setIsWaitlistDialogOpen(open);
        }}
        onSubmit={handleWaitlistSubmit}
        isSubmitting={isLoadingWaitlist}
        initialEmail={savedGuestEmail}
      />

      <AlertDialog
        open={isUnjoinDialogOpen}
        onOpenChange={setIsUnjoinDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Waitlist?</AlertDialogTitle>
            <AlertDialogDescription>
              You will no longer receive notifications when this product is back
              in stock. You can always join again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleConfirmUnjoin();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuickAddDialog
        product={product}
        open={isQuickAddOpen}
        onOpenChange={(open) => {
          setIsQuickAddOpen(open);
          if (!open) setIsBuyNowMode(false); // Reset mode on close
        }}
        buyNowMode={isBuyNowMode}
      />
    </>
  );
}
