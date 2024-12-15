import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MicrosoftAccountCard } from "./MicrosoftAccountCard";

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

export const MicrosoftAuth = () => {
  const [isLinking, setIsLinking] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    const checkMicrosoftStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
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
      
      const codeVerifier = generateCodeVerifier();
      console.log("Generated code verifier:", codeVerifier);
      
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      console.log("Generated code challenge:", codeChallenge);
      
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
            access_type: 'offline'
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

  const handleMicrosoftUnlink = async () => {
    try {
      // Instead of trying to unlink the identity, we'll sign out completely
      // This will remove all sessions and connections
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to disconnect Microsoft account');
        return;
      }

      setIsLinked(false);
      toast.success('Microsoft account disconnected successfully');
      
      // Refresh the page to update the UI state
      window.location.reload();
    } catch (error) {
      console.error('Error during Microsoft account disconnect:', error);
      toast.error('Failed to disconnect Microsoft account');
    }
  };

  return (
    <MicrosoftAccountCard
      isLinked={isLinked}
      showError={showError}
      errorMessage={errorMessage}
      isLinking={isLinking}
      onLink={handleMicrosoftLink}
      onUnlink={handleMicrosoftUnlink}
    />
  );
};
