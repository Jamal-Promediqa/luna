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
    const client = createGraphClient(accessToken);
    
    const endpoint = getFolderEndpoint(folder);
    console.log(`Using endpoint: ${endpoint}`);

    const response = await client
      .api(endpoint)
      .select('id,subject,bodyPreview,from,receivedDateTime,isRead')
      .top(50)
      .orderBy('receivedDateTime DESC')
      .get();

    return response.value;
  } catch (error) {
    console.error('Error fetching emails from Microsoft Graph:', error);
    throw error;
  }
};

export const syncEmailsToSupabase = async (userId: string, emails: any[], folder: string = 'inbox') => {
  try {
    console.log(`Syncing ${emails.length} emails to Supabase for folder: ${folder}`);
    const { data, error } = await supabase.from('outlook_emails').upsert(
      emails.map(email => ({
        user_id: userId,
        message_id: email.id,
        subject: email.subject,
        body_preview: email.bodyPreview,
        from_address: email.from.emailAddress.address,
        is_read: email.isRead,
        received_at: email.receivedDateTime,
        status: folder,
      })),
      { onConflict: 'message_id' }
    );

    if (error) {
      console.error('Error syncing emails to Supabase:', error);
      throw error;
    }

    console.log(`Successfully synced emails to ${folder} folder`);
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