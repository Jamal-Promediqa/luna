import { Mail, Archive, RefreshCw, MessageSquare, Send, Mail as MailIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EmailSidebarProps {
  onGenerateAIResponse: () => void;
  onRefreshInbox: () => void;
}

export const EmailSidebar = ({ onGenerateAIResponse, onRefreshInbox }: EmailSidebarProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: ""
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

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

  const handleMicrosoftConnect = async () => {
    try {
      console.log("Starting Microsoft OAuth flow...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          redirectTo: window.location.origin,
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error connecting to Microsoft:', error);
      toast.error('Could not connect to Microsoft account. Please try again.');
    }
  };

  const handleMicrosoftDisconnect = async () => {
    try {
      console.log("Starting Microsoft disconnect...");
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      setIsConnected(false);
      toast.success('Microsoft account disconnected');
    } catch (error) {
      console.error('Error disconnecting Microsoft account:', error);
      toast.error('Could not disconnect Microsoft account');
    }
  };

  const handleArchiveAll = async () => {
    try {
      // In a real implementation, this would archive all emails
      toast.success("Alla mail arkiverade");
    } catch (error) {
      console.error('Error archiving all emails:', error);
      toast.error('Kunde inte arkivera alla mail');
    }
  };

  const handleCompose = () => {
    setShowComposeDialog(true);
  };

  const handleSendEmail = async () => {
    try {
      // In a real implementation, this would send the email
      toast.success("Mail skickat");
      setShowComposeDialog(false);
      setEmailData({ to: "", subject: "", body: "" });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Kunde inte skicka mail');
    }
  };

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

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setEmailData(prev => ({
      ...prev,
      body: templates[template as keyof typeof templates]
    }));
    setShowComposeDialog(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Microsoft Account</h3>
          <div className="space-y-3">
            {!isLoading && (
              <Button 
                className="w-full" 
                variant={isConnected ? "destructive" : "default"}
                onClick={isConnected ? handleMicrosoftDisconnect : handleMicrosoftConnect}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                {isConnected ? 'Disconnect Microsoft Account' : 'Connect Microsoft Account'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Snabbåtgärder</h3>
          <div className="space-y-3">
            <Button 
              className="w-full" 
              variant="outline" 
              disabled={!isConnected}
              onClick={handleCompose}
            >
              <Mail className="mr-2 h-4 w-4" />
              Skriv nytt mail
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              disabled={!isConnected}
              onClick={handleArchiveAll}
            >
              <Archive className="mr-2 h-4 w-4" />
              Arkivera alla
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              disabled={!isConnected}
              onClick={onRefreshInbox}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Uppdatera inkorg
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Mallar</h3>
          <div className="space-y-3">
            <Button 
              className="w-full" 
              variant="outline" 
              disabled={!isConnected}
              onClick={() => handleTemplateSelect("Mötesbokning")}
            >
              Mötesbokning
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              disabled={!isConnected}
              onClick={() => handleTemplateSelect("Projektuppdatering")}
            >
              Projektuppdatering
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              disabled={!isConnected}
              onClick={() => handleTemplateSelect("Kunduppföljning")}
            >
              Kunduppföljning
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">AI-Assistent</h3>
          <div className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={onGenerateAIResponse}
              disabled={!isConnected}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Generera svar
            </Button>
            <Button 
              className="w-full" 
              disabled={!isConnected}
            >
              <Send className="mr-2 h-4 w-4" />
              Skicka AI-svar
            </Button>
          </div>
        </CardContent>
      </Card>

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