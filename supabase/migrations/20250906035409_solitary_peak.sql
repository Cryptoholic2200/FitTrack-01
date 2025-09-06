/*
  # Create activities table

  1. New Tables
    - `activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `type` (text, activity type like run, ride, swim, etc.)
      - `title` (text, activity title)
      - `description` (text, optional description)
      - `distance` (numeric, distance in km)
      - `duration` (interval, duration of activity)
      - `elevation_gain` (integer, elevation gain in meters)
      - `calories_burned` (integer, estimated calories)
      - `average_heart_rate` (integer, optional)
      - `max_heart_rate` (integer, optional)
      - `route_data` (jsonb, optional GPS/route data)
      - `weather_conditions` (jsonb, optional weather data)
      - `privacy_level` (text, public/private/followers)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `activities` table
    - Add policies for users to manage their own activities
    - Add policy for public activities to be viewable by others
*/

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

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Users can read their own activities
CREATE POLICY "Users can read own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own activities
CREATE POLICY "Users can insert own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own activities
CREATE POLICY "Users can update own activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own activities
CREATE POLICY "Users can delete own activities"
  ON activities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Public activities are viewable by authenticated users
CREATE POLICY "Public activities are viewable"
  ON activities
  FOR SELECT
  TO authenticated
  USING (privacy_level = 'public');

-- Create updated_at trigger
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
CREATE INDEX IF NOT EXISTS activities_type_idx ON activities(type);
CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS activities_privacy_level_idx ON activities(privacy_level);