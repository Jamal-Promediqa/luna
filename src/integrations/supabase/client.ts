import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://wxdtjeprsqttdxadfxlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZHRqZXByc3F0dGR4YWRmeGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTU1NzAsImV4cCI6MjAyMzA3MTU3MH0.qgDqGMwXcpb-Zs_qOXwwRuGEEzZo_BAOedLhGBXqxXE';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);