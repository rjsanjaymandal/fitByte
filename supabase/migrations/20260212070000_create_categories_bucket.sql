-- Create the 'categories' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Policies (RLS is usually already enabled on storage.objects by default)

-- Policy: Allow Public Read Access
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Read Access Categories'
    ) THEN
        CREATE POLICY "Public Read Access Categories"
        ON storage.objects FOR SELECT
        USING ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Upload (Insert)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Insert Categories'
    ) THEN
        CREATE POLICY "Authenticated Insert Categories"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Update
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Update Categories'
    ) THEN
        CREATE POLICY "Authenticated Update Categories"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING ( bucket_id = 'categories' );
    END IF;
END $$;

-- Policy: Allow Authenticated Users to Delete
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Authenticated Delete Categories'
    ) THEN
        CREATE POLICY "Authenticated Delete Categories"
        ON storage.objects FOR DELETE
        TO authenticated
        USING ( bucket_id = 'categories' );
    END IF;
END $$;
