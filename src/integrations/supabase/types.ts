export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_high_pay: boolean | null
          is_long_term: boolean | null
          location: string
          period: string
          rating: number | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_high_pay?: boolean | null
          is_long_term?: boolean | null
          location: string
          period: string
          rating?: number | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_high_pay?: boolean | null
          is_long_term?: boolean | null
          location?: string
          period?: string
          rating?: number | null
          title?: string
        }
        Relationships: []
      }
      background_check_requests: {
        Row: {
          check_type: string
          consultant_id: string | null
          email_content: string | null
          email_sent: boolean | null
          id: string
          notes: string | null
          request_date: string | null
          response_date: string | null
          status: string
        }
        Insert: {
          check_type: string
          consultant_id?: string | null
          email_content?: string | null
          email_sent?: boolean | null
          id?: string
          notes?: string | null
          request_date?: string | null
          response_date?: string | null
          status?: string
        }
        Update: {
          check_type?: string
          consultant_id?: string | null
          email_content?: string | null
          email_sent?: boolean | null
          id?: string
          notes?: string | null
          request_date?: string | null
          response_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "background_check_requests_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          availability_schedule: Json | null
          created_at: string
          email: string
          id: string
          image_url: string | null
          location: string
          name: string
          personal_id: string | null
          phone: string
          specialty: string
          status: string
          systems: string[] | null
          updated_at: string
        }
        Insert: {
          availability_schedule?: Json | null
          created_at?: string
          email: string
          id?: string
          image_url?: string | null
          location: string
          name: string
          personal_id?: string | null
          phone: string
          specialty: string
          status?: string
          systems?: string[] | null
          updated_at?: string
        }
        Update: {
          availability_schedule?: Json | null
          created_at?: string
          email?: string
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          personal_id?: string | null
          phone?: string
          specialty?: string
          status?: string
          systems?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_message: string | null
          personal_number: string | null
          staff_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          personal_number?: string | null
          staff_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          personal_number?: string | null
          staff_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_personal_number_fkey"
            columns: ["personal_number"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["personal_number"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          is_from_user: boolean
          personal_number: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_from_user: boolean
          personal_number: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_from_user?: boolean
          personal_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_personal_number_fkey"
            columns: ["personal_number"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["personal_number"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          given_name: string
          id: string
          personal_number: string
          phone: string | null
          reference1_name: string | null
          reference1_phone: string | null
          reference2_name: string | null
          reference2_phone: string | null
          surname: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          full_name: string
          given_name: string
          id?: string
          personal_number: string
          phone?: string | null
          reference1_name?: string | null
          reference1_phone?: string | null
          reference2_name?: string | null
          reference2_phone?: string | null
          surname: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          given_name?: string
          id?: string
          personal_number?: string
          phone?: string | null
          reference1_name?: string | null
          reference1_phone?: string | null
          reference2_name?: string | null
          reference2_phone?: string | null
          surname?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          due_date: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          id: string
          personal_number: string | null
          uploaded_at: string | null
          verified: boolean | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          id?: string
          personal_number?: string | null
          uploaded_at?: string | null
          verified?: boolean | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          id?: string
          personal_number?: string | null
          uploaded_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_personal_number_fkey"
            columns: ["personal_number"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["personal_number"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
