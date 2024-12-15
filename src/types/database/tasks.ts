export interface TasksTable {
  Row: {
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
  Insert: {
    id?: string;
    title: string;
    description?: string | null;
    status?: string;
    due_date?: string | null;
    assigned_to?: string | null;
    user_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    title?: string;
    description?: string | null;
    status?: string;
    due_date?: string | null;
    assigned_to?: string | null;
    user_id?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}