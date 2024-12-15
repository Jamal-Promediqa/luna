import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmailThread } from "./EmailThread";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toAddress: string;
  onToAddressChange: (value: string) => void;
  emailContent: string;
  onEmailContentChange: (value: string) => void;
  subject: string;
  isLoading: boolean;
  onSend: () => void;
  originalEmail?: {
    sender: string;
    timestamp: string;
    subject: string;
    preview: string;
  };
}

export const EmailReplyDialog = ({
  open,
  onOpenChange,
  toAddress,
  onToAddressChange,
  emailContent,
  onEmailContentChange,
  subject,
  isLoading,
  onSend,
  originalEmail,
}: EmailReplyDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    onEmailContentChange(content);
  };

  const handleAIAssist = async () => {
    setIsGenerating(true);
    try {
      const context = originalEmail ? `Original email subject: ${originalEmail.subject}. Original email content: ${originalEmail.preview}` : '';
      
      const { data, error } = await supabase.functions.invoke('generate-email-assistant', {
        body: {
          prompt: "Write a professional response",
          context
        },
      });

      if (error) throw error;

      onEmailContentChange(data.suggestion);
      toast.success("AI-förslag genererat");
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast.error("Kunde inte generera AI-förslag");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Svara på mail</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm font-medium">Till:</span>
              <Input
                value={toAddress}
                onChange={(e) => onToAddressChange(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm font-medium">Ämne:</span>
              <div className="text-sm text-muted-foreground">
                Re: {subject}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Textarea
              value={emailContent}
              onChange={handleContentChange}
              className="min-h-[200px] resize-y pr-24"
              placeholder="Skriv ditt svar här..."
              disabled={isLoading}
            />
            <Button
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleAIAssist}
              disabled={isGenerating || isLoading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Genererar..." : "AI Assist"}
            </Button>
          </div>
          
          {originalEmail && (
            <EmailThread
              sender={originalEmail.sender}
              timestamp={originalEmail.timestamp}
              subject={originalEmail.subject}
              preview={originalEmail.preview}
            />
          )}
          
          <div className="flex justify-end pt-2">
            <Button onClick={onSend} disabled={isLoading}>
              {isLoading ? "Skickar..." : "Skicka"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};