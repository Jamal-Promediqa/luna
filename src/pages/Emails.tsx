import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmailDashboard } from "@/components/dashboard/EmailDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { useQuery } from "@tanstack/react-query";

const Emails = () => {
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

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <DashboardHeader profile={profile} />
      <DashboardNavigation navigate={navigate} />
      <EmailDashboard />
    </div>
  );
};

export default Emails;