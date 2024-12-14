import { createClient } from '@supabase/supabase-js';
import { Client } from '@microsoft/microsoft-graph-client';

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

    // Get the user's Microsoft access token from their session
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError) throw userError;

    const accessToken = user?.app_metadata?.azure_access_token;
    if (!accessToken) {
      throw new Error('No Microsoft access token found');
    }

    // Initialize Microsoft Graph client with the user's access token
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    const emails = await graphClient.api('/me/messages')
      .select('id,subject,bodyPreview,body,from,toRecipients,receivedDateTime,isRead')
      .top(50)
      .orderBy('receivedDateTime DESC')
      .get();

    console.log('Fetched emails from Outlook:', emails.value.length);

    for (const email of emails.value) {
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

    return new Response(JSON.stringify({ success: true }), {
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