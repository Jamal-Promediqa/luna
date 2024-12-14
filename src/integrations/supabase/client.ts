import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = 'https://wxdtjeprsqttdxadfxlv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4ZHRqZXByc3F0dGR4YWRmeGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxNzcyMjYsImV4cCI6MjA0OTc1MzIyNn0.c6kqExvssI6m2II3cWd4FiL47TshWEOPOnZ2DbiQc_Q';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);