import { Client } from "@microsoft/microsoft-graph-client";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const initializeGraphClient = (accessToken: string) => {
  if (!accessToken) {
    throw new Error("No access token provided");
  }
  
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};

export const fetchEmails = async (accessToken: string) => {
  try {
    console.log("Fetching emails with access token:", accessToken ? "Present" : "Missing");
    const client = initializeGraphClient(accessToken);
    
    const response = await client
      .api('/me/messages')
      .select('id,subject,bodyPreview,from,isRead,receivedDateTime')
      .top(50)
      .orderby('receivedDateTime desc')
      .get();

    console.log("Fetched emails count:", response.value?.length || 0);
    return response.value as OutlookEmail[];
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
};

export const syncEmailsToSupabase = async (userId: string, emails: OutlookEmail[]) => {
  try {
    console.log("Syncing emails to Supabase for user:", userId);
    console.log("Emails to sync:", emails.length);

    const { error } = await supabase.from('outlook_emails').upsert(
      emails.map(email => ({
        user_id: userId,
        message_id: email.id,
        subject: email.subject,
        body_preview: email.bodyPreview,
        from_address: email.from.emailAddress.address,
        is_read: email.isRead,
        received_at: email.receivedDateTime,
        is_starred: false, // Default value for new emails
      })),
      { 
        onConflict: 'message_id',
        ignoreDuplicates: false
      }
    );

    if (error) {
      console.error('Error syncing emails:', error);
      throw error;
    }

    console.log("Emails synced successfully");
  } catch (error) {
    console.error('Error in syncEmailsToSupabase:', error);
    throw error;
  }
};