export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string | null;
          given_name: string | null;
          full_name: string | null;
          notification_preferences: {
            email: boolean;
            inApp: boolean;
            schedule: string;
          } | null;
          theme_preferences: {
            darkMode: boolean;
            uiDensity: string;
            colorScheme: string;
          } | null;
          regional_preferences: {
            language: string;
            timezone: string;
            dateFormat: string;
          } | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          given_name?: string | null;
          full_name?: string | null;
          notification_preferences?: {
            email: boolean;
            inApp: boolean;
            schedule: string;
          } | null;
          theme_preferences?: {
            darkMode: boolean;
            uiDensity: string;
            colorScheme: string;
          } | null;
          regional_preferences?: {
            language: string;
            timezone: string;
            dateFormat: string;
          } | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          given_name?: string | null;
          full_name?: string | null;
          notification_preferences?: {
            email: boolean;
            inApp: boolean;
            schedule: string;
          } | null;
          theme_preferences?: {
            darkMode: boolean;
            uiDensity: string;
            colorScheme: string;
          } | null;
          regional_preferences?: {
            language: string;
            timezone: string;
            dateFormat: string;
          } | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: string;
          due_date: string | null;
          assigned_to: string | null;
          user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: string;
          due_date?: string | null;
          assigned_to?: string | null;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          due_date?: string | null;
          assigned_to?: string | null;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      kpis: {
        Row: {
          id: string;
          user_id: string | null;
          presented_consultants: number | null;
          booked_weeks: number | null;
          call_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          presented_consultants?: number | null;
          booked_weeks?: number | null;
          call_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          presented_consultants?: number | null;
          booked_weeks?: number | null;
          call_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      outlook_emails: {
        Row: {
          id: string;
          user_id: string | null;
          subject: string | null;
          body_preview: string | null;
          from_address: string | null;
          is_read: boolean | null;
          is_starred: boolean | null;
          received_at: string | null;
          created_at: string | null;
          updated_at: string | null;
          status: string | null;
          message_id: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          subject?: string | null;
          body_preview?: string | null;
          from_address?: string | null;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          received_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          status?: string | null;
          message_id: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          subject?: string | null;
          body_preview?: string | null;
          from_address?: string | null;
          is_read?: boolean | null;
          is_starred?: boolean | null;
          received_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          status?: string | null;
          message_id?: string;
        };
      };
      call_records: {
        Row: {
          id: string;
          user_id: string | null;
          contact_name: string;
          contact_phone: string;
          audio_url: string | null;
          summary: string | null;
          action_plan: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          contact_name: string;
          contact_phone: string;
          audio_url?: string | null;
          summary?: string | null;
          action_plan?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          contact_name?: string;
          contact_phone?: string;
          audio_url?: string | null;
          summary?: string | null;
          action_plan?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      assignments: {
        Row: {
          id: string;
          consultant_name: string;
          status: string;
          user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          consultant_name: string;
          status?: string;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          consultant_name?: string;
          status?: string;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      consultants: {
        Row: {
          id: string;
          name: string;
          specialty: string;
          personal_id: string;
          location: string;
          user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          specialty: string;
          personal_id: string;
          location: string;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          specialty?: string;
          personal_id?: string;
          location?: string;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

// Export specific types for better reusability
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Export preference-specific types
export type NotificationPreferences = NonNullable<Profile['notification_preferences']>;
export type ThemePreferences = NonNullable<Profile['theme_preferences']>;
export type RegionalPreferences = NonNullable<Profile['regional_preferences']>;
