import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { consultantName, personalNumber } = await req.json()

    // Use OpenAI to generate the email content
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a professional assistant helping to generate formal emails in Swedish for background checks."
        }, {
          role: "user",
          content: `Generate a formal email in Swedish to IVO requesting background check information for ${consultantName} with personal number ${personalNumber}. The email should be professional and follow the standard format for such requests.`
        }]
      })
    })

    const aiData = await openAIResponse.json()
    const emailContent = aiData.choices[0].message.content

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Acme <onboarding@resend.dev>',
        to: ['kontrollavlegitimeradpersonal@ivo.se'],
        subject: `Bakgrundskontroll förfrågan - ${consultantName}`,
        html: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      throw new Error('Failed to send email')
    }

    // Store the request in the database
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)
    
    const { data, error } = await supabase
      .from('background_check_requests')
      .insert([
        {
          consultant_id: consultantName, // You might want to store the actual consultant ID here
          check_type: 'IVO',
          status: 'pending',
          request_date: new Date().toISOString(),
        }
      ])

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, message: 'Background check request sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})