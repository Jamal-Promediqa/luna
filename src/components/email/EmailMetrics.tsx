import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get total emails
      const { data: totalEmails, error: totalError } = await supabase
        .from('outlook_emails')
        .select('id')
        .eq('user_id', user.id);

      if (totalError) throw totalError;

      // Get unread emails
      const { data: unreadEmails, error: unreadError } = await supabase
        .from('outlook_emails')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (unreadError) throw unreadError;

      // Get emails sent today
      const { data: todayEmails, error: todayError } = await supabase
        .from('outlook_emails')
        .select('id')
        .eq('user_id', user.id)
        .gte('received_at', format(today, 'yyyy-MM-dd'));

      if (todayError) throw todayError;

      // Get archived emails (we'll need to add this status to the table)
      const { data: archivedEmails, error: archivedError } = await supabase
        .from('outlook_emails')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'archived');

      if (archivedError) throw archivedError;

      return {
        total: totalEmails?.length || 0,
        unread: unreadEmails?.length || 0,
        today: todayEmails?.length || 0,
        archived: archivedEmails?.length || 0,
      };
    }
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