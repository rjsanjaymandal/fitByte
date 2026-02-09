import {
  getFeaturedProducts,
  type Product,
} from "@/lib/services/product-service";
import { FeaturedGrid } from "@/components/storefront/featured-grid";

export async function AsyncFeaturedGrid() {
  let products: Product[] = [];
  try {
    products = await getFeaturedProducts();
  } catch (error) {
    console.error("[AsyncFeaturedGrid] Failed to fetch:", error);
  }

  return (
    <FeaturedGrid
      products={products || []}
      title="FRESH ARRIVALS"
      subtitle="Fuel your day with our latest nutrition packs and energy snacks."
      badge="New Bio"
    />
  );
}
