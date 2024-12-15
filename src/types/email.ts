import { Database } from './database';

export type EmailTemplate = Database['public']['Tables']['email_templates']['Row'];
export type EmailTemplateInsert = Database['public']['Tables']['email_templates']['Insert'];
export type EmailTemplateUpdate = Database['public']['Tables']['email_templates']['Update'];

export type OutlookEmail = Database['public']['Tables']['outlook_emails']['Row'];
export type OutlookEmailInsert = Database['public']['Tables']['outlook_emails']['Insert'];
export type OutlookEmailUpdate = Database['public']['Tables']['outlook_emails']['Update'];