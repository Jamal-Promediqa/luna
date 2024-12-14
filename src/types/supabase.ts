import { Database } from './database';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience types
export type Task = Tables<'tasks'>;
export type Profile = Tables<'profiles'>;
export type OutlookEmail = Tables<'outlook_emails'>;
export type CallRecord = Tables<'call_records'>;
export type Assignment = Tables<'assignments'>;
export type Consultant = Tables<'consultants'>;