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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, just clear everything and redirect
        queryClient.clear();
        localStorage.clear();
        navigate('/login');
        return;
      }

      // If we have a session, try to sign out
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Use local scope instead of global to prevent the 403 error
      });

      if (error) {
        console.error('Error signing out:', error);
        // Even if there's an error, we should clean up the client state
        queryClient.clear();
        localStorage.clear();
        navigate('/login');
        return;
      }
      
      // Clear all React Query caches and local storage
      queryClient.clear();
      localStorage.clear();
      
      toast.success('Du har loggats ut');
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, we should clean up the client state
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