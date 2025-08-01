/*
  # Initial Schema Setup

  1. New Tables
    - `knowledge_base`: Stores HD knowledge and guidance
      - `id` (uuid, primary key)
      - `category` (text)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamp)
      
    - `results`: Stores detailed scan results
      - `id` (uuid, primary key)
      - `scan_id` (uuid, references scans)
      - `guidance` (text)
      - `mantra` (jsonb)
      - `realignment_exercise` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  guidance text NOT NULL,
  mantra jsonb NOT NULL,
  realignment_exercise text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge_base
CREATE POLICY "Anyone can read knowledge base"
  ON knowledge_base
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for results
CREATE POLICY "Users can read own results"
  ON results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = results.scan_id
      AND scans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own results"
  ON results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = results.scan_id
      AND scans.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX knowledge_base_category_idx ON knowledge_base(category);
CREATE INDEX results_scan_id_idx ON results(scan_id);