import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onViewDetails: (task: Task) => void;
}

export const TaskList = ({ tasks, isLoading, onViewDetails }: TaskListProps) => {
  if (isLoading) {
    return <div>Laddar uppgifter...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Inga uppgifter att visa
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};