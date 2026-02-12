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
        className="group relative flex flex-col gap-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <Link
          href={`/product/${product.slug || product.id}`}
          className="block relative aspect-[1/1] overflow-hidden rounded-none bg-white border border-[#1a2b47]/5 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/5"
        >
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
            {isOutOfStock ? (
              <Badge className="bg-[#1a2b47] text-white uppercase tracking-[0.2em] text-[8px] font-black px-2 py-1 rounded-none border-none shadow-sm">
                Sold Out
              </Badge>
            ) : (
              <>
                {isNew && (
                  <Badge className="bg-[#e31e24] text-white uppercase tracking-[0.2em] text-[8px] font-black px-2 py-1 rounded-none border-none shadow-sm">
                    New
                  </Badge>
                )}
                {calculateDiscount(product.price, product.original_price) && (
                  <Badge className="bg-[#1a2b47] text-white uppercase tracking-[0.2em] text-[8px] font-black px-2 py-1 rounded-none border-none shadow-sm">
                    -{calculateDiscount(product.price, product.original_price)}%
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={cn(
              "absolute top-2 right-2 z-10 h-7 w-7 flex items-center justify-center rounded-none bg-white transition-all duration-200 hover:scale-110 shadow-sm opacity-0 md:group-hover:opacity-100",
              isWishlisted
                ? "text-[#e31e24] opacity-100"
                : "text-[#1a2b47]/20 hover:text-[#e31e24]",
            )}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                isWishlisted ? "fill-current" : "",
              )}
            />
          </button>

          {/* Gallery Layer */}
          <div className="relative h-full w-full bg-zinc-100 overflow-hidden">
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
                <div key={idx} className="relative h-full w-full shrink-0">
                  <FlashImage
                    src={src}
                    alt={`${product.name} - ${idx + 1}`}
                    fill
                    resizeMode="cover"
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1210px) 33vw, 25vw"
                    priority={priority && idx === 0}
                  />
                </div>
              ))}
            </motion.div>

            {/* Pagination Dots */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 px-2 py-1 rounded-full bg-black/5 backdrop-blur-sm">
                {allImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1 transition-all duration-300 rounded-none",
                      idx === imgIndex
                        ? "w-4 bg-foreground"
                        : "w-1 bg-foreground/20",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Action Overlay */}
          <div className="hidden lg:flex absolute inset-x-2 bottom-3 gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out z-20">
            {!isOutOfStock ? (
              <>
                <Button
                  size="sm"
                  className="flex-1 bg-primary text-black hover:scale-105 shadow-xl shadow-primary/20 font-black h-11 rounded-full transition-all duration-300 uppercase text-[11px] tracking-widest border-none"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <div onClick={(e) => e.preventDefault()} className="shrink-0">
                  <QuickView product={product} />
                </div>
              </>
            ) : (
              <Button
                size="sm"
                className={cn(
                  "flex-1 shadow-lg font-black h-11 rounded-full transition-all duration-300 uppercase text-[11px] tracking-widest",
                  isOnWaitlist
                    ? "bg-zinc-100 text-zinc-400"
                    : "bg-black text-white hover:opacity-90 shadow-black/10",
                )}
                onClick={handlePreOrder}
                disabled={isLoadingWaitlist}
              >
                {isLoadingWaitlist
                  ? "..."
                  : isOnWaitlist
                    ? "Joined"
                    : "Notify Me"}
              </Button>
            )}
          </div>
        </Link>

        {/* Details */}
        <div className="space-y-4 px-1 py-4 text-left">
          <div className="flex flex-col items-start gap-1">
            <Link
              href={`/product/${product.slug || product.id}`}
              className="hover:opacity-70 transition-opacity"
            >
              <h3 className="font-black text-[13px] sm:text-[15px] leading-tight text-[#1a2b47] uppercase tracking-widest line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* Pricing */}
            <div className="flex items-center gap-2 font-black">
              <span className="text-[16px] sm:text-[18px] text-[#1a2b47] font-black">
                {formatCurrency(product.price)}
              </span>
              {product.original_price &&
                product.original_price > product.price && (
                  <span className="text-[12px] sm:text-[14px] text-zinc-400 line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                )}
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(rating)
                        ? "fill-[#1a2b47] text-[#1a2b47]"
                        : "text-zinc-200 fill-zinc-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                ({reviewCount})
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-1">
            {!isOutOfStock ? (
              <Button
                className="w-full bg-[#1a2b47] text-white hover:bg-black h-12 sm:h-14 rounded-none font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] transition-all border-none"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            ) : (
              <Button
                className="w-full bg-[#1a2b47]/5 text-[#1a2b47]/20 h-12 sm:h-14 rounded-none font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] border-none cursor-not-allowed"
                disabled
              >
                Sold Out
              </Button>
            )}
          </div>
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
