import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskFormValues } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export const useTaskMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
          user_id: user.user.id
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
          user_id: user.user.id
        },
        {
          title: "Överskriden uppgift 2",
          description: "Detta är en annan testuppgift som är försenad",
          status: "pending",
          due_date: twoDaysAgo.toISOString(),
          assigned_to: "Test User",
          user_id: user.user.id
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

  return {
    addTaskMutation,
    addTestTasksMutation,
  };
};