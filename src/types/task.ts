import { Database } from './database';

export type Task = {
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