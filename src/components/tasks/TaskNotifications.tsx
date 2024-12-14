import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Task } from "@/types/task";

export const TaskNotifications = () => {
  useEffect(() => {
    const channel = supabase
      .channel('public:tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          const newTask = payload.new as Task;
          const oldTask = payload.old as Task;

          if (payload.eventType === 'INSERT') {
            toast.success("Ny uppgift skapad", {
              description: `"${newTask.title}" har lagts till`,
            });
          } else if (payload.eventType === 'UPDATE') {
            if (newTask.status === 'klar' && oldTask.status !== 'klar') {
              toast.success("Uppgift slutförd", {
                description: `"${newTask.title}" har markerats som klar`,
              });
            } else {
              toast.info("Uppgift uppdaterad", {
                description: `"${newTask.title}" har uppdaterats`,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            toast.info("Uppgift borttagen", {
              description: `"${oldTask.title}" har tagits bort`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
};