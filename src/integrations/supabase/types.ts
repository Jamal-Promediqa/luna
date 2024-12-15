import { Database } from '../types/database';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Re-export specific types
export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  NotificationPreferences,
  ThemePreferences,
  RegionalPreferences
} from '../types/database';