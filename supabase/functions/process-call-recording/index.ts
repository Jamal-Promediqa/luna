import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { audioUrl, contactName } = await req.json()
    console.log('Processing audio from URL:', audioUrl)

    // Download the audio file
    const response = await fetch(audioUrl)
    if (!response.ok) {
      console.error(`Failed to download audio: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to download audio file: ${response.statusText}`)
    }
    const audioBlob = await response.blob()
    console.log('Successfully downloaded audio file')

    // Transcribe with Whisper
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'sv')

    console.log('Sending audio to Whisper API')
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    })

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text()
      console.error('Whisper API error:', error)
      throw new Error(`Whisper API error: ${error}`)
    }

    const { text: transcription } = await transcriptionResponse.json()
    console.log('Received transcription:', transcription)

    // Generate action plan with GPT
    console.log('Generating action plan with GPT')
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that helps create action plans from call summaries. 
                     Format the response in Swedish with these sections:
                     
                     SAMMANFATTNING:
                     [A brief summary of the call]
                     
                     ÅTGÄRDER:
                     [Bullet points of specific actions that need to be taken, each on a new line starting with a dash (-)]
                     
                     UPPFÖLJNING:
                     [When and how to follow up]
                     
                     Make sure each action item in ÅTGÄRDER is clear, actionable, and starts with a verb.
                     Each action should be on its own line and start with a dash (-).`
          },
          {
            role: 'user',
            content: `This is a transcription of a call with ${contactName}. Please analyze it and create a summary and action plan:\n\n${transcription}`
          }
        ],
      }),
    })

    if (!completion.ok) {
      const error = await completion.text()
      console.error('GPT API error:', error)
      throw new Error(`GPT API error: ${error}`)
    }

    const { choices } = await completion.json()
    const actionPlan = choices[0].message.content
    console.log('Generated action plan:', actionPlan)

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

    if (updateError) {
      console.error('Error updating call record:', updateError)
      throw updateError
    }

    console.log('Successfully updated call record')

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