import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMicrosoftAuthConfig } from "@/utils/microsoftAuth";

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
      
      // Use the production URL in production, fallback to localhost in development
      const isProd = window.location.hostname !== 'localhost';
      const baseUrl = isProd ? "https://luna-umber.vercel.app" : "http://localhost:5173";
      const redirectUrl = `${baseUrl}/dashboard`;
      
      console.log("2. Base URL:", baseUrl);
      console.log("3. Redirect URL:", redirectUrl);

      const authConfig = getMicrosoftAuthConfig(redirectUrl);
      console.log("4. Auth configuration:", authConfig);

      const { data, error } = await supabase.auth.signInWithOAuth({
        ...authConfig,
        options: {
          ...authConfig.options,
          redirectTo: redirectUrl,
          skipBrowserRedirect: false
        }
      });

      console.log("5. Authentication response:", { data, error });

      if (error) {
        console.error('6. Azure OAuth error:', {
          message: error.message,
          status: error.status,
          stack: error.stack
        });
        
        let userMessage = "Failed to connect to Microsoft. ";
        
        if (error.message.includes("refused to connect")) {
          userMessage += "Please check if you have allowed pop-ups for this site and try again.";
        } else if (error.message.includes("redirect_uri_mismatch")) {
          userMessage += "There's a configuration issue with the redirect URL. Please contact support.";
        } else if (error.message.includes("invalid_scope")) {
          userMessage += "There's a permissions configuration issue. Please contact support.";
        } else {
          userMessage += "Please try again or contact support if the issue persists.";
        }
        
        setShowError(true);
        setErrorMessage(userMessage);
        toast.error(userMessage);
        throw error;
      }

      if (!data) {
        console.error('7. No response data received');
        setShowError(true);
        setErrorMessage('No response received from Microsoft. Please try again.');
        toast.error('Authentication failed. Please try again.');
        throw new Error('No OAuth response data');
      }

      if (data.url) {
        console.log("8. Redirecting to:", data.url);
        window.location.href = data.url;
      } else {
        console.error('9. No redirect URL in response');
        setShowError(true);
        setErrorMessage('Invalid response from authentication service');
        toast.error('Authentication configuration error. Please try again later.');
      }
      
    } catch (error) {
      console.error('10. Error linking Microsoft account:', {
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
        Link your Microsoft account to view and send emails in Luna
      </p>
      {showError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            {errorMessage}
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