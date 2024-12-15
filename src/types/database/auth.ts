import { Json } from "@/integrations/supabase/types";

export interface ProfilesTable {
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
}