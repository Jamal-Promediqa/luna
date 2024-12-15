import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Function to generate random string for code verifier
const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const verifier = Array.from(array, byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
  // RFC 7636 requires the code verifier to be between 43 and 128 characters
  return verifier.padEnd(43, '0').substring(0, 128);
};

// Function to generate code challenge from verifier
const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  // Convert to base64URL format as required by OAuth 2.0
  return hashBase64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const EmailLinkAccount = () => {
  const [isLinking, setIsLinking] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    const checkMicrosoftStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (session?.provider_token && session?.user?.app_metadata?.provider === 'azure') {
          console.log("Microsoft account is connected:", {
            provider: session.user.app_metadata.provider,
            token: session.provider_token
          });
          setIsLinked(true);
          toast.success("Microsoft account connected!");
        } else {
          console.log("Microsoft account is not connected:", {
            provider: session?.user?.app_metadata?.provider,
            hasToken: !!session?.provider_token
          });
          setIsLinked(false);
        }
      } catch (error) {
        console.error("Error checking Microsoft status:", error);
      }
    };

    checkMicrosoftStatus();
  }, []);

  const handleMicrosoftLink = async () => {
    if (isLinked) {
      toast.info("Microsoft account is already connected!");
      return;
    }

    setIsLinking(true);
    setShowError(false);
    setErrorMessage("");
    
    try {
      console.log("1. Starting Microsoft authentication...");
      
      // Generate PKCE values
      const codeVerifier = generateCodeVerifier();
      console.log("2. Generated code verifier:", codeVerifier);
      
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      console.log("3. Generated code challenge:", codeChallenge);
      
      // Store code verifier in session storage for the callback
      sessionStorage.setItem('pkce_code_verifier', codeVerifier);
      console.log("4. Stored code verifier in session storage");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          queryParams: {
            prompt: 'consent select_account',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            domain_hint: 'organizations',
            response_mode: 'query',
            amr_values: 'mfa'
          }
        }
      });

      console.log("5. Authentication response:", { data, error });

      if (error) {
        console.error('6. Azure OAuth error:', error);
        let userMessage = "Failed to connect to Microsoft. ";
        
        if (error.message.includes("AADSTS9002325")) {
          userMessage += "There was an issue with the PKCE configuration. Please try again.";
        } else if (error.message.includes("redirect_uri_mismatch")) {
          userMessage += "There's a configuration issue with the redirect URL. Please contact support.";
        } else if (error.message.includes("refused to connect")) {
          userMessage += "Please check if you have allowed pop-ups for this site and try again.";
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
      console.error('10. Error linking Microsoft account:', error);
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
        {isLinked 
          ? "Your Microsoft account is connected to Luna"
          : "Link your Microsoft account to view and send emails in Luna"
        }
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
        disabled={isLinking || isLinked}
        className="w-full bg-[#107C10] hover:bg-[#0B5C0B] text-white"
      >
        {isLinked 
          ? 'Microsoft Account Connected' 
          : isLinking 
            ? 'Connecting...' 
            : 'Connect Microsoft Account'
        }
      </Button>
    </div>
  );
};