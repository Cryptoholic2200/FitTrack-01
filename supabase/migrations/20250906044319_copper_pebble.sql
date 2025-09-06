@@ .. @@
 -- User profiles policies
-CREATE POLICY "Users can read own profile" ON user_profiles
+DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
+CREATE POLICY "Users can read own profile" ON user_profiles
   FOR SELECT TO authenticated
   USING (auth.uid() = id);
 
-CREATE POLICY "Users can update own profile" ON user_profiles
+DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
+CREATE POLICY "Users can update own profile" ON user_profiles
   FOR UPDATE TO authenticated
   USING (auth.uid() = id)
   WITH CHECK (auth.uid() = id);
 
-CREATE POLICY "Users can insert own profile" ON user_profiles
+DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
+CREATE POLICY "Users can insert own profile" ON user_profiles
   FOR INSERT TO authenticated
   WITH CHECK (auth.uid() = id);
 
-CREATE POLICY "Public profiles are viewable" ON user_profiles
+DROP POLICY IF EXISTS "Public profiles are viewable" ON user_profiles;
+CREATE POLICY "Public profiles are viewable" ON user_profiles
   FOR SELECT TO authenticated
   USING (privacy_settings->>'profile_visibility' = 'public');
 
@@ .. @@
 -- Activities policies
-CREATE POLICY "Users can read own activities" ON activities
+DROP POLICY IF EXISTS "Users can read own activities" ON activities;
+CREATE POLICY "Users can read own activities" ON activities
   FOR SELECT TO authenticated
   USING (auth.uid() = user_id);
 
-CREATE POLICY "Users can insert own activities" ON activities
+DROP POLICY IF EXISTS "Users can insert own activities" ON activities;
+CREATE POLICY "Users can insert own activities" ON activities
   FOR INSERT TO authenticated
   WITH CHECK (auth.uid() = user_id);
 
-CREATE POLICY "Users can update own activities" ON activities
+DROP POLICY IF EXISTS "Users can update own activities" ON activities;
+CREATE POLICY "Users can update own activities" ON activities
   FOR UPDATE TO authenticated
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id);
 
-CREATE POLICY "Users can delete own activities" ON activities
+DROP POLICY IF EXISTS "Users can delete own activities" ON activities;
+CREATE POLICY "Users can delete own activities" ON activities
   FOR DELETE TO authenticated
   USING (auth.uid() = user_id);
 
-CREATE POLICY "Public activities are viewable" ON activities
+DROP POLICY IF EXISTS "Public activities are viewable" ON activities;
+CREATE POLICY "Public activities are viewable" ON activities
   FOR SELECT TO authenticated
   USING (privacy_level = 'public');