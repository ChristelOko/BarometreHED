/*
  # Create free_access_grants table

  1. New Tables
    - `free_access_grants`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `grant_type` (text, type of grant)
      - `access_scope` (text, scope of access)
      - `specific_categories` (text array, for category-specific access)
      - `granted_by` (uuid, admin who granted access)
      - `granted_at` (timestamp)
      - `expires_at` (timestamp, nullable)
      - `is_active` (boolean)
      - `notes` (text, nullable)

  2. Security
    - Enable RLS on `free_access_grants` table
    - Add policies for admin access and user read access
*/

CREATE TABLE IF NOT EXISTS free_access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  grant_type text NOT NULL CHECK (grant_type IN ('beta_tester', 'temporary', 'permanent', 'category_specific')),
  access_scope text NOT NULL CHECK (access_scope IN ('full', 'categories_only', 'specific_category')),
  specific_categories text[],
  granted_by uuid NOT NULL REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE free_access_grants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage all free access grants"
  ON free_access_grants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can read their own free access grants"
  ON free_access_grants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_free_access_grants_user_id ON free_access_grants(user_id);
CREATE INDEX IF NOT EXISTS idx_free_access_grants_active ON free_access_grants(is_active);
CREATE INDEX IF NOT EXISTS idx_free_access_grants_expires ON free_access_grants(expires_at);
CREATE INDEX IF NOT EXISTS idx_free_access_grants_type ON free_access_grants(grant_type);