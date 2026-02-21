const { createStaticClient } = require('./lib/supabase/server');

async function checkProducts() {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('products')
      .select('name, main_image_url, slug')
      .ilike('name', '%Berry%');
    
    if (error) throw error;
    console.log('PRODUCTS_FOUND:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('ERROR_SEARCHING:', err);
  }
}

checkProducts();
