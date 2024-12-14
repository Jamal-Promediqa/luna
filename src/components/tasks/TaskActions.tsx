import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { TaskFormValues } from "@/types/task";

interface TaskActionsProps {
  onAddTask: (data: TaskFormValues) => void;
  onAddTestTasks: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const TaskActions = ({
  onAddTask,
  onAddTestTasks,
  isDialogOpen,
  setIsDialogOpen,
}: TaskActionsProps) => {
  return (
    <div className="flex gap-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
          <TaskForm onSubmit={onAddTask} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={onAddTestTasks}>
        <Calendar className="mr-2 h-4 w-4" />
        Lägg till testuppgifter
      </Button>
    </div>
  );
};