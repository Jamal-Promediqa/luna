import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CallHistoryProps {
  callRecords: any[];
}

export const CallHistory = ({ callRecords }: CallHistoryProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          status: 'väntar',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Uppgift skapad",
        description: "En ny uppgift har lagts till från samtalshistoriken.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skapa uppgiften. Försök igen.",
        variant: "destructive",
      });
      console.error("Error creating task:", error);
    },
  });

  const handleCreateTask = (actionItem: string) => {
    createTaskMutation.mutate({
      title: actionItem,
      description: "Skapad från samtalshistorik"
    });
  };

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {callRecords.map((record) => (
          <div
            key={record.id}
            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">{record.contact_name}</div>
                <div className="text-sm text-muted-foreground">
                  {record.contact_phone} • {format(new Date(record.created_at), 'dd MMM yyyy HH:mm')}
                </div>
              </div>
            </div>
            {record.summary && (
              <div className="mt-4 space-y-4">
                <div className="text-sm whitespace-pre-line bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Sammanfattning:</h4>
                  {record.summary}
                </div>
                {record.action_plan && (
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-sm">Föreslagna åtgärder:</h4>
                    <ul className="space-y-2">
                      {record.action_plan.split('\n').filter(Boolean).map((action: string, index: number) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                          <span>{action}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCreateTask(action)}
                          >
                            Skapa uppgift
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {callRecords.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
            Inga tidigare samtal att visa
          </div>
        )}
      </div>
    </ScrollArea>
  );
};