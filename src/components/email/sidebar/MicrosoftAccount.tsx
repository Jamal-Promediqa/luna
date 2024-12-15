import { Mail as MailIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MicrosoftAccountProps {
  isConnected: boolean;
  isLoading: boolean;
}

export const MicrosoftAccount = ({ isConnected, isLoading }: MicrosoftAccountProps) => {
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
      toast.success('Microsoft account disconnected');
    } catch (error) {
      console.error('Error disconnecting Microsoft account:', error);
      toast.error('Could not disconnect Microsoft account');
    }
  };

  return (
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
  );
};