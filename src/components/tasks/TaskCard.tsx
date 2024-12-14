import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { Task } from "@/types/task";

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
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{task.title}</h3>
              <Badge variant={getVariantForStatus(task.status)}>{task.status}</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              {task.due_date && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Förfaller: {new Date(task.due_date).toLocaleDateString("sv-SE")}</span>
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
          <Button variant="ghost" size="sm" onClick={() => onViewDetails(task)}>
            Visa detaljer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};