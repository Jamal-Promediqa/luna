import { Task } from "@/types/task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { getVariantForStatus } from "@/utils/taskUtils";

interface TaskCardDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (data: any) => void;
  onComplete: () => void;
  isCompleting: boolean;
}

export const TaskCardDialog = ({
  task,
  isOpen,
  onClose,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onComplete,
  isCompleting,
}: TaskCardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle>Redigera uppgift</DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSubmit={onUpdate} 
              onCancel={onCancelEdit}
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
                  className={task.status === "klar" ? "animate-fade-in bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100" : ""}
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
                <Button variant="outline" onClick={onEdit}>
                  Redigera
                </Button>
                {task.status !== "klar" && (
                  <Button 
                    onClick={onComplete}
                    className="relative overflow-hidden group bg-green-500 hover:bg-green-600 text-white"
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
              <Button variant="outline" onClick={onClose}>
                Stäng
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};