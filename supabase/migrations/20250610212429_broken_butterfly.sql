/*
  # Add app_settings to settings table
  
  1. Changes
    - Insert default app settings into settings table
    - Settings include premium page visibility and language options
  
  2. Security
    - Settings are public for all users to read
*/

-- Insert default app settings
INSERT INTO settings (key, value, description, category, is_public)
VALUES (
  'app_settings',
  jsonb_build_object(
    'showPremiumPage', true,
    'enabledLanguages', array['fr', 'en', 'ind'],
    'defaultLanguage', 'fr',
    'freeRegistration', true
  ),
  'Application global settings',
  'general',
  true
)
ON CONFLICT (key) DO UPDATE
SET 
  value = EXCLUDED.value,
  updated_at = now();