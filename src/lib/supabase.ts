import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: { first_name: string; last_name: string }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Profile helpers
export const profiles = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  update: async (userId: string, updates: Partial<Database['public']['Tables']['user_profiles']['Update']>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    return { data, error };
  },

  getPublicProfiles: async (limit = 10) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, display_name, avatar_url, location, bio, fitness_level')
      .eq('privacy_settings->profile_visibility', 'public')
      .limit(limit);
    
    return { data, error };
  }
};

// Activity helpers
export const activities = {
  create: async (activity: Database['public']['Tables']['activities']['Insert']) => {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single();
    
    return { data, error };
  },

  getUserActivities: async (userId: string, limit = 10) => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  getPublicActivities: async (limit = 20) => {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        user_profiles!activities_user_id_fkey (
          display_name,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('privacy_level', 'public')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data, error };
  },

  update: async (id: string, updates: Database['public']['Tables']['activities']['Update']) => {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  delete: async (id: string) => {
    const { data, error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);
    
    return { data, error };
  }
};