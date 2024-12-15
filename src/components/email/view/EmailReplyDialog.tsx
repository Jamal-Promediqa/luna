import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmailThread } from "./EmailThread";

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
          
          <Textarea
            value={emailContent}
            onChange={(e) => onEmailContentChange(e.target.value)}
            className="min-h-[200px] resize-y"
            placeholder="Skriv ditt svar här..."
            disabled={isLoading}
          />
          
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