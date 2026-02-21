const { createStaticClient } = require('./lib/supabase/server');

async function checkCarousel() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('products')
    .select('name, main_image_url, slug')
    .eq('is_active', true)
    .eq('is_carousel_featured', true);
  
  console.log('CAROUSEL_DATA:', JSON.stringify(data, null, 2));
}

checkCarousel();
