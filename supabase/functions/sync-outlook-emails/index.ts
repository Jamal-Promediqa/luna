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

    // Get the user's session data
    const { data: userResponse, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError) throw userError;

    const user = userResponse.user;
    if (!user) throw new Error('User not found');

    // Find the Azure identity
    const azureIdentity = user.identities?.find(identity => identity.provider === 'azure');
    if (!azureIdentity) {
      throw new Error('No Microsoft account linked');
    }

    // Get the access token from the identity data
    const { data: { token }, error: tokenError } = await supabase.auth.admin.generateAccessToken(userId, {
      properties: {
        provider: 'azure'
      }
    });

    if (tokenError || !token) {
      console.error('Error getting access token:', tokenError);
      throw new Error('Failed to get Microsoft access token');
    }

    console.log('Successfully retrieved access token');

    // Fetch emails using Microsoft Graph REST API
    const response = await fetch('https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc&$select=id,subject,bodyPreview,from,receivedDateTime,isRead', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Microsoft Graph API error:', errorText);
      throw new Error(`Failed to fetch emails: ${response.statusText}`);
    }

    const { value: emails } = await response.json();
    console.log('Fetched emails from Outlook:', emails.length);

    // Store emails in Supabase
    for (const email of emails) {
      const { error } = await supabase
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

      if (error) {
        console.error('Error upserting email:', error);
      }
    }

    return new Response(JSON.stringify({ success: true, emailCount: emails.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error syncing emails:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});