import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Consultant } from "@/types/consultant";

interface ConsultantTableProps {
  consultants: Consultant[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onConsultantClick: (consultant: Consultant) => void;
}

export function ConsultantTable({
  consultants,
  sortField,
  sortDirection,
  onSort,
  onConsultantClick,
}: ConsultantTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onSort("name")}>Namn {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead onClick={() => onSort("specialty")}>Specialitet {sortField === "specialty" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead onClick={() => onSort("location")}>Plats {sortField === "location" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead onClick={() => onSort("email")}>E-post {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}</TableHead>
            <TableHead>Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultants.map((consultant) => (
            <TableRow key={consultant.id} onClick={() => onConsultantClick(consultant)}>
              <TableCell>{consultant.name}</TableCell>
              <TableCell>{consultant.specialty}</TableCell>
              <TableCell>{consultant.location}</TableCell>
              <TableCell>{consultant.email}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onConsultantClick(consultant);
                  }}
                >
                  Visa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}