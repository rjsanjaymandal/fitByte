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

-- Policy: Allow Public Read Access
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Read Access Categories'
    ) THEN
        CREATE POLICY "Public Read Access Categories" ON storage.objects FOR SELECT USING ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Upload (Insert)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Insert Categories'
    ) THEN
        CREATE POLICY "Authenticated Insert Categories" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Update
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Update Categories'
    ) THEN
        CREATE POLICY "Authenticated Update Categories" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Delete
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated Delete Categories'
    ) THEN
        CREATE POLICY "Authenticated Delete Categories" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'categories' );
    END IF;
END $$;


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
ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0;

-- Sync legacy is_active to status
UPDATE public.products SET status = CASE WHEN is_active = true THEN 'active' ELSE 'draft' END WHERE status = 'draft';

-- Enhance 'product_stock' table (Variants)
ALTER TABLE public.product_stock
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0;

-- Basic Indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_product_stock_sku ON public.product_stock(sku);

-- ==========================================
-- STABILIZATION COMPLETE
-- ==========================================
