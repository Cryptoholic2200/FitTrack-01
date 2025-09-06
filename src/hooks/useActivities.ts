import { useState, useEffect } from 'react';
import { activities } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '../lib/database.types';

type Activity = Database['public']['Tables']['activities']['Row'];
type ActivityInsert = Database['public']['Tables']['activities']['Insert'];
type ActivityUpdate = Database['public']['Tables']['activities']['Update'];

export function useActivities() {
  const { user } = useAuth();
  const [userActivities, setUserActivities] = useState<Activity[]>([]);
  const [publicActivities, setPublicActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserActivities();
    }
    loadPublicActivities();
  }, [user]);

  const loadUserActivities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await activities.getUserActivities(user.id);
      
      if (error) {
        setError(error.message);
      } else {
        setUserActivities(data || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const loadPublicActivities = async () => {
    try {
      const { data, error } = await activities.getPublicActivities();
      
      if (error) {
        setError(error.message);
      } else {
        setPublicActivities(data || []);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load public activities');
    }
  };

  const createActivity = async (activityData: Omit<ActivityInsert, 'user_id'>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await activities.create({
        ...activityData,
        user_id: user.id
      });
      
      if (error) {
        setError(error.message);
        return { error: error.message };
      } else {
        // Refresh activities after creating
        await loadUserActivities();
        await loadPublicActivities();
        setError(null);
        return { data };
      }
    } catch (err) {
      const errorMessage = 'Failed to create activity';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const updateActivity = async (id: string, updates: ActivityUpdate) => {
    try {
      const { data, error } = await activities.update(id, updates);
      
      if (error) {
        setError(error.message);
        return { error: error.message };
      } else {
        // Refresh activities after updating
        await loadUserActivities();
        await loadPublicActivities();
        setError(null);
        return { data };
      }
    } catch (err) {
      const errorMessage = 'Failed to update activity';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await activities.delete(id);
      
      if (error) {
        setError(error.message);
        return { error: error.message };
      } else {
        // Refresh activities after deleting
        await loadUserActivities();
        await loadPublicActivities();
        setError(null);
        return { success: true };
      }
    } catch (err) {
      const errorMessage = 'Failed to delete activity';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  return {
    userActivities,
    publicActivities,
    loading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: () => {
      loadUserActivities();
      loadPublicActivities();
    }
  };
}