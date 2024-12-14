export interface Database {
  public: {
    Tables: {
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
      profiles: {
        Row: {
          id: string;
          user_id: string | null;
          given_name: string | null;
          full_name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          given_name?: string | null;
          full_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          given_name?: string | null;
          full_name?: string | null;
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
          received_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          subject?: string | null;
          body_preview?: string | null;
          from_address?: string | null;
          is_read?: boolean | null;
          received_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          subject?: string | null;
          body_preview?: string | null;
          from_address?: string | null;
          is_read?: boolean | null;
          received_at?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
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