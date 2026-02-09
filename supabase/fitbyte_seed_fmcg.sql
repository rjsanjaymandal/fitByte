-- fitByte: BRAND-ALIGNED SEED DATA (FMCG/Nutraceuticals)

-- 1. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url)
VALUES 
(uuid_generate_v4(), 'Precision Protein', 'protein', 'High-bioavailability whey and plant-based isolates.', 'https://images.unsplash.com/photo-1593095191026-614bd5ddef74?q=80&w=1000&auto=format&fit=crop'),
(uuid_generate_v4(), 'Bio-Essentials', 'essentials', 'Daily optimization stacks for cognitive and physical performance.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1000&auto=format&fit=crop'),
(uuid_generate_v4(), 'Energy Lab', 'energy', 'Clean energy solutions without the crash.', 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1000&auto=format&fit=crop'),
(uuid_generate_v4(), 'Lab Snacks', 'snacks', 'Macro-balanced snacks for the active lifestyle.', 'https://images.unsplash.com/photo-1622484211148-716598e0ed97?q=80&w=1000&auto=format&fit=crop');

-- 2. PRODUCTS (Snapshots)
-- Fetch category IDs for insertion (Dynamic in script using subqueries)
INSERT INTO public.products (category_id, name, slug, description, price, original_price, main_image_url, is_active, is_carousel_featured, status, expression_tags, size_options, color_options)
SELECT 
  id, 
  'Iso-Byte Whey Isolate', 
  'iso-byte-whey', 
  'Ultra-pure whey isolate with 26g protein per serving. Zero sugar.', 
  2899, 
  3499, 
  'https://images.unsplash.com/photo-1593095191026-614bd5ddef74?q=80&w=1000&auto=format&fit=crop',
  true,
  true,
  'active',
  ARRAY['Mass', 'Recovery'],
  ARRAY['1kg', '2kg'],
  ARRAY['Vanilla', 'Chocolate']
FROM public.categories WHERE slug = 'protein' LIMIT 1;

INSERT INTO public.products (category_id, name, slug, description, price, original_price, main_image_url, is_active, is_carousel_featured, status, expression_tags, size_options, color_options)
SELECT 
  id, 
  'Neuro-Sync Nootropic', 
  'neuro-sync', 
  'Cognitive enhancement stack for focus, memory, and mental clarity.', 
  1499, 
  1999, 
  'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1000&auto=format&fit=crop',
  true,
  true,
  'active',
  ARRAY['Focus', 'Brain'],
  ARRAY['60 Caps', '120 Caps'],
  ARRAY['Standard']
FROM public.categories WHERE slug = 'essentials' LIMIT 1;

INSERT INTO public.products (category_id, name, slug, description, price, original_price, main_image_url, is_active, is_carousel_featured, status, expression_tags, size_options, color_options)
SELECT 
  id, 
  'Nitro-Fuel Pre-Workout', 
  'nitro-fuel', 
  'Explosive energy and pump without the jittery crash.', 
  1899, 
  2299, 
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
  true,
  false,
  'active',
  ARRAY['Pump', 'Energy'],
  ARRAY['30 Servings'],
  ARRAY['Fruit Punch', 'Blue Razz']
FROM public.categories WHERE slug = 'energy' LIMIT 1;

-- 3. PRODUCT STOCK (Sample initial stock)
INSERT INTO public.product_stock (product_id, size, color, quantity)
SELECT id, '1kg', 'Vanilla', 100 FROM public.products WHERE slug = 'iso-byte-whey';
INSERT INTO public.product_stock (product_id, size, color, quantity)
SELECT id, '60 Caps', 'Standard', 250 FROM public.products WHERE slug = 'neuro-sync';

-- 4. LAB CONCEPTS (Future Lab)
INSERT INTO public.concepts (title, description, image_url, vote_count, vote_goal, status)
VALUES 
('Mitochondrial Boost', 'Experimental co-enzyme formula designed to optimize cellular energy production.', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop', 420, 1000, 'voting'),
('Nano-Electrolyte Strips', 'Dissolvable tongue strips for instant hydration and salt balance. No liquid needed.', 'https://images.unsplash.com/photo-1616671285430-848037f5d63f?q=80&w=1000&auto=format&fit=crop', 890, 1500, 'voting'),
('Dream-Phase Magnesium', 'Chelated magnesium blend optimized specifically for deep-sleep recovery.', 'https://images.unsplash.com/photo-1550573105-df27448d39c9?q=80&w=1000&auto=format&fit=crop', 1560, 1500, 'approved');

-- 5. ADMIN PROFILE (Ensure metadata matched)
-- This assumes the user 'rjsanjaymandal@gmail.com' has already signed up. 
-- If not, the handle_new_user trigger will handle it on first signup.
UPDATE public.profiles SET name = 'Sanjay Mandal', role = 'admin' WHERE id IN (SELECT id FROM auth.users WHERE email = 'rjsanjaymandal@gmail.com');

NOTIFY pgrst, 'reload schema';
