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

    // Get the Microsoft access token from the provider token
    const provider_token = user.app_metadata?.provider_token;
    if (!provider_token) {
      console.error('No provider token found in app_metadata:', user.app_metadata);
      throw new Error('No Microsoft access token found. Please reconnect your Microsoft account.');
    }

    console.log('Successfully retrieved access token');

    // Fetch emails using Microsoft Graph REST API
    const response = await fetch('https://graph.microsoft.com/v1.0/me/messages?$top=50&$orderby=receivedDateTime desc&$select=id,subject,bodyPreview,body,from,toRecipients,receivedDateTime,isRead', {
      headers: {
        'Authorization': `Bearer ${provider_token}`,
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
      const { data, error } = await supabase
        .from('outlook_emails')
        .upsert({
          user_id: userId,
          email_id: email.id,
          subject: email.subject,
          from_address: email.from?.emailAddress?.address,
          to_addresses: email.toRecipients?.map(r => r.emailAddress?.address),
          body_preview: email.bodyPreview,
          body_content: email.body?.content,
          received_at: email.receivedDateTime,
          is_read: email.isRead
        }, {
          onConflict: 'email_id',
          ignoreDuplicates: false
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