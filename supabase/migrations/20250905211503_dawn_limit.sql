/*
  # User Profiles Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `display_name` (text)
      - `bio` (text, optional)
      - `location` (text, optional)
      - `avatar_url` (text, optional)
      - `date_of_birth` (date, optional)
      - `gender` (text, optional)
      - `height` (integer, in cm, optional)
      - `weight` (decimal, in kg, optional)
      - `fitness_level` (text, optional)
      - `goals` (text array, optional)
      - `privacy_settings` (jsonb, default public settings)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to manage their own profiles
    - Add policy for public profile viewing based on privacy settings
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  display_name text,
  bio text,
  location text,
  avatar_url text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height integer, -- in centimeters
  weight decimal(5,2), -- in kilograms
  fitness_level text CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  goals text[],
  privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "activity_visibility": "public", "stats_visibility": "public"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy for public profile viewing (respects privacy settings)
CREATE POLICY "Public profiles are viewable"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    privacy_settings->>'profile_visibility' = 'public' OR
    auth.uid() = id
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'first_name', 'User') || ' ' || COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();