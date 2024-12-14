import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { audioUrl, contactName } = await req.json()

    // Download the audio file
    const response = await fetch(audioUrl)
    const audioBlob = await response.blob()

    // Transcribe with Whisper
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    const { text: transcription } = await transcriptionResponse.json()

    // Generate action plan with GPT
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that helps create action plans from call summaries. Format the response in clear, actionable items.'
          },
          {
            role: 'user',
            content: `This is a transcription of a call with ${contactName}. Please analyze it and create a summary and action plan:\n\n${transcription}`
          }
        ],
      }),
    })

    const { choices } = await completion.json()
    const actionPlan = choices[0].message.content

    // Update the call record in the database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: updateError } = await supabase
      .from('call_records')
      .update({
        summary: actionPlan,
      })
      .eq('audio_url', audioUrl)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ transcription, actionPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing call recording:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})