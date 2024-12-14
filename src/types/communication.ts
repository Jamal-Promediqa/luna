import { Database } from './database';

export type OutlookEmail = {
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

export type CallRecord = {
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