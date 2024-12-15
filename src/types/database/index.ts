import { EmailTemplatesTable, OutlookEmailsTable } from "./email";
import { ProfilesTable } from "./auth";
import { TasksTable } from "./tasks";
import { ConsultantsTable } from "./consultants";
import { KPIsTable } from "./metrics";
import { CallRecordsTable } from "./communication";
import { AssignmentsTable } from "./assignments";

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