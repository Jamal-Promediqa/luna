import { useState } from "react";
import { TasksNavigation } from "@/components/tasks/TasksNavigation";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskActions } from "@/components/tasks/TaskActions";
import { useTasks } from "@/hooks/useTasks";
import { useTaskMutations } from "@/hooks/useTaskMutations";
import { Task, TaskFormValues } from "@/types/task";

const Tasks = () => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const { data: tasks = [], isLoading, error } = useTasks();
  const { addTaskMutation, addTestTasksMutation } = useTaskMutations();

  const handleSubmit = (data: TaskFormValues) => {
    addTaskMutation.mutate(data);
    setOpen(false);
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
        <TaskActions
          onAddTask={handleSubmit}
          onAddTestTasks={() => addTestTasksMutation.mutate()}
          isDialogOpen={open}
          setIsDialogOpen={setOpen}
        />
      </div>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default Tasks;