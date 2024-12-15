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
      console.log("Starting Microsoft connection check...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }

      console.log("Session data:", {
        hasSession: !!session,
        hasProviderToken: !!session?.provider_token,
        provider: session?.provider,
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

      console.log("OAuth response:", {
        success: !error,
        hasData: !!data,
        error: error?.message
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
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }

      console.log("Successfully signed out");
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