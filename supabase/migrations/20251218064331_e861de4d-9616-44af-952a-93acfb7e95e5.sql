-- Fix STORAGE_EXPOSURE: Make coffee-scans bucket private and update policies

-- Update bucket to be private
UPDATE storage.buckets SET public = false WHERE id = 'coffee-scans';

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view coffee scan images" ON storage.objects;

-- Create authenticated-only SELECT policy (users can view their own scans)
CREATE POLICY "Users can view own coffee scans" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'coffee-scans' AND auth.uid()::text = (storage.foldername(name))[1]);