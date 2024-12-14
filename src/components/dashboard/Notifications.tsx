import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export const Notifications = () => {
  const { data: tasks } = useQuery({
    queryKey: ['dashboard_notifications_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .neq('status', 'klar')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifikationer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="flex gap-3 items-start">
              <div className="text-muted-foreground mt-0.5">
                {task.status === 'pågående' ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(task.created_at).toLocaleString('sv-SE', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground">
            Inga notifikationer att visa
          </div>
        )}
      </CardContent>
    </Card>
  );
};