-- Simple Database Setup for FitTrack
-- Run this script in your Supabase SQL Editor

-- Step 1: Create the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 2: Create user_profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  display_name text,
  bio text,
  location text,
  avatar_url text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height integer,
  weight decimal(5,2),
  fitness_level text CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  goals text[],
  privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "activity_visibility": "public", "stats_visibility": "public"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Create activities table (this is the missing table causing the error)
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

-- Step 4: Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies (drop existing ones first to avoid conflicts)
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Public profiles are viewable" ON user_profiles;
    
    DROP POLICY IF EXISTS "Users can read own activities" ON activities;
    DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
    DROP POLICY IF EXISTS "Users can update own activities" ON activities;
    DROP POLICY IF EXISTS "Users can delete own activities" ON activities;
    DROP POLICY IF EXISTS "Public activities are viewable" ON activities;
END $$;

-- Create user_profiles policies
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

-- Create activities policies
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

-- Step 6: Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
CREATE INDEX IF NOT EXISTS activities_type_idx ON activities(type);
CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS activities_privacy_level_idx ON activities(privacy_level);

-- Step 8: Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();