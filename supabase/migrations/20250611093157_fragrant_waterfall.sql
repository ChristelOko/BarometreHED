/*
  # Fix Translation Cache RLS Policies

  1. Security Updates
    - Drop existing restrictive policies on translation_cache table
    - Add new policies that allow proper cache operations for translation functions
    - Ensure anon and authenticated users can insert/update cache entries
    - Maintain read access for expired cache cleanup

  2. Changes
    - Remove overly restrictive INSERT policy
    - Add permissive INSERT/UPDATE policies for cache operations
    - Allow service role and function context to manage cache
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Allow cache insertion for translations" ON translation_cache;
DROP POLICY IF EXISTS "Admins can manage translation cache" ON translation_cache;
DROP POLICY IF EXISTS "Anyone can read translation cache" ON translation_cache;

-- Create new permissive policies for translation cache operations
CREATE POLICY "Allow translation cache read"
  ON translation_cache
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow translation cache insert"
  ON translation_cache
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

CREATE POLICY "Allow translation cache update"
  ON translation_cache
  FOR UPDATE
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow translation cache delete"
  ON translation_cache
  FOR DELETE
  TO anon, authenticated, service_role
  USING (true);

-- Ensure the table has RLS enabled
ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;