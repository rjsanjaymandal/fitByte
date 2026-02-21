import { createStaticClient } from "@/lib/supabase/server"

export async function getSmartCarouselData() {
    const supabase = createStaticClient()
    
    // Select specific fields as requested + product_stock for filtering
    const { data } = await supabase
        .from('products')
        .select(`
            id, 
            name, 
            description, 
            price, 
            original_price,
            main_image_url, 
            slug, 
            created_at, 
            color_options,
            size_options,
            gallery_image_urls,
            product_stock(quantity)
        `)
        .eq('is_active', true)
        .eq('is_carousel_featured', true)
        .order('created_at', { ascending: false })
        .limit(40) // Increased buffer to ensure 15 in-stock items are available

    if (!data || data.length === 0) {
        // Fallback: Fetch any active products with stock
        const { data: fallbackData } = await supabase
            .from('products')
            .select(`
                id, name, description, price, original_price,
                main_image_url, slug, created_at, color_options, size_options,
                gallery_image_urls,
                product_stock(quantity)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(10)

        if (!fallbackData) return []
        
        return fallbackData
            .filter(p => {
                const totalStock = p.product_stock?.reduce((sum: number, s: any) => sum + s.quantity, 0) || 0
                return totalStock > 0
            })
            .slice(0, 5)
    }

    // Client-side filtering for stock > 0 and banner mapping
    const smartData = data
        .filter(p => {
            const totalStock = p.product_stock?.reduce((sum: number, s: any) => sum + s.quantity, 0) || 0
            return totalStock > 0
        })
        .map(p => {
            // Map gallery images to banners if available
            // Convention: gallery[0] = Desktop, gallery[1] = Mobile (if 2+ images)
            const gallery = p.gallery_image_urls || []
            return {
                ...p,
                desktop_image_url: gallery.length >= 1 ? gallery[0] : p.main_image_url,
                mobile_image_url: gallery.length >= 2 ? gallery[1] : (gallery.length >= 1 ? gallery[0] : p.main_image_url)
            }
        })
        .slice(0, 5) // Reduced to 5 for better performance and focus

    return smartData
}
