import { Database } from './database';

export type Profile = {
  id: string;
  user_id: string | null;
  given_name: string | null;
  full_name: string | null;
  created_at: string | null;
  updated_at: string | null;
};