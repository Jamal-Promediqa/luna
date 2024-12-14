import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ComposeEmailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComposeEmail = ({ open, onOpenChange }: ComposeEmailProps) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (isDraft = false) => {
    if (!to && !isDraft) {
      toast.error("Please specify at least one recipient");
      return;
    }

    setIsSending(true);
    try {
      const toAddresses = to.split(",").map(email => email.trim()).filter(Boolean);
      const ccAddresses = cc.split(",").map(email => email.trim()).filter(Boolean);
      const bccAddresses = bcc.split(",").map(email => email.trim()).filter(Boolean);

      const { error } = await supabase.functions.invoke("send-outlook-email", {
        body: {
          to: toAddresses,
          cc: ccAddresses.length > 0 ? ccAddresses : undefined,
          bcc: bccAddresses.length > 0 ? bccAddresses : undefined,
          subject,
          content,
          isDraft,
        },
      });

      if (error) throw error;

      toast.success(isDraft ? "Draft saved" : "Email sent successfully");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="To (separate multiple emails with commas)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <Input
              placeholder="Cc (optional)"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            />
            <Input
              placeholder="Bcc (optional)"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Write your email..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSend(true)}
            disabled={isSending}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSend(false)}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};