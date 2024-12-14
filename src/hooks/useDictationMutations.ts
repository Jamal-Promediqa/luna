import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export const useDictationMutations = () => {
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title,
          status: 'väntar',
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Uppgift skapad från diktering");
    },
  });

  const saveCallRecordMutation = useMutation({
    mutationFn: async ({ transcription, actionPlan, audioUrl }: { transcription: string, actionPlan: string, audioUrl: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('call_records')
        .insert([{
          contact_name: "Dashboard Dictation",
          contact_phone: "",
          audio_url: audioUrl,
          summary: transcription,
          action_plan: actionPlan,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-records'] });
    },
  });

  return {
    createTaskMutation,
    saveCallRecordMutation,
  };
};