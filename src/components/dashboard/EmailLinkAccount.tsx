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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.ReadWrite',
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
      
    } catch (error) {
      console.error('Error linking Microsoft account:', error);
      toast.error('Failed to link Microsoft account');
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