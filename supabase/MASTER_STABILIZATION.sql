-- MASTER STABILIZATION MIGRATION
-- This script combines all missing features: Buckets, Colors, and Schema Enhancements.
-- Run this in the Supabase SQL Editor.

-- ==========================================
-- 1. STORAGE BUCKETS
-- ==========================================

-- Create the 'categories' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Create the 'products' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow Public Read Access Categories
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Read Access Categories'
    ) THEN
        CREATE POLICY "Public Read Access Categories" ON storage.objects FOR SELECT USING ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Public Read Access Products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Read Access Products'
    ) THEN
        CREATE POLICY "Public Read Access Products" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Upload Categories
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Insert Categories'
    ) THEN
        CREATE POLICY "Authenticated Insert Categories" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Upload Products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Insert Products'
    ) THEN
        CREATE POLICY "Authenticated Insert Products" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'products' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Update Categories
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Update Categories'
    ) THEN
        CREATE POLICY "Authenticated Update Categories" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Update Products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Update Products'
    ) THEN
        CREATE POLICY "Authenticated Update Products" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'products' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Delete Categories
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Delete Categories'
    ) THEN
        CREATE POLICY "Authenticated Delete Categories" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Delete Products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Delete Products'
    ) THEN
        CREATE POLICY "Authenticated Delete Products" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'products' );
    END IF;
END $$;

-- Basic Indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);


-- ==========================================
-- 2. PRODUCT COLORS TABLE & SEEDING
-- ==========================================

CREATE TABLE IF NOT EXISTS public.product_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    hex_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_colors ENABLE ROW LEVEL SECURITY;

-- Policies (Safe to run multiple times with IF NOT EXISTS logic via checking pg_policies if needed, 
-- but CREATE POLICY will error if exists. Standard practice is to ignore or drop/recreate)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only access to colors') THEN
        CREATE POLICY "Allow public read-only access to colors" ON public.product_colors FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admins to manage colors') THEN
        CREATE POLICY "Allow admins to manage colors" ON public.product_colors FOR ALL USING (EXISTS (
            SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        ));
    END IF;
END $$;

-- Seed Default Colors
INSERT INTO public.product_colors (name, hex_code)
VALUES 
    ('Black', '#000000'), ('White', '#FFFFFF'), ('Off White', '#F4F1E8'),
    ('Navy', '#000080'), ('Beige', '#E6D1B3'), ('Red', '#E31837'),
    ('Green', '#008751'), ('Blue', '#0056B3'), ('Pink', '#FFC0CB'),
    ('Grey', '#808080'), ('Silver', '#C0C0C0'), ('Gold', '#D4AF37'),
    ('Yellow', '#FFD700'), ('Purple', '#6F2DA8'), ('Maroon', '#7A1F26'),
    ('Olive', '#808000'), ('Lavender', '#C5B6E3'), ('Faded Purple', '#7B5C74')
ON CONFLICT (name) DO UPDATE SET hex_code = EXCLUDED.hex_code;


-- ==========================================
-- 3. SCHEMA ENHANCEMENTS (Inventory & SEO)
-- ==========================================

-- Enhance 'products' table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_stock integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_carousel_featured boolean DEFAULT false;

-- Sync legacy is_active to status
UPDATE public.products SET status = CASE WHEN is_active = true THEN 'active' ELSE 'draft' END WHERE status = 'draft';

-- Enhance 'product_stock' table (Variants)
ALTER TABLE public.product_stock
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0;

-- ==========================================
-- 4. INVENTORY SYNCHRONIZATION (Triggers)
-- ==========================================

-- Function to calculate and update total_stock for a product automatically
CREATE OR REPLACE FUNCTION public.sync_product_total_stock()
RETURNS TRIGGER AS $$
DECLARE
  v_product_id UUID;
  v_total INTEGER;
BEGIN
  v_product_id := CASE WHEN (TG_OP = 'DELETE') THEN OLD.product_id ELSE NEW.product_id END;
  
  SELECT COALESCE(SUM(quantity), 0) INTO v_total FROM public.product_stock WHERE product_id = v_product_id;
  UPDATE public.products SET total_stock = v_total WHERE id = v_product_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to keep total_stock updated
DROP TRIGGER IF EXISTS trg_sync_total_stock ON public.product_stock;
CREATE TRIGGER trg_sync_total_stock
  AFTER INSERT OR UPDATE OR DELETE ON public.product_stock
  FOR EACH ROW EXECUTE PROCEDURE public.sync_product_total_stock();

-- Backfill total_stock for existing data
UPDATE public.products p SET total_stock = (SELECT COALESCE(SUM(quantity), 0) FROM public.product_stock ps WHERE ps.product_id = p.id);

-- Basic Indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_product_stock_sku ON public.product_stock(sku);
CREATE INDEX IF NOT EXISTS idx_products_total_stock ON public.products(total_stock);

-- ==========================================
-- STABILIZATION COMPLETE
-- ==========================================
