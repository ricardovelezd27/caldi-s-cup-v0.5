
-- Make coffee-scans bucket public
UPDATE storage.buckets SET public = true WHERE id = 'coffee-scans';

-- Drop restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own coffee scans" ON storage.objects;

-- Add public SELECT policy
CREATE POLICY "Public read access for coffee scans"
ON storage.objects FOR SELECT
USING (bucket_id = 'coffee-scans');
