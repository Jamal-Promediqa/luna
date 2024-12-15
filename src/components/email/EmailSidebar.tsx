import { Mail, Archive, RefreshCw, MessageSquare, Send, Mail as MailIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EmailSidebarProps {
  onGenerateAIResponse: () => void;
  onRefreshInbox: () => void;
}

export const EmailSidebar = ({ onGenerateAIResponse, onRefreshInbox }: EmailSidebarProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkMicrosoftConnection();
  }, []);

  const checkMicrosoftConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Checking Microsoft connection, provider token:", !!session?.provider_token);
      setIsConnected(!!session?.provider_token);
    } catch (error) {
      console.error('Error checking Microsoft connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftConnect = async () => {
    try {
      console.log("Initiating Microsoft connection");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error connecting to Microsoft:', error);
      toast.error('Could not connect to Microsoft account');
    }
  };

  const handleMicrosoftDisconnect = async () => {
    try {
      console.log("Disconnecting Microsoft account");
      await supabase.auth.signOut();
      setIsConnected(false);
      toast.success('Microsoft account disconnected');
    } catch (error) {
      console.error('Error disconnecting Microsoft account:', error);
      toast.error('Could not disconnect Microsoft account');
    }
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
            <Button className="w-full" variant="outline" disabled={!isConnected}>
              <Mail className="mr-2 h-4 w-4" />
              Skriv nytt mail
            </Button>
            <Button className="w-full" variant="outline" disabled={!isConnected}>
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
            <Button className="w-full" variant="outline" disabled={!isConnected}>
              Mötesbokning
            </Button>
            <Button className="w-full" variant="outline" disabled={!isConnected}>
              Projektuppdatering
            </Button>
            <Button className="w-full" variant="outline" disabled={!isConnected}>
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
            <Button className="w-full" disabled={!isConnected}>
              <Send className="mr-2 h-4 w-4" />
              Skicka AI-svar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};