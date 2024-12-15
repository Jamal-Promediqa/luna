export interface ConsultantsTable {
  Row: {
    id: string;
    name: string;
    specialty: string;
    personal_id: string;
    location: string;
    user_id: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    name: string;
    specialty: string;
    personal_id: string;
    location: string;
    user_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    name?: string;
    specialty?: string;
    personal_id?: string;
    location?: string;
    user_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}