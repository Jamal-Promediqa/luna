import { Database } from './database';

export type Assignment = {
  id: string;
  consultant_name: string;
  status: string;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Consultant = {
  id: string;
  name: string;
  specialty: string;
  personal_id: string;
  location: string;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  // UI-specific fields that aren't in the database
  email: string;
  phone: string;
  status: string;
  image: string;
};