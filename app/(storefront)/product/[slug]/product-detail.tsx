"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";
import {
  useWishlistStore,
  selectIsInWishlist,
} from "@/store/use-wishlist-store";
import { cn, formatCurrency, calculateDiscount } from "@/lib/utils";
import {
  Phone,
  Plus,
  Share2,
  Star,
  Check,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { togglePreorder } from "@/app/actions/preorder";
import { ProductGallery } from "@/components/products/product-gallery";
import {
  ProductColorSelector,
  ProductSizeSelector,
} from "@/components/products/product-selectors";

import dynamic from "next/dynamic";

const SizeGuideModal = dynamic(
  () =>
    import("@/components/products/size-guide-modal").then(
      (mod) => mod.SizeGuideModal,
    ),
  { ssr: false },
);

import { FAQJsonLd } from "@/components/seo/faq-json-ld";
import { RecommendedProducts } from "@/components/storefront/recommended-products";
import { useRealTimeHype, StockItem } from "@/hooks/use-real-time-stock";
import { useAuth } from "@/context/auth-context";
import { WaitlistDialog } from "@/components/products/waitlist-dialog";
import { useRouter } from "next/navigation";
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

// Fallback Standards
const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// Types
type ProductDetailProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    original_price?: number | null;
    main_image_url: string;
    gallery_image_urls?: string[];
    size_options: string[];
    color_options: string[];
    fit_options?: string[];
    product_stock: StockItem[];
    category_id?: string;
    images?: {
      thumbnail: string;
      mobile: string;
      desktop: string;
    };
    slug?: string;
    categories?: {
      name: string;
    } | null;
  };
  initialReviews: {
    count: number;
    average: string;
  };
  colorMap?: Record<string, string>;
};

