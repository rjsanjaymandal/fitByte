import { getRootCategories } from "@/lib/services/category-service";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

// Lazy load non-ATF (Above The Fold) components
const CategoryTabs = dynamic(() =>
  import("@/components/storefront/category-tabs").then(
    (mod) => mod.CategoryTabs,
  ),
);
const NewsletterSection = dynamic(() =>
  import("@/components/marketing/newsletter-section").then(
    (mod) => mod.NewsletterSection,
  ),
);
const AsyncFeaturedGrid = dynamic(() =>
  import("@/components/storefront/async-featured-grid").then(
    (mod) => mod.AsyncFeaturedGrid,
  ),
);
const TrustBar = dynamic(() =>
  import("@/components/storefront/trust-bar").then((mod) => mod.TrustBar),
);
const TestimonialCarousel = dynamic(() =>
  import("@/components/storefront/testimonial-carousel").then(
    (mod) => mod.TestimonialCarousel,
  ),
);
const FeaturedCollection = dynamic(() =>
  import("@/components/storefront/featured-collection").then(
    (mod) => mod.FeaturedCollection,
  ),
);
const FoundersSection = dynamic(() =>
  import("@/components/storefront/founders-section").then(
    (mod) => mod.FoundersSection,
  ),
);
const AvailableAt = dynamic(() =>
  import("@/components/storefront/available-at").then((mod) => mod.AvailableAt),
);
const FaqSection = dynamic(() =>
  import("@/components/storefront/faq-section").then((mod) => mod.FaqSection),
);

function GridSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center mb-12 space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-3/4" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

import {
  getFeaturedProducts,
  getProducts,
  type Product,
} from "@/lib/services/product-service";
import { getSmartCarouselData } from "@/lib/data/get-smart-carousel";
import {
  HeroCarousel,
  type HeroProduct,
} from "@/components/storefront/hero-carousel";

// Cache for 15 minutes (900 seconds)
export const revalidate = 900;

export default async function Home() {
  let categories: any[] = [];
  try {
    const allCategories = await getRootCategories(10);
    categories = allCategories.slice(0, 6); // Show more categories for range grid
  } catch (error) {
    console.error("[Home] Failed to fetch categories:", error);
  }

  // Fetch products for CategoryTabs (product count display)
  const categoryProductsMap: Record<string, Product[]> = {};
  if (categories.length > 0) {
    await Promise.all(
      categories.map(async (cat) => {
        try {
          const { data } = await getProducts({ category_id: cat.id, limit: 4 });
          categoryProductsMap[cat.id] = data;
        } catch (e) {
          console.error(`Failed to fetch products for category ${cat.name}`, e);
          categoryProductsMap[cat.id] = [];
        }
      }),
    );
  }

  let heroProducts: HeroProduct[] = [];
  try {
    heroProducts = await getSmartCarouselData();
  } catch (error) {
    console.error("[Home] Failed to fetch carousel data:", error);
  }

  // Fetch products for featured collections
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = await getFeaturedProducts();
  } catch (error) {
    console.error("[Home] Failed to fetch featured products:", error);
  }

  // Split products into two groups for two featured collection sections
  const collection1Products = featuredProducts.slice(0, 4);
  const collection2Products = featuredProducts.slice(4, 8);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 selection:bg-rose-400 selection:text-white">
      {/* SEO H1 */}
      <h1 className="sr-only">
        fitByte | Premium Protein Bars, Supplements & Health Snacks Online India
      </h1>

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel products={heroProducts} />

      {/* 2. BESTSELLERS (Product Carousel) */}
      <Suspense fallback={<GridSkeleton />}>
        <AsyncFeaturedGrid />
      </Suspense>

      {/* 3. THE FITBYTE RANGE (Collection Category Grid) */}
      <CategoryTabs
        categories={categories || []}
        productsMap={categoryProductsMap}
      />

      {/* 4. TRUST BADGES ("Our Products Are") */}
      <TrustBar />

      {/* 5. FEATURED COLLECTION #1 */}
      {collection1Products.length > 0 && (
        <FeaturedCollection
          title="SHAKES GOT MUSCLE"
          subtitle="Lab-tested, taste-refined protein shakes for peak performance."
          collectionSlug="protein"
          products={collection1Products}
        />
      )}

      {/* 6. TESTIMONIALS ("Don't Take Our Word") */}
      <TestimonialCarousel />

      {/* 7. FEATURED COLLECTION #2 */}
      {collection2Products.length > 0 && (
        <FeaturedCollection
          title="BAR BAR DEKHO"
          subtitle="Protein-packed bars that taste like a treat, not a chore."
          collectionSlug="snacks"
          products={collection2Products}
          accentColor="#1a2b47"
          reversed
        />
      )}

      {/* 8. FOUNDERS / OUR STORY */}
      <FoundersSection />

      {/* 9. FAQ SECTION */}
      <FaqSection />

      {/* 10. AVAILABLE AT (Retail Partners) */}
      <AvailableAt />

      {/* 11. NEWSLETTER ("Join the Fam") */}
      <NewsletterSection />
    </div>
  );
}
