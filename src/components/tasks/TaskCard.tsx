import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TaskCardContent } from "./TaskCardContent";
import { TaskCardDialog } from "./TaskCardDialog";

interface TaskCardProps {
  task: Task;
  onViewDetails: (task: Task) => void;
}

export const TaskCard = ({ task, onViewDetails }: TaskCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: Partial<Task>) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updatedTask)
        .eq("id", task.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Uppgift uppdaterad",
        description: "Uppgiften har uppdaterats.",
      });
      setShowDetails(false);
      setIsEditing(false);
      setIsCompleting(false);
    },
    onError: (error) => {
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte uppdatera uppgiften. Försök igen.",
        variant: "destructive",
      });
      console.error("Error updating task:", error);
    },
  });

  const handleMarkAsCompleted = () => {
    setIsCompleting(true);
    updateTaskMutation.mutate({ status: "klar" });
  };

  const handleUpdateTask = (data: any) => {
    updateTaskMutation.mutate(data);
  };

  return (
    <>
      <Card 
        className={`hover:bg-muted/50 transition-all duration-300 ${
          isCompleting ? 'scale-95 opacity-50 bg-green-50 dark:bg-green-950/10' : ''
        }`}
      >
        <CardContent className="pt-6">
          <TaskCardContent
            task={task}
            onViewDetails={() => setShowDetails(true)}
            isCompleting={isCompleting}
          />
        </CardContent>
      </Card>

      <TaskCardDialog
        task={task}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancelEdit={() => setIsEditing(false)}
        onUpdate={handleUpdateTask}
        onComplete={handleMarkAsCompleted}
        isCompleting={isCompleting}
      />
    </>
  );
};