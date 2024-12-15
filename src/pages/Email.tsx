import { useNavigate } from "react-router-dom";
import { EmailContainer } from "@/components/email/EmailContainer";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { UserWelcome } from "@/components/dashboard/header/UserWelcome";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function EmailDashboard() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return {
            given_name: user.email?.split('@')[0] || 'Användare',
            full_name: user.email || 'Användare'
          };
        }
        
        return data || {
          given_name: user.email?.split('@')[0] || 'Användare',
          full_name: user.email || 'Användare'
        };
      } catch (error) {
        console.error('Error in profile query:', error);
        return null;
      }
    },
    retry: false
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        <div className="mb-8">
          <UserWelcome givenName={profile?.given_name || 'Användare'} />
        </div>
        <DashboardNavigation navigate={navigate} />
        <EmailContainer />
      </div>
    </div>
  );
}