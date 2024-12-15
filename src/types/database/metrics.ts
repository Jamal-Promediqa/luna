export interface KPIsTable {
  Row: {
    id: string;
    user_id: string | null;
    presented_consultants: number | null;
    booked_weeks: number | null;
    call_count: number | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    presented_consultants?: number | null;
    booked_weeks?: number | null;
    call_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    presented_consultants?: number | null;
    booked_weeks?: number | null;
    call_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}