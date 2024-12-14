import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { Task } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
  onViewDetails: (task: Task) => void;
}

const getVariantForStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "brådskande":
      return "destructive";
    case "pågående":
      return "default";
    case "väntar":
      return "secondary";
    case "klar":
      return "outline";
    default:
      return "default";
  }
};

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
          isCompleting ? 'scale-95 opacity-50' : ''
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{task.title}</h3>
                <Badge 
                  variant={getVariantForStatus(task.status)}
                  className={task.status === "klar" ? "animate-fade-in" : ""}
                >
                  {task.status}
                </Badge>
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              )}
              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                {task.due_date && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      Förfaller: {new Date(task.due_date).toLocaleString("sv-SE")}
                    </span>
                  </div>
                )}
                {task.assigned_to && (
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span>Tilldelad: {task.assigned_to}</span>
                  </div>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDetails(true)}>
              Visa detaljer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[425px]">
          {isEditing ? (
            <>
              <DialogHeader>
                <DialogTitle>Redigera uppgift</DialogTitle>
              </DialogHeader>
              <TaskForm 
                onSubmit={handleUpdateTask} 
                onCancel={() => setIsEditing(false)}
                defaultValues={task}
              />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {task.title}
                  <Badge 
                    variant={getVariantForStatus(task.status)}
                    className={task.status === "klar" ? "animate-fade-in" : ""}
                  >
                    {task.status}
                  </Badge>
                </DialogTitle>
                {task.description && (
                  <DialogDescription className="text-foreground">
                    {task.description}
                  </DialogDescription>
                )}
              </DialogHeader>
              <div className="space-y-4">
                {task.due_date && (
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Förfaller: {new Date(task.due_date).toLocaleString("sv-SE")}</span>
                  </div>
                )}
                {task.assigned_to && (
                  <div className="flex items-center text-sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span>Tilldelad: {task.assigned_to}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="flex justify-between sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Redigera
                  </Button>
                  {task.status !== "klar" && (
                    <Button 
                      onClick={handleMarkAsCompleted}
                      className="relative overflow-hidden group"
                    >
                      <span className={`inline-block transition-transform duration-300 ${
                        isCompleting ? 'translate-y-full' : ''
                      }`}>
                        Markera som klar
                      </span>
                      <CheckCircle 
                        className={`absolute inset-0 m-auto transition-all duration-300 ${
                          isCompleting ? 'scale-150 opacity-100' : 'scale-50 opacity-0'
                        }`}
                      />
                    </Button>
                  )}
                </div>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Stäng
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};