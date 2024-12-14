import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";

interface RecordingInterfaceProps {
  isRecording: boolean;
  isProcessing: boolean;
  mediaStream: MediaStream | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const RecordingInterface = ({
  isRecording,
  isProcessing,
  mediaStream,
  onStartRecording,
  onStopRecording,
}: RecordingInterfaceProps) => {
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-muted-foreground">Bearbetar inspelningen...</p>
      </div>
    );
  }

  return (
    <>
      <Button
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        onClick={isRecording ? onStopRecording : onStartRecording}
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
  );
};