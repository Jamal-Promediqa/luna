import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
}: EmailReplyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Svara på mail</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={toAddress}
            onChange={(e) => onToAddressChange(e.target.value)}
            placeholder="Till"
            disabled={isLoading}
          />
          <div className="text-sm text-muted-foreground">
            Ämne: Re: {subject}
          </div>
          <Textarea
            value={emailContent}
            onChange={(e) => onEmailContentChange(e.target.value)}
            className="min-h-[200px]"
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button onClick={onSend} disabled={isLoading}>
              {isLoading ? "Skickar..." : "Skicka"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};