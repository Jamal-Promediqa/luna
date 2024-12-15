export interface CallRecordsTable {
  Row: {
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
  Insert: {
    id?: string;
    user_id?: string | null;
    contact_name: string;
    contact_phone: string;
    audio_url?: string | null;
    summary?: string | null;
    action_plan?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    contact_name?: string;
    contact_phone?: string;
    audio_url?: string | null;
    summary?: string | null;
    action_plan?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}