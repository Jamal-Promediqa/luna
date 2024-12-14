import { useState } from "react";
import { Calendar, Plus } from "lucide-react";
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

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq('user_id', user.user.id)
        .neq('status', 'klar') // Filter out completed tasks
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
      return (data || []) as Task[];
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: TaskFormValues) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("tasks")
        .insert([{
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          due_date: newTask.due_date,
          assigned_to: newTask.assigned_to,
          user_id: user.user.id // Add user_id here
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
      console.error("Error adding task:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skapa uppgiften. Försök igen.",
        variant: "destructive",
      });
    },
  });

  const addTestTasksMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("No user found");

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const testTasks = [
        {
          title: "Överskriden uppgift 1",
          description: "Detta är en testuppgift som är försenad",
          status: "pending",
          due_date: yesterday.toISOString(),
          assigned_to: "Test User",
          user_id: user.user.id // Add user_id here
        },
        {
          title: "Överskriden uppgift 2",
          description: "Detta är en annan testuppgift som är försenad",
          status: "pending",
          due_date: twoDaysAgo.toISOString(),
          assigned_to: "Test User",
          user_id: user.user.id // Add user_id here
        }
      ];

      const { data, error } = await supabase
        .from("tasks")
        .insert(testTasks)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Testuppgifter skapade",
        description: "Testuppgifter med förfallna datum har lagts till.",
      });
    },
    onError: (error) => {
      console.error("Error adding test tasks:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skapa testuppgifterna. Försök igen.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: TaskFormValues) => {
    addTaskMutation.mutate(data);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
  };

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-destructive">
        Ett fel uppstod vid hämtning av uppgifter. Försök igen senare.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <TasksNavigation />

      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
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

          <Button 
            variant="outline"
            onClick={() => addTestTasksMutation.mutate()}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Lägg till testuppgifter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div>Laddar uppgifter...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Inga uppgifter att visa
          </div>
        ) : (
          tasks.map((task) => (
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