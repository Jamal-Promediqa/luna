import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEmailAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        console.log("User session found:", session.user.id);
        setUserId(session.user.id);
        if (session.provider_token) {
          console.log("Provider token found:", session.provider_token);
          setAccessToken(session.provider_token);
          setIsConnected(true);
        } else {
          console.log("No provider token found - user needs to connect Microsoft account");
          setIsConnected(false);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN') {
        setUserId(session?.user?.id ?? null);
        if (session?.provider_token) {
          console.log("Provider token received on sign in");
          setAccessToken(session.provider_token);
          setIsConnected(true);
          toast.success("Successfully connected to Microsoft account");
        }
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setAccessToken(null);
        setIsConnected(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { userId, isConnected, accessToken };
};