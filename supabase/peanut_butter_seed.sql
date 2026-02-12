-- Add Peanut Butter Protein Bar to Lab Snacks
INSERT INTO public.products (category_id, name, slug, description, price, original_price, main_image_url, is_active, is_carousel_featured, status, expression_tags, size_options, color_options)
SELECT 
  id, 
  'Peanut Butter Protein Bar', 
  'peanut-butter-protein-bar', 
  'High-protein bar with real peanut butter and 21g of muscle-building protein. Zero added sugar.', 
  637, 
  750, 
  'https://images.unsplash.com/photo-1622484211148-716598e0ed97?q=80&w=1000&auto=format&fit=crop',
  true,
  false,
  'active',
  ARRAY['Protein', 'Snack', 'Peanut Butter'],
  ARRAY['1 Bar', 'Box of 12'],
  ARRAY['Regular']
FROM public.categories WHERE slug = 'snacks' LIMIT 1;

-- Add stock for it
INSERT INTO public.product_stock (product_id, size, color, quantity)
SELECT id, '1 Bar', 'Regular', 500 FROM public.products WHERE slug = 'peanut-butter-protein-bar';

INSERT INTO public.product_stock (product_id, size, color, quantity)
SELECT id, 'Box of 12', 'Regular', 100 FROM public.products WHERE slug = 'peanut-butter-protein-bar';
