import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EmailLinkAccount = () => {
  const [isLinking, setIsLinking] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMicrosoftLink = async () => {
    setIsLinking(true);
    setShowError(false);
    setErrorMessage("");
    
    try {
      console.log("1. Starting Microsoft authentication...");
      
      // Get the current URL for the redirect
      const redirectUrl = `${window.location.origin}/dashboard`;
      console.log("2. Redirect URL:", redirectUrl);

      // Check if we're in development or production
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';

      // Use the appropriate redirect URL based on environment
      const finalRedirectUrl = isDevelopment 
        ? 'http://localhost:5173/dashboard'
        : encodeURIComponent(redirectUrl);

      console.log("3. Using encoded redirect URL:", finalRedirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          redirectTo: finalRedirectUrl,
          queryParams: {
            prompt: 'consent'  // Force consent screen to appear
          }
        }
      });

      console.log("4. Authentication response:", { data, error });

      if (error) {
        console.error('5. Azure OAuth error:', {
          message: error.message,
          status: error.status,
          stack: error.stack
        });
        
        setShowError(true);
        setErrorMessage(error.message || "Failed to connect to Microsoft");
        toast.error("Failed to connect to Microsoft. Please try again.");
        throw error;
      }

      if (!data) {
        console.error('6. No response data received');
        setShowError(true);
        setErrorMessage('No response received from Microsoft');
        toast.error('No response received from Microsoft. Please try again.');
        throw new Error('No OAuth response data');
      }

      if (data.url) {
        console.log("7. Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        console.error('8. No redirect URL in response');
        setShowError(true);
        setErrorMessage('Invalid response from authentication service');
        toast.error('Authentication configuration error. Please try again later.');
      }
      
    } catch (error) {
      console.error('9. Error linking Microsoft account:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setShowError(true);
      setErrorMessage(error.message || "Connection error occurred");
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
            {errorMessage || "Unable to connect to Microsoft. Please make sure you have a valid Microsoft account and try again."}
            {errorMessage.includes("refused to connect") && " This might be due to browser security settings or network connectivity issues."}
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