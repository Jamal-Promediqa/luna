import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CallRecordingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    name: string;
    phone: string;
  };
}

export const CallRecordingDialog = ({ isOpen, onClose, contact }: CallRecordingDialogProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await processRecording(audioBlob);
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
      // Reset any previous results
      setTranscription(null);
      setActionPlan(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Kunde inte komma åt mikrofonen");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Upload audio file to Supabase Storage
      const fileName = `call-recordings/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('call_recordings')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('call_recordings')
        .getPublicUrl(fileName);

      // Create a call record in the database
      const { data: callRecord, error: dbError } = await supabase
        .from('call_records')
        .insert({
          contact_name: contact.name,
          contact_phone: contact.phone,
          audio_url: publicUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Process the recording with Whisper and GPT
      const { data: keyData, error: keyError } = await supabase.rpc('get_anon_key') as { 
        data: { anon_key: string } | null;
        error: Error | null;
      };
      
      if (keyError) throw keyError;
      if (!keyData) throw new Error('Could not retrieve anon key');

      const response = await fetch('/functions/v1/process-call-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keyData.anon_key}`,
        },
        body: JSON.stringify({
          audioUrl: publicUrl,
          contactName: contact.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process recording');
      }

      const { transcription: newTranscription, actionPlan: newActionPlan } = await response.json();
      setTranscription(newTranscription);
      setActionPlan(newActionPlan);
      
      toast.success("Samtalet har sparats och transkriberats");
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error("Kunde inte spara samtalet");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Spela in samtal med {contact.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-center p-6">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : (
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={isRecording ? stopRecording : startRecording}
                className="rounded-full p-8"
              >
                {isRecording ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
            )}
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {isProcessing 
              ? "Bearbetar inspelningen..." 
              : isRecording 
                ? "Klicka för att avsluta inspelningen" 
                : "Klicka för att börja spela in"}
          </div>

          {(transcription || actionPlan) && (
            <div className="space-y-4 mt-6 border-t pt-6">
              {transcription && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Transkription
                  </h3>
                  <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                    {transcription}
                  </div>
                </div>
              )}
              
              {actionPlan && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Sammanfattning & Åtgärder
                  </h3>
                  <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg whitespace-pre-line">
                    {actionPlan}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};