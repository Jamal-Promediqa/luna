import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error checking session:', sessionError);
        // Clean up and redirect on session error
        queryClient.clear();
        localStorage.clear();
        navigate('/login');
        return;
      }

      // If no active session, just clean up and redirect
      if (!session) {
        queryClient.clear();
        localStorage.clear();
        navigate('/login');
        return;
      }

      // Try to sign out locally first
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'local'
      });

      // Clean up client state regardless of sign out success
      queryClient.clear();
      localStorage.clear();

      if (signOutError) {
        console.error('Error signing out:', signOutError);
        // Just redirect on error since we've already cleaned up
        navigate('/login');
        return;
      }
      
      toast.success('Du har loggats ut');
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Ensure cleanup happens even on unexpected errors
      queryClient.clear();
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleSignOut}
      title="Logga ut"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
};