import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmailCompose = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkMicrosoftConnection();
  }, []);

  const checkMicrosoftConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsConnected(!!session?.provider_token);
    } catch (error) {
      console.error('Error checking Microsoft connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftConnect = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          redirectTo: `${window.location.origin}/dashboard`
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
      await supabase.auth.signOut();
      setIsConnected(false);
      toast.success('Microsoft account disconnected');
    } catch (error) {
      console.error('Error disconnecting Microsoft account:', error);
      toast.error('Could not disconnect Microsoft account');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Email Integration</h2>
        <p className="text-gray-600">
          {isConnected 
            ? "Your Microsoft account is connected. You can now send and receive emails."
            : "Connect your Microsoft account to start managing your emails."}
        </p>
        
        <Button
          className="w-full"
          variant={isConnected ? "destructive" : "default"}
          onClick={isConnected ? handleMicrosoftDisconnect : handleMicrosoftConnect}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isConnected ? 'Disconnect Microsoft Account' : 'Connect Microsoft Account'}
        </Button>

        {isConnected && (
          <div className="pt-4">
            <p className="text-sm text-gray-500">
              Your Microsoft account is connected and ready to use. You can now access your emails and send new messages.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};