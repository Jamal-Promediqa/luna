import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { getVariantForStatus } from "@/utils/taskUtils";

interface TaskCardContentProps {
  task: Task;
  onViewDetails: () => void;
  isCompleting: boolean;
}

export const TaskCardContent = ({ task, onViewDetails, isCompleting }: TaskCardContentProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">{task.title}</h3>
          <Badge 
            variant={getVariantForStatus(task.status)}
            className={task.status === "klar" ? "animate-fade-in bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100" : ""}
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
      <Button variant="ghost" size="sm" onClick={onViewDetails}>
        Visa detaljer
      </Button>
    </div>
  );
};