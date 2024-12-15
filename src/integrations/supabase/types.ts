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
      email_templates: {
        Row: {
          id: string
          user_id: string | null
          name: string
          subject: string | null
          content: string
          variables: Json | null
          category: string | null
          usage_count: number | null
          last_used_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          subject?: string | null
          content: string
          variables?: Json | null
          category?: string | null
          usage_count?: number | null
          last_used_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          subject?: string | null
          content?: string
          variables?: Json | null
          category?: string | null
          usage_count?: number | null
          last_used_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      assignments: {
        Row: {
          consultant_name: string
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          consultant_name: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          consultant_name?: string
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      call_records: {
        Row: {
          action_plan: string | null
          audio_url: string | null
          contact_name: string
          contact_phone: string
          created_at: string | null
          id: string
          summary: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_plan?: string | null
          audio_url?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string | null
          id?: string
          summary?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_plan?: string | null
          audio_url?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          id?: string
          summary?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      consultants: {
        Row: {
          created_at: string | null
          id: string
          location: string
          name: string
          personal_id: string
          specialty: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location: string
          name: string
          personal_id: string
          specialty: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          personal_id?: string
          specialty?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      kpis: {
        Row: {
          booked_weeks: number | null
          call_count: number | null
          created_at: string | null
          id: string
          presented_consultants: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booked_weeks?: number | null
          call_count?: number | null
          created_at?: string | null
          id?: string
          presented_consultants?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booked_weeks?: number | null
          call_count?: number | null
          created_at?: string | null
          id?: string
          presented_consultants?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      outlook_emails: {
        Row: {
          body_preview: string | null
          created_at: string | null
          from_address: string | null
          id: string
          is_read: boolean | null
          is_starred: boolean | null
          message_id: string
          received_at: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          body_preview?: string | null
          created_at?: string | null
          from_address?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          message_id: string
          received_at?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          body_preview?: string | null
          created_at?: string | null
          from_address?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          message_id?: string
          received_at?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          given_name: string | null
          id: string
          notification_preferences: Json | null
          regional_preferences: Json | null
          theme_preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          given_name?: string | null
          id: string
          notification_preferences?: Json | null
          regional_preferences?: Json | null
          theme_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          given_name?: string | null
          id?: string
          notification_preferences?: Json | null
          regional_preferences?: Json | null
          theme_preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
