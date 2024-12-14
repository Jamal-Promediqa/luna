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
      console.log('Attempting to link Microsoft account...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.ReadWrite offline_access',
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        if (error.message.includes("provider is not enabled")) {
          toast.error('Microsoft authentication is not enabled. Please contact your administrator to enable the Azure provider in Supabase.');
        } else {
          toast.error(`Failed to link Microsoft account: ${error.message}`);
        }
        console.error('Error details:', error);
        throw error;
      }
      
      console.log('OAuth response:', data);
      
    } catch (error) {
      console.error('Error linking Microsoft account:', error);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg">
      <Mail className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-semibold">Link Your Microsoft Account</h3>
      <p className="text-sm text-muted-foreground text-center">
        Connect your Microsoft account to sync and view your emails in Co-Pilot
      </p>
      <Button 
        onClick={handleMicrosoftLink} 
        disabled={isLinking}
        className="w-full"
      >
        {isLinking ? 'Linking...' : 'Link Microsoft Account'}
      </Button>
    </div>
  );
};