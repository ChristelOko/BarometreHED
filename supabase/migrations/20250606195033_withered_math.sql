/*
  # Create notification_settings table

  1. New Tables
    - `notification_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `enabled` (boolean, default false)
      - `morning_time` (text, default '08:00')
      - `evening_reminder` (boolean, default false)
      - `evening_time` (text, default '20:00')
      - `frequency` (text, default 'daily')
      - `custom_days` (integer array, default empty)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `notification_settings` table
    - Add policies for authenticated users to manage their own settings

  3. Constraints
    - Unique constraint on user_id (one settings record per user)
    - Check constraints for frequency, time formats
    - Simplified validation for custom_days array

  4. Indexes
    - Index on user_id for performance
    - Index on enabled for filtering

  5. Triggers
    - Auto-update updated_at timestamp on changes
*/

-- Create the notification_settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enabled boolean DEFAULT false NOT NULL,
  morning_time text DEFAULT '08:00' NOT NULL,
  evening_reminder boolean DEFAULT false NOT NULL,
  evening_time text DEFAULT '20:00' NOT NULL,
  frequency text DEFAULT 'daily' NOT NULL,
  custom_days integer[] DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add check constraints
ALTER TABLE public.notification_settings 
ADD CONSTRAINT notification_settings_frequency_check 
CHECK (frequency IN ('daily', 'weekdays', 'custom'));

ALTER TABLE public.notification_settings 
ADD CONSTRAINT notification_settings_morning_time_check 
CHECK (morning_time ~ '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');

ALTER TABLE public.notification_settings 
ADD CONSTRAINT notification_settings_evening_time_check 
CHECK (evening_time ~ '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');

-- Add simplified constraint for custom_days (just check array length)
ALTER TABLE public.notification_settings 
ADD CONSTRAINT notification_settings_custom_days_check 
CHECK (array_length(custom_days, 1) IS NULL OR array_length(custom_days, 1) <= 7);

-- Create unique constraint to ensure one settings record per user
ALTER TABLE public.notification_settings 
ADD CONSTRAINT notification_settings_user_id_unique UNIQUE (user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS notification_settings_user_id_idx 
ON public.notification_settings (user_id);

CREATE INDEX IF NOT EXISTS notification_settings_enabled_idx 
ON public.notification_settings (enabled);

-- Enable Row Level Security
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notification settings"
  ON public.notification_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification settings"
  ON public.notification_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings"
  ON public.notification_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification settings"
  ON public.notification_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_settings_updated_at();

-- Create a function to validate custom_days values (0-6 for Sunday-Saturday)
CREATE OR REPLACE FUNCTION validate_custom_days(days integer[])
RETURNS boolean AS $$
BEGIN
  -- Return true if array is null or empty
  IF days IS NULL OR array_length(days, 1) IS NULL THEN
    RETURN true;
  END IF;
  
  -- Check if all values are between 0 and 6
  FOR i IN 1..array_length(days, 1) LOOP
    IF days[i] < 0 OR days[i] > 6 THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to validate custom_days on insert/update
CREATE OR REPLACE FUNCTION check_custom_days_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT validate_custom_days(NEW.custom_days) THEN
    RAISE EXCEPTION 'custom_days must contain only values between 0 and 6 (Sunday=0, Saturday=6)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_custom_days_trigger
  BEFORE INSERT OR UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION check_custom_days_trigger();