export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          display_name: string | null
          bio: string | null
          location: string | null
          avatar_url: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height: number | null
          weight: number | null
          fitness_level: 'beginner' | 'intermediate' | 'advanced' | 'elite' | null
          goals: string[] | null
          privacy_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          display_name?: string | null
          bio?: string | null
          location?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height?: number | null
          weight?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | 'elite' | null
          goals?: string[] | null
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          display_name?: string | null
          bio?: string | null
          location?: string | null
          avatar_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          height?: number | null
          weight?: number | null
          fitness_level?: 'beginner' | 'intermediate' | 'advanced' | 'elite' | null
          goals?: string[] | null
          privacy_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}