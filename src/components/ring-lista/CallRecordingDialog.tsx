import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
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
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Kunde inte komma åt mikrofonen");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
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
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success("Samtalet har sparats");
      onClose();
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error("Kunde inte spara samtalet");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Spela in samtal med {contact.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
            {isRecording ? "Klicka för att avsluta inspelningen" : "Klicka för att börja spela in"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};