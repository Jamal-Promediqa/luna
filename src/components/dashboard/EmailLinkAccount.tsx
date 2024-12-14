import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EmailLinkAccount = () => {
  const [isLinking, setIsLinking] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleMicrosoftLink = async () => {
    setIsLinking(true);
    setShowError(false);
    try {
      console.log("1. Starting Microsoft authentication...");
      
      // Get the current URL for the redirect
      const redirectUrl = `${window.location.origin}/dashboard`;
      console.log("2. Redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          redirectTo: redirectUrl,
        }
      });

      console.log("3. Authentication response:", { data, error });

      if (error) {
        console.error('4. Azure OAuth error:', {
          message: error.message,
          status: error.status,
          stack: error.stack
        });
        
        setShowError(true);
        toast.error("Failed to connect to Microsoft. Please try again.");
        throw error;
      }

      if (!data) {
        console.error('5. No response data received');
        setShowError(true);
        toast.error('No response received from Microsoft. Please try again.');
        throw new Error('No OAuth response data');
      }

      console.log("6. Authentication successful, redirecting...");
      toast.success('Redirecting to Microsoft login...');
      
    } catch (error) {
      console.error('7. Error linking Microsoft account:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setShowError(true);
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
      {showError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            Unable to connect to Microsoft. Please make sure you have a valid Microsoft account and try again.
            If the problem persists, contact support.
          </AlertDescription>
        </Alert>
      )}
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