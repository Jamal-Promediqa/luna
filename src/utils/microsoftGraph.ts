import { Client } from "@microsoft/microsoft-graph-client";
import { supabase } from "@/integrations/supabase/client";

export interface OutlookEmail {
  id: string;
  subject: string | null;
  bodyPreview: string | null;
  from: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
  isRead: boolean;
  receivedDateTime: string;
}

export const initializeGraphClient = async (accessToken: string) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};

export const fetchEmails = async (accessToken: string) => {
  try {
    const client = await initializeGraphClient(accessToken);
    
    const response = await client
      .api('/me/messages')
      .select('id,subject,bodyPreview,from,isRead,receivedDateTime')
      .top(50)
      .orderby('receivedDateTime desc')
      .get();

    return response.value as OutlookEmail[];
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

export const syncEmailsToSupabase = async (userId: string, emails: OutlookEmail[]) => {
  try {
    const { error } = await supabase.from('outlook_emails').upsert(
      emails.map(email => ({
        user_id: userId,
        message_id: email.id,
        subject: email.subject,
        body_preview: email.bodyPreview,
        from_address: email.from.emailAddress.address,
        is_read: email.isRead,
        received_at: email.receivedDateTime,
      })),
      { onConflict: 'message_id' }
    );

    if (error) throw error;
  } catch (error) {
    console.error('Error syncing emails:', error);
    throw error;
  }
};