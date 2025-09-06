-- Complete Database Setup for Fitness Tracker
-- Run this entire script in your Supabase SQL Editor

-- First, create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  display_name text,
  avatar_url text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  location text,
  bio text,
  fitness_level text DEFAULT 'beginner' CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  preferred_units text DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
  privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "activity_visibility": "public", "stats_visibility": "public"}'::jsonb,
  notification_preferences jsonb DEFAULT '{"email_notifications": true, "push_notifications": true, "weekly_summary": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable" ON user_profiles
  FOR SELECT TO authenticated
  USING (privacy_settings->>'profile_visibility' = 'public');

-- Create updated_at trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('run', 'ride', 'swim', 'walk', 'hike', 'workout', 'yoga', 'crossfit', 'other')),
  title text NOT NULL,
  description text,
  distance numeric(8,2) DEFAULT 0,
  duration interval NOT NULL,
  elevation_gain integer DEFAULT 0,
  calories_burned integer,
  average_heart_rate integer,
  max_heart_rate integer,
  route_data jsonb,
  weather_conditions jsonb,
  privacy_level text DEFAULT 'public' CHECK (privacy_level IN ('public', 'private', 'followers')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Activities policies
CREATE POLICY "Users can read own activities" ON activities
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON activities
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" ON activities
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities" ON activities
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public activities are viewable" ON activities
  FOR SELECT TO authenticated
  USING (privacy_level = 'public');

-- Create updated_at trigger for activities
DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
CREATE INDEX IF NOT EXISTS activities_type_idx ON activities(type);
CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS activities_privacy_level_idx ON activities(privacy_level);

-- Create a function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();