import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bell, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Notifications = () => {
  const navigate = useNavigate();

  const { data: tasks } = useQuery({
    queryKey: ['tasks-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <Clock className="h-5 w-5 text-yellow-500" />
    );
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? 'Slutförd' : 'Pågående';
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Notifikationer</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Senaste aktiviteter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors animate-fade-in"
            >
              <div className="flex items-center justify-center">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {getStatusText(task.status)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {new Date(task.created_at).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {task.description && (
                  <div className="mt-2 text-sm text-muted-foreground/90 bg-muted/30 p-2 rounded-md">
                    {task.description}
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!tasks || tasks.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              Inga notifikationer att visa
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;