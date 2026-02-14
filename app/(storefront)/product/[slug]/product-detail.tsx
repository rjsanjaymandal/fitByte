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
  Share2,
  Star,
  ShoppingBag,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  FlaskConical,
  Leaf,
  Zap,
  Flame,
  Droplets,
  ChevronRight,
  ChevronDown,
  Sparkles,
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

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

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
  const [isDescOpen, setIsDescOpen] = useState(false);

  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [isLoadingWaitlist, setIsLoadingWaitlist] = useState(false);
  const [isWaitlistDialogOpen, setIsWaitlistDialogOpen] = useState(false);
  const [isUnjoinDialogOpen, setIsUnjoinDialogOpen] = useState(false);

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
        toast.success("Link copied!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { user } = useAuth();
  const { stock: realTimeStock, loading: loadingStock } = useRealTimeHype(
    product.id,
    product.product_stock,
  );

  const getGuestId = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    let id = localStorage.getItem("guest_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guest_id", id);
    }
    return id;
  }, []);

  const sizeOptions = useMemo(() => {
    let sizes = product.size_options?.length
      ? [...product.size_options]
      : realTimeStock?.length
        ? Array.from(new Set(realTimeStock.map((s) => s.size)))
        : ["Standard"];
    return sizes.sort((a, b) => {
      const iA = STANDARD_SIZES.indexOf(a),
        iB = STANDARD_SIZES.indexOf(b);
      if (iA !== -1 && iB !== -1) return iA - iB;
      if (iA !== -1) return -1;
      if (iB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [product.size_options, realTimeStock]);

  const colorOptions = useMemo(() => {
    const raw = product.color_options?.length
      ? product.color_options
      : realTimeStock?.map((s) => s.color).filter(Boolean) || ["Standard"];
    return Array.from(new Set(raw.map(normalizeColor))).sort();
  }, [product.color_options, realTimeStock]);

  useEffect(() => {
    if (sizeOptions.length === 1 && !selectedSize)
      setSelectedSize(sizeOptions[0]);
    if (colorOptions.length === 1 && !selectedColor)
      setSelectedColor(colorOptions[0]);
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

  const totalStock = useMemo(
    () =>
      realTimeStock?.reduce((a: number, i) => a + (i.quantity || 0), 0) ?? 0,
    [realTimeStock],
  );
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
    } catch {
      toast.error("Failed to join waitlist.");
    } finally {
      setIsLoadingWaitlist(false);
    }
  };

  const handleAddToCart = async (
    options = { openCart: true, showToast: true },
  ) => {
    let size = selectedSize,
      color = selectedColor;
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
          quantity,
          maxQuantity: currentStock,
          slug: product.slug || "",
        },
        options,
      );
      return true;
    } catch {
      toast.error("Failed to add to cart");
      return false;
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart({
      openCart: false,
      showToast: false,
    });
    if (success) router.push("/checkout");
  };

  useEffect(() => {
    router.prefetch("/checkout");
  }, [router]);

  const discount = product.original_price
    ? calculateDiscount(adjustedPrice, product.original_price)
    : 0;

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <FAQJsonLd questions={[]} />

      {/* ═══ BREADCRUMB ═══ */}
      <div className="w-full bg-rose-50/60 border-b border-rose-100/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-medium text-stone-400">
            <Link href="/" className="hover:text-stone-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link
              href="/shop"
              className="hover:text-stone-700 transition-colors"
            >
              Shop
            </Link>
            {product.categories?.name && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-stone-500">
                  {product.categories.name}
                </span>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-stone-800 font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ═══ HERO: Gallery + Purchase Panel ═══ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-14 pt-0 lg:pt-8">
          {/* Gallery */}
          <div className="col-span-1 lg:col-span-7">
            <ProductGallery
              images={product.gallery_image_urls || []}
              name={product.name}
              mainImage={product.images?.desktop || product.main_image_url}
            />
          </div>

          {/* Purchase Panel */}
          <div className="col-span-1 lg:col-span-5 py-6 lg:py-8">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.original_price &&
                  product.original_price > product.price && (
                    <span className="bg-yellow-300 text-stone-900 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      {discount}% OFF
                    </span>
                  )}
                {!isOutOfStock && (
                  <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    In Stock
                  </span>
                )}
                {isGlobalOutOfStock && (
                  <span className="bg-stone-200 text-stone-500 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold text-stone-900 leading-[1.15] tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-stone-900">
                  {formatCurrency(adjustedPrice)}
                </span>
                {product.original_price &&
                  product.original_price > product.price && (
                    <span className="text-lg text-stone-400 line-through">
                      {formatCurrency(product.original_price)}
                    </span>
                  )}
              </div>

              {/* Stars */}
              {initialReviews.count > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(Number(initialReviews.average))
                            ? "fill-current"
                            : "fill-stone-200 text-stone-200",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-stone-900">
                    {initialReviews.average}
                  </span>
                  <span className="text-sm text-stone-400">
                    ({initialReviews.count})
                  </span>
                </div>
              )}

              <div className="h-px bg-rose-100" />

              {/* Selectors */}
              <div className="space-y-5">
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

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone-800">
                  Quantity
                </span>
                <div className="flex items-center border-2 border-rose-100 rounded-full overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-rose-50 transition-colors text-stone-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-black text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(maxQty || 99, q + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center hover:bg-rose-50 transition-colors text-stone-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {maxQty > 0 && maxQty < 5 && (
                <p className="text-xs font-bold text-yellow-700 bg-yellow-100 px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 fill-current" /> Only {maxQty}{" "}
                  left — order soon!
                </p>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3 pt-1">
                <Button
                  size="lg"
                  className={cn(
                    "w-full h-14 rounded-full text-[15px] font-bold transition-all active:scale-[0.97]",
                    isOutOfStock
                      ? "bg-stone-200 text-stone-400 hover:bg-stone-300"
                      : "bg-stone-900 text-white hover:bg-stone-800 shadow-xl shadow-stone-900/20",
                  )}
                  disabled={isOutOfStock && !isOnWaitlist && isLoadingWaitlist}
                  onClick={
                    isOutOfStock
                      ? isOnWaitlist
                        ? () => setIsUnjoinDialogOpen(true)
                        : () => handleWaitlistSubmit("")
                      : handleBuyNow
                  }
                >
                  {isOutOfStock ? (
                    isOnWaitlist ? (
                      "Joined Waitlist ✓"
                    ) : (
                      "Join Waitlist"
                    )
                  ) : (
                    <span className="flex items-center gap-2">
                      Buy Now <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {!isOutOfStock && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-14 rounded-full text-[15px] font-bold border-2 border-rose-200 hover:bg-rose-50 active:scale-[0.97] transition-all text-stone-700 bg-white"
                    onClick={() => handleAddToCart()}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Bag
                  </Button>
                )}
              </div>

              {/* Wishlist + Share */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (isWishlisted) {
                      removeItem(product.id);
                      toast("Removed from wishlist");
                    } else {
                      addItem({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.main_image_url,
                        slug: product.slug || "",
                      });
                      toast.success("Added to wishlist ♥");
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border-2 transition-all",
                    isWishlisted
                      ? "bg-rose-100 border-rose-300 text-rose-600"
                      : "bg-white border-rose-100 text-stone-400 hover:border-rose-200",
                  )}
                >
                  <Heart
                    className={cn("w-4 h-4", isWishlisted && "fill-current")}
                  />{" "}
                  {isWishlisted ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border-2 border-rose-100 text-stone-400 hover:border-rose-200 bg-white transition-all"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-2 pt-5 border-t border-rose-100">
                {[
                  { icon: Truck, title: "Free Shipping", sub: "above ₹1000" },
                  { icon: ShieldCheck, title: "7-Day Easy", sub: "Returns" },
                  {
                    icon: FlaskConical,
                    title: "Lab Tested",
                    sub: "& Certified",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col items-center text-center gap-1.5 py-3 px-2 rounded-2xl bg-rose-50/50"
                  >
                    <item.icon className="w-5 h-5 text-rose-400" />
                    <span className="text-[10px] font-bold text-stone-600 leading-tight">
                      {item.title}
                      <br />
                      {item.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ DESCRIPTION ═══ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="max-w-3xl">
          <button
            onClick={() => setIsDescOpen(!isDescOpen)}
            className="flex items-center justify-between w-full group"
          >
            <h2 className="text-xl font-bold text-stone-900">
              About This Product
            </h2>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-stone-400 transition-transform duration-300",
                isDescOpen && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence>
            {isDescOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div
                  className="prose prose-stone max-w-none pt-6 text-stone-600 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {!isDescOpen && (
            <p className="text-stone-400 text-sm mt-3 font-medium">
              Click to read full description
            </p>
          )}
        </div>
      </div>

      {/* ═══ NUTRITION HIGHLIGHTS ═══ */}
      <div className="bg-rose-50/40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-black tracking-[0.25em] text-rose-500 uppercase mb-3"
            >
              What&apos;s Inside
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight"
            >
              Nutrition at a Glance
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Zap,
                label: "Protein",
                value: "22%",
                color: "text-yellow-500",
                bg: "bg-yellow-100",
              },
              {
                icon: Flame,
                label: "Energy",
                value: "120cal",
                color: "text-rose-500",
                bg: "bg-rose-100",
              },
              {
                icon: Droplets,
                label: "Sugar",
                value: "Low",
                color: "text-stone-500",
                bg: "bg-stone-100",
              },
              {
                icon: Leaf,
                label: "Fiber",
                value: "Rich",
                color: "text-rose-500",
                bg: "bg-rose-100",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-rose-100/80 p-7 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-transform group-hover:scale-110",
                    item.bg,
                  )}
                >
                  <item.icon className={cn("w-7 h-7", item.color)} />
                </div>
                <p className="text-3xl font-black text-stone-900 mb-1">
                  {item.value}
                </p>
                <p className="text-sm font-semibold text-stone-400">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ WHY CHOOSE THIS ═══ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-[0.25em] text-yellow-500 uppercase mb-3"
          >
            The fitBytes Difference
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight"
          >
            Why You&apos;ll Love It
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            {
              icon: FlaskConical,
              title: "Lab Tested",
              desc: "Every batch is third-party tested for purity and potency.",
            },
            {
              icon: Leaf,
              title: "All Natural",
              desc: "No artificial colors, flavors, or preservatives. Non-GMO.",
            },
            {
              icon: ShieldCheck,
              title: "Quality Guaranteed",
              desc: "Not satisfied? We'll make it right. Always.",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Ships within 24 hours. Free on orders above ₹1,000.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 border border-rose-100/80 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-yellow-200/60 flex items-center justify-center text-stone-800 mb-5 transition-transform group-hover:scale-110">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">
                {item.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ HOW TO USE ═══ */}
      <div className="bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,207,232,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(253,224,71,0.05),transparent_50%)]" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-20 relative z-10">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-black tracking-[0.25em] text-yellow-300 uppercase mb-3"
            >
              Simple &amp; Easy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-black text-white tracking-tight"
            >
              How to Enjoy
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Unwrap",
                desc: "Tear open the pack. Your energy bar is ready — no prep needed.",
              },
              {
                step: "02",
                title: "Bite In",
                desc: "Rich, chewy, and packed with real ingredients you can taste.",
              },
              {
                step: "03",
                title: "Fuel Up",
                desc: "Perfect for post-workout recovery, travel, or a healthy snack on-the-go.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-400/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-rose-500/20 transition-colors">
                  <span className="text-2xl font-black text-rose-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed max-w-[260px] mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ RECOMMENDATIONS ═══ */}
      <RecommendedProducts
        categoryId={product.category_id || ""}
        currentProductId={product.id}
        title="Pairs Well With"
      />

      {/* ═══ MODALS ═══ */}
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
        <AlertDialogContent className="rounded-3xl border-rose-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-stone-900">
              Remove from Waitlist?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500">
              No worries, you can always join back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full font-semibold border-rose-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
