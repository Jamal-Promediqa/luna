import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CheckHistory {
  consultant: string;
  checkType: string;
  status: string;
  date: string;
  action: string;
  indicator: "default" | "secondary";
}

interface ChecksTableProps {
  checksHistory: CheckHistory[];
}

export const ChecksTable = ({ checksHistory }: ChecksTableProps) => {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Konsult</TableHead>
            <TableHead>Kontrolltyp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Åtgärd</TableHead>
            <TableHead>Indikator</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checksHistory.map((check, i) => (
            <TableRow key={i}>
              <TableCell>{check.consultant}</TableCell>
              <TableCell>{check.checkType}</TableCell>
              <TableCell>{check.status}</TableCell>
              <TableCell>{check.date}</TableCell>
              <TableCell>{check.action}</TableCell>
              <TableCell>
                <Badge variant={check.indicator}>{check.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};