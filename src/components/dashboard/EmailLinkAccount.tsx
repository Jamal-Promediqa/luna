import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmailLinkAccount = () => {
  const [isLinking, setIsLinking] = useState(false);

  const handleMicrosoftLink = async () => {
    setIsLinking(true);
    try {
      console.log("Starting Microsoft authentication...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      console.log("Authentication response:", { data, error });

      if (error) {
        console.error('Azure OAuth error:', error);
        if (error.message.includes("provider is not enabled")) {
          toast.error('Microsoft authentication is not properly configured. Please ensure the Azure provider is enabled in Supabase.');
        } else {
          toast.error(`Failed to connect: ${error.message}`);
        }
        throw error;
      }

      if (!data) {
        console.error('No response data received');
        toast.error('No response received from Microsoft. Please try again.');
        throw new Error('No OAuth response data');
      }

      toast.success('Redirecting to Microsoft login...');
      
    } catch (error) {
      console.error('Error linking Microsoft account:', error);
      toast.error(`Connection error: ${error.message}`);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg">
      <Mail className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">Connect Microsoft Account</h3>
      <p className="text-sm text-muted-foreground text-center">
        Link your Microsoft account to view and send emails in Co-Pilot
      </p>
      <Button 
        onClick={handleMicrosoftLink} 
        disabled={isLinking}
        className="w-full"
      >
        {isLinking ? 'Connecting...' : 'Connect Microsoft Account'}
      </Button>
    </div>
  );
};