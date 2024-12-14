import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task, TaskFormValues } from "@/types/task";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TasksNavigation } from "@/components/tasks/TasksNavigation";

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: TaskFormValues) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{
          title: newTask.title,
          status: newTask.status,
          due_date: newTask.due_date,
          assigned_to: newTask.assigned_to
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Uppgift skapad",
        description: "Din nya uppgift har lagts till.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skapa uppgiften. Försök igen.",
        variant: "destructive",
      });
      console.error("Error adding task:", error);
    },
  });

  const handleSubmit = (data: TaskFormValues) => {
    addTaskMutation.mutate(data);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    // Implement view details functionality
    console.log("View details for task:", task);
  };

  return (
    <div className="container mx-auto p-8">
      <TasksNavigation />

      <div className="flex justify-between items-center mb-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Lägg till ny uppgift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lägg till ny uppgift</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div>Laddar uppgifter...</div>
        ) : (
          tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;