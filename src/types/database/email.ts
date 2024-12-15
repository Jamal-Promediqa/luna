export interface EmailTemplatesTable {
  Row: {
    id: string;
    user_id: string | null;
    name: string;
    subject: string | null;
    content: string;
    variables: Record<string, any> | null;
    category: string | null;
    usage_count: number | null;
    last_used_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    name: string;
    subject?: string | null;
    content: string;
    variables?: Record<string, any> | null;
    category?: string | null;
    usage_count?: number | null;
    last_used_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    name?: string;
    subject?: string | null;
    content?: string;
    variables?: Record<string, any> | null;
    category?: string | null;
    usage_count?: number | null;
    last_used_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}

export interface OutlookEmailsTable {
  Row: {
    id: string;
    user_id: string | null;
    message_id: string;
    subject: string | null;
    body_preview: string | null;
    from_address: string | null;
    is_read: boolean | null;
    is_starred: boolean | null;
    received_at: string | null;
    status: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    user_id?: string | null;
    message_id: string;
    subject?: string | null;
    body_preview?: string | null;
    from_address?: string | null;
    is_read?: boolean | null;
    is_starred?: boolean | null;
    received_at?: string | null;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    user_id?: string | null;
    message_id?: string;
    subject?: string | null;
    body_preview?: string | null;
    from_address?: string | null;
    is_read?: boolean | null;
    is_starred?: boolean | null;
    received_at?: string | null;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
}