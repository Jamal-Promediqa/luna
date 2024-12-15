import { Database } from './database';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Re-export all types
export type { Task } from './task';
export type { Profile } from './auth';
export type { CallRecord } from './communication';
export type { Assignment, Consultant } from './consultant';
export type { KPI } from './metrics';