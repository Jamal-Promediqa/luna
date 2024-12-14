import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const NotificationDropdown = () => {
  const navigate = useNavigate();

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const overdueCount = tasks?.filter(task => {
    if (!task.due_date) return false;
    return new Date(task.due_date) < new Date() && task.status !== 'klar';
  }).length || 0;

  const getStatusIcon = (status: string) => {
    return status === 'completed' 
      ? <span className="h-2 w-2 rounded-full bg-green-500" />
      : <span className="h-2 w-2 rounded-full bg-yellow-500" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {overdueCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {overdueCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium">Notifikationer</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/notifications')}
            className="text-xs"
          >
            Visa alla
          </Button>
        </div>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <DropdownMenuItem key={task.id} className="flex items-start gap-2 p-3">
              <div className="mt-1.5">{getStatusIcon(task.status)}</div>
              <div className="flex-1">
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(task.created_at).toLocaleDateString('sv-SE', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Inga notifikationer att visa
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};