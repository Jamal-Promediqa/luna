import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { Client } from "https://deno.land/x/microsoft_graph@1.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  content: string;
  isDraft?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, cc, bcc, subject, content, isDraft } = await req.json() as EmailRequest;
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      throw new Error('Invalid session');
    }

    // Get the user's Microsoft access token
    const { data: { provider_token }, error: providerError } = 
      await supabase.auth.getSession();
    
    if (providerError || !provider_token) {
      throw new Error('No Microsoft access token found');
    }

    // Initialize Microsoft Graph client
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, provider_token);
      },
    });

    // Prepare the email
    const email = {
      message: {
        subject,
        body: {
          contentType: "html",
          content,
        },
        toRecipients: to.map(email => ({
          emailAddress: { address: email },
        })),
        ...(cc && {
          ccRecipients: cc.map(email => ({
            emailAddress: { address: email },
          })),
        }),
        ...(bcc && {
          bccRecipients: bcc.map(email => ({
            emailAddress: { address: email },
          })),
        }),
      },
    };

    if (isDraft) {
      // Save as draft
      await graphClient.api('/me/messages').post(email);
    } else {
      // Send email
      await graphClient.api('/me/sendMail').post(email);
    }

    // Store in our database
    const { error: dbError } = await supabase
      .from('outlook_sent_emails')
      .insert({
        user_id: session.user.id,
        subject,
        to_addresses: to,
        cc_addresses: cc,
        bcc_addresses: bcc,
        body_content: content,
        sent_at: isDraft ? null : new Date().toISOString(),
        is_draft: isDraft,
      });

    if (dbError) {
      console.error('Error storing email:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-outlook-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});