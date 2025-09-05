import { useState, useEffect } from 'react';
import { profiles } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await profiles.get(user.id);
      
      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileUpdate>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await profiles.update(user.id, updates);
      
      if (error) {
        setError(error.message);
        return { error: error.message };
      } else {
        setProfile(data);
        setError(null);
        return { data };
      }
    } catch (err) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: loadProfile
  };
}