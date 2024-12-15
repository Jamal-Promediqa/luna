import { ArrowLeft, Star, Archive, Trash2, MoreVertical, Reply, Forward, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEmailAuth } from "./hooks/useEmailAuth";

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
  const [emailContent, setEmailContent] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useEmailAuth();

  const handleReply = () => {
    setToAddress(email.sender);
    setEmailContent(`

Ursprungligt meddelande från ${email.sender}
Skickat: ${formatDate(email.timestamp)}
Ämne: ${email.subject}

${email.preview}
`);
    setShowReplyDialog(true);
  };

  const handleForward = () => {
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

  const handleAIResponse = () => {
    toast.success("Genererar AI-svar", {
      description: "Funktionen kommer snart"
    });
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
            {/* Email Details */}
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>{email.sender[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{email.sender}</span>
                  {!email.isRead && (
                    <Badge variant="secondary">Ny</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(email.timestamp)}
                </div>
              </div>
            </div>
            {/* Email Content */}
            <div className="space-y-4">
              <div className="whitespace-pre-wrap">{email.preview}</div>
            </div>
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
              <Button onClick={handleAIResponse}>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Svar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Svara på mail</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Till"
              disabled={isLoading}
            />
            <div className="text-sm text-muted-foreground">
              Ämne: Re: {email.subject}
            </div>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[200px]"
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button 
                onClick={() => handleSendEmail(true)}
                disabled={isLoading}
              >
                {isLoading ? "Skickar..." : "Skicka"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forward Dialog */}
      <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Vidarebefordra mail</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Till"
              disabled={isLoading}
            />
            <div className="text-sm text-muted-foreground">
              Ämne: Fwd: {email.subject}
            </div>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[200px]"
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button 
                onClick={() => handleSendEmail(false)}
                disabled={isLoading}
              >
                {isLoading ? "Skickar..." : "Skicka"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
