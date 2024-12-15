import { ArrowLeft, Star, Archive, Trash2, MoreVertical, Reply, Forward, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmailAuth } from "./hooks/useEmailAuth";
import { EmailContent } from "./view/EmailContent";
import { EmailReplyDialog } from "./view/EmailReplyDialog";
import { EmailForwardDialog } from "./view/EmailForwardDialog";
import { EmailAIResponseDialog } from "./view/EmailAIResponseDialog";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isStarred: boolean;
  isRead: boolean;
}

interface EmailViewProps {
  email: Email;
  onBack: () => void;
  onToggleStar: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

export const EmailView = ({
  email,
  onBack,
  onToggleStar,
  onArchive,
  onDelete,
  formatDate,
}: EmailViewProps) => {
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [showAIResponseDialog, setShowAIResponseDialog] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useEmailAuth();

  const handleReply = () => {
    if (!accessToken) {
      toast.error("Du måste vara ansluten till Microsoft för att svara på mail");
      return;
    }
    setToAddress(email.sender);
    setEmailContent("");
    setShowReplyDialog(true);
  };

  const handleForward = () => {
    if (!accessToken) {
      toast.error("Du måste vara ansluten till Microsoft för att vidarebefordra mail");
      return;
    }
    setToAddress("");
    setEmailContent(`
---------- Vidarebefordrat meddelande ----------
Från: ${email.sender}
Datum: ${formatDate(email.timestamp)}
Ämne: ${email.subject}

${email.preview}
`);
    setShowForwardDialog(true);
  };

  const handleSendEmail = async (isReply: boolean) => {
    if (!accessToken) {
      toast.error("Du måste vara ansluten till Microsoft för att skicka mail");
      return;
    }

    if (!toAddress) {
      toast.error("Vänligen ange en mottagare");
      return;
    }

    if (!emailContent.trim()) {
      toast.error("Vänligen skriv ett meddelande");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-outlook-email', {
        body: {
          to: toAddress,
          subject: isReply ? `Re: ${email.subject}` : `Fwd: ${email.subject}`,
          content: emailContent,
          accessToken
        },
      });

      if (error) throw error;

      toast.success("Mail skickat");
      setShowReplyDialog(false);
      setShowForwardDialog(false);
      setEmailContent("");
      setToAddress("");
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Kunde inte skicka mail");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertAIResponse = (content: string) => {
    setEmailContent((prev) => {
      // If we're not already in reply mode, start a new reply
      if (!showReplyDialog && !showForwardDialog) {
        handleReply();
        return content;
      }
      // If we're already in reply mode, just append the AI response
      return prev + "\n\n" + content;
    });
    
    if (showReplyDialog || showForwardDialog) {
      toast.success("AI-svar infogat i meddelandet");
    } else {
      toast.success("AI-svar infogat i nytt svar");
    }
    setShowAIResponseDialog(false);
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-semibold">{email.subject}</h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStar(email.id)}
                >
                  <Star className={email.isStarred ? "fill-yellow-400" : ""} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onArchive(email.id)}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(email.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <EmailContent
              sender={email.sender}
              isRead={email.isRead}
              timestamp={email.timestamp}
              formatDate={formatDate}
              preview={email.preview}
            />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleReply}>
                <Reply className="mr-2 h-4 w-4" />
                Svara
              </Button>
              <Button variant="outline" onClick={handleForward}>
                <Forward className="mr-2 h-4 w-4" />
                Vidarebefordra
              </Button>
              <Button onClick={() => setShowAIResponseDialog(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Svar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EmailReplyDialog
        open={showReplyDialog}
        onOpenChange={setShowReplyDialog}
        toAddress={toAddress}
        onToAddressChange={setToAddress}
        emailContent={emailContent}
        onEmailContentChange={setEmailContent}
        subject={email.subject}
        isLoading={isLoading}
        onSend={() => handleSendEmail(true)}
        originalEmail={email}
      />

      <EmailForwardDialog
        open={showForwardDialog}
        onOpenChange={setShowForwardDialog}
        toAddress={toAddress}
        onToAddressChange={setToAddress}
        emailContent={emailContent}
        onEmailContentChange={setEmailContent}
        subject={email.subject}
        isLoading={isLoading}
        onSend={() => handleSendEmail(false)}
      />

      <EmailAIResponseDialog
        open={showAIResponseDialog}
        onOpenChange={setShowAIResponseDialog}
        onInsert={handleInsertAIResponse}
        emailContent={email.preview}
        sender={email.sender}
      />
    </>
  );
};