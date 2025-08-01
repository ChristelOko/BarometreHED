/*
  # Fix translation cache RLS policy

  1. Security Changes
    - Add INSERT policy for translation_cache table to allow caching translations
    - Allow both authenticated and anon users to insert cache entries
    - This enables the translation service to properly cache translations

  The current policy only allows reading from cache but not writing to it,
  which causes RLS violations when the translation service tries to cache new translations.
*/

-- Add INSERT policy for translation_cache table
CREATE POLICY "Allow cache insertion for translations"
  ON translation_cache
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);