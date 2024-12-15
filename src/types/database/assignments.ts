export interface AssignmentsTable {
  Row: {
    id: string;
    consultant_name: string;
    status: string;
    user_id: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    consultant_name: string;
    status?: string;
    user_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    consultant_name?: string;
    status?: string;
    user_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}