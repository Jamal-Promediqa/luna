import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  const corsResult = handleCors(req);
  if (corsResult) return corsResult;

  try {
    const { userId } = await req.json();
    console.log('Syncing emails for user:', userId);

    // Get the user's data
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }
    
    if (!user) {
      console.error('User not found');
      throw new Error('User not found');
    }

    // Find the Azure identity
    const azureIdentity = user.identities?.find(identity => 
      identity.provider === 'azure' && identity.identity_data?.refresh_token
    );

    if (!azureIdentity) {
      console.error('No Microsoft account linked with refresh token');
      throw new Error('No Microsoft account linked with refresh token. Please reconnect your account.');
    }

    // Get the refresh token from the identity data
    const refreshToken = azureIdentity.identity_data?.refresh_token;
    if (!refreshToken) {
      console.error('No refresh token found in identity data');
      throw new Error('No refresh token found. Please reconnect your Microsoft account.');
    }

    console.log('Getting new access token using refresh token');

    // Get a new access token using Azure AD OAuth endpoints
    const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Deno.env.get('AZURE_CLIENT_ID') ?? '',
        client_secret: Deno.env.get('AZURE_CLIENT_SECRET') ?? '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'https://graph.microsoft.com/Mail.Read',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token refresh error:', errorText);
      throw new Error('Failed to refresh Microsoft access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      console.error('No access token received');
      throw new Error('No access token received from Microsoft');
    }

    console.log('Successfully retrieved access token');

    // Fetch emails using Microsoft Graph REST API
    const emailsResponse = await fetch(
      'https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc&$select=id,subject,bodyPreview,from,receivedDateTime,isRead',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!emailsResponse.ok) {
      const errorText = await emailsResponse.text();
      console.error('Microsoft Graph API error:', errorText);
      throw new Error(`Failed to fetch emails: ${emailsResponse.statusText}`);
    }

    const { value: emails } = await emailsResponse.json();
    console.log('Fetched emails from Outlook:', emails.length);

    // Store emails in Supabase
    for (const email of emails) {
      const { error: upsertError } = await supabase
        .from('outlook_emails')
        .upsert({
          id: email.id,
          user_id: userId,
          subject: email.subject,
          body_preview: email.bodyPreview,
          from_address: email.from?.emailAddress?.address,
          is_read: email.isRead,
          received_at: email.receivedDateTime,
          status: 'inbox'
        }, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error('Error upserting email:', upsertError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, emailCount: emails.length }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error syncing emails:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});