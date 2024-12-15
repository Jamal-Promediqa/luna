import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEmailAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          console.log("User session found:", session.user.id);
          setUserId(session.user.id);
          
          if (session.provider_token) {
            console.log("Provider token found");
            setAccessToken(session.provider_token);
            setIsConnected(true);
          } else {
            console.log("No provider token found - Microsoft account not connected");
            setIsConnected(false);
          }
        } else {
          console.log("No session found");
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Could not check authentication status");
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      console.log("Session provider token:", !!session?.provider_token);
      
      if (event === 'SIGNED_IN') {
        setUserId(session?.user?.id ?? null);
        if (session?.provider_token) {
          console.log("Provider token received on sign in");
          setAccessToken(session.provider_token);
          setIsConnected(true);
          toast.success("Successfully connected to Microsoft account");
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out - clearing auth state");
        setUserId(null);
        setAccessToken(null);
        setIsConnected(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, []);

  return { userId, isConnected, accessToken };
};