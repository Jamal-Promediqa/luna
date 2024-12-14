import { createClient } from '@supabase/supabase-js';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';

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

const getGraphClient = () => {
  const credential = new ClientSecretCredential(
    Deno.env.get('AZURE_TENANT_ID') || '',
    Deno.env.get('AZURE_CLIENT_ID') || '',
    Deno.env.get('AZURE_CLIENT_SECRET') || ''
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default']
  });

  return Client.initWithMiddleware({ authProvider });
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

    const graphClient = getGraphClient();
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