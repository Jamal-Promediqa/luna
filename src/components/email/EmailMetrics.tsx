import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

interface MetricCardProps {
  label: string;
  value: number;
  isLoading?: boolean;
}

const MetricCard = ({ label, value, isLoading = false }: MetricCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">
        {isLoading ? "-" : value}
      </div>
    </CardContent>
  </Card>
);

export const EmailMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['email-metrics'],
    queryFn: async () => {
      try {
        console.log("Fetching email metrics...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("No user found");
          toast.error("Please log in to view email metrics");
          throw new Error('No user found');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get total emails
        const { data: totalEmails, error: totalError } = await supabase
          .from('outlook_emails')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'inbox');

        if (totalError) {
          console.error("Error fetching total emails:", totalError);
          throw totalError;
        }

        // Get unread emails
        const { data: unreadEmails, error: unreadError } = await supabase
          .from('outlook_emails')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .eq('status', 'inbox');

        if (unreadError) {
          console.error("Error fetching unread emails:", unreadError);
          throw unreadError;
        }

        // Get emails received today
        const { data: todayEmails, error: todayError } = await supabase
          .from('outlook_emails')
          .select('id')
          .eq('user_id', user.id)
          .gte('received_at', format(today, 'yyyy-MM-dd'))
          .eq('status', 'inbox');

        if (todayError) {
          console.error("Error fetching today's emails:", todayError);
          throw todayError;
        }

        // Get archived emails
        const { data: archivedEmails, error: archivedError } = await supabase
          .from('outlook_emails')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'archived');

        if (archivedError) {
          console.error("Error fetching archived emails:", archivedError);
          throw archivedError;
        }

        console.log("Email metrics fetched successfully");
        return {
          total: totalEmails?.length || 0,
          unread: unreadEmails?.length || 0,
          today: todayEmails?.length || 0,
          archived: archivedEmails?.length || 0,
        };
      } catch (error) {
        console.error("Error in email metrics query:", error);
        toast.error("Could not fetch email metrics");
        throw error;
      }
    },
    retry: 1,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard 
        label="Totala e-post" 
        value={metrics?.total || 0} 
        isLoading={isLoading} 
      />
      <MetricCard 
        label="Olästa" 
        value={metrics?.unread || 0} 
        isLoading={isLoading} 
      />
      <MetricCard 
        label="Skickade idag" 
        value={metrics?.today || 0} 
        isLoading={isLoading} 
      />
      <MetricCard 
        label="Arkiverade" 
        value={metrics?.archived || 0} 
        isLoading={isLoading} 
      />
    </div>
  );
};