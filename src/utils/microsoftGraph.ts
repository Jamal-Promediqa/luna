import { Client } from "@microsoft/microsoft-graph-client";
import { supabase } from "@/integrations/supabase/client";

export const createGraphClient = (accessToken: string) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};

const getFolderEndpoint = (folder: string) => {
  switch (folder.toLowerCase()) {
    case 'archive':
      return '/me/mailFolders/archive/messages';
    case 'drafts':
      return '/me/mailFolders/drafts/messages';
    case 'sent':
      return '/me/mailFolders/sentItems/messages';
    case 'deleted':
      return '/me/mailFolders/deletedItems/messages';
    case 'junk':
      return '/me/mailFolders/junkemail/messages';
    default:
      return '/me/mailFolders/inbox/messages';
  }
};

export const fetchEmails = async (accessToken: string, folder: string = 'inbox') => {
  try {
    console.log(`Fetching emails from ${folder} folder`);
    
    if (!accessToken) {
      throw new Error('No access token provided');
    }

    const client = createGraphClient(accessToken);
    
    // Validate token and connection by making a small request first
    try {
      const meResponse = await client.api('/me').get();
      console.log('Successfully validated token with user:', meResponse.userPrincipalName);
    } catch (error: any) {
      console.error('Token validation failed:', error);
      if (error.statusCode === 401) {
        throw new Error('authentication_failed');
      }
      throw error;
    }
    
    const endpoint = getFolderEndpoint(folder);
    console.log(`Using endpoint: ${endpoint}`);

    const response = await client
      .api(endpoint)
      .select('id,subject,bodyPreview,from,receivedDateTime,isRead')
      .top(50)
      .orderby('receivedDateTime DESC')
      .get();

    if (!response || !response.value) {
      console.error('Invalid response from Microsoft Graph:', response);
      throw new Error('invalid_response');
    }

    console.log(`Successfully fetched ${response.value.length} emails`);
    return response.value;
  } catch (error: any) {
    console.error('Error fetching emails from Microsoft Graph:', error);
    throw error;
  }
};

export const syncEmailsToSupabase = async (userId: string, emails: any[], folder: string = 'inbox') => {
  try {
    if (!emails || !Array.isArray(emails)) {
      console.error('Invalid emails data:', emails);
      throw new Error('invalid_emails_data');
    }

    console.log(`Syncing ${emails.length} emails to Supabase for folder: ${folder}`);
    
    const emailsToSync = emails.map(email => ({
      user_id: userId,
      message_id: email.id,
      subject: email.subject,
      body_preview: email.bodyPreview,
      from_address: email.from?.emailAddress?.address,
      is_read: email.isRead,
      received_at: email.receivedDateTime,
      status: folder,
    })).filter(email => email.message_id && email.from_address); // Filter out invalid entries

    if (emailsToSync.length === 0) {
      console.log('No valid emails to sync');
      return null;
    }

    const { data, error } = await supabase.from('outlook_emails').upsert(
      emailsToSync,
      { onConflict: 'message_id' }
    );

    if (error) {
      console.error('Error syncing emails to Supabase:', error);
      throw error;
    }

    console.log(`Successfully synced ${emailsToSync.length} emails to ${folder} folder`);
    return data;
  } catch (error) {
    console.error('Error in syncEmailsToSupabase:', error);
    throw error;
  }
};

export const markEmailAsRead = async (accessToken: string, messageId: string) => {
  try {
    const client = createGraphClient(accessToken);
    await client
      .api(`/me/messages/${messageId}`)
      .update({ isRead: true });
    return true;
  } catch (error) {
    console.error('Error marking email as read:', error);
    throw error;
  }
};

export const moveEmailToFolder = async (accessToken: string, messageId: string, destinationFolder: string) => {
  try {
    const client = createGraphClient(accessToken);
    const folderEndpoint = getFolderEndpoint(destinationFolder).replace('/messages', '');
    
    await client
      .api(`/me/messages/${messageId}/move`)
      .post({
        destinationId: folderEndpoint
      });
    return true;
  } catch (error) {
    console.error('Error moving email:', error);
    throw error;
  }
};

export const deleteEmail = async (accessToken: string, messageId: string) => {
  try {
    const client = createGraphClient(accessToken);
    await client
      .api(`/me/messages/${messageId}`)
      .delete();
    return true;
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
};

export const sendEmail = async (accessToken: string, email: {
  toRecipients: { emailAddress: { address: string } }[];
  subject: string;
  body: { content: string; contentType: 'Text' | 'HTML' };
}) => {
  try {
    const client = createGraphClient(accessToken);
    await client
      .api('/me/sendMail')
      .post({
        message: {
          ...email,
          importance: "normal",
          body: {
            ...email.body,
            contentType: email.body.contentType || "HTML"
          }
        }
      });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};