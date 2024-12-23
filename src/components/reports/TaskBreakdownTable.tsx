import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface TaskBreakdownTableProps {
  tasks: Task[];
}

export const TaskBreakdownTable = ({ tasks }: TaskBreakdownTableProps) => {
  return (
    <div className="rounded-lg border bg-white">
      <div className="p-4 border-b bg-green-50">
        <h2 className="text-lg font-semibold text-green-800">Slutförda uppgifter denna vecka</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titel</TableHead>
            <TableHead>Tilldelad till</TableHead>
            <TableHead>Slutförd den</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-green-50/50">
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>{task.assigned_to || "-"}</TableCell>
              <TableCell>
                {task.updated_at
                  ? format(new Date(task.updated_at), "d MMMM yyyy", { locale: sv })
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                Inga slutförda uppgifter denna vecka
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};