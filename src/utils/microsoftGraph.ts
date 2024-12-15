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
    console.error("No access token provided to initialize Graph client");
    throw new Error("No access token provided");
  }
  
  console.log("Initializing Microsoft Graph client with token:", accessToken.substring(0, 10) + "...");
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};

export const fetchEmails = async (accessToken: string) => {
  try {
    console.log("Starting email fetch from Microsoft Graph API");
    const client = initializeGraphClient(accessToken);
    
    console.log("Making API request to /me/messages");
    const response = await client
      .api('/me/messages')
      .select('id,subject,bodyPreview,from,isRead,receivedDateTime')
      .top(50)
      .orderby('receivedDateTime desc')
      .get();

    console.log("Successfully fetched emails:", response.value?.length || 0);
    console.log("Sample email data:", response.value?.[0] ? JSON.stringify(response.value[0], null, 2) : "No emails found");
    return response.value as OutlookEmail[];
  } catch (error) {
    console.error('Error fetching emails from Microsoft Graph:', error);
    console.log('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });
    throw error;
  }
};

export const syncEmailsToSupabase = async (userId: string, emails: OutlookEmail[]) => {
  try {
    console.log("Starting email sync to Supabase for user:", userId);
    console.log("Emails to sync:", emails.length);

    const emailsToSync = emails.map(email => ({
      user_id: userId,
      message_id: email.id,
      subject: email.subject,
      body_preview: email.bodyPreview,
      from_address: email.from.emailAddress.address,
      is_read: email.isRead,
      received_at: email.receivedDateTime,
      is_starred: false,
    }));

    console.log("First email to sync:", JSON.stringify(emailsToSync[0], null, 2));

    // Using ON CONFLICT with the new unique constraint
    const { error } = await supabase.from('outlook_emails').upsert(
      emailsToSync,
      { 
        onConflict: 'message_id,user_id',
        ignoreDuplicates: false
      }
    );

    if (error) {
      console.error('Error syncing emails to Supabase:', error);
      console.log('Error details:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
      });
      throw error;
    }

    console.log("Successfully synced emails to Supabase");
  } catch (error) {
    console.error('Error in syncEmailsToSupabase:', error);
    console.log('Full error object:', JSON.stringify(error, null, 2));
    throw error;
  }
};