export function ProductDetailClient({
  product,
  initialReviews,
  colorMap,
}: ProductDetailProps) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addItem);
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const isWishlisted = useWishlistStore((state) =>
    selectIsInWishlist(state, product.id),
  );

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Waitlist State
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [isLoadingWaitlist, setIsLoadingWaitlist] = useState(false);
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);
  const [isUnjoinDialogOpen, setIsUnjoinDialogOpen] = useState(false);

  // Helper: Normalize color strings
  const normalizeColor = (c: string) => {
    if (!c) return "";
    let clean = c.trim().toLowerCase().replace(/\s+/g, " ");
    if (clean === "offf white") clean = "off white";
    if (clean === "off-white") clean = "off white";
    return clean
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const adjustedPrice = product.price;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  const { user } = useAuth();

  // Real-time Stock & Hype Check
  const { stock: realTimeStock, loading: loadingStock } = useRealTimeHype(
    product.id,
    product.product_stock,
  );

  // Helper to get or create guest ID
  const getGuestId = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    let id = localStorage.getItem("guest_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guest_id", id);
    }
    return id;
  }, []);

  // Options normalization
  const sizeOptions = useMemo(() => {
    let sizes = product.size_options?.length
      ? [...product.size_options]
      : realTimeStock?.length
        ? Array.from(new Set(realTimeStock.map((s) => s.size)))
        : ["Standard"];

    // Filter out "One Size" / "Standard" if they are the only option
    if (
      sizes.length === 1 &&
      (sizes[0] === "Standard" || sizes[0] === "One Size")
    ) {
      // Keep it for logic but we might hide it in UI
    }

    return sizes.sort((a, b) => {
      const indexA = STANDARD_SIZES.indexOf(a);
      const indexB = STANDARD_SIZES.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [product.size_options, realTimeStock]);

  const colorOptions = useMemo(() => {
    const rawOptions = product.color_options?.length
      ? product.color_options
      : realTimeStock?.map((s) => s.color).filter(Boolean) || ["Standard"];

    const normalized = Array.from(
      new Set(rawOptions.map(normalizeColor)),
    ).sort();

    return normalized;
  }, [product.color_options, realTimeStock]);

  // Auto-Select Logic
  useEffect(() => {
    if (sizeOptions.length === 1 && !selectedSize) {
      setSelectedSize(sizeOptions[0]);
    }
    if (colorOptions.length === 1 && !selectedColor) {
      setSelectedColor(colorOptions[0]);
    }
  }, [sizeOptions, colorOptions, selectedSize, selectedColor]);

  const stockMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (!realTimeStock) return map;
    realTimeStock.forEach((item: any) => {
      const key = `${item.size}-${normalizeColor(item.color || "")}`;
      map[key] = (map[key] || 0) + item.quantity;
    });
    return map;
  }, [realTimeStock]);

  const totalStock = useMemo(() => {
    return (
      realTimeStock?.reduce(
        (acc: number, item) => acc + (item.quantity || 0),
        0,
      ) ?? 0
    );
  }, [realTimeStock]);

  const getStock = (size: string, color: string) =>
    stockMap[`${size}-${normalizeColor(color)}`] || 0;

  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return true;
    return getStock(size, selectedColor) > 0;
  };

  const maxQty = getStock(selectedSize, selectedColor);

  const isGlobalOutOfStock = totalStock === 0 && !loadingStock;
  const isSelectionOutOfStock =
    maxQty === 0 && !!(selectedSize && selectedColor);
  const isOutOfStock = isGlobalOutOfStock || isSelectionOutOfStock;

  const handleWaitlistSubmit = async (email: string) => {
    setIsLoadingWaitlist(true);
    try {
      const guestId = getGuestId();
      const result = await togglePreorder(product.id, email, guestId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsOnWaitlist(true);
        toast.success("Added to waitlist!");
        localStorage.setItem(`waitlist_${product.id}`, "true");
        if (email) localStorage.setItem("user_email_preference", email);
      }
    } catch (error) {
      toast.error("Failed to join waitlist.");
    } finally {
      setIsLoadingWaitlist(false);
    }
  };

  const handleAddToCart = async (
    options = { openCart: true, showToast: true },
  ) => {
    // If no size or color, and there's only one option, try to auto-pick it
    let size = selectedSize;
    let color = selectedColor;

    if (!size && sizeOptions.length === 1) size = sizeOptions[0];
    if (!color && colorOptions.length === 1) color = colorOptions[0];

    if (!size || !color) {
      toast.error("Please complete your selection");
      return false;
    }

    const currentStock = getStock(size, color);
    if (currentStock <= 0) {
      toast.error("Selected option is out of stock");
      return false;
    }

    try {
      await addToCart(
        {
          productId: product.id,
          categoryId: product.category_id || "",
          name: product.name,
          price: adjustedPrice,
          image: product.main_image_url,
          size,
          color,
          quantity: quantity,
          maxQuantity: currentStock,
          slug: product.slug || "",
        },
        options,
      );
      return true;
    } catch (error) {
      toast.error("Failed to add to cart");
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart({
      openCart: false,
      showToast: false,
    });
    if (success) {
      router.push("/checkout");
    }
  };

  useEffect(() => {
    router.prefetch("/checkout");
  }, [router]);

  const hasVariants =
    colorOptions.length > 1 ||
    sizeOptions.length > 1 ||
    (sizeOptions.length === 1 &&
      sizeOptions[0] !== "Standard" &&
      sizeOptions[0] !== "One Size");

  return (
    <div className="min-h-screen bg-slate-50/50">
      <FAQJsonLd questions={[]} />

      {/* GALLERY SECTION */}
      <div className="w-full bg-white">
        <ProductGallery
          images={product.gallery_image_urls || []}
          name={product.name}
          mainImage={product.images?.desktop || product.main_image_url}
        />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT COLUMN: Identity */}
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  New Arrival
                </span>
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-slate-900">
                  {formatCurrency(adjustedPrice)}
                </p>
                {product.original_price &&
                  product.original_price > product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-slate-400 line-through">
                        {formatCurrency(product.original_price)}
                      </span>
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                        SAVE{" "}
                        {calculateDiscount(
                          adjustedPrice,
                          product.original_price,
                        )}
                        %
                      </span>
                    </div>
                  )}
              </div>

              {initialReviews.count > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(Number(initialReviews.average))
                            ? "fill-current"
                            : "fill-slate-200 text-slate-200",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {initialReviews.average}
                  </span>
                  <span className="text-sm text-slate-400 font-medium">
                    ({initialReviews.count} Reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Selectors */}
            <div className="space-y-10 py-4">
              {colorOptions.length > 0 && colorOptions[0] !== "Standard" && (
                <ProductColorSelector
                  options={colorOptions}
                  selected={selectedColor}
                  onSelect={setSelectedColor}
                  isAvailable={(color) => {
                    if (!selectedSize) return true;
                    return getStock(selectedSize, color) > 0;
                  }}
                  customColorMap={colorMap}
                />
              )}

              {sizeOptions.length > 0 &&
                !(
                  sizeOptions.length === 1 &&
                  (sizeOptions[0] === "Standard" ||
                    sizeOptions[0] === "One Size")
                ) && (
                  <ProductSizeSelector
                    options={sizeOptions}
                    selected={selectedSize}
                    onSelect={setSelectedSize}
                    isAvailable={isSizeAvailable}
                    onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
                  />
                )}
            </div>
          </div>

          {/* RIGHT COLUMN: Actions */}
          <div className="col-span-1 lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md space-y-8">
                {/* Quantity */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Quantity
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-slate-100 rounded-2xl p-1 bg-slate-50/50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) => Math.min(maxQty || 99, q + 1))
                        }
                        className="w-10 h-10 flex items-center justify-center font-bold text-lg hover:bg-white hover:shadow-sm rounded-xl transition-all"
                      >
                        +
                      </button>
                    </div>
                    {maxQty > 0 && maxQty < 5 && (
                      <span className="text-xs font-bold text-amber-600 uppercase">
                        Only {maxQty} left!
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button
                    size="lg"
                    className={cn(
                      "w-full h-16 rounded-2xl text-base font-bold transition-all active:scale-95 shadow-lg",
                      isOutOfStock
                        ? "bg-slate-100 text-slate-400"
                        : "bg-green-600 text-white hover:bg-green-700 shadow-green-200",
                    )}
                    disabled={
                      isOutOfStock && !isOnWaitlist && isLoadingWaitlist
                    }
                    onClick={
                      isOutOfStock
                        ? isOnWaitlist
                          ? () => setIsUnjoinDialogOpen(true)
                          : () => handleWaitlistSubmit("")
                        : handleBuyNow
                    }
                  >
                    {isOutOfStock
                      ? isOnWaitlist
                        ? "Joined Waitlist"
                        : "Join Waitlist"
                      : "Buy Now"}
                  </Button>

                  {!isOutOfStock && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-16 rounded-2xl text-base font-bold border-2 border-slate-100 hover:bg-slate-50 active:scale-95 transition-all text-slate-800"
                      onClick={() => handleAddToCart()}
                    >
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      Add to Bag
                    </Button>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Check className="w-4 h-4" />
                    </div>
                    Free Shipping on orders above ₹1000
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Check className="w-4 h-4" />
                    </div>
                    7-day flavor substitution guarantee
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  The Science & Flavor
                </h3>
                <div
                  className="prose prose-slate max-w-none text-slate-600 font-medium [&>p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Service Accordion (Optional but Clean) */}
              <div className="bg-slate-100/50 rounded-2xl p-6 space-y-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Questions?
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href="/contact"
                    className="text-sm font-bold text-slate-900 border-b-2 border-green-600 pb-0.5"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/shipping"
                    className="text-sm font-bold text-slate-900 border-b-2 border-green-600 pb-0.5"
                  >
                    Shipping Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaitlistDialog
        open={isWaitlistDialogOpen}
        onOpenChange={setIsWaitlistDialogOpen}
        onSubmit={handleWaitlistSubmit}
        isSubmitting={isLoadingWaitlist}
      />

      <SizeGuideModal
        open={isSizeGuideOpen}
        onOpenChange={setIsSizeGuideOpen}
      />

      <AlertDialog
        open={isUnjoinDialogOpen}
        onOpenChange={setIsUnjoinDialogOpen}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Remove from Waitlist?
            </AlertDialogTitle>
            <AlertDialogDescription>
              No worries, you can always join back whenever you're ready.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RecommendedProducts
        categoryId={product.category_id || ""}
        currentProductId={product.id}
        title="You May Also Like"
      />
    </div>
  );
}
