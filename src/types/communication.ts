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