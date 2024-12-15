import { ProfilesTable } from "./auth";
import { EmailTemplatesTable, OutlookEmailsTable } from "./email";
import { TasksTable } from "./tasks";
import { ConsultantsTable } from "./consultants";
import { KPIsTable } from "./metrics";
import { CallRecordsTable } from "./communication";
import { AssignmentsTable } from "./assignments";
import { Json } from "@/integrations/supabase/types";

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable;
      email_templates: EmailTemplatesTable;
      outlook_emails: OutlookEmailsTable;
      tasks: TasksTable;
      consultants: ConsultantsTable;
      kpis: KPIsTable;
      call_records: CallRecordsTable;
      assignments: AssignmentsTable;
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];