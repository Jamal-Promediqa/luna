import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmailDashboard } from "@/components/dashboard/EmailDashboard";

const Emails = () => {
  const navigate = useNavigate();

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
      <EmailDashboard />
    </div>
  );
};

export default Emails;