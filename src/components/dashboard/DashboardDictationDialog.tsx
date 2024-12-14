import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AudioWaveform } from "./AudioWaveform";
import { TranscriptionSummary } from "./TranscriptionSummary";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DashboardDictationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardDictationDialog = ({ isOpen, onClose }: DashboardDictationDialogProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title,
          status: 'väntar',
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Uppgift skapad från diktering");
    },
  });

  const saveCallRecordMutation = useMutation({
    mutationFn: async ({ transcription, actionPlan, audioUrl }: { transcription: string, actionPlan: string, audioUrl: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('call_records')
        .insert([{
          contact_name: "Dashboard Dictation",
          contact_phone: "",
          audio_url: audioUrl,
          summary: transcription,
          action_plan: actionPlan,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-records'] });
    },
  });

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
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
      setMediaStream(stream);
      recorder.start();
      setIsRecording(true);
      setTranscription(null);
      setActionPlan(null);
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Kunde inte komma åt mikrofonen");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      console.log('Stopping recording...');
      mediaRecorder.stop();
      setIsRecording(false);
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      console.log('Processing recording...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const fileName = `dictation/${Date.now()}.webm`;
      console.log('Uploading file:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('call_recordings')
        .upload(fileName, audioBlob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('call_recordings')
        .getPublicUrl(fileName);

      console.log('Processing with Edge Function:', publicUrl);
      const { data, error } = await supabase.functions.invoke('process-call-recording', {
        body: {
          audioUrl: publicUrl,
          contactName: "Dashboard Dictation",
        },
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw error;
      }

      console.log('Edge Function response:', data);
      const { transcription: newTranscription, actionPlan: newActionPlan } = data;
      setTranscription(newTranscription);
      setActionPlan(newActionPlan);

      // Save the transcription to the database
      await saveCallRecordMutation.mutateAsync({
        transcription: newTranscription,
        actionPlan: newActionPlan,
        audioUrl: publicUrl
      });
      
      toast.success("Dikteringen har sparats och transkriberats");
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error("Kunde inte spara dikteringen");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTask = (task: string) => {
    createTaskMutation.mutate(task);
  };

  const getActionItemsFromPlan = (plan: string): string[] => {
    if (!plan) return [];
    const actionSection = plan.split('ÅTGÄRDER:')[1]?.split('UPPFÖLJNING:')[0];
    if (!actionSection) return [];
    return actionSection
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] p-0">
        {!transcription ? (
          <div className="p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl">Diktera anteckning</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-muted-foreground">Bearbetar inspelningen...</p>
                </div>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    onClick={isRecording ? stopRecording : startRecording}
                    className="rounded-full w-24 h-24 p-0 transition-all hover:scale-105"
                  >
                    {isRecording ? (
                      <MicOff className="h-12 w-12" />
                    ) : (
                      <Mic className="h-12 w-12" />
                    )}
                  </Button>
                  <p className="text-base text-muted-foreground">
                    {isRecording ? "Klicka för att avsluta inspelningen" : "Klicka för att börja spela in"}
                  </p>
                  {isRecording && mediaStream && (
                    <div className="w-full max-w-md mt-4">
                      <AudioWaveform mediaStream={mediaStream} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <TranscriptionSummary
            title="Diktering"
            summary={transcription}
            actionItems={getActionItemsFromPlan(actionPlan || "")}
            onCreateTask={handleCreateTask}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};