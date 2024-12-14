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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Ett fel uppstod vid utloggning');
        return;
      }
      
      // Clear all React Query caches
      queryClient.clear();
      
      toast.success('Du har loggats ut');
      navigate('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
      toast.error('Ett fel uppstod vid utloggning');
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