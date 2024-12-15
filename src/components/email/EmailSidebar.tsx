import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MicrosoftAccount } from "./sidebar/MicrosoftAccount";
import { QuickActions } from "./sidebar/QuickActions";
import { EmailTemplates } from "./sidebar/EmailTemplates";
import { AIAssistant } from "./sidebar/AIAssistant";

interface EmailSidebarProps {
  onGenerateAIResponse: () => void;
  onRefreshInbox: () => void;
}

const templates = {
  "Mötesbokning": `Hej,

Jag skulle vilja boka ett möte med dig för att diskutera...

Med vänliga hälsningar`,
  "Projektuppdatering": `Hej teamet,

Här kommer en uppdatering om projektet...

Med vänliga hälsningar`,
  "Kunduppföljning": `Hej,

Jag följer upp vårt tidigare samtal...

Med vänliga hälsningar`
};

export const EmailSidebar = ({ onGenerateAIResponse, onRefreshInbox }: EmailSidebarProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: ""
  });

  useEffect(() => {
    checkMicrosoftConnection();
  }, []);

  const checkMicrosoftConnection = async () => {
    try {
      console.log("Starting Microsoft connection check...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      console.log("Session data:", {
        hasSession: !!session,
        hasProviderToken: !!session?.provider_token,
        user: session?.user?.email
      });

      setIsConnected(!!session?.provider_token);
    } catch (error) {
      console.error('Error checking Microsoft connection:', error);
      toast.error("Could not check Microsoft connection status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompose = () => {
    if (!isConnected) {
      toast.error("Please connect your Microsoft account first");
      return;
    }
    setShowComposeDialog(true);
  };

  const handleSendEmail = async () => {
    try {
      if (!emailData.to || !emailData.subject || !emailData.body) {
        toast.error("Please fill in all fields");
        return;
      }
      // In a real implementation, this would send the email
      toast.success("Mail skickat");
      setShowComposeDialog(false);
      setEmailData({ to: "", subject: "", body: "" });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Kunde inte skicka mail');
    }
  };

  const handleTemplateSelect = (template: string) => {
    if (!isConnected) {
      toast.error("Please connect your Microsoft account first");
      return;
    }
    setEmailData(prev => ({
      ...prev,
      body: templates[template as keyof typeof templates]
    }));
    setShowComposeDialog(true);
  };

  return (
    <div className="space-y-6">
      <MicrosoftAccount isConnected={isConnected} isLoading={isLoading} />
      <QuickActions 
        isConnected={isConnected} 
        onCompose={handleCompose}
        onRefreshInbox={onRefreshInbox}
      />
      <EmailTemplates 
        isConnected={isConnected}
        onSelectTemplate={handleTemplateSelect}
      />
      <AIAssistant 
        isConnected={isConnected}
        onGenerateAIResponse={onGenerateAIResponse}
      />

      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Skriv nytt mail</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Till"
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
            />
            <Input
              placeholder="Ämne"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            />
            <Textarea
              placeholder="Meddelande"
              value={emailData.body}
              onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
              className="min-h-[200px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSendEmail}>Skicka</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};