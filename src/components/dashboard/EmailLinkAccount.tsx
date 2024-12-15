import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Function to generate random string for code verifier
const generateCodeVerifier = () => {
  const array = new Uint32Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

// Function to generate code challenge from verifier
const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashString = hashArray.map(byte => String.fromCharCode(byte)).join('');
  const base64 = btoa(hashString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return base64;
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
        
        // Check if user has Microsoft (Azure) identity
        const hasMicrosoftIdentity = session?.user?.identities?.some(
          identity => identity.provider === 'azure'
        );
        
        if (hasMicrosoftIdentity) {
          console.log("Microsoft account is connected");
          setIsLinked(true);
          toast.success("Microsoft account connected!");
        } else {
          console.log("Microsoft account is not connected");
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
      console.log("Starting Microsoft authentication...");
      
      // Generate PKCE values
      const codeVerifier = generateCodeVerifier();
      console.log("Generated code verifier:", codeVerifier);
      
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      console.log("Generated code challenge:", codeChallenge);
      
      // Store code verifier in session storage
      sessionStorage.setItem('pkce_code_verifier', codeVerifier);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email Mail.Read Mail.Send Mail.ReadWrite offline_access profile User.Read',
          queryParams: {
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            response_type: 'code',
            prompt: 'consent',
            access_type: 'offline'  // Request refresh token
          }
        }
      });

      console.log("Authentication response:", { data, error });

      if (error) {
        console.error('Azure OAuth error:', error);
        setShowError(true);
        setErrorMessage(error.message);
        toast.error(`Authentication failed: ${error.message}`);
        throw error;
      }

      if (!data?.url) {
        console.error('No redirect URL in response');
        setShowError(true);
        setErrorMessage('Invalid response from authentication service');
        toast.error('Authentication configuration error');
        throw new Error('No OAuth response URL');
      }

      // Redirect to Microsoft login
      console.log("Redirecting to:", data.url);
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Error linking Microsoft account:', error);
